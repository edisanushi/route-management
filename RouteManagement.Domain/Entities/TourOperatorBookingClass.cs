using RouteManagement.Domain.Common;

namespace RouteManagement.Domain.Entities
{
    public class TourOperatorBookingClass : BaseEntity
    {
        public int TourOperatorId { get; set; }
        public TourOperator TourOperator { get; set; } = null!;

        public int BookingClassId { get; set; }
        public BookingClass BookingClass { get; set; } = null!;
    }

}
