'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'auth_failed':
          setError('Authentication failed. Please try again.');
          break;
        case 'access_denied':
          setError('Access was denied. Please try logging in again.');
          break;
        case 'server_error':
          setError('Server error occurred. Please try again later.');
          break;
        default:
          setError('An error occurred during login. Please try again.');
      }
    }
  }, [searchParams]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleTryAgain = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Login Failed
            </h1>
            
            {error && (
              <p className="text-gray-600 mb-6">
                {error}
              </p>
            )}

            <div className="text-sm text-gray-500 mb-8">
              <p>This could happen if:</p>
              <ul className="mt-2 text-left space-y-1">
                <li>• You cancelled the login process</li>
                <li>• There was a temporary connection issue</li>
                <li>• The authentication service is temporarily unavailable</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
              
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Go to Homepage
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If you continue to experience issues, please contact support.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
