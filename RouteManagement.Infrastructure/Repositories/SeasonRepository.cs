using Microsoft.EntityFrameworkCore;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Entities;
using RouteManagement.Domain.Enums;
using RouteManagement.Infrastructure.Data;

namespace RouteManagement.Infrastructure.Repositories
{
    public class SeasonRepository(ApplicationDbContext context) : ISeasonRepository
    {
        public async Task<bool> ExistsAsync(int year, SeasonType seasonType, CancellationToken cancellationToken)
        {
            return await context.Seasons.AnyAsync(s => s.Year == year && s.SeasonType == seasonType, cancellationToken);
        }

        public async Task<Season> CreateAsync(Season season, CancellationToken cancellationToken)
        {
            context.Seasons.Add(season);
            await context.SaveChangesAsync(cancellationToken);
            return season;
        }

        public async Task<IReadOnlyList<Season>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.Seasons.OrderByDescending(s => s.Year)
                                        .ThenBy(s => s.SeasonType)
                                        .ToListAsync(cancellationToken);
        }

    }
}
