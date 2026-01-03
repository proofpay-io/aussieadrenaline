// Verify Square access token
const dotenv = require('dotenv');
const { SquareClient, SquareEnvironment } = require('square');

dotenv.config({ path: '.env.local' });

const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
const squareLocationId = process.env.SQUARE_LOCATION_ID;
const squareEnvironment = process.env.SQUARE_ENVIRONMENT || 'sandbox';

console.log('🔍 Verifying Square Configuration...\n');

if (!squareAccessToken) {
  console.error('❌ SQUARE_ACCESS_TOKEN not found in .env.local');
  process.exit(1);
}

if (!squareLocationId) {
  console.error('❌ SQUARE_LOCATION_ID not found in .env.local');
  process.exit(1);
}

console.log('✅ Environment variables found:');
console.log(`   Token length: ${squareAccessToken.length} characters`);
console.log(`   Location ID: ${squareLocationId}`);
console.log(`   Environment: ${squareEnvironment}\n`);

const client = new SquareClient({
  accessToken: squareAccessToken,
  environment: squareEnvironment === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
});

// Test token by listing locations
async function verifyToken() {
  console.log('📡 Testing token by listing locations...\n');

  try {
    // Square SDK v40 uses locations.list(), not locationsApi.listLocations()
    const locationsApi = client.locationsApi || client.locations;
    if (!locationsApi) {
      throw new Error('Square locations API is not available');
    }
    // Try list() first, fallback to listLocations()
    const listMethod = locationsApi.list || locationsApi.listLocations;
    if (!listMethod) {
      throw new Error('Square locations.list() method is not available');
    }
    const locationsResponse = await listMethod.call(locationsApi);
  
  if (locationsResponse.statusCode === 200) {
    const locations = locationsResponse.result.locations || [];
    console.log('✅ Token is VALID!\n');
    console.log(`📍 Found ${locations.length} location(s):`);
    locations.forEach(loc => {
      console.log(`   - ${loc.name} (${loc.id})`);
      if (loc.id === squareLocationId) {
        console.log('      ✅ This matches your SQUARE_LOCATION_ID');
      }
    });
    
    if (locations.length > 0 && !locations.find(l => l.id === squareLocationId)) {
      console.log(`\n⚠️  Warning: Your SQUARE_LOCATION_ID (${squareLocationId}) was not found in the list above.`);
      console.log('   Make sure you\'re using the correct location ID.');
    }
  } else {
    console.error(`❌ Unexpected status code: ${locationsResponse.statusCode}`);
  }
  } catch (error) {
    console.error('❌ Token verification FAILED\n');
    
    if (error.statusCode === 401) {
      console.error('🔐 Authentication Error:');
      console.error('   The access token is invalid, expired, or has been revoked.\n');
      console.error('   How to fix:');
      console.error('   1. Go to https://developer.squareup.com/apps');
      console.error('   2. Select your application');
      console.error('   3. Go to Credentials → Sandbox');
      console.error('   4. Copy the Access Token');
      console.error('   5. Update SQUARE_ACCESS_TOKEN in apps/web/.env.local');
      console.error('   6. Restart your Next.js dev server\n');
    } else if (error.errors && error.errors.length > 0) {
      console.error('Error details:');
      error.errors.forEach(err => {
        console.error(`   - ${err.category}: ${err.code}`);
        console.error(`     ${err.detail}`);
      });
    } else {
      console.error('Error:', error.message);
    }
    
    process.exit(1);
  }
}

// Run the verification
verifyToken().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

