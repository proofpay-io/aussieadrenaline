# Receipts API Endpoints

## Overview

The API provides endpoints to fetch receipts from Supabase. All endpoints use the service role key to query the database.

## Endpoints

### GET /api/receipts

List all receipts with their items.

**Request:**
```bash
GET /api/receipts
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "receipts": [
    {
      "id": "uuid-here",
      "payment_id": "square-payment-id",
      "amount": "25.50",
      "currency": "USD",
      "created_at": "2025-01-01T12:00:00Z",
      "updated_at": "2025-01-01T12:00:00Z",
      "receipt_items": [
        {
          "id": "uuid-here",
          "receipt_id": "uuid-here",
          "item_name": "Product Name",
          "item_price": "25.50",
          "quantity": 1,
          "created_at": "2025-01-01T12:00:00Z",
          "updated_at": "2025-01-01T12:00:00Z"
        }
      ]
    }
  ]
}
```

**Error Responses:**
- `503` - Database not configured
- `500` - Database error

### GET /api/receipts/:id

Get a specific receipt by ID with its items.

**Request:**
```bash
GET /api/receipts/{receipt-id}
```

**Response:**
```json
{
  "success": true,
  "receipt": {
    "id": "uuid-here",
    "payment_id": "square-payment-id",
    "amount": "25.50",
    "currency": "USD",
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-01T12:00:00Z",
    "receipt_items": [
      {
        "id": "uuid-here",
        "receipt_id": "uuid-here",
        "item_name": "Product Name",
        "item_price": "25.50",
        "quantity": 1,
        "created_at": "2025-01-01T12:00:00Z",
        "updated_at": "2025-01-01T12:00:00Z"
      }
    ]
  }
}
```

**Error Responses:**
- `404` - Receipt not found
- `503` - Database not configured
- `500` - Database error

## Testing

### Local Development

```bash
# List all receipts
curl http://localhost:4000/api/receipts

# Get specific receipt
curl http://localhost:4000/api/receipts/{receipt-id}
```

### Production (Vercel)

```bash
# List all receipts
curl https://aussieadrenaline-api.vercel.app/api/receipts

# Get specific receipt
curl https://aussieadrenaline-api.vercel.app/api/receipts/{receipt-id}
```

## Data Structure

### Receipt Object
- `id` (UUID) - Unique receipt identifier
- `payment_id` (TEXT) - Square payment ID
- `amount` (NUMERIC) - Payment amount
- `currency` (TEXT) - Currency code (e.g., "USD")
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp
- `receipt_items` (Array) - Array of receipt items

### Receipt Item Object
- `id` (UUID) - Unique item identifier
- `receipt_id` (UUID) - Foreign key to receipt
- `item_name` (TEXT) - Item name/description
- `item_price` (NUMERIC) - Price per item
- `quantity` (INTEGER) - Quantity purchased
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

## Notes

- All receipts are ordered by `created_at` descending (newest first)
- Receipt items are automatically included via Supabase's relationship query
- The API uses the service role key, so it bypasses Row Level Security (RLS)
- Empty arrays are returned if no receipts/items exist

