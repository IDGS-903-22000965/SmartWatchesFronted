export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  categoryName?: string;
  stock: number;
  brand?: string;
  model?: string;
  isActive: boolean;
}

export interface CreateProduct {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  stock: number;
  brand?: string;
  model?: string;
}

export interface UpdateProduct {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  stock: number;
  brand?: string;
  model?: string;
  isActive: boolean;
}