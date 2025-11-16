// src/scripts/seedCategories.js

import models from '../models/index.js';

async function seedCategories() {
  try {
    await models.sequelize.authenticate();
    console.log('✅ Connected to database');

    const existing = await models.Category.findAll();
    if (existing.length > 0) {
      console.log('⚠️  Categories already exist!');
      process.exit(0);
    }

    await models.Category.bulkCreate([
      { name: 'Electronics', slug: 'electronics', isActive: true },
      { name: 'Clothing', slug: 'clothing', isActive: true },
      { name: 'Books', slug: 'books', isActive: true },
      { name: 'Home & Garden', slug: 'home-garden', isActive: true },
      { name: 'Sports', slug: 'sports', isActive: true }
    ]);

    console.log('✅ 5 Categories created!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedCategories();