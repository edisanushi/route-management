
namespace RouteManagement.Application.DTOs.Pricing
{
    public class PricingRowDto
    {
        public DateTime Date { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public List<BookingClassPricingDto> BookingClassPricings { get; set; } = new();
    }
}
