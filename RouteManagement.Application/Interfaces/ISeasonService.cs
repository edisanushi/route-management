using RouteManagement.Application.DTOs.Season;

namespace RouteManagement.Application.Interfaces
{
    public interface ISeasonService
    {
        Task<SeasonDto> CreateAsync(SeasonFormDto dto, string createdBy, CancellationToken cancellationToken);
        Task<IReadOnlyList<SeasonDto>> GetAllAsync(CancellationToken cancellationToken);
        Task<SeasonDto> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<SeasonDto> UpdateAsync(int id, SeasonFormDto dto, string updatedBy, CancellationToken cancellationToken);
        Task DeleteAsync(int id, string deletedBy, CancellationToken cancellationToken);
    }
}
