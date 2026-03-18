import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Gallery.css';

const API_URL = '/api';

const Gallery = () => {
  const { language } = useLanguage();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/gallery`);
      const data = await response.json();
      if (data.success) {
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = filter === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === filter);

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="container">
          <h1>{language === 'en' ? 'Photo Gallery' : 'फोटो गैलरी'}</h1>
          <p>{language === 'en' 
            ? 'Memorable moments from our community events' 
            : 'हमारे सामुदायिक कार्यक्रमों की यादगार पल'}</p>
        </div>
      </section>

      <section className="gallery-content">
        <div className="container">
          <div className="gallery-filters">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              {language === 'en' ? 'All' : 'सभी'}
            </button>
            <button 
              className={filter === 'events' ? 'active' : ''}
              onClick={() => setFilter('events')}
            >
              {language === 'en' ? 'Events' : 'कार्यक्रम'}
            </button>
            <button 
              className={filter === 'community' ? 'active' : ''}
              onClick={() => setFilter('community')}
            >
              {language === 'en' ? 'Community' : 'समुदाय'}
            </button>
            <button 
              className={filter === 'general' ? 'active' : ''}
              onClick={() => setFilter('general')}
            >
              {language === 'en' ? 'General' : 'सामान्य'}
            </button>
          </div>

          {loading ? (
            <p className="loading-text">{language === 'en' ? 'Loading gallery...' : 'गैलरी लोड हो रही है...'}</p>
          ) : filteredPhotos.length === 0 ? (
            <div className="no-photos">
              <p>{language === 'en' 
                ? 'No photos available in this category' 
                : 'इस श्रेणी में कोई फोटो उपलब्ध नहीं है'}</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredPhotos.map((photo) => (
                <div 
                  key={photo._id} 
                  className="gallery-item"
                  onClick={() => openLightbox(photo)}
                >
                  <div className="gallery-image">
                    {photo.imagePath ? (
                      <img 
                        src={photo.imagePath} 
                        alt={photo.title} 
                        loading="lazy"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <span className="gallery-icon">📷</span>
                      </div>
                    )}
                  </div>
                  <div className="gallery-caption">
                    <h3>{photo.title}</h3>
                    {photo.description && <p>{photo.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <div className="lightbox-img-wrap">
              <img 
                src={selectedPhoto.imagePath} 
                alt={selectedPhoto.title} 
              />
            </div>
            <div className="lightbox-info">
              <h2>{selectedPhoto.title}</h2>
              {selectedPhoto.description && <p>{selectedPhoto.description}</p>}
              <span className="photo-date">
                {new Date(selectedPhoto.uploadedAt).toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
