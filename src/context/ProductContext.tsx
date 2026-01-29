import React, { createContext, useContext, ReactNode } from 'react';
import { Product } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockProducts } from '../data/mockProducts';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Initialize with mock products if no products exist in localStorage
const initializeProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  if (stored) {
    return JSON.parse(stored);
  }
  return mockProducts;
};

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initializeProducts());

  const addProduct = (productData: Omit<Product, 'id'>) => {
    setProducts(prevProducts => {
      // Generate new ID (max existing ID + 1)
      const maxId = prevProducts.length > 0 
        ? Math.max(...prevProducts.map(p => p.id))
        : 0;
      const newProduct: Product = {
        ...productData,
        // Default unit to 'kg' if not specified
        unit: productData.unit || 'kg',
        id: maxId + 1,
      };
      return [...prevProducts, newProduct];
    });
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id: number) => {
    setProducts(prevProducts =>
      prevProducts.filter(product => product.id !== id)
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductsContext must be used within a ProductProvider');
  }
  return context;
}
