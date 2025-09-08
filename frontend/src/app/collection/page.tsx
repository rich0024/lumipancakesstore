'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MenuGrid from '@/components/MenuGrid';
import Cart from '@/components/Cart';
import CartDebug from '@/components/CartDebug';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Photocard } from '@/types/menu';

export default function Collection() {
  const { isAuthenticated } = useAuth();
  const { cart, addToCart, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [menu, setMenu] = useState<Photocard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [filterGroup, setFilterGroup] = useState<string>('');
  const [filterRarity, setFilterRarity] = useState<string>('');
  const [filterAge, setFilterAge] = useState<string>('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, [sortBy, sortOrder, filterGroup, filterRarity, filterAge]);

  const fetchMenu = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (filterGroup) params.append('group', filterGroup);
      if (filterRarity) params.append('rarity', filterRarity);
      if (filterAge) params.append('age', filterAge);
      
      const response = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/menu?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }
      const data = await response.json();
      setMenu(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  const placeOrder = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to place an order');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setIsPlacingOrder(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: Object.entries(
            cart.reduce((acc, item) => {
              if (!acc[item.id]) {
                acc[item.id] = { 
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: 0 
                };
              }
              acc[item.id].quantity += 1;
              return acc;
            }, {} as Record<number, { id: number; name: string; price: number; quantity: number }>)
          ).map(([id, item]) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total: getTotalPrice(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const result = await response.json();
      alert(`Order placed successfully! Order #${result.order.id}`);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading photocard collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">📸</div>
          <h2 className="text-2xl font-bold text-secondary-800 mb-2">Oops!</h2>
          <p className="text-secondary-600 mb-4">{error}</p>
          <button 
            onClick={fetchMenu}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <CartDebug />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
            Discover Our Photocard Collection
          </h1>
          <p className="text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto">
            Find your favorite K-pop idols and groups with our curated collection of official photocards and instant film prints.
          </p>
        </div>

        {/* Sorting and Filtering Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sort & Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="group">Group</option>
                <option value="album">Album</option>
                <option value="age">Age</option>
                <option value="rarity">Rarity</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            {/* Filter by Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">All Groups</option>
                <option value="BTS">BTS</option>
                <option value="NewJeans">NewJeans</option>
                <option value="LE SSERAFIM">LE SSERAFIM</option>
                <option value="aespa">aespa</option>
                <option value="TWICE">TWICE</option>
                <option value="ITZY">ITZY</option>
                <option value="Stray Kids">Stray Kids</option>
                <option value="IVE">IVE</option>
              </select>
            </div>

            {/* Filter by Rarity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rarity</label>
              <select
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">All Rarities</option>
                <option value="Album">Album</option>
                <option value="Preorder Benefit">Preorder Benefit</option>
                <option value="Lucky Draw">Lucky Draw</option>
              </select>
            </div>

            {/* Filter by Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <select
                value={filterAge}
                onChange={(e) => setFilterAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">All Ages</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSortBy('name');
                setSortOrder('asc');
                setFilterGroup('');
                setFilterRarity('');
                setFilterAge('');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MenuGrid menu={menu} onAddToCart={addToCart} />
          </div>
          
          <div className="lg:col-span-1">
            <Cart 
              onPlaceOrder={placeOrder}
              isPlacingOrder={isPlacingOrder}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
