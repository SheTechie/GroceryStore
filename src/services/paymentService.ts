import { PaymentData, PaymentResponse } from '../types';

// Simulate payment processing delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Validate card number using Luhn algorithm
const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Validate CVV
const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

// Validate expiry date (MM/YY format)
const validateExpiryDate = (expiryDate: string): boolean => {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!regex.test(expiryDate)) return false;
  
  const [month, year] = expiryDate.split('/');
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
  const now = new Date();
  
  return expiry > now;
};

// Validate UPI ID
const validateUPI = (upiId: string): boolean => {
  return /^[\w.-]+@[\w]+$/.test(upiId);
};

// Validate phone number
const validatePhone = (phone: string): boolean => {
  return /^[6-9]\d{9}$/.test(phone);
};

export const paymentService = {
  // Process payment
  async processPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    // Simulate network delay
    await delay(2000);

    // Validate payment data based on method
    if (paymentData.method === 'card') {
      if (!paymentData.cardData) {
        return {
          success: false,
          message: 'Card details are required',
          timestamp: new Date().toISOString(),
        };
      }

      const { cardNumber, cardHolderName, expiryDate, cvv } = paymentData.cardData;

      if (!cardHolderName.trim()) {
        return {
          success: false,
          message: 'Card holder name is required',
          timestamp: new Date().toISOString(),
        };
      }

      if (!validateCardNumber(cardNumber)) {
        return {
          success: false,
          message: 'Invalid card number',
          timestamp: new Date().toISOString(),
        };
      }

      if (!validateExpiryDate(expiryDate)) {
        return {
          success: false,
          message: 'Invalid or expired card',
          timestamp: new Date().toISOString(),
        };
      }

      if (!validateCVV(cvv)) {
        return {
          success: false,
          message: 'Invalid CVV',
          timestamp: new Date().toISOString(),
        };
      }

      // Simulate payment success (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
        return {
          success: true,
          transactionId,
          message: 'Payment successful',
          timestamp: new Date().toISOString(),
        };
      } else {
        return {
          success: false,
          message: 'Payment failed. Please try again.',
          timestamp: new Date().toISOString(),
        };
      }
    }

    if (paymentData.method === 'upi') {
      if (!paymentData.upiData) {
        return {
          success: false,
          message: 'UPI ID is required',
          timestamp: new Date().toISOString(),
        };
      }

      if (!validateUPI(paymentData.upiData.upiId)) {
        return {
          success: false,
          message: 'Invalid UPI ID format',
          timestamp: new Date().toISOString(),
        };
      }

      // Simulate UPI payment (85% success rate)
      const isSuccess = Math.random() > 0.15;
      
      if (isSuccess) {
        const transactionId = `UPI${Date.now()}${Math.floor(Math.random() * 1000)}`;
        return {
          success: true,
          transactionId,
          message: 'UPI payment successful',
          timestamp: new Date().toISOString(),
        };
      } else {
        return {
          success: false,
          message: 'UPI payment failed. Please try again.',
          timestamp: new Date().toISOString(),
        };
      }
    }

    if (paymentData.method === 'wallet') {
      if (!paymentData.walletData) {
        return {
          success: false,
          message: 'Wallet details are required',
          timestamp: new Date().toISOString(),
        };
      }

      if (!validatePhone(paymentData.walletData.phoneNumber)) {
        return {
          success: false,
          message: 'Invalid phone number',
          timestamp: new Date().toISOString(),
        };
      }

      // Simulate wallet payment (95% success rate)
      const isSuccess = Math.random() > 0.05;
      
      if (isSuccess) {
        const transactionId = `WLT${Date.now()}${Math.floor(Math.random() * 1000)}`;
        return {
          success: true,
          transactionId,
          message: 'Wallet payment successful',
          timestamp: new Date().toISOString(),
        };
      } else {
        return {
          success: false,
          message: 'Wallet payment failed. Please check your balance.',
          timestamp: new Date().toISOString(),
        };
      }
    }

    if (paymentData.method === 'cash') {
      // Cash on delivery - always succeeds
      const transactionId = `COD${Date.now()}${Math.floor(Math.random() * 1000)}`;
      return {
        success: true,
        transactionId,
        message: 'Order placed. Payment on delivery.',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: false,
      message: 'Invalid payment method',
      timestamp: new Date().toISOString(),
    };
  },
};
