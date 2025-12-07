import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const t = (path) => getTranslation(language, path);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <Link to="/" className="logo">
              <h2>🏰 {language === 'en' ? 'Kshatriya Maunas Parivar' : 'क्षत्रिय मौना परिवार'}</h2>
            </Link>
            
            <div id="nav-menu" className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>{t('header.home')}</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>{t('header.about')}</Link>
              <Link to="/community" onClick={() => setIsMenuOpen(false)}>{t('header.community')}</Link>
              <Link to="/events" onClick={() => setIsMenuOpen(false)}>{t('header.events')}</Link>
              <Link to="/gallery" onClick={() => setIsMenuOpen(false)}>{t('header.gallery')}</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>{t('header.contact')}</Link>
              <Link to="/membership" className="btn-primary" onClick={() => setIsMenuOpen(false)}>
                {t('header.joinUs')}
              </Link>
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
