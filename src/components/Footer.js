import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import './Footer.css';

const Footer = () => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>🏰 {language === 'en' ? 'Kshatriya Maunas Parivar' : 'क्षत्रिय मौना परिवार'}</h3>
              <p>
                {language === 'en' 
                  ? 'Dedicated to preserving our rich heritage and empowering the Maunas Kshatriya community through unity, tradition, and progress.'
                  : 'हमारी समृद्ध विरासत को संरक्षित करने और मौना क्षत्रिय समुदाय को एकता, परंपरा और प्रगति के माध्यम से सशक्त बनाने के लिए समर्पित।'}
              </p>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">📺</a>
              </div>
            </div>

            <div className="footer-section">
              <h4>{language === 'en' ? 'Quick Links' : 'त्वरित लिंक'}</h4>
              <ul>
                <li><Link to="/">{t('header.home')}</Link></li>
                <li><Link to="/about">{t('header.about')}</Link></li>
                <li><Link to="/community">{t('header.community')}</Link></li>
                <li><Link to="/events">{t('header.events')}</Link></li>
                <li><Link to="/gallery">{t('header.gallery')}</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>{language === 'en' ? 'Get Involved' : 'शामिल हों'}</h4>
              <ul>
                <li><Link to="/membership">{language === 'en' ? 'Member Registration' : 'सदस्य पंजीकरण'}</Link></li>
                <li><Link to="/events">{language === 'en' ? 'Upcoming Events' : 'आने वाली घटनाएं'}</Link></li>
                <li><Link to="/">{language === 'en' ? 'Donate' : 'दान करें'}</Link></li>
                <li><Link to="/">{language === 'en' ? 'Volunteer' : 'स्वयंसेवक'}</Link></li>
                <li><Link to="/contact">{t('header.contact')}</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>{language === 'en' ? 'Contact Information' : 'संपर्क जानकारी'}</h4>
              <div className="contact-details">
                <p>📍 {language === 'en' ? 'Rajasthan, India' : 'राजस्थान, भारत'}</p>
                <p>📧 info@maunasparivar.com</p>
                <p>📞 +91 9876543210</p>
                <p>🕐 {language === 'en' ? 'Mon - Sat: 9:00 AM - 6:00 PM' : 'सोम - शनि: 9:00 AM - 6:00 PM'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2024 {language === 'en' ? 'Kshatriya Maunas Parivar. All rights reserved.' : 'क्षत्रिय मौना परिवार। सर्वाधिकार सुरक्षित।'}</p>
            <div className="footer-links">
              <Link to="/">{language === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}</Link>
              <Link to="/">{language === 'en' ? 'Terms & Conditions' : 'शर्तें और शर्तें'}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
