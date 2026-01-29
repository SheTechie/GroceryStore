import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/CartItem';
import { shareOnWhatsApp, generateWhatsAppMessage } from '../utils/whatsappShare';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { formatCurrency } from '../utils/currency';
import './Cart.css';

export const Cart: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const { showPrices } = useSettings();
  const navigate = useNavigate();
  const total = getTotalPrice();
  const [showPreview, setShowPreview] = useState(false);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleShareWhatsApp = () => {
    shareOnWhatsApp(items, total, showPrices);
    setShowPreview(false);
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const whatsappMessage = generateWhatsAppMessage(items, total, showPrices);

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>{t('cart.empty.title')}</h2>
          <p>{t('cart.empty.message')}</p>
          <Link to="/products" className="shop-now-btn">
            {t('cart.shop.now')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>{t('cart.title')}</h1>
          <button onClick={clearCart} className="clear-cart-btn">
            {t('cart.clear')}
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>{t('cart.order.summary')}</h2>
              <div className="summary-row">
                <span>{t('cart.subtotal')}</span>
                <span>{showPrices ? formatCurrency(total) : '—'}</span>
              </div>
              <div className="summary-row">
                <span>{t('cart.shipping')}</span>
                <span>{t('cart.shipping.free')}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>{t('cart.total')}</span>
                <span>{showPrices ? formatCurrency(total) : '—'}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="checkout-btn"
                disabled={!showPrices}
                title={!showPrices ? t('cart.checkout.disabled') : ''}
              >
                {t('cart.checkout')}
              </button>
              <button 
                onClick={handleShowPreview}
                className="whatsapp-share-btn"
              >
                📱 {t('cart.share.whatsapp')}
              </button>
              <Link to="/products" className="continue-shopping">
                {t('cart.continue.shopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="whatsapp-preview-modal" onClick={() => setShowPreview(false)}>
          <div className="whatsapp-preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="whatsapp-preview-header">
              <h3>📱 WhatsApp Message Preview</h3>
              <button 
                className="close-preview-btn"
                onClick={() => setShowPreview(false)}
                aria-label="Close preview"
              >
                ×
              </button>
            </div>
            <div className="whatsapp-preview-message">
              <pre>{whatsappMessage}</pre>
            </div>
            <div className="whatsapp-preview-actions">
              <button 
                onClick={() => setShowPreview(false)}
                className="cancel-preview-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleShareWhatsApp}
                className="confirm-share-btn"
              >
                📱 Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
