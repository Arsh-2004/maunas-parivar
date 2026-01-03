import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './MembershipCards.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MembershipCards = () => {
  const { language } = useLanguage();
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

  const filteredMembers = filter === 'all' 
    ? members 
    : members.filter(member => member.membershipTier === filter);

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

  if (loading) {
    return <div className="loading">{language === 'en' ? 'Loading members...' : 'सदस्य लोड हो रहे हैं...'}</div>;
  }

  return (
    <div className="membership-cards-page">
      <div className="cards-header">
        <h1>{language === 'en' ? 'Our Members' : 'हमारे सदस्य'}</h1>
        <p>{language === 'en' ? 'Meet our valued community members' : 'हमारे मूल्यवान समुदाय के सदस्यों से मिलें'}</p>
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

      {filteredMembers.length === 0 ? (
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
                  src={`${API_URL.replace('/api', '')}/uploads/${member.photoPath}`} 
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
