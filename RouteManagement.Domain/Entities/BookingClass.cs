using RouteManagement.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace RouteManagement.Domain.Entities
{
    public class BookingClass : BaseEntity
    {
        public int Id { get; set; }
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        public ICollection<RouteBookingClass> RouteBookingClasses { get; set; } = new List<RouteBookingClass>();
        public ICollection<TourOperatorBookingClass> TourOperatorBookingClasses { get; set; } = new List<TourOperatorBookingClass>();
        public ICollection<Pricing> Pricings { get; set; } = new List<Pricing>();
    }
}
