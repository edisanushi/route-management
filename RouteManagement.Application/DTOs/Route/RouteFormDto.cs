using System.ComponentModel.DataAnnotations;

namespace RouteManagement.Application.DTOs.Route
{
    public class RouteFormDto
    {
        [Required]
        [MaxLength(200)]
        public string Origin { get; set; } = string.Empty;
        [Required]
        [MaxLength(200)]
        public string Destination { get; set; } = string.Empty;
        [Required]
        [MinLength(1, ErrorMessage = "At least one booking class is required.")]
        public List<int> BookingClassIds { get; set; } = new();
    }
}
