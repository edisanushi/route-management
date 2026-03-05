using Microsoft.EntityFrameworkCore;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Entities;
using RouteManagement.Infrastructure.Data;

namespace RouteManagement.Infrastructure.Repositories
{
    public class BookingClassRepository(ApplicationDbContext context) : IBookingClassRepository
    {

        public async Task<IReadOnlyList<BookingClass>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.BookingClasses.OrderBy(bc => bc.Name)
                                               .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<BookingClass>> GetByIdsAsync(List<int> ids, CancellationToken cancellationToken)
        {
            return await context.BookingClasses.Where(bc => ids.Contains(bc.Id))
                                               .ToListAsync(cancellationToken);
        }
        
    }
}
