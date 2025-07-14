import { DataSource } from 'typeorm';
import { Item } from '../entities/Item';
import { Category } from '../entities/Category';
import { Customer } from '../entities/Customer';
import { Supplier } from '../entities/Supplier';
import { Invoice } from '../entities/Invoice';
import { InvoiceItem } from '../entities/InvoiceItem';
import { Purchase } from '../entities/Purchase';
import { PurchaseItem } from '../entities/PurchaseItem';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'erp_database.db',
  synchronize: true, // Set to false in production
  logging: false,
  entities: [
    Item,
    Category,
    Customer,
    Supplier,
    Invoice,
    InvoiceItem,
    Purchase,
    PurchaseItem
  ],
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    throw error;
  }
};