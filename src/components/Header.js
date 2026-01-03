import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../translations';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const t = (path) => getTranslation(language, path);

  const isAdminPage = location.pathname === '/admin';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <a href="#main-content" className="skip-link">{language === 'en' ? 'Skip to main content' : 'मुख्य सामग्री पर जाएं'}</a>
      <header className="header">
        <div className="top-bar">
          <div className="container">
            <div className="top-bar-content">
              <div className="contact-info">
                <span>📧 info@maunasparivar.com</span>
                <span>📞 +91 9876543210</span>
              </div>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label={language === 'en' ? 'Visit our Facebook page' : 'हमारे फेसबुक पेज पर जाएं'}>{language === 'en' ? 'Facebook' : 'फेसबुक'}</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label={language === 'en' ? 'Visit our Twitter profile' : 'हमारे ट्विटर प्रोफाइल पर जाएं'}>{language === 'en' ? 'Twitter' : 'ट्विटर'}</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label={language === 'en' ? 'Visit our Instagram profile' : 'हमारे इंस्टाग्राम प्रोफाइल पर जाएं'}>{language === 'en' ? 'Instagram' : 'इंस्टाग्राम'}</a>
                <button 
                  className="language-toggle" 
                  onClick={toggleLanguage}
                  aria-label="Toggle language"
                  title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
                >
                  {language === 'en' ? 'हिंदी' : 'EN'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="navbar" role="navigation" aria-label="Main navigation">
          <div className="container">
            <div className="nav-content">
            <Link to="/" className="logo" aria-label={language === 'en' ? 'Kshatriya Maunas Parivar home' : 'क्षत्रिय मौनस परिवार मुखपृष्ठ'}>
              <img
                src="/assets/ram.png"
                alt=""
                className="logo-image"
                loading="lazy"
                aria-hidden="true"
              />
              <div className="logo-text">
                <span className="logo-title">{language === 'en' ? 'Kshatriya Maunas Parivar' : 'क्षत्रिय मौनस परिवार'}</span>
              </div>
            </Link>
            
            <div id="nav-menu" className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>{t('header.home')}</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>{t('header.about')}</Link>
              <Link to="/members" onClick={() => setIsMenuOpen(false)}>{language === 'en' ? 'Members' : 'सदस्य'}</Link>
              {isAuthenticated() && !isAdminPage && (
                <>
                  <Link to="/community" onClick={() => setIsMenuOpen(false)}>{t('header.community')}</Link>
                  <Link to="/events" onClick={() => setIsMenuOpen(false)}>{t('header.events')}</Link>
                  <Link to="/gallery" onClick={() => setIsMenuOpen(false)}>{t('header.gallery')}</Link>
                </>
              )}
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>{t('header.contact')}</Link>
              {!isAdminPage && (
                <>
                  {isAuthenticated() ? (
                    <>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        👤 {language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल'}
                      </Link>
                      <button className="btn-logout" onClick={handleLogout}>
                        {language === 'en' ? 'Logout' : 'लॉगआउट'}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="btn-login" onClick={() => setIsMenuOpen(false)}>
                        {language === 'en' ? 'Login' : 'लॉगिन'}
                      </Link>
                      <Link to="/membership" className="btn-primary" onClick={() => setIsMenuOpen(false)}>
                        {t('header.joinUs')}
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>              <button 
                className="menu-toggle" 
                onClick={toggleMenu}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                aria-controls="nav-menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
