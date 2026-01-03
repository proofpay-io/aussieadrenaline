/**
 * Event logging helper for receipt_events table
 * This module provides functions to log receipt-related events
 * All logging is non-blocking - errors never break the user flow
 */

import { supabase, isConfigured } from './db.js';

/**
 * Log a receipt event to the receipt_events table
 * This function is designed to never throw errors - it catches and logs them silently
 * 
 * @param {string} eventType - Type of event: 'receipt_created', 'receipt_viewed', 'dispute_created'
 * @param {string|null} receiptId - UUID of the receipt (nullable)
 * @param {Object} metadata - Additional event data (will be stored as JSONB)
 * @param {Object} logger - Optional logger instance (Fastify logger or console)
 * @returns {Promise<void>}
 */
export const logReceiptEvent = async (eventType, receiptId = null, metadata = {}, logger = null) => {
  // Validate event type
  const validEventTypes = ['receipt_created', 'receipt_viewed', 'dispute_created', 'receipt_view_blocked', 'policy_updated', 'receipt_share_created', 'receipt_share_viewed', 'receipt_verified', 'receipt_verification_failed'];
  if (!validEventTypes.includes(eventType)) {
    const logFn = logger?.warn || console.warn;
    logFn(`⚠️ [EVENT-LOG] Invalid event type: ${eventType}. Valid types: ${validEventTypes.join(', ')}`);
    return;
  }

  // Check if Supabase is configured
  if (!isConfigured() || !supabase) {
    const logFn = logger?.warn || console.warn;
    logFn('⚠️ [EVENT-LOG] Supabase not configured, skipping event log');
    return;
  }

  // Check if receipt_events table exists by attempting to insert
  // If table doesn't exist, we'll catch the error and continue
  try {
    const eventData = {
      event_type: eventType,
      receipt_id: receiptId,
      metadata: metadata || {},
    };

    const { error } = await supabase
      .from('receipt_events')
      .insert(eventData);

    if (error) {
      // Check if it's a "table doesn't exist" error
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation')) {
        const logFn = logger?.warn || console.warn;
        logFn('⚠️ [EVENT-LOG] receipt_events table does not exist. Run migration 003 to enable event logging.');
        return;
      }

      // For other errors, log but don't throw
      const logFn = logger?.error || console.error;
      logFn('❌ [EVENT-LOG] Error logging event:', {
        eventType,
        receiptId,
        error: error.message,
        code: error.code,
      });
      return;
    }

    // Success - log if logger provided
    if (logger) {
      logger.info('✅ [EVENT-LOG] Event logged successfully', {
        eventType,
        receiptId,
      });
    }

  } catch (error) {
    // Catch any unexpected errors - never throw, just log
    const logFn = logger?.error || console.error;
    logFn('❌ [EVENT-LOG] Unexpected error logging event:', {
      eventType,
      receiptId,
      error: error.message,
    });
  }
};

/**
 * Log a receipt_created event
 * @param {string} receiptId - UUID of the created receipt
 * @param {Object} metadata - Additional data (source, total, item_count, etc.)
 * @param {Object} logger - Optional logger instance
 */
export const logReceiptCreated = async (receiptId, metadata = {}, logger = null) => {
  await logReceiptEvent('receipt_created', receiptId, metadata, logger);
};

/**
 * Log a receipt_viewed event
 * @param {string} receiptId - UUID of the viewed receipt
 * @param {Object} metadata - Additional data (path, user_session_id, etc.)
 * @param {Object} logger - Optional logger instance
 */
export const logReceiptViewed = async (receiptId, metadata = {}, logger = null) => {
  await logReceiptEvent('receipt_viewed', receiptId, metadata, logger);
};

/**
 * Log a dispute_created event
 * @param {string} receiptId - UUID of the receipt with dispute
 * @param {Object} metadata - Additional data (dispute_id, reason_code, etc.)
 * @param {Object} logger - Optional logger instance
 */
export const logDisputeCreated = async (receiptId, metadata = {}, logger = null) => {
  await logReceiptEvent('dispute_created', receiptId, metadata, logger);
};

/**
 * Log a receipt_view_blocked event
 * @param {string} receiptId - UUID of the receipt that was blocked
 * @param {Object} metadata - Additional data (confidence_score, threshold, path)
 * @param {Object} logger - Optional logger instance
 */
export const logReceiptViewBlocked = async (receiptId, metadata = {}, logger = null) => {
  await logReceiptEvent('receipt_view_blocked', receiptId, metadata, logger);
};

/**
 * Log a receipt_share_created event
 * @param {string} receiptId - UUID of the receipt that was shared
 * @param {Object} metadata - Additional data (token, share_id, etc.)
 * @param {Object} logger - Optional logger instance
 */
export const logReceiptShareCreated = async (receiptId, metadata = {}, logger = null) => {
  await logReceiptEvent('receipt_share_created', receiptId, metadata, logger);
};

/**
 * Log a receipt_share_viewed event
 * @param {string} receiptId - UUID of the receipt that was viewed via share
 * @param {Object} metadata - Additional data (token, view_count, etc.)
 * @param {Object} logger - Optional logger instance
 */
export const logReceiptShareViewed = async (receiptId, metadata = {}, logger = null) => {
  await logReceiptEvent('receipt_share_viewed', receiptId, metadata, logger);
};

/**
 * Log a receipt_verified event (successful verification)
 * @param {string} receiptId - UUID of the receipt that was verified
 * @param {Object} metadata - Additional data (verification_state, token_id, etc.)
 * @param {Object} logger - Optional logger instance
 */
export const logReceiptVerified = async (receiptId, metadata = {}, logger = null) => {
  await logReceiptEvent('receipt_verified', receiptId, metadata, logger);
};

/**
 * Log a receipt_verification_failed event (failed verification)
 * @param {string} receiptId - UUID of the receipt (or null if receipt not found)
 * @param {Object} metadata - Additional data (verification_state, token_id, reason, etc.)
 * @param {Object} logger - Optional logger instance
 */
export const logReceiptVerificationFailed = async (receiptId, metadata = {}, logger = null) => {
  await logReceiptEvent('receipt_verification_failed', receiptId, metadata, logger);
};

