using Microsoft.EntityFrameworkCore;
using RouteManagement.Application.Interfaces;
using RouteManagement.Infrastructure.Data;

namespace RouteManagement.Infrastructure.Repositories
{
    public class RouteRepository : IRouteRepository
    {
        private readonly ApplicationDbContext _context;

        public RouteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<Domain.Entities.Route>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Routes.Include(r => r.RouteBookingClasses)
                                        .OrderBy(r => r.Origin).ToListAsync(cancellationToken);
        }

        public async Task<Domain.Entities.Route?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Routes.Include(r => r.RouteBookingClasses)
                                        .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
        }

        public async Task<Domain.Entities.Route?> GetByIdForUpdateAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Routes.IgnoreQueryFilters()
                                        .Include(r => r.RouteBookingClasses)
                                        .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted, cancellationToken);
        }

        public async Task<Domain.Entities.Route> CreateAsync(Domain.Entities.Route route, CancellationToken cancellationToken)
        {
            _context.Routes.Add(route);
            await _context.SaveChangesAsync(cancellationToken);
            return route;
        }

        public async Task UpdateAsync(Domain.Entities.Route route, CancellationToken cancellationToken)
        {
            _context.Routes.Update(route);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<bool> ExistsAsync(string origin, string destination, CancellationToken cancellationToken)
        {
            return await _context.Routes.AnyAsync(r => r.Origin == origin && r.Destination == destination, cancellationToken);
        }

        public async Task<bool> ExistsAsync(string origin, string destination, int excludeId, CancellationToken cancellationToken)
        {
            return await _context.Routes.AnyAsync(r => r.Origin == origin && r.Destination == destination && r.Id != excludeId, cancellationToken);
        }

    }
}
