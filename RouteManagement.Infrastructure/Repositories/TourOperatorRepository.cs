using Microsoft.EntityFrameworkCore;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Entities;
using RouteManagement.Infrastructure.Data;

namespace RouteManagement.Infrastructure.Repositories
{
    public class TourOperatorRepository(ApplicationDbContext context) : ITourOperatorRepository
    {
        public async Task<TourOperator> CreateAsync(TourOperator tourOperator, CancellationToken cancellationToken)
        {
            context.TourOperators.Add(tourOperator);
            await context.SaveChangesAsync(cancellationToken);
            return tourOperator;
        }


        public async Task<bool> ExistsAsync(string name, CancellationToken cancellationToken)
        {
            return await context.TourOperators.AnyAsync(t => t.Name == name, cancellationToken);
        }


        public async Task<bool> ExistsAsync(string name, int excludeId, CancellationToken cancellationToken)
        {
            return await context.TourOperators.AnyAsync(t => t.Name == name && t.Id != excludeId, cancellationToken);
        }


        public async Task<IReadOnlyList<TourOperator>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.TourOperators.OrderBy(t => t.Name).ToListAsync(cancellationToken);
        }


        public async Task<IReadOnlyList<(TourOperator Operator, string? Email)>> GetAllWithEmailsAsync(CancellationToken cancellationToken)
        {
            var operators = await context.TourOperators.OrderBy(t => t.Name).ToListAsync(cancellationToken);

            var userIds = operators.Where(t => t.UserId != null).Select(t => t.UserId!).ToList();

            var users = await context.Users.Where(u => userIds.Contains(u.Id)).Select(u => new { u.Id, u.Email })
                                           .ToListAsync(cancellationToken);

            return operators.Select(t => (t, users.FirstOrDefault(u => u.Id == t.UserId)?.Email)).ToList();
        }


        public async Task<TourOperator?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await context.TourOperators.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        }


        public async Task<TourOperator?> GetByUserIdAsync(string userId, CancellationToken cancellationToken)
        {
            return await context.TourOperators.FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);
        }


        public async Task UpdateAsync(TourOperator tourOperator, CancellationToken cancellationToken)
        {
            context.TourOperators.Update(tourOperator);
            await context.SaveChangesAsync(cancellationToken);
        }

    }
}
