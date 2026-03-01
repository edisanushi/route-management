
namespace RouteManagement.Application.Interfaces
{
    public interface ICurrentUserService
    {
        string? UserId { get; }
        string? Email { get; }
        bool IsAuthenticated { get; }
        string? Role { get; }
        bool IsAdmin { get; }
        bool IsTourOperator { get; }
    }
}
