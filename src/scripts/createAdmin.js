import models from '../models/index.js';

async function createAdmin() {
  try {
    await models.sequelize.authenticate();
    console.log('✅ Connected to database');

    await models.User.destroy({ 
      where: { email: 'admin@admin.com' } 
    });
    console.log('🗑️  Deleted old admin (if existed)');

    // Just pass plain password - the beforeCreate hook will hash it
    const admin = await models.User.create({
      email: 'admin@admin.com',
      password: 'admin123',  // ← Plain text, hook hashes automatically
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━'.repeat(50));
    console.log('📧 Email:    admin@admin.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role:     admin');
    console.log('━'.repeat(50));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();