using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RouteManagement.API.Extensions;
using RouteManagement.Application.DTOs.Season;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Common;

namespace RouteManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SeasonsController(ISeasonService seasonService, ICurrentUserService currentUserService) : ControllerBase
    {
        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Create([FromBody] SeasonFormDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.ToErrorResponse(HttpContext.TraceIdentifier));

            await seasonService.CreateAsync(dto, currentUserService.UserId ?? string.Empty, cancellationToken);
            return StatusCode(201);
        }


        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var seasons = await seasonService.GetAllAsync(cancellationToken);
            return Ok(seasons);
        }
    }
}
