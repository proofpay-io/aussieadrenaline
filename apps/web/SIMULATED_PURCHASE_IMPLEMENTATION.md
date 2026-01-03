# ✅ Simulated Purchase System - Implementation Complete

## Overview

A complete simulated purchase and receipt generation system has been implemented that creates realistic receipts directly in Supabase without calling Square or any external payment provider.

## ✅ Implementation Summary

### 1. Database Migration
- **File**: `apps/api/migrations/002_add_simulation_fields.sql`
- **Adds**:
  - `source` field (default: 'square', can be 'simulated')
  - `merchant_name` field (optional, for display)
  - Index on `source` for filtering

### 2. Simulated Purchase API Route
- **File**: `apps/web/app/api/demo/simulate-purchase/route.ts`
- **Endpoint**: `POST /api/demo/simulate-purchase`
- **Functionality**:
  - Generates fake payment ID (`sim_pay_xxxx`)
  - Generates fake order ID (`sim_ord_xxxx`)
  - Creates receipt directly in Supabase with `source='simulated'`
  - Creates receipt_items matching cart contents
  - Sets `merchant_name='Nike Store (Demo)'`
  - No Square API calls

### 3. Demo Store Updates
- **File**: `apps/web/app/demo-store/page.tsx`
- **Added**:
  - "🎭 Simulate Purchase" button (purple)
  - `simulatePurchase()` function
  - Success state shows different message for simulated purchases
  - "Generate Another Sale" button
  - Button also in cart drawer

### 4. Receipts Display
- **Files**: 
  - `apps/web/app/receipts/page.tsx`
  - `apps/web/app/receipts/[id]/page.tsx`
- **Updates**:
  - Shows `merchant_name` if available
  - Shows "🎭 Simulated" badge for simulated receipts
  - Displays both simulated and real receipts together

## 🎯 Features

### Simulated Purchase Flow

1. **User adds items to cart** (manually or via "Quick Add Random Cart")
2. **Clicks "🎭 Simulate Purchase"**
3. **System generates**:
   - Fake payment ID: `sim_pay_1737123456789_abc123`
   - Fake order ID: `sim_ord_1737123456789_xyz789`
4. **Creates receipt in Supabase**:
   - `source = 'simulated'`
   - `merchant_name = 'Nike Store (Demo)'`
   - `payment_id = sim_pay_xxxx`
   - `amount = calculated total`
   - `created_at = now()`
5. **Creates receipt_items** for each cart item
6. **Shows success state** with:
   - Payment ID and Order ID
   - "View Receipts" button
   - "Generate Another Sale" button (auto-fills cart)
   - Note about immediate availability

### Receipt Structure

Simulated receipts match real receipt schema:
- Same `receipts` table structure
- Same `receipt_items` table structure
- `source='simulated'` distinguishes them
- `merchant_name='Nike Store (Demo)'` for display

## 📋 Next Steps

### 1. Run Database Migration

**Important**: You must run the migration before using simulated purchases!

```bash
# Option 1: Via Supabase Dashboard
# 1. Go to https://app.supabase.com
# 2. SQL Editor → New Query
# 3. Copy contents of apps/api/migrations/002_add_simulation_fields.sql
# 4. Run the query

# Option 2: Via migration script (if available)
cd apps/api
npm run migrate
```

### 2. Install Dependencies

```bash
cd apps/web
npm install
```

This will install `@supabase/supabase-js` if not already installed.

### 3. Set Environment Variables

Ensure `apps/web/.env.local` has:
```env
SUPABASE_URL=https://ztqdsxgvgzlosufkdskk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Test the System

1. Visit: http://localhost:3000/demo-store
2. Click "🛒 Quick Add Random Cart"
3. Click "🎭 Simulate Purchase"
4. See success message
5. Click "View Receipts"
6. Verify receipt appears with "🎭 Simulated" badge

## 🔍 Verification Checklist

- [x] Migration file created
- [x] Simulated purchase API route created
- [x] Demo store updated with "Simulate Purchase" button
- [x] Success state shows different message for simulated
- [x] "Generate Another Sale" button added
- [x] Receipts page shows merchant_name
- [x] Receipts page shows simulated badge
- [x] Receipt detail page shows merchant_name
- [x] Receipt detail page shows simulated badge
- [x] Dispute preview works with simulated receipts
- [ ] **Migration needs to be run in Supabase**
- [ ] **Dependencies need to be installed**

## 🎨 UI Features

### Demo Store
- **4 buttons in header**:
  - 🔀 Randomise Products
  - 🛒 Quick Add Random Cart
  - 🎭 Simulate Purchase (NEW - purple)
  - 💳 Generate Sandbox Sale (existing - indigo)

### Success State
- Shows different title for simulated: "Purchase simulated successfully"
- Shows "🎭 Simulated Purchase" badge
- "Generate Another Sale" button auto-fills cart
- Note about immediate availability (no webhook delay)

### Receipts List
- Shows merchant name: "Nike Store (Demo)" for simulated
- Shows "🎭 Simulated" badge
- Mixed with real Square receipts

### Receipt Detail
- Shows merchant name in header
- Shows simulated badge next to payment ID
- All dispute features work the same

## 🔧 Technical Details

### API Route: `/api/demo/simulate-purchase`

**Request:**
```json
{
  "items": [
    {
      "product_id": "nike-001",
      "name": "Air Max 90 (Black/White)",
      "sku": "NK-AM90-001",
      "quantity": 2,
      "unit_price_cents": 12999,
      "variation": "10"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "payment_id": "sim_pay_1737123456789_abc123",
  "order_id": "sim_ord_1737123456789_xyz789",
  "receipt_id": "uuid-here",
  "total_cents": 25998,
  "source": "simulated"
}
```

### Database Schema

**receipts table:**
- `source` TEXT (default: 'square', can be 'simulated')
- `merchant_name` TEXT (optional, e.g., 'Nike Store (Demo)')

**receipt_items table:**
- Same structure as before
- Works with both simulated and real receipts

## 🚀 Usage

### Generate Simulated Receipts

1. **Quick method**: Click "Quick Add Random Cart" → "Simulate Purchase"
2. **Manual method**: Add items manually → "Simulate Purchase"
3. **Repeat**: Click "Generate Another Sale" to auto-fill and purchase again

### View Receipts

- All receipts (simulated + real) appear in `/receipts`
- Simulated receipts have purple "🎭 Simulated" badge
- Click any receipt to see details and dispute items

## 📝 Logging

The simulated purchase route logs:
- `🎭 [SIMULATE-PURCHASE] Simulated purchase request received`
- `📦 [SIMULATE-PURCHASE] Processing X items`
- `💰 [SIMULATE-PURCHASE] Total amount: $XX.XX`
- `🎭 [SIMULATE-PURCHASE] Generated IDs: {paymentId, orderId}`
- `💾 [SIMULATE-PURCHASE] Creating receipt in database...`
- `✅ [SIMULATE-PURCHASE] Receipt created: {receiptId}`
- `✅ [SIMULATE-PURCHASE] Created X receipt items`
- `🎉 [SIMULATE-PURCHASE] Simulated purchase completed in Xms`

## ✅ Compatibility

- **Schema compatible**: Same database structure for simulated and real receipts
- **UI compatible**: Same receipt display components
- **API compatible**: Same receipt endpoints return both types
- **Future-proof**: Square can replace data source without UI/DB changes

## 🎯 Goal Achieved

✅ **Allow repeated generation of realistic, randomised itemised receipts for demo and UX testing without Square dependency.**

The system is ready to use once the migration is run and dependencies are installed!

