using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RouteManagement.Application.DTOs.BookingClass;
using RouteManagement.Application.Interfaces;

namespace RouteManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingClassesController(IBookingClassRepository bookingClassRepository) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var bookingClasses = await bookingClassRepository.GetAllAsync(cancellationToken);
            var result = bookingClasses.Select(bc => new BookingClassDto
            {
                Id = bc.Id,
                Name = bc.Name
            });
            return Ok(result);
        }
    }
}
