using RouteManagement.Application.DTOs.Auth;

namespace RouteManagement.Application.Interfaces
{
    public interface IIdentityService
    {
        Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
        Task<RegisterResponse> RegisterAsync(RegisterRequest request, string createdBy, CancellationToken cancellationToken);
        Task<(bool Succeeded, IEnumerable<string> Errors)> CreateUserAsync(string email, string password, string role, string createdBy);
        Task<string?> GetUserIdByEmailAsync(string email);
        Task<string?> GetEmailByUserIdAsync(string userId);
    }
}
