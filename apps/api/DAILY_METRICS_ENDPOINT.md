# Daily Metrics Endpoint

## Overview

The `/api/admin/metrics/daily` endpoint provides daily aggregated metrics for the last 30 days, including receipt creation, viewing, blocking, disputes, and confidence scores.

## Endpoints

**GET** `/api/admin/metrics/daily` - Returns JSON format  
**GET** `/api/admin/metrics/daily.csv` - Returns CSV format (download)

## Authentication

Protected with the same admin authentication as `/api/bank-admin` endpoints:
- Query parameter: `?secret=<BANK_ADMIN_SECRET>`
- Header: `X-Bank-Admin-Secret: <BANK_ADMIN_SECRET>`
- Environment variable: `BANK_ADMIN_SECRET` (defaults to `dev-secret-change-in-production` in dev mode)

## Response Format

```json
{
  "success": true,
  "period": {
    "start": "2024-01-01",
    "end": "2024-01-30",
    "days": 30
  },
  "metrics": [
    {
      "date": "2024-01-30",
      "receipts_created": 5,
      "receipts_viewed": 12,
      "receipt_view_blocked": 2,
      "disputes_created": 1,
      "avg_confidence_score": 87.5,
      "confidence_counts": {
        "HIGH": 3,
        "MEDIUM": 2,
        "LOW": 0
      }
    },
    {
      "date": "2024-01-29",
      "receipts_created": 3,
      "receipts_viewed": 8,
      "receipt_view_blocked": 1,
      "disputes_created": 0,
      "avg_confidence_score": 92.0,
      "confidence_counts": {
        "HIGH": 2,
        "MEDIUM": 1,
        "LOW": 0
      }
    }
    // ... 28 more days
  ]
}
```

## Metrics Explained

### Daily Metrics Fields

- **`date`** (string): Date in YYYY-MM-DD format
- **`receipts_created`** (number): Count of receipts created on this day (from `receipt_events` with `event_type='receipt_created'`)
- **`receipts_viewed`** (number): Count of receipt views on this day (from `receipt_events` with `event_type='receipt_viewed'`)
- **`receipt_view_blocked`** (number): Count of blocked receipt views on this day (from `receipt_events` with `event_type='receipt_view_blocked'`)
- **`disputes_created`** (number): Count of disputes created on this day (from `disputes` table)
- **`avg_confidence_score`** (number | null): Average confidence score for receipts created on this day (rounded to 2 decimals, null if no receipts with scores)
- **`confidence_counts`** (object): Count of receipts by confidence label:
  - `HIGH`: Count of receipts with `confidence_label='HIGH'`
  - `MEDIUM`: Count of receipts with `confidence_label='MEDIUM'`
  - `LOW`: Count of receipts with `confidence_label='LOW'`

## Data Sources

1. **receipt_events table:**
   - `receipts_created`: Events with `event_type='receipt_created'`
   - `receipts_viewed`: Events with `event_type='receipt_viewed'`
   - `receipt_view_blocked`: Events with `event_type='receipt_view_blocked'`

2. **receipts table:**
   - `avg_confidence_score`: Average of `confidence_score` for receipts created on each day
   - `confidence_counts`: Count by `confidence_label` for receipts created on each day

3. **disputes table:**
   - `disputes_created`: Count of disputes created on each day

## Performance

The endpoint uses **5 queries total**:
1. Single query for all `receipt_created` events (last 30 days)
2. Single query for all `receipt_viewed` events (last 30 days)
3. Single query for all `receipt_view_blocked` events (last 30 days)
4. Single query for all disputes (last 30 days)
5. Single query for all receipts with confidence data (last 30 days)

All aggregation is done in JavaScript after fetching the data, ensuring optimal database performance.

## Usage Examples

### cURL

```bash
# With query parameter
curl "http://localhost:4000/api/admin/metrics/daily?secret=your-secret"

# With header
curl -H "X-Bank-Admin-Secret: your-secret" \
  "http://localhost:4000/api/admin/metrics/daily"
```

### JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:4000/api/admin/metrics/daily?secret=your-secret');
const data = await response.json();
console.log(data.metrics); // Array of daily metrics
```

### Python

```python
import requests

