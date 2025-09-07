export interface Photocard {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  group: string;
  member: string;
  album: string;
  set?: string;
  age?: string;
  rarity: 'Album' | 'Preorder Benefit' | 'Lucky Draw';
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Omit<Photocard, 'quantity'> {
  cartQuantity: number;
}

export interface Print {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrintCartItem extends Omit<Print, 'quantity'> {
  cartQuantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
}
