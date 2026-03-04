using RouteManagement.Domain.Entities;

namespace RouteManagement.Application.Interfaces
{
    public interface IBookingClassRepository
    {
        Task<IReadOnlyList<BookingClass>> GetAllAsync(CancellationToken cancellationToken);
        Task<IReadOnlyList<BookingClass>> GetByIdsAsync(List<int> ids, CancellationToken cancellationToken);
    }
}
