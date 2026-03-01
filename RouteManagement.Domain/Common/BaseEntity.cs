using System.ComponentModel.DataAnnotations;

namespace RouteManagement.Domain.Common
{
    public abstract class BaseEntity
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
