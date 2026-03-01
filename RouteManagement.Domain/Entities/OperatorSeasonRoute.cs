using RouteManagement.Domain.Common;

namespace RouteManagement.Domain.Entities
{
    public class OperatorSeasonRoute : BaseEntity
    {
        public int Id { get; set; }
        public int TourOperatorId { get; set; }
        public int SeasonId { get; set; }
        public int RouteId { get; set; }

        public TourOperator TourOperator { get; set; } = null!;
        public Season Season { get; set; } = null!;
        public Route Route { get; set; } = null!;

        public ICollection<Pricing> Pricings { get; set; } = new List<Pricing>();
    }
}
