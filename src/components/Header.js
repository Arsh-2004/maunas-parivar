import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="contact-info">
              <span>📧 info@maunasparivar.com</span>
              <span>📞 +91 9876543210</span>
            </div>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="logo">
              <h2>🏰 Kshatriya Maunas Parivar</h2>
            </Link>
            
            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
              <Link to="/community" onClick={() => setIsMenuOpen(false)}>Community</Link>
              <Link to="/events" onClick={() => setIsMenuOpen(false)}>Events</Link>
              <Link to="/gallery" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link to="/membership" className="btn-primary" onClick={() => setIsMenuOpen(false)}>
                Join Us
              </Link>
            </div>
            
            <button className="menu-toggle" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
