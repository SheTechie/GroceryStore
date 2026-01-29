import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { SettingsProvider } from './context/SettingsContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProductProvider>
          <SettingsProvider>
            <CartProvider>
              <Router>
                <div className="App">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-success" element={<OrderSuccess />} />
                      <Route path="/login" element={<Login />} />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute requireAdmin={true}>
                            <Admin />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>
                </div>
              </Router>
            </CartProvider>
          </SettingsProvider>
        </ProductProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
