/**
 * Kill Switch Helper
 * Checks if the ProofPay kill switch is enabled
 */

export interface KillSwitchStatus {
  enabled: boolean;
}

/**
 * Check kill switch status from API
 * @returns Kill switch status (enabled = system is disabled)
 */
export async function checkKillSwitch(): Promise<KillSwitchStatus> {
  try {
    const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:4000'
      : 'https://aussieadrenaline-api.vercel.app';

    // Try receipts_enabled first (new unified approach)
    const response = await fetch(`${apiUrl}/api/bank-admin/receipts-enabled`, {
      cache: 'no-store' // Always check fresh status
    });

    if (response.ok) {
      const data = await response.json();
      // Invert: receipts_enabled=true means kill switch is OFF (system operational)
      return { enabled: !data.enabled };
    }

    // Fallback to legacy kill-switch endpoint
    const legacyResponse = await fetch(`${apiUrl}/api/bank-admin/kill-switch`, {
      cache: 'no-store'
    });

    if (!legacyResponse.ok) {
      // If endpoint doesn't exist or fails, assume system is operational
      return { enabled: false };
    }

    const legacyData = await legacyResponse.json();
    return { enabled: legacyData.enabled || false };
  } catch (error) {
    // If check fails, assume system is operational (fail open)
    console.warn('Failed to check kill switch status, assuming system is operational:', error);
    return { enabled: false };
  }
}

