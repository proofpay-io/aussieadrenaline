'use client';

import Link from 'next/link';

export default function DisputesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/receipts" 
            className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
          >
            ← Back to Receipts
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Disputes</h1>
          <p className="text-gray-600">Dispute management and review</p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Dispute Management</h2>
            <p className="text-gray-600 mb-6">
              Dispute management interface will be available here.
            </p>
            <Link
              href="/receipts"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors inline-block"
            >
              View Receipts
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

