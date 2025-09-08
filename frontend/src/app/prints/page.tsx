'use client';

import { useState, useEffect } from 'react';
import { Print } from '@/types/menu';
import PrintGrid from '@/components/PrintGrid';
import Cart from '@/components/Cart';
import Header from '@/components/Header';
import CartDebug from '@/components/CartDebug';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function PrintsPage() {
  const { isAuthenticated } = useAuth();
  const { cart, addToCart, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [prints, setPrints] = useState<Print[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchPrints();
  }, [sortBy, sortOrder, searchTerm, minPrice, maxPrice]);

  const fetchPrints = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (searchTerm) params.append('search', searchTerm);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const response = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/prints?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPrints(data);
      } else {
        console.error('Failed to fetch prints');
      }
    } catch (error) {
      console.error('Error fetching prints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to place an order');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: Object.entries(
            cart.reduce((acc, item) => {
              if (!acc[item.id]) {
                acc[item.id] = { ...item, quantity: 0 };
              }
              acc[item.id].quantity += 1;
              return acc;
            }, {} as Record<number, Print & { quantity: number }>)
          ).map(([id, item]) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total: getTotalPrice(),
        })
      });

      if (response.ok) {
        alert('Order placed successfully!');
        clearCart();
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrints();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('name');
    setSortOrder('asc');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-gray-600">Loading prints...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <CartDebug />
      <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
        <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Prints Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our collection of high-quality prints featuring your favorite K-pop groups and artists.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search prints..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="100.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="quantity">Quantity</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PrintGrid prints={prints} onAddToCart={addToCart} />
          </div>
          
          <div className="lg:col-span-1">
            <Cart 
              onPlaceOrder={placeOrder}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}