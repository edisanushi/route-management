using RouteManagement.Domain.Common;
using RouteManagement.Domain.Enums;

namespace RouteManagement.Domain.Entities
{
    public class Season : BaseEntity
    {
        public int Id { get; set; }
        public int Year { get; set; }
        public SeasonType SeasonType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public ICollection<OperatorSeasonRoute> OperatorSeasonRoutes { get; set; } = new List<OperatorSeasonRoute>();
    }
}
