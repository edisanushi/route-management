using RouteManagement.Domain.Common;
using RouteManagement.Domain.Enums;

namespace RouteManagement.Domain.Entities
{
    public class Pricing : BaseEntity
    {
        public int Id { get; set; }
        public int OperatorSeasonRouteId { get; set; }
        public DateTime Date { get; set; }
        public WeekDay DayOfWeek { get; set; }
        public int BookingClassId { get; set; }
        public decimal Price { get; set; }
        public int SeatsRequested { get; set; }

        public OperatorSeasonRoute OperatorSeasonRoute { get; set; } = null!;
        public BookingClass BookingClass { get; set; } = null!;
    }
}
