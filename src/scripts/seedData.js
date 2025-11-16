import models from '../models/index.js';
import bcrypt from 'bcrypt';

async function seedData() {
  try {
    await models.sequelize.authenticate();
    console.log('✅ Connected to database\n');

    console.log('🌱 Seeding database...\n');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await models.User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        email: 'admin@example.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true
      }
    });
    console.log('✅ Admin user created');

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await models.User.findOrCreate({
      where: { email: 'user@example.com' },
      defaults: {
        email: 'user@example.com',
        password: userPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        isActive: true
      }
    });
    console.log('✅ Regular user created');

    // Create categories
    const electronics = await models.Category.findOrCreate({
      where: { slug: 'electronics' },
      defaults: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        isActive: true
      }
    });
    console.log('✅ Electronics category created');

    const clothing = await models.Category.findOrCreate({
      where: { slug: 'clothing' },
      defaults: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        isActive: true
      }
    });
    console.log('✅ Clothing category created');

    // Create products
    const laptop = await models.Product.findOrCreate({
      where: { sku: 'LAPTOP-001' },
      defaults: {
        name: 'Premium Laptop',
        slug: 'premium-laptop',
        description: 'High-performance laptop for professionals',
        price: 1299.99,
        comparePrice: 1599.99,
        costPrice: 900.00,
        sku: 'LAPTOP-001',
        stock: 50,
        categoryId: electronics[0].id,
        isActive: true,
        isFeatured: true
      }
    });
    console.log('✅ Laptop product created');

    const tshirt = await models.Product.findOrCreate({
      where: { sku: 'TSHIRT-001' },
      defaults: {
        name: 'Classic T-Shirt',
        slug: 'classic-tshirt',
        description: 'Comfortable cotton t-shirt',
        price: 29.99,
        comparePrice: 39.99,
        costPrice: 15.00,
        sku: 'TSHIRT-001',
        stock: 200,
        categoryId: clothing[0].id,
        isActive: true,
        isFeatured: false
      }
    });
    console.log('✅ T-shirt product created');

    // Create settings
    const settings = [
      { key: 'site_name', value: 'eCommerce Store', description: 'Website name', type: 'string', isPublic: true },
      { key: 'contact_email', value: 'support@example.com', description: 'Contact email', type: 'string', isPublic: true },
      { key: 'currency', value: 'USD', description: 'Default currency', type: 'string', isPublic: true },
      { key: 'maintenance_mode', value: 'false', description: 'Enable maintenance mode', type: 'boolean', isPublic: false }
    ];

    for (const setting of settings) {
      await models.Setting.findOrCreate({
        where: { key: setting.key },
        defaults: setting
      });
    }
    console.log('✅ Settings created');

    console.log('\n━'.repeat(50));
    console.log('🎉 Database seeded successfully!');
    console.log('━'.repeat(50));
    console.log('\n📋 Test credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  user@example.com / user123');
    console.log('\n🔗 Login at: http://localhost:5000/admin\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedData();