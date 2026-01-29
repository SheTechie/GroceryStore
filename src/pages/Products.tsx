import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductList } from '../components/ProductList';
import { Category } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { productService } from '../services/api';
import { useProductsContext } from '../context/ProductContext';
import { formatCategoryName } from '../utils/formatCategory';
import { useLanguage } from '../context/LanguageContext';
import './Products.css';

export const Products: React.FC = () => {
  const { products, loading, error } = useProducts();
  const { products: contextProducts } = useProductsContext();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const categories: (Category | 'all')[] = ['all', 'staples', 'pulses', 'spices', 'oil', 'snacks', 'beverages', 'household', 'personal-care', 'miscellaneous'];

  useEffect(() => {
    const filterProducts = async () => {
      let filtered = products;

      if (selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }

      if (debouncedSearch) {
        const searchResults = await productService.searchProducts(contextProducts, debouncedSearch);
        filtered = filtered.filter(p => 
          searchResults.some(r => r.id === p.id)
        );
      }

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [products, selectedCategory, debouncedSearch, contextProducts]);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>{t('products.title')}</h1>
        <p>{t('products.subtitle')}</p>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder={t('home.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {formatCategoryName(category)}
            </button>
          ))}
        </div>
      </div>

      <div className="products-count">
        {t('products.count', { count: filteredProducts.length })}
      </div>

      <ProductList 
        products={filteredProducts} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
};
