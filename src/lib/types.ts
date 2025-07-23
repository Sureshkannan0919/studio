
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  images: string[];
  category: string;
  stock: number;
  data_ai_hint: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    mobile?: string;
    address?: {
      street: string;
      city: string;
      zip: string;
    }
  };
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: any; // Firestore Timestamp
}
