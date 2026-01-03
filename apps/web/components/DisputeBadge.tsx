'use client';

interface DisputeBadgeProps {
  hasActiveDispute: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function DisputeBadge({
  hasActiveDispute,
  size = 'md'
}: DisputeBadgeProps) {
  // Don't show badge if no active dispute
  if (!hasActiveDispute) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 border rounded-full font-medium bg-amber-100 text-amber-800 border-amber-200 ${sizeClasses[size]}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>Under dispute</span>
    </div>
  );
}

