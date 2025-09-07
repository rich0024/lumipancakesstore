'use client';

import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';

// Temporary debug component to inspect cart state and localStorage
export default function CartDebug() {
  const { cart, getCartCount } = useCart();
  const [localStorageCart, setLocalStorageCart] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    setLocalStorageCart(stored);
  }, []);

  return (
    <div className="fixed top-20 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Cart Debug</h3>
      <div>Cart Length: {cart.length}</div>
      <div>Cart Count: {getCartCount()}</div>
      <div>localStorage: {localStorageCart}</div>
      <div className="mt-2">
        <strong>Cart Items:</strong>
        <pre className="text-xs mt-1">
          {JSON.stringify(cart, null, 2)}
        </pre>
      </div>
    </div>
  );
}

