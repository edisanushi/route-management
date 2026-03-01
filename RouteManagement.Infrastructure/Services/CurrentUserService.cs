using Microsoft.AspNetCore.Http;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Common;
using System.Security.Claims;

namespace RouteManagement.Infrastructure.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly ClaimsPrincipal? _user;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _user = httpContextAccessor.HttpContext?.User;
        }
        
        public string? UserId => _user?.FindFirstValue(ClaimTypes.NameIdentifier);

        public string? Email => _user?.FindFirstValue(ClaimTypes.Email);

        public string? Role => _user?.FindFirstValue(ClaimTypes.Role);

        public bool IsAuthenticated => _user?.Identity?.IsAuthenticated ?? false;

        public bool IsAdmin => _user?.IsInRole(Roles.Admin) ?? false;

        public bool IsTourOperator => _user?.IsInRole(Roles.TourOperatorMember) ?? false;
    }
}
