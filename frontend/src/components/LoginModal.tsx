'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginFormModal from './LoginFormModal';
import SignupModal from './SignupModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Redirect to Google OAuth
    window.location.href = `${process.env.API_URL || 'http://localhost:3001'}/auth/google`;
  };

  // Check if Google OAuth is configured by testing the endpoint
  const [googleOAuthAvailable, setGoogleOAuthAvailable] = useState(true); // Default to true since we know OAuth is working
  
  React.useEffect(() => {
    // Check if Google OAuth is available
    fetch(`${process.env.API_URL || 'http://localhost:3001'}/auth/google`, {
      method: 'HEAD', // Use HEAD request to avoid following redirects
      mode: 'cors',
      credentials: 'include'
    })
      .then(response => {
        // If we get a 302 redirect, OAuth is configured
        // If we get a 503, OAuth is not configured
        setGoogleOAuthAvailable(response.status === 302);
      })
      .catch(() => {
        // If fetch fails, assume OAuth is available (fallback)
        setGoogleOAuthAvailable(true);
      });
  }, []);

  const handleAuthCallback = () => {
    // This will be called when returning from OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      login(token);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      onClose();
    }
  };

  // Check for OAuth callback on component mount
  React.useEffect(() => {
    if (isOpen) {
      handleAuthCallback();
    }
  }, [isOpen]);

  const handleCloseAll = () => {
    setShowLoginForm(false);
    setShowSignupForm(false);
    onClose();
  };

  const handleSwitchToLogin = () => {
    setShowSignupForm(false);
    setShowLoginForm(true);
  };

  const handleSwitchToSignup = () => {
    setShowLoginForm(false);
    setShowSignupForm(true);
  };

  if (!isOpen) return null;

  // Show login form modal
  if (showLoginForm) {
    return (
      <LoginFormModal
        isOpen={showLoginForm}
        onClose={handleCloseAll}
        onSwitchToSignup={handleSwitchToSignup}
      />
    );
  }

  // Show signup form modal
  if (showSignupForm) {
    return (
      <SignupModal
        isOpen={showSignupForm}
        onClose={handleCloseAll}
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Sign in to access your account and order history
          </p>

          <div className="space-y-3">
            {googleOAuthAvailable && (
              <>
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={handleSwitchToLogin}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Sign In with Email
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
