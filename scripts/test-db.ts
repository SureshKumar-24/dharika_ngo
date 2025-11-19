import { config } from 'dotenv';
import { resolve } from 'path';
import { testConnection, getVolunteers, getSuggestions } from '../src/lib/db';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🔍 Testing Neon Database Connection...\n');
  
  // Test connection
  console.log('1. Testing connection...');
  const connectionTest = await testConnection();
  
  if (!connectionTest.success) {
    console.error('❌ Connection failed!');
    process.exit(1);
  }
  
  console.log('✅ Connection successful!');
  console.log('   Server time:', connectionTest.timestamp);
  
  // Test reading volunteers
  console.log('\n2. Fetching volunteers...');
  try {
    const volunteers = await getVolunteers(5) as any[];
    console.log(`✅ Found ${volunteers.length} volunteer(s)`);
    if (volunteers.length > 0) {
      console.log('   Latest volunteer:', {
        name: volunteers[0].name,
        email: volunteers[0].email,
        interest: volunteers[0].interest,
        created_at: volunteers[0].created_at
      });
    }
  } catch (error: any) {
    console.error('❌ Error fetching volunteers:', error.message);
  }
  
  // Test reading suggestions
  console.log('\n3. Fetching suggestions...');
  try {
    const suggestions = await getSuggestions(5) as any[];
    console.log(`✅ Found ${suggestions.length} suggestion(s)`);
    if (suggestions.length > 0) {
      console.log('   Latest suggestion:', {
        name: suggestions[0].name || 'Anonymous',
        message: suggestions[0].message.substring(0, 50) + '...',
        created_at: suggestions[0].created_at
      });
    }
  } catch (error: any) {
    console.error('❌ Error fetching suggestions:', error.message);
  }
  
  console.log('\n✅ All tests completed!');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
