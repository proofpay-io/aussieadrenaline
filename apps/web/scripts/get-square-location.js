/**
 * Get Square Location ID
 * Usage: node scripts/get-square-location.js
 */

const { SquareClient, SquareEnvironment } = require('square');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
const squareEnvironment = process.env.SQUARE_ENVIRONMENT || 'sandbox';

if (!squareAccessToken) {
  console.error('❌ SQUARE_ACCESS_TOKEN not found in .env.local file');
  console.log('\n💡 Create a .env.local file in apps/web/ with:');
  console.log('   SQUARE_ACCESS_TOKEN=your_token_here');
  console.log('   SQUARE_ENVIRONMENT=sandbox\n');
  process.exit(1);
}

const client = new SquareClient({
  accessToken: squareAccessToken,
  environment: squareEnvironment === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
});

async function getLocations() {
  try {
    console.log('📡 Fetching Square locations...\n');

    const response = await client.locationsApi.listLocations();
    
    if (response.statusCode !== 200) {
      console.error('❌ Error fetching locations:', response.statusCode);
      process.exit(1);
    }

    const locations = response.result?.locations;

    if (!locations || locations.length === 0) {
      console.log('⚠️  No locations found in your Square account.');
      console.log('\n💡 You need to create a location first:');
      console.log('   1. Go to: https://developer.squareup.com/apps');
      console.log('   2. Select your app');
      console.log('   3. Go to Locations');
      console.log('   4. Create a location\n');
      process.exit(1);
    }

    console.log(`✅ Found ${locations.length} location(s):\n`);
    console.log('─'.repeat(80));

    locations.forEach((location, index) => {
      console.log(`\n${index + 1}. ${location.name || 'Unnamed Location'}`);
      console.log(`   Location ID: ${location.id}`);
      console.log(`   Address: ${location.address ? location.address.addressLine1 || 'N/A' : 'N/A'}`);
      console.log(`   Status: ${location.status || 'N/A'}`);
    });

    console.log('\n' + '─'.repeat(80));
    console.log('\n📋 Add this to your .env.local file:');
    console.log(`   SQUARE_LOCATION_ID=${locations[0].id}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.errors && error.errors.length > 0) {
      error.errors.forEach((e) => {
        console.error(`   - ${e.detail || e.message}`);
      });
    }
    process.exit(1);
  }
}

getLocations();

