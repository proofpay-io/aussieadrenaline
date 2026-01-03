/**
 * Confidence Threshold Helper
 * Gets the confidence threshold from bank_settings
 */

import { supabase, isConfigured } from './db.js';

/**
 * Get confidence threshold from bank_settings
 * @returns {Promise<number>} Confidence threshold (default: 85)
 */
export async function getConfidenceThreshold() {
  if (!isConfigured() || !supabase) {
    // If database not configured, return default
    return 85;
  }

  try {
    // Try to get from database
    const { data: setting, error: settingError } = await supabase
      .from('bank_settings')
      .select('value')
      .eq('key', 'confidence_threshold')
      .single();

    if (settingError || !setting) {
      // Fallback to default
      return 85;
    }

    return setting.value?.threshold || 85;
  } catch (error) {
    // If check fails, return default (fail open)
    console.warn('Failed to get confidence threshold, using default:', error);
    return 85;
  }
}

/**
 * Check if a receipt is below the confidence threshold
 * @param {Object} receipt - Receipt object with confidence_score
 * @param {number} threshold - Confidence threshold (optional, will fetch if not provided)
 * @returns {Promise<boolean>} True if receipt is below threshold
 */
export async function isReceiptBelowThreshold(receipt, threshold = null) {
  // If receipt has no confidence_score, don't treat as below threshold (unknown confidence)
  // Only hide receipts that explicitly have a score below threshold
  if (!receipt || receipt.confidence_score === null || receipt.confidence_score === undefined) {
    return false;
  }

  // Get threshold if not provided
  if (threshold === null) {
    threshold = await getConfidenceThreshold();
  }

  return receipt.confidence_score < threshold;
}

