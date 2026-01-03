/**
 * Check if receipt_events table exists in Supabase
 * Usage: node scripts/check-events-table.js
 */

import { supabase, isConfigured } from '../lib/db.js';

async function checkEventsTable() {
  if (!isConfigured() || !supabase) {
    console.error('❌ Supabase is not configured');
    console.error('   Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in apps/api/.env');
    process.exit(1);
  }

  console.log('🔍 Checking if receipt_events table exists...\n');

  try {
    // Try to query the receipt_events table
    const { data, error } = await supabase
      .from('receipt_events')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation')) {
        console.log('❌ receipt_events table does NOT exist\n');
        console.log('📋 To create the table, run migration 003:');
        console.log('   1. Go to Supabase Dashboard → SQL Editor');
        console.log('   2. Open: apps/api/migrations/003_add_audit_and_disputes_tables.sql');
        console.log('   3. Copy the entire SQL file');
        console.log('   4. Paste into SQL Editor and click Run');
        console.log('\n   See: apps/api/migrations/RUN_MIGRATION_003.md for detailed instructions\n');
        process.exit(1);
      } else {
        console.error('❌ Error checking table:', error.message);
        process.exit(1);
      }
    }

    console.log('✅ receipt_events table exists!\n');

    // Count events
    const { count, error: countError } = await supabase
      .from('receipt_events')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.warn('⚠️  Could not count events:', countError.message);
    } else {
      console.log(`📊 Total events: ${count || 0}`);
    }

    // Show recent events
    const { data: recentEvents, error: eventsError } = await supabase
      .from('receipt_events')
      .select('id, created_at, event_type, receipt_id')
      .order('created_at', { ascending: false })
      .limit(5);

    if (eventsError) {
      console.warn('⚠️  Could not fetch recent events:', eventsError.message);
    } else if (recentEvents && recentEvents.length > 0) {
      console.log('\n📋 Recent events:');
      recentEvents.forEach((event, idx) => {
        console.log(`   ${idx + 1}. ${event.event_type} - Receipt: ${event.receipt_id?.substring(0, 8)}... - ${event.created_at}`);
      });
    } else {
      console.log('\nℹ️  No events logged yet');
      console.log('   Create a simulated purchase or view a receipt to generate events');
    }

    console.log('\n✅ Table is ready for event logging!');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

checkEventsTable();

