using System.ComponentModel.DataAnnotations;

namespace RouteManagement.Application.DTOs.Pricing
{
    public class UpsertPricingDto
    {
        [Required]
        public List<UpsertPricingRowDto> Rows { get; set; } = new();
    }

    public class UpsertPricingRowDto
    {
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public List<UpsertBookingClassPricingDto> BookingClassPricings { get; set; } = new();
    }

    public class UpsertBookingClassPricingDto
    {
        [Required]
        public int BookingClassId { get; set; }
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public int SeatsRequested { get; set; }
    }
}
