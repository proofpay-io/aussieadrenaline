'use client';

interface RefundedBadgeProps {
  isRefunded: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RefundedBadge({
  isRefunded,
  size = 'md'
}: RefundedBadgeProps) {
  // Don't show badge if not refunded
  if (!isRefunded) {
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
      <span>Refunded</span>
    </div>
  );
}

