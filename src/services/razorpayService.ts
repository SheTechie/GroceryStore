/**
 * Razorpay Payment Gateway Integration
 * 
 * Razorpay is a free payment gateway with excellent test mode.
 * Perfect for development and learning.
 * 
 * Setup:
 * 1. Sign up at https://razorpay.com
 * 2. Get your Key ID and Key Secret from Dashboard
 * 3. Add them to .env file
 * 4. Use test keys for development
 */

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number; // Amount in paise (smallest currency unit)
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id: string;
    payment_id: string;
  };
}

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Create Razorpay order (usually done on backend)
 * For demo purposes, we'll create a mock order
 */
export const createRazorpayOrder = async (
  amount: number,
  currency: string = 'INR'
): Promise<string> => {
  // In production, this should call your backend API
  // Example: const response = await fetch('/api/razorpay/orders', { method: 'POST', body: JSON.stringify({ amount, currency }) });
  
  // For demo, return a mock order ID
  // In real app, your backend creates order and returns order_id
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Initialize Razorpay payment
 */
export const initializeRazorpayPayment = async (
  amount: number,
  options: {
    name?: string;
    email?: string;
    contact?: string;
    description?: string;
    orderId?: string;
  } = {}
): Promise<{
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}> => {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      return {
        success: false,
        error: 'Failed to load Razorpay script. Please check your internet connection.',
      };
    }

    // Check if Razorpay is available
    if (!window.Razorpay) {
      return {
        success: false,
        error: 'Razorpay is not available. Please refresh the page.',
      };
    }

    // Get Razorpay Key ID from environment
    const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID || '';
    
    if (!razorpayKeyId) {
      // Demo mode - show alert
      alert('Razorpay Key ID not configured. Using demo mode.\n\nTo enable real payments:\n1. Sign up at https://razorpay.com\n2. Get your Key ID from Dashboard\n3. Add REACT_APP_RAZORPAY_KEY_ID to .env file');
      
      // Return demo success
      return {
        success: true,
        paymentId: `demo_payment_${Date.now()}`,
        orderId: `demo_order_${Date.now()}`,
      };
    }

    // Create order (in production, this should be done on backend)
    const orderId = options.orderId || await createRazorpayOrder(amount);

    // Convert amount to paise (Razorpay uses smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    // Razorpay options
    const razorpayOptions: RazorpayOptions = {
      key: razorpayKeyId,
      amount: amountInPaise,
      currency: 'INR',
      name: options.name || 'Grocery Store',
      description: options.description || 'Order Payment',
      order_id: orderId,
      prefill: {
        name: options.name || '',
        email: options.email || '',
        contact: options.contact || '',
      },
      theme: {
        color: '#2c5530', // Match your app theme
      },
      handler: (response: RazorpayResponse) => {
        // This will be handled by the promise resolve
        console.log('Payment successful:', response);
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal closed');
        },
      },
    };

    // Open Razorpay checkout
    return new Promise((resolve) => {
      const razorpay = new window.Razorpay(razorpayOptions);
      
      razorpay.on('payment.success', (response: RazorpayResponse) => {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        });
      });

      razorpay.on('payment.failed', (error: RazorpayError) => {
        resolve({
          success: false,
          error: error.description || 'Payment failed. Please try again.',
        });
      });

      razorpay.open();
    });
  } catch (error) {
    console.error('Razorpay initialization error:', error);
    return {
      success: false,
      error: 'An error occurred while initializing payment.',
    };
  }
};

/**
 * Verify payment signature (should be done on backend)
 * For demo purposes, we'll do a simple check
 */
export const verifyPayment = async (
  paymentId: string,
  orderId: string,
  signature: string
): Promise<boolean> => {
  // In production, this should call your backend API
  // Backend uses Razorpay secret to verify signature
  // Example: const response = await fetch('/api/razorpay/verify', { method: 'POST', body: JSON.stringify({ paymentId, orderId, signature }) });
  
  // For demo, return true if paymentId exists
  return !!paymentId;
};
