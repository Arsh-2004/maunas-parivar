import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Heritage.css';

const Heritage = () => {
  const { language } = useLanguage();

  return (
    <div className="heritage-page">
      {/* Hero Section */}
      <section className="heritage-hero">
        <div className="heritage-hero-overlay" />
        <div className="container">
          <h1 className="heritage-hero-title">
            {language === 'en' ? 'Our Historical Heritage' : 'हमारे ऐतिहासिक धरोहर'}
          </h1>
          <p className="heritage-hero-subtitle">
            {language === 'en'
              ? 'Preserving the glorious legacy of the Maunas Kshatriya lineage'
              : 'मौनस क्षत्रिय वंश की गौरवशाली विरासत को संजोए रखना'}
          </p>
          <div className="heritage-hero-divider" />
        </div>
      </section>

      {/* Intro Section */}
      <section className="heritage-intro">
        <div className="container">
          <div className="heritage-intro-card">
            <div className="heritage-intro-icon">🏰</div>
            <h2>
              {language === 'en' ? 'Our Roots Run Deep' : 'हमारी जड़ें गहरी हैं'}
            </h2>
            <p>
              {language === 'en'
                ? 'Content about our historical heritage is being prepared. Check back soon to explore the rich history, traditions, and legacy of the Maunas Kshatriya community.'
                : 'हमारी ऐतिहासिक धरोहर के बारे में सामग्री तैयार की जा रही है। जल्द ही वापस आएं और मौनस क्षत्रिय समुदाय के समृद्ध इतिहास, परंपराओं और विरासत का अन्वेषण करें।'}
            </p>
          </div>
        </div>
      </section>

      {/* Placeholder Cards */}
      <section className="heritage-sections">
        <div className="container">
          <div className="heritage-grid">
            <div className="heritage-card">
              <div className="heritage-card-icon">⚔️</div>
              <h3>{language === 'en' ? 'Warrior Legacy' : 'वीरता की विरासत'}</h3>
              <p className="heritage-coming-soon">
                {language === 'en' ? 'Coming Soon...' : 'जल्द आ रहा है...'}
              </p>
            </div>
            <div className="heritage-card">
              <div className="heritage-card-icon">🛕</div>
              <h3>{language === 'en' ? 'Sacred Traditions' : 'पवित्र परंपराएं'}</h3>
              <p className="heritage-coming-soon">
                {language === 'en' ? 'Coming Soon...' : 'जल्द आ रहा है...'}
              </p>
            </div>
            <div className="heritage-card">
              <div className="heritage-card-icon">📜</div>
              <h3>{language === 'en' ? 'Ancient Scripts' : 'प्राचीन ग्रंथ'}</h3>
              <p className="heritage-coming-soon">
                {language === 'en' ? 'Coming Soon...' : 'जल्द आ रहा है...'}
              </p>
            </div>
            <div className="heritage-card">
              <div className="heritage-card-icon">🏛️</div>
              <h3>{language === 'en' ? 'Historic Sites' : 'ऐतिहासिक स्थल'}</h3>
              <p className="heritage-coming-soon">
                {language === 'en' ? 'Coming Soon...' : 'जल्द आ रहा है...'}
              </p>
            </div>
            <div className="heritage-card">
              <div className="heritage-card-icon">👑</div>
              <h3>{language === 'en' ? 'Royal Lineage' : 'राजवंशीय परिवार'}</h3>
              <p className="heritage-coming-soon">
                {language === 'en' ? 'Coming Soon...' : 'जल्द आ रहा है...'}
              </p>
            </div>
            <div className="heritage-card">
              <div className="heritage-card-icon">🎭</div>
              <h3>{language === 'en' ? 'Cultural Arts' : 'सांस्कृतिक कलाएं'}</h3>
              <p className="heritage-coming-soon">
                {language === 'en' ? 'Coming Soon...' : 'जल्द आ रहा है...'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Heritage;
