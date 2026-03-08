using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RouteManagement.API.Extensions;
using RouteManagement.Application.DTOs.Pricing;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Common;

namespace RouteManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PricingController(
        IPricingService pricingService,
        ITourOperatorRepository tourOperatorRepository,
        ICurrentUserService currentUserService) : ControllerBase
    {
        [HttpGet("assigned-routes")]
        [Authorize(Roles = Roles.TourOperatorMember)]
        public async Task<IActionResult> GetMyAssignedRoutes(CancellationToken cancellationToken)
        {
            var tourOperator = await tourOperatorRepository.GetByUserIdAsync(currentUserService.UserId ?? string.Empty, cancellationToken);
            if (tourOperator == null)
                return NotFound();

            var result = await pricingService.GetAssignedSeasonRoutesAsync(tourOperator.Id, cancellationToken);
            return Ok(result);
        }


        [HttpGet("assigned-routes/{tourOperatorId:int}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> GetAssignedRoutesByOperator(int tourOperatorId, CancellationToken cancellationToken)
        {
            var result = await pricingService.GetAssignedSeasonRoutesAsync(tourOperatorId, cancellationToken);
            return Ok(result);
        }


        [HttpGet("{operatorSeasonRouteId:int}")]
        public async Task<IActionResult> GetPricingTable(int operatorSeasonRouteId, CancellationToken cancellationToken)
        {
            var result = await pricingService.GetPricingTableAsync(
                operatorSeasonRouteId,
                currentUserService.UserId ?? string.Empty,
                currentUserService.IsAdmin,
                cancellationToken);
            return Ok(result);
        }


        [HttpPut("{operatorSeasonRouteId:int}")]
        [Authorize(Roles = Roles.TourOperatorMember)]
        public async Task<IActionResult> UpsertPricing(int operatorSeasonRouteId, [FromBody] UpsertPricingDto dto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.ToErrorResponse(HttpContext.TraceIdentifier));

            await pricingService.UpsertPricingAsync(
                operatorSeasonRouteId,
                dto,
                currentUserService.UserId ?? string.Empty,
                cancellationToken);
            return NoContent();
        }

    }
}