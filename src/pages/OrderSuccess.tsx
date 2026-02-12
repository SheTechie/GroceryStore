import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PaymentResponse } from '../types';
import { formatCurrency } from '../utils/currency';
import './OrderSuccess.css';

export const OrderSuccess: React.FC = () => {
  const { t } = useLanguage();
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Get payment response from sessionStorage
    const paymentData = sessionStorage.getItem('paymentResponse');
    const orderData = sessionStorage.getItem('orderDetails');
    
    if (paymentData) {
      setPaymentResponse(JSON.parse(paymentData));
    }
    
    if (orderData) {
      const order = JSON.parse(orderData);
      setOrderDetails(order);
      setOrderTotal(order.total || order.subtotal || 0);
    }

    // Clean up sessionStorage
    return () => {
      sessionStorage.removeItem('paymentResponse');
      sessionStorage.removeItem('orderDetails');
    };
  }, []);
  
  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>{t('order.success.title')}</h1>
        <p>{t('order.success.message')}</p>
        
        {paymentResponse && (
          <div className="payment-details">
            <div className="payment-info-item">
              <span className="label">Transaction ID:</span>
              <span className="value">{paymentResponse.transactionId}</span>
            </div>
            {orderDetails && (
              <>
                <div className="payment-info-item">
                  <span className="label">Subtotal:</span>
                  <span className="value">{formatCurrency(orderDetails.subtotal || orderTotal)}</span>
                </div>
                {orderDetails.deliveryCharge !== undefined && orderDetails.deliveryCharge > 0 && (
                  <div className="payment-info-item">
                    <span className="label">Delivery Charge:</span>
                    <span className="value">{formatCurrency(orderDetails.deliveryCharge)}</span>
                  </div>
                )}
                {orderDetails.distance && (
                  <div className="payment-info-item">
                    <span className="label">Delivery Distance:</span>
                    <span className="value">{orderDetails.distance.toFixed(2)} km</span>
                  </div>
                )}
                {orderDetails.deliveryType && (
                  <div className="payment-info-item">
                    <span className="label">Delivery Type:</span>
                    <span className="value">
                      {orderDetails.deliveryType === 'pickup' ? 'Store Pickup' : 'Home Delivery'}
                    </span>
                  </div>
                )}
              </>
            )}
            <div className="payment-info-item">
              <span className="label">Total Amount:</span>
              <span className="value">
                {orderDetails?.paymentMethod === 'pay_at_store' 
                  ? `${formatCurrency(orderTotal)} (Pay at Store)`
                  : formatCurrency(orderTotal)}
              </span>
            </div>
            {orderDetails?.paymentMethod !== 'pay_at_store' && (
              <div className="payment-info-item">
                <span className="label">Status:</span>
                <span className="value success-status">{paymentResponse.message}</span>
              </div>
            )}
            {orderDetails?.paymentMethod === 'pay_at_store' && (
              <div className="payment-info-item pay-at-store-notice">
                <span className="label">Payment:</span>
                <span className="value">💳 Please pay ₹{orderTotal.toFixed(2)} when you collect your order</span>
              </div>
            )}
          </div>
        )}
        
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
