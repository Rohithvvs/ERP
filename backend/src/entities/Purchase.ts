import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Supplier } from './Supplier';
import { PurchaseItem } from './PurchaseItem';

export enum PurchaseStatus {
  PENDING = 'pending',
  ORDERED = 'ordered',
  RECEIVED = 'received',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid'
}

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  purchaseNumber: string;

  @Column({ type: 'date' })
  purchaseDate: Date;

  @Column({ type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ type: 'date', nullable: true })
  actualDeliveryDate: Date;

  @ManyToOne(() => Supplier, supplier => supplier.purchases)
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @Column()
  supplierId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({
    type: 'varchar',
    length: 20,
    enum: PurchaseStatus,
    default: PurchaseStatus.PENDING
  })
  status: PurchaseStatus;

  @Column({
    type: 'varchar',
    length: 20,
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => PurchaseItem, purchaseItem => purchaseItem.purchase, { cascade: true })
  items: PurchaseItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property to get remaining balance
  get remainingBalance(): number {
    return this.total - this.paidAmount;
  }

  // Virtual property to check if purchase is fully paid
  get isFullyPaid(): boolean {
    return this.paidAmount >= this.total;
  }
}