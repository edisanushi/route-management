using OfficeOpenXml;
using OfficeOpenXml.Style;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Entities;
using System.Drawing;

namespace RouteManagement.Infrastructure.Services
{
    public class ExcelExportService(
        IPricingRepository pricingRepository,
        ITourOperatorRepository tourOperatorRepository,
        IExportProgressService exportProgressService) : IExcelExportService
    {
        public async Task<byte[]> ExportPricingAsync(int operatorSeasonRouteId, string connectionId, string userId, bool isAdmin, CancellationToken cancellationToken)
        {
            await SendProgress(connectionId, 0, "Loading data...");

            var osr = await pricingRepository.GetOperatorSeasonRouteAsync(operatorSeasonRouteId, cancellationToken)
                ?? throw new KeyNotFoundException($"Assignment with id {operatorSeasonRouteId} was not found.");

            if (!isAdmin)
            {
                var tourOperator = await tourOperatorRepository.GetByUserIdAsync(userId, cancellationToken)
                    ?? throw new KeyNotFoundException("Tour operator not found.");
                if (osr.TourOperatorId != tourOperator.Id)
                    throw new UnauthorizedAccessException("You can only export your own pricing.");
            }

            var pricingRecords = await pricingRepository.GetByOperatorSeasonRouteAsync(operatorSeasonRouteId, cancellationToken);

            await SendProgress(connectionId, 20, "Building booking class data...");

            var bookingClassIds = osr.Route.RouteBookingClasses
                .Where(rbc => !rbc.IsDeleted)
                .Select(rbc => rbc.BookingClassId)
                .Intersect(osr.TourOperator.TourOperatorBookingClasses
                    .Where(tobc => !tobc.IsDeleted)
                    .Select(tobc => tobc.BookingClassId))
                .ToList();

            var bookingClassNames = osr.Route.RouteBookingClasses
                .Where(rbc => bookingClassIds.Contains(rbc.BookingClassId))
                .ToDictionary(rbc => rbc.BookingClassId, rbc => rbc.BookingClass?.Name ?? string.Empty);

            var seasonName = $"{osr.Season.SeasonType} {osr.Season.Year}";
            var routeName = $"{osr.Route.Origin} - {osr.Route.Destination}";

            await SendProgress(connectionId, 35, "Building Summary sheet...");

            ExcelPackage.License.SetNonCommercialOrganization("RouteManagement");
            using var package = new ExcelPackage();

            BuildSummarySheet(package, pricingRecords, bookingClassIds, bookingClassNames, seasonName, routeName);

            await SendProgress(connectionId, 50, "Building Detailed sheet...");

            await BuildDetailedSheetAsync(package, osr, pricingRecords, bookingClassIds, bookingClassNames, seasonName, routeName, connectionId);

            await SendProgress(connectionId, 100, "Done");

            return await package.GetAsByteArrayAsync();
        }

        private void BuildSummarySheet(
            ExcelPackage package,
            IEnumerable<Pricing> records,
            List<int> bookingClassIds,
            Dictionary<int, string> bookingClassNames,
            string seasonName,
            string routeName)
        {
            var ws = package.Workbook.Worksheets.Add("Summary");

            ws.Cells[1, 1].Value = "Route";
            ws.Cells[1, 2].Value = routeName;
            ws.Cells[2, 1].Value = "Season";
            ws.Cells[2, 2].Value = seasonName;

            StyleLabel(ws.Cells[1, 1]);
            StyleLabel(ws.Cells[2, 1]);

            int headerRow = 4;
            ws.Cells[headerRow, 1].Value = "Booking Class";
            ws.Cells[headerRow, 2].Value = "Total Days Priced";
            ws.Cells[headerRow, 3].Value = "Total Seats";
            ws.Cells[headerRow, 4].Value = "Min Price";
            ws.Cells[headerRow, 5].Value = "Max Price";
            ws.Cells[headerRow, 6].Value = "Avg Price";
            StyleHeader(ws.Cells[headerRow, 1, headerRow, 6]);

            int row = headerRow + 1;
            foreach (var bcId in bookingClassIds)
            {
                var bcRecords = records.Where(r => r.BookingClassId == bcId && r.Price > 0).ToList();
                ws.Cells[row, 1].Value = bookingClassNames.GetValueOrDefault(bcId);
                ws.Cells[row, 2].Value = bcRecords.Count;
                ws.Cells[row, 3].Value = bcRecords.Sum(r => r.SeatsRequested);
                ws.Cells[row, 4].Value = bcRecords.Any() ? bcRecords.Min(r => r.Price) : 0;
                ws.Cells[row, 5].Value = bcRecords.Any() ? bcRecords.Max(r => r.Price) : 0;
                ws.Cells[row, 6].Value = bcRecords.Any() ? Math.Round(bcRecords.Average(r => r.Price), 2) : 0;
                ws.Cells[row, 4, row, 6].Style.Numberformat.Format = "#,##0.00";
                row++;
            }

            ws.Cells[ws.Dimension.Address].AutoFitColumns();
        }

        private async Task BuildDetailedSheetAsync(
    ExcelPackage package,
    OperatorSeasonRoute osr,
    IEnumerable<Pricing> records,
    List<int> bookingClassIds,
    Dictionary<int, string> bookingClassNames,
    string seasonName,
    string routeName,
    string connectionId)
        {
            var ws = package.Workbook.Worksheets.Add("Detailed");

            ws.Cells[1, 1].Value = "Route";
            ws.Cells[1, 2].Value = routeName;
            ws.Cells[2, 1].Value = "Season";
            ws.Cells[2, 2].Value = seasonName;

            StyleLabel(ws.Cells[1, 1]);
            StyleLabel(ws.Cells[2, 1]);

            int headerRow = 4;
            ws.Cells[headerRow, 1].Value = "Date";
            ws.Cells[headerRow, 2].Value = "Day";
            ws.Cells[headerRow, 3].Value = "Booking Class";
            ws.Cells[headerRow, 4].Value = "Price";
            ws.Cells[headerRow, 5].Value = "Seats";
            StyleHeader(ws.Cells[headerRow, 1, headerRow, 5]);

            var lookup = records.ToDictionary(r => (r.Date.Date, r.BookingClassId));
            int row = headerRow + 1;
            var current = osr.Season.StartDate.Date;
            var end = osr.Season.EndDate.Date;
            int totalDays = (int)(end - current).TotalDays + 1;
            int dayIndex = 0;
            int lastReportedPercent = 50;

            while (current <= end)
            {
                foreach (var bcId in bookingClassIds)
                {
                    lookup.TryGetValue((current, bcId), out var record);
                    ws.Cells[row, 1].Value = current.ToString("dd/MM/yyyy");
                    ws.Cells[row, 2].Value = current.DayOfWeek.ToString();
                    ws.Cells[row, 3].Value = bookingClassNames.GetValueOrDefault(bcId);
                    ws.Cells[row, 4].Value = record?.Price ?? 0;
                    ws.Cells[row, 5].Value = record?.SeatsRequested ?? 0;
                    ws.Cells[row, 4].Style.Numberformat.Format = "#,##0.00";
                    row++;
                }

                dayIndex++;
                int percent = 50 + (int)((double)dayIndex / totalDays * 49);
                if (percent > lastReportedPercent)
                {
                    lastReportedPercent = percent;
                    await SendProgress(connectionId, percent, $"Building Detailed sheet... ({dayIndex}/{totalDays} days)");
                }

                current = current.AddDays(1);
            }

            ws.Cells[ws.Dimension.Address].AutoFitColumns();
        }

        private static void StyleHeader(ExcelRange range)
        {
            range.Style.Font.Bold = true;
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(13, 35, 71));
            range.Style.Font.Color.SetColor(Color.White);
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
        }

        private static void StyleLabel(ExcelRange range)
        {
            range.Style.Font.Bold = true;
            range.Style.Font.Color.SetColor(Color.FromArgb(13, 35, 71));
        }

        private async Task SendProgress(string connectionId, int percent, string message)
        {
            await exportProgressService.SendProgressAsync(connectionId, percent, message);
        }
    }
}