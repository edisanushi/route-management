
namespace RouteManagement.Application.DTOs.Pricing
{
    public class AssignedSeasonRouteDto
    {
        public int OperatorSeasonRouteId { get; set; }
        public int SeasonId { get; set; }
        public string SeasonName { get; set; } = string.Empty;
        public int RouteId { get; set; }
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public bool IsPriced { get; set; }
    }
}
