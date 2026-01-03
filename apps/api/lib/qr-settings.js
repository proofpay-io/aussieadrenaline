/**
 * QR Verification Settings Helper
 * Manages QR code verification settings from bank_settings
 */

import { supabase, isConfigured } from './db.js';

/**
 * Get QR verification enabled status
 * @returns {Promise<boolean>} True if QR verification is enabled
 */
export async function isQRVerificationEnabled() {
  if (!isConfigured() || !supabase) {
    return true; // Default to enabled if DB not configured
  }

  try {
    const { data: setting, error } = await supabase
      .from('bank_settings')
      .select('value')
      .eq('key', 'enable_qr_verification')
      .single();

    if (error || !setting) {
      return true; // Default to enabled
    }

    return setting.value?.enabled !== false;
  } catch (error) {
    console.warn('Failed to get QR verification enabled status, using default:', error);
    return true; // Default to enabled
  }
}

/**
 * Set QR verification enabled status
 * @param {boolean} enabled - Whether QR verification should be enabled
 * @returns {Promise<boolean>} Success status
 */
export async function setQRVerificationEnabled(enabled) {
  if (!isConfigured() || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('bank_settings')
      .upsert({
        key: 'enable_qr_verification',
        value: { enabled },
        description: 'Master toggle to enable or disable QR code verification functionality.',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    return !error;
  } catch (error) {
    console.error('Failed to set QR verification enabled status:', error);
    return false;
  }
}

/**
 * Get QR single-use enabled status
 * @returns {Promise<boolean>} True if single-use tokens are enabled
 */
export async function isQRSingleUseEnabled() {
  if (!isConfigured() || !supabase) {
    return false; // Default to disabled if DB not configured
  }

  try {
    const { data: setting, error } = await supabase
      .from('bank_settings')
      .select('value')
      .eq('key', 'qr_single_use_enabled')
      .single();

    if (error || !setting) {
      return false; // Default to disabled
    }

    return setting.value?.enabled === true;
  } catch (error) {
    console.warn('Failed to get QR single-use enabled status, using default:', error);
    return false; // Default to disabled
  }
}

/**
 * Set QR single-use enabled status
 * @param {boolean} enabled - Whether single-use tokens should be enabled
 * @returns {Promise<boolean>} Success status
 */
export async function setQRSingleUseEnabled(enabled) {
  if (!isConfigured() || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('bank_settings')
      .upsert({
        key: 'qr_single_use_enabled',
        value: { enabled },
        description: 'If enabled, all new QR tokens will be single-use (can only be verified once).',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    return !error;
  } catch (error) {
    console.error('Failed to set QR single-use enabled status:', error);
    return false;
  }
}

/**
 * Get QR token expiry minutes
 * @returns {Promise<number|null>} Expiry minutes (5, 15, 60) or null (never expire)
 */
export async function getQRTokenExpiryMinutes() {
  if (!isConfigured() || !supabase) {
    return null; // Default to never expire if DB not configured
  }

  try {
    const { data: setting, error } = await supabase
      .from('bank_settings')
      .select('value')
      .eq('key', 'qr_token_expiry_minutes')
      .single();

    if (error || !setting) {
      return null; // Default to never expire
    }

    return setting.value?.minutes || null;
  } catch (error) {
    console.warn('Failed to get QR token expiry minutes, using default:', error);
    return null; // Default to never expire
  }
}

/**
 * Set QR token expiry minutes
 * @param {number|null} minutes - Expiry minutes (5, 15, 60) or null (never expire)
 * @returns {Promise<boolean>} Success status
 */
export async function setQRTokenExpiryMinutes(minutes) {
  if (!isConfigured() || !supabase) {
    return false;
  }

  // Validate minutes value
  if (minutes !== null && ![5, 15, 60].includes(minutes)) {
    throw new Error('Invalid expiry minutes. Must be 5, 15, 60, or null');
  }

  try {
    const { error } = await supabase
      .from('bank_settings')
      .upsert({
        key: 'qr_token_expiry_minutes',
        value: { minutes },
        description: 'Number of minutes until QR tokens expire. Options: 5, 15, 60, or null (never expire).',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    return !error;
  } catch (error) {
    console.error('Failed to set QR token expiry minutes:', error);
    return false;
  }
}

/**
 * Get all QR settings at once
 * @returns {Promise<Object>} Object with all QR settings
 */
export async function getAllQRSettings() {
  const [enabled, singleUse, expiryMinutes] = await Promise.all([
    isQRVerificationEnabled(),
    isQRSingleUseEnabled(),
    getQRTokenExpiryMinutes()
  ]);

  return {
    enable_qr_verification: enabled,
    qr_single_use_enabled: singleUse,
    qr_token_expiry_minutes: expiryMinutes
  };
}

