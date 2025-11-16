// backend/src/routes/categories.js

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import models from '../models/index.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await models.Category.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await models.Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create category (admin only)
router.post('/', 
  authenticateToken,
  requirePermission('categories', 'create'),
  async (req, res) => {
    try {
      const category = await models.Category.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Update category (admin only)
router.put('/:id',
  authenticateToken,
  requirePermission('categories', 'update'),
  async (req, res) => {
    try {
      const category = await models.Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      await category.update(req.body);
      res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Delete category (admin only)
router.delete('/:id',
  authenticateToken,
  requirePermission('categories', 'delete'),
  async (req, res) => {
    try {
      const category = await models.Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      await category.destroy();
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;