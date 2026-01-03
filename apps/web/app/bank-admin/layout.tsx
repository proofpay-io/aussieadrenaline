'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function BankAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Simple authentication check (prototype)
    // In production, this should be replaced with proper bank authentication
    const checkAuth = () => {
      // Check for secret in URL params
      const urlParams = new URLSearchParams(window.location.search);
      const secret = urlParams.get('secret');
      
      // Check environment variable (for server-side)
      const envSecret = process.env.NEXT_PUBLIC_BANK_ADMIN_SECRET;
      
      // Default to 'dev-secret-change-in-production' for development
      const requiredSecret = envSecret || 'dev-secret-change-in-production';
      
      // If no secret in URL and we're not in dev mode, redirect or show error
      // For now, allow access in dev mode (no secret required)
      if (requiredSecret !== 'dev-secret-change-in-production' && !secret) {
        // In production, you might want to redirect or show an auth form
        // For now, we'll just allow access and log a warning
        console.warn('⚠️ Bank Admin: No authentication secret provided. This is a prototype.');
      }
    };

    checkAuth();
  }, []);

  return <>{children}</>;
}

