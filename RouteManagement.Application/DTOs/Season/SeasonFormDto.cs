using RouteManagement.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace RouteManagement.Application.DTOs.Season
{
    public class SeasonFormDto
    {
        [Required]
        [Range(2000, 2100)]
        public int Year { get; set; }
        [Required]
        public SeasonType SeasonType { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
    }
}
