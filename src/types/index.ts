export type Category = "staples" | "pulses" | "spices" | "oil" | "snacks" | "beverages" | "household" | "personal-care" | "miscellaneous";
export type Unit = "kg" | "gram" | "litre" | "ml" | "packet" | "piece" | "dozen" | "box";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  inStock: boolean;
  image?: string;
  description?: string;
  rating?: number;
  quantity?: number;
  unit?: Unit;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export type DeliveryType = 'pickup' | 'delivery';

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  deliveryType: DeliveryType;
  address: string;
  city: string;
  zipCode: string;
  paymentMethod: PaymentMethod;
}

export type PaymentMethod = "card" | "upi" | "wallet" | "cash" | "razorpay" | "pay_at_store";

export interface CardPaymentData {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
}

export interface UPIPaymentData {
  upiId: string;
}

export interface WalletPaymentData {
  walletType: "phonepe" | "paytm" | "gpay" | "amazonpay";
  phoneNumber: string;
}

export interface PaymentData {
  method: PaymentMethod;
  amount: number;
  cardData?: CardPaymentData;
  upiData?: UPIPaymentData;
  walletData?: WalletPaymentData;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: string;
}
