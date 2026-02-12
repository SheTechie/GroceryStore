import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { formatCurrency } from '../utils/currency';
import { getUnitDisplayName } from '../utils/formatQuantity';
import { getUnitKind, normalizeCartQuantity, formatCartQuantity } from '../utils/units';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, updateQuantity, items } = useCart();
  const { t } = useLanguage();
  const { showPrices } = useSettings();
  const unitKind = getUnitKind(product.unit);
  
  // Check if product is in cart and get its quantity
  const cartItem = items.find(item => item.product.id === product.id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  // For weight/volume we store base units (grams/ml) as qtyBase.
  // For packet/count we store number of packets/items as qtyBase.
  const [qtyBase, setQtyBase] = useState<number>(() => normalizeCartQuantity(product, 1));
  // For kg products: separate kg and grams dropdowns
  const [kgSelected, setKgSelected] = useState<number>(0);
  const [gramsSelected, setGramsSelected] = useState<number>(100);
  // For other weight products (gram unit): store kg as decimal input
  const [kgInput, setKgInput] = useState<string>('0.5');
  // For volume products: store litre as decimal (e.g., 1.5 for 1.5 litre)
  const [litreInput, setLitreInput] = useState<string>('0.5');

  // Sync dropdown values with cart quantity when item is in cart
  useEffect(() => {
    if (isInCart && cartQuantity > 0) {
      if (product.unit === 'kg') {
        const totalGrams = cartQuantity;
        const kg = Math.floor(totalGrams / 1000);
        const grams = totalGrams % 1000;
        setKgSelected(kg);
        setGramsSelected(grams);
      } else if (unitKind === 'weight') {
        const kg = cartQuantity / 1000;
        setKgInput(kg.toFixed(1));
      } else if (unitKind === 'volume') {
        const litre = cartQuantity / 1000;
        setLitreInput(litre.toFixed(1));
      } else {
        setQtyBase(cartQuantity);
      }
    }
  }, [isInCart, cartQuantity, product.unit, unitKind]);
  
  const gramOptions = [0, 100, 200, 250, 300, 400, 500, 600, 700, 800, 900];
  const fallbackImage =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
         <rect width="100%" height="100%" fill="#f5f5f5"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#888" font-family="Arial" font-size="18">
           No Image
         </text>
       </svg>`
    );

  const calculateQuantity = (): number => {
    if (product.unit === 'kg') {
      // Convert kg + grams to total grams (e.g., 1 kg + 200g = 1200 grams)
      const totalGrams = (kgSelected * 1000) + gramsSelected;
      return Math.max(100, totalGrams); // Minimum 100g
    } else if (unitKind === 'weight') {
      // For other weight units (gram), use simple input
      const kg = parseFloat(kgInput || '0.5') || 0.5;
      return Math.max(100, Math.floor(kg * 1000));
    } else if (unitKind === 'volume') {
      // Convert litre to ml (e.g., 1.5 litre = 1500 ml)
      const litre = parseFloat(litreInput) || 0.5;
      return Math.max(100, Math.floor(litre * 1000)); // Minimum 100ml
    } else {
      return qtyBase;
    }
  };

  const handleAddToCart = () => {
    const quantityToAdd = calculateQuantity();
    if (isInCart) {
      // Update existing cart item quantity
      updateQuantity(product.id, quantityToAdd);
    } else {
      // Add new item to cart
      addToCart(product, quantityToAdd);
    }
  };

  // Handle quantity change when item is in cart
  const handleQuantityChange = () => {
    if (isInCart) {
      const newQuantity = calculateQuantity();
      // Ensure minimum quantity
      const minQuantity = product.unit === 'kg' || unitKind === 'weight' || unitKind === 'volume' ? 100 : 1;
      if (newQuantity >= minQuantity) {
        updateQuantity(product.id, newQuantity);
      }
    }
  };

  const decQty = () => setQtyBase(q => Math.max(1, (Number.isFinite(q) ? q : 1) - 1));
  const incQty = () => setQtyBase(q => Math.min(99, (Number.isFinite(q) ? q : 1) + 1));

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    console.warn('Image failed to load:', target.src, 'for product:', product.name);
    if (target.src !== fallbackImage) {
      target.src = fallbackImage;
    }
  };

  // Debug: Log image path for products with /images/ paths
  useEffect(() => {
    if (product.image && product.image.startsWith('/images/')) {
      console.log(`Product ${product.id} (${product.name}) image:`, product.image);
    }
  }, [product.id, product.image, product.name]);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image || fallbackImage} 
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={handleImageError}
        />
        {!product.inStock && (
          <div className="out-of-stock-badge">{t('product.out.of.stock')}</div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description || t('product.no.description')}</p>
        <div className="product-footer">
          <div className="product-price-rating">
            {showPrices && (
              <span className="product-price">{formatCurrency(product.price)}</span>
            )}
            {product.quantity && product.unit && (
              <span className="product-quantity">
                {product.quantity} {getUnitDisplayName(product.unit, t)}
              </span>
            )}
            {product.rating && (
              <span className="product-rating">⭐ {product.rating}</span>
            )}
          </div>
          <div className="add-to-cart-controls">
            {product.unit === 'kg' ? (
              <div className="qty-picker" aria-label="Quantity picker (kg/grams)">
                <div className="qty-split">
                  <label className="qty-field">
                    <span className="qty-label">{t('unit.kg')}</span>
                    <select
                      className="qty-select"
                      value={kgSelected}
                      onChange={(e) => {
                        const newKg = Number(e.target.value) || 0;
                        setKgSelected(newKg);
                        if (isInCart) {
                          // Use requestAnimationFrame for immediate update
                          requestAnimationFrame(() => {
                            handleQuantityChange();
                          });
                        }
                      }}
                      disabled={!product.inStock}
                      aria-label="Kilograms"
                    >
                      {Array.from({ length: 51 }).map((_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="qty-field">
                    <span className="qty-label">{t('unit.gram')}</span>
                    <select
                      className="qty-select"
                      value={gramsSelected}
                      onChange={(e) => {
                        const newGrams = Number(e.target.value) || 0;
                        setGramsSelected(newGrams);
                        if (isInCart) {
                          // Use requestAnimationFrame for immediate update
                          requestAnimationFrame(() => {
                            handleQuantityChange();
                          });
                        }
                      }}
                      disabled={!product.inStock}
                      aria-label="Grams"
                    >
                      {gramOptions.map(g => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            ) : unitKind === 'weight' ? (
              <div className="qty-picker" aria-label="Quantity picker (kg)">
                <label className="qty-field-simple">
                  <span className="qty-label">{t('unit.kg')}</span>
                  <input
                    className="qty-input-kg"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="50"
                    value={kgInput || '0.5'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (!isNaN(Number(val)) && Number(val) >= 0)) {
                        setKgInput(val);
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val) || val < 0.1) {
                        setKgInput('0.5');
                      } else {
                        setKgInput(Math.min(50, val).toString());
                      }
                      if (isInCart) {
                        handleQuantityChange();
                      }
                    }}
                    disabled={!product.inStock}
                    aria-label="Kilograms"
                    placeholder="0.5"
                  />
                </label>
              </div>
            ) : unitKind === 'volume' ? (
              <div className="qty-picker" aria-label="Quantity picker (litre)">
                <label className="qty-field-simple">
                  <span className="qty-label">{t('unit.litre')}</span>
                  <input
                    className="qty-input-kg"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="50"
                    value={litreInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (!isNaN(Number(val)) && Number(val) >= 0)) {
                        setLitreInput(val);
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val) || val < 0.1) {
                        setLitreInput('0.5');
                      } else {
                        setLitreInput(Math.min(50, val).toString());
                      }
                      if (isInCart) {
                        handleQuantityChange();
                      }
                    }}
                    disabled={!product.inStock}
                    aria-label="Litres"
                    placeholder="0.5"
                  />
                </label>
              </div>
            ) : (
              <div className="qty-picker" aria-label="Quantity picker">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => {
                    const newQty = Math.max(1, qtyBase - 1);
                    setQtyBase(newQty);
                    if (isInCart) {
                      updateQuantity(product.id, newQty);
                    }
                  }}
                  disabled={!product.inStock || qtyBase <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  className="qty-input"
                  type="number"
                  min={1}
                  max={99}
                  value={qtyBase}
                  onChange={(e) => {
                    const newVal = Math.max(1, Math.min(99, Math.floor(Number(e.target.value) || 1)));
                    setQtyBase(newVal);
                    if (isInCart) {
                      setTimeout(() => updateQuantity(product.id, newVal), 0);
                    }
                  }}
                  disabled={!product.inStock}
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => {
                    const newQty = Math.min(99, qtyBase + 1);
                    setQtyBase(newQty);
                    if (isInCart) {
                      updateQuantity(product.id, newQty);
                    }
                  }}
                  disabled={!product.inStock || qtyBase >= 99}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
            <button
              className={`add-to-cart-btn ${isInCart ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {isInCart 
                ? `✓ ${t('product.added')}` 
                : product.inStock 
                  ? t('product.add.to.cart') 
                  : t('product.unavailable')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
