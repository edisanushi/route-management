using System.ComponentModel.DataAnnotations;

namespace RouteManagement.Application.DTOs.TourOperator
{
    public class TourOperatorUpdateDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(200)]
        public string? ContactPerson { get; set; }
        [EmailAddress]
        [MaxLength(200)]
        public string? ContactEmail { get; set; }
        [MaxLength(50)]
        public string? PhoneNumber { get; set; }
    }
}
