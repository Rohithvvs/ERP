using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WholesaleERP.API.Models
{
    public class Item
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        [StringLength(100)]
        public string SKU { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal CostPrice { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal SalePrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal LowStockThreshold { get; set; } = 10;

        [StringLength(50)]
        public string? Unit { get; set; } // kg, pieces, liters, etc.

        public bool IsActive { get; set; } = true;

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        // Foreign Key
        public int? CategoryId { get; set; }

        // Navigation Properties
        public virtual Category? Category { get; set; }
        public virtual ICollection<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();
        public virtual ICollection<PurchaseItem> PurchaseItems { get; set; } = new List<PurchaseItem>();

        // Audit fields
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Computed properties
        [NotMapped]
        public bool IsLowStock => Quantity <= LowStockThreshold;

        [NotMapped]
        public decimal ProfitMargin => CostPrice == 0 ? 0 : ((SalePrice - CostPrice) / CostPrice) * 100;
    }
}