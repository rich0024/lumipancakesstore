'use client';

import { Photocard } from '@/types/menu';
import Image from 'next/image';

interface MenuCardProps {
  item: Photocard;
  onAddToCart: (item: Photocard) => void;
  showAddButton?: boolean;
}

export default function MenuCard({ item, onAddToCart, showAddButton = true }: MenuCardProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Album':
        return 'bg-gray-100 text-gray-800';
      case 'Preorder Benefit':
        return 'bg-blue-100 text-blue-800';
      case 'Lucky Draw':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card p-6 group hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <div className="w-full h-48 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center relative overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <span className="text-6xl">📸</span>
          )}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getRarityColor(item.rarity)}`}>
              {item.rarity}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{item.description}</p>
        
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">
              {item.group}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
              {item.member}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              {item.album}
            </span>
            {item.set && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                {item.set}
              </span>
            )}
            {item.age && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                {item.age}
              </span>
            )}
          </div>
        </div>
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
            onClick={() => onAddToCart(item)}
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
