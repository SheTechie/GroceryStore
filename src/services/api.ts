import { Product } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// This service now works with products passed from context
export const productService = {
  // Fetch all products (products should be passed from context)
  async getProducts(products: Product[]): Promise<Product[]> {
    await delay(500); // Simulate network delay
    return Promise.resolve(products);
  },

  // Fetch product by ID
  async getProductById(products: Product[], id: number): Promise<Product | undefined> {
    await delay(300);
    return Promise.resolve(products.find(p => p.id === id));
  },

  // Fetch products by category
  async getProductsByCategory(products: Product[], category: string): Promise<Product[]> {
    await delay(400);
    return Promise.resolve(products.filter(p => p.category === category));
  },

  // Search products
  async searchProducts(products: Product[], query: string): Promise<Product[]> {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return Promise.resolve(
      products.filter(
        p => p.name.toLowerCase().includes(lowerQuery) ||
             (p.description ?? '').toLowerCase().includes(lowerQuery)
      )
    );
  }
};
