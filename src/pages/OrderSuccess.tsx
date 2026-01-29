import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './OrderSuccess.css';

export const OrderSuccess: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>{t('order.success.title')}</h1>
        <p>{t('order.success.message')}</p>
        <div className="success-actions">
          <Link to="/products" className="continue-shopping-btn">
            {t('order.success.continue')}
          </Link>
          <Link to="/" className="home-btn">
            {t('order.success.home')}
          </Link>
        </div>
      </div>
    </div>
  );
};
