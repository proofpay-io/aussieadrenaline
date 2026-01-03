# Dispute Selected Items Feature

## Overview

The dispute feature allows customers to select specific items from a receipt and initiate a dispute process. This provides item-level dispute functionality with a clear confirmation flow.

## Features

### 1. Item Selection
- ✅ Checkboxes on each receipt item
- ✅ Visual feedback when items are selected (highlighted with indigo border and background)
- ✅ Selection counter showing number of selected items
- ✅ Easy toggle selection on/off

### 2. Dispute Action
- ✅ "Dispute Selected Items" button appears when items are selected
- ✅ Button shows count of selected items
- ✅ Only visible when at least one item is selected

### 3. Confirmation Summary
- ✅ Modal dialog with confirmation summary
- ✅ Lists all selected items with details:
  - Item name
  - Quantity and unit price
  - Total per item
- ✅ **Total Disputed Amount** prominently displayed
- ✅ Warning note about dispute process
- ✅ Cancel and Confirm buttons

## User Experience Flow

1. **View Receipt** → Customer opens receipt detail page
2. **Select Items** → Customer checks items they want to dispute
3. **Visual Feedback** → Selected items are highlighted
4. **Click Dispute** → "Dispute Selected Items" button appears
5. **Review Summary** → Modal shows confirmation with:
   - List of selected items
   - Total disputed amount
   - Warning note
6. **Confirm or Cancel** → Customer confirms or cancels dispute

## UI/UX Details

### Item Selection
- **Unselected:** White background, gray border
- **Selected:** Indigo background (indigo-50), indigo border (indigo-500)
- **Hover:** Border color changes on hover
- **Checkbox:** Large, easy-to-click (5x5)

### Dispute Button
- **Color:** Red (red-600) to indicate important action
- **Text:** "Dispute Selected Items (X)" where X is count
- **Position:** Right-aligned below items list
- **Visibility:** Only shows when items are selected

### Confirmation Modal
- **Background:** Semi-transparent overlay (black with 50% opacity)
- **Modal:** White card with rounded corners, shadow
- **Layout:**
  - Title: "Confirm Dispute"
  - Items list in gray background box
  - Total amount in indigo-highlighted box
  - Warning note in yellow box
  - Action buttons at bottom

### Total Disputed Amount
- **Display:** Large, bold, indigo color
- **Format:** Currency formatted (e.g., "$25.50")
- **Position:** Prominently displayed in highlighted box
- **Calculation:** Sum of all selected items (price × quantity)

## Technical Implementation

### State Management
- `selectedItems`: Set of selected item IDs
- `showDisputeModal`: Boolean for modal visibility

### Functions
- `toggleItemSelection(itemId)`: Toggle item selection
- `getSelectedItemsData()`: Get selected items with full data
- `calculateDisputedTotal()`: Calculate total disputed amount
- `handleDisputeClick()`: Show confirmation modal
- `handleConfirmDispute()`: Process dispute (placeholder for bank integration)
- `handleCancelDispute()`: Close modal and clear selection

### Data Structure
```typescript
selectedItems: Set<string>  // Set of item IDs
```

## Future Integration

The `handleConfirmDispute()` function currently:
- Logs selected items to console
- Logs total disputed amount
- Closes modal and clears selection

**Next Steps for Bank Integration:**
1. Create API endpoint: `POST /api/disputes`
2. Send dispute data to backend
3. Integrate with bank API/workflow
4. Show success/error feedback
5. Update UI to show dispute status

## Testing

### Test Cases

1. **Select Single Item**
   - ✅ Checkbox works
   - ✅ Item highlights
   - ✅ Dispute button appears
   - ✅ Modal shows correct item
   - ✅ Total matches item price

2. **Select Multiple Items**
   - ✅ Multiple checkboxes work
   - ✅ All items highlight
   - ✅ Dispute button shows correct count
   - ✅ Modal shows all items
   - ✅ Total is sum of all items

3. **Deselect Items**
   - ✅ Unchecking removes highlight
   - ✅ Dispute button hides when none selected
   - ✅ Selection counter updates

4. **Items with Quantity > 1**
   - ✅ Total per item calculated correctly (price × quantity)
   - ✅ Disputed total includes full item totals

5. **Modal Interaction**
   - ✅ Cancel closes modal
   - ✅ Confirm processes dispute (logs to console)
   - ✅ Modal closes after confirm
   - ✅ Selection clears after confirm

## Visual States

### Item States
- **Default:** White bg, gray border
- **Selected:** Indigo-50 bg, indigo-500 border
- **Hover:** Border color change

### Button States
- **Default:** Red-600 bg
- **Hover:** Red-700 bg
- **Focus:** Ring outline

### Modal States
- **Open:** Visible with overlay
- **Closed:** Hidden

## Accessibility

- ✅ Large clickable checkboxes
- ✅ Clear visual feedback
- ✅ Keyboard navigation support (via browser defaults)
- ✅ Clear labels and instructions
- ✅ Color contrast meets WCAG standards

## Summary

✅ **Item-level selection** - Checkboxes on each item  
✅ **Visual feedback** - Highlighted selected items  
✅ **Dispute button** - Appears when items selected  
✅ **Confirmation modal** - Shows summary and total  
✅ **Total disputed amount** - Prominently displayed  
✅ **Clear UX** - Easy to understand and use  

The dispute feature provides a clear, user-friendly way to select and dispute specific items from receipts.

