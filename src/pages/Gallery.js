import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import './Gallery.css';

const Gallery = () => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  const galleryItems = [
    { type: 'image', icon: '🎉', title: language === 'en' ? 'Annual Gathering 2024' : 'वार्षिक समारोह 2024' },
    { type: 'image', icon: '🎓', title: language === 'en' ? 'Scholarship Ceremony' : 'छात्रवृत्ति समारोह' },
    { type: 'image', icon: '🪔', title: language === 'en' ? 'Diwali Celebration' : 'दिवाली समारोह' },
    { type: 'image', icon: '🎭', title: language === 'en' ? 'Cultural Program' : 'सांस्कृतिक कार्यक्रम' },
    { type: 'image', icon: '⚽', title: language === 'en' ? 'Sports Tournament' : 'क्रीड़ा टूर्नामेंट' },
    { type: 'image', icon: '💉', title: language === 'en' ? 'Blood Donation Camp' : 'रक्तदान शिविर' },
    { type: 'image', icon: '🤝', title: language === 'en' ? 'Community Meeting' : 'सामुदायिक बैठक' },
    { type: 'image', icon: '🎊', title: language === 'en' ? 'Festival Celebration' : 'त्योहार समारोह' },
    { type: 'image', icon: '📚', title: language === 'en' ? 'Educational Workshop' : 'शैक्षणिक कार्यशाला' },
  ];

  return (
    <div className="gallery-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>{t('gallery.title')}</h1>
          <p>{t('gallery.subtitle')}</p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('gallery.ourMemories')}</h2>
            <div className="underline"></div>
          </div>
          
          <div className="gallery-grid">
            {galleryItems.map((item, index) => (
              <div key={index} className="gallery-item">
                <div className="gallery-image">
                  <div className="image-placeholder">
                    <span className="gallery-icon">{item.icon}</span>
                  </div>
                  <div className="gallery-overlay">
                    <button className="view-btn">🔍 {language === 'en' ? 'View' : 'देखें'}</button>
                  </div>
                </div>
                <div className="gallery-caption">
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
