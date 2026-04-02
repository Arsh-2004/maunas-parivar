import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import { normalizeMediaUrl, formatLocation } from '../utils/mediaUrl';
import './Community.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';
const SAHYOG_QR_IMAGE = process.env.REACT_APP_SAHYOG_QR_IMAGE || '/assets/phonepe-qr.png';

const resolveQrImageSrc = (rawPath) => {
  if (!rawPath || typeof rawPath !== 'string') {
    return '/assets/phonepe-qr.png';
  }

  const trimmed = rawPath.trim();
  if (!trimmed) {
    return '/assets/phonepe-qr.png';
  }

  if (/^(https?:)?\/\//i.test(trimmed) || /^data:image\//i.test(trimmed)) {
    return trimmed;
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

const Community = () => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);
  const location = useLocation();
  const activeSection = new URLSearchParams(location.search).get('section') || '';
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [selectedUpadhi, setSelectedUpadhi] = useState(null); // for filtering by honorary title
  const [selectedPrakosth, setSelectedPrakosth] = useState(null); // for filtering by prakosth
  const [expandedBios, setExpandedBios] = useState({});
  const toggleBio = (id) => setExpandedBios(prev => ({ ...prev, [id]: !prev[id] }));
  const BIO_LIMIT = 25;
  const [selectedMember, setSelectedMember] = useState(null);
  const [donors, setDonors] = useState([]);
  const [sahyogForm, setSahyogForm] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    amount: '',
    message: '',
    paymentScreenshot: null
  });
  const [sahyogSubmitting, setSahyogSubmitting] = useState(false);
  const [sahyogStatus, setSahyogStatus] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedMember]);

  useEffect(() => {
    fetchMembers();
    fetchDonors();
    fetchCommunityMembers();
  }, []);

  const fetchCommunityMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/community-members`);
      const data = await response.json();
      if (data.success) setCommunityMembers(data.members);
    } catch (err) {
      console.error('Error fetching community members:', err);
    }
  };

  const fetchDonors = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/donors`);
      const data = await response.json();
      if (data.success) setDonors(data.donors);
    } catch (err) {
      console.error('Error fetching donors:', err);
    }
  };

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

  const handleSahyogSubmit = async (e) => {
    e.preventDefault();
    setSahyogStatus(null);

    if (!sahyogForm.paymentScreenshot) {
      setSahyogStatus({
        type: 'error',
        msg: language === 'en' ? 'Please upload payment screenshot.' : 'कृपया भुगतान स्क्रीनशॉट अपलोड करें।'
      });
      return;
    }

    try {
      setSahyogSubmitting(true);
      const formData = new FormData();
      formData.append('fullName', sahyogForm.fullName);
      formData.append('contactNumber', sahyogForm.contactNumber);
      formData.append('email', sahyogForm.email);
      formData.append('amount', sahyogForm.amount);
      formData.append('message', sahyogForm.message);
      formData.append('paymentScreenshot', sahyogForm.paymentScreenshot);

      const response = await fetch(`${API_URL}/users/sahyog-submissions`, {
        method: 'POST',
        body: formData
      });

      let data = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const raw = await response.text();
        data = { success: false, message: raw || `Request failed with status ${response.status}` };
      }

      if (response.ok && data.success) {
        setSahyogStatus({
          type: 'success',
          msg: language === 'en'
            ? 'Your sahyog details were submitted. Our team will verify soon.'
            : 'आपका सहयोग विवरण सफलतापूर्वक भेज दिया गया है। हमारी टीम शीघ्र सत्यापित करेगी।'
        });
        setSahyogForm({
          fullName: '',
          contactNumber: '',
          email: '',
          amount: '',
          message: '',
          paymentScreenshot: null
        });
      } else {
        setSahyogStatus({
          type: 'error',
          msg: data.message || (language === 'en' ? `Submission failed (${response.status}).` : `जमा करना विफल रहा (${response.status})।`)
        });
      }
    } catch (error) {
      console.error('Sahyog submit error:', error);
      setSahyogStatus({
        type: 'error',
        msg: language === 'en' ? 'Network error. Please try again.' : 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।'
      });
    } finally {
      setSahyogSubmitting(false);
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

  // Combine registered users + DB community members (prakosth/upadhi managed via admin dashboard)
  const allMembers = [...members, ...communityMembers];

  // Regular members (without prakosth or honorary titles)
  const filteredMembers = allMembers.filter(member => {
    if (member.prakosth || member.honoraryTitle) return false;
    return true;
  });

  // All prakosth members (for sidebar+panel)
  const allPrakosthMembers = allMembers.filter(member => !!member.prakosth);
  const visiblePrakosthMembers = selectedPrakosth
    ? allPrakosthMembers.filter(m => m.prakosth === selectedPrakosth)
    : allPrakosthMembers;

  // All upadhi members (for sidebar+panel)
  const allUpadhiMembers = allMembers.filter(member => !!member.honoraryTitle);
  const visibleUpadhiMembers = selectedUpadhi
    ? allUpadhiMembers.filter(m => m.honoraryTitle === selectedUpadhi)
    : allUpadhiMembers;

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
      {(!activeSection || activeSection === 'prakosth') && (
      <section className="management-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Cells' : 'हमारा प्रकोष्ठ'}</h2>
            <div className="underline"></div>
          </div>
          <div className="section-with-sidebar">
            {/* Left Sidebar */}
            <div className="section-sidebar">
              <button
                className={`sidebar-item ${!selectedPrakosth ? 'active' : ''}`}
                onClick={() => setSelectedPrakosth(null)}
              >
                <span className="sidebar-item-icon">🏛️</span>
                <span>{language === 'en' ? 'All Cells' : 'सभी प्रकोष्ठ'}</span>
              </button>
              {prakosths.map((p) => (
                <button
                  key={p.id}
                  className={`sidebar-item ${selectedPrakosth === p.id ? 'active' : ''}`}
                  onClick={() => setSelectedPrakosth(selectedPrakosth === p.id ? null : p.id)}
                >
                  <span className="sidebar-item-icon">{p.icon}</span>
                  <span>{p.title}</span>
                </button>
              ))}
            </div>

            {/* Right Members Panel */}
            <div className="section-members-panel">
              {selectedPrakosth && (
                <h4 className="panel-section-label">
                  {prakosths.find(p => p.id === selectedPrakosth)?.icon} {prakosths.find(p => p.id === selectedPrakosth)?.title}
                </h4>
              )}
              {visiblePrakosthMembers.length === 0 ? (
                <p className="no-members">{language === 'en' ? 'No members found' : 'कोई सदस्य नहीं मिला'}</p>
              ) : (
                <div className="panel-members-grid">
                  {visiblePrakosthMembers.map((member) => (
                    <div key={member._id} className="panel-member-card">
                      <div className="panel-member-photo-wrap">
                        {member.photoPath ? (
                          <img src={normalizeMediaUrl(member.photoPath)} alt={member.fullName} className="panel-member-photo" />
                        ) : (
                          <div className="panel-member-photo-placeholder">👤</div>
                        )}
                      </div>
                      <div className="panel-member-info">
                        <h4>{member.fullName}</h4>
                        <p className="panel-member-designation">🏛️ {prakosths.find(p => p.id === member.prakosth)?.title || member.prakosth}</p>
                        <p className="panel-member-location">📍 {formatLocation(member.city, member.state)}</p>
                        {member.occupation && (
                          <p className="panel-member-occupation">💼 {member.occupation.slice(0, BIO_LIMIT)}{member.occupation.length > BIO_LIMIT ? '...' : ''}</p>
                        )}
                        <button
                          className="read-more-btn prakosth-detail-btn"
                          onClick={() => setSelectedMember({ ...member, prakosthTitle: prakosths.find(p => p.id === member.prakosth)?.title || member.prakosth })}
                        >
                          {language === 'en' ? '— Read more' : '— और देखें'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Upadhidhaarak (Titles & Rankings) Section */}
      {(!activeSection || activeSection === 'upadhi') && (
      <section className="upadhi-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Upadhidhaarak' : 'उपाधिधारक'}</h2>
            <div className="underline"></div>
          </div>
          <div className="section-with-sidebar">
            {/* Left Sidebar */}
            <div className="section-sidebar">
              <button
                className={`sidebar-item ${!selectedUpadhi ? 'active' : ''}`}
                onClick={() => setSelectedUpadhi(null)}
              >
                <span className="sidebar-item-icon">🏅</span>
                <span>{language === 'en' ? 'All Titles' : 'सभी उपाधियाँ'}</span>
              </button>
              {upadhiRankings.map((u, index) => (
                <button
                  key={index}
                  className={`sidebar-item ${selectedUpadhi === u.honoraryTitle ? 'active' : ''}`}
                  onClick={() => setSelectedUpadhi(selectedUpadhi === u.honoraryTitle ? null : u.honoraryTitle)}
                >
                  <span className="sidebar-item-icon upadhi-sidebar-icon">{getUpadhiIcon(u.honoraryTitle)}</span>
                  <span>{u.honoraryTitle}</span>
                </button>
              ))}
            </div>

            {/* Right Members Panel */}
            <div className="section-members-panel">
              {selectedUpadhi && (
                <h4 className="panel-section-label">{selectedUpadhi}</h4>
              )}
              {visibleUpadhiMembers.length === 0 ? (
                <p className="no-members">{language === 'en' ? 'No members found' : 'कोई सदस्य नहीं मिला'}</p>
              ) : (
                <div className="panel-members-grid">
                  {visibleUpadhiMembers.map((member) => (
                    <div key={member._id} className="panel-member-card">
                      <div className="panel-member-upadhi-icon">{getUpadhiIcon(member.honoraryTitle)}</div>
                      <div className="panel-member-photo-wrap">
                        {member.photoPath ? (
                          <img src={normalizeMediaUrl(member.photoPath)} alt={member.fullName} className="panel-member-photo" />
                        ) : (
                          <div className="panel-member-photo-placeholder">👤</div>
                        )}
                      </div>
                      <div className="panel-member-info">
                        <h4>{member.fullName}</h4>
                        <p className="panel-member-designation upadhi-title-badge">{member.honoraryTitle}</p>
                        <p className="panel-member-location">📍 {formatLocation(member.city, member.state)}</p>
                        {member.occupation && (
                          <p className="panel-member-occupation">
                            💼 {expandedBios[member._id + '_occ']
                              ? member.occupation
                              : member.occupation.slice(0, BIO_LIMIT)}
                            {member.occupation.length > BIO_LIMIT && (
                              <button className="read-more-btn" onClick={() => toggleBio(member._id + '_occ')}>
                                {expandedBios[member._id + '_occ']
                                  ? (language === 'en' ? ' − Read less' : ' − कम पढ़ें')
                                  : (language === 'en' ? '... Read more' : '... और देखें')}
                              </button>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Members Directory */}
      {(!activeSection || activeSection === 'members') && (
      <section className="members-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Members' : 'हमारे सदस्य'}</h2>
            <div className="underline"></div>
          </div>

          <>

          {loading ? (
            <p className="loading">{language === 'en' ? 'Loading members...' : 'सदस्य लोड हो रहे हैं...'}</p>
          ) : filteredMembers.length === 0 ? (
            <p className="no-members">{language === 'en' ? 'No members found' : 'कोई सदस्य नहीं मिला'}</p>
          ) : (
            <div className="membership-cards-grid">
              {filteredMembers.map((member) => (
                <div 
                  key={member._id} 
                  className="membership-card"
                >
                  {member.photoPath ? (
                    <img 
                      src={normalizeMediaUrl(member.photoPath)} 
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
                    <p className="member-city">📍 {formatLocation(member.city, member.state)}</p>
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
      {/* Sahyogi Sadashya (Donors) Section */}
      {(!activeSection || activeSection === 'sahyogi') && (
      <section className="sahyogi-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Contribute' : 'सहयोग करें'}</h2>
            <div className="underline"></div>
          </div>

          <div className="sahyog-message-block">
            <p>
              {language === 'en'
                ? 'Your support plays an important role in social service, education and preserving the heritage of the Maunas Kshatriya family.'
                : 'आपका सहयोग समाज सेवा, शिक्षा और मौनस क्षत्रिय परिवार की धरोहर को संभालने में महत्वपूर्ण भूमिका निभाता है।'}
            </p>
            <p>
              {language === 'en'
                ? 'No contribution is too small; your support inspires us to do even better. With your help, we can reach families in need and fulfill our cultural responsibilities with honesty and transparency.'
                : 'कोई भी सहयोग छोटा नहीं होता; आपका साथ हमें और बेहतर कार्य करने की प्रेरणा देता है। आपके समर्थन से हम जरूरतमंद परिवारों तक सहायता पहुँचा सकते हैं और अपनी सांस्कृतिक जिम्मेदारियों को ईमानदारी व पारदर्शिता के साथ आगे बढ़ा सकते हैं।'}
            </p>
          </div>

          <div className="sahyog-contribution-wrap">
            <div className="sahyog-qr-card">
              <h3>{language === 'en' ? 'Scan & Pay (PhonePe)' : 'स्कैन करें और भुगतान करें (PhonePe)'}</h3>
              <img
                src={resolveQrImageSrc(SAHYOG_QR_IMAGE)}
                alt={language === 'en' ? 'PhonePe QR Code' : 'PhonePe QR कोड'}
                className="sahyog-qr-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <p className="sahyog-qr-fallback" style={{ display: 'none' }}>
                {language === 'en'
                  ? 'QR image not found. Place your QR at /public/assets/phonepe-qr.png'
                  : 'QR छवि नहीं मिली। कृपया QR फाइल /public/assets/phonepe-qr.png पर रखें'}
              </p>
              <p className="sahyog-note">
                {language === 'en'
                  ? 'After payment, fill the form and upload screenshot.'
                  : 'भुगतान के बाद फॉर्म भरें और स्क्रीनशॉट अपलोड करें।'}
              </p>
            </div>

            <div className="sahyog-form-card">
              <h3>{language === 'en' ? 'Submit Payment Details' : 'भुगतान विवरण जमा करें'}</h3>
              <form onSubmit={handleSahyogSubmit} className="sahyog-form">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Full Name *' : 'पूरा नाम *'}
                  value={sahyogForm.fullName}
                  onChange={(e) => setSahyogForm({ ...sahyogForm, fullName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Contact Number *' : 'संपर्क नंबर *'}
                  value={sahyogForm.contactNumber}
                  onChange={(e) => setSahyogForm({ ...sahyogForm, contactNumber: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder={language === 'en' ? 'Email (optional)' : 'ईमेल (वैकल्पिक)'}
                  value={sahyogForm.email}
                  onChange={(e) => setSahyogForm({ ...sahyogForm, email: e.target.value })}
                />
                <input
                  type="number"
                  placeholder={language === 'en' ? 'Amount (optional)' : 'राशि (वैकल्पिक)'}
                  min="1"
                  value={sahyogForm.amount}
                  onChange={(e) => setSahyogForm({ ...sahyogForm, amount: e.target.value })}
                />
                <textarea
                  placeholder={language === 'en' ? 'Message (optional)' : 'संदेश (वैकल्पिक)'}
                  rows={3}
                  value={sahyogForm.message}
                  onChange={(e) => setSahyogForm({ ...sahyogForm, message: e.target.value })}
                />
                <label className="sahyog-upload-label">
                  {language === 'en' ? 'Payment Screenshot *' : 'भुगतान स्क्रीनशॉट *'}
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setSahyogForm({ ...sahyogForm, paymentScreenshot: e.target.files?.[0] || null })}
                  required
                />
                {sahyogForm.paymentScreenshot && (
                  <p className="sahyog-file-name">{sahyogForm.paymentScreenshot.name}</p>
                )}
                <button type="submit" className="sahyog-submit-btn" disabled={sahyogSubmitting}>
                  {sahyogSubmitting
                    ? (language === 'en' ? 'Submitting...' : 'सहयोग भेजा जा रहा है...')
                    : (language === 'en' ? 'Contribute Now' : 'सहयोग करें')}
                </button>
                {sahyogStatus && (
                  <p className={`sahyog-form-status ${sahyogStatus.type}`}>
                    {sahyogStatus.msg}
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="sahyogi-members-block">
            <h3 className="sahyogi-members-title">
              {language === 'en' ? 'Sahyogi Sadashya' : 'सहयोगी सदस्य'}
            </h3>
            <p className="sahyogi-subtitle">
              {language === 'en'
                ? 'Honourable donors who have generously supported the Maunas Kshatriya Parivar'
                : 'वे सम्माननीय सदस्य जिन्होंने मौनस क्षत्रिय परिवार को उदारतापूर्वक सहयोग दिया'}
            </p>
          </div>

          {donors.length === 0 ? (
            <p className="no-members">{language === 'en' ? 'No donors yet' : 'अभी तक कोई सहयोगी नहीं'}</p>
          ) : (
            <div className="sahyogi-grid">
              {donors.map((donor) => (
                <div key={donor._id} className="sahyogi-card">
                  <div className="sahyogi-image">
                    {donor.photoPath ? (
                      <img
                        src={normalizeMediaUrl(donor.photoPath)}
                        alt={donor.fullName}
                        className="sahyogi-photo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="sahyogi-photo-placeholder" style={donor.photoPath ? {display: 'none'} : {}}>👤</div>
                  </div>
                  <div className="sahyogi-amount-badge">
                    ₹{Number(donor.donationAmount).toLocaleString('en-IN')}
                  </div>
                  <h3 className="sahyogi-name">{donor.fullName}</h3>
                  {(donor.city || donor.state) && (
                    <p className="sahyogi-location">{formatLocation(donor.city, donor.state)}</p>
                  )}
                  {donor.donationPurpose && (
                    <p className="sahyogi-purpose">🌸 {donor.donationPurpose}</p>
                  )}
                  {donor.message && (
                    <p className="sahyogi-message">"{donor.message}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="member-detail-overlay" onClick={() => setSelectedMember(null)}>
          <div className="member-detail-modal" onClick={e => e.stopPropagation()}>
            <button className="member-detail-close" onClick={() => setSelectedMember(null)} aria-label="Close">✕</button>
            <div className="member-detail-body">
              <div className="member-detail-photo-col">
                {selectedMember.photoPath ? (
                  <img src={normalizeMediaUrl(selectedMember.photoPath)} alt={selectedMember.fullName} className="member-detail-photo" />
                ) : (
                  <div className="member-detail-photo-placeholder">👤</div>
                )}
              </div>
              <div className="member-detail-info-col">
                <h2 className="member-detail-name">{selectedMember.fullName}</h2>
                {selectedMember.prakosthTitle && (
                  <p className="member-detail-prakosth">🏛️ {selectedMember.prakosthTitle}</p>
                )}
                <p className="member-detail-location">📍 {formatLocation(selectedMember.city, selectedMember.state)}</p>
                {selectedMember.occupation && (
                  <div className="member-detail-row">
                    <span className="member-detail-label">💼 {language === 'en' ? 'Qualification' : 'योग्यता'}</span>
                    <p className="member-detail-value">{selectedMember.occupation}</p>
                  </div>
                )}
                {selectedMember.bio && (
                  <div className="member-detail-row">
                    <span className="member-detail-label">🏅 {language === 'en' ? 'Fellowships' : 'फेलोशिप्स'}</span>
                    <p className="member-detail-value">{selectedMember.bio}</p>
                  </div>
                )}
                {selectedMember.awards && (
                  <div className="member-detail-row">
                    <span className="member-detail-label">🏆 {language === 'en' ? 'Awards & Honours' : 'पुरस्कार एवं सम्मान'}</span>
                    <p className="member-detail-value">{selectedMember.awards}</p>
                  </div>
                )}
                {selectedMember.publications && (
                  <div className="member-detail-row">
                    <span className="member-detail-label">📄 {language === 'en' ? 'Publications & Presentations' : 'प्रकाशन एवं प्रस्तुतीकरण'}</span>
                    <p className="member-detail-value">{selectedMember.publications}</p>
                  </div>
                )}
                {selectedMember.education && (
                  <div className="member-detail-row">
                    <span className="member-detail-label">🎓 {language === 'en' ? 'Education' : 'शिक्षा'}</span>
                    <p className="member-detail-value">
                      {selectedMember.education === 'post-graduate' ? (language === 'en' ? 'Post Graduate' : 'स्नातकोत्तर') :
                       selectedMember.education === 'graduate' ? (language === 'en' ? 'Graduate' : 'स्नातक') :
                       selectedMember.education}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
