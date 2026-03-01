using RouteManagement.Domain.Entities;

namespace RouteManagement.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(ApplicationUser user, IList<string> roles);
        DateTime GetExpirationDate();
    }
}
