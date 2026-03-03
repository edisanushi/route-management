using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RouteManagement.Application.DTOs.Auth;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Common;
using RouteManagement.Domain.Entities;

namespace RouteManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IIdentityService identityService, ICurrentUserService currentUserService, 
                                UserManager<ApplicationUser> userManager) : ControllerBase
    {

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var response = await identityService.LoginAsync(request, cancellationToken);

                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }

        }



        [HttpPost("register")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var registerResult = await identityService.RegisterAsync(
                    request,
                    createdBy: currentUserService.UserId ?? string.Empty,
                    cancellationToken);

                return CreatedAtAction(
                    nameof(Login),
                    new { },
                    registerResult);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
