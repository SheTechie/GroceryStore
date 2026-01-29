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

export interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  paymentMethod: "card" | "cash";
}
