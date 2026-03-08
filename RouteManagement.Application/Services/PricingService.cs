using RouteManagement.Application.DTOs.Pricing;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Entities;
using RouteManagement.Domain.Extensions;

namespace RouteManagement.Application.Services
{
    public class PricingService(IPricingRepository pricingRepository, ITourOperatorRepository tourOperatorRepository) : IPricingService
    {
        public async Task<List<AssignedSeasonRouteDto>> GetAssignedSeasonRoutesAsync(int tourOperatorId, CancellationToken cancellationToken)
        {
            var records = await pricingRepository.GetAssignedSeasonRoutesAsync(tourOperatorId, cancellationToken);
            return records.Select(MapToAssignedSeasonRouteDto).ToList();
        }


        public async Task<PricingTableDto> GetPricingTableAsync(int operatorSeasonRouteId, string userId, bool isAdmin, CancellationToken cancellationToken)
        {
            var osr = await pricingRepository.GetOperatorSeasonRouteAsync(operatorSeasonRouteId, cancellationToken)
                      ?? throw new KeyNotFoundException($"Assignment with id {operatorSeasonRouteId} was not found.");

            if (!isAdmin)
            {
                var tourOperator = await tourOperatorRepository.GetByUserIdAsync(userId, cancellationToken)
                                   ?? throw new KeyNotFoundException("Tour operator not found.");

                if (osr.TourOperatorId != tourOperator.Id)
                    throw new UnauthorizedAccessException("You can only view your own pricing.");
            }

            var bookingClassIds = GetIntersectedBookingClassIds(osr);
            var bookingClassNames = osr.Route.RouteBookingClasses
                .Where(rbc => bookingClassIds.Contains(rbc.BookingClassId))
                .ToDictionary(rbc => rbc.BookingClassId, rbc => rbc.BookingClass?.Name ?? string.Empty);

            var existing = await pricingRepository.GetByOperatorSeasonRouteAsync(operatorSeasonRouteId, cancellationToken);
            var existingLookup = existing.ToDictionary(p => (p.Date.Date, p.BookingClassId));

            var rows = new List<PricingRowDto>();
            var current = osr.Season.StartDate.Date;
            var end = osr.Season.EndDate.Date;

            while (current <= end)
            {
                var row = new PricingRowDto
                {
                    Date = current,
                    DayOfWeek = current.ToWeekday().ToString(),
                    BookingClassPricings = bookingClassIds.Select(bcId =>
                    {
                        existingLookup.TryGetValue((current, bcId), out var record);
                        return new BookingClassPricingDto
                        {
                            BookingClassId = bcId,
                            BookingClassName = bookingClassNames.GetValueOrDefault(bcId, string.Empty),
                            Price = record?.Price ?? 0,
                            SeatsRequested = record?.SeatsRequested ?? 0
                        };
                    }).ToList()
                };
                rows.Add(row);
                current = current.AddDays(1);
            }

            return new PricingTableDto
            {
                Origin = osr.Route.Origin,
                Destination = osr.Route.Destination,
                SeasonName = $"{osr.Season.SeasonType} {osr.Season.Year}",
                Rows = rows
            };
        }
        

        public async Task UpsertPricingAsync(int operatorSeasonRouteId, UpsertPricingDto dto, string userId, CancellationToken cancellationToken)
        {
            var osr = await pricingRepository.GetOperatorSeasonRouteAsync(operatorSeasonRouteId, cancellationToken)
                      ?? throw new KeyNotFoundException($"Assignment with id {operatorSeasonRouteId} was not found.");

            var tourOperator = await tourOperatorRepository.GetByUserIdAsync(userId, cancellationToken)
                               ?? throw new KeyNotFoundException("Tour operator not found.");

            if (osr.TourOperatorId != tourOperator.Id)
                throw new UnauthorizedAccessException("You can only edit your own pricing.");

            var bookingClassIds = GetIntersectedBookingClassIds(osr);
            var existing = await pricingRepository.GetByOperatorSeasonRouteAsync(operatorSeasonRouteId, cancellationToken);
            var existingLookup = existing.ToDictionary(p => (p.Date.Date, p.BookingClassId));

            var toUpdate = new List<Pricing>();
            var toAdd = new List<Pricing>();

            foreach (var row in dto.Rows)
            {
                foreach (var bcPricing in row.BookingClassPricings.Where(bcp => bookingClassIds.Contains(bcp.BookingClassId)))
                {
                    var key = (row.Date.Date, bcPricing.BookingClassId);

                    if (existingLookup.TryGetValue(key, out var record))
                    {
                        record.Price = bcPricing.Price;
                        record.SeatsRequested = bcPricing.SeatsRequested;
                        record.UpdatedOn = DateTime.Now;
                        record.UpdatedBy = userId;
                        toUpdate.Add(record);
                    }
                    else
                    {
                        toAdd.Add(new Pricing
                        {
                            OperatorSeasonRouteId = operatorSeasonRouteId,
                            Date = row.Date.Date,
                            DayOfWeek = row.Date.ToWeekday(),
                            BookingClassId = bcPricing.BookingClassId,
                            Price = bcPricing.Price,
                            SeatsRequested = bcPricing.SeatsRequested,
                            CreatedOn = DateTime.Now,
                            CreatedBy = userId
                        });
                    }
                }
            }

            await pricingRepository.UpsertAsync(toUpdate, toAdd, cancellationToken);
        }


        private static List<int> GetIntersectedBookingClassIds(OperatorSeasonRoute osr)
        {
            var routeIds = osr.Route.RouteBookingClasses
                .Where(rbc => !rbc.IsDeleted)
                .Select(rbc => rbc.BookingClassId)
                .ToHashSet();

            var operatorIds = osr.TourOperator.TourOperatorBookingClasses
                .Where(tobc => !tobc.IsDeleted)
                .Select(tobc => tobc.BookingClassId)
                .ToHashSet();

            return routeIds.Intersect(operatorIds).OrderBy(id => id).ToList();
        }


        private static AssignedSeasonRouteDto MapToAssignedSeasonRouteDto(OperatorSeasonRoute osr)
        {
            return new AssignedSeasonRouteDto
            {
                OperatorSeasonRouteId = osr.Id,
                SeasonId = osr.SeasonId,
                SeasonName = $"{osr.Season.SeasonType} {osr.Season.Year}",
                RouteId = osr.RouteId,
                Origin = osr.Route.Origin,
                Destination = osr.Route.Destination,
                IsPriced = osr.Pricings.Any(p => !p.IsDeleted)
            };
        }

    }
}
