# Dispute API Documentation

## POST /api/disputes

Creates a new dispute for selected items in a receipt.

### Request

**Endpoint:** `POST /api/disputes`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "receipt_id": "uuid-of-receipt",
  "selected_items": [
    {
      "receipt_item_id": "uuid-of-receipt-item",
      "quantity": 1
    }
  ],
  "reason_code": "item_not_received",
  "notes": "Optional notes about the dispute"
}
```

**Required Fields:**
- `receipt_id` (string, UUID) - The ID of the receipt being disputed
- `selected_items` (array) - At least one item must be selected
  - Each item must have:
    - `receipt_item_id` (string, UUID) - The ID of the receipt item
    - `quantity` (number, optional) - Quantity to dispute (defaults to item's original quantity)
- `reason_code` (string) - Reason code for the dispute

**Optional Fields:**
- `notes` (string) - Additional notes about the dispute

### Response

**Success (201 Created):**
```json
{
  "success": true,
  "dispute_id": "uuid-of-dispute",
  "status": "submitted"
}
```

**Error Responses:**

**400 Bad Request** - Validation error:
```json
{
  "error": "Validation error",
  "message": "receipt_id is required"
}
```

**404 Not Found** - Receipt not found:
```json
{
  "error": "Receipt not found",
  "message": "No receipt found with ID: ..."
}
```

**500 Internal Server Error:**
```json
{
  "error": "Database error",
  "message": "Failed to create dispute: ..."
}
```

### Behavior

1. **Validates input:**
   - Checks that `receipt_id` is provided
   - Checks that at least one item is selected
   - Checks that `reason_code` is provided
   - Validates that receipt exists
   - Validates that selected items exist in the receipt

2. **Creates dispute record:**
   - Inserts row into `disputes` table
   - Sets `status` to `"submitted"`
   - Stores `reason_code` and optional `notes`

3. **Creates dispute items:**
   - Inserts rows into `dispute_items` table for each selected item
   - Calculates `amount_cents` for each item (price × quantity)
   - Stores `quantity` being disputed

4. **Calculates disputed total:**
   - Sums up all disputed amounts in cents
   - Used for event logging

5. **Logs event:**
   - Inserts `dispute_created` event into `receipt_events` table
   - Metadata includes: `dispute_id`, `reason_code`, `item_count`, `disputed_total_cents`

### Example Usage

**cURL:**
```bash
curl -X POST http://localhost:4000/api/disputes \
  -H "Content-Type: application/json" \
  -d '{
    "receipt_id": "123e4567-e89b-12d3-a456-426614174000",
    "selected_items": [
      {
        "receipt_item_id": "223e4567-e89b-12d3-a456-426614174000",
        "quantity": 1
      }
    ],
    "reason_code": "item_not_received",
    "notes": "Item was never delivered"
  }'
```

**JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:4000/api/disputes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    receipt_id: '123e4567-e89b-12d3-a456-426614174000',
    selected_items: [
      {
        receipt_item_id: '223e4567-e89b-12d3-a456-426614174000',
        quantity: 1
      }
    ],
    reason_code: 'item_not_received',
    notes: 'Item was never delivered'
  })
});

const data = await response.json();
console.log(data);
```

### Validation Rules

1. **receipt_id:**
   - Must be provided
   - Must be a valid UUID
   - Must exist in `receipts` table

2. **selected_items:**
   - Must be an array
   - Must contain at least one item
   - Each item must have `receipt_item_id`
   - Each `receipt_item_id` must exist in the receipt's items
   - `quantity` must be greater than 0 (defaults to item's original quantity)

3. **reason_code:**
   - Must be provided
   - Must be a non-empty string

4. **notes:**
   - Optional
   - Can be null or empty string

### Database Changes

After a successful dispute creation:

1. **disputes table:**
   - New row with `status = "submitted"`
   - Linked to receipt via `receipt_id`

2. **dispute_items table:**
   - One row per selected item
   - Linked to dispute via `dispute_id`
   - Linked to receipt item via `receipt_item_id`
   - Contains `quantity` and `amount_cents`

3. **receipt_events table:**
   - New `dispute_created` event
   - Contains metadata with dispute details

### Error Handling

- All validation errors return 400 with clear error messages
- Database errors return 500 with error details
- Event logging failures are non-blocking (don't fail the request)
- Dispute items creation failures are logged but don't fail the request

### Testing

**Test with valid data:**
```bash
# First, get a receipt ID and item ID from your database
# Then create a dispute:
curl -X POST http://localhost:4000/api/disputes \
  -H "Content-Type: application/json" \
  -d '{
    "receipt_id": "YOUR_RECEIPT_ID",
    "selected_items": [
      {
        "receipt_item_id": "YOUR_ITEM_ID",
        "quantity": 1
      }
    ],
    "reason_code": "item_not_received"
  }'
```

**Verify in Supabase:**
1. Check `disputes` table - should see new row with `status = "submitted"`
2. Check `dispute_items` table - should see rows for each selected item
3. Check `receipt_events` table - should see `dispute_created` event

### Next Steps

After creating a dispute:
- Dispute status can be updated via future endpoints
- Dispute can be linked to bank workflows
- Dispute events are logged for auditability

