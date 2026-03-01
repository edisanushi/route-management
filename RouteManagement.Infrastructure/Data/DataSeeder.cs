using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RouteManagement.Domain.Common;
using RouteManagement.Domain.Entities;

namespace RouteManagement.Infrastructure.Data
{
    public static class DataSeeder
    {
        public const string RoleAdmin = Roles.Admin;
        public const string RoleTourOperatorMember = Roles.TourOperatorMember;

        public static async Task SeedAsync(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            CancellationToken cancellationToken = default)
        {
            await SeedRolesAsync(roleManager, cancellationToken);
            await SeedAdminUserAsync(userManager, configuration, cancellationToken);
            await SeedBookingClassesAsync(context, cancellationToken);
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager, CancellationToken cancellationToken)
        {
            if (await roleManager.RoleExistsAsync(RoleAdmin))
                return;

            await roleManager.CreateAsync(new IdentityRole(RoleAdmin));
            await roleManager.CreateAsync(new IdentityRole(RoleTourOperatorMember));
        }

        private static async Task SeedAdminUserAsync(
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            CancellationToken cancellationToken)
        {
            var email = configuration["Seeder:AdminEmail"] ?? "admin@example.com";
            var password = configuration["Seeder:AdminPassword"] ?? "Admin123!";

            if (await userManager.FindByEmailAsync(email) != null)
                return;

            var admin = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                CreatedOn = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(admin, password);
            if (!result.Succeeded)
                throw new InvalidOperationException($"Failed to seed admin user: {string.Join("; ", result.Errors.Select(e => e.Description))}");

            await userManager.AddToRoleAsync(admin, RoleAdmin);
        }

        private static async Task SeedBookingClassesAsync(ApplicationDbContext context, CancellationToken cancellationToken)
        {
            if (await context.BookingClasses.AnyAsync(cancellationToken))
                return;

            var names = new[] { "Economy", "Business", "First" };
            var now = DateTime.UtcNow;

            foreach (var name in names)
            {
                context.BookingClasses.Add(new BookingClass
                {
                    Name = name,
                    CreatedOn = now
                });
            }

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
