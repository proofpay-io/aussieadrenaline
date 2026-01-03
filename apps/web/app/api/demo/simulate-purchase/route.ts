import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface CartItem {
  product_id: string;
  name: string;
  sku: string;
  quantity: number;
  unit_price_cents: number;
  variation?: string; // e.g., size, colorway
}

interface SimulatePurchaseRequest {
  items: CartItem[];
  low_confidence?: boolean;
  demo_refunded?: boolean;
  demo_disputed?: boolean;
  demo_expired_qr?: boolean;
}

// Initialize Supabase client
// Try multiple env var names for compatibility
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ [SIMULATE-PURCHASE] Supabase not configured');
}

const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Generate fake payment ID
function generateFakePaymentId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `sim_pay_${timestamp}_${random}`;
}

// Generate fake order ID
function generateFakeOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `sim_ord_${timestamp}_${random}`;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🎭 [SIMULATE-PURCHASE] Simulated purchase request received');

    if (!supabase) {
      console.error('❌ [SIMULATE-PURCHASE] Supabase not configured');
      return NextResponse.json(
        {
          error: 'Database not configured',
          message: 'Supabase connection is not available',
        },
        { status: 500 }
      );
    }

    // Parse request body
    let body: SimulatePurchaseRequest;
    try {
      body = await request.json();
    } catch (error) {
      console.error('❌ [SIMULATE-PURCHASE] Invalid JSON in request body:', error);
      return NextResponse.json(
        {
          error: 'Invalid request body',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      );
    }

    // Validate request body
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      console.error('❌ [SIMULATE-PURCHASE] Invalid items array');
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Items array is required and must not be empty',
        },
        { status: 400 }
      );
    }

    console.log(`📦 [SIMULATE-PURCHASE] Processing ${body.items.length} items`);

    // Validate each item
    for (const item of body.items) {
      if (!item.product_id || !item.name || !item.sku || !item.quantity || !item.unit_price_cents) {
        console.error('❌ [SIMULATE-PURCHASE] Invalid item:', item);
        return NextResponse.json(
          {
            error: 'Invalid item',
            message: 'Each item must have product_id, name, sku, quantity, and unit_price_cents',
          },
          { status: 400 }
        );
      }
    }

    // Calculate total
    const totalCents = body.items.reduce((sum, item) => {
      return sum + item.unit_price_cents * item.quantity;
    }, 0);

    const totalAmount = totalCents / 100; // Convert to decimal for database

    console.log(`💰 [SIMULATE-PURCHASE] Total amount: $${totalAmount.toFixed(2)}`);

    // Generate fake IDs
    const paymentId = generateFakePaymentId();
    const orderId = generateFakeOrderId();

    console.log(`🎭 [SIMULATE-PURCHASE] Generated IDs:`, {
      paymentId,
      orderId,
    });

    // Create receipt in Supabase
    console.log('💾 [SIMULATE-PURCHASE] Creating receipt in database...');
    
    // Generate confidence score based on low_confidence flag
    let confidenceScore: number;
    let confidenceLabel: string;
    let confidenceReasons: string[];
    
    if (body.low_confidence) {
      // Low confidence: 40-70, random
      confidenceScore = Math.floor(Math.random() * 31) + 40; // 40-70 inclusive
      // Randomly choose LOW or MEDIUM
      confidenceLabel = confidenceScore < 55 ? 'LOW' : 'MEDIUM';
      confidenceReasons = ['DESCRIPTOR_WEAK', 'TIME_WINDOW_WIDE'];
      console.log(`📊 [SIMULATE-PURCHASE] Generating LOW confidence receipt: ${confidenceScore} (${confidenceLabel})`);
    } else {
      // High confidence: 92-99, random
      confidenceScore = Math.floor(Math.random() * 8) + 92; // 92-99 inclusive
      confidenceLabel = 'HIGH';
      confidenceReasons = ['SOURCE_POS', 'TOTAL_EXACT', 'TIME_EXACT'];
      console.log(`📊 [SIMULATE-PURCHASE] Generating HIGH confidence receipt: ${confidenceScore}`);
    }
    
    // Build receipt data - start with required fields
    const receiptData: any = {
      payment_id: paymentId,
      amount: totalAmount,
      currency: 'AUD',
    };
    
    // Try to add optional fields (they might not exist if migration 002 wasn't run)
    // We'll attempt to insert them, and if they fail, we'll catch the error
    receiptData.source = 'simulated';
    receiptData.merchant_name = 'Nike Store (Demo)';
    receiptData.purchase_time = new Date().toISOString();
    
    // Add confidence fields for simulated receipts (migration 006)
    receiptData.confidence_score = confidenceScore;
    receiptData.confidence_label = confidenceLabel;
    receiptData.confidence_reasons = confidenceReasons;
    
    // Add demo flags for verification state simulation
    if (body.demo_refunded === true) {
      receiptData.demo_refunded = true;
    }
    if (body.demo_disputed === true) {
      receiptData.demo_disputed = true;
    }
    if (body.demo_expired_qr === true) {
      receiptData.demo_expired_qr = true;
    }
    
    const { data: receipt, error: receiptError } = await supabase
      .from('receipts')
      .insert(receiptData)
      .select()
      .single();

    if (receiptError) {
      // Check if it's a column that doesn't exist (42883 = undefined_column)
      if (receiptError.code === '42883' || receiptError.message?.includes('column') || receiptError.message?.includes('does not exist')) {
        console.warn('⚠️ [SIMULATE-PURCHASE] Optional columns may not exist, trying with basic schema only');
        // Retry with only basic required fields (without confidence fields if migration 006 not run)
        const basicReceiptData: any = {
          payment_id: paymentId,
          amount: totalAmount,
          currency: 'AUD',
        };
        
        // Try to add confidence fields if columns exist
        try {
          let confidenceScore: number;
          let confidenceLabel: string;
          let confidenceReasons: string[];
          
          if (body.low_confidence) {
            confidenceScore = Math.floor(Math.random() * 31) + 40; // 40-70
            confidenceLabel = confidenceScore < 55 ? 'LOW' : 'MEDIUM';
            confidenceReasons = ['DESCRIPTOR_WEAK', 'TIME_WINDOW_WIDE'];
          } else {
            confidenceScore = Math.floor(Math.random() * 8) + 92; // 92-99
            confidenceLabel = 'HIGH';
            confidenceReasons = ['SOURCE_POS', 'TOTAL_EXACT', 'TIME_EXACT'];
          }
          
          basicReceiptData.confidence_score = confidenceScore;
          basicReceiptData.confidence_label = confidenceLabel;
          basicReceiptData.confidence_reasons = confidenceReasons;
        } catch (e) {
          // Ignore if confidence columns don't exist
        }
        
        // Add demo flags (these columns may not exist yet, but we'll try)
        try {
          basicReceiptData.demo_refunded = body.demo_refunded === true;
          basicReceiptData.demo_disputed = body.demo_disputed === true;
          basicReceiptData.demo_expired_qr = body.demo_expired_qr === true;
        } catch (e) {
          // Ignore if demo flag columns don't exist
        }
        
        const { data: basicReceipt, error: basicError } = await supabase
          .from('receipts')
          .insert(basicReceiptData)
          .select()
          .single();

        if (basicError) {
          console.error('❌ [SIMULATE-PURCHASE] Error creating receipt with basic schema:', basicError);
          throw basicError;
        }
        
        // Use basic receipt
        const receiptId = basicReceipt.id;
        console.log(`✅ [SIMULATE-PURCHASE] Receipt created (basic schema): ${receiptId}`);

        // Create receipt items
        console.log('💾 [SIMULATE-PURCHASE] Creating receipt items...');
        const receiptItems = body.items.map(item => ({
          receipt_id: receiptId,
          item_name: item.name + (item.variation ? ` (${item.variation})` : ''),
          item_price: item.unit_price_cents / 100,
          quantity: item.quantity,
        }));

        const { data: items, error: itemsError } = await supabase
          .from('receipt_items')
          .insert(receiptItems)
          .select();

        if (itemsError) {
          console.error('❌ [SIMULATE-PURCHASE] Error creating receipt items:', itemsError);
          throw itemsError;
        }

        console.log(`✅ [SIMULATE-PURCHASE] Created ${items.length} receipt items`);

        // Log receipt_created event (non-blocking)
        try {
          await supabase
            .from('receipt_events')
            .insert({
              event_type: 'receipt_created',
              receipt_id: receiptId,
              metadata: {
                source: 'simulated',
                total: totalAmount,
                total_cents: totalCents,
                item_count: body.items.length,
                payment_id: paymentId,
                order_id: orderId,
              },
            });
          console.log('✅ [SIMULATE-PURCHASE] Receipt created event logged');
        } catch (eventError: any) {
          // Log event errors but don't fail the request
          if (eventError.code === '42P01' || eventError.message?.includes('does not exist')) {
            console.warn('⚠️ [SIMULATE-PURCHASE] receipt_events table does not exist. Run migration 003 to enable event logging.');
          } else {
            console.warn('⚠️ [SIMULATE-PURCHASE] Failed to log receipt_created event (non-critical):', eventError.message);
          }
        }

        const duration = Date.now() - startTime;
        console.log(`🎉 [SIMULATE-PURCHASE] Simulated purchase completed in ${duration}ms`);

        return NextResponse.json({
          success: true,
          payment_id: paymentId,
          order_id: orderId,
          receipt_id: receiptId,
          total_cents: totalCents,
          source: 'simulated',
        });
      }
      
      // Check if it's a duplicate (payment_id already exists - very unlikely with timestamp)
      if (receiptError.code === '23505') {
        console.warn('⚠️ [SIMULATE-PURCHASE] Receipt already exists, generating new payment ID');
        // Retry with new payment ID
        const newPaymentId = generateFakePaymentId();
        
        // Generate confidence score based on low_confidence flag
        let confidenceScore: number;
        let confidenceLabel: string;
        let confidenceReasons: string[];
        
        if (body.low_confidence) {
          confidenceScore = Math.floor(Math.random() * 31) + 40; // 40-70
          confidenceLabel = confidenceScore < 55 ? 'LOW' : 'MEDIUM';
          confidenceReasons = ['DESCRIPTOR_WEAK', 'TIME_WINDOW_WIDE'];
        } else {
          confidenceScore = Math.floor(Math.random() * 8) + 92; // 92-99
          confidenceLabel = 'HIGH';
          confidenceReasons = ['SOURCE_POS', 'TOTAL_EXACT', 'TIME_EXACT'];
        }
        
        const retryReceiptData: any = {
          payment_id: newPaymentId,
          amount: totalAmount,
          currency: 'AUD',
          source: 'simulated',
          merchant_name: 'Nike Store (Demo)',
          purchase_time: new Date().toISOString(),
          confidence_score: confidenceScore,
          confidence_label: confidenceLabel,
          confidence_reasons: confidenceReasons,
          // Add demo flags
          demo_refunded: body.demo_refunded === true,
          demo_disputed: body.demo_disputed === true,
          demo_expired_qr: body.demo_expired_qr === true,
        };
        
        const { data: retryReceipt, error: retryError } = await supabase
          .from('receipts')
          .insert(retryReceiptData)
          .select()
          .single();

        if (retryError) {
          console.error('❌ [SIMULATE-PURCHASE] Error creating receipt (retry):', retryError);
          throw retryError;
        }

        // Use retry receipt
        const receiptId = retryReceipt.id;
        const finalPaymentId = newPaymentId;

        // Create receipt items
        console.log('💾 [SIMULATE-PURCHASE] Creating receipt items...');
        const receiptItems = body.items.map(item => ({
          receipt_id: receiptId,
          item_name: item.name,
          item_price: item.unit_price_cents / 100, // Convert to decimal
          quantity: item.quantity,
        }));

        const { data: items, error: itemsError } = await supabase
          .from('receipt_items')
          .insert(receiptItems)
          .select();

        if (itemsError) {
          console.error('❌ [SIMULATE-PURCHASE] Error creating receipt items:', itemsError);
          throw itemsError;
        }

        console.log(`✅ [SIMULATE-PURCHASE] Created ${items.length} receipt items`);

        // If demo_expired_qr is enabled, create a share token with expired date
        if (body.demo_expired_qr === true) {
          try {
            // Create a share token that's already expired (set expires_at to past date)
            const expiredDate = new Date();
            expiredDate.setHours(expiredDate.getHours() - 1); // 1 hour ago
            
            // Generate a simple token
            const token = `demo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
            
            await supabase
              .from('receipt_shares')
              .insert({
                receipt_id: receiptId,
                token: token,
                expires_at: expiredDate.toISOString(),
                view_count: 0,
                status: 'active',
                single_use: false,
              });
            
            console.log('✅ [SIMULATE-PURCHASE] Created expired QR token for demo');
          } catch (shareError: any) {
            // Non-critical - just log warning
            if (shareError.code === '42P01' || shareError.message?.includes('does not exist')) {
              console.warn('⚠️ [SIMULATE-PURCHASE] receipt_shares table does not exist. Run migration 012 to enable QR sharing.');
            } else {
              console.warn('⚠️ [SIMULATE-PURCHASE] Failed to create expired QR token (non-critical):', shareError.message);
            }
          }
        }

        // Log receipt_created event (non-blocking)
        try {
          await supabase
            .from('receipt_events')
            .insert({
              event_type: 'receipt_created',
              receipt_id: receiptId,
              metadata: {
                source: 'simulated',
                total: totalAmount,
                total_cents: totalCents,
                item_count: body.items.length,
                payment_id: finalPaymentId,
                order_id: orderId,
              },
            });
          console.log('✅ [SIMULATE-PURCHASE] Receipt created event logged');
        } catch (eventError: any) {
          // Log event errors but don't fail the request
          if (eventError.code === '42P01' || eventError.message?.includes('does not exist')) {
            console.warn('⚠️ [SIMULATE-PURCHASE] receipt_events table does not exist. Run migration 003 to enable event logging.');
          } else {
            console.warn('⚠️ [SIMULATE-PURCHASE] Failed to log receipt_created event (non-critical):', eventError.message);
          }
        }

        const duration = Date.now() - startTime;
        console.log(`🎉 [SIMULATE-PURCHASE] Simulated purchase completed in ${duration}ms`);

        return NextResponse.json({
          success: true,
          payment_id: finalPaymentId,
          order_id: orderId,
          receipt_id: receiptId,
          total_cents: totalCents,
          source: 'simulated',
        });
      } else {
        console.error('❌ [SIMULATE-PURCHASE] Error creating receipt:', receiptError);
        throw receiptError;
      }
    }

    const receiptId = receipt.id;
    console.log(`✅ [SIMULATE-PURCHASE] Receipt created: ${receiptId}`);

    // Create receipt items
    console.log('💾 [SIMULATE-PURCHASE] Creating receipt items...');
    const receiptItems = body.items.map(item => ({
      receipt_id: receiptId,
      item_name: item.name,
      item_price: item.unit_price_cents / 100, // Convert to decimal
      quantity: item.quantity,
    }));

    const { data: items, error: itemsError } = await supabase
      .from('receipt_items')
      .insert(receiptItems)
      .select();

    if (itemsError) {
      console.error('❌ [SIMULATE-PURCHASE] Error creating receipt items:', itemsError);
      throw itemsError;
    }

    console.log(`✅ [SIMULATE-PURCHASE] Created ${items.length} receipt items`);

    // If demo_expired_qr is enabled, create a share token with expired date
    if (body.demo_expired_qr === true) {
      try {
        // Create a share token that's already expired (set expires_at to past date)
        const expiredDate = new Date();
        expiredDate.setHours(expiredDate.getHours() - 1); // 1 hour ago
        
        // Generate a simple token
        const token = `demo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        
        await supabase
          .from('receipt_shares')
          .insert({
            receipt_id: receiptId,
            token: token,
            expires_at: expiredDate.toISOString(),
            view_count: 0,
            status: 'active',
            single_use: false,
          });
        
        console.log('✅ [SIMULATE-PURCHASE] Created expired QR token for demo');
      } catch (shareError: any) {
        // Non-critical - just log warning
        if (shareError.code === '42P01' || shareError.message?.includes('does not exist')) {
          console.warn('⚠️ [SIMULATE-PURCHASE] receipt_shares table does not exist. Run migration 012 to enable QR sharing.');
        } else {
          console.warn('⚠️ [SIMULATE-PURCHASE] Failed to create expired QR token (non-critical):', shareError.message);
        }
      }
    }

    // Log receipt_created event (non-blocking)
    try {
      await supabase
        .from('receipt_events')
        .insert({
          event_type: 'receipt_created',
          receipt_id: receiptId,
          metadata: {
            source: 'simulated',
            total: totalAmount,
            total_cents: totalCents,
            item_count: body.items.length,
            payment_id: paymentId,
            order_id: orderId,
          },
        });
      console.log('✅ [SIMULATE-PURCHASE] Receipt created event logged');
    } catch (eventError: any) {
      // Log event errors but don't fail the request
      if (eventError.code === '42P01' || eventError.message?.includes('does not exist')) {
        console.warn('⚠️ [SIMULATE-PURCHASE] receipt_events table does not exist. Run migration 003 to enable event logging.');
      } else {
        console.warn('⚠️ [SIMULATE-PURCHASE] Failed to log receipt_created event (non-critical):', eventError.message);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`🎉 [SIMULATE-PURCHASE] Simulated purchase completed in ${duration}ms`);
    console.log(`📋 [SIMULATE-PURCHASE] Receipt ID: ${receiptId}, Payment ID: ${paymentId}, Order ID: ${orderId}`);

    return NextResponse.json({
      success: true,
      payment_id: paymentId,
      order_id: orderId,
      receipt_id: receiptId,
      total_cents: totalCents,
      source: 'simulated',
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ [SIMULATE-PURCHASE] Error after ${duration}ms:`, error);
    
    // Log detailed error information
    if (error.message) {
      console.error('Error message:', error.message);
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.details) {
      console.error('Error details:', error.details);
    }
    if (error.hint) {
      console.error('Error hint:', error.hint);
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error.details || error.hint || undefined,
      },
      { status: 500 }
    );
  }
}

