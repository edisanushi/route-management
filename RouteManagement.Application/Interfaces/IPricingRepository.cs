using RouteManagement.Domain.Entities;

namespace RouteManagement.Application.Interfaces
{
    public interface IPricingRepository
    {
        Task<List<OperatorSeasonRoute>> GetAssignedSeasonRoutesAsync(int tourOperatorId, CancellationToken cancellationToken);
        Task<OperatorSeasonRoute?> GetOperatorSeasonRouteAsync(int operatorSeasonRouteId, CancellationToken cancellationToken);
        Task<List<Pricing>> GetByOperatorSeasonRouteAsync(int operatorSeasonRouteId, CancellationToken cancellationToken);
        Task UpsertAsync(List<Pricing> toUpdate, List<Pricing> toAdd, CancellationToken cancellationToken);
    }
}
