using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WholesaleERP.API.Models
{
    public enum PurchaseStatus
    {
        Pending,
        Ordered,
        Received,
        Cancelled
    }

    public enum PaymentStatus
    {
        Unpaid,
        PartiallyPaid,
        Paid
    }

    public class Purchase
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string PurchaseNumber { get; set; } = string.Empty;

        [Required]
        public DateTime PurchaseDate { get; set; }

        public DateTime? ExpectedDeliveryDate { get; set; }

        public DateTime? ActualDeliveryDate { get; set; }

        // Foreign Key
        [Required]
        public int SupplierId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; } = 0;

        [Column(TypeName = "decimal(5,2)")]
        public decimal TaxRate { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal ShippingCost { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal PaidAmount { get; set; } = 0;

        public PurchaseStatus Status { get; set; } = PurchaseStatus.Pending;

        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;

        [StringLength(1000)]
        public string? Notes { get; set; }

        // Navigation Properties
        public virtual Supplier Supplier { get; set; } = null!;
        public virtual ICollection<PurchaseItem> Items { get; set; } = new List<PurchaseItem>();

        // Audit fields
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Computed properties
        [NotMapped]
        public decimal RemainingBalance => Total - PaidAmount;

        [NotMapped]
        public bool IsFullyPaid => PaidAmount >= Total;
    }
}