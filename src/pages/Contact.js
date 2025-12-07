import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import './Contact.css';

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const thankYouMsg = language === 'en' 
      ? 'Thank you for contacting us! We will get back to you soon.' 
      : 'हमसे संपर्क करने के लिए धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे।';
    alert(thankYouMsg);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
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

                <button type="submit" className="submit-btn">{t('contact.sendBtn')}</button>
              </form>
            </div>

            <div className="contact-info-wrapper">
              <h2>{t('contact.getInTouch')}</h2>
              <div className="contact-cards">
                <div className="info-card">
                  <div className="info-icon">📍</div>
                  <h3>{t('contact.address')}</h3>
                  <p>{language === 'en' ? 'Rajasthan, India' : 'राजस्थान, भारत'}</p>
                </div>

                <div className="info-card">
                  <div className="info-icon">📧</div>
                  <h3>{t('contact.email')}</h3>
                  <p>info@maunasparivar.com</p>
                  <p>support@maunasparivar.com</p>
                </div>

                <div className="info-card">
                  <div className="info-icon">📞</div>
                  <h3>{t('contact.phone')}</h3>
                  <p>+91 9876543210</p>
                  <p>+91 9876543211</p>
                </div>

                <div className="info-card">
                  <div className="info-icon">🕐</div>
                  <h3>{t('contact.officeHours')}</h3>
                  <p>{language === 'en' ? 'Monday - Saturday' : 'सोमवार - शनिवार'}</p>
                  <p>9:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="social-connect">
                <h3>{t('contact.connectUs')}</h3>
                <div className="social-icons">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    Facebook
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    Twitter
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    Instagram
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    YouTube
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
