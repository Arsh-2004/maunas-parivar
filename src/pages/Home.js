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
              <h1 className="hero-title">Welcome to Kshatriya Maunas Parivar</h1>
              <p className="hero-subtitle">
                Preserving Our Heritage | Empowering Our Community | Building Our Future
              </p>
              <div className="hero-buttons">
                <Link to="/membership" className="btn btn-primary">Join Our Community</Link>
                <Link to="/about" className="btn btn-secondary">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <h2>About Kshatriya Maunas Parivar</h2>
            <div className="underline"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p>
                Kshatriya Maunas Parivar is dedicated to preserving the rich heritage and 
                traditions of the Maunas Kshatriya community. We are committed to fostering 
                unity, providing support, and empowering our members through various social, 
                cultural, and educational initiatives.
              </p>
              <p>
                Our mission is to create a strong network of Maunas Kshatriyas who work 
                together for the betterment of our community while honoring our ancestors 
                and upholding our values of courage, honor, and integrity.
              </p>
              <Link to="/about" className="read-more">Read More →</Link>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <span>🏰</span>
                <p>Heritage & Tradition</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="objectives-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Objectives</h2>
            <div className="underline"></div>
          </div>
          <div className="objectives-grid">
            <div className="objective-card">
              <div className="icon">🤝</div>
              <h3>Social Welfare</h3>
              <p>Promoting social harmony and providing assistance to community members in need</p>
            </div>
            <div className="objective-card">
              <div className="icon">📚</div>
              <h3>Education & Training</h3>
              <p>Supporting educational initiatives and skill development programs</p>
            </div>
            <div className="objective-card">
              <div className="icon">🎭</div>
              <h3>Cultural Heritage</h3>
              <p>Preserving and promoting our rich cultural traditions and values</p>
            </div>
            <div className="objective-card">
              <div className="icon">💪</div>
              <h3>Community Empowerment</h3>
              <p>Empowering members through networking and collaborative opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="activities-section">
        <div className="container">
          <div className="section-header">
            <h2>Recent Activities</h2>
            <div className="underline"></div>
          </div>
          <div className="activities-grid">
            <div className="activity-card">
              <div className="activity-image">
                <div className="image-placeholder">📅</div>
              </div>
              <div className="activity-content">
                <h3>Annual Community Gathering</h3>
                <p className="date">November 15, 2024</p>
                <p>Successful organization of our annual community gathering with participation from over 500 members.</p>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-image">
                <div className="image-placeholder">🎓</div>
              </div>
              <div className="activity-content">
                <h3>Scholarship Distribution</h3>
                <p className="date">October 20, 2024</p>
                <p>Distributed scholarships to 50 meritorious students from our community.</p>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-image">
                <div className="image-placeholder">🎉</div>
              </div>
              <div className="activity-content">
                <h3>Cultural Festival</h3>
                <p className="date">September 10, 2024</p>
                <p>Celebrated our heritage with traditional performances, exhibitions, and community bonding.</p>
              </div>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: '30px' }}>
            <Link to="/events" className="btn btn-primary">View All Events</Link>
          </div>
        </div>
      </section>

      {/* Management Team Preview */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Leadership</h2>
            <div className="underline"></div>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👤</div>
              </div>
              <h3>President</h3>
              <p className="designation">National President</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👤</div>
              </div>
              <h3>Vice President</h3>
              <p className="designation">National Vice President</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👤</div>
              </div>
              <h3>General Secretary</h3>
              <p className="designation">National Secretary</p>
            </div>
            <div className="team-card">
              <div className="team-image">
                <div className="image-placeholder">👤</div>
              </div>
              <h3>Treasurer</h3>
              <p className="designation">National Treasurer</p>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: '30px' }}>
            <Link to="/community" className="btn btn-primary">View All Members</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Community Today</h2>
            <p>Be part of our growing family and contribute to the preservation of our heritage</p>
            <Link to="/membership" className="btn btn-large">Register Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
