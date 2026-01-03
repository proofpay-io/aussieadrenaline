'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardMetrics {
  receipts_7d: number;
  receipts_30d: number;
  views_7d: number;
  views_30d: number;
  disputes_7d: number;
  disputes_30d: number;
  daily_metrics: Array<{
    date: string;
    receipts: number;
    views: number;
    disputes: number;
  }>;
  confidence_counts: {
    HIGH: number;
    MEDIUM: number;
    LOW: number;
    NULL: number;
  };
  blocked_views_total: number;
  blocked_views_7d: number;
  blocked_views_trend: Array<{
    date: string;
    blocked_views: number;
  }>;
  blocked_view_reasons: {
    FEATURE_DISABLED: number;
    BELOW_THRESHOLD: number;
    UNKNOWN: number;
  };
}

interface ReceiptsEnabled {
  enabled: boolean;
}

interface ConfidenceThreshold {
  threshold: number;
}

interface RetentionPolicy {
  days: number;
}

interface PolicyState {
  receipts_enabled: boolean;
  confidence_threshold: number;
  retention_days: number;
}

interface QRSettings {
  enable_qr_verification: boolean;
  qr_single_use_enabled: boolean;
  qr_token_expiry_minutes: number | null;
}

export default function BankAdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [receiptsEnabled, setReceiptsEnabled] = useState<ReceiptsEnabled | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState<ConfidenceThreshold | null>(null);
  const [retentionPolicy, setRetentionPolicy] = useState<RetentionPolicy | null>(null);
  const [qrSettings, setQRSettings] = useState<QRSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingReceiptsEnabled, setUpdatingReceiptsEnabled] = useState(false);
  const [updatingThreshold, setUpdatingThreshold] = useState(false);
  const [updatingRetention, setUpdatingRetention] = useState(false);
  const [updatingQRSettings, setUpdatingQRSettings] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchReceiptsEnabled();
    fetchConfidenceThreshold();
    fetchRetentionPolicy();
    fetchQRSettings();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const response = await fetch(`${apiUrl}/api/bank-admin/dashboard`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Debug logging
      console.log('📊 Dashboard data received:', {
        receipts_7d: data.receipts_7d,
        receipts_30d: data.receipts_30d,
        daily_metrics_count: data.daily_metrics?.length || 0,
        sample_daily_metrics: data.daily_metrics?.slice(0, 3)
      });
      
      // Ensure daily_metrics is an array
      if (!data.daily_metrics || !Array.isArray(data.daily_metrics)) {
        console.warn('⚠️ daily_metrics is not an array, initializing empty array');
        data.daily_metrics = [];
      }
      
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceiptsEnabled = async () => {
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const response = await fetch(`${apiUrl}/api/bank-admin/receipts-enabled`);
      
      if (response.ok) {
        const data = await response.json();
        setReceiptsEnabled(data);
      } else {
        // Default to enabled if endpoint doesn't exist yet
        setReceiptsEnabled({ enabled: true });
      }
    } catch (err) {
      console.error('Error fetching receipts enabled:', err);
      // Default to enabled on error
      setReceiptsEnabled({ enabled: true });
    }
  };

  const fetchConfidenceThreshold = async () => {
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const response = await fetch(`${apiUrl}/api/bank-admin/confidence-threshold`);
      
      if (response.ok) {
        const data = await response.json();
        setConfidenceThreshold(data);
      }
    } catch (err) {
      console.error('Error fetching confidence threshold:', err);
    }
  };

  const fetchRetentionPolicy = async () => {
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const response = await fetch(`${apiUrl}/api/bank-admin/retention-policy`);
      
      if (response.ok) {
        const data = await response.json();
        setRetentionPolicy(data);
      } else {
        // Default to 90 days if endpoint doesn't exist yet
        setRetentionPolicy({ days: 90 });
      }
    } catch (err) {
      console.error('Error fetching retention policy:', err);
      // Default to 90 days on error
      setRetentionPolicy({ days: 90 });
    }
  };

  const exportDailyMetricsCSV = async () => {
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      // Get the admin secret from query params or use default for dev
      const urlParams = new URLSearchParams(window.location.search);
      const secret = urlParams.get('secret') || 'dev-secret-change-in-production';

      const response = await fetch(`${apiUrl}/api/admin/metrics/daily.csv?secret=${secret}`);
      
      if (!response.ok) {
        throw new Error(`Failed to export CSV: ${response.statusText}`);
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'proofpay-usage-report.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Download the CSV
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert(`Failed to export CSV: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const updateConfidenceThreshold = async (newThreshold: number) => {
    if (newThreshold < 0 || newThreshold > 100) {
      alert('Threshold must be between 0 and 100');
      return;
    }

    setUpdatingThreshold(true);
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const response = await fetch(`${apiUrl}/api/bank-admin/confidence-threshold`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threshold: newThreshold
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update confidence threshold');
      }

      const data = await response.json();
      setConfidenceThreshold(data);
    } catch (err) {
      console.error('Error updating confidence threshold:', err);
      alert('Failed to update confidence threshold');
    } finally {
      setUpdatingThreshold(false);
    }
  };

  const updateReceiptsEnabled = async (newEnabled: boolean) => {
    setUpdatingReceiptsEnabled(true);
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const response = await fetch(`${apiUrl}/api/bank-admin/receipts-enabled`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: newEnabled
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update receipts enabled status');
      }

      const data = await response.json();
      setReceiptsEnabled(data);
    } catch (err) {
      console.error('Error updating receipts enabled:', err);
      alert('Failed to update receipts enabled status');
    } finally {
      setUpdatingReceiptsEnabled(false);
    }
  };

  const fetchQRSettings = async () => {
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const response = await fetch(`${apiUrl}/api/bank-admin/qr-settings`);
      
      if (response.ok) {
        const data = await response.json();
        setQRSettings(data.settings);
      } else {
        // Default values if endpoint doesn't exist yet
        setQRSettings({
          enable_qr_verification: true,
          qr_single_use_enabled: false,
          qr_token_expiry_minutes: null
        });
      }
    } catch (err) {
      console.error('Error fetching QR settings:', err);
      // Default values on error
      setQRSettings({
        enable_qr_verification: true,
        qr_single_use_enabled: false,
        qr_token_expiry_minutes: null
      });
    }
  };

  const updateQRSettings = async (updates: Partial<QRSettings>) => {
    setUpdatingQRSettings(true);
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const response = await fetch(`${apiUrl}/api/bank-admin/qr-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update QR settings');
      }

      const data = await response.json();
      setQRSettings(data.settings);
    } catch (err) {
      console.error('Error updating QR settings:', err);
      alert('Failed to update QR settings');
    } finally {
      setUpdatingQRSettings(false);
    }
  };

  const updateRetentionPolicy = async (newDays: number) => {
    setUpdatingRetention(true);
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const response = await fetch(`${apiUrl}/api/bank-admin/retention-policy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          days: newDays
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update retention policy');
      }

      const data = await response.json();
      setRetentionPolicy(data);
    } catch (err) {
      console.error('Error updating retention policy:', err);
      alert('Failed to update retention policy');
    } finally {
      setUpdatingRetention(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bank Admin Console</h1>
              <p className="text-sm text-gray-600">ProofPay Administration Dashboard</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/bank-admin" className="text-indigo-600 font-medium">Dashboard</Link>
              <Link href="/bank-admin/usage" className="text-gray-600 hover:text-gray-900">Usage</Link>
              <Link href="/bank-admin/disputes" className="text-gray-600 hover:text-gray-900">Disputes</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Unified Policy Card */}
        {receiptsEnabled !== null && confidenceThreshold !== null && retentionPolicy !== null && qrSettings !== null && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border-2 border-indigo-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Policy</h2>
              <p className="text-sm text-gray-600 mb-4">
                Receipts are shown only when the feature is enabled AND confidence is at or above the threshold.
              </p>
            </div>

            <div className="space-y-6">
              {/* Receipts Enabled Toggle */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex-1">
                  <label className="text-base font-medium text-gray-900">
                    Receipts Enabled
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Master toggle to enable/disable receipt viewing
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${receiptsEnabled.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                    {receiptsEnabled.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    onClick={() => updateReceiptsEnabled(!receiptsEnabled.enabled)}
                    disabled={updatingReceiptsEnabled}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 ${
                      receiptsEnabled.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        receiptsEnabled.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Confidence Threshold */}
              <div className="py-4 border-b border-gray-200">
                <label className="text-base font-medium text-gray-900 mb-2 block">
                  Confidence Threshold
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Minimum confidence score (0-100) required for receipts to be shown
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={confidenceThreshold.threshold}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value, 10);
                        setConfidenceThreshold({ threshold: newValue });
                      }}
                      onMouseUp={(e) => {
                        const newValue = parseInt((e.target as HTMLInputElement).value, 10);
                        updateConfidenceThreshold(newValue);
                      }}
                      onTouchEnd={(e) => {
                        const newValue = parseInt((e.target as HTMLInputElement).value, 10);
                        updateConfidenceThreshold(newValue);
                      }}
                      disabled={updatingThreshold}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                      style={{
                        background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${confidenceThreshold.threshold}%, #e5e7eb ${confidenceThreshold.threshold}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={confidenceThreshold.threshold}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value, 10);
                        if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                          setConfidenceThreshold({ threshold: newValue });
                        }
                      }}
                      onBlur={(e) => {
                        const newValue = parseInt(e.target.value, 10);
                        if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                          updateConfidenceThreshold(newValue);
                        } else {
                          setConfidenceThreshold(confidenceThreshold);
                        }
                      }}
                      disabled={updatingThreshold}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-600">/ 100</span>
                  </div>
                </div>
                
                {updatingThreshold && (
                  <p className="text-xs text-gray-500 mt-2">Saving...</p>
                )}
              </div>

              {/* Data Retention Policy */}
              <div className="py-4 border-b border-gray-200">
                <label className="text-base font-medium text-gray-900 mb-2 block">
                  Data Retention Policy
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Receipt data is retained according to bank policy and can be configured per deployment.
                </p>
                
                <div className="flex items-center gap-4">
                  <select
                    value={retentionPolicy?.days || 90}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value, 10);
                      setRetentionPolicy({ days: newValue });
                      updateRetentionPolicy(newValue);
                    }}
                    disabled={updatingRetention}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                  </select>
                  {updatingRetention && (
                    <span className="text-sm text-gray-500">Saving...</span>
                  )}
                </div>
              </div>

              {/* QR Verification Settings */}
              <div className="py-4 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-4">QR Verification Settings</h3>
                
                {/* Enable QR Verification Toggle */}
                <div className="flex items-center justify-between py-3 mb-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900">
                      Enable QR Verification
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Master toggle to enable/disable QR code verification
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${qrSettings.enable_qr_verification ? 'text-green-600' : 'text-gray-400'}`}>
                      {qrSettings.enable_qr_verification ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => updateQRSettings({ enable_qr_verification: !qrSettings.enable_qr_verification })}
                      disabled={updatingQRSettings}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 ${
                        qrSettings.enable_qr_verification ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          qrSettings.enable_qr_verification ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Single-Use Tokens Toggle */}
                <div className="flex items-center justify-between py-3 mb-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900">
                      Single-Use Tokens
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      If enabled, QR tokens can only be verified once
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${qrSettings.qr_single_use_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                      {qrSettings.qr_single_use_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => updateQRSettings({ qr_single_use_enabled: !qrSettings.qr_single_use_enabled })}
                      disabled={updatingQRSettings || !qrSettings.enable_qr_verification}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 ${
                        qrSettings.qr_single_use_enabled ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          qrSettings.qr_single_use_enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Token Expiry Dropdown */}
                <div className="py-3">
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Token Expiry
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    How long QR tokens remain valid before expiring
                  </p>
                  <select
                    value={qrSettings.qr_token_expiry_minutes === null ? 'never' : qrSettings.qr_token_expiry_minutes.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      const minutes = value === 'never' ? null : parseInt(value, 10);
                      updateQRSettings({ qr_token_expiry_minutes: minutes });
                    }}
                    disabled={updatingQRSettings || !qrSettings.enable_qr_verification}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="5">5 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="never">Never expire</option>
                  </select>
                  {updatingQRSettings && (
                    <span className="text-xs text-gray-500 ml-3">Saving...</span>
                  )}
                </div>
              </div>

              {/* Customer-Facing Result Preview */}
              <div className="pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Customer-Facing Result</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  {!receiptsEnabled.enabled ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Receipts temporarily unavailable</p>
                        <p className="text-xs text-gray-500 mt-0.5">Feature is disabled</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Receipt not available</p>
                        <p className="text-xs text-gray-500 mt-0.5">Below confidence threshold ({confidenceThreshold.threshold})</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-4 text-gray-600">Loading dashboard...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Metrics */}
        {!loading && !error && metrics && (
          <>
            {/* Export CSV Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Daily Metrics Export</h3>
                  <p className="text-sm text-gray-600">
                    Includes confidence distribution and blocked-view metrics for pilot reporting and invoice reconciliation.
                  </p>
                </div>
                <button
                  onClick={exportDailyMetricsCSV}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Receipts Created</h3>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">{metrics.receipts_7d}</p>
                  <p className="text-sm text-gray-500">Last 7 days</p>
                  <p className="text-2xl font-semibold text-gray-700">{metrics.receipts_30d}</p>
                  <p className="text-sm text-gray-500">Last 30 days</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Receipt Views</h3>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">{metrics.views_7d}</p>
                  <p className="text-sm text-gray-500">Last 7 days</p>
                  <p className="text-2xl font-semibold text-gray-700">{metrics.views_30d}</p>
                  <p className="text-sm text-gray-500">Last 30 days</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Disputes Submitted</h3>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">{metrics.disputes_7d}</p>
                  <p className="text-sm text-gray-500">Last 7 days</p>
                  <p className="text-2xl font-semibold text-gray-700">{metrics.disputes_30d}</p>
                  <p className="text-sm text-gray-500">Last 30 days</p>
                </div>
              </div>
            </div>

            {/* Confidence & Blocked Views Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Confidence Label Counts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Receipts by Confidence Label</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-gray-700">High Confidence</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{metrics.confidence_counts.HIGH}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm font-medium text-gray-700">Medium Confidence</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{metrics.confidence_counts.MEDIUM}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm font-medium text-gray-700">Low Confidence</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{metrics.confidence_counts.LOW}</span>
                    </div>
                    {metrics.confidence_counts.NULL > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                          <span className="text-sm font-medium text-gray-700">No Label</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">{metrics.confidence_counts.NULL}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Blocked Views */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Blocked Views</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Blocked Views</p>
                      <p className="text-3xl font-bold text-red-600">{metrics.blocked_views_total}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Last 7 Days</p>
                      <p className="text-2xl font-semibold text-gray-900">{metrics.blocked_views_7d}</p>
                    </div>
                    {metrics.blocked_views_trend && metrics.blocked_views_trend.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Trend (Last 7 Days)</p>
                        <div className="space-y-2">
                          {metrics.blocked_views_trend.map((day, idx) => {
                            const maxBlocked = Math.max(...metrics.blocked_views_trend.map(d => d.blocked_views), 1);
                            const percentage = maxBlocked > 0 ? (day.blocked_views / maxBlocked) * 100 : 0;
                            return (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">
                                  {new Date(day.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-red-500 h-2 rounded-full"
                                      style={{
                                        width: `${Math.min(100, percentage)}%`
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                                    {day.blocked_views}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pilot Report Section */}
            <div className="bg-white rounded-lg shadow-sm border-2 border-indigo-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Pilot Report</h2>
                  <p className="text-sm text-gray-600">Receipt availability and blocked view analysis</p>
                </div>
                <button
                  onClick={exportDailyMetricsCSV}
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Match/Availability Proxy */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Match/Availability Proxy</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Receipts Shown</span>
                        <span className="text-2xl font-bold text-green-600">{metrics.views_30d || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500">Total successful receipt views (30 days)</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Receipts Blocked</span>
                        <span className="text-2xl font-bold text-red-600">{metrics.blocked_views_total || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500">Total blocked receipt views</p>
                    </div>
                    <div className="pt-4 border-t border-gray-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Availability Rate</span>
                        <span className="text-xl font-bold text-indigo-600">
                          {metrics.views_30d + metrics.blocked_views_total > 0
                            ? Math.round((metrics.views_30d / (metrics.views_30d + metrics.blocked_views_total)) * 100)
                            : 0}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {metrics.views_30d || 0} shown / {metrics.views_30d + metrics.blocked_views_total || 0} total attempts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Blocked View Reasons Breakdown */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Blocked View Reasons</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <span className="text-sm font-medium text-gray-700">Feature Disabled</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                          {metrics.blocked_view_reasons?.FEATURE_DISABLED || 0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 ml-5">Receipts blocked due to feature being disabled</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-sm font-medium text-gray-700">Below Threshold</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                          {metrics.blocked_view_reasons?.BELOW_THRESHOLD || 0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 ml-5">Receipts blocked due to low confidence score</p>
                    </div>
                    {metrics.blocked_view_reasons?.UNKNOWN > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <span className="text-sm font-medium text-gray-700">Unknown</span>
                          </div>
                          <span className="text-2xl font-bold text-gray-900">
                            {metrics.blocked_view_reasons.UNKNOWN}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 ml-5">Blocked views without reason metadata</p>
                      </div>
                    )}
                    <div className="pt-4 border-t border-gray-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Total Blocked</span>
                        <span className="text-xl font-bold text-gray-900">
                          {metrics.blocked_views_total || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explain Panel */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Confidence Threshold Policy</h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Receipts below the configured confidence threshold are hidden from customers. 
                    When a customer attempts to view a below-threshold receipt, they see a neutral fallback message 
                    instead of the itemized receipt details. This ensures that only high-quality, verified receipts 
                    are displayed to customers, maintaining trust and reducing potential confusion from incomplete 
                    or uncertain transaction data.
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Metrics Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Daily Metrics (Last 30 Days)</h2>
                {metrics.daily_metrics && metrics.daily_metrics.length > 0 && (
                  <span className="text-sm text-gray-500">
                    Showing {metrics.daily_metrics.length} days
                  </span>
                )}
              </div>
              {metrics.daily_metrics && metrics.daily_metrics.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Receipts Created</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Disputes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {metrics.daily_metrics.map((day, idx) => {
                        // Parse the date and format it
                        const dayDate = new Date(day.date);
                        const formattedDate = dayDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        });
                        
                        return (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formattedDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                              {day.receipts || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                              {day.views || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                              {day.disputes || 0}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 text-sm">No daily metrics data available</p>
                  <p className="text-gray-400 text-xs mt-2">Data will appear here as receipts, views, and disputes are created</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

