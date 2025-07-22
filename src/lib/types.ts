
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
