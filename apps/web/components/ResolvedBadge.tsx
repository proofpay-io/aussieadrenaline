'use client';

interface ResolvedBadgeProps {
  hasResolvedDispute: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ResolvedBadge({
  hasResolvedDispute,
  size = 'md'
}: ResolvedBadgeProps) {
  // Don't show badge if no resolved dispute
  if (!hasResolvedDispute) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 border rounded-full font-medium bg-green-100 text-green-800 border-green-200 ${sizeClasses[size]}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Resolved</span>
    </div>
  );
}

