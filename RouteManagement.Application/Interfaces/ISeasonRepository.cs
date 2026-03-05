using RouteManagement.Domain.Entities;
using RouteManagement.Domain.Enums;

namespace RouteManagement.Application.Interfaces
{
    public interface ISeasonRepository
    {
        Task<bool> ExistsAsync(int year, SeasonType seasonType, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(int year, SeasonType seasonType, int excludeId, CancellationToken cancellationToken);
        Task<Season> CreateAsync(Season season, CancellationToken cancellationToken);
        Task<IReadOnlyList<Season>> GetAllAsync(CancellationToken cancellationToken);
        Task<Season?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task UpdateAsync(Season season, CancellationToken cancellationToken);
    }
}
