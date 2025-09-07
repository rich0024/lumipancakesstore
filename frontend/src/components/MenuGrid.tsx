'use client';

import { Photocard } from '@/types/menu';
import MenuCard from './MenuCard';

interface MenuGridProps {
  menu: Photocard[];
  onAddToCart: (item: Photocard) => void;
}

export default function MenuGrid({ menu, onAddToCart }: MenuGridProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-secondary-800 mb-8">Photocard Collection</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {menu.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
            showAddButton={true}
          />
        ))}
      </div>
    </div>
  );
}
