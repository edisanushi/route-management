using RouteManagement.Application.DTOs.Season;

namespace RouteManagement.Application.Interfaces
{
    public interface ISeasonService
    {
        Task CreateAsync(SeasonFormDto dto, string createdBy, CancellationToken cancellationToken);
        Task<IReadOnlyList<SeasonDto>> GetAllAsync(CancellationToken cancellationToken);
    }
}
