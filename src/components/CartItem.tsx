import React from 'react';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { formatCartQuantity, getLineTotal, getUnitKind } from '../utils/units';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import './CartItem.css';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { t } = useLanguage();
  const { showPrices } = useSettings();
  const { product, quantity } = item;
  const kind = getUnitKind(product.unit);
  const fallbackImage =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
         <rect width="100%" height="100%" fill="#f5f5f5"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#888" font-family="Arial" font-size="14">
           No Image
         </text>
       </svg>`
    );

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    if (Number.isNaN(raw)) return;
    const isWeightOrVolume = kind === 'weight' || kind === 'volume';
    const max = isWeightOrVolume ? 999999 : 999;
    const min = 1;
    const clamped = Math.max(min, Math.min(max, Math.floor(raw)));
    handleQuantityChange(clamped);
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== fallbackImage) {
      target.src = fallbackImage;
    }
  };

  return (
    <div className="cart-item">
      <img 
        src={product.image || fallbackImage} 
        alt={product.name}
        className="cart-item-image"
        loading="lazy"
        onError={handleImageError}
      />
      <div className="cart-item-info">
        <h4 className="cart-item-name">{product.name}</h4>
        <p className="cart-item-price">
          {showPrices && formatCurrency(product.price)}
          {product.quantity && product.unit ? ` / ${product.quantity} ${t(`unit.${product.unit}`)}` : ''}
        </p>
      </div>
      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(quantity - (kind === 'weight' || kind === 'volume' ? 100 : 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <div className="quantity-value">
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={handleQuantityInputChange}
              min={1}
              aria-label="Quantity"
            />
            {(kind === 'weight' || kind === 'volume') && (
              <span className="quantity-hint">
                {formatCartQuantity(product, quantity, t)}
              </span>
            )}
          </div>
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(quantity + (kind === 'weight' || kind === 'volume' ? 100 : 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <div className="cart-item-total">
          {showPrices ? formatCurrency(getLineTotal(product, quantity)) : '—'}
        </div>
        <button
          className="remove-btn"
          onClick={handleRemove}
          aria-label="Remove item"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
