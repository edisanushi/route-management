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
                var registerResult = await identityService.RegisterAsync(request, createdBy: currentUserService.UserId ?? "", cancellationToken);

                if (registerResult.Success)
                    return CreatedAtAction(
                        nameof(Login),
                        new { },
                        new { message = $"User {registerResult.Email} registered successfully." });
                else
                    return BadRequest("Something went wrong");
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }


        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var user = await userManager.FindByIdAsync(currentUserService.UserId ?? string.Empty);

            if (user is null || user.IsDeleted)
                return Unauthorized();

            return Ok(new
            {
                user.Email,
                Role = currentUserService.Role,
            });
        }
    }
}
