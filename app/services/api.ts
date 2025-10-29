// services/api.ts
import { Product } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_BASE_API_URL;

export const productService = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/products`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      next: { revalidate: 3600 }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  },

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE}/products/categories`, {
      next: { revalidate: 3600 }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },
};