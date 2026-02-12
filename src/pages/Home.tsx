import React, { useState, useEffect, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductList } from '../components/ProductList';
import { Category } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { productService } from '../services/api';
import { useProductsContext } from '../context/ProductContext';
import { formatCategoryName } from '../utils/formatCategory';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import './Home.css';

export const Home: React.FC = () => {
  const { products, loading, error } = useProducts();
  const { products: contextProducts } = useProductsContext();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Voice search handler
  const handleVoiceResult = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const {
    isListening,
    error: voiceError,
    startListening,
    stopListening,
    isSupported: isVoiceSupported,
  } = useVoiceSearch(handleVoiceResult);

  const categories: (Category | 'all')[] = ['all', 'staples', 'pulses', 'spices', 'oil', 'snacks', 'beverages', 'household', 'personal-care', 'miscellaneous'];

  useEffect(() => {
    const filterProducts = async () => {
      let filtered = products;

      // Filter by category
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }

      // Filter by search query
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
    <div className="home-page">
      <div className="hero-section">
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder={t('home.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {isVoiceSupported && (
              <button
                type="button"
                className={`voice-search-btn ${isListening ? 'listening' : ''}`}
                onClick={isListening ? stopListening : startListening}
                title={isListening ? 'Stop listening' : 'Start voice search'}
                aria-label={isListening ? 'Stop listening' : 'Start voice search'}
              >
                {isListening ? '⏹️' : '🎤'}
              </button>
            )}
          </div>
          {voiceError && (
            <div className="voice-error">{voiceError}</div>
          )}
          {isListening && (
            <div className="voice-listening-indicator">
              🎤 Listening... Speak now
            </div>
          )}
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

      <ProductList 
        products={filteredProducts} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
};
