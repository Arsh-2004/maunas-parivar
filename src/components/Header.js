import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../translations';
import './Header.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userTier, setUserTier] = useState(null);
  const { language, toggleLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const t = (path) => getTranslation(language, path);

  const isAdminPage = location.pathname === '/admin';

  // Fetch user photo and tier
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated()) {
        const phone = localStorage.getItem('userPhone');
        if (phone) {
          try {
            const response = await fetch(`${API_URL}/users/profile/${phone}`);
            const data = await response.json();
            console.log('Header - Full response data:', data);
            console.log('Header - User object:', data.user);
            console.log('Header - PhotoPath value:', data.user?.photoPath);
            if (data.success && data.user) {
              if (data.user.photoPath) {
                console.log('Header - Setting photo to:', data.user.photoPath);
                setUserPhoto(data.user.photoPath);
              } else {
                console.log('Header - No photoPath found in user object');
              }
              console.log('Header - Setting userTier to:', data.user.membershipTier);
              setUserTier(data.user.membershipTier);
            }
          } catch (err) {
            console.error('Error fetching user data:', err);
          }
        }
      }
    };
    fetchUserData();
  }, [isAuthenticated]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setUserPhoto(null);
    setUserTier(null);
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
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  info@maunasparivar.com
                </span>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  +91 9876543210
                </span>
              </div>
              <div className="social-links">
                <a href="mailto:info@maunasparivar.com" 
                   aria-label={language === 'en' ? 'Send us an email' : 'हमें ईमेल भेजें'}
                   title={language === 'en' ? 'Gmail' : 'जीमेल'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#D44638"/>
                    <path d="M0 5.457v.727l12 9 12-9v-.727c0-.666-.404-1.235-.982-1.491L12 10.91 1.982 3.966A1.636 1.636 0 0 0 0 5.457z" fill="#EA4335"/>
                  </svg>
                </a>
                <a href="https://facebook.com" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   aria-label={language === 'en' ? 'Visit our Facebook page' : 'हमारे फेसबुक पेज पर जाएं'}
                   title="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   aria-label={language === 'en' ? 'Visit our Twitter profile' : 'हमारे ट्विटर प्रोफाइल पर जाएं'}
                   title="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   aria-label={language === 'en' ? 'Visit our Instagram profile' : 'हमारे इंस्टाग्राम प्रोफाइल पर जाएं'}
                   title="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
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
              {isAuthenticated() && !isAdminPage && (
                <>
                  {console.log('Header - Current userTier:', userTier, 'isAuthenticated:', isAuthenticated())}
                  {/* Show tier-specific dashboard links */}
                  {userTier === 'diamond' && (
                    <Link to="/diamond-dashboard" onClick={() => setIsMenuOpen(false)}>
                      💎 {language === 'en' ? 'Diamond Panel' : 'डायमंड पैनल'}
                    </Link>
                  )}
                  {userTier === 'gold' && (
                    <Link to="/gold-dashboard" onClick={() => setIsMenuOpen(false)}>
                      🥇 {language === 'en' ? 'Gold Panel' : 'गोल्ड पैनल'}
                    </Link>
                  )}
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
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="profile-link">
                        {userPhoto ? (
                          <img 
                            src={userPhoto} 
                            alt="Profile" 
                            className="header-user-photo"
                            onError={(e) => {
                              console.error('Image failed to load:', userPhoto);
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<span class="header-user-icon">👤</span>';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', userPhoto);
                            }}
                          />
                        ) : (
                          <span className="header-user-icon">👤</span>
                        )}
                        <span>{language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल'}</span>
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
