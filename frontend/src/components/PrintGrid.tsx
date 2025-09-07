'use client';

import { Print } from '@/types/menu';
import PrintCard from './PrintCard';

interface PrintGridProps {
  prints: Print[];
  onAddToCart: (item: Print) => void;
}

export default function PrintGrid({ prints, onAddToCart }: PrintGridProps) {
  if (prints.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🖼️</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No prints available</h3>
        <p className="text-gray-500">Check back later for new prints!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {prints.map((print) => (
        <PrintCard
          key={print.id}
          item={print}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
