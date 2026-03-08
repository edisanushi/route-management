
namespace RouteManagement.Application.DTOs.Pricing
{
    public class BookingClassPricingDto
    {
        public int BookingClassId { get; set; }
        public string BookingClassName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int SeatsRequested { get; set; }
    }
}
