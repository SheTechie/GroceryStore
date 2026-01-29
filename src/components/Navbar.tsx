import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { getTotalItems } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const totalItems = getTotalItems();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛒 Kirana Store
        </Link>

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={isMenuOpen ? 'open' : ''}>☰</span>
        </button>

        {/* Navigation links */}
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
          </li>
          <li>
            <Link 
              to="/products" 
              className={isActive('/products') ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.products')}
            </Link>
          </li>
          <li>
            <Link 
              to="/cart" 
              className={`cart-link ${isActive('/cart') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.cart')}
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link 
                to="/admin" 
                className={isActive('/admin') ? 'active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.admin')}
              </Link>
            </li>
          )}
          <li>
            <button 
              onClick={toggleLanguage}
              className="language-btn"
              title={language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
            >
              {language === 'en' ? 'हिं' : 'EN'}
            </button>
          </li>
          {isAuthenticated ? (
            <li>
              <button 
                onClick={handleLogout}
                className="logout-nav-btn"
              >
                {t('nav.logout')}
              </button>
            </li>
          ) : (
            <li>
              <Link 
                to="/login" 
                className={isActive('/login') ? 'active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};
