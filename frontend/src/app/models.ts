export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  category: Category;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stock: number;
  imageUrl: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  customerEmail: string;
  address: string;
  items: OrderItemRequest[];
}

export interface OrderResponse {
  orderId: number;
  totalPrice: number;
  message: string;
}

export type AuthRole = 'ADMIN' | 'USER';

export interface AuthResponse {
  token: string;
  role: AuthRole;
}
