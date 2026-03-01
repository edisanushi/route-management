using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace RouteManagement.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public DateTime CreatedOn { get; set; }
        [MaxLength(450)]
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        [MaxLength(450)]
        public string? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}
