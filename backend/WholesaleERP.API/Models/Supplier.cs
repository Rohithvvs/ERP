using System.ComponentModel.DataAnnotations;

namespace WholesaleERP.API.Models
{
    public class Supplier
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Company { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

        [StringLength(255)]
        [EmailAddress]
        public string? Email { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        [StringLength(50)]
        public string? City { get; set; }

        [StringLength(10)]
        public string? PostalCode { get; set; }

        [StringLength(50)]
        public string? State { get; set; }

        [StringLength(50)]
        public string? Country { get; set; }

        [StringLength(50)]
        public string? TaxId { get; set; }

        public bool IsActive { get; set; } = true;

        [StringLength(1000)]
        public string? Notes { get; set; }

        // Navigation Properties
        public virtual ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();

        // Audit fields
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}