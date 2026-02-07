import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

const Home = () => {
  const { language } = useLanguage();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <div className="hero-emblem">
                <img
                  src="/assets/ram.png"
                  alt="भगवान श्री राम"
                  className="hero-emblem-image"
                  loading="lazy"
                />
              </div>
              <h1 className="hero-title">{language === 'en' ? 'Welcome to Kshatriya Maunas Parivar' : 'क्षत्रिय मौनस परिवार में आपका स्वागत है'}</h1>
              <p className="hero-subtitle">
                {language === 'en' ? 'Preserve Our Heritage | Empower Our Community | Build Our Future' : 'अपने विरासत को संरक्षित करें | अपने परिवार को सशक्त बनाएं | अपना भविष्य उज्ज्वल बनाएं'}
              </p>
              <div className="hero-buttons">
                <Link to="/membership" className="btn btn-primary">{language === 'en' ? 'Join Our Community' : 'अपने वंश से जुड़ें'}</Link>
                <Link to="/about" className="btn btn-secondary">{language === 'en' ? 'Learn More' : 'अधिक जानें'}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'About Kshatriya Maunas Parivar' : 'क्षत्रिय मौनस परिवार के संबंध में'}</h2>
            <div className="underline"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p>
                {language === 'en' 
                  ? 'Kshatriya Maunas Parivar is dedicated to preserving the rich heritage and traditions of the Kshatriya community. We are committed to fostering unity, providing support, and empowering our members through various social, cultural, and educational initiatives.'
                  : 'क्षत्रिय मौनस परिवार, क्षत्रिय वंश की समृद्ध विरासत और परंपराओं को संरक्षित करने के लिए समर्पित है। हम विभिन्न सामाजिक, सांस्कृतिक और शैक्षिक क्रियाकलापों के माध्यम से एकता को बढ़ावा देने, सहायता प्रदान करने और अपने सदस्यों को सशक्त बनाने के लिए प्रतिबद्ध हैं।'
                }
              </p>
              <p>
                {language === 'en'
                  ? 'Our mission is to build a strong network of Kshatriyas working together for the welfare of our community, while honoring our ancestors and maintaining our values of courage, honor, and integrity.'
                  : 'हमारा उद्देश्य क्षत्रियों का एक मजबूत संगठन बनाना है जो अपने वंश के कल्याण के लिए एक साथ काम करें, तथा अपने पूर्वजों का सम्मान करें और साहस, सम्मान एवं ईमानदारी से अपने मूल्यों को बनाए रखें।'
                }
              </p>
              <Link to="/about" className="read-more">{language === 'en' ? 'Read More →' : 'अधिक पढ़ें →'}</Link>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <span>🏰</span>
                <p>{language === 'en' ? 'Heritage and Tradition' : 'विरासत और परंपरा'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="objectives-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Objectives' : 'हमारे उद्देश्य'}</h2>
            <div className="underline"></div>
          </div>
          <div className="objectives-grid">
            <div className="objective-card">
              <div className="icon">🤝</div>
              <h3>{language === 'en' ? 'Social Welfare' : 'सामाजिक कल्याण'}</h3>
              <p>{language === 'en' ? 'Promote social harmony and provide assistance to needy members' : 'सामाजिक सद्भावना को बढ़ावा देना और जरूरतमंद सदस्यों को सहायता प्रदान करना'}</p>
            </div>
            <div className="objective-card">
              <div className="icon">📚</div>
              <h3>{language === 'en' ? 'Education & Training' : 'शिक्षा और प्रशिक्षण'}</h3>
              <p>{language === 'en' ? 'Support educational initiatives and skill development programs' : 'शैक्षिक और कौशल विकास कार्यक्रमों का समर्थन करना'}</p>
            </div>
            <div className="objective-card">
              <div className="icon">🎭</div>
              <h3>{language === 'en' ? 'Cultural Heritage' : 'सांस्कृतिक विरासत'}</h3>
              <p>{language === 'en' ? 'Preserve and promote our rich cultural traditions and values' : 'हमारी समृद्ध सांस्कृतिक परंपराओं और मूल्यों को संरक्षित और प्रचारित करना'}</p>
            </div>
            <div className="objective-card">
              <div className="icon">💪</div>
              <h3>{language === 'en' ? 'Community Empowerment' : 'सामुदायिक सशक्तिकरण'}</h3>
              <p>{language === 'en' ? 'Empower members through networking and collaborative opportunities' : 'आपसी भाईचारा एवं परस्पर सहयोग के माध्यम से सदस्यों को सशक्त बनाना'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="activities-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Recent Activities' : 'हाल की गतिविधियां'}</h2>
            <div className="underline"></div>
          </div>
          <div className="activities-grid">
            <div className="activity-card">
              <div className="activity-image">
                <div className="image-placeholder">📅</div>
              </div>
              <div className="activity-content">
                <h3>{language === 'en' ? 'Community Gathering' : 'सामुदायिक समारोह'}</h3>
                <p className="date">{language === 'en' ? 'November 15, 2024' : '15 नवंबर, 2024'}</p>
                <p>{language === 'en' ? 'Our annual community gathering was successfully organized with participation from over 500 members.' : '500 से अधिक सदस्यों की भागीदारी के साथ हमारा वार्षिक सामुदायिक समारोह सफलतापूर्वक आयोजित किया गया।'}</p>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-image">
                <div className="image-placeholder">🎓</div>
              </div>
              <div className="activity-content">
                <h3>{language === 'en' ? 'Award Distribution' : 'मेधावी सम्मान'}</h3>
                <p className="date">{language === 'en' ? 'October 20, 2024' : '20 अक्टूबर, 2024'}</p>
                <p>{language === 'en' ? 'Awards were distributed to 50 meritorious students from our community.' : 'हमारे समुदाय से 50 मेधावी छात्रों को पुरस्कार वितरित किए गए।'}</p>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-image">
                <div className="image-placeholder">🎉</div>
              </div>
              <div className="activity-content">
                <h3>{language === 'en' ? 'Cultural Festival' : 'सांस्कृतिक समारोह'}</h3>
                <p className="date">{language === 'en' ? 'September 10, 2024' : '10 सितंबर, 2024'}</p>
                <p>{language === 'en' ? 'A celebration of our heritage with traditional performances, exhibitions, and community bonding.' : 'पारंपरिक प्रदर्शन, प्रदर्शनियों और सामुदायिक बंधन के साथ हमारी विरासत का उत्सव।'}</p>
              </div>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: '30px' }}>
            <Link to="/events" className="btn btn-primary">{language === 'en' ? 'View All Events' : 'सभी घटनाएं देखें'}</Link>
          </div>
        </div>
      </section>

      {/* Management Team Preview */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Leadership' : 'हमारी नेतृत्व'}</h2>
            <div className="underline"></div>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="/assets/national-president.jpeg" 
                  alt="National President"
                  className="team-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder" style={{display: 'none'}}>👤</div>
              </div>
              <h3 className="member-name">{language === 'en' ? 'Ravi Singh' : 'रवि सिंह'}</h3>
              <p className="designation">{language === 'en' ? 'National President' : 'राष्ट्रीय अध्यक्ष'}</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👤</div>
              </div>
              <h3>{language === 'en' ? 'Vice President' : 'उपाध्यक्ष'}</h3>
              <p className="designation">{language === 'en' ? 'National Vice President' : 'राष्ट्रीय उपाध्यक्ष'}</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👤</div>
              </div>
              <h3>{language === 'en' ? 'General Secretary' : 'महासचिव'}</h3>
              <p className="designation">{language === 'en' ? 'National Secretary' : 'राष्ट्रीय सचिव'}</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👤</div>
              </div>
              <h3>{language === 'en' ? 'Treasurer' : 'कोषाध्यक्ष'}</h3>
              <p className="designation">{language === 'en' ? 'National Treasurer' : 'राष्ट्रीय कोषाध्यक्ष'}</p>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: '30px' }}>
            <Link to="/community" className="btn btn-primary">{language === 'en' ? 'View All Members' : 'सभी सदस्यों को देखें'}</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{language === 'en' ? 'Join Our Community Today' : 'आज अपने वंश से जुड़ें'}</h2>
            <p>{language === 'en' ? 'Be part of your growing family and contribute to preserving our heritage' : 'अपने बढ़ते परिवार का अंग बनें और अपनी विरासत के संरक्षण में योगदान दें'}</p>
            <Link to="/membership" className="btn btn-large">{language === 'en' ? 'Register Now' : 'अभी पंजीकरण करें'}</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
