'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { checkKillSwitch } from '../../../lib/kill-switch';
import ConfidenceBadge from '../../../components/ConfidenceBadge';
import ConfidenceExplainability from '../../../components/ConfidenceExplainability';
import { QRCodeSVG } from 'qrcode.react';

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
  receipt_items: ReceiptItem[];
}

interface ReceiptResponse {
  success: boolean;
  receipt: Receipt;
}

export default function ReceiptDetailPage() {
  const params = useParams();
  const receiptId = params.id as string;
  
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Changed from Set to Map to track itemId -> quantity
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [reasonCode, setReasonCode] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disputeSuccess, setDisputeSuccess] = useState<{ dispute_id: string; status: string } | null>(null);
  const [killSwitchEnabled, setKillSwitchEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKillSwitchStatus = async () => {
      const status = await checkKillSwitch();
      setKillSwitchEnabled(status.enabled);
    };

    checkKillSwitchStatus();
  }, []);

  useEffect(() => {
    const fetchReceipt = async () => {
      // Don't fetch receipt if kill switch is enabled
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
        
        // Use localhost for local development, production API for deployed app
        const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://localhost:4000'
          : 'https://aussieadrenaline-api.vercel.app';
        
        const response = await fetch(`${apiUrl}/api/receipts/${receiptId}`);
        
        if (!response.ok) {
          if (response.status === 503) {
            // Receipts are disabled - show disabled state
            setKillSwitchEnabled(true);
            setLoading(false);
            return;
          }
          if (response.status === 404) {
            throw new Error('Receipt not found');
          }
          throw new Error(`Failed to fetch receipt: ${response.statusText}`);
        }
        
        const data: ReceiptResponse = await response.json();
        
        if (data.success && data.receipt) {
          setReceipt(data.receipt);
        } else {
          throw new Error('Failed to fetch receipt');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load receipt');
        console.error('Error fetching receipt:', err);
      } finally {
        setLoading(false);
      }
    };

    if (receiptId) {
      fetchReceipt();
    }
  }, [receiptId, killSwitchEnabled]);

  // Show kill switch message if enabled
  if (killSwitchEnabled === true) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/receipts" 
              className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
            >
              ← Back to Receipts
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Receipt Details</h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Receipts Unavailable</h2>
            <p className="text-gray-600 mb-6">
              Receipt viewing is currently unavailable. Please try again later.
            </p>
            <Link
              href="/receipts"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors inline-block"
            >
              Return to Receipts
            </Link>
          </div>
        </div>
      </main>
    );
  }

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

  const toggleItemSelection = (itemId: string, maxQuantity: number) => {
    const newSelected = new Map(selectedItems);
    if (newSelected.has(itemId)) {
      // If already selected, deselect it
      newSelected.delete(itemId);
    } else {
      // If not selected, select it with default quantity of 1
      newSelected.set(itemId, 1);
    }
    setSelectedItems(newSelected);
  };

  const handleDisputeAll = () => {
    if (!receipt || !receipt.receipt_items) return;
    
    const newSelected = new Map<string, number>();
    // Select all items with their full quantities
    receipt.receipt_items.forEach(item => {
      newSelected.set(item.id, item.quantity);
    });
    setSelectedItems(newSelected);
  };

  const handleClearAll = () => {
    setSelectedItems(new Map());
  };

  const updateItemQuantity = (itemId: string, quantity: number, maxQuantity: number) => {
    const newSelected = new Map(selectedItems);
    // Ensure quantity is between 1 and maxQuantity
    const clampedQuantity = Math.max(1, Math.min(quantity, maxQuantity));
    if (clampedQuantity > 0) {
      newSelected.set(itemId, clampedQuantity);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const getSelectedItemsData = () => {
    if (!receipt || !receipt.receipt_items) return [];
    return receipt.receipt_items
      .filter(item => selectedItems.has(item.id))
      .map(item => ({
        ...item,
        disputedQuantity: selectedItems.get(item.id) || item.quantity
      }));
  };

  const calculateDisputedTotal = () => {
    const selected = getSelectedItemsData();
    return selected.reduce((total, item) => {
      const disputedQuantity = selectedItems.get(item.id) || item.quantity;
      const itemTotal = parseFloat(item.item_price) * disputedQuantity;
      return total + itemTotal;
    }, 0);
  };

  const handleDisputeClick = () => {
    if (selectedItems.size === 0) return;
    setShowDisputeModal(true);
  };

  const handleConfirmDispute = async () => {
    if (!receipt || !reasonCode) return;

    setIsSubmitting(true);

    try {
      // Use localhost for local development, production API for deployed app
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const selectedItemsData = getSelectedItemsData().map(item => ({
        receipt_item_id: item.id,
        quantity: selectedItems.get(item.id) || item.quantity
      }));

      const response = await fetch(`${apiUrl}/api/disputes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receipt_id: receipt.id,
          selected_items: selectedItemsData,
          reason_code: reasonCode,
          notes: notes.trim() || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create dispute');
      }

      // Success!
      setDisputeSuccess({
        dispute_id: data.dispute_id,
        status: data.status
      });
      setShowDisputeModal(false);
      setSelectedItems(new Map());
      setReasonCode('');
      setNotes('');

    } catch (err) {
      console.error('Error creating dispute:', err);
      alert(`Failed to create dispute: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelDispute = () => {
    setShowDisputeModal(false);
    setReasonCode('');
    setNotes('');
  };

  const disputeReasonCodes = [
    { value: 'item_not_received', label: 'Item Not Received' },
    { value: 'item_defective', label: 'Item Defective or Damaged' },
    { value: 'unauthorized_transaction', label: 'Unauthorized Transaction' },
    { value: 'duplicate_charge', label: 'Duplicate Charge' },
    { value: 'incorrect_amount', label: 'Incorrect Amount Charged' },
    { value: 'merchant_error', label: 'Merchant Error' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/receipts" 
            className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
          >
            ← Back to Receipts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Receipt Details</h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-4 text-gray-600">Loading receipt...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <Link 
              href="/receipts"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
            >
              Return to Receipts
            </Link>
          </div>
        )}

        {/* Receipt Details */}
        {!loading && !error && receipt && (
          <>
            {/* Fallback Panel for Below Threshold Receipts */}
            {receipt.below_threshold ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Receipt Not Available</h2>
                <p className="text-gray-600 mb-6">
                  An itemised receipt is not available for this transaction.
                </p>

                {/* Confidence Explainability for Blocked Receipt */}
                {receipt.confidence_score !== null && receipt.confidence_score !== undefined && (
                  <div className="mb-6 max-w-2xl mx-auto">
                    <ConfidenceExplainability
                      confidence_score={receipt.confidence_score}
                      confidence_label={receipt.confidence_label}
                      confidence_reasons={receipt.confidence_reasons}
                      isBlocked={true}
                      alwaysExpanded={true}
                    />
                  </div>
                )}

                <Link
                  href="/receipts"
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors inline-block"
                >
                  Back to Receipts
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8">
            {/* Receipt Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {receipt.merchant_name || 'Merchant'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Payment ID: {receipt.payment_id}
                    {receipt.source === 'simulated' && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                        🎭 Simulated
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-600">
                    {formatCurrency(receipt.amount, receipt.currency)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {receipt.currency}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Date: {formatDate(receipt.created_at)}</p>
                <p className="mt-1">Receipt ID: {receipt.id}</p>
              </div>
            </div>

            {/* Confidence Explainability Panel */}
            {receipt.confidence_label && (receipt.confidence_label === 'HIGH' || receipt.confidence_label === 'MEDIUM') && (
              <div className="mb-6">
                <ConfidenceExplainability
                  confidence_score={receipt.confidence_score}
                  confidence_label={receipt.confidence_label}
                  confidence_reasons={receipt.confidence_reasons}
                  isBlocked={false}
                  alwaysExpanded={false}
                />
              </div>
            )}

            {/* Proof-of-purchase reference (QR) */}
            <ReceiptShareSection receiptId={receipt.id} />

            {/* Receipt Items */}
            {receipt.receipt_items && receipt.receipt_items.length > 0 ? (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Items</h3>
                  <div className="flex items-center gap-3">
                    {selectedItems.size > 0 && (
                      <span className="text-sm text-indigo-600 font-medium">
                        {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                        {Array.from(selectedItems.values()).reduce((sum, qty) => sum + qty, 0) > selectedItems.size && (
                          <span className="ml-2 text-xs">
                            ({Array.from(selectedItems.values()).reduce((sum, qty) => sum + qty, 0)} total units)
                          </span>
                        )}
                      </span>
                    )}
                    {receipt.receipt_items.length > 0 && (
                      <div className="flex gap-2">
                        {selectedItems.size === 0 ? (
                          <button
                            onClick={handleDisputeAll}
                            className="px-3 py-1.5 text-sm bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                          >
                            Dispute This Transaction
                          </button>
                        ) : (
                          <button
                            onClick={handleClearAll}
                            className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {receipt.receipt_items.map((item) => {
                    const isSelected = selectedItems.has(item.id);
                    const disputedQuantity = isSelected ? (selectedItems.get(item.id) || 1) : 0;
                    const itemTotal = parseFloat(item.item_price) * item.quantity;
                    const disputedTotal = parseFloat(item.item_price) * disputedQuantity;
                    return (
                      <div 
                        key={item.id}
                        className={`flex items-center gap-4 py-3 px-4 border rounded-lg transition-all ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleItemSelection(item.id, item.quantity)}
                          className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <div className="flex-1">
                            <p className={`font-medium ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                              {item.item_name}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                              {isSelected && item.quantity > 1 && (
                                <div className="flex items-center gap-2">
                                  <label className="text-xs text-indigo-700 font-medium">
                                    Dispute:
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max={item.quantity}
                                    value={disputedQuantity}
                                    onChange={(e) => {
                                      const newQty = parseInt(e.target.value, 10) || 1;
                                      updateItemQuantity(item.id, newQty, item.quantity);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-16 px-2 py-1 text-sm border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                  <span className="text-xs text-gray-500">
                                    of {item.quantity}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                              {formatCurrency(item.item_price, receipt.currency)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-gray-500">
                                {formatCurrency(itemTotal.toString(), receipt.currency)} total
                              </p>
                            )}
                            {isSelected && disputedQuantity < item.quantity && (
                              <p className="text-xs text-indigo-600 font-medium mt-1">
                                Disputing: {formatCurrency(disputedTotal.toString(), receipt.currency)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Dispute Button */}
                {selectedItems.size > 0 && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleDisputeClick}
                      className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      Dispute Selected Items ({selectedItems.size})
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-6 text-gray-500 text-sm">
                No items listed for this receipt.
              </div>
            )}

            {/* Receipt Footer */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(receipt.amount, receipt.currency)}
                </span>
              </div>
            </div>
              </div>
            )}
          </>
        )}

        {/* Dispute Success Message */}
        {disputeSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Dispute Submitted</h2>
                    <p className="text-sm text-gray-600">Your dispute has been successfully submitted</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dispute ID:</span>
                      <span className="font-mono text-gray-900 text-xs">{disputeSuccess.dispute_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-gray-900 capitalize">{disputeSuccess.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDisputeSuccess(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href="/disputes"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-center"
                  >
                    View Disputes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dispute Confirmation Modal */}
        {showDisputeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Confirm Dispute
                </h2>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    You are about to dispute the following items from this receipt:
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Items to Dispute:</h3>
                    <div className="space-y-2">
                      {getSelectedItemsData().map((item) => {
                        const disputedQuantity = selectedItems.get(item.id) || item.quantity;
                        const itemTotal = parseFloat(item.item_price) * disputedQuantity;
                        const isPartialDispute = disputedQuantity < item.quantity;
                        return (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                            <div>
                              <p className="font-medium text-gray-900">{item.item_name}</p>
                              <p className="text-sm text-gray-500">
                                {isPartialDispute ? (
                                  <>
                                    <span className="text-indigo-600 font-medium">{disputedQuantity}</span> of {item.quantity} × {formatCurrency(item.item_price, receipt?.currency || 'USD')}
                                  </>
                                ) : (
                                  <>
                                    {item.quantity} × {formatCurrency(item.item_price, receipt?.currency || 'USD')}
                                  </>
                                )}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(itemTotal.toString(), receipt?.currency || 'USD')}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Total Disputed Amount:
                      </span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {formatCurrency(calculateDisputedTotal().toString(), receipt?.currency || 'USD')}
                      </span>
                    </div>
                  </div>
                  
                </div>

                {/* Reason Code Selection */}
                <div className="mb-4">
                  <label htmlFor="reason-code" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason Code <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="reason-code"
                    value={reasonCode}
                    onChange={(e) => setReasonCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select a reason...</option>
                    {disputeReasonCodes.map((code) => (
                      <option key={code.value} value={code.value}>
                        {code.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Notes */}
                <div className="mb-6">
                  <label htmlFor="dispute-notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="dispute-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    placeholder="Provide any additional information about this dispute..."
                  />
                </div>

                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    This action will submit a dispute for review. The disputed amount will be processed according to standard procedures.
                  </p>
                </div>
                
                <div className="flex gap-4 justify-end mt-6">
                  <button
                    onClick={handleCancelDispute}
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDispute}
                    disabled={isSubmitting || !reasonCode}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Receipt Share Section Component
function ReceiptShareSection({ receiptId }: { receiptId: string }) {
  const [shareData, setShareData] = useState<{ verify_url: string; token: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrEnabled, setQREnabled] = useState<boolean | null>(null);

  const fetchShareToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      // POST request - Fastify doesn't require body for POST, but we'll send empty object
      const response = await fetch(`${apiUrl}/api/receipts/${receiptId}/share`, {
        method: 'POST',
        // Don't set Content-Type if body is empty - Fastify handles this better
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.success || !data.share) {
        throw new Error('Invalid response from server');
      }
      
      setShareData(data.share);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate QR code';
      setError(errorMessage);
      console.error('Error fetching share token:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareData?.verify_url) return;
    
    try {
      await navigator.clipboard.writeText(shareData.verify_url);
      // Show temporary success message
      const button = document.getElementById('copy-link-button');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('bg-green-600');
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('bg-green-600');
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Check if QR verification is enabled
  useEffect(() => {
    const checkQREnabled = async () => {
      try {
        const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://localhost:4000'
          : 'https://aussieadrenaline-api.vercel.app';

        const response = await fetch(`${apiUrl}/api/bank-admin/qr-settings`);
        
        if (response.ok) {
          const data = await response.json();
          setQREnabled(data.settings?.enable_qr_verification ?? true);
        } else {
          // Default to enabled if endpoint doesn't exist or fails
          setQREnabled(true);
        }
      } catch (err) {
        console.error('Error checking QR settings:', err);
        // Default to enabled on error
        setQREnabled(true);
      }
    };

    checkQREnabled();
  }, []);

  // Fetch share token on mount (only if QR is enabled)
  useEffect(() => {
    if (qrEnabled === true) {
      fetchShareToken();
    }
  }, [receiptId, qrEnabled]);

  // Hide QR section entirely if QR verification is disabled
  if (qrEnabled === false) {
    return null;
  }

  // Show loading state while checking QR settings
  if (qrEnabled === null) {
    return null; // Or you could show a loading spinner
  }

  return (
    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Proof-of-purchase reference (QR)</h3>
      <p className="text-sm text-gray-600 mb-4">
        This reference can be shown to store staff or support if proof of purchase is required.
      </p>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={fetchShareToken}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {shareData && !loading && (
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
            <QRCodeSVG
              value={shareData.verify_url}
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>
          
          <div className="w-full max-w-md space-y-3">
            <button
              id="copy-link-button"
              onClick={copyToClipboard}
              className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Copy Link
            </button>
            
            <p className="text-xs text-gray-600 text-center">
              This reference can be shown to store staff or support if proof of purchase is required.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

