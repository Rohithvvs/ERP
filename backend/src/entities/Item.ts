import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from './Category';
import { InvoiceItem } from './InvoiceItem';
import { PurchaseItem } from './PurchaseItem';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 10 })
  lowStockThreshold: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string; // kg, pieces, liters, etc.

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, category => category.items, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @OneToMany(() => InvoiceItem, invoiceItem => invoiceItem.item)
  invoiceItems: InvoiceItem[];

  @OneToMany(() => PurchaseItem, purchaseItem => purchaseItem.item)
  purchaseItems: PurchaseItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property to check if stock is low
  get isLowStock(): boolean {
    return this.quantity <= this.lowStockThreshold;
  }

  // Virtual property to calculate profit margin
  get profitMargin(): number {
    if (this.costPrice === 0) return 0;
    return ((this.salePrice - this.costPrice) / this.costPrice) * 100;
  }
}