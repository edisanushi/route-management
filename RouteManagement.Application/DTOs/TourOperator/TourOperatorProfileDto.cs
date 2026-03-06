using System.ComponentModel.DataAnnotations;

namespace RouteManagement.Application.DTOs.TourOperator
{
    public class TourOperatorProfileDto
    {
        [MaxLength(200)]
        public string? ContactPerson { get; set; }
        [EmailAddress]
        [MaxLength(200)]
        public string? ContactEmail { get; set; }
        [MaxLength(50)]
        public string? PhoneNumber { get; set; }
    }
}
