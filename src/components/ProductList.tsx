import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import './ProductList.css';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  loading, 
  error 
}) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="product-list-loading">
        <div className="spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-error">
        <p>{t('common.error')}: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-list-empty">
        <p>{t('common.no.products')}</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
