import { useState, useEffect } from 'react';
import { Product } from '../types';
import { productService } from '../services/api';
import { useProductsContext } from '../context/ProductContext';

export function useProducts() {
  const { products: contextProducts } = useProductsContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProducts(contextProducts);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [contextProducts]);

  return { products, loading, error };
}
