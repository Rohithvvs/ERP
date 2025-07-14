using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WholesaleERP.API.Models
{
    public class PurchaseItem
    {
        [Key]
        public int Id { get; set; }

        // Foreign Keys
        [Required]
        public int PurchaseId { get; set; }

        [Required]
        public int ItemId { get; set; }

        [Required]
        [StringLength(255)]
        public string ItemName { get; set; } = string.Empty; // Store name at time of purchase

        [Column(TypeName = "decimal(18,2)")]
        public decimal Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitCost { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        [StringLength(50)]
        public string? Unit { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ReceivedQuantity { get; set; }

        // Navigation Properties
        public virtual Purchase Purchase { get; set; } = null!;
        public virtual Item Item { get; set; } = null!;

        // Computed properties
        [NotMapped]
        public decimal LineTotal => Quantity * UnitCost;

        [NotMapped]
        public bool IsFullyReceived => ReceivedQuantity >= Quantity;
    }
}