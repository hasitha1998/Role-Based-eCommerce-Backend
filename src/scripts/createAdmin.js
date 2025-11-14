import models from '../models/index.js';
import bcrypt from 'bcrypt';

async function createAdmin() {
  try {
    await models.sequelize.authenticate();
    console.log('✅ Connected to database');

    // Check if admin already exists
    const existingAdmin = await models.User.findOne({ 
      where: { email: 'admin@example.com' } 
    });

    if (existingAdmin) {
      console.log('\n⚠️  Admin user already exists!');
      console.log('━'.repeat(50));
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Role:', existingAdmin.role);
      console.log('━'.repeat(50));
      console.log('\n💡 Use these credentials to login:');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
      console.log('\n🔗 Login at: http://localhost:5000/admin');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await models.User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━'.repeat(50));
    console.log('📧 Email:    admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role:     admin');
    console.log('━'.repeat(50));
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
    console.log('\n🔗 Login at:  http://localhost:5000/admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();