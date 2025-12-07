import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>About Kshatriya Maunas Parivar</h1>
          <p>Preserving Heritage | Empowering Community</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon">🎯</div>
              <h2>Our Mission</h2>
              <p>
                To unite and empower the Maunas Kshatriya community by preserving our 
                rich cultural heritage, promoting social welfare, and providing opportunities 
                for educational and economic advancement while upholding our traditional 
                values of courage, honor, and integrity.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">👁️</div>
              <h2>Our Vision</h2>
              <p>
                To create a progressive and united Maunas Kshatriya community that honors 
                its glorious past while embracing modern development, ensuring every member 
                has access to opportunities for growth and contributing meaningfully to 
                society at large.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="history-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Heritage</h2>
            <div className="underline"></div>
          </div>
          <div className="history-content">
            <div className="history-text">
              <h3>The Legacy of Maunas Kshatriyas</h3>
              <p>
                The Maunas Kshatriya community has a proud and distinguished history dating 
                back centuries. Known for their valor, administrative skills, and dedication 
                to protecting dharma, the Maunas Kshatriyas have played significant roles in 
                various kingdoms and regions throughout Indian history.
              </p>
              <p>
                Our ancestors were renowned warriors, administrators, and protectors of their 
                people. They upheld the highest standards of honor, duty, and service. The 
                Maunas Kshatriya community has contributed significantly to the cultural and 
                social fabric of Rajasthan and beyond.
              </p>
              <p>
                Today, while we honor these traditions, our community has evolved to embrace 
                modern education, business, and various professional fields, continuing our 
                legacy of excellence in new ways.
              </p>
            </div>
            <div className="history-image">
              <div className="image-placeholder">
                <span>🏛️</span>
                <p>Centuries of Heritage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <div className="underline"></div>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">⚔️</div>
              <h3>Courage</h3>
              <p>Facing challenges with bravery and determination</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Unity</h3>
              <p>Standing together as one strong community</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💎</div>
              <h3>Integrity</h3>
              <p>Upholding honesty and moral principles</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎓</div>
              <h3>Progress</h3>
              <p>Embracing education and modern development</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🙏</div>
              <h3>Tradition</h3>
              <p>Preserving our cultural heritage and customs</p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Service</h3>
              <p>Serving our community and society</p>
            </div>
          </div>
        </div>
      </section>

      {/* President Message */}
      <section className="president-message">
        <div className="container">
          <div className="section-header">
            <h2>President's Message</h2>
            <div className="underline"></div>
          </div>
          <div className="message-content">
            <div className="president-image">
              <div className="image-placeholder">
                <span>👤</span>
              </div>
              <h3>President Name</h3>
              <p>National President</p>
            </div>
            <div className="message-text">
              <p className="quote-mark">"</p>
              <p>
                Dear Members and Well-wishers,
              </p>
              <p>
                It is with great pride and humility that I address you as the President of 
                Kshatriya Maunas Parivar. Our organization stands as a testament to the 
                enduring spirit of our community, built on centuries of tradition, valor, 
                and dedication to dharma.
              </p>
              <p>
                In these modern times, while we honor our glorious past, we must also embrace 
                progress and unity. Our mission is to ensure that every member of our community 
                has access to opportunities for growth, education, and prosperity. Together, we 
                can preserve our heritage while building a brighter future for generations to come.
              </p>
              <p>
                I invite each of you to actively participate in our initiatives, events, and 
                programs. Let us work hand in hand to strengthen our bonds, support one another, 
                and make our community a beacon of excellence and tradition.
              </p>
              <p className="signature">With warm regards,<br/><strong>President Name</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="achievements-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Impact</h2>
            <div className="underline"></div>
          </div>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-number">5000+</div>
              <div className="achievement-label">Active Members</div>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">50+</div>
              <div className="achievement-label">Events Organized</div>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">200+</div>
              <div className="achievement-label">Scholarships Awarded</div>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">15+</div>
              <div className="achievement-label">Cities Connected</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