url = "http://localhost:4000/api/admin/metrics/daily"
headers = {"X-Bank-Admin-Secret": "your-secret"}
response = requests.get(url, headers=headers)
data = response.json()
print(data['metrics'])
```

## Verification

### Test 1: Endpoint Returns JSON
1. Make a GET request to `/api/admin/metrics/daily?secret=dev-secret-change-in-production`
2. **Verify:**
   - ✅ Returns 200 OK
   - ✅ Response has `success: true`
   - ✅ Response has `period` object with start, end, days
   - ✅ Response has `metrics` array with 30 items

### Test 2: Daily Rows Structure
1. Check the first item in `metrics` array
2. **Verify:**
   - ✅ Has `date` field (YYYY-MM-DD format)
   - ✅ Has `receipts_created` (number)
   - ✅ Has `receipts_viewed` (number)
   - ✅ Has `receipt_view_blocked` (number)
   - ✅ Has `disputes_created` (number)
   - ✅ Has `avg_confidence_score` (number or null)
   - ✅ Has `confidence_counts` object with HIGH, MEDIUM, LOW

### Test 3: Numbers Match UI
1. Go to `/bank-admin` dashboard
2. Note the counts for last 7/30 days
3. Call `/api/admin/metrics/daily`
4. Sum up the last 7 days from the metrics array
5. **Verify:**
   - ✅ Sum of `receipts_created` matches dashboard "Receipts Created (7d)"
   - ✅ Sum of `receipts_viewed` matches dashboard "Receipt Views (7d)"
   - ✅ Sum of `disputes_created` matches dashboard "Disputes Submitted (7d)"

### Test 4: Authentication
1. Try accessing without secret: `/api/admin/metrics/daily`
2. **Verify:**
   - ✅ Returns 401 Unauthorized (if BANK_ADMIN_SECRET is set)
   - ✅ Returns 200 OK in dev mode (if secret is default)

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 503 Service Unavailable
```json
{
  "error": "Database not configured",
  "message": "Supabase connection is not available"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Error details..."
}
```

## Notes

- Dates are in UTC timezone
- Metrics are sorted by date (most recent first)
- Days with no activity will have all counts at 0
- `avg_confidence_score` is null if no receipts with confidence scores were created on that day
- Confidence counts only include receipts that have a `confidence_label` set

## CSV Export Endpoint

The `/api/admin/metrics/daily.csv` endpoint provides the same metrics in CSV format for direct download.

### CSV Format

**Headers:**
```
date,receipts_created,receipts_viewed,views_blocked,disputes_created,avg_confidence,high_confidence,medium_confidence,low_confidence
```

**Example Row:**
```
2024-01-30,5,12,2,1,87.5,3,2,0
```

### CSV Features

- **Content-Type:** `text/csv`
- **Content-Disposition:** `attachment; filename="proofpay-usage-report-YYYY-MM-DD.csv"`
- **Date Format:** ISO format (YYYY-MM-DD)
- **Avg Confidence:** Rounded to 1 decimal place
- **Empty Values:** Empty string for null `avg_confidence_score`

### Usage

```bash
# Download CSV file
curl "http://localhost:4000/api/admin/metrics/daily.csv?secret=your-secret" -o report.csv

# Or open in browser
# Navigate to: http://localhost:4000/api/admin/metrics/daily.csv?secret=your-secret
```

### Verification

1. **Download Test:**
   - Open `/api/admin/metrics/daily.csv?secret=dev-secret-change-in-production` in browser
   - **Verify:** File downloads with name `proofpay-usage-report-YYYY-MM-DD.csv`

2. **Content Test:**
   - Open downloaded CSV file
   - **Verify:**
     - ✅ Headers match: `date,receipts_created,receipts_viewed,views_blocked,disputes_created,avg_confidence,high_confidence,medium_confidence,low_confidence`
     - ✅ Dates are in ISO format (YYYY-MM-DD)
     - ✅ Numbers match JSON endpoint values
     - ✅ `avg_confidence` is rounded to 1 decimal (e.g., `87.5` not `87.50`)
     - ✅ Empty `avg_confidence` shows as empty string

