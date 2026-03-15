import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Heritage.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://maunas-parivar.onrender.com/api';

const Heritage = () => {
  const { language } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/admin/heritage-posts`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setPosts(data.posts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="heritage-page">
      {/* Hero Section */}
      <section className="heritage-hero">
        <div className="heritage-hero-overlay" />
        <div className="container">
          <div className="heritage-hero-inner">
            <div className="heritage-hero-portrait">
              <img
                src="/assets/महाराजा राम सिंह मौनस.png"
                alt="महाराजा राम सिंह मौनस"
                className="heritage-maharaja-image"
                loading="lazy"
              />
            </div>
            <div className="heritage-hero-text">
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
          </div>
        </div>
      </section>

      {/* Historic Sites Section */}
      <section className="heritage-sites-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Historic Sites' : 'ऐतिहासिक स्थल'}</h2>
            <div className="underline"></div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              {language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}
            </div>
          )}

          {!loading && posts.map((post, idx) => (
            <div key={post._id}>
              {post.imagePath ? (
                <div className="heritage-about-content">
                  <div className="heritage-about-text">
                    <h3 className="heritage-site-name-hi">{post.titleHi}</h3>
                    {post.titleEn && <h4 className="heritage-site-name-en">{post.titleEn}</h4>}
                    <p>{language === 'en' && post.descriptionEn ? post.descriptionEn : post.descriptionHi}</p>
                  </div>
                  <div className="heritage-about-image">
                    <div className="image-placeholder">
                      <img src={post.imagePath} alt={post.titleHi} />
                      {post.imageCaption && <p>{post.imageCaption}</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="heritage-about-text heritage-text-only">
                  <h3 className="heritage-site-name-hi">{post.titleHi}</h3>
                  {post.titleEn && <h4 className="heritage-site-name-en">{post.titleEn}</h4>}
                  <p>{language === 'en' && post.descriptionEn ? post.descriptionEn : post.descriptionHi}</p>
                </div>
              )}
              {idx < posts.length - 1 && <div className="heritage-site-divider" />}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Heritage;