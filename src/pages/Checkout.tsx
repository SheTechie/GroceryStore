import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckoutFormData, PaymentResponse, DeliveryType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';
import { Payment } from '../components/Payment';
import { 
  checkDeliveryAvailability, 
  validateDeliveryRequirements,
  calculateDeliveryCharge,
  DELIVERY_MIN_ORDER 
} from '../services/deliveryService';
import './Checkout.css';

export const Checkout: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    deliveryType: 'pickup',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'pay_at_store',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [deliveryStatus, setDeliveryStatus] = useState<{
    checking: boolean;
    available: boolean;
    message?: string;
    distance?: number;
    deliveryCharge?: number;
  }>({ checking: false, available: true });

  const total = getTotalPrice();
  
  // Calculate delivery charge
  const deliveryCharge = formData.deliveryType === 'delivery' && deliveryStatus.distance
    ? calculateDeliveryCharge(total, deliveryStatus.distance)
    : 0;
  
  const finalTotal = total + deliveryCharge;

  // Check delivery availability when zipcode, address, or delivery type changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (formData.deliveryType === 'delivery' && formData.zipCode.trim().length === 6) {
      checkDelivery();
    } else {
      setDeliveryStatus({ checking: false, available: true });
    }
  }, [formData.zipCode, formData.deliveryType, formData.address, formData.city, total]);

  const checkDelivery = async () => {
    setDeliveryStatus({ checking: true, available: false });
    const result = await checkDeliveryAvailability(
      formData.zipCode,
      formData.address,
      formData.city
    );
    
    // Recalculate delivery charge with current order total
    const charge = result.available && result.distance
      ? calculateDeliveryCharge(total, result.distance)
      : 0;
    
    setDeliveryStatus({
      checking: false,
      available: result.available,
      message: result.message,
      distance: result.distance,
      deliveryCharge: charge,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: string | DeliveryType = value;
    
    // Format phone number (only digits)
    if (name === 'phone') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    // Format zipcode (only digits)
    if (name === 'zipCode') {
      processedValue = value.replace(/\D/g, '').slice(0, 6);
    }
    
    // Handle delivery type change - reset payment method appropriately
    if (name === 'deliveryType') {
      const deliveryType = value as DeliveryType;
      setFormData(prev => ({
        ...prev,
        deliveryType: deliveryType,
        paymentMethod: deliveryType === 'pickup' ? 'pay_at_store' : 'card',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.name.required');
    }
    
    // Email is optional, but if provided, must be valid
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.email.invalid');
    }
    
    // Phone number is mandatory
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Validate delivery-specific fields
    if (formData.deliveryType === 'delivery') {
      // Check minimum order amount
      const deliveryValidation = validateDeliveryRequirements(total, 'delivery');
      if (!deliveryValidation.valid) {
        newErrors.deliveryType = deliveryValidation.message;
      }

      // Check delivery availability
      if (!deliveryStatus.available && !deliveryStatus.checking) {
        newErrors.zipCode = deliveryStatus.message || 'Delivery not available for this location';
      }

      if (!formData.address.trim()) {
        newErrors.address = t('validation.address.required');
      }
      if (!formData.city.trim()) {
        newErrors.city = t('validation.city.required');
      }
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = t('validation.zip.required');
      } else if (formData.zipCode.trim().length !== 6) {
        newErrors.zipCode = 'Please enter a valid 6-digit zip code';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // If pickup with pay at store, skip payment modal
    if (formData.deliveryType === 'pickup' && formData.paymentMethod === 'pay_at_store') {
      handlePayAtStoreOrder();
      return;
    }

    // Show payment modal for other payment methods
    setShowPayment(true);
    setPaymentError('');
  };

  const handlePayAtStoreOrder = () => {
    setIsSubmitting(true);
    
    // Create a payment response for pay at store
    const paymentResponse: PaymentResponse = {
      success: true,
      transactionId: `PAY_AT_STORE_${Date.now()}`,
      message: 'Order placed successfully. Please pay at store when you collect your order.',
      timestamp: new Date().toISOString(),
    };

    // Store order details
    sessionStorage.setItem('paymentResponse', JSON.stringify(paymentResponse));
    sessionStorage.setItem('orderDetails', JSON.stringify({
      ...formData,
      items: items,
      subtotal: total,
      deliveryCharge: 0,
      total: finalTotal,
      paymentMethod: 'pay_at_store',
    }));
    
    // Clear cart and redirect
    clearCart();
    navigate('/order-success');
  };

  const handlePaymentSuccess = (response: PaymentResponse) => {
    // Store payment info in sessionStorage to show on success page
    sessionStorage.setItem('paymentResponse', JSON.stringify(response));
    sessionStorage.setItem('orderDetails', JSON.stringify({
      ...formData,
      items: items,
      subtotal: total,
      deliveryCharge: deliveryCharge,
      total: finalTotal,
      distance: deliveryStatus.distance,
    }));
    
    // Clear cart and redirect
    clearCart();
    navigate('/order-success');
  };

  const handlePaymentFailure = (response: PaymentResponse) => {
    setPaymentError(response.message);
    setShowPayment(false);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>{t('cart.empty.title')}</h2>
          <p>{t('cart.empty.message')}</p>
          <button onClick={() => navigate('/products')} className="shop-now-btn">
            {t('cart.shop.now')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>{t('checkout.title')}</h1>

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2>Contact Information</h2>
              
              <div className="form-group">
                <label htmlFor="name">{t('checkout.name')} *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">{t('checkout.email')} (Optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  maxLength={10}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-section">
              <h2>Delivery Option</h2>
              
              <div className="delivery-options">
                <label className={`delivery-option ${formData.deliveryType === 'pickup' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    checked={formData.deliveryType === 'pickup'}
                    onChange={handleChange}
                  />
                  <div className="delivery-option-content">
                    <span className="delivery-icon">🏪</span>
                    <div>
                      <strong>Store Pickup</strong>
                      <p>Pick up your order from our store</p>
                    </div>
                  </div>
                </label>

                <label className={`delivery-option ${formData.deliveryType === 'delivery' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="delivery"
                    checked={formData.deliveryType === 'delivery'}
                    onChange={handleChange}
                  />
                  <div className="delivery-option-content">
                    <span className="delivery-icon">🚚</span>
                    <div>
                      <strong>Home Delivery</strong>
                      <p>Free delivery for orders above ₹{DELIVERY_MIN_ORDER} (within 2km)</p>
                      {formData.deliveryType === 'delivery' && deliveryStatus.distance && (
                        <p className="delivery-info">
                          Distance: {deliveryStatus.distance.toFixed(2)}km
                          {deliveryCharge > 0 ? ` • Charge: ₹${deliveryCharge}` : ' • Free delivery'}
                        </p>
                      )}
                      {total < DELIVERY_MIN_ORDER && formData.deliveryType === 'delivery' && deliveryCharge > 0 && (
                        <p className="delivery-warning">
                          Add ₹{(DELIVERY_MIN_ORDER - total).toFixed(2)} more to save ₹{deliveryCharge} on delivery
                        </p>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              {errors.deliveryType && (
                <span className="error-message">{errors.deliveryType}</span>
              )}
            </div>

            {formData.deliveryType === 'delivery' && (
              <div className="form-section">
                <h2>Delivery Address</h2>
                
                <div className="form-group">
                  <label htmlFor="address">{t('checkout.address')} *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House/Flat No., Street, Area"
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">{t('checkout.city')} *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode">{t('checkout.zip')} *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="6-digit code"
                      maxLength={6}
                      className={errors.zipCode ? 'error' : ''}
                    />
                    {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                    {deliveryStatus.checking && (
                      <span className="delivery-checking">Checking delivery availability...</span>
                    )}
                    {!deliveryStatus.checking && formData.zipCode.length === 6 && deliveryStatus.message && (
                      <span className={deliveryStatus.available ? 'delivery-available' : 'delivery-unavailable'}>
                        {deliveryStatus.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {formData.deliveryType === 'pickup' && (
              <div className="form-section">
                <div className="pickup-info">
                  <p>📍 <strong>Store Address:</strong></p>
                  <p>123 Main Street, City Center</p>
                  <p>You can pick up your order anytime between 9 AM - 8 PM</p>
                </div>
              </div>
            )}

            <div className="form-section">
              <h2>{t('checkout.payment.method')}</h2>
              
              {formData.deliveryType === 'pickup' && (
                <div className="form-group">
                  <label className="payment-option-label">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pay_at_store"
                      checked={formData.paymentMethod === 'pay_at_store'}
                      onChange={handleChange}
                    />
                    <div className="payment-option-content">
                      <strong>💳 Pay at Store</strong>
                      <p>Pay when you collect your order from the store</p>
                    </div>
                  </label>
                </div>
              )}
              
              <div className="form-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    disabled={formData.deliveryType === 'pickup' && formData.paymentMethod === 'pay_at_store'}
                  />
                  {t('checkout.card')}
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    disabled={formData.deliveryType === 'pickup' && formData.paymentMethod === 'pay_at_store'}
                  />
                  {t('checkout.cash')}
                </label>
              </div>

              {formData.deliveryType === 'delivery' && (
                <>
                  <div className="form-group">
                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleChange}
                      />
                      {t('checkout.upi')}
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={formData.paymentMethod === 'razorpay'}
                        onChange={handleChange}
                      />
                      Razorpay
                    </label>
                  </div>
                </>
              )}
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? t('checkout.processing') 
                : formData.deliveryType === 'pickup' && formData.paymentMethod === 'pay_at_store'
                  ? `Place Order - ${formatCurrency(finalTotal)}`
                  : `${t('checkout.continue.to.payment')} - ${formatCurrency(finalTotal)}`}
            </button>
            {paymentError && (
              <div className="payment-error">
                <span className="error-message">{paymentError}</span>
              </div>
            )}
          </form>

          <div className="order-summary">
            <h2>{t('cart.order.summary')}</h2>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.product.id} className="summary-item">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {formData.deliveryType === 'delivery' && (
              <>
                <div className="summary-row">
                  <span>Delivery Charge:</span>
                  <span>
                    {deliveryStatus.checking ? (
                      <span className="delivery-checking">Calculating...</span>
                    ) : deliveryCharge > 0 ? (
                      formatCurrency(deliveryCharge)
                    ) : (
                      <span className="free-delivery">Free</span>
                    )}
                  </span>
                </div>
                {deliveryStatus.distance && (
                  <div className="summary-row">
                    <span>Distance:</span>
                    <span>{deliveryStatus.distance.toFixed(2)} km</span>
                  </div>
                )}
                {total < DELIVERY_MIN_ORDER && deliveryCharge > 0 && (
                  <div className="summary-row delivery-savings">
                    <span>💡 Save ₹{deliveryCharge}:</span>
                    <span>Add ₹{(DELIVERY_MIN_ORDER - total).toFixed(2)} more for free delivery</span>
                  </div>
                )}
              </>
            )}
            {formData.deliveryType === 'pickup' && (
              <div className="summary-row">
                <span>Delivery:</span>
                <span className="free-delivery">Store Pickup (Free)</span>
              </div>
            )}
            <div className="summary-total">
              <span>{t('cart.total')}:</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
            {formData.deliveryType === 'delivery' && total < DELIVERY_MIN_ORDER && deliveryCharge > 0 && (
              <div className="delivery-minimum-warning">
                <p>💡 Add ₹{(DELIVERY_MIN_ORDER - total).toFixed(2)} more to get free delivery (save ₹{deliveryCharge})</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showPayment && formData.paymentMethod !== 'pay_at_store' && (
        <Payment
          amount={finalTotal}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
          onCancel={handlePaymentCancel}
          customerInfo={{
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          }}
        />
      )}
    </div>
  );
};
