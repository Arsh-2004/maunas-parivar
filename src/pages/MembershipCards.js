import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './MembershipCards.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const MembershipCards = () => {
  const { language } = useLanguage();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const filteredMembers = members;

  if (loading) {
    return <div className="loading">{language === 'en' ? 'Loading members...' : 'सदस्य लोड हो रहे हैं...'}</div>;
  }

  return (
    <div className="membership-cards-page">
      <div className="cards-header">
        <h1>{language === 'en' ? 'Our Members' : 'हमारे सदस्य'}</h1>
        <p>{language === 'en' ? 'Meet our valued community members' : 'हमारे मूल्यवान समुदाय के सदस्यों से मिलें'}</p>
      </div>

      {filteredMembers.length === 0 ? (
        <p className="no-members">{language === 'en' ? 'No members found' : 'कोई सदस्य नहीं मिला'}</p>
      ) : (
        <div className="membership-cards-grid">
          {filteredMembers.map((member) => (
            <div 
              key={member._id} 
              className="membership-card"
            >
              <div className="tier-badge">
                ✅ MEMBER
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
  );
};

export default MembershipCards;
