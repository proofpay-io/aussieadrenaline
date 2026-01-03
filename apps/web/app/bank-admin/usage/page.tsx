'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReceiptEvent {
  id: string;
  created_at: string;
  event_type: string;
  receipt_id: string | null;
  metadata: any;
}

interface RetentionPolicy {
  days: number;
}

interface UsageResponse {
  success: boolean;
  events: ReceiptEvent[];
  total: number;
  page: number;
  page_size: number;
}

export default function BankAdminUsage() {
  const [events, setEvents] = useState<ReceiptEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [retentionPolicy, setRetentionPolicy] = useState<RetentionPolicy | null>(null);
  const [filters, setFilters] = useState({
    event_type: '',
    start_date: '',
    end_date: ''
  });
  const pageSize = 50;

  useEffect(() => {
    fetchEvents();
    fetchRetentionPolicy();
  }, [page, filters]);

  const fetchRetentionPolicy = async () => {
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://aussieadrenaline-api.vercel.app';

      const response = await fetch(`${apiUrl}/api/bank-admin/retention-policy`);
      
      if (response.ok) {
        const data = await response.json();
        setRetentionPolicy(data);
      }
    } catch (err) {
      console.error('Error fetching retention policy:', err);
    }
  };

  const fetchEvents = async () => {
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

      if (filters.event_type) {
        params.append('event_type', filters.event_type);
      }
      if (filters.start_date) {
        params.append('start_date', filters.start_date);
      }
      if (filters.end_date) {
        params.append('end_date', filters.end_date);
      }

      const response = await fetch(`${apiUrl}/api/bank-admin/usage?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data: UsageResponse = await response.json();
      setEvents(data.events || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const exportCSV = () => {
    const headers = ['ID', 'Created At', 'Event Type', 'Receipt ID', 'Metadata'];
    const rows = events.map(event => [
      event.id,
      event.created_at,
      event.event_type,
      event.receipt_id || '',
      JSON.stringify(event.metadata || {})
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proofpay-events-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

  const totalPages = Math.ceil(total / pageSize);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Usage Log</h1>
              <p className="text-sm text-gray-600">
                Receipt event audit trail
                {retentionPolicy && (
                  <span className="ml-2 text-gray-500">
                    • Data retention: {retentionPolicy.days} days
                  </span>
                )}
              </p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/bank-admin" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/bank-admin/usage" className="text-indigo-600 font-medium">Usage</Link>
              <Link href="/bank-admin/disputes" className="text-gray-600 hover:text-gray-900">Disputes</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
              <select
                value={filters.event_type}
                onChange={(e) => handleFilterChange('event_type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Events</option>
                <option value="receipt_created">Receipt Created</option>
                <option value="receipt_viewed">Receipt Viewed</option>
                <option value="receipt_view_blocked">Receipt View Blocked</option>
                <option value="dispute_created">Dispute Created</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={exportCSV}
                disabled={events.length === 0}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Export Events CSV
              </button>
              <button
                onClick={exportDailyMetricsCSV}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Export Daily Metrics CSV
              </button>
            </div>
          </div>
        </div>

        {/* Daily Metrics Export Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Daily Metrics Export:</strong> Includes confidence distribution and blocked-view metrics for pilot reporting and invoice reconciliation.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-4 text-gray-600">Loading events...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Events Table */}
        {!loading && !error && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Events</h2>
                <p className="text-sm text-gray-600">Total: {total}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metadata</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No events found
                        </td>
                      </tr>
                    ) : (
                      events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(event.created_at).toLocaleString('en-US')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              event.event_type === 'receipt_created' ? 'bg-green-100 text-green-800' :
                              event.event_type === 'receipt_viewed' ? 'bg-blue-100 text-blue-800' :
                              event.event_type === 'receipt_view_blocked' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {event.event_type.replace(/_/g, ' ')}
                            </span>
                            {event.event_type === 'receipt_view_blocked' && event.metadata?.reason && (
                              <div className="mt-1 text-xs text-gray-600">
                                Reason: <span className="font-semibold">{event.metadata.reason}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                            {event.receipt_id ? event.receipt_id.substring(0, 8) + '...' : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto max-w-md">
                              {JSON.stringify(event.metadata || {}, null, 2)}
                            </pre>
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
                  Page {page} of {totalPages} ({total} total events)
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
      </div>
    </main>
  );
}

