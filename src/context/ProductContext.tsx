import React, { createContext, useContext, ReactNode, useEffect } from 'react';
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
// Also sync images and names from mockProducts to ensure they're up to date
const initializeProducts = (): Product[] => {
  const stored = localStorage.getItem('products');
  if (stored) {
    try {
      const storedProducts: Product[] = JSON.parse(stored);
      // Merge stored products with mockProducts to update images and names
      // Create a map of mockProducts by id for quick lookup
      const mockProductsMap = new Map(mockProducts.map(p => [p.id, p]));
      
      // Update stored products with latest data from mockProducts
      const updatedProducts = storedProducts.map(storedProduct => {
        const mockProduct = mockProductsMap.get(storedProduct.id);
        if (mockProduct) {
          // Always prioritize image from mockProducts (it has the latest paths)
          return {
            ...storedProduct,
            image: mockProduct.image || storedProduct.image,
            name: mockProduct.name || storedProduct.name,
            description: mockProduct.description || storedProduct.description,
            price: mockProduct.price !== undefined ? mockProduct.price : storedProduct.price,
          };
        }
        return storedProduct;
      });
      
      // Add any new products from mockProducts that don't exist in stored
      const storedIds = new Set(storedProducts.map(p => p.id));
      const newProducts = mockProducts.filter(p => !storedIds.has(p.id));
      
      const mergedProducts = [...updatedProducts, ...newProducts];
      
      // Save the merged products back to localStorage immediately
      // This ensures images are always up to date
      try {
        localStorage.setItem('products', JSON.stringify(mergedProducts));
      } catch (e) {
        console.warn('Could not save merged products to localStorage:', e);
      }
      
      return mergedProducts;
    } catch (error) {
      console.error('Error parsing stored products:', error);
      return mockProducts;
    }
  }
  return mockProducts;
};

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initializeProducts());

  // Sync products with mockProducts on mount to ensure images and names are up to date
  useEffect(() => {
    const mockProductsMap = new Map(mockProducts.map(p => [p.id, p]));
    
    // Update existing products with latest data from mockProducts
    const updatedProducts = products.map(product => {
      const mockProduct = mockProductsMap.get(product.id);
      if (mockProduct) {
        // Always use image from mockProducts if it exists
        const updatedProduct = {
          ...product,
          image: mockProduct.image || product.image,
          name: mockProduct.name || product.name,
          description: mockProduct.description || product.description,
          price: mockProduct.price !== undefined ? mockProduct.price : product.price,
        };
        // Log if image was updated
        if (mockProduct.image && product.image !== mockProduct.image) {
          console.log(`Updated image for product ${product.id} (${product.name}): ${product.image} -> ${mockProduct.image}`);
        }
        return updatedProduct;
      }
      return product;
    });
    
    // Add any new products from mockProducts that don't exist
    const productIds = new Set(products.map(p => p.id));
    const newProducts = mockProducts.filter(p => !productIds.has(p.id));
    
    const syncedProducts = [...updatedProducts, ...newProducts];
    
    // Always update to ensure latest images are used
    setProducts(syncedProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

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
