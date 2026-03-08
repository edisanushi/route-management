
namespace RouteManagement.Application.DTOs.Pricing
{
    public class PricingTableDto
    {
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public string SeasonName { get; set; } = string.Empty;
        public List<PricingRowDto> Rows { get; set; } = [];
    }
}
