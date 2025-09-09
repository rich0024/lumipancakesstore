// Google Tag Manager utility functions

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-PMWK3QFJ';

// Initialize dataLayer if it doesn't exist
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: action,
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// E-commerce tracking functions
export const trackPurchase = (transactionId: string, value: number, currency: string = 'USD') => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'purchase',
      transaction_id: transactionId,
      value: value,
      currency: currency,
    });
  }
};

export const trackAddToCart = (itemId: string, itemName: string, value: number) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'add_to_cart',
      currency: 'USD',
      value: value,
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          price: value,
          quantity: 1,
        },
      ],
    });
  }
};

export const trackRemoveFromCart = (itemId: string, itemName: string, value: number) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'remove_from_cart',
      currency: 'USD',
      value: value,
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          price: value,
          quantity: 1,
        },
      ],
    });
  }
};

export const trackViewItem = (itemId: string, itemName: string, value: number) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'view_item',
      currency: 'USD',
      value: value,
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          price: value,
        },
      ],
    });
  }
};

// Extend the Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}
