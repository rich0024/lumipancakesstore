'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface PageTrackerProps {
  gtmId: string;
}

export default function PageTracker({ gtmId }: PageTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // Push page view event to GTM dataLayer
      window.dataLayer.push({
        event: 'page_view',
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [pathname, searchParams, gtmId]);

  return null;
}

// Extend the Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}
