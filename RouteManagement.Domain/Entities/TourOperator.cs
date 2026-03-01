using RouteManagement.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace RouteManagement.Domain.Entities
{
    public class TourOperator : BaseEntity
    {
        public int Id { get; set; }
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(450)]
        public string? UserId { get; set; }

        public ICollection<TourOperatorBookingClass> TourOperatorBookingClasses { get; set; } = new List<TourOperatorBookingClass>();
        public ICollection<OperatorSeasonRoute> OperatorSeasonRoutes { get; set; } = new List<OperatorSeasonRoute>();
    }
}
