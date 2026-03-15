import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import './Contact.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://maunas-parivar.onrender.com/api';

const Contact = () => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      console.log('Contact: Submitting to', `${API_URL}/contact`);
      
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Contact: Response status', response.status);
      
      const data = await response.json();
      if (data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        console.error('Contact: Server error', data);
        setSubmitStatus('error');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      
      console.error('Contact: Fetch error', {
        message: err.message,
        name: err.name,
        url: `${API_URL}/contact`
      });
      
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-header">
        <div className="container">
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form-wrapper">
              <h2>{t('contact.sendMessage')}</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">{t('contact.fullName')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t('contact.email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter your email' : 'अपना ईमेल दर्ज करें'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t('contact.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Enter your phone number' : 'अपना फोन नंबर दर्ज करें'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">{t('contact.subject')}</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter subject' : 'विषय दर्ज करें'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t('contact.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder={language === 'en' ? 'Enter your message' : 'अपना संदेश दर्ज करें'}
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting 
                    ? (language === 'en' ? 'Sending...' : 'भेजा जा रहा है...') 
                    : t('contact.sendBtn')}
                </button>
                {submitStatus === 'success' && (
                  <div className="form-success-msg">
                    ✅ {language === 'en' ? 'Message sent successfully! We will get back to you soon.' : 'संदेश सफलतापूर्वक भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।'}
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="form-error-msg">
                    ❌ {language === 'en' ? 'Failed to send message. Please try again.' : 'संदेश भेजने में विफल। कृपया पुनः प्रयास करें।'}
                  </div>
                )}
              </form>
            </div>

            <div className="contact-info-wrapper">
              <h2>{t('contact.getInTouch')}</h2>
              <div className="contact-cards">
                <div className="info-card">
                  <div className="info-icon">📍</div>
                  <h3>{t('contact.address')}</h3>
                  <p>{language === 'en' ? 'Devtayan ,Surabhi Nagar Colony, Awaleshpur, Varanasi U.P.' : 'देवतायन ,सुरभि नगर कॉलोनी, अवलेशपुर वाराणसी उ०प्र०'}</p>
                </div>

                <div className="info-card">
                  <div className="info-icon">📧</div>
                  <h3>{t('contact.email')}</h3>
                  <p>kshatriyamaunasparivar@gmail.com</p>
                </div>

                <div className="info-card">
                  <div className="info-icon">📞</div>
                  <h3>{t('contact.phone')}</h3>
                  <p>+91 8840709296</p>
                </div>

                
              </div>

             <div className="social-connect">
  <h3>{t('contact.connectUs')}</h3>
  <div className="social-icons">
    <a href="mailto:kshatriyamaunasparivar@gmail.com" 
       target="_blank" 
       rel="noopener noreferrer" 
       className="social-icon email"
       title={language === 'en' ? 'Email' : 'ईमेल'}>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                    <path d="M0 5.457v.727l12 9 12-9v-.727c0-.666-.404-1.235-.982-1.491L12 10.91 1.982 3.966A1.636 1.636 0 0 0 0 5.457z"/>
                  </svg>
    </a>
    <a href="https://facebook.com" 
       target="_blank" 
       rel="noopener noreferrer" 
       className="social-icon facebook"
       title="Facebook">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </a>
    <a href="https://twitter.com" 
       target="_blank" 
       rel="noopener noreferrer" 
       className="social-icon x-twitter"
       title="Twitter">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </a>
    <a href="https://instagram.com" 
       target="_blank" 
       rel="noopener noreferrer" 
       className="social-icon instagram"
       title="Instagram">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    </a>
    <a href="https://youtube.com" 
       target="_blank" 
       rel="noopener noreferrer" 
       className="social-icon youtube"
       title="YouTube">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    </a>
  </div>
</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
