# Receipts Page Documentation

## Overview

The receipts page allows customers to view all their purchase receipts fetched from the API.

## Pages Created

### 1. `/receipts` - Receipts List Page
**File:** `apps/web/app/receipts/page.tsx`

**Features:**
- Fetches receipts from `/api/receipts` endpoint
- Displays merchant name, date, and amount for each receipt
- Links to individual receipt detail pages
- Shows loading state while fetching
- Handles error states gracefully
- Displays empty state when no receipts exist

**Displayed Information:**
- Merchant name (currently shows "Merchant" as placeholder)
- Payment ID (first 8 characters)
- Date (formatted: "Month Day, Year at HH:MM")
- Amount (formatted as currency)
- Item count (if items exist)

### 2. `/receipts/[id]` - Receipt Detail Page
**File:** `apps/web/app/receipts/[id]/page.tsx`

**Features:**
- Fetches specific receipt from `/api/receipts/:id` endpoint
- Displays full receipt details
- Shows all receipt items with quantities and prices
- Calculates and displays total
- Links back to receipts list

**Displayed Information:**
- Full receipt details
- Payment ID
- Date and time
- Receipt ID
- List of all items with:
  - Item name
  - Quantity
  - Price per item
  - Total per item (if quantity > 1)
- Grand total

## API Integration

### API Endpoints Used

1. **GET /api/receipts**
   - Fetches all receipts
   - Used in receipts list page

2. **GET /api/receipts/:id**
   - Fetches specific receipt by ID
   - Used in receipt detail page

### API URL Configuration

The app uses:
- **Production:** `https://aussieadrenaline-api.vercel.app`
- **Local Development:** `http://localhost:4000` (fallback)

The API URL is determined at runtime based on the environment.

## UI Features

### Design
- Modern, clean interface using Tailwind CSS
- Gradient background (blue to indigo)
- Card-based layout for receipts
- Hover effects on clickable items
- Responsive design

### User Experience
- Loading spinners during data fetch
- Error messages with helpful information
- Empty state messaging
- Smooth navigation between pages
- Currency formatting
- Date formatting

## Navigation

- **Home Page** → Link to "View My Receipts"
- **Receipts List** → Links to individual receipt detail pages
- **Receipt Detail** → Link back to receipts list

## Testing

### Local Development

1. Start the web app:
   ```bash
   cd apps/web
   npm run dev
   ```

2. Visit:
   - Home: `http://localhost:3000`
   - Receipts: `http://localhost:3000/receipts`
   - Receipt Detail: `http://localhost:3000/receipts/{receipt-id}`

### Verify Functionality

✅ **Receipts List Page:**
- Fetches receipts from API
- Displays merchant name, date, amount
- Links to detail pages work
- Handles empty state
- Handles error state

✅ **Receipt Detail Page:**
- Fetches receipt by ID
- Displays all receipt information
- Shows receipt items
- Calculates totals correctly
- Links back to list work

## Data Structure

### Receipt Object
```typescript
interface Receipt {
  id: string;
  payment_id: string;
  amount: string;
  currency: string;
  created_at: string;
  updated_at: string;
  receipt_items: ReceiptItem[];
}
```

### Receipt Item Object
```typescript
interface ReceiptItem {
  id: string;
  receipt_id: string;
  item_name: string;
  item_price: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}
```

## Future Enhancements

- Add merchant name from Square API
- Add search/filter functionality
- Add pagination for large receipt lists
- Add print receipt functionality
- Add receipt export (PDF, CSV)
- Add date range filtering

