import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';
import { Like } from 'typeorm';

const router = Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const categoryRepository = AppDataSource.getRepository(Category);
    
    let whereConditions: any = { isActive: true };
    
    if (search) {
      whereConditions.name = Like(`%${search}%`);
    }
    
    const [categories, total] = await categoryRepository.findAndCount({
      where: whereConditions,
      order: { name: 'ASC' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      relations: ['items']
    });
    
    res.json({
      categories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const categoryRepository = AppDataSource.getRepository(Category);
    const category = await categoryRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ['items']
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
});

// Create new category
router.post('/', async (req, res) => {
  try {
    const categoryRepository = AppDataSource.getRepository(Category);
    const { name, description, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category name already exists
    const existingCategory = await categoryRepository.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    
    const category = categoryRepository.create({
      name,
      description,
      color: color || '#3B82F6'
    });
    
    const savedCategory = await categoryRepository.save(category);
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Failed to create category' });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const categoryRepository = AppDataSource.getRepository(Category);
    const { name, description, color } = req.body;
    
    const category = await categoryRepository.findOne({ where: { id: Number(req.params.id) } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if category name already exists (for different category)
    if (name && name !== category.name) {
      const existingCategory = await categoryRepository.findOne({ where: { name } });
      if (existingCategory && existingCategory.id !== category.id) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
    }
    
    await categoryRepository.update(category.id, {
      name: name || category.name,
      description,
      color: color || category.color
    });
    
    const updatedCategory = await categoryRepository.findOne({
      where: { id: category.id },
      relations: ['items']
    });
    
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Failed to update category' });
  }
});

// Delete category (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const categoryRepository = AppDataSource.getRepository(Category);
    const category = await categoryRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ['items']
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if category has active items
    const activeItems = category.items?.filter(item => item.isActive) || [];
    if (activeItems.length > 0) {
      return res.status(400).json({
        message: `Cannot delete category. It has ${activeItems.length} active items.`
      });
    }
    
    await categoryRepository.update(category.id, { isActive: false });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
});

export default router;