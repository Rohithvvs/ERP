import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Invoice } from './Invoice';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  company: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  postalCode: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  creditLimit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  outstandingBalance: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => Invoice, invoice => invoice.customer)
  invoices: Invoice[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property to check if customer has exceeded credit limit
  get hasExceededCreditLimit(): boolean {
    return this.outstandingBalance > this.creditLimit;
  }
}