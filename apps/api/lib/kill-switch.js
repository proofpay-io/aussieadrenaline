/**
 * Kill Switch Helper
 * Checks if the ProofPay kill switch is enabled
 * Also checks receipts_enabled setting (new unified approach)
 */

import { supabase, isConfigured } from './db.js';

/**
 * Check kill switch status (legacy - checks kill_switch)
 * @returns {Promise<boolean>} true if kill switch is enabled (system is disabled)
 */
export async function isKillSwitchEnabled() {
  if (!isConfigured() || !supabase) {
    // If database not configured, assume system is operational
    return false;
  }

  try {
    // First check receipts_enabled (new unified approach)
    const { data: receiptsEnabledSetting, error: receiptsError } = await supabase
      .from('bank_settings')
      .select('value')
      .eq('key', 'receipts_enabled')
      .single();

    if (!receiptsError && receiptsEnabledSetting) {
      // If receipts_enabled exists, use it (inverted: enabled=false means system is disabled)
      return receiptsEnabledSetting.value?.enabled === false;
    }

    // Fallback to legacy kill_switch
    const { data: setting, error: settingError } = await supabase
      .from('bank_settings')
      .select('value')
      .eq('key', 'kill_switch')
      .single();

    if (settingError || !setting) {
      // Fallback to environment variable
      return process.env.KILL_SWITCH_ENABLED === 'true';
    }

    return setting.value?.enabled || false;
  } catch (error) {
    // If check fails, assume system is operational (fail open)
    console.warn('Failed to check kill switch, assuming system is operational:', error);
    return false;
  }
}

/**
 * Check if receipts are enabled (new unified approach)
 * @returns {Promise<boolean>} true if receipts are enabled
 */
export async function isReceiptsEnabled() {
  if (!isConfigured() || !supabase) {
    // If database not configured, assume receipts are enabled
    return true;
  }

  try {
    const { data: setting, error: settingError } = await supabase
      .from('bank_settings')
      .select('value')
      .eq('key', 'receipts_enabled')
      .single();

    if (settingError || !setting) {
      // Default to enabled if not set
      return true;
    }

    return setting.value?.enabled !== false; // Default to true
  } catch (error) {
    // If check fails, assume receipts are enabled (fail open)
    console.warn('Failed to check receipts_enabled, assuming enabled:', error);
    return true;
  }
}

