import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from './Invoice';
import { Item } from './Item';

@Entity('invoice_items')
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice, invoice => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @Column()
  invoiceId: number;

  @ManyToOne(() => Item, item => item.invoiceItems)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  itemId: number;

  @Column({ type: 'varchar', length: 255 })
  itemName: string; // Store name at time of invoice

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string;

  // Virtual property to calculate line total
  get lineTotal(): number {
    const subtotal = this.quantity * this.unitPrice;
    return subtotal - this.discountAmount;
  }
}