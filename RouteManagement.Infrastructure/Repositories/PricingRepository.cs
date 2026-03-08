using Microsoft.EntityFrameworkCore;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Entities;
using RouteManagement.Infrastructure.Data;

namespace RouteManagement.Infrastructure.Repositories
{
    public class PricingRepository(ApplicationDbContext context) : IPricingRepository
    {
        public async Task<List<OperatorSeasonRoute>> GetAssignedSeasonRoutesAsync(int tourOperatorId, CancellationToken cancellationToken)
        {
            return await context.OperatorSeasonRoutes
                .Include(osr => osr.Season)
                .Include(osr => osr.Route)
                .Include(osr => osr.Pricings)
                .Where(osr => osr.TourOperatorId == tourOperatorId)
                .OrderBy(osr => osr.Season.Year)
                .ThenBy(osr => osr.Season.SeasonType)
                .ThenBy(osr => osr.Route.Origin)
                .ToListAsync(cancellationToken);
        }


        public async Task<OperatorSeasonRoute?> GetOperatorSeasonRouteAsync(int operatorSeasonRouteId, CancellationToken cancellationToken)
        {
            return await context.OperatorSeasonRoutes
                .Include(osr => osr.Season)
                .Include(osr => osr.Route)
                    .ThenInclude(r => r.RouteBookingClasses)
                    .ThenInclude(rbc => rbc.BookingClass)
                .Include(osr => osr.TourOperator)
                    .ThenInclude(to => to.TourOperatorBookingClasses)
                .FirstOrDefaultAsync(osr => osr.Id == operatorSeasonRouteId, cancellationToken);
        }


        public async Task<List<Pricing>> GetByOperatorSeasonRouteAsync(int operatorSeasonRouteId, CancellationToken cancellationToken)
        {
            return await context.Pricings
                .Where(p => p.OperatorSeasonRouteId == operatorSeasonRouteId).ToListAsync(cancellationToken);
        }


        public async Task UpsertAsync(List<Pricing> toUpdate, List<Pricing> toAdd, CancellationToken cancellationToken)
        {
            if (toUpdate.Count > 0)
                context.Pricings.UpdateRange(toUpdate);
            if (toAdd.Count > 0)
                context.Pricings.AddRange(toAdd);
            await context.SaveChangesAsync(cancellationToken);
        }

    }
}
