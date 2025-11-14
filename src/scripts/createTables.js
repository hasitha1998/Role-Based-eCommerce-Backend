import models from '../models/index.js';

async function createTables() {
  try {
    console.log('🔄 Connecting to database...');
    await models.sequelize.authenticate();
    console.log('✅ Connected to database\n');

    console.log('🔄 Creating/updating tables...');
    await models.sequelize.sync({ force: false, alter: true });
    console.log('✅ All tables created/updated successfully!\n');

    console.log('📊 Created tables:');
    console.log('━'.repeat(50));
    
    const tables = await models.sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
      { type: models.sequelize.QueryTypes.SELECT }
    );
    
    tables.forEach((table, index) => {
      console.log(`${(index + 1).toString().padStart(2, ' ')}. ${table.table_name}`);
    });
    
    console.log('━'.repeat(50));
    console.log(`Total: ${tables.length} tables\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    process.exit(1);
  }
}

createTables();