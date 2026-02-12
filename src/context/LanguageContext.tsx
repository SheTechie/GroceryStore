import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.cart': 'Cart',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // Home
    'home.title': 'Welcome to Kirana Store',
    'home.subtitle': 'Your neighborhood grocery store - All essentials at your doorstep',
    'home.search.placeholder': 'Search products...',
    
    // Products
    'products.title': 'All Products',
    'products.subtitle': 'Browse our complete selection of fresh groceries',
    'products.count': 'Showing {count} product',
    'products.count.plural': 'Showing {count} products',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty.title': 'Your cart is empty',
    'cart.empty.message': 'Add some products to get started!',
    'cart.shop.now': 'Shop Now',
    'cart.clear': 'Clear Cart',
    'cart.order.summary': 'Order Summary',
    'cart.subtotal': 'Subtotal:',
    'cart.shipping': 'Shipping:',
    'cart.shipping.free': 'Free',
    'cart.total': 'Total:',
    'cart.checkout': 'Proceed to Checkout',
    'cart.checkout.disabled': 'Please enable price display to proceed',
    'cart.continue.shopping': 'Continue Shopping',
    'cart.share.whatsapp': 'Share on WhatsApp',
    'cart.share.disabled': 'Please enable price display to share',
    
    // Product Card
    'product.add.to.cart': 'Add to Cart',
    'product.unavailable': 'Unavailable',
    'product.out.of.stock': 'Out of Stock',
    'product.added': 'Added!',
    'product.no.description': 'No description',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shipping.info': 'Shipping Information',
    'checkout.payment.method': 'Payment Method',
    'checkout.name': 'Full Name',
    'checkout.email': 'Email',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.zip': 'Zip Code',
    'checkout.card': 'Credit/Debit Card',
    'checkout.cash': 'Cash on Delivery',
    'checkout.place.order': 'Place Order',
    'checkout.continue.to.payment': 'Continue to Payment',
    'checkout.processing': 'Processing...',
    
    // Order Success
    'order.success.title': 'Order Placed Successfully!',
    'order.success.message': 'Thank you for your purchase. Your order has been confirmed.',
    'order.success.continue': 'Continue Shopping',
    'order.success.home': 'Go to Home',
    
    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.add.product': 'Add New Product',
    'admin.cancel': 'Cancel',
    'admin.all.products': 'All Products',
    'admin.product.name': 'Product Name',
    'admin.category': 'Category',
    'admin.price': 'Price',
    'admin.quantity': 'Quantity',
    'admin.unit': 'Unit',
    'admin.description': 'Description',
    'admin.image.url': 'Image URL',
    'admin.rating': 'Rating (0-5)',
    'admin.in.stock': 'In Stock',
    'unit.kg': 'KG',
    'unit.gram': 'Gram',
    'unit.litre': 'Litre',
    'unit.ml': 'ML',
    'unit.packet': 'Packet',
    'unit.piece': 'Piece',
    'unit.dozen': 'Dozen',
    'unit.box': 'Box',
    'admin.add': 'Add Product',
    'admin.delete': 'Delete',
    'admin.edit': 'Edit',
    'admin.save': 'Save',
    'admin.id': 'ID',
    'admin.stock': 'Stock',
    'admin.actions': 'Actions',
    'admin.product.added': 'Product added successfully!',
    'admin.delete.confirm': 'Are you sure you want to delete this product?',
    'admin.settings': 'Settings',
    'admin.show.prices': 'Show Prices on Products',
    'admin.show.prices.description': 'Toggle to show or hide product prices on the storefront',
    'admin.validation.name.required': 'Product name is required',
    'admin.validation.price.required': 'Valid price is required',
    'admin.validation.description.required': 'Description is required',
    'admin.validation.image.required': 'Image URL is required',
    'admin.validation.rating.invalid': 'Rating must be between 0 and 5',
    
    // Login
    'login.title': 'Admin Login',
    'login.subtitle': 'Sign in to manage products',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.button': 'Login',
    'login.logging': 'Logging in...',
    'login.error': 'Invalid username or password',
    'login.demo': 'Demo Credentials:',
    
    // Common
    'common.loading': 'Loading products...',
    'common.error': 'Error',
    'common.no.products': 'No products found.',
    'common.required': 'required',
    'validation.name.required': 'Name is required',
    'validation.email.required': 'Email is required',
    'validation.email.invalid': 'Invalid email format',
    'validation.address.required': 'Address is required',
    'validation.city.required': 'City is required',
    'validation.zip.required': 'Zip code is required',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.products': 'उत्पाद',
    'nav.cart': 'कार्ट',
    'nav.admin': 'एडमिन',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    
    // Home
    'home.title': 'किराना स्टोर में आपका स्वागत है',
    'home.subtitle': 'आपकी पड़ोस की किराने की दुकान - सभी जरूरतें आपके दरवाजे पर',
    'home.search.placeholder': 'उत्पाद खोजें...',
    
    // Products
    'products.title': 'सभी उत्पाद',
    'products.subtitle': 'ताज़ी किराने की हमारी पूरी रेंज ब्राउज़ करें',
    'products.count': '{count} उत्पाद दिखा रहे हैं',
    'products.count.plural': '{count} उत्पाद दिखा रहे हैं',
    
    // Cart
    'cart.title': 'शॉपिंग कार्ट',
    'cart.empty.title': 'आपकी कार्ट खाली है',
    'cart.empty.message': 'शुरू करने के लिए कुछ उत्पाद जोड़ें!',
    'cart.shop.now': 'अभी खरीदें',
    'cart.clear': 'कार्ट साफ करें',
    'cart.order.summary': 'ऑर्डर सारांश',
    'cart.subtotal': 'उप-योग:',
    'cart.shipping': 'शिपिंग:',
    'cart.shipping.free': 'मुफ्त',
    'cart.total': 'कुल:',
    'cart.checkout': 'चेकआउट पर जाएं',
    'cart.checkout.disabled': 'आगे बढ़ने के लिए कृपया कीमत प्रदर्शन सक्षम करें',
    'cart.share.whatsapp': 'WhatsApp पर साझा करें',
    'cart.share.disabled': 'साझा करने के लिए कृपया कीमत प्रदर्शन सक्षम करें',
    'cart.continue.shopping': 'खरीदारी जारी रखें',
    
    // Product Card
    'product.add.to.cart': 'कार्ट में जोड़ें',
    'product.unavailable': 'उपलब्ध नहीं',
    'product.out.of.stock': 'स्टॉक में नहीं',
    'product.added': 'जोड़ दिया!',
    'product.no.description': 'कोई विवरण नहीं',
    
    // Checkout
    'checkout.title': 'चेकआउट',
    'checkout.shipping.info': 'शिपिंग जानकारी',
    'checkout.payment.method': 'भुगतान विधि',
    'checkout.name': 'पूरा नाम',
    'checkout.email': 'ईमेल',
    'checkout.address': 'पता',
    'checkout.city': 'शहर',
    'checkout.zip': 'पिन कोड',
    'checkout.card': 'क्रेडिट/डेबिट कार्ड',
    'checkout.cash': 'कैश ऑन डिलीवरी',
    'checkout.place.order': 'ऑर्डर दें',
    'checkout.continue.to.payment': 'भुगतान पर जाएं',
    'checkout.processing': 'प्रसंस्करण...',
    
    // Order Success
    'order.success.title': 'ऑर्डर सफलतापूर्वक दिया गया!',
    'order.success.message': 'आपकी खरीदारी के लिए धन्यवाद। आपका ऑर्डर पुष्टि हो गया है।',
    'order.success.continue': 'खरीदारी जारी रखें',
    'order.success.home': 'होम पर जाएं',
    
    // Admin
    'admin.title': 'एडमिन डैशबोर्ड',
    'admin.add.product': 'नया उत्पाद जोड़ें',
    'admin.cancel': 'रद्द करें',
    'admin.all.products': 'सभी उत्पाद',
    'admin.product.name': 'उत्पाद का नाम',
    'admin.category': 'श्रेणी',
    'admin.price': 'कीमत',
    'admin.quantity': 'मात्रा',
    'admin.unit': 'इकाई',
    'admin.description': 'विवरण',
    'admin.image.url': 'छवि URL',
    'admin.rating': 'रेटिंग (0-5)',
    'admin.in.stock': 'स्टॉक में',
    'unit.kg': 'किलो',
    'unit.gram': 'ग्राम',
    'unit.litre': 'लीटर',
    'unit.ml': 'एमएल',
    'unit.packet': 'पैकेट',
    'unit.piece': 'टुकड़ा',
    'unit.dozen': 'दर्जन',
    'unit.box': 'बॉक्स',
    'admin.add': 'उत्पाद जोड़ें',
    'admin.delete': 'हटाएं',
    'admin.edit': 'संपादित करें',
    'admin.save': 'सहेजें',
    'admin.id': 'आईडी',
    'admin.stock': 'स्टॉक',
    'admin.actions': 'कार्रवाई',
    'admin.product.added': 'उत्पाद सफलतापूर्वक जोड़ा गया!',
    'admin.delete.confirm': 'क्या आप वाकई इस उत्पाद को हटाना चाहते हैं?',
    'admin.settings': 'सेटिंग्स',
    'admin.show.prices': 'उत्पादों पर कीमतें दिखाएं',
    'admin.show.prices.description': 'स्टोरफ्रंट पर उत्पाद कीमतें दिखाने या छुपाने के लिए टॉगल करें',
    'admin.validation.name.required': 'उत्पाद का नाम आवश्यक है',
    'admin.validation.price.required': 'मान्य कीमत आवश्यक है',
    'admin.validation.description.required': 'विवरण आवश्यक है',
    'admin.validation.image.required': 'छवि URL आवश्यक है',
    'admin.validation.rating.invalid': 'रेटिंग 0 और 5 के बीच होनी चाहिए',
    
    // Login
    'login.title': 'एडमिन लॉगिन',
    'login.subtitle': 'उत्पाद प्रबंधित करने के लिए साइन इन करें',
    'login.username': 'उपयोगकर्ता नाम',
    'login.password': 'पासवर्ड',
    'login.button': 'लॉगिन',
    'login.logging': 'लॉगिन हो रहा है...',
    'login.error': 'अमान्य उपयोगकर्ता नाम या पासवर्ड',
    'login.demo': 'डेमो क्रेडेंशियल:',
    
    // Common
    'common.loading': 'उत्पाद लोड हो रहे हैं...',
    'common.error': 'त्रुटि',
    'common.no.products': 'कोई उत्पाद नहीं मिला।',
    'common.required': 'आवश्यक',
    'validation.name.required': 'नाम आवश्यक है',
    'validation.email.required': 'ईमेल आवश्यक है',
    'validation.email.invalid': 'अमान्य ईमेल प्रारूप',
    'validation.address.required': 'पता आवश्यक है',
    'validation.city.required': 'शहर आवश्यक है',
    'validation.zip.required': 'पिन कोड आवश्यक है',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || key;
    
    // Replace placeholders like {count}
    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, String(params[param]));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
