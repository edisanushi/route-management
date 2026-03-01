using RouteManagement.Application.DTOs.Auth;

namespace RouteManagement.Application.Interfaces
{
    public interface IIdentityService
    {
        Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
        Task<(bool Success, string Email)> RegisterAsync(RegisterRequest request, string createdBy, CancellationToken cancellationToken = default);
    }
}
