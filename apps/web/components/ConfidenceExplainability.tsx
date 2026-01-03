'use client';

import { useState } from 'react';
import { formatConfidenceReasons } from '../lib/confidence-reasons';

interface ConfidenceExplainabilityProps {
  confidence_score: number | null | undefined;
  confidence_label: string | null | undefined;
  confidence_reasons?: string[] | null;
  isBlocked?: boolean;
  alwaysExpanded?: boolean; // For admin views
  showScore?: boolean; // For admin views
}

export default function ConfidenceExplainability({
  confidence_score,
  confidence_label,
  confidence_reasons,
  isBlocked = false,
  alwaysExpanded = false,
  showScore = false
}: ConfidenceExplainabilityProps) {
  const [isExpanded, setIsExpanded] = useState(alwaysExpanded);

  // Don't show if no confidence data
  if (confidence_score === null || confidence_score === undefined || !confidence_label) {
    return null;
  }

  // Only show for HIGH or MEDIUM confidence (or if blocked)
  if (!isBlocked && confidence_label.toUpperCase() !== 'HIGH' && confidence_label.toUpperCase() !== 'MEDIUM') {
    return null;
  }

  const reasons = formatConfidenceReasons(confidence_reasons);
  const hasReasons = reasons.length > 0;

  // Determine panel styling based on confidence or blocked status
  const getPanelStyle = () => {
    if (isBlocked) {
      return 'bg-amber-50 border-amber-200';
    }
    switch (confidence_label.toUpperCase()) {
      case 'HIGH':
        return 'bg-green-50 border-green-200';
      case 'MEDIUM':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTitle = () => {
    if (isBlocked) {
      return 'Why this receipt is not available';
    }
    return 'Why this receipt is trusted';
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${getPanelStyle()}`}>
      <button
        onClick={() => !alwaysExpanded && setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between ${!alwaysExpanded ? 'cursor-pointer' : 'cursor-default'}`}
        disabled={alwaysExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {isBlocked ? (
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900">
              {getTitle()}
            </h3>
            {showScore && confidence_score !== null && (
              <p className="text-xs text-gray-600 mt-0.5">
                Confidence score: {confidence_score}%
              </p>
            )}
          </div>
        </div>
        {!alwaysExpanded && (
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {hasReasons ? (
            <ul className="space-y-2">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600 italic">
              No specific confidence reasons available for this receipt.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

