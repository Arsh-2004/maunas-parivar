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
                <img src="/assets/विरासत और परंपरा.jpeg" alt="विरासत और परंपरा" />
                <p>{language === 'en' ? 'Heritage and Tradition' : 'विरासत और परंपरा'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="activities-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Recent Activities' : 'हमारी गतिविधियां'}</h2>
            <div className="underline"></div>
          </div>
          <div className="activities-grid">
            <div className="activity-card">
              <div className="activity-image">
                <img src="/assets/img_1.jpeg" alt="Community Gathering" className="activity-img" />
              </div>
              <div className="activity-content">
                <h3>{language === 'en' ? 'Community Gathering' : 'सामुदायिक समारोह'}</h3>
                {/* <p className="date">{language === 'en' ? 'November 15, 2024' : '15 नवंबर, 2024'}</p> */}
                <p>{language === 'en' ? 'Organizing community celebrations for the participation of every member of your clan and for the development of the clan.' : 'अपने वंश के प्रत्येक सदस्यों की भागीदारी एवं कुल के विकास हेतु सामुदायिक समारोह का आयोजन करना।'}</p>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-image">
                <img src="/assets/img_2.jpeg" alt="Award Distribution" className="activity-img" />
              </div>
              <div className="activity-content">
                <h3>{language === 'en' ? 'Award Distribution' : 'मेधावी सम्मान'}</h3>
                {/* <p className="date">{language === 'en' ? 'October 20, 2024' : '20 अक्टूबर, 2024'}</p> */}
                <p>{language === 'en' ? 'To encourage meritorious students, prizes were distributed to 15 meritorious Kshatriya students by our community.' : 'मेधावी छात्रों के प्रोत्साहन हेतु हमारे समुदाय द्वारा 15 मेधावी क्षत्रिय छात्रों को पुरस्कार वितरित किया गया।'}</p>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-image">
                <img src="/assets/img_3.jpeg" alt="Our Programs" className="activity-img" />
              </div>
              <div className="activity-content">
                <h3>{language === 'en' ? 'Our programs' : 'हमारे कार्यक्रम'}</h3>
                {/* <p className="date">{language === 'en' ? 'September 10, 2024' : '10 सितंबर, 2024'}</p> */}
                <p>{language === 'en' ? 'To promote mutual brotherhood and cooperation, organize Monus Family Meet program at different places every month.' : 'आपसी भाईचारा एवं परस्पर सहयोग बढ़ाने हेतु प्रत्येक माह स्थान - स्थान पर मौनस परिवार मिलन कार्यक्रम का आयोजन करना।'}</p>
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
            <h6 className="section-label">{language === 'en' ? 'Main' : 'मुख्य'}</h6>
            <h2>{language === 'en' ? 'Management Committee' : 'प्रबंधन कमेटी'}</h2>
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
              <h3 className="member-name">{language === 'en' ? 'Shri Ravi Kumar Singh Ji' : 'श्री रवि कुमार सिंह जी'}</h3>
              <p className="designation">{language === 'en' ? 'Varanasi' : 'वाराणसी'}</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="/assets/national-vice-president.jpeg" 
                  alt="Vice President"
                  className="team-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder" style={{display: 'none'}}>👤</div>
              </div>
              <h3 className="member-name">{language === 'en' ? 'Dr J P Singh Ji' : 'डॉ जे पी सिंह जी'}</h3>
              <p className="designation">{language === 'en' ? 'Varanasi' : 'वाराणसी'}</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="/assets/National Secretary.jpeg" 
                  alt="General Secretary"
                  className="team-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder" style={{display: 'none'}}>👤</div>
              </div>
              <h3 className="member-name">{language === 'en' ? 'Dr Om Prakash Singh Ji' : 'डॉ ओम प्रकाश सिंह जी'}</h3>
              <p className="designation">{language === 'en' ? 'Varanasi' : 'वाराणसी'}</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="/assets/National Treasurer.jpeg" 
                  alt="Treasurer"
                  className="team-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder" style={{display: 'none'}}>👤</div>
              </div>
              <h3 className="member-name">{language === 'en' ? 'Shri Suresh Singh Ji' : 'श्री सुरेश सिंह जी'}</h3>
              <p className="designation">{language === 'en' ? 'Varanasi' : 'वाराणसी'}</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="/assets/rohit-singh.jpeg" 
                  alt="Rohit Singh"
                  className="team-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder" style={{display: 'none'}}>👤</div>
              </div>
              <h3 className="member-name">{language === 'en' ? 'Shri Rohit Singh Ji' : 'श्री रोहित सिंह जी'}</h3>
              <p className="designation">{language === 'en' ? 'Varanasi' : 'वाराणसी'}</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="/assets/shailendra.jpeg" 
                  alt="Shailendra Pratap Singh"
                  className="team-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder" style={{display: 'none'}}>👤</div>
              </div>
              <h3 className="member-name">{language === 'en' ? 'Shri Shailendra Pratap Singh Ji' : 'श्री शैलेन्द्र प्रताप सिंह जी'}</h3>
              <p className="designation">{language === 'en' ? 'Varanasi' : 'वाराणसी'}</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="/assets/ashishsingh.jpeg" 
                  alt="Ashish Singh"
                  className="team-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder" style={{display: 'none'}}>👤</div>
              </div>
              <h3 className="member-name">{language === 'en' ? 'Shri Ashish Singh Ji' : 'श्री आशीष सिंह जी'}</h3>
              <p className="designation">{language === 'en' ? 'Bhadohi' : 'भदोही'}</p>
            </div>
          
            
          </div>
          {/* <div className="text-center" style={{ marginTop: '30px' }}>
            <Link to="/community" className="btn btn-primary">{language === 'en' ? 'View All Members' : 'सभी सदस्यों को देखें'}</Link>
          </div> */}
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
