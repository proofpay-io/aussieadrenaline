'use client';

import { useState } from 'react';

interface ConfidenceBadgeProps {
  confidence_score: number | null | undefined;
  confidence_label: string | null | undefined;
  confidence_reasons?: string[] | null;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ConfidenceBadge({
  confidence_score,
  confidence_label,
  confidence_reasons,
  showScore = true,
  size = 'md'
}: ConfidenceBadgeProps) {
  const [showReasons, setShowReasons] = useState(false);

  // If no confidence data, don't show badge
  if (confidence_score === null || confidence_score === undefined || !confidence_label) {
    return null;
  }

  // Determine badge color based on label
  const getBadgeColor = () => {
    switch (confidence_label.toUpperCase()) {
      case 'HIGH':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const hasReasons = confidence_reasons && confidence_reasons.length > 0;

  return (
    <div className="inline-flex items-center gap-2">
      <div className={`inline-flex items-center gap-1.5 border rounded-full font-medium ${getBadgeColor()} ${sizeClasses[size]}`}>
        <span className="capitalize">{confidence_label.toLowerCase()} confidence</span>
        {showScore && (
          <span className="font-semibold">{confidence_score}%</span>
        )}
      </div>
      
      {hasReasons && (
        <div className="relative">
          <button
            onClick={() => setShowReasons(!showReasons)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Show confidence reasons"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          {showReasons && (
            <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 left-0">
              <div className="text-xs font-semibold text-gray-700 mb-2">Confidence Reasons:</div>
              <ul className="space-y-1">
                {confidence_reasons.map((reason, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>{reason.replace(/_/g, ' ')}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowReasons(false)}
                className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

