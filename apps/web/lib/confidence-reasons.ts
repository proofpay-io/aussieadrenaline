/**
 * Confidence Reasons Helper
 * Converts technical confidence reason codes to plain language
 */

export interface ConfidenceReason {
  code: string;
  label: string;
}

/**
 * Convert confidence reason code to plain language
 */
export function getConfidenceReasonLabel(code: string): string {
  const reasonMap: Record<string, string> = {
    'SOURCE_POS': 'Source verified from merchant POS',
    'TOTAL_EXACT': 'Transaction total matches receipt',
    'TIME_EXACT': 'Purchase time matched exactly',
    'DESCRIPTOR_WEAK': 'Merchant descriptor is unclear',
    'TIME_WINDOW_WIDE': 'Purchase time window is wide',
    'AMOUNT_MISMATCH': 'Transaction amount does not match',
    'MERCHANT_VERIFIED': 'Merchant identity verified',
    'PAYMENT_METHOD_VERIFIED': 'Payment method verified',
    'ITEMIZATION_COMPLETE': 'Receipt itemization is complete',
    'CROSS_REFERENCE_MATCH': 'Cross-reference data matches',
  };

  // If we have a mapping, use it; otherwise convert code to readable format
  return reasonMap[code] || code.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get all confidence reasons as formatted labels
 */
export function formatConfidenceReasons(reasons: string[] | null | undefined): string[] {
  if (!reasons || !Array.isArray(reasons)) {
    return [];
  }
  return reasons.map(code => getConfidenceReasonLabel(code));
}

