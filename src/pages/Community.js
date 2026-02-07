import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import './Community.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Community = () => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, silver, gold, diamond

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      if (data.success) {
        // Filter only approved members
        const approvedMembers = data.users.filter(user => user.status === 'approved');
        setMembers(approvedMembers);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const prakosths = [
    { name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Youth Cell' : 'युवा प्रकोष्ठ', icon: '👨‍💼' },
    { name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Brave Women Cell' : 'वीरांगना प्रकोष्ठ', icon: '👩‍💼' },
    { name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Legal Cell' : 'विधि प्रकोष्ठ', icon: '⚖️' },
    { name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Medical Cell' : 'चिकित्सा प्रकोष्ठ', icon: '⚕️' },
    { name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Business Cell' : 'व्यापार प्रकोष्ठ', icon: '💼' },
    { name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Farmer Cell' : 'किसान प्रकोष्ठ', icon: '🚜' },
    { name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Sports & Military Cell' : 'खेल एवं सैनिक प्रकोष्ठ', icon: '⛹️' },
    { name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Human Service Cell' : 'मानव सेवा प्रकोष्ठ', icon: '🤝' },
    { name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Buddhist Cell' : 'बुद्धजीवी प्रकोष्ठ', icon: '🧘' },
    { name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Women Cell' : 'महिला प्रकोष्ठ', icon: '👩' },
  ];

  const upadhiRankings = [
    { name: language === 'en' ? 'Dr. Rajesh Sharma' : 'डॉ. राजेश शर्मा', honoraryTitle: 'मौनस शिरोमणि', title: language === 'en' ? 'Ph.D.' : 'पीएच.डी.', icon: '🎓' },
    { name: language === 'en' ? 'Col. Vikram Singh' : 'कर्नल विक्रम सिंह', honoraryTitle: 'मौनस कुबेर', title: language === 'en' ? 'Colonel' : 'कर्नल', icon: '⭐' },
    { name: language === 'en' ? 'Prof. Suresh Kumar' : 'प्रो. सुरेश कुमार', honoraryTitle: 'मौनस कुलभूषण', title: language === 'en' ? 'Professor' : 'प्रोफेसर', icon: '👨‍🎓' },
    { name: language === 'en' ? 'Sri Mahendra Chaudhary' : 'श्री महेंद्र चौधरी', honoraryTitle: 'मौनस कुलदीपक', title: language === 'en' ? 'Business Magnate' : 'व्यवसायी', icon: '💼' },
    { name: language === 'en' ? 'Dr. Pradeep Singh' : 'डॉ. प्रदीप सिंह', honoraryTitle: 'मौनस नायक', title: language === 'en' ? 'Medical Doctor' : 'चिकित्सक', icon: '⚕️' },
    { name: language === 'en' ? 'Advocate Anil Kumar' : 'अधिवक्ता अनिल कुमार', honoraryTitle: 'मौनस रत्न', title: language === 'en' ? 'Advocate' : 'अधिवक्ता', icon: '⚖️' },
  ];

  const getTierColor = (tier) => {
    switch(tier) {
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'diamond': return '#B9F2FF';
      default: return '#C0C0C0';
    }
  };

  const getTierIcon = (tier) => {
    switch(tier) {
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'diamond': return '💎';
      default: return '🥈';
    }
  };

  const filteredMembers = filter === 'all' 
    ? members 
    : members.filter(member => member.membershipTier === filter);

  return (
    <div className="community-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>{t('community.title')}</h1>
          <p>{t('community.subtitle')}</p>
        </div>
      </section>

      {/* Management Team - Hamara Prakosth */}
      <section className="management-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Cells' : 'हमारा प्रकोष्ठ'}</h2>
            <div className="underline"></div>
          </div>
          <div className="team-grid">
            {prakosths.map((prakosth, index) => (
              <div key={index} className="team-member-card">
                <div className="member-image">
                  <div className="image-placeholder">{prakosth.icon}</div>
                </div>
                <div className="member-info">
                  <h3>{prakosth.name}</h3>
                  <p className="member-position">{prakosth.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upadharak (Titles & Rankings) Section */}
      <section className="upadhi-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Upadharak' : 'उपाधारक'}</h2>
            <div className="underline"></div>
          </div>
          <div className="upadhi-grid">
            {upadhiRankings.map((member, index) => (
              <div key={index} className="upadhi-card">
                <div className="upadhi-icon">{member.icon}</div>
                <div className="upadhi-info">
                  <h3>{member.name}</h3>
                  <p className="honorary-title">{member.honoraryTitle}</p>
                  <p className="upadhi-title">{member.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Members Directory */}
      <section className="members-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Members' : 'हमारे सदस्य'}</h2>
            <div className="underline"></div>
          </div>

          <div className="tier-filters">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              {language === 'en' ? 'All Members' : 'सभी सदस्य'}
            </button>
            <button 
              className={filter === 'silver' ? 'active silver' : 'silver'}
              onClick={() => setFilter('silver')}
            >
              🥈 Silver
            </button>
            <button 
              className={filter === 'gold' ? 'active gold' : 'gold'}
              onClick={() => setFilter('gold')}
            >
              🥇 Gold
            </button>
            <button 
              className={filter === 'diamond' ? 'active diamond' : 'diamond'}
              onClick={() => setFilter('diamond')}
            >
              💎 Diamond
            </button>
          </div>

          {loading ? (
            <p className="loading">{language === 'en' ? 'Loading members...' : 'सदस्य लोड हो रहे हैं...'}</p>
          ) : filteredMembers.length === 0 ? (
            <p className="no-members">{language === 'en' ? 'No members found' : 'कोई सदस्य नहीं मिला'}</p>
          ) : (
            <div className="membership-cards-grid">
              {filteredMembers.map((member) => (
                <div 
                  key={member._id} 
                  className={`membership-card ${member.membershipTier || 'silver'}`}
                  style={{ borderColor: getTierColor(member.membershipTier || 'silver') }}
                >
                  <div className="tier-badge" style={{ background: getTierColor(member.membershipTier || 'silver') }}>
                    {getTierIcon(member.membershipTier || 'silver')} {(member.membershipTier || 'silver').toUpperCase()}
                  </div>
                  
                  {member.photoPath && (
                    <img 
                      src={member.photoPath} 
                      alt={member.fullName}
                      className="member-photo"
                    />
                  )}
                  
                  <div className="member-info">
                    <h3>{member.fullName}</h3>
                    <p className="member-city">📍 {member.city}, {member.state}</p>
                    <p className="member-occupation">💼 {member.occupation}</p>
                    {member.education && (
                      <p className="member-education">🎓 {member.education}</p>
                    )}
                  </div>
                  
                  <div className="member-footer">
                    <span>{language === 'en' ? 'Member since' : 'सदस्य बने'} {new Date(member.registeredAt).getFullYear()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Community;
