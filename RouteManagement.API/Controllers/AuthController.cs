using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RouteManagement.Application.DTOs.Auth;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Common;
using RouteManagement.API.Extensions;

namespace RouteManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IIdentityService identityService, ICurrentUserService currentUserService) : ControllerBase
    {

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.ToErrorResponse(HttpContext.TraceIdentifier));

            var response = await identityService.LoginAsync(request, cancellationToken);

            return Ok(response);

        }



        [HttpPost("register")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.ToErrorResponse(HttpContext.TraceIdentifier));

            var registerResult = await identityService.RegisterAsync(
                    request,
                    createdBy: currentUserService.UserId ?? string.Empty,
                    cancellationToken);

            return Ok(registerResult);
        }

    }
}
