'use client';

import React from 'react';
import { Print } from '@/types/menu';
import Image from 'next/image';
import { trackAddToCart, trackViewItem } from '@/utils/analytics';

interface PrintCardProps {
  item: Print;
  onAddToCart: (item: Print) => void;
  showAddButton?: boolean;
}

export default function PrintCard({ item, onAddToCart, showAddButton = true }: PrintCardProps) {
  // Track item view when component mounts
  React.useEffect(() => {
    trackViewItem(item.id.toString(), item.name, item.price);
  }, [item.id, item.name, item.price]);
  return (
    <div className="card p-8 group hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <div className="w-full h-56 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center relative overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <span className="text-6xl">🖼️</span>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{item.description}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-pink-600">
            ${item.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            {item.quantity > 0 ? `${item.quantity} in stock` : 'Out of stock'}
          </span>
        </div>
        
        {showAddButton && (
          <button
            onClick={() => {
              onAddToCart(item);
              trackAddToCart(item.id.toString(), item.name, item.price);
            }}
            disabled={item.quantity === 0}
            className={`btn-primary flex items-center space-x-2 text-sm ${
              item.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>{item.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            <span>🛒</span>
          </button>
        )}
      </div>
    </div>
  );
}
