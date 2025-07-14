import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Purchase } from './Purchase';
import { Item } from './Item';

@Entity('purchase_items')
export class PurchaseItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Purchase, purchase => purchase.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchaseId' })
  purchase: Purchase;

  @Column()
  purchaseId: number;

  @ManyToOne(() => Item, item => item.purchaseItems)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  itemId: number;

  @Column({ type: 'varchar', length: 255 })
  itemName: string; // Store name at time of purchase

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  receivedQuantity: number;

  // Virtual property to calculate line total
  get lineTotal(): number {
    return this.quantity * this.unitCost;
  }

  // Virtual property to check if fully received
  get isFullyReceived(): boolean {
    return this.receivedQuantity >= this.quantity;
  }
}