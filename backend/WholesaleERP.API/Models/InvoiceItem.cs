using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WholesaleERP.API.Models
{
    public class InvoiceItem
    {
        [Key]
        public int Id { get; set; }

        // Foreign Keys
        [Required]
        public int InvoiceId { get; set; }

        [Required]
        public int ItemId { get; set; }

        [Required]
        [StringLength(255)]
        public string ItemName { get; set; } = string.Empty; // Store name at time of invoice

        [Column(TypeName = "decimal(18,2)")]
        public decimal Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal DiscountPercentage { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        [StringLength(50)]
        public string? Unit { get; set; }

        // Navigation Properties
        public virtual Invoice Invoice { get; set; } = null!;
        public virtual Item Item { get; set; } = null!;

        // Computed property
        [NotMapped]
        public decimal LineTotal => (Quantity * UnitPrice) - DiscountAmount;
    }
}