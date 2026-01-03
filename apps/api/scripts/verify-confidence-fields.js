/**
 * Verification script for confidence fields
 * 
 * This script verifies that:
 * 1. Confidence fields exist in the receipts table
 * 2. Simulated receipts have confidence values populated
 * 3. Existing receipts have been backfilled (if migration was run)
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyConfidenceFields() {
  console.log('🔍 Verifying confidence fields...\n');

  try {
    // 1. Check if columns exist by trying to query them
    console.log('1️⃣ Checking if confidence columns exist...');
    const { data: sampleReceipt, error: columnError } = await supabase
      .from('receipts')
      .select('confidence_score, confidence_label, confidence_reasons')
      .limit(1);

    if (columnError) {
      if (columnError.message?.includes('column') || columnError.message?.includes('does not exist')) {
        console.error('❌ Confidence columns do not exist. Run migration 006:');
        console.error('   See: apps/api/migrations/RUN_MIGRATION_006.md');
        process.exit(1);
      } else {
        throw columnError;
      }
    }

    console.log('✅ Confidence columns exist\n');

    // 2. Check simulated receipts
    console.log('2️⃣ Checking simulated receipts...');
    const { data: simulatedReceipts, error: simError } = await supabase
      .from('receipts')
      .select('id, payment_id, confidence_score, confidence_label, confidence_reasons, source')
      .eq('source', 'simulated')
      .order('created_at', { ascending: false })
      .limit(5);

    if (simError) {
      throw simError;
    }

    if (!simulatedReceipts || simulatedReceipts.length === 0) {
      console.log('⚠️  No simulated receipts found. Create one via /demo-store to test.\n');
    } else {
      console.log(`   Found ${simulatedReceipts.length} simulated receipt(s):\n`);
      
      let allValid = true;
      simulatedReceipts.forEach((receipt, idx) => {
        const hasScore = receipt.confidence_score !== null && receipt.confidence_score !== undefined;
        const hasLabel = receipt.confidence_label !== null && receipt.confidence_label !== undefined;
        const hasReasons = receipt.confidence_reasons !== null && receipt.confidence_reasons !== undefined;
        
        const isValid = hasScore && hasLabel && hasReasons;
        const isHighConfidence = receipt.confidence_label === 'HIGH' && 
                                 receipt.confidence_score >= 92 && 
                                 receipt.confidence_score <= 99;
        
        if (!isValid) {
          allValid = false;
          console.log(`   ❌ Receipt ${idx + 1} (${receipt.payment_id.substring(0, 12)}...):`);
          console.log(`      Missing confidence fields`);
        } else if (!isHighConfidence && receipt.confidence_label !== 'LOW' && receipt.confidence_label !== 'MEDIUM') {
          console.log(`   ⚠️  Receipt ${idx + 1} (${receipt.payment_id.substring(0, 12)}...):`);
          console.log(`      Score: ${receipt.confidence_score}, Label: ${receipt.confidence_label}`);
          console.log(`      (May be a low-confidence receipt)`);
        } else {
          console.log(`   ✅ Receipt ${idx + 1} (${receipt.payment_id.substring(0, 12)}...):`);
          console.log(`      Score: ${receipt.confidence_score}, Label: ${receipt.confidence_label}`);
          console.log(`      Reasons: ${Array.isArray(receipt.confidence_reasons) ? receipt.confidence_reasons.join(', ') : 'N/A'}`);
        }
      });

      if (allValid) {
        console.log('\n✅ All simulated receipts have confidence fields populated correctly!\n');
      } else {
        console.log('\n⚠️  Some simulated receipts are missing confidence fields.\n');
      }
    }

    // 3. Check all receipts for backfill
    console.log('3️⃣ Checking existing receipts (backfill status)...');
    const { data: allReceipts, error: allError } = await supabase
      .from('receipts')
      .select('id, confidence_score, confidence_label')
      .limit(100);

    if (allError) {
      throw allError;
    }

    const receiptsWithoutConfidence = allReceipts.filter(r => 
      r.confidence_score === null || r.confidence_label === null
    );

    if (receiptsWithoutConfidence.length > 0) {
      console.log(`⚠️  Found ${receiptsWithoutConfidence.length} receipt(s) without confidence fields.`);
      console.log('   Run migration 006 to backfill existing receipts:\n');
      console.log('   See: apps/api/migrations/RUN_MIGRATION_006.md\n');
    } else {
      console.log(`✅ All ${allReceipts.length} checked receipts have confidence fields.\n');
    }

    // 4. Summary
    console.log('📊 Summary:');
    console.log('   ✅ Confidence columns exist in receipts table');
    if (simulatedReceipts && simulatedReceipts.length > 0) {
      const validSimulated = simulatedReceipts.filter(r => 
        r.confidence_score !== null && r.confidence_label !== null && r.confidence_reasons !== null
      );
      console.log(`   ${validSimulated.length === simulatedReceipts.length ? '✅' : '⚠️ '} Simulated receipts: ${validSimulated.length}/${simulatedReceipts.length} have confidence fields`);
    }
    console.log(`   ${receiptsWithoutConfidence.length === 0 ? '✅' : '⚠️ '} Existing receipts: ${allReceipts.length - receiptsWithoutConfidence.length}/${allReceipts.length} have confidence fields`);
    
    console.log('\n✨ Verification complete!\n');

  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  }
}

verifyConfidenceFields();

