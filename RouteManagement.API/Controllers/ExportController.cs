using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RouteManagement.Application.Interfaces;

namespace RouteManagement.API.Controllers
{
    [ApiController]
    [Route("api/export")]
    [Authorize]
    public class ExportController(IExcelExportService excelExportService, ICurrentUserService currentUserService) : ControllerBase
    {
        [HttpPost("pricing/{operatorSeasonRouteId}")]
        public async Task<IActionResult> ExportPricing(int operatorSeasonRouteId, [FromQuery] string connectionId, CancellationToken cancellationToken)
        {
            var userId = currentUserService.UserId!;
            var isAdmin = currentUserService.IsAdmin;
            var bytes = await excelExportService.ExportPricingAsync(operatorSeasonRouteId, connectionId, userId, isAdmin, cancellationToken);
            var filename = $"pricing_{operatorSeasonRouteId}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.xlsx";
            return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename);
        }
    }
}
