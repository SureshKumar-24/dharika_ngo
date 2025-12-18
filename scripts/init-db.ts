import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeDatabase, testConnection } from '../src/lib/db';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('Testing database connection...');
  const connectionTest = await testConnection();
  
  if (!connectionTest.success) {
    console.error('❌ Database connection failed!');
    console.error('Please check your DATABASE_URL in .env.local');
    process.exit(1);
  }
  
  console.log('✅ Database connection successful!');
  console.log('Timestamp:', connectionTest.timestamp);
  
  console.log('\nInitializing database tables...');
  await initializeDatabase();
  
  console.log('✅ Database initialization complete!');
  console.log('\nTables created:');
  console.log('  - volunteers');
  console.log('  - suggestions');
  console.log('  - student_queries');
  console.log('  - food_alerts');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
