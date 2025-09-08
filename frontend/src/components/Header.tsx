'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import LoginModal from './LoginModal';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <header className="relative shadow-lg sticky top-0 z-50">
        {/* Banner Background */}
        <div className="relative h-32 md:h-48 lg:h-56 bg-white">
          <Image
            src="https://res.cloudinary.com/dx4biopst/image/upload/v1757303765/Lumi_Pancakes_-_Etsy_Shop_Banner_quqed4.png"
            alt="Lumi Pancakes Banner"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Navigation */}
        <div className="bg-rose-200 py-3">
          <div className="container mx-auto px-4">
            {/* Mobile Layout */}
            <div className="flex items-center justify-between md:hidden">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-700 hover:text-pink-600 transition-colors p-2"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Cart */}
              <button
                onClick={() => setShowCart(true)}
                className="relative text-2xl text-gray-700 hover:text-pink-600 transition-colors"
              >
                🛒
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {showMobileMenu && (
              <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
                <div className="px-4 py-3 space-y-3">
                  {/* Navigation Links */}
                  <nav className="space-y-2">
                    <a 
                      href="/" 
                      className="block text-gray-700 hover:text-pink-600 transition-colors font-semibold py-2"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Home
                    </a>
                    <a 
                      href="/collection" 
                      className="block text-gray-700 hover:text-pink-600 transition-colors font-semibold py-2"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Photocards
                    </a>
                    <a 
                      href="/prints" 
                      className="block text-gray-700 hover:text-pink-600 transition-colors font-semibold py-2"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Prints
                    </a>
                    {isAdmin && (
                      <a 
                        href="/admin" 
                        className="block text-gray-700 hover:text-pink-600 transition-colors font-semibold py-2"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Admin
                      </a>
                    )}
                    <a 
                      href="#" 
                      className="block text-gray-700 hover:text-pink-600 transition-colors font-semibold py-2"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Contact
                    </a>
                  </nav>

                  {/* User Section */}
                  <div className="border-t border-gray-200 pt-3">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="text-4xl md:text-6xl font-bold text-pink-600 mb-4 font-cursive">
                          Hi, {user?.name?.split(' ')[0]}!
                        </div>
                        <a 
                          href="/profile" 
                          className="block text-gray-700 hover:text-pink-600 transition-colors font-semibold py-2"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          Profile
                        </a>
                        <button
                          onClick={() => {
                            logout();
                            setShowMobileMenu(false);
                          }}
                          className="block text-gray-700 hover:text-pink-600 transition-colors font-semibold py-2"
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setShowLoginModal(true);
                          setShowMobileMenu(false);
                        }}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
                      >
                        Sign In
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <nav className="flex space-x-6">
                  <a href="/" className="text-gray-700 hover:text-pink-600 transition-colors font-semibold">
                    Home
                  </a>
                  <a href="/collection" className="text-gray-700 hover:text-pink-600 transition-colors font-semibold">
                    Photocards
                  </a>
                  <a href="/prints" className="text-gray-700 hover:text-pink-600 transition-colors font-semibold">
                    Prints
                  </a>
                  {isAdmin && (
                    <a href="/admin" className="text-gray-700 hover:text-pink-600 transition-colors font-semibold">
                      Admin
                    </a>
                  )}
                  <a href="#" className="text-gray-700 hover:text-pink-600 transition-colors font-semibold">
                    Contact
                  </a>
                </nav>
              </div>

              {/* User Section and Cart */}
              <div className="flex items-center space-x-4">
                {/* Cart */}
                <button
                  onClick={() => setShowCart(true)}
                  className="relative text-2xl text-gray-700 hover:text-pink-600 transition-colors"
                >
                  🛒
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </button>

                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-700 font-medium">Hi, {user?.name}!</span>
                    <a 
                      href="/profile" 
                      className="text-gray-700 hover:text-pink-600 transition-colors font-semibold"
                    >
                      Profile
                    </a>
                    <button
                      onClick={logout}
                      className="text-gray-700 hover:text-pink-600 transition-colors font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <p className="text-sm text-gray-500">
                Add some items from our collection to get started!
              </p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCart(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
