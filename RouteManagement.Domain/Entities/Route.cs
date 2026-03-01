using RouteManagement.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace RouteManagement.Domain.Entities
{
    public class Route : BaseEntity
    {
        public int Id { get; set; }
        [MaxLength(200)]
        public string Origin { get; set; } = string.Empty;
        [MaxLength(200)]
        public string Destination { get; set; } = string.Empty;

        public ICollection<RouteBookingClass> RouteBookingClasses { get; set; } = new List<RouteBookingClass>();
        public ICollection<OperatorSeasonRoute> OperatorSeasonRoutes { get; set; } = new List<OperatorSeasonRoute>();
    }
}
