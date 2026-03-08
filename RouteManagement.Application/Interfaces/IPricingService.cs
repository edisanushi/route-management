using RouteManagement.Application.DTOs.Pricing;

namespace RouteManagement.Application.Interfaces
{
    public interface IPricingService
    {
        Task<List<AssignedSeasonRouteDto>> GetAssignedSeasonRoutesAsync(int tourOperatorId, CancellationToken cancellationToken);
        Task<PricingTableDto> GetPricingTableAsync(int operatorSeasonRouteId, string userId, bool isAdmin, CancellationToken cancellationToken);
        Task UpsertPricingAsync(int operatorSeasonRouteId, UpsertPricingDto dto, string userId, CancellationToken cancellationToken);
    }
}
