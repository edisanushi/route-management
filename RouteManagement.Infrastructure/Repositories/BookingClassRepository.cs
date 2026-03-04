using Microsoft.EntityFrameworkCore;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Entities;
using RouteManagement.Infrastructure.Data;

namespace RouteManagement.Infrastructure.Repositories
{
    public class BookingClassRepository : IBookingClassRepository
    {
        private readonly ApplicationDbContext _context;

        public BookingClassRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<BookingClass>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.BookingClasses.OrderBy(bc => bc.Name)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<BookingClass>> GetByIdsAsync(List<int> ids, CancellationToken cancellationToken)
        {
            return await _context.BookingClasses.Where(bc => ids.Contains(bc.Id))
                .ToListAsync(cancellationToken);
        }
        
    }
}
