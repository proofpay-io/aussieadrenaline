'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { checkKillSwitch } from '../../lib/kill-switch';
import ConfidenceBadge from '../../components/ConfidenceBadge';
import DisputeBadge from '../../components/DisputeBadge';
import ResolvedBadge from '../../components/ResolvedBadge';
import RefundedBadge from '../../components/RefundedBadge';

interface ReceiptItem {
  id: string;
  receipt_id: string;
  item_name: string;
  item_price: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface Receipt {
  id: string;
  payment_id: string;
  amount: string;
  currency: string;
  created_at: string;
  updated_at: string;
  source?: string;
  merchant_name?: string;
  confidence_score?: number | null;
  confidence_label?: string | null;
  confidence_reasons?: string[] | null;
  below_threshold?: boolean;
  has_active_dispute?: boolean;
  has_resolved_dispute?: boolean;
  is_refunded?: boolean;
  receipt_items: ReceiptItem[];
}

interface ReceiptsResponse {
  success: boolean;
  count: number;
  receipts: Receipt[];
}

// API URL - use localhost for local development, production API for deployed app
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // In browser, check if we're on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:4000';
    }
    // Otherwise use production API
    return 'https://aussieadrenaline-api.vercel.app';
  }
  // Server-side, use localhost for development
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
};

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [killSwitchEnabled, setKillSwitchEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKillSwitchStatus = async () => {
      const status = await checkKillSwitch();
      setKillSwitchEnabled(status.enabled);
    };

    checkKillSwitchStatus();
  }, []);

  useEffect(() => {
    const fetchReceipts = async () => {
      // Don't fetch receipts if kill switch is enabled
      if (killSwitchEnabled === true) {
        setLoading(false);
        return;
      }

      // If kill switch status is still loading, wait
      if (killSwitchEnabled === null) {
        return;
      }
      try {
        setLoading(true);
        setError(null);
        
              const apiUrl = getApiUrl();
        
        const response = await fetch(`${apiUrl}/api/receipts`);
        
        if (!response.ok) {
          if (response.status === 503) {
            // Receipts are disabled - show disabled state
            setKillSwitchEnabled(true);
            setLoading(false);
            return;
          }
          throw new Error(`Failed to fetch receipts: ${response.statusText}`);
        }
        
        const data: ReceiptsResponse = await response.json();
        
        if (data.success) {
          setReceipts(data.receipts || []);
        } else {
          throw new Error('Failed to fetch receipts');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load receipts');
        console.error('Error fetching receipts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [killSwitchEnabled]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: string, currency: string) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(numAmount);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Receipts</h1>
          <p className="text-gray-600">View all your purchase receipts</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-4 text-gray-600">Loading receipts...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Receipts List */}
        {!loading && !error && (
          <>
            {receipts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 text-lg">No receipts found.</p>
                <p className="text-gray-500 text-sm mt-2">
                  Receipts will appear here after payments are processed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {receipts.map((receipt) => (
                  <Link
                    key={receipt.id}
                    href={`/receipts/${receipt.id}`}
                    className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2 flex-wrap">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {receipt.merchant_name || 'Merchant'}
                          </h2>
                          <div className="flex items-center gap-2 flex-wrap">
                            {receipt.source === 'simulated' && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                🎭 Simulated
                              </span>
                            )}
                            <ConfidenceBadge
                              confidence_score={receipt.confidence_score}
                              confidence_label={receipt.confidence_label}
                              confidence_reasons={receipt.confidence_reasons}
                              size="sm"
                            />
                            <DisputeBadge
                              hasActiveDispute={receipt.has_active_dispute || false}
                              size="sm"
                            />
                            <ResolvedBadge
                              hasResolvedDispute={receipt.has_resolved_dispute || false}
                              size="sm"
                            />
                            <RefundedBadge
                              isRefunded={receipt.is_refunded || false}
                              size="sm"
                            />
                          </div>
                          <span className="text-sm text-gray-500">
                            {receipt.payment_id.substring(0, 8)}...
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {formatDate(receipt.purchase_time || receipt.created_at)}
                        </p>
                        {receipt.below_threshold ? (
                          <p className="text-sm text-amber-600 font-medium mt-1">
                            Receipt not available
                          </p>
                        ) : receipt.receipt_items && receipt.receipt_items.length > 0 ? (
                          <p className="text-gray-500 text-xs mt-1">
                            {receipt.receipt_items.length} item{receipt.receipt_items.length !== 1 ? 's' : ''}
                          </p>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">
                          {formatCurrency(receipt.amount, receipt.currency)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {receipt.currency}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Receipt Count */}
        {!loading && !error && receipts.length > 0 && (
          <div className="mt-6 text-center text-gray-600 text-sm">
            Showing {receipts.length} receipt{receipts.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </main>
  );
}

