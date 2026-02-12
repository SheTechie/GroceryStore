# Razorpay Payment Gateway Setup Guide

## What is Razorpay?

**Razorpay** is a payment gateway that allows you to accept payments online. It's:
- ✅ **Free to set up** (no setup fees)
- ✅ **Free test mode** for development
- ✅ **Supports multiple payment methods**: Cards, UPI, Net Banking, Wallets
- ✅ **Popular in India** (perfect for grocery stores)
- ✅ **Easy integration** with React

## How Razorpay Works

```
1. User clicks "Pay with Razorpay"
   ↓
2. Razorpay checkout modal opens
   ↓
3. User selects payment method (Card/UPI/Wallet)
   ↓
4. User completes payment on Razorpay's secure page
   ↓
5. Razorpay sends payment result to your app
   ↓
6. Your app processes the result
```

## Setup Instructions

### Step 1: Create Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Click "Sign Up" (it's free!)
3. Fill in your details:
   - Business name: Your Grocery Store
   - Email: Your email
   - Mobile: Your phone number
4. Verify your email and phone

### Step 2: Get API Keys

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings** → **API Keys**
3. You'll see:
   - **Key ID** (starts with `rzp_test_` for test mode)
   - **Key Secret** (click "Reveal" to see it)

**Important:**
- **Test Mode**: Use test keys for development (no real money)
- **Live Mode**: Use live keys for production (real payments)
- **Key Secret**: Keep it secret! Never expose in frontend code

### Step 3: Configure Environment Variables

Create or update your `.env` file:

```env
# Razorpay Configuration
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
REACT_APP_RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
```

**Note:** 
- For production, use live keys (starts with `rzp_live_`)
- Key Secret should be used on backend only (for security)

### Step 4: Test Payment

1. Start your app: `npm start`
2. Go to checkout and select "Razorpay" payment method
3. Click "Pay"
4. Razorpay checkout will open
5. Use test card details:
   - **Card Number**: `4111 1111 1111 1111`
   - **CVV**: Any 3 digits (e.g., `123`)
   - **Expiry**: Any future date (e.g., `12/25`)
   - **Name**: Any name

## Test Cards

Razorpay provides test cards for different scenarios:

### Success Cards
- **Card**: `4111 1111 1111 1111`
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Failure Cards
- **Card**: `4000 0000 0000 0002` (Card declined)
- **Card**: `4000 0000 0000 0069` (Insufficient funds)

### UPI Test
- Use any UPI ID (e.g., `test@razorpay`)
- Payment will be simulated

## Payment Methods Supported

Razorpay supports:

1. **Credit/Debit Cards** (Visa, Mastercard, RuPay, etc.)
2. **UPI** (Google Pay, PhonePe, Paytm, etc.)
3. **Net Banking** (All major banks)
4. **Wallets** (Paytm, Freecharge, etc.)
5. **EMI** (Easy Monthly Installments)

## Security Best Practices

### ⚠️ Important Security Notes:

1. **Never expose Key Secret in frontend**
   - Key Secret should only be used on your backend
   - Frontend only needs Key ID

2. **Always verify payments on backend**
   - Use signature verification
   - Don't trust frontend payment status alone

3. **Use HTTPS in production**
   - Required for secure payments

4. **Store payment data securely**
   - Don't store card details
   - Use Razorpay's secure tokenization

## Backend Integration (Recommended)

For production, you should:

1. **Create orders on backend**
   ```javascript
   // Backend API: POST /api/razorpay/orders
   const order = await razorpay.orders.create({
     amount: 50000, // ₹500 in paise
     currency: 'INR',
   });
   ```

2. **Verify payments on backend**
   ```javascript
   // Backend API: POST /api/razorpay/verify
   const crypto = require('crypto');
   const signature = crypto
     .createHmac('sha256', RAZORPAY_SECRET)
     .update(orderId + '|' + paymentId)
     .digest('hex');
   ```

3. **Handle webhooks**
   - Razorpay sends payment status updates
   - Verify webhook signatures

## Current Implementation

The current implementation:
- ✅ Loads Razorpay script dynamically
- ✅ Opens Razorpay checkout modal
- ✅ Handles payment success/failure
- ✅ Works in demo mode (without API keys)
- ⚠️ Uses frontend-only flow (for demo)

## Production Checklist

Before going live:

- [ ] Switch to live API keys
- [ ] Implement backend order creation
- [ ] Implement payment verification on backend
- [ ] Set up webhooks for payment status
- [ ] Enable HTTPS
- [ ] Test with real payment (small amount)
- [ ] Set up error monitoring
- [ ] Configure refund policy

## Troubleshooting

### Issue: "Razorpay is not available"
- **Solution**: Check internet connection, Razorpay script loads from CDN

### Issue: "Invalid Key ID"
- **Solution**: Check `.env` file, ensure Key ID is correct

### Issue: Payment modal doesn't open
- **Solution**: Check browser console for errors, ensure script loaded

### Issue: Payment succeeds but order not created
- **Solution**: Implement backend order creation and verification

## Support

- **Razorpay Docs**: [https://razorpay.com/docs](https://razorpay.com/docs)
- **Razorpay Support**: [https://razorpay.com/support](https://razorpay.com/support)
- **Test Cards**: [https://razorpay.com/docs/payments/test-cards](https://razorpay.com/docs/payments/test-cards)

## Alternative Payment Gateways

If you want to use other gateways:

1. **Stripe** - Popular globally, excellent docs
2. **PayPal** - Good for international
3. **Square** - Simple integration
4. **Mercado Pago** - Good for Latin America

The code structure is similar, just replace Razorpay service with your chosen gateway.
