using RouteManagement.Domain.Entities;

namespace RouteManagement.Application.Interfaces
{
    public interface IRouteRepository
    {
        Task<IReadOnlyList<Route>> GetAllAsync(CancellationToken cancellationToken);
        Task<Route?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<Route?> GetByIdForUpdateAsync(int id, CancellationToken cancellationToken);
        Task<Route> CreateAsync(Route route, CancellationToken cancellationToken);
        Task UpdateAsync(Route route, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(string origin, string destination, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(string origin, string destination, int excludeId, CancellationToken cancellationToken);
    }
}
