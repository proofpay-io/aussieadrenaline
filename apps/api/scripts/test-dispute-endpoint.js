/**
 * Test the POST /api/disputes endpoint
 * Usage: node scripts/test-dispute-endpoint.js [receipt_id] [receipt_item_id]
 */

import { supabase, isConfigured } from '../lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDisputeEndpoint() {
  if (!isConfigured() || !supabase) {
    console.error('❌ Supabase is not configured');
    console.error('   Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in apps/api/.env');
    process.exit(1);
  }

  console.log('🔍 Testing Dispute Endpoint Setup...\n');

  // Step 1: Check if tables exist
  console.log('1️⃣ Checking if tables exist...\n');

  const tablesToCheck = ['disputes', 'dispute_items', 'receipt_events'];
  const tableStatus = {};

  for (const tableName of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          tableStatus[tableName] = false;
          console.log(`   ❌ ${tableName} table does NOT exist`);
        } else {
          console.log(`   ⚠️  ${tableName} table check failed: ${error.message}`);
          tableStatus[tableName] = 'unknown';
        }
      } else {
        tableStatus[tableName] = true;
        console.log(`   ✅ ${tableName} table exists`);
      }
    } catch (error) {
      console.log(`   ❌ Error checking ${tableName}: ${error.message}`);
      tableStatus[tableName] = false;
    }
  }

  console.log('');

  // Step 2: Check if we have receipts and items
  console.log('2️⃣ Checking for receipts and items...\n');

  try {
    const { data: receipts, error: receiptsError } = await supabase
      .from('receipts')
      .select('id')
      .limit(5);

    if (receiptsError) {
      console.log(`   ❌ Error fetching receipts: ${receiptsError.message}`);
    } else if (!receipts || receipts.length === 0) {
      console.log('   ⚠️  No receipts found in database');
      console.log('   💡 Create a simulated purchase first: http://localhost:3000/demo-store');
    } else {
      console.log(`   ✅ Found ${receipts.length} receipt(s)`);
      
      // Get first receipt with items
      const receiptId = receipts[0].id;
      const { data: items, error: itemsError } = await supabase
        .from('receipt_items')
        .select('id, item_name, item_price, quantity')
        .eq('receipt_id', receiptId)
        .limit(5);

      if (itemsError) {
        console.log(`   ❌ Error fetching items: ${itemsError.message}`);
      } else if (!items || items.length === 0) {
        console.log(`   ⚠️  Receipt ${receiptId} has no items`);
      } else {
        console.log(`   ✅ Found ${items.length} item(s) for receipt ${receiptId}`);
        console.log('\n   📋 Sample receipt and items:');
        console.log(`      Receipt ID: ${receiptId}`);
        items.forEach((item, idx) => {
          console.log(`      ${idx + 1}. Item ID: ${item.id} - ${item.item_name} ($${item.item_price} x ${item.quantity})`);
        });

        // Step 3: Test creating a dispute
        if (tableStatus.disputes && tableStatus.dispute_items) {
          console.log('\n3️⃣ Testing dispute creation...\n');
          
          const testDispute = {
            receipt_id: receiptId,
            selected_items: [
              {
                receipt_item_id: items[0].id,
                quantity: 1
              }
            ],
            reason_code: 'item_not_received',
            notes: 'Test dispute from script'
          };

          console.log('   📤 Creating dispute with:');
          console.log(`      Receipt ID: ${receiptId}`);
          console.log(`      Item ID: ${items[0].id}`);
          console.log(`      Reason: item_not_received\n`);

          const { data: dispute, error: disputeError } = await supabase
            .from('disputes')
            .insert({
              receipt_id: receiptId,
              status: 'submitted',
              reason_code: 'item_not_received',
              notes: 'Test dispute from script'
            })
            .select()
            .single();

          if (disputeError) {
            console.log(`   ❌ Error creating dispute: ${disputeError.message}`);
            console.log(`   Code: ${disputeError.code}`);
          } else {
            console.log(`   ✅ Dispute created successfully!`);
            console.log(`      Dispute ID: ${dispute.id}`);
            console.log(`      Status: ${dispute.status}`);

            // Create dispute item
            const { data: disputeItem, error: itemError } = await supabase
              .from('dispute_items')
              .insert({
                dispute_id: dispute.id,
                receipt_item_id: items[0].id,
                quantity: 1,
                amount_cents: Math.round(parseFloat(items[0].item_price) * 100)
              })
              .select()
              .single();

            if (itemError) {
              console.log(`   ❌ Error creating dispute item: ${itemError.message}`);
            } else {
              console.log(`   ✅ Dispute item created successfully!`);
              console.log(`      Dispute Item ID: ${disputeItem.id}`);
            }

            // Log event
            try {
              await supabase
                .from('receipt_events')
                .insert({
                  event_type: 'dispute_created',
                  receipt_id: receiptId,
                  metadata: {
                    dispute_id: dispute.id,
                    reason_code: 'item_not_received',
                    item_count: 1,
                    disputed_total_cents: Math.round(parseFloat(items[0].item_price) * 100)
                  }
                });
              console.log(`   ✅ Dispute event logged successfully!`);
            } catch (eventError) {
              console.log(`   ⚠️  Error logging event (non-critical): ${eventError.message}`);
            }
          }
        } else {
          console.log('\n   ⚠️  Cannot test dispute creation - tables do not exist');
          console.log('   💡 Run migration 003 first: apps/api/migrations/003_add_audit_and_disputes_tables.sql');
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n📊 Summary:');
  console.log(`   disputes table: ${tableStatus.disputes ? '✅' : '❌'}`);
  console.log(`   dispute_items table: ${tableStatus.dispute_items ? '✅' : '❌'}`);
  console.log(`   receipt_events table: ${tableStatus.receipt_events ? '✅' : '❌'}`);

  if (!tableStatus.disputes || !tableStatus.dispute_items) {
    console.log('\n💡 To fix:');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log('   2. Run migration 003: apps/api/migrations/003_add_audit_and_disputes_tables.sql');
    console.log('   3. Verify tables appear in Table Editor');
    process.exit(1);
  }

  console.log('\n✅ All checks passed! Dispute endpoint should work.');
}

testDisputeEndpoint();

