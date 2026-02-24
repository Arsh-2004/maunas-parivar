import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import './Community.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Community = () => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);
  const location = useLocation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, bronze, silver, gold, diamond
  const [selectedUpadhi, setSelectedUpadhi] = useState(null); // for filtering by honorary title
  const [selectedPrakosth, setSelectedPrakosth] = useState(null); // for filtering by prakosth
  const [activeSection, setActiveSection] = useState(''); // dropdown selected section

  // Read section from URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section) {
      setActiveSection(section);
      setSelectedPrakosth(null);
      setSelectedUpadhi(null);
    }
  }, [location.search]);

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
    { id: 'buddhijivi', name: language === 'en' ? 'Dr. Ram Sudhar Singh Ji' : 'डॉ राम सुधार सिंह जी', title: language === 'en' ? 'Intellectual Cell' : 'बुद्धिजीवी प्रकोष्ठ', icon: '🧘' },
    { id: 'manav-seva', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Human Service Cell' : 'मानव सेवा प्रकोष्ठ', icon: '🤝' },
    { id: 'chikitsa', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Medical Cell' : 'चिकित्सा प्रकोष्ठ', icon: '⚕️' },
    { id: 'vidhi', title: language === 'en' ? 'Legal Cell' : 'विधि प्रकोष्ठ', icon: '⚖️' },
    { id: 'vyapar', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Business Cell' : 'व्यापार प्रकोष्ठ', icon: '💼' },
    { id: 'kisaan', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Farmer Cell' : 'किसान प्रकोष्ठ', icon: '🚜' },
    { id: 'khel', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Sports & Military Cell' : 'खेल एवं सैनिक प्रकोष्ठ', icon: '⛹️' },
    { id: 'yuva', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Youth Cell' : 'युवा प्रकोष्ठ', icon: '👨‍💼' },
    { id: 'mahila', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Women Cell' : 'महिला प्रकोष्ठ', icon: '👩' },
    { id: 'veerangana', name: language === 'en' ? 'Placeholder' : 'नाम के लिए रखे', title: language === 'en' ? 'Brave Women Cell' : 'वीरांगना प्रकोष्ठ', icon: '👩‍💼' },
  ];

  const upadhiRankings = [
    { honoraryTitle: 'मौनस शिरोमणि' },
    { honoraryTitle: 'मौनस कुबेर' },
    { honoraryTitle: 'मौनस रत्न' },
    { honoraryTitle: 'मौनस कुलभूषण' },
    { honoraryTitle: 'मौनस कुलदीपक' },
    { honoraryTitle: 'मौनस नायक' },
  ];

  const getUpadhiIcon = (title) => {
    switch(title) {
      case 'मौनस शिरोमणि':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="60" height="60">
            <polygon points="4,52 14,18 26,36 32,10 38,36 50,18 60,52" fill="#FFD700" stroke="#FF8C00" strokeWidth="2"/>
            <rect x="4" y="52" width="56" height="8" rx="3" fill="#FF8C00"/>
            <circle cx="32" cy="10" r="4" fill="#FF6B35"/>
            <circle cx="14" cy="18" r="3" fill="#FF6B35"/>
            <circle cx="50" cy="18" r="3" fill="#FF6B35"/>
          </svg>
        );
      case 'मौनस कुबेर':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="60" height="60">
            <circle cx="32" cy="32" r="28" fill="#FFD700" stroke="#FF8C00" strokeWidth="2"/>
            <circle cx="32" cy="32" r="22" fill="none" stroke="#FF8C00" strokeWidth="1.5"/>
            <text x="32" y="42" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#FF8C00" fontFamily="Arial">₹</text>
          </svg>
        );
      case 'मौनस रत्न':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="60" height="60">
            <polygon points="32,4 56,22 48,58 16,58 8,22" fill="#B9F2FF" stroke="#00BFFF" strokeWidth="2"/>
            <polygon points="32,4 56,22 32,20 8,22" fill="#7adcf5" stroke="#00BFFF" strokeWidth="1"/>
            <line x1="32" y1="20" x2="16" y2="58" stroke="#00BFFF" strokeWidth="1" opacity="0.5"/>
            <line x1="32" y1="20" x2="48" y2="58" stroke="#00BFFF" strokeWidth="1" opacity="0.5"/>
            <line x1="32" y1="20" x2="32" y2="58" stroke="#00BFFF" strokeWidth="1" opacity="0.5"/>
          </svg>
        );
      case 'मौनस कुलभूषण':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="60" height="60">
            <polygon points="32,4 38,22 58,22 43,34 49,54 32,42 15,54 21,34 6,22 26,22" fill="#FFD700" stroke="#FF8C00" strokeWidth="2"/>
          </svg>
        );
      case 'मौनस कुलदीपक':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="60" height="60">
            <ellipse cx="32" cy="54" rx="16" ry="6" fill="#FF8C00"/>
            <path d="M32,6 C22,18 18,30 22,42 C25,50 39,50 42,42 C46,30 42,18 32,6Z" fill="#FF6B35"/>
            <path d="M32,14 C26,24 24,34 27,42 C29,47 35,47 37,42 C40,34 38,24 32,14Z" fill="#FFD700"/>
            <path d="M32,22 C29,29 28,35 30,40 C31,43 33,43 34,40 C36,35 35,29 32,22Z" fill="white" opacity="0.7"/>
          </svg>
        );
      case 'मौनस नायक':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="60" height="60">
            <path d="M32,4 L56,14 L56,34 C56,48 44,58 32,62 C20,58 8,48 8,34 L8,14 Z" fill="#FF6B35" stroke="#CC4400" strokeWidth="2"/>
            <path d="M32,16 L44,21 L44,34 C44,42 38,48 32,50 C26,48 20,42 20,34 L20,21 Z" fill="#FFD700"/>
            <line x1="32" y1="24" x2="32" y2="42" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
            <line x1="24" y1="32" x2="40" y2="32" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="60" height="60">
            <circle cx="32" cy="32" r="28" fill="#FF6B35"/>
          </svg>
        );
    }
  };

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
      fullName: language === 'en' ? 'Dr. Ram Sudhar Singh Ji' : 'डॉ राम सुधार सिंह जी',
      city: language === 'en' ? 'Varanasi' : 'वाराणसी',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'Intellectual Cell Member' : 'बुद्धिजीवी प्रकोष्ठ सदस्य',
      education: 'post-graduate',
      membershipTier: 'gold',
      prakosth: 'buddhijivi',
      photoPath: '/assets/ram-sudhar-singh.jpeg',
      registeredAt: new Date('2026-02-20')
    }, 
    {
      _id: 'prakosth-2',
      fullName: language === 'en' ? 'Dr. Jaydeep Singh Ji' : 'डॉ जयदीप सिंह जी',
      city: language === 'en' ? 'Guwahati' : 'गुवाहाटी',
      state: language === 'en' ? 'Assam' : 'आसाम',
      occupation: language === 'en' ? 'Intellectual Cell Member' : 'बुद्धिजीवी प्रकोष्ठ सदस्य',
      education: 'post-graduate',
      membershipTier: 'gold',
      prakosth: 'buddhijivi',
      photoPath: '/assets/डॉ जयदीप सिंह जी.jpeg',
      registeredAt: new Date('2026-02-20')
    }, 
    {
      _id: 'prakosth-manav-seva-1',
      fullName: language === 'en' ? 'Shri K K Singh Ji' : 'श्री के के सिंह जी',
      city: language === 'en' ? 'Sarbatkhani, Bhadohi' : 'सरबतखानी, भदोही',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'Human Service Cell Member' : 'मानव सेवा प्रकोष्ठ सदस्य',
      education: 'graduate',
      membershipTier: 'gold',
      prakosth: 'manav-seva',
      photoPath: '/assets/श्री के के सिंह जी.jpeg',
      registeredAt: new Date('2026-02-21')
    },
    {
      _id: 'prakosth-3',
      fullName: language === 'en' ? 'Dr. Anita Verma' : 'डॉ. अनीता वर्मा',
      city: language === 'en' ? 'Gorakhpur' : 'गोरखपुर',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'Surgeon' : 'शल्य चिकित्सक',
      education: 'post-graduate',
      membershipTier: 'diamond',
      prakosth: 'chikitsa',
      photoPath: null,
      registeredAt: new Date('2024-01-10')
    },
    {
      _id: 'prakosth-4',
      fullName: language === 'en' ? 'Shri Rajkumar Singh Ji' : 'श्री राजकुमार सिंह जी',
      city: language === 'en' ? 'Bithauli, Prayagraj' : 'बिठौली, प्रयागराज',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'Advocate' : 'एडवोकेट',
      education: 'post-graduate',
      membershipTier: 'gold',
      prakosth: 'vidhi',
      photoPath: '/assets/श्री राजकुमार सिंह जी.jpeg',
      registeredAt: new Date('2026-02-21')
    },
    {
      _id: 'prakosth-5',
      fullName: language === 'en' ? 'Shri Dinesh Kumar' : 'श्री दिनेश कुमार',
      city: language === 'en' ? 'Indore' : 'इंदौर',
      state: language === 'en' ? 'Madhya Pradesh' : 'मध्य प्रदेश',
      occupation: language === 'en' ? 'Businessman' : 'व्यवसायी',
      education: 'graduate',
      membershipTier: 'diamond',
      prakosth: 'vyapar',
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
      prakosth: 'khel',
      photoPath: '/assets/श्री यजुवेंद्र सिंह जी.jpeg',
      registeredAt: new Date('2026-02-19')
    }
  ];

  // Combine API members with placeholder members
  const allMembers = [...members, ...placeholderMembers];

  const getTierColor = (tier) => {
    switch(tier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'diamond': return '#B9F2FF';
      default: return '#C0C0C0';
    }
  };

  const getTierIcon = (tier) => {
    switch(tier) {
      case 'bronze': return '🥉';
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

      {/* Section Dropdown Selector */}
      <section className="community-dropdown-section">
        <div className="container">
          <div className="community-dropdown-wrapper">
            <select
              className="community-dropdown"
              value={activeSection}
              onChange={(e) => {
                setActiveSection(e.target.value);
                setSelectedPrakosth(null);
                setSelectedUpadhi(null);
              }}
            >
              <option value="">{language === 'en' ? '-- Select Section --' : '-- विभाग चुनें --'}</option>
              <option value="prakosth">{language === 'en' ? 'Our Cells (Hamara Prakosth)' : 'हमारा प्रकोष्ठ'}</option>
              <option value="upadhi">{language === 'en' ? 'Upadhidhaarak (Titles & Honours)' : 'उपाधिधारक'}</option>
              <option value="members">{language === 'en' ? 'Our Members' : 'हमारे सदस्य'}</option>
            </select>
          </div>
        </div>
      </section>

      {/* Management Team - Hamara Prakosth */}
      {activeSection === 'prakosth' && (
      <section className="management-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Cells' : 'हमारा प्रकोष्ठ'}</h2>
            <div className="underline"></div>
          </div>
          <div className="team-grid">
            {prakosths.map((prakosth, index) => (
              <div 
                key={index} 
                className={`team-member-card ${selectedPrakosth === prakosth.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedPrakosth(selectedPrakosth === prakosth.id ? null : prakosth.id);
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

          {/* Prakosth Members Modal */}
          {selectedPrakosth && (
            <div className="members-modal-overlay" onClick={() => setSelectedPrakosth(null)}>
              <div className="members-modal" onClick={(e) => e.stopPropagation()}>
                <div className="members-modal-header">
                  <h3>{prakosths.find(p => p.id === selectedPrakosth)?.title || selectedPrakosth}</h3>
                  <button className="members-modal-close" onClick={() => setSelectedPrakosth(null)}>✕</button>
                </div>
                <div className="members-modal-body">
                  {prakosthMembers.length === 0 ? (
                    <p className="no-members">{language === 'en' ? 'No members found in this cell' : 'इस प्रकोष्ठ में कोई सदस्य नहीं मिला'}</p>
                  ) : (
                    <div className="members-modal-grid">
                      {prakosthMembers.map((member) => (
                        <div key={member._id} className="members-modal-card">
                          {member.photoPath ? (
                            <img
                              src={member.photoPath}
                              alt={member.fullName}
                              className="members-modal-photo"
                            />
                          ) : (
                            <div className="members-modal-photo-placeholder">👤</div>
                          )}
                          <h4>{member.fullName}</h4>
                          <p>📍 {member.city}, {member.state}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      )}

      {/* Upadhidhaarak (Titles & Rankings) Section */}
      {activeSection === 'upadhi' && (
      <section className="upadhi-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Upadhidhaarak' : 'उपाधिधारक'}</h2>
            <div className="underline"></div>
          </div>
          <div className="upadhi-grid">
            {upadhiRankings.map((member, index) => (
              <div 
                key={index} 
                className={`upadhi-card ${selectedUpadhi === member.honoraryTitle ? 'active' : ''}`}
                onClick={() => setSelectedUpadhi(selectedUpadhi === member.honoraryTitle ? null : member.honoraryTitle)}
                style={{ cursor: 'pointer' }}
              >
                <div className="upadhi-icon">{getUpadhiIcon(member.honoraryTitle)}</div>
                <div className="upadhi-info">
                  <p className="honorary-title">{member.honoraryTitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Upadhi Members Modal */}
          {selectedUpadhi && (
            <div className="members-modal-overlay" onClick={() => setSelectedUpadhi(null)}>
              <div className="members-modal" onClick={(e) => e.stopPropagation()}>
                <div className="members-modal-header">
                  <h3>{selectedUpadhi}</h3>
                  <button className="members-modal-close" onClick={() => setSelectedUpadhi(null)}>✕</button>
                </div>
                <div className="members-modal-body">
                  {upadhiMembers.length === 0 ? (
                    <p className="no-members">{language === 'en' ? 'No members found with this title' : 'इस उपाधि के साथ कोई सदस्य नहीं मिला'}</p>
                  ) : (
                    <div className="members-modal-grid">
                      {upadhiMembers.map((member) => (
                        <div key={member._id} className="members-modal-card">
                          {member.photoPath ? (
                            <img
                              src={member.photoPath}
                              alt={member.fullName}
                              className="members-modal-photo"
                            />
                          ) : (
                            <div className="members-modal-photo-placeholder">👤</div>
                          )}
                          <div className="members-modal-tier" style={{ background: getTierColor(member.membershipTier || 'silver') }}>
                            {getTierIcon(member.membershipTier || 'silver')} {(member.membershipTier || 'silver').toUpperCase()}
                          </div>
                          <h4>{member.fullName}</h4>
                          <p>📍 {member.city}, {member.state}</p>
                          <p>💼 {member.occupation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      )}

      {/* Members Directory */}
      {activeSection === 'members' && (
      <section className="members-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Members' : 'हमारे सदस्य'}</h2>
            <div className="underline"></div>
          </div>

          <>
          <div className="tier-filters">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <img src="/assets/general.jpeg" alt="General" style={{ width: '24px', height: '28px', objectFit: 'contain', borderRadius: '4px', flexShrink: 0 }} />
              {language === 'en' ? 'General' : 'General'}
            </button>
            <button 
              className={filter === 'bronze' ? 'active bronze' : 'bronze'}
              onClick={() => setFilter('bronze')}
            >
              🥉 Bronze
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
        </div>
      </section>
      )}
    </div>
  );
};

export default Community;
