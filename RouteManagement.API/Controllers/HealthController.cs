using Microsoft.AspNetCore.Mvc;

namespace RouteManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Application = "Route Fare Management Platform",
            Version = "1.0.0"
        });
    }
}