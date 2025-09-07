'use client';

import { useState } from 'react';
import { Photocard, Print } from '@/types/menu';
import { useCart } from '@/contexts/CartContext';
import CheckoutModal from './CheckoutModal';

interface CartProps {
  onPlaceOrder?: () => void;
  isPlacingOrder?: boolean;
  isAuthenticated?: boolean;
}

export default function Cart({ 
  onPlaceOrder, 
  isPlacingOrder = false, 
  isAuthenticated = false 
}: CartProps) {
  const { cart, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Please sign in to place an order');
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = () => {
    if (onPlaceOrder) {
      onPlaceOrder();
    }
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  if (cart.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-secondary-800 mb-4">Your Cart</h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-secondary-600">Your cart is empty</p>
          <p className="text-sm text-secondary-500 mt-2">
            Add some photocards to your collection!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card p-6 sticky top-24">
        <h2 className="text-2xl font-bold text-secondary-800 mb-4">Your Cart</h2>
        
        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {Object.entries(
            cart.reduce((acc, item) => {
              if (!acc[item.id]) {
                acc[item.id] = { ...item, cartQuantity: 0 };
              }
              acc[item.id].cartQuantity += 1;
              return acc;
            }, {} as Record<number, (Photocard | Print) & { cartQuantity: number }>)
          ).map(([id, item]) => (
            <div key={id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-secondary-800">{item.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-secondary-600">
                  <span>${item.price.toFixed(2)} each</span>
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                    Qty: {item.cartQuantity}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove one item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        
        <div className="border-t border-secondary-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-secondary-800">Total:</span>
            <span className="text-2xl font-bold text-primary-600">
              ${getTotalPrice().toFixed(2)}
            </span>
          </div>
          
          <div className="space-y-2">
            {isAuthenticated ? (
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Sign In to Order
              </button>
            )}
            
            <button
              onClick={clearCart}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      {isCheckoutOpen && (
        <CheckoutModal
          cart={cart}
          totalPrice={getTotalPrice()}
          onClose={handleCloseCheckout}
          onOrderPlaced={clearCart}
        />
      )}
    </>
  );
}
