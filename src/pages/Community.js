import React from 'react';
import './Community.css';

const Community = () => {
  const managementTeam = [
    { name: 'Rajendra Singh', position: 'National President', icon: '👤' },
    { name: 'Mahendra Singh', position: 'National Vice President', icon: '👤' },
    { name: 'Vikram Singh', position: 'General Secretary', icon: '👤' },
    { name: 'Pradeep Singh', position: 'National Treasurer', icon: '👤' },
    { name: 'Suresh Kumar', position: 'Cultural Secretary', icon: '👤' },
    { name: 'Amit Singh', position: 'Youth Wing President', icon: '👤' },
  ];

  const members = [
    { name: 'Ramesh Singh', location: 'Jaipur', memberSince: '2023', icon: '👤' },
    { name: 'Sunil Kumar', location: 'Ajmer', memberSince: '2023', icon: '👤' },
    { name: 'Prakash Singh', location: 'Jodhpur', memberSince: '2024', icon: '👤' },
    { name: 'Dinesh Sharma', location: 'Udaipur', memberSince: '2024', icon: '👤' },
    { name: 'Rajesh Kumar', location: 'Kota', memberSince: '2023', icon: '👤' },
    { name: 'Anil Singh', location: 'Bikaner', memberSince: '2024', icon: '👤' },
    { name: 'Mohan Singh', location: 'Alwar', memberSince: '2023', icon: '👤' },
    { name: 'Vijay Kumar', location: 'Sikar', memberSince: '2024', icon: '👤' },
  ];

  return (
    <div className="community-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Our Community</h1>
          <p>United in Heritage | Strong Together</p>
        </div>
      </section>

      {/* Management Team */}
      <section className="management-section">
        <div className="container">
          <div className="section-header">
            <h2>Management Team</h2>
            <div className="underline"></div>
            <p className="section-subtitle">Leading our community with dedication and vision</p>
          </div>
          <div className="team-grid">
            {managementTeam.map((member, index) => (
              <div key={index} className="team-member-card">
                <div className="member-image">
                  <div className="image-placeholder">{member.icon}</div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="position">{member.position}</p>
                  <div className="member-contact">
                    <button className="contact-btn">📧 Contact</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number">5000+</div>
              <div className="stat-label">Total Members</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏙️</div>
              <div className="stat-number">15+</div>
              <div className="stat-label">Cities</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎉</div>
              <div className="stat-number">50+</div>
              <div className="stat-label">Events/Year</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🤝</div>
              <div className="stat-number">100%</div>
              <div className="stat-label">Commitment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="members-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Members</h2>
            <div className="underline"></div>
            <p className="section-subtitle">Proud members of Kshatriya Maunas Parivar</p>
          </div>
          <div className="members-grid">
            {members.map((member, index) => (
              <div key={index} className="member-card">
                <div className="member-avatar">
                  <div className="avatar-placeholder">{member.icon}</div>
                </div>
                <h4>{member.name}</h4>
                <p className="member-location">📍 {member.location}</p>
                <p className="member-since">Member since {member.memberSince}</p>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '40px' }}>
            <a href="#membership" className="btn btn-primary">View All Members</a>
          </div>
        </div>
      </section>

      {/* Join Community */}
      <section className="join-section">
        <div className="container">
          <div className="join-content">
            <h2>Become Part of Our Family</h2>
            <p>Join thousands of proud Maunas Kshatriyas in preserving our heritage and building our future</p>
            <div className="join-benefits">
              <div className="benefit">
                <span className="benefit-icon">✓</span>
                <span>Connect with community members</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">✓</span>
                <span>Access to exclusive events</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">✓</span>
                <span>Networking opportunities</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">✓</span>
                <span>Community support & welfare</span>
              </div>
            </div>
            <a href="#membership" className="btn btn-large">Register Now</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
