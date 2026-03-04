using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RouteManagement.API.Extensions;
using RouteManagement.Application.DTOs.Route;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Common;

namespace RouteManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RoutesController(IRouteService routeService, ICurrentUserService currentUserService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var routes = await routeService.GetAllAsync(cancellationToken);
            return Ok(routes);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var route = await routeService.GetByIdAsync(id, cancellationToken);
            return Ok(route);
        }

        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Create([FromBody] RouteFormDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.ToErrorResponse(HttpContext.TraceIdentifier));

            var route = await routeService.CreateAsync(dto, currentUserService.UserId ?? string.Empty, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = route.Id }, route);
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Update(int id, [FromBody] RouteFormDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.ToErrorResponse(HttpContext.TraceIdentifier));

            var route = await routeService.UpdateAsync(id, dto, currentUserService.UserId ?? string.Empty, cancellationToken);
            return Ok(route);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            await routeService.DeleteAsync(id, currentUserService.UserId ?? string.Empty, cancellationToken);
            return NoContent();
        }
    }
}
