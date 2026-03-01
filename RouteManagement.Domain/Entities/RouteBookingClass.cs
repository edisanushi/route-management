using RouteManagement.Domain.Common;

namespace RouteManagement.Domain.Entities
{
    public class RouteBookingClass : BaseEntity
    {
        public int RouteId { get; set; }
        public Route Route { get; set; } = null!;

        public int BookingClassId { get; set; }
        public BookingClass BookingClass { get; set; } = null!;
    }
}
