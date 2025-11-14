import models from '../models/index.js';

async function listTables() {
  try {
    await models.sequelize.authenticate();
    console.log('✅ Connected to database\n');

    // Get all tables
    const tables = await models.sequelize.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public' 
       ORDER BY table_name`,
      { type: models.sequelize.QueryTypes.SELECT }
    );

    console.log('📊 Tables in database:');
    console.log('━'.repeat(50));
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found!');
      console.log('\n💡 Run your server to create tables:');
      console.log('   npm run dev');
    } else {
      tables.forEach((table, index) => {
        console.log(`${(index + 1).toString().padStart(2, ' ')}. ${table.table_name}`);
      });
      console.log('━'.repeat(50));
      console.log(`Total: ${tables.length} tables`);
    }

    console.log('\n📈 Record counts:');
    console.log('━'.repeat(50));

    // Count records in each table
    for (const table of tables) {
      try {
        const count = await models.sequelize.query(
          `SELECT COUNT(*) as count FROM "${table.table_name}"`,
          { type: models.sequelize.QueryTypes.SELECT }
        );
        const recordCount = count[0].count;
        console.log(`${table.table_name.padEnd(20, ' ')}: ${recordCount} record(s)`);
      } catch (err) {
        console.log(`${table.table_name.padEnd(20, ' ')}: Error reading`);
      }
    }
    
    console.log('━'.repeat(50));
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listTables();