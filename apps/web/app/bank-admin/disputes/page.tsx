'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConfidenceBadge from '../../../components/ConfidenceBadge';
import ConfidenceExplainability from '../../../components/ConfidenceExplainability';

interface DisputeItem {
  id: string;
  receipt_item_id: string;
  quantity: number;
  amount_cents: number | null;
}

interface Dispute {
  id: string;
  created_at: string;
  updated_at: string;
  receipt_id: string;
  status: string;
  reason_code: string;
  notes: string | null;
  total_amount_cents: number | null;
  item_count?: number;
}

interface DisputesResponse {
  success: boolean;
  disputes: Dispute[];
  total: number;
  page: number;
  page_size: number;
}

interface DisputeDetail {
  dispute: Dispute;
  items: DisputeItem[];
  receipt: {
    id: string;
    merchant_name?: string;
    amount: string;
    currency: string;
    confidence_score?: number | null;
    confidence_label?: string | null;
    confidence_reasons?: string[] | null;
  };
}

export default function BankAdminDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedDispute, setSelectedDispute] = useState<DisputeDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const pageSize = 50;

  useEffect(() => {
    fetchDisputes();
  }, [page]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      const response = await fetch(`${apiUrl}/api/bank-admin/disputes?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch disputes: ${response.statusText}`);
      }

      const data: DisputesResponse = await response.json();
      setDisputes(data.disputes || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load disputes');
      console.error('Error fetching disputes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisputeDetail = async (disputeId: string) => {
    setLoadingDetail(true);
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const response = await fetch(`${apiUrl}/api/bank-admin/disputes/${disputeId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dispute details: ${response.statusText}`);
      }

      const data = await response.json();
      setSelectedDispute(data);
    } catch (err) {
      console.error('Error fetching dispute detail:', err);
      alert('Failed to load dispute details');
    } finally {
      setLoadingDetail(false);
    }
  };

  const formatCurrency = (cents: number | null, currency: string = 'USD') => {
    if (cents === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Disputes</h1>
              <p className="text-sm text-gray-600">Dispute management and review</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/bank-admin" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/bank-admin/usage" className="text-gray-600 hover:text-gray-900">Usage</Link>
              <Link href="/bank-admin/disputes" className="text-indigo-600 font-medium">Disputes</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-4 text-gray-600">Loading disputes...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Disputes Table */}
        {!loading && !error && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">All Disputes</h2>
                <p className="text-sm text-gray-600">Total: {total}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {disputes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          No disputes found
                        </td>
                      </tr>
                    ) : (
                      disputes.map((dispute) => (
                        <tr key={dispute.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(dispute.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(dispute.status)}`}>
                              {dispute.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                            {dispute.receipt_id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {dispute.reason_code.replace('_', ' ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {dispute.item_count || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                            {formatCurrency(dispute.total_amount_cents)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => fetchDisputeDetail(dispute.id)}
                              className="text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
                <div className="text-sm text-gray-600">
                  Page {page} of {totalPages} ({total} total disputes)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Dispute Detail Modal */}
        {selectedDispute && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Dispute Details</h2>
                  <button
                    onClick={() => setSelectedDispute(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {loadingDetail ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <>
                    {/* Dispute Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Dispute ID:</span>
                          <p className="font-mono text-gray-900">{selectedDispute.dispute.id}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <p className="capitalize">{selectedDispute.dispute.status.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Receipt ID:</span>
                          <p className="font-mono text-gray-900">{selectedDispute.dispute.receipt_id}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Reason:</span>
                          <p className="text-gray-900">{selectedDispute.dispute.reason_code.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Created:</span>
                          <p className="text-gray-900">{formatDate(selectedDispute.dispute.created_at)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Total Amount:</span>
                          <p className="text-gray-900 font-semibold">
                            {formatCurrency(selectedDispute.dispute.total_amount_cents, selectedDispute.receipt.currency)}
                          </p>
                        </div>
                        {selectedDispute.dispute.notes && (
                          <div className="col-span-2">
                            <span className="font-medium text-gray-700">Notes:</span>
                            <p className="text-gray-900">{selectedDispute.dispute.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Receipt Info */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Receipt Information</h3>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="font-medium text-gray-700">Merchant:</span>
                            <p className="text-gray-900">{selectedDispute.receipt.merchant_name || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Receipt Total:</span>
                            <p className="text-gray-900">{formatCurrency(parseFloat(selectedDispute.receipt.amount) * 100, selectedDispute.receipt.currency)}</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          <span className="font-medium text-gray-700 text-sm">Confidence:</span>
                          <div className="mt-2">
                            <ConfidenceBadge
                              confidence_score={selectedDispute.receipt.confidence_score}
                              confidence_label={selectedDispute.receipt.confidence_label}
                              confidence_reasons={selectedDispute.receipt.confidence_reasons}
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Confidence Explainability Panel (Always Expanded for Admin) */}
                      {selectedDispute.receipt.confidence_score !== null && 
                       selectedDispute.receipt.confidence_score !== undefined && 
                       selectedDispute.receipt.confidence_label && (
                        <div className="mt-4">
                          <ConfidenceExplainability
                            confidence_score={selectedDispute.receipt.confidence_score}
                            confidence_label={selectedDispute.receipt.confidence_label}
                            confidence_reasons={selectedDispute.receipt.confidence_reasons}
                            isBlocked={false}
                            alwaysExpanded={true}
                            showScore={true}
                          />
                        </div>
                      )}
                    </div>

                    {/* Disputed Items */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Disputed Items</h3>
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedDispute.items.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                  No items found
                                </td>
                              </tr>
                            ) : (
                              selectedDispute.items.map((item) => (
                                <tr key={item.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                    {item.receipt_item_id.substring(0, 8)}...
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {item.quantity}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                    {formatCurrency(item.amount_cents, selectedDispute.receipt.currency)}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

