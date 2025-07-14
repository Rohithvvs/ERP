import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { Item } from '../entities/Item';
import { Category } from '../entities/Category';
import { Like, LessThanOrEqual } from 'typeorm';

const router = Router();

// Get all items with optional filters
router.get('/', async (req, res) => {
  try {
    const { search, category, lowStock, page = 1, limit = 50 } = req.query;
    const itemRepository = AppDataSource.getRepository(Item);
    
    let whereConditions: any = { isActive: true };
    
    if (search) {
      whereConditions = [
        { ...whereConditions, name: Like(`%${search}%`) },
        { ...whereConditions, sku: Like(`%${search}%`) }
      ];
    }
    
    if (category) {
      whereConditions.categoryId = category;
    }
    
    const queryBuilder = itemRepository.createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .where(whereConditions)
      .orderBy('item.name', 'ASC')
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit));
    
    if (lowStock === 'true') {
      queryBuilder.andWhere('item.quantity <= item.lowStockThreshold');
    }
    
    const [items, total] = await queryBuilder.getManyAndCount();
    
    res.json({
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const itemRepository = AppDataSource.getRepository(Item);
    const item = await itemRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ['category']
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Failed to fetch item' });
  }
});

// Create new item
router.post('/', async (req, res) => {
  try {
    const itemRepository = AppDataSource.getRepository(Item);
    const { categoryId, ...itemData } = req.body;
    
    // Validate required fields
    if (!itemData.name || !itemData.sku || !itemData.costPrice || !itemData.salePrice) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if SKU already exists
    const existingItem = await itemRepository.findOne({ where: { sku: itemData.sku } });
    if (existingItem) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    
    // Validate category if provided
    if (categoryId) {
      const categoryRepository = AppDataSource.getRepository(Category);
      const category = await categoryRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }
    
    const item = itemRepository.create({ ...itemData, categoryId });
    const savedItem = await itemRepository.save(item);
    
    // Fetch the item with category relation
    const itemWithCategory = await itemRepository.findOne({
      where: { id: savedItem.id },
      relations: ['category']
    });
    
    res.status(201).json(itemWithCategory);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Failed to create item' });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const itemRepository = AppDataSource.getRepository(Item);
    const { categoryId, ...itemData } = req.body;
    
    const item = await itemRepository.findOne({ where: { id: Number(req.params.id) } });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if SKU already exists (for different item)
    if (itemData.sku && itemData.sku !== item.sku) {
      const existingItem = await itemRepository.findOne({ where: { sku: itemData.sku } });
      if (existingItem && existingItem.id !== item.id) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
    }
    
    // Validate category if provided
    if (categoryId) {
      const categoryRepository = AppDataSource.getRepository(Category);
      const category = await categoryRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }
    
    await itemRepository.update(item.id, { ...itemData, categoryId });
    
    // Fetch updated item with category
    const updatedItem = await itemRepository.findOne({
      where: { id: item.id },
      relations: ['category']
    });
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Failed to update item' });
  }
});

// Delete item (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const itemRepository = AppDataSource.getRepository(Item);
    const item = await itemRepository.findOne({ where: { id: Number(req.params.id) } });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await itemRepository.update(item.id, { isActive: false });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item' });
  }
});

// Get low stock items
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const itemRepository = AppDataSource.getRepository(Item);
    const lowStockItems = await itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .where('item.quantity <= item.lowStockThreshold')
      .andWhere('item.isActive = true')
      .orderBy('item.quantity', 'ASC')
      .getMany();
    
    res.json(lowStockItems);
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({ message: 'Failed to fetch low stock items' });
  }
});

export default router;