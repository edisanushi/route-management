
namespace RouteManagement.Application.Interfaces
{
    public interface IExcelExportService
    {
        Task<byte[]> ExportPricingAsync(int operatorSeasonRouteId, string connectionId, string userId, bool isAdmin, CancellationToken cancellationToken);
    }
}
