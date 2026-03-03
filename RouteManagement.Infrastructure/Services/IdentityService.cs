using Microsoft.AspNetCore.Identity;
using RouteManagement.Application.DTOs.Auth;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Common;
using RouteManagement.Domain.Entities;

namespace RouteManagement.Infrastructure.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtService _jwtService;

        public IdentityService(
            UserManager<ApplicationUser> userManager,
            IJwtService jwtService)
        {
            _userManager = userManager;
            _jwtService = jwtService;
        }


        public async Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password.");

            if (user.IsDeleted)
                throw new UnauthorizedAccessException("Invalid email or password.");

            var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);

            if (!passwordValid)
                throw new UnauthorizedAccessException("Invalid email or password.");

            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtService.GenerateToken(user, roles);

            return new AuthResponse
            {
                Token = token,
                Email = user.Email!,
                Role = roles.FirstOrDefault() ?? string.Empty,
                ExpiresAt = _jwtService.GetExpirationDate()
            };

        }


        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request, string createdBy, CancellationToken cancellationToken)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
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

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                throw new InvalidOperationException($"Registration failed: {string.Join(", ", result.Errors.Select(e => e.Description))}");

            await _userManager.AddToRoleAsync(user, Roles.TourOperatorMember);

            return new RegisterResponse
            {
                Email = user.Email!,
                Role = Roles.TourOperatorMember
            };
        }
    }
}
