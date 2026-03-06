using RouteManagement.Application.DTOs.TourOperator;

namespace RouteManagement.Application.Interfaces
{
    public interface ITourOperatorService
    {
        Task<TourOperatorDto> CreateAsync(TourOperatorFormDto dto, string createdBy, CancellationToken cancellationToken);
        Task<IReadOnlyList<TourOperatorDto>> GetAllAsync(CancellationToken cancellationToken);
        Task<TourOperatorDto> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<TourOperatorDto> GetByUserIdAsync(string userId, CancellationToken cancellationToken);
        Task<TourOperatorDto> UpdateAsync(int id, TourOperatorUpdateDto dto, string updatedBy, CancellationToken cancellationToken);
        Task<TourOperatorDto> UpdateProfileAsync(int id, TourOperatorProfileDto dto, string userId, CancellationToken cancellationToken);
        Task DeleteAsync(int id, string deletedBy, CancellationToken cancellationToken);
    }
}
