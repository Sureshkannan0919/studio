
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
  sizes?: string[];
}

export interface CartItem extends Product {
  id: string; // This is the unique cart item ID (e.g., product.id + '-' + size)
  productId: string; // This is the original product ID from the database
  quantity: number;
  size?: string;
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
  createdAt: string; 
}

export interface User {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
  role: 'user' | 'superuser';
}
