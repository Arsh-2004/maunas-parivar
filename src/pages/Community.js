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
  const [selectedUpadhi, setSelectedUpadhi] = useState(null); // for filtering by honorary title
  const [selectedPrakosth, setSelectedPrakosth] = useState(null); // for filtering by prakosth
  const [showPrakosth, setShowPrakosth] = useState(false); // collapsible prakosth section
  const [showUpadhi, setShowUpadhi] = useState(false); // collapsible upadhi section
  const [showMembers, setShowMembers] = useState(false); // collapsible members section

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
    { id: 'buddhijivi', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Intellectual Cell' : 'बुद्धिजीवी प्रकोष्ठ', icon: '🧘' },
    { id: 'manav-seva', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Human Service Cell' : 'मानव सेवा प्रकोष्ठ', icon: '🤝' },
    { id: 'chikitsa', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Medical Cell' : 'चिकित्सा प्रकोष्ठ', icon: '⚕️' },
    { id: 'vidhi', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Legal Cell' : 'विधि प्रकोष्ठ', icon: '⚖️' },
    { id: 'vyapar', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Business Cell' : 'व्यापार प्रकोष्ठ', icon: '💼' },
    { id: 'kisaan', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Farmer Cell' : 'किसान प्रकोष्ठ', icon: '🚜' },
    { id: 'khel', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Sports & Military Cell' : 'खेल एवं सैनिक प्रकोष्ठ', icon: '⛹️' },
    { id: 'yuva', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Youth Cell' : 'युवा प्रकोष्ठ', icon: '👨‍💼' },
    { id: 'mahila', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Women Cell' : 'महिला प्रकोष्ठ', icon: '👩' },
    { id: 'veerangana', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Brave Women Cell' : 'वीरांगना प्रकोष्ठ', icon: '👩‍💼' },
  ];

  const upadhiRankings = [
    { name: language === 'en' ? 'Dr. Rajesh Sharma' : 'डॉ. राजेश शर्मा', honoraryTitle: 'मौनस शिरोमणि', icon: '🎓' },
    { name: language === 'en' ? 'Col. Vikram Singh' : 'कर्नल विक्रम सिंह', honoraryTitle: 'मौनस कुबेर', icon: '⭐' },
    { name: language === 'en' ? 'Advocate Anil Kumar' : 'अधिवक्ता अनिल कुमार', honoraryTitle: 'मौनस रत्न', icon: '⚖️' },
    { name: language === 'en' ? 'Prof. Suresh Kumar' : 'प्रो. सुरेश कुमार', honoraryTitle: 'मौनस कुलभूषण', icon: '👨‍🎓' },
    { name: language === 'en' ? 'Sri Mahendra Chaudhary' : 'श्री महेंद्र चौधरी', honoraryTitle: 'मौनस कुलदीपक', icon: '💼' },
    { name: language === 'en' ? 'Dr. Pradeep Singh' : 'डॉ. प्रदीप सिंह', honoraryTitle: 'मौनस नायक', icon: '⚕️' },
  ];

  // Placeholder members for each honorary title
  const placeholderMembers = [
    {
      _id: 'placeholder-1',
      fullName: language === 'en' ? 'Dr. Rajesh Sharma' : 'डॉ. राजेश शर्मा',
      city: language === 'en' ? 'Varanasi' : 'वाराणसी',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'Professor' : 'प्रोफेसर',
      education: 'post-graduate',
      membershipTier: 'gold',
      honoraryTitle: 'मौनस शिरोमणि',
      photoPath: null,
      registeredAt: new Date('2024-01-15')
    },
    {
      _id: 'placeholder-2',
      fullName: language === 'en' ? 'Col. Vikram Singh' : 'कर्नल विक्रम सिंह',
      city: language === 'en' ? 'Delhi' : 'दिल्ली',
      state: language === 'en' ? 'Delhi' : 'दिल्ली',
      occupation: language === 'en' ? 'Military Officer (Retd.)' : 'सैन्य अधिकारी (सेवानिवृत्त)',
      education: 'graduate',
      membershipTier: 'diamond',
      honoraryTitle: 'मौनस कुबेर',
      photoPath: null,
      registeredAt: new Date('2023-11-20')
    },
    {
      _id: 'placeholder-3',
      fullName: language === 'en' ? 'Advocate Anil Kumar' : 'अधिवक्ता अनिल कुमार',
      city: language === 'en' ? 'Lucknow' : 'लखनऊ',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'Advocate' : 'अधिवक्ता',
      education: 'post-graduate',
      membershipTier: 'gold',
      honoraryTitle: 'मौनस रत्न',
      photoPath: null,
      registeredAt: new Date('2024-02-10')
    },
    {
      _id: 'placeholder-4',
      fullName: language === 'en' ? 'Prof. Suresh Kumar' : 'प्रो. सुरेश कुमार',
      city: language === 'en' ? 'Kanpur' : 'कानपुर',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'University Professor' : 'विश्वविद्यालय प्रोफेसर',
      education: 'post-graduate',
      membershipTier: 'gold',
      honoraryTitle: 'मौनस कुलभूषण',
      photoPath: null,
      registeredAt: new Date('2024-03-05')
    },
    {
      _id: 'placeholder-5',
      fullName: language === 'en' ? 'Sri Mahendra Chaudhary' : 'श्री महेंद्र चौधरी',
      city: language === 'en' ? 'Mumbai' : 'मुंबई',
      state: language === 'en' ? 'Maharashtra' : 'महाराष्ट्र',
      occupation: language === 'en' ? 'Business Owner' : 'व्यवसायी',
      education: 'graduate',
      membershipTier: 'diamond',
      honoraryTitle: 'मौनस कुलदीपक',
      photoPath: null,
      registeredAt: new Date('2023-12-18')
    },
    {
      _id: 'placeholder-6',
      fullName: language === 'en' ? 'Dr. Pradeep Singh' : 'डॉ. प्रदीप सिंह',
      city: language === 'en' ? 'Patna' : 'पटना',
      state: language === 'en' ? 'Bihar' : 'बिहार',
      occupation: language === 'en' ? 'Medical Doctor' : 'चिकित्सक',
      education: 'post-graduate',
      membershipTier: 'gold',
      honoraryTitle: 'मौनस नायक',
      photoPath: null,
      registeredAt: new Date('2024-01-25')
    },
    // Placeholder members for prakosths
    {
      _id: 'prakosth-1',
      fullName: language === 'en' ? 'Prof. Ramesh Pandey' : 'प्रो. रमेश पांडेय',
      city: language === 'en' ? 'Banaras' : 'बनारस',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'Professor' : 'प्रोफेसर',
      education: 'post-graduate',
      membershipTier: 'silver',
      prakosth: 'बुद्धिजीवी प्रकोष्ठ',
      photoPath: null,
      registeredAt: new Date('2024-02-01')
    },
    {
      _id: 'prakosth-2',
      fullName: language === 'en' ? 'Smt. Kavita Devi' : 'श्रीमती कविता देवी',
      city: language === 'en' ? 'Ayodhya' : 'अयोध्या',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'Social Worker' : 'समाजसेवी',
      education: 'graduate',
      membershipTier: 'gold',
      prakosth: 'मानव सेवा प्रकोष्ठ',
      photoPath: null,
      registeredAt: new Date('2023-12-15')
    },
    {
      _id: 'prakosth-3',
      fullName: language === 'en' ? 'Dr. Anita Verma' : 'डॉ. अनीता वर्मा',
      city: language === 'en' ? 'Gorakhpur' : 'गोरखपुर',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'Surgeon' : 'शल्य चिकित्सक',
      education: 'post-graduate',
      membershipTier: 'diamond',
      prakosth: 'चिकित्सा प्रकोष्ठ',
      photoPath: null,
      registeredAt: new Date('2024-01-10')
    },
    {
      _id: 'prakosth-4',
      fullName: language === 'en' ? 'Adv. Rajendra Singh' : 'अधि. राजेंद्र सिंह',
      city: language === 'en' ? 'Prayagraj' : 'प्रयागराज',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'High Court Lawyer' : 'उच्च न्यायालय वकील',
      education: 'post-graduate',
      membershipTier: 'gold',
      prakosth: 'विधि प्रकोष्ठ',
      photoPath: null,
      registeredAt: new Date('2023-11-25')
    },
    {
      _id: 'prakosth-5',
      fullName: language === 'en' ? 'Shri Dinesh Kumar' : 'श्री दिनेश कुमार',
      city: language === 'en' ? 'Indore' : 'इंदौर',
      state: language === 'en' ? 'Madhya Pradesh' : 'मध्य प्रदेश',
      occupation: language === 'en' ? 'Businessman' : 'व्यवसायी',
      education: 'graduate',
      membershipTier: 'diamond',
      prakosth: 'व्यापार प्रकोष्ठ',
      photoPath: null,
      registeredAt: new Date('2024-03-01')
    },
    {
      _id: 'prakosth-khel-1',
      fullName: language === 'en' ? 'Shri Yajuvendra Singh Ji' : 'श्री यजुवेंद्र सिंह जी',
      city: language === 'en' ? 'Gajadharppur' : 'गजाधरपुर',
      state: language === 'en' ? 'Bhadohi' : 'भदोही',
      occupation: language === 'en' ? 'Sports & Military Cell Member' : 'खेल एवं सैनिक प्रकोष्ठ सदस्य',
      membershipTier: 'silver',
      prakosth: 'खेल एवं सैनिक प्रकोष्ठ',
      photoPath: '/assets/श्री यजुवेंद्र सिंह जी.jpeg',
      registeredAt: new Date('2026-02-19')
    }
  ];

  // Combine API members with placeholder members
  const allMembers = [...members, ...placeholderMembers];

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

  // Members with selected honorary title for upadhi section
  const upadhiMembers = selectedUpadhi 
    ? allMembers.filter(member => member.honoraryTitle === selectedUpadhi)
    : [];

  // Members with selected prakosth for prakosth section
  const prakosthMembers = selectedPrakosth 
    ? allMembers.filter(member => member.prakosth === selectedPrakosth)
    : [];

  // Regular members (without prakosth or honorary titles) with tier filtering for members section
  const filteredMembers = allMembers.filter(member => {
    // Exclude members with prakosth or honorary titles
    if (member.prakosth || member.honoraryTitle) return false;
    // Apply tier filter
    return filter === 'all' || member.membershipTier === filter;
  });

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
          <div className="section-header" style={{ cursor: 'pointer' }} onClick={() => setShowPrakosth(!showPrakosth)}>
            <h2>
              {language === 'en' ? 'Our Cells' : 'हमारा प्रकोष्ठ'}
              <span style={{ marginLeft: '10px', fontSize: '1.5rem' }}>{showPrakosth ? '▼' : '▶'}</span>
            </h2>
            <div className="underline"></div>
          </div>
          {showPrakosth && (
          <>
          <div className="team-grid">
            {prakosths.map((prakosth, index) => (
              <div 
                key={index} 
                className={`team-member-card ${selectedPrakosth === prakosth.title ? 'active' : ''}`}
                onClick={() => {
                  if (selectedPrakosth === prakosth.title) {
                    setSelectedPrakosth(null);
                  } else {
                    setSelectedPrakosth(prakosth.title);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="member-image">
                  <div className="image-placeholder">{prakosth.icon}</div>
                </div>
                <div className="member-info">
                  <p className="member-position">{prakosth.title}</p>
                </div>
              </div>
            ))}
          </div>
          {selectedPrakosth && (
            <>
            <div className="filter-info" style={{ textAlign: 'center', marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                {language === 'en' ? 'Members of: ' : 'सदस्य: '} <strong>{selectedPrakosth}</strong>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedPrakosth(null); }} 
                  style={{ marginLeft: '10px', padding: '5px 15px', cursor: 'pointer', borderRadius: '5px', border: 'none', background: '#ff6b35', color: 'white' }}
                >
                  {language === 'en' ? 'Close' : 'बंद करें'}
                </button>
              </p>
            </div>
            <div className="membership-cards-grid" style={{ marginTop: '30px' }}>
              {prakosthMembers.length === 0 ? (
                <p className="no-members" style={{ gridColumn: '1 / -1' }}>{language === 'en' ? 'No members found in this cell' : 'इस प्रकोष्ठ में कोई सदस्य नहीं मिला'}</p>
              ) : (
                prakosthMembers.map((member) => (
                  <div 
                    key={member._id} 
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
                      padding: '18px 18px 20px',
                      textAlign: 'center',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                  >
                    {member.photoPath ? (
                      <img 
                        src={member.photoPath} 
                        alt={member.fullName}
                        style={{
                          width: '100%',
                          height: '350px',
                          objectFit: 'cover',
                          objectPosition: 'center center',
                          borderRadius: '12px',
                          border: '3px solid #FF6B35',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '220px', borderRadius: '12px',
                        border: '3px solid #FF6B35',
                        background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '4rem'
                      }}>👤</div>
                    )}
                    <div style={{ paddingTop: '14px' }}>
                      <h3 style={{ margin: '0 0 5px', fontSize: '1.05rem', color: '#222', fontWeight: 700 }}>{member.fullName}</h3>
                      <p style={{ margin: 0, fontSize: '0.92rem', color: '#FF6B35', fontWeight: 600 }}>{member.city}, {member.state}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            </>
          )}
          </>
          )}
        </div>
      </section>

      {/* Upadhidhaarak (Titles & Rankings) Section */}
      <section className="upadhi-section">
        <div className="container">
          <div className="section-header" style={{ cursor: 'pointer' }} onClick={() => setShowUpadhi(!showUpadhi)}>
            <h2>
              {language === 'en' ? 'Upadhidhaarak' : 'उपाधिधारक'}
              <span style={{ marginLeft: '10px', fontSize: '1.5rem' }}>{showUpadhi ? '▼' : '▶'}</span>
            </h2>
            <div className="underline"></div>
          </div>
          {showUpadhi && (
          <>
          <div className="upadhi-grid">
            {upadhiRankings.map((member, index) => (
              <div 
                key={index} 
                className={`upadhi-card ${selectedUpadhi === member.honoraryTitle ? 'active' : ''}`}
                onClick={() => {
                  if (selectedUpadhi === member.honoraryTitle) {
                    setSelectedUpadhi(null); // deselect if clicking the same one
                  } else {
                    setSelectedUpadhi(member.honoraryTitle);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="upadhi-icon">{member.icon}</div>
                <div className="upadhi-info">
                  <h3>{member.name}</h3>
                  <p className="honorary-title">{member.honoraryTitle}</p>
                </div>
              </div>
            ))}
          </div>
          {selectedUpadhi && (
            <>
            <div className="filter-info" style={{ textAlign: 'center', marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                {language === 'en' ? 'Members with: ' : 'सदस्य: '} <strong>{selectedUpadhi}</strong>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedUpadhi(null); }} 
                  style={{ marginLeft: '10px', padding: '5px 15px', cursor: 'pointer', borderRadius: '5px', border: 'none', background: '#ff6b35', color: 'white' }}
                >
                  {language === 'en' ? 'Close' : 'बंद करें'}
                </button>
              </p>
            </div>
            <div className="membership-cards-grid" style={{ marginTop: '30px' }}>
              {upadhiMembers.length === 0 ? (
                <p className="no-members" style={{ gridColumn: '1 / -1' }}>{language === 'en' ? 'No members found with this title' : 'इस उपाधि के साथ कोई सदस्य नहीं मिला'}</p>
              ) : (
                upadhiMembers.map((member) => (
                  <div 
                    key={member._id} 
                    className={`membership-card ${member.membershipTier || 'silver'}`}
                    style={{ borderColor: getTierColor(member.membershipTier || 'silver') }}
                  >
                    <div className="tier-badge" style={{ background: getTierColor(member.membershipTier || 'silver') }}>
                      {getTierIcon(member.membershipTier || 'silver')} {(member.membershipTier || 'silver').toUpperCase()}
                    </div>
                    
                    {member.photoPath ? (
                      <img 
                        src={member.photoPath} 
                        alt={member.fullName}
                        className="member-photo"
                      />
                    ) : (
                      <div className="member-photo-placeholder">
                        <span style={{ fontSize: '4rem' }}>👤</span>
                      </div>
                    )}
                    
                    {member.honoraryTitle && (
                      <div className="member-honorary-badge">
                        {member.honoraryTitle}
                      </div>
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
                ))
              )}
            </div>
            </>
          )}
          </>
          )}
        </div>
      </section>

      {/* Members Directory */}
      <section className="members-section">
        <div className="container">
          <div className="section-header" style={{ cursor: 'pointer' }} onClick={() => setShowMembers(!showMembers)}>
            <h2>
              {language === 'en' ? 'Our Members' : 'हमारे सदस्य'}
              <span style={{ marginLeft: '10px', fontSize: '1.5rem' }}>{showMembers ? '▼' : '▶'}</span>
            </h2>
            <div className="underline"></div>
          </div>

          {showMembers && (
          <>
          <div className="tier-filters">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              {language === 'en' ? 'Members' : 'सदस्य'}
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
                  
                  {member.photoPath ? (
                    <img 
                      src={member.photoPath} 
                      alt={member.fullName}
                      className="member-photo"
                    />
                  ) : (
                    <div className="member-photo-placeholder">
                      <span style={{ fontSize: '4rem' }}>👤</span>
                    </div>
                  )}
                  
                  {member.honoraryTitle && (
                    <div className="member-honorary-badge">
                      {member.honoraryTitle}
                    </div>
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
          </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Community;
