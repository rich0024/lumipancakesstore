import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import GTMNoScript from '@/components/GTMNoScript';
import PageTracker from '@/components/PageTracker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lumi Pancakes Store',
  description: 'A modern, kpop photocards and instant film prints store application',
  keywords: ['kpop', 'photocards', 'instant film prints'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <GTMNoScript />
        <PageTracker gtmId="GTM-PMWK3QFJ" />
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
              {children}
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
