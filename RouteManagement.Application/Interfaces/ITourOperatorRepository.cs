using RouteManagement.Domain.Entities;

namespace RouteManagement.Application.Interfaces
{
    public interface ITourOperatorRepository
    {
        Task<TourOperator> CreateAsync(TourOperator tourOperator, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(string name, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(string name, int excludeId, CancellationToken cancellationToken);
        Task<IReadOnlyList<TourOperator>> GetAllAsync(CancellationToken cancellationToken);
        Task<IReadOnlyList<(TourOperator Operator, string? Email)>> GetAllWithEmailsAsync(CancellationToken cancellationToken);
        Task<TourOperator?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<TourOperator?> GetByUserIdAsync(string userId, CancellationToken cancellationToken);
        Task UpdateAsync(TourOperator tourOperator, CancellationToken cancellationToken);
    }
}
