using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RouteManagement.API.Extensions;
using RouteManagement.Application.DTOs.TourOperator;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Common;

namespace RouteManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TourOperatorsController(
        ITourOperatorService tourOperatorService,
        ICurrentUserService currentUserService) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var operators = await tourOperatorService.GetAllAsync(cancellationToken);
            return Ok(operators);
        }


        [HttpGet("{id:int}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var tourOperator = await tourOperatorService.GetByIdAsync(id, cancellationToken);
            return Ok(tourOperator);
        }


        [HttpGet("me")]
        [Authorize(Roles = Roles.TourOperatorMember)]
        public async Task<IActionResult> GetMyProfile(CancellationToken cancellationToken)
        {
            var tourOperator = await tourOperatorService.GetByUserIdAsync(currentUserService.UserId ?? string.Empty, cancellationToken);
            return Ok(tourOperator);
        }


        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Create([FromBody] TourOperatorFormDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.ToErrorResponse(HttpContext.TraceIdentifier));

            var tourOperator = await tourOperatorService.CreateAsync(dto, currentUserService.UserId ?? string.Empty, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = tourOperator.Id }, tourOperator);
        }


        [HttpPut("{id:int}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Update(int id, [FromBody] TourOperatorUpdateDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.ToErrorResponse(HttpContext.TraceIdentifier));

            var tourOperator = await tourOperatorService.UpdateAsync(id, dto, currentUserService.UserId ?? string.Empty, cancellationToken);
            return Ok(tourOperator);
        }


        [HttpPut("{id:int}/profile")]
        [Authorize(Roles = Roles.TourOperatorMember)]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] TourOperatorProfileDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.ToErrorResponse(HttpContext.TraceIdentifier));

            var tourOperator = await tourOperatorService.UpdateProfileAsync(id, dto, currentUserService.UserId ?? string.Empty, cancellationToken);
            return Ok(tourOperator);
        }


        [HttpDelete("{id:int}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            await tourOperatorService.DeleteAsync(id, currentUserService.UserId ?? string.Empty, cancellationToken);
            return NoContent();
        }


        [HttpGet("{id:int}/bookingclasses")]
        [Authorize(Roles = Roles.TourOperatorMember)]
        public async Task<IActionResult> GetBookingClasses(int id, CancellationToken cancellationToken)
        {
            var result = await tourOperatorService.GetBookingClassIdsAsync(id, cancellationToken);
            return Ok(result);
        }


        [HttpPut("{id:int}/bookingclasses")]
        [Authorize(Roles = Roles.TourOperatorMember)]
        public async Task<IActionResult> UpdateBookingClasses(int id, [FromBody] List<int> bookingClassIds, CancellationToken cancellationToken)
        {
            await tourOperatorService.UpdateBookingClassesAsync(id, bookingClassIds, currentUserService.UserId ?? string.Empty, cancellationToken);
            return NoContent();
        }


        [HttpGet("{id:int}/seasons/{seasonId:int}/routes")]
        [Authorize(Roles = Roles.TourOperatorMember)]
        public async Task<IActionResult> GetSeasonRoutes(int id, int seasonId, CancellationToken cancellationToken)
        {
            var result = await tourOperatorService.GetSeasonRouteIdsAsync(id, seasonId, cancellationToken);
            return Ok(result);
        }


        [HttpPut("{id:int}/seasons/{seasonId:int}/routes")]
        [Authorize(Roles = Roles.TourOperatorMember)]
        public async Task<IActionResult> UpdateSeasonRoutes(int id, int seasonId, [FromBody] List<int> routeIds, CancellationToken cancellationToken)
        {
            await tourOperatorService.UpdateSeasonRoutesAsync(id, seasonId, routeIds, currentUserService.UserId ?? string.Empty, cancellationToken);
            return NoContent();
        }


        [HttpGet("{id:int}/routes/{routeId:int}/seasons")]
        [Authorize(Roles = Roles.TourOperatorMember)]
        public async Task<IActionResult> GetRouteSeasons(int id, int routeId, CancellationToken cancellationToken)
        {
            var result = await tourOperatorService.GetRouteSeasonIdsAsync(id, routeId, cancellationToken);
            return Ok(result);
        }


        [HttpPut("{id:int}/routes/{routeId:int}/seasons")]
        [Authorize(Roles = Roles.TourOperatorMember)]
        public async Task<IActionResult> UpdateRouteSeasons(int id, int routeId, [FromBody] List<int> seasonIds, CancellationToken cancellationToken)
        {
            await tourOperatorService.UpdateRouteReasonsAsync(id, routeId, seasonIds, currentUserService.UserId ?? string.Empty, cancellationToken);
            return NoContent();
        }
    }
}
