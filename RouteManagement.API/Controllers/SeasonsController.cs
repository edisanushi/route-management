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

            var season = await seasonService.CreateAsync(dto, currentUserService.UserId ?? string.Empty, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = season.Id }, season);
        }


        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var seasons = await seasonService.GetAllAsync(cancellationToken);
            return Ok(seasons);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var season = await seasonService.GetByIdAsync(id, cancellationToken);
            return Ok(season);
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Update(int id, [FromBody] SeasonFormDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.ToErrorResponse(HttpContext.TraceIdentifier));

            var season = await seasonService.UpdateAsync(id, dto, currentUserService.UserId ?? string.Empty, cancellationToken);
            return Ok(season);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            await seasonService.DeleteAsync(id, currentUserService.UserId ?? string.Empty, cancellationToken);
            return NoContent();
        }
    }
}
