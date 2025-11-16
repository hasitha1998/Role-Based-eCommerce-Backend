import sequelize from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...\n');
    
    await sequelize.authenticate();
    
    console.log('✅ Database connection successful!');
    console.log('━'.repeat(50));
    console.log('📊 Database:', process.env.DB_NAME);
    console.log('🖥️  Host:', process.env.DB_HOST);
    console.log('🔌 Port:', process.env.DB_PORT);
    console.log('👤 User:', process.env.DB_USER);
    console.log('━'.repeat(50));
    console.log('\n✅ Your database is ready to use!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('━'.repeat(50));
    console.error('Error:', error.message);
    console.error('━'.repeat(50));
    console.error('\n🔍 Troubleshooting steps:');
    console.error('1. Check your .env file exists');
    console.error('2. Verify DATABASE_URL has ?sslmode=require');
    console.error('3. Ensure DATABASE_URL is wrapped in single quotes');
    console.error('4. Check your Neon database is active');
    console.error('5. Verify your internet connection\n');
    
    process.exit(1);
  }
}

testConnection();