using RouteManagement.Domain.Enums;

namespace RouteManagement.Application.DTOs.Season
{
    public class SeasonDto
    {
        public int Id { get; set; }
        public int Year { get; set; }
        public SeasonType SeasonType { get; set; }
        public string SeasonTypeName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
