import React, { useState, useEffect } from 'react';
import { PaymentMethod, CardPaymentData, UPIPaymentData, WalletPaymentData, PaymentData, PaymentResponse } from '../types';
import { paymentService } from '../services/paymentService';
import { initializeRazorpayPayment } from '../services/razorpayService';
import { formatCurrency } from '../utils/currency';
import './Payment.css';

// Payment method constants
const PAYMENT_METHODS = {
  CARD: 'card' as PaymentMethod,
  UPI: 'upi' as PaymentMethod,
  WALLET: 'wallet' as PaymentMethod,
  CASH: 'cash' as PaymentMethod,
  RAZORPAY: 'razorpay' as PaymentMethod,
} as const;

interface PaymentProps {
  amount: number;
  onPaymentSuccess: (response: PaymentResponse) => void;
  onPaymentFailure: (response: PaymentResponse) => void;
  onCancel: () => void;
  customerInfo?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export const Payment: React.FC<PaymentProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentFailure,
  onCancel,
  customerInfo,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Card payment form data
  const [cardData, setCardData] = useState<CardPaymentData>({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
  });

  // UPI payment form data
  const [upiData, setUpiData] = useState<UPIPaymentData>({
    upiId: '',
  });

  // Wallet payment form data
  const [walletData, setWalletData] = useState<WalletPaymentData>({
    walletType: 'phonepe',
    phoneNumber: '',
  });

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardChange = (field: keyof CardPaymentData, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleUPIChange = (value: string) => {
    setUpiData({ upiId: value });
    if (errors.upiId) {
      setErrors(prev => ({ ...prev, upiId: '' }));
    }
  };

  const handleWalletChange = (field: keyof WalletPaymentData, value: string) => {
    setWalletData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'card') {
      if (!cardData.cardNumber.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Card number is required';
      }
      if (!cardData.cardHolderName.trim()) {
        newErrors.cardHolderName = 'Card holder name is required';
      }
      if (!cardData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      }
      if (!cardData.cvv) {
        newErrors.cvv = 'CVV is required';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiData.upiId.trim()) {
        newErrors.upiId = 'UPI ID is required';
      }
    } else if (paymentMethod === 'wallet') {
      if (!walletData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle Razorpay payment separately
    if (paymentMethod === PAYMENT_METHODS.RAZORPAY) {
      setIsProcessing(true);
      try {
        const razorpayResult = await initializeRazorpayPayment(amount, {
          name: customerInfo?.name,
          email: customerInfo?.email,
          contact: customerInfo?.contact,
          description: 'Grocery Store Order Payment',
        });

        if (razorpayResult.success && razorpayResult.paymentId) {
          onPaymentSuccess({
            success: true,
            transactionId: razorpayResult.paymentId,
            message: 'Payment successful via Razorpay',
            timestamp: new Date().toISOString(),
          });
        } else {
          onPaymentFailure({
            success: false,
            message: razorpayResult.error || 'Payment failed. Please try again.',
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        onPaymentFailure({
          success: false,
          message: 'An error occurred. Please try again.',
          timestamp: new Date().toISOString(),
        });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Handle other payment methods (card, UPI, wallet, cash)
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    const paymentData: PaymentData = {
      method: paymentMethod,
      amount,
      ...(paymentMethod === 'card' && { cardData }),
      ...(paymentMethod === 'upi' && { upiData }),
      ...(paymentMethod === 'wallet' && { walletData }),
    };

    try {
      const response = await paymentService.processPayment(paymentData);
      
      if (response.success) {
        onPaymentSuccess(response);
      } else {
        onPaymentFailure(response);
      }
    } catch (error) {
      onPaymentFailure({
        success: false,
        message: 'An error occurred. Please try again.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-modal">
      <div className="payment-container">
        <div className="payment-header">
          <h2>Payment</h2>
          <p className="payment-amount">Total: {formatCurrency(amount)}</p>
          <button className="close-btn" onClick={onCancel} type="button">×</button>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          {/* Payment Method Selection */}
          <div className="payment-methods">
            <label className="payment-method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              <span>💳 Credit/Debit Card</span>
            </label>

            <label className="payment-method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
              />
              <span>📱 UPI</span>
            </label>

            <label className="payment-method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={paymentMethod === 'wallet'}
                onChange={() => setPaymentMethod('wallet')}
              />
              <span>💼 Digital Wallet</span>
            </label>

            <label className="payment-method-option">
              <input
                type="radio"
                name="paymentMethod"
                value={PAYMENT_METHODS.RAZORPAY}
                checked={paymentMethod === PAYMENT_METHODS.RAZORPAY}
                onChange={() => setPaymentMethod(PAYMENT_METHODS.RAZORPAY)}
              />
              <span>💳 Razorpay (Cards, UPI, Wallets)</span>
            </label>

            <label className="payment-method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
              />
              <span>💰 Cash on Delivery</span>
            </label>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div className="payment-form-section">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                  maxLength={19}
                  className={errors.cardNumber ? 'error' : ''}
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>

              <div className="form-group">
                <label>Card Holder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardData.cardHolderName}
                  onChange={(e) => handleCardChange('cardHolderName', e.target.value)}
                  className={errors.cardHolderName ? 'error' : ''}
                />
                {errors.cardHolderName && <span className="error-message">{errors.cardHolderName}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiryDate}
                    onChange={(e) => handleCardChange('expiryDate', e.target.value)}
                    maxLength={5}
                    className={errors.expiryDate ? 'error' : ''}
                  />
                  {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => handleCardChange('cvv', e.target.value)}
                    maxLength={4}
                    className={errors.cvv ? 'error' : ''}
                  />
                  {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                </div>
              </div>
            </div>
          )}

          {/* UPI Payment Form */}
          {paymentMethod === 'upi' && (
            <div className="payment-form-section">
              <div className="form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@paytm"
                  value={upiData.upiId}
                  onChange={(e) => handleUPIChange(e.target.value)}
                  className={errors.upiId ? 'error' : ''}
                />
                {errors.upiId && <span className="error-message">{errors.upiId}</span>}
                <small>Format: yourname@paytm, yourname@ybl, etc.</small>
              </div>
            </div>
          )}

          {/* Wallet Payment Form */}
          {paymentMethod === 'wallet' && (
            <div className="payment-form-section">
              <div className="form-group">
                <label>Wallet Type</label>
                <select
                  value={walletData.walletType}
                  onChange={(e) => handleWalletChange('walletType', e.target.value)}
                >
                  <option value="phonepe">PhonePe</option>
                  <option value="paytm">Paytm</option>
                  <option value="gpay">Google Pay</option>
                  <option value="amazonpay">Amazon Pay</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={walletData.phoneNumber}
                  onChange={(e) => handleWalletChange('phoneNumber', e.target.value)}
                  maxLength={10}
                  className={errors.phoneNumber ? 'error' : ''}
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>
            </div>
          )}

          {/* Razorpay Payment */}
          {paymentMethod === PAYMENT_METHODS.RAZORPAY && (
            <div className="payment-form-section">
              <div className="razorpay-info">
                <p>🔒 Secure payment via Razorpay</p>
                <p>Supports: Credit/Debit Cards, UPI, Net Banking, Wallets</p>
                <p className="razorpay-note">
                  Click "Pay" to open Razorpay checkout. You'll be redirected to a secure payment page.
                </p>
              </div>
            </div>
          )}

          {/* Cash on Delivery */}
          {paymentMethod === 'cash' && (
            <div className="payment-form-section">
              <div className="cash-info">
                <p>💰 You will pay cash when the order is delivered.</p>
                <p>No payment required now.</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="payment-actions">
            <button type="button" onClick={onCancel} className="cancel-btn" disabled={isProcessing}>
              Cancel
            </button>
            <button type="submit" className="pay-btn" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
