using RouteManagement.Application.DTOs.Route;

namespace RouteManagement.Application.Interfaces
{
    public interface IRouteService
    {
        Task<IReadOnlyList<RouteDto>> GetAllAsync(CancellationToken cancellationToken);
        Task<RouteDto> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<RouteDto> CreateAsync(RouteFormDto dto, string createdBy, CancellationToken cancellationToken);
        Task<RouteDto> UpdateAsync(int id, RouteFormDto dto, string updatedBy, CancellationToken cancellationToken);
        Task DeleteAsync(int id, string deletedBy, CancellationToken cancellationToken);
    }
}
