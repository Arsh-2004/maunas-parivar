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
              <h3>🏰 Kshatriya Maunas Parivar</h3>
              <p>
                Dedicated to preserving our rich heritage and empowering the 
                Maunas Kshatriya community through unity, tradition, and progress.
              </p>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">📺</a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/community">Community</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Get Involved</h4>
              <ul>
                <li><Link to="/membership">Member Registration</Link></li>
                <li><Link to="/events">Upcoming Events</Link></li>
                <li><Link to="/donate">Donate</Link></li>
                <li><Link to="/volunteer">Volunteer</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact Info</h4>
              <div className="contact-details">
                <p>📍 Rajasthan, India</p>
                <p>📧 info@maunasparivar.com</p>
                <p>📞 +91 9876543210</p>
                <p>🕐 Mon - Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Kshatriya Maunas Parivar. All Rights Reserved.</p>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
