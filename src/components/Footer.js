import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>🏰 क्षत्रिय मौना परिवार</h3>
              <p>
                हमारी समृद्ध विरासत को संरक्षित करने और मौना क्षत्रिय समुदाय को एकता, परंपरा और प्रगति के माध्यम से सशक्त बनाने के लिए समर्पित।
              </p>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">📺</a>
              </div>
            </div>

            <div className="footer-section">
              <h4>त्वरित लिंक</h4>
              <ul>
                <li><Link to="/">होम</Link></li>
                <li><Link to="/about">हमारे बारे में</Link></li>
                <li><Link to="/community">समुदाय</Link></li>
                <li><Link to="/events">घटनाएं</Link></li>
                <li><Link to="/gallery">गैलरी</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>शामिल हों</h4>
              <ul>
                <li><Link to="/membership">सदस्य पंजीकरण</Link></li>
                <li><Link to="/events">आने वाली घटनाएं</Link></li>
                <li><Link to="/donate">दान करें</Link></li>
                <li><Link to="/volunteer">स्वयंसेवक</Link></li>
                <li><Link to="/contact">हमसे संपर्क करें</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>संपर्क जानकारी</h4>
              <div className="contact-details">
                <p>📍 राजस्थान, भारत</p>
                <p>📧 info@maunasparivar.com</p>
                <p>📞 +91 9876543210</p>
                <p>🕐 सोम - शनि: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2024 क्षत्रिय मौना परिवार। सर्वाधिकार सुरक्षित।</p>
            <div className="footer-links">
              <Link to="/privacy">गोपनीयता नीति</Link>
              <Link to="/terms">शर्तें और शर्तें</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
