
namespace RouteManagement.Application.DTOs.Route
{
    public class RouteDto
    {
        public int Id { get; set; }
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public List<int> BookingClassIds { get; set; } = new();
    }
}
