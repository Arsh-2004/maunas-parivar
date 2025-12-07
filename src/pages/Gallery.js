import React from 'react';
import './Gallery.css';

const Gallery = () => {
  const galleryItems = [
    { type: 'image', icon: '🎉', title: 'Annual Gathering 2024' },
    { type: 'image', icon: '🎓', title: 'Scholarship Ceremony' },
    { type: 'image', icon: '🪔', title: 'Diwali Celebration' },
    { type: 'image', icon: '🎭', title: 'Cultural Program' },
    { type: 'image', icon: '⚽', title: 'Sports Tournament' },
    { type: 'image', icon: '💉', title: 'Blood Donation Camp' },
    { type: 'image', icon: '🤝', title: 'Community Meeting' },
    { type: 'image', icon: '🎊', title: 'Festival Celebration' },
    { type: 'image', icon: '📚', title: 'Educational Workshop' },
  ];

  return (
    <div className="gallery-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Photo Gallery</h1>
          <p>Moments That Define Us</p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Memories</h2>
            <div className="underline"></div>
            <p className="section-subtitle">Capturing the spirit of our community</p>
          </div>
          
          <div className="gallery-grid">
            {galleryItems.map((item, index) => (
              <div key={index} className="gallery-item">
                <div className="gallery-image">
                  <div className="image-placeholder">
                    <span className="gallery-icon">{item.icon}</span>
                  </div>
                  <div className="gallery-overlay">
                    <button className="view-btn">🔍 View</button>
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
