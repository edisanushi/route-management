
namespace RouteManagement.Application.DTOs.TourOperator
{
    public class TourOperatorDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? UserId { get; set; }
        public string? UserEmail { get; set; }
        public string? ContactPerson { get; set; }
        public string? ContactEmail { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
