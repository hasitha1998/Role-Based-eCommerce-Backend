import models from '../models/index.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function clearDatabase() {
  try {
    await models.sequelize.authenticate();
    console.log('✅ Connected to database\n');

    console.log('⚠️  WARNING: This will delete ALL data from your database!');
    console.log('━'.repeat(50));
    
    const answer = await askQuestion('Are you sure? Type "yes" to continue: ');
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('\n❌ Operation cancelled');
      rl.close();
      process.exit(0);
    }

    console.log('\n🔄 Clearing database...');
    
    // Delete in correct order (respecting foreign keys)
    await models.OrderItem.destroy({ where: {}, truncate: true, cascade: true });
    console.log('✅ OrderItems cleared');
    
    await models.Order.destroy({ where: {}, truncate: true, cascade: true });
    console.log('✅ Orders cleared');
    
    await models.Product.destroy({ where: {}, truncate: true, cascade: true });
    console.log('✅ Products cleared');
    
    await models.Category.destroy({ where: {}, truncate: true, cascade: true });
    console.log('✅ Categories cleared');
    
    await models.Setting.destroy({ where: {}, truncate: true, cascade: true });
    console.log('✅ Settings cleared');
    
    await models.User.destroy({ where: {}, truncate: true, cascade: true });
    console.log('✅ Users cleared');

    console.log('\n━'.repeat(50));
    console.log('✅ Database cleared successfully!');
    console.log('━'.repeat(50));
    console.log('\n💡 Run seed script to add sample data:');
    console.log('   node src/scripts/seedData.js\n');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    rl.close();
    process.exit(1);
  }
}

clearDatabase();