using RouteManagement.Domain.Entities;
using RouteManagement.Domain.Enums;

namespace RouteManagement.Application.Interfaces
{
    public interface ISeasonRepository
    {
        Task<bool> ExistsAsync(int year, SeasonType seasonType, CancellationToken cancellationToken);
        Task<Season> CreateAsync(Season season, CancellationToken cancellationToken);
        Task<IReadOnlyList<Season>> GetAllAsync(CancellationToken cancellationToken);
    }
}
