using Microsoft.AspNetCore.Identity;
using RouteManagement.Application.DTOs.Auth;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Common;
using RouteManagement.Domain.Entities;

namespace RouteManagement.Infrastructure.Services
{
    public class IdentityService(UserManager<ApplicationUser> userManager, IJwtService jwtService) : IIdentityService
    {
        public async Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password.");

            if (user.IsDeleted)
                throw new UnauthorizedAccessException("Invalid email or password.");

            var passwordValid = await userManager.CheckPasswordAsync(user, request.Password);
            
            if (!passwordValid)
                throw new UnauthorizedAccessException("Invalid email or password.");

            var roles = await userManager.GetRolesAsync(user);
            var token = jwtService.GenerateToken(user, roles);

            return new AuthResponse
            {
                Token = token,
                Email = user.Email!,
                Role = roles.FirstOrDefault() ?? string.Empty,
                ExpiresAt = jwtService.GetExpirationDate()
            };
        }

        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request, string createdBy, CancellationToken cancellationToken)
        {
            var existingUser = await userManager.FindByEmailAsync(request.Email);
            if (existingUser is not null)
                throw new InvalidOperationException("A user with this email already exists.");

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                EmailConfirmed = true,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = createdBy
            };

            var result = await userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                throw new InvalidOperationException($"Registration failed: {string.Join(", ", result.Errors.Select(e => e.Description))}");

            await userManager.AddToRoleAsync(user, Roles.TourOperatorMember);

            return new RegisterResponse
            {
                Email = user.Email!,
                Role = Roles.TourOperatorMember
            };
        }

        public async Task<(bool Succeeded, IEnumerable<string> Errors)> CreateUserAsync(string email, string password, string role, string createdBy)
        {
            var existingUser = await userManager.FindByEmailAsync(email);
            if (existingUser is not null)
                return (false, new[] { "A user with this email already exists." });

            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = createdBy
            };

            var result = await userManager.CreateAsync(user, password);
            if (!result.Succeeded)
                return (false, result.Errors.Select(e => e.Description));

            await userManager.AddToRoleAsync(user, role);
            return (true, Enumerable.Empty<string>());
        }

        public async Task<string?> GetUserIdByEmailAsync(string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            return user?.Id;
        }

        public async Task<string?> GetEmailByUserIdAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            return user?.Email;
        }
    }
}