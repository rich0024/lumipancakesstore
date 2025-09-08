'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MenuCard from '@/components/MenuCard';
import { Photocard } from '@/types/menu';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [recentCards, setRecentCards] = useState<Photocard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentCards();
  }, []);

  const fetchRecentCards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/menu');
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }
      const data = await response.json();
      // Get the 5 most recent cards (assuming higher IDs are more recent)
      const recent = data.sort((a: Photocard, b: Photocard) => b.id - a.id).slice(0, 5);
      setRecentCards(recent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-16 h-64 bg-gradient-to-r from-pink-100 via-pink-50 to-purple-100 rounded-2xl overflow-hidden">
          {/* Content */}
          <div className="flex flex-col items-center justify-center text-center h-full p-8">
            {/* Main title */}
            <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-4 font-cursive">
              Lumi<span className="text-pink-500">❤️</span>Pancakes
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              k-pop photocards &amp; instant film prints
            </p>
            
            {/* CTA Button */}
            <Link 
              href="/collection"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore Collection ✨
            </Link>
          </div>
        </div>

        {/* About Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              About Lumi❤️Pancakes
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Welcome to Lumi❤️Pancakes, your premier destination for authentic K-pop photocards and instant film prints! 
                  We're passionate about bringing you the most beautiful and rare collectibles from your favorite idols.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Our carefully curated collection features official photocards from top K-pop groups including BTS, 
                  NewJeans, LE SSERAFIM, aespa, TWICE, ITZY, Stray Kids, and IVE. Each photocard is authenticated 
                  and comes with detailed information about rarity and origin.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Whether you're a seasoned collector or just starting your K-pop journey, we have something special 
                  waiting for you. Join our community of passionate fans and discover your next favorite piece!
                </p>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/Lumi Pancakes - Etsy Shop Icon.png"
                  alt="Lumi Pancakes Icon"
                  width={200}
                  height={200}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recent Cards Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Latest Additions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Check out our 5 most recent photocard additions to the store
            </p>
          </div>

          {error ? (
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">📸</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchRecentCards}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {recentCards.map((card) => (
                <div key={card.id} className="group">
                  <MenuCard 
                    item={card} 
                    onAddToCart={() => {}} 
                    showAddButton={false}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link 
              href="/collection"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              View All Cards
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              Why Choose Lumi❤️Pancakes?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Authentic Items</h3>
                <p className="text-gray-600">
                  All our photocards are 100% authentic and verified by our expert team
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast Shipping</h3>
                <p className="text-gray-600">
                  Quick and secure shipping worldwide with tracking for all orders
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💖</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Community</h3>
                <p className="text-gray-600">
                  Join our passionate community of K-pop collectors and fans
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
