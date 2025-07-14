using Microsoft.EntityFrameworkCore;
using WholesaleERP.API.Models;

namespace WholesaleERP.API.Data
{
    public class ERPDbContext : DbContext
    {
        public ERPDbContext(DbContextOptions<ERPDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<Item> Items { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<PurchaseItem> PurchaseItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Item entity
            modelBuilder.Entity<Item>(entity =>
            {
                entity.HasIndex(e => e.SKU).IsUnique();
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.SKU).IsRequired();
                entity.Property(e => e.CostPrice).HasPrecision(18, 2);
                entity.Property(e => e.SalePrice).HasPrecision(18, 2);
                entity.Property(e => e.Quantity).HasPrecision(18, 2);
                entity.Property(e => e.LowStockThreshold).HasPrecision(18, 2);

                // Configure relationship with Category
                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Items)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure Category entity
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Name).IsRequired();
            });

            // Configure Customer entity
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.CreditLimit).HasPrecision(18, 2);
                entity.Property(e => e.OutstandingBalance).HasPrecision(18, 2);
            });

            // Configure Supplier entity
            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.Property(e => e.Name).IsRequired();
            });

            // Configure Invoice entity
            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasIndex(e => e.InvoiceNumber).IsUnique();
                entity.Property(e => e.InvoiceNumber).IsRequired();
                entity.Property(e => e.Subtotal).HasPrecision(18, 2);
                entity.Property(e => e.TaxRate).HasPrecision(5, 2);
                entity.Property(e => e.TaxAmount).HasPrecision(18, 2);
                entity.Property(e => e.DiscountAmount).HasPrecision(18, 2);
                entity.Property(e => e.Total).HasPrecision(18, 2);
                entity.Property(e => e.PaidAmount).HasPrecision(18, 2);

                // Configure enum conversion
                entity.Property(e => e.Status)
                      .HasConversion<string>();

                // Configure relationship with Customer
                entity.HasOne(e => e.Customer)
                      .WithMany(c => c.Invoices)
                      .HasForeignKey(e => e.CustomerId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure InvoiceItem entity
            modelBuilder.Entity<InvoiceItem>(entity =>
            {
                entity.Property(e => e.Quantity).HasPrecision(18, 2);
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
                entity.Property(e => e.DiscountPercentage).HasPrecision(5, 2);
                entity.Property(e => e.DiscountAmount).HasPrecision(18, 2);
                entity.Property(e => e.Total).HasPrecision(18, 2);

                // Configure relationships
                entity.HasOne(e => e.Invoice)
                      .WithMany(i => i.Items)
                      .HasForeignKey(e => e.InvoiceId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Item)
                      .WithMany(i => i.InvoiceItems)
                      .HasForeignKey(e => e.ItemId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Purchase entity
            modelBuilder.Entity<Purchase>(entity =>
            {
                entity.HasIndex(e => e.PurchaseNumber).IsUnique();
                entity.Property(e => e.PurchaseNumber).IsRequired();
                entity.Property(e => e.Subtotal).HasPrecision(18, 2);
                entity.Property(e => e.TaxRate).HasPrecision(5, 2);
                entity.Property(e => e.TaxAmount).HasPrecision(18, 2);
                entity.Property(e => e.ShippingCost).HasPrecision(18, 2);
                entity.Property(e => e.Total).HasPrecision(18, 2);
                entity.Property(e => e.PaidAmount).HasPrecision(18, 2);

                // Configure enum conversion
                entity.Property(e => e.Status)
                      .HasConversion<string>();
                entity.Property(e => e.PaymentStatus)
                      .HasConversion<string>();

                // Configure relationship with Supplier
                entity.HasOne(e => e.Supplier)
                      .WithMany(s => s.Purchases)
                      .HasForeignKey(e => e.SupplierId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure PurchaseItem entity
            modelBuilder.Entity<PurchaseItem>(entity =>
            {
                entity.Property(e => e.Quantity).HasPrecision(18, 2);
                entity.Property(e => e.UnitCost).HasPrecision(18, 2);
                entity.Property(e => e.Total).HasPrecision(18, 2);
                entity.Property(e => e.ReceivedQuantity).HasPrecision(18, 2);

                // Configure relationships
                entity.HasOne(e => e.Purchase)
                      .WithMany(p => p.Items)
                      .HasForeignKey(e => e.PurchaseId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Item)
                      .WithMany(i => i.PurchaseItems)
                      .HasForeignKey(e => e.ItemId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is Item || e.Entity is Category || e.Entity is Customer || 
                           e.Entity is Supplier || e.Entity is Invoice || e.Entity is Purchase)
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    if (entry.Property("CreatedAt") != null)
                        entry.Property("CreatedAt").CurrentValue = DateTime.UtcNow;
                }

                if (entry.Property("UpdatedAt") != null)
                    entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;
            }
        }
    }
}