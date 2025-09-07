'use client';

import { Photocard } from '@/types/menu';

interface PhotocardCardProps {
  item: Photocard;
  onAddToCart: (item: Photocard) => void;
}

export default function PhotocardCard({ item, onAddToCart }: PhotocardCardProps) {
  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'rarity-common';
      case 'rare':
        return 'rarity-rare';
      case 'ultra-rare':
        return 'rarity-ultra-rare';
      default:
        return 'rarity-common';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '⭐';
      case 'rare':
        return '✨';
      case 'ultra-rare':
        return '💎';
      default:
        return '⭐';
    }
  };

  return (
    <div className="photocard p-4 relative group">
      {/* Polaroid-style container */}
      <div className="relative">
        {/* Tape decoration */}
        <div className="tape"></div>
        
        {/* Image area */}
        <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
          <div className="text-6xl opacity-60">
            {item.category === 'bts' ? '💜' : 
             item.category === 'newjeans' ? '🐰' :
             item.category === 'lesserafim' ? '🔥' :
             item.category === 'aespa' ? '🦋' :
             item.category === 'twice' ? '🍭' :
             item.category === 'itzy' ? '⚡' :
             item.category === 'straykids' ? '🐺' :
             item.category === 'ive' ? '💎' : '📸'}
          </div>
          
          {/* Rarity badge */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold border ${getRarityClass(item.rarity)}`}>
            {getRarityIcon(item.rarity)} {item.rarity}
          </div>
        </div>
        
        {/* Content area */}
        <div className="space-y-2">
          <div className="text-center">
            <h3 className="font-bold text-secondary-800 text-lg mb-1">{item.name}</h3>
            <p className="text-sm text-secondary-600 mb-2">{item.description}</p>
          </div>
          
          {/* Group and member info */}
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="font-semibold text-primary-600">{item.group}</span>
              <span className="text-secondary-500"> • {item.member}</span>
            </div>
            <div className="text-secondary-500 text-xs">
              {item.album}
            </div>
          </div>
          
          {/* Price and add to cart */}
          <div className="flex items-center justify-between pt-2 border-t border-secondary-200">
            <span className="text-2xl font-bold text-primary-600">
              ${item.price.toFixed(2)}
            </span>
            
            <button
              onClick={() => onAddToCart(item)}
              className="btn-primary flex items-center space-x-2 text-sm px-3 py-2"
            >
              <span>Add to Cart</span>
              <span>🛒</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
