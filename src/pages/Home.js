import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">क्षत्रिय मौना परिवार में आपका स्वागत है</h1>
              <p className="hero-subtitle">
                हमारी विरासत को संरक्षित करें | हमारे समुदाय को सशक्त बनाएं | हमारा भविष्य बनाएं
              </p>
              <div className="hero-buttons">
                <Link to="/membership" className="btn btn-primary">हमारे समुदाय से जुड़ें</Link>
                <Link to="/about" className="btn btn-secondary">अधिक जानें</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <h2>क्षत्रिय मौना परिवार के बारे में</h2>
            <div className="underline"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p>
                क्षत्रिय मौना परिवार मौना क्षत्रिय समुदाय की समृद्ध विरासत और परंपराओं को संरक्षित करने के लिए समर्पित है। हम विभिन्न सामाजिक, सांस्कृतिक और शैक्षिक पहलों के माध्यम से एकता को बढ़ावा देने, सहायता प्रदान करने और अपने सदस्यों को सशक्त बनाने के लिए प्रतिबद्ध हैं।
              </p>
              <p>
                हमारा मिशन मौना क्षत्रियों का एक मजबूत नेटवर्क बनाना है जो अपने समुदाय के कल्याण के लिए एक साथ काम करते हैं, जबकि अपने पूर्वजों का सम्मान करते हैं और साहस, सम्मान और ईमानदारी के अपने मूल्यों को बनाए रखते हैं।
              </p>
              <Link to="/about" className="read-more">अधिक पढ़ें →</Link>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <span>🏰</span>
                <p>विरासत और परंपरा</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="objectives-section">
        <div className="container">
          <div className="section-header">
            <h2>हमारे उद्देश्य</h2>
            <div className="underline"></div>
          </div>
          <div className="objectives-grid">
            <div className="objective-card">
              <div className="icon">🤝</div>
              <h3>सामाजिक कल्याण</h3>
              <p>सामाजिक सद्भावना को बढ़ावा देना और जरूरतमंद सदस्यों को सहायता प्रदान करना</p>
            </div>
            <div className="objective-card">
              <div className="icon">📚</div>
              <h3>शिक्षा और प्रशिक्षण</h3>
              <p>शैक्षिक पहलों और कौशल विकास कार्यक्रमों का समर्थन करना</p>
            </div>
            <div className="objective-card">
              <div className="icon">🎭</div>
              <h3>सांस्कृतिक विरासत</h3>
              <p>हमारी समृद्ध सांस्कृतिक परंपराओं और मूल्यों को संरक्षित और प्रचारित करना</p>
            </div>
            <div className="objective-card">
              <div className="icon">💪</div>
              <h3>सामुदायिक सशक्तिकरण</h3>
              <p>नेटवर्किंग और सहयोगी अवसरों के माध्यम से सदस्यों को सशक्त बनाना</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="activities-section">
        <div className="container">
          <div className="section-header">
            <h2>हाल की गतिविधियां</h2>
            <div className="underline"></div>
          </div>
          <div className="activities-grid">
            <div className="activity-card">
              <div className="activity-image">
                <div className="image-placeholder">📅</div>
              </div>
              <div className="activity-content">
                <h3>वार्षिक सामुदायिक समारोह</h3>
                <p className="date">15 नवंबर, 2024</p>
                <p>500 से अधिक सदस्यों की भागीदारी के साथ हमारा वार्षिक सामुदायिक समारोह सफलतापूर्वक आयोजित किया गया।</p>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-image">
                <div className="image-placeholder">🎓</div>
              </div>
              <div className="activity-content">
                <h3>छात्रवृत्ति वितरण</h3>
                <p className="date">20 अक्टूबर, 2024</p>
                <p>हमारे समुदाय से 50 मेधावी छात्रों को छात्रवृत्ति वितरित की गई।</p>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-image">
                <div className="image-placeholder">🎉</div>
              </div>
              <div className="activity-content">
                <h3>सांस्कृतिक समारोह</h3>
                <p className="date">10 सितंबर, 2024</p>
                <p>पारंपरिक प्रदर्शन, प्रदर्शनियों और सामुदायिक बंधन के साथ हमारी विरासत का उत्सव।</p>
              </div>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: '30px' }}>
            <Link to="/events" className="btn btn-primary">सभी घटनाएं देखें</Link>
          </div>
        </div>
      </section>

      {/* Management Team Preview */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>हमारी नेतृत्व</h2>
            <div className="underline"></div>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👤</div>
              </div>
              <h3>राष्ट्रीय अध्यक्ष</h3>
              <p className="designation">राष्ट्रीय अध्यक्ष</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👤</div>
              </div>
              <h3>उपाध्यक्ष</h3>
              <p className="designation">राष्ट्रीय उपाध्यक्ष</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👤</div>
              </div>
              <h3>महासचिव</h3>
              <p className="designation">राष्ट्रीय सचिव</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👤</div>
              </div>
              <h3>कोषाध्यक्ष</h3>
              <p className="designation">राष्ट्रीय कोषाध्यक्ष</p>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: '30px' }}>
            <Link to="/community" className="btn btn-primary">सभी सदस्यों को देखें</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>आज हमारे समुदाय से जुड़ें</h2>
            <p>हमारे बढ़ते परिवार का हिस्सा बनें और हमारी विरासत के संरक्षण में योगदान दें</p>
            <Link to="/membership" className="btn btn-large">अभी पंजीकरण करें</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
