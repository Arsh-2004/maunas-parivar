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
  const activeSection = new URLSearchParams(location.search).get('section') || '';
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpadhi, setSelectedUpadhi] = useState(null); // for filtering by honorary title
  const [selectedPrakosth, setSelectedPrakosth] = useState(null); // for filtering by prakosth
  const [expandedBios, setExpandedBios] = useState({});
  const toggleBio = (id) => setExpandedBios(prev => ({ ...prev, [id]: !prev[id] }));
  const BIO_LIMIT = 25;

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
      prakosth: 'buddhijivi',
      photoPath: '/assets/ram-sudhar-singh.jpeg',
      registeredAt: new Date('2026-02-20')
    }, 
    {
      _id: 'prakosth-2',
      fullName: language === 'en' ? 'Dr. Jaydeep Singh Ji' : 'डॉ जयदीप सिंह जी',
      city: language === 'en' ? 'Guwahati' : 'गुवाहाटी',
      state: language === 'en' ? 'Assam' : 'आसाम',
      occupation: language === 'en' ? 'Senior ScientistKrishi Vigyan Kendra ICAR, ATARI Zone IV' : 'वरिष्ठ वैज्ञानिक कृषि विज्ञान केंद्रआई०सी०ए०आर०, ए० टी० ए० आर० आई० जोन IV',
      education: 'post-graduate',
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
      prakosth: 'manav-seva',
      photoPath: '/assets/श्री के के सिंह जी.jpeg',
      registeredAt: new Date('2026-02-21')
    },
    {
      _id: 'prakosth-chikitsa-akshi',
      fullName: language === 'en' ? 'Dr. Akshi Singh' : 'डॉ. अक्षी सिंह',
      city: language === 'en' ? 'Varanasi' : 'वाराणसी',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'MBBS, MD (Pediatrics) — Datta Meghe Medical College, Wardha | PG in Pediatric Nutrition, Boston University, USA' : 'MBBS, MD (पीडियाट्रिक्स) — Datta Meghe Medical College, वर्धा (नागपुर) | पोस्ट ग्रेजुएट इन पीडियाट्रिक न्यूट्रिशन, Boston University, यूएसए',
      bio: language === 'en' ? 'Special Interest: Pre-term & high-risk newborn care | Fellowships: IAP, Indian College of Haematology & Oncology Society' : 'विशेष रुचि: प्री-टर्म एवं हाई-रिस्क नवजात शिशुओं की देखभाल | फेलोशिप्स: इंडियन एकेडमी ऑफ पीडियाट्रिक्स (IAP), इंडियन कॉलेज ऑफ हीमैटोलॉजी एंड ऑन्कोलॉजी सोसाइटी',
      education: 'post-graduate',
      prakosth: 'chikitsa',
      photoPath: '/assets/डॉ. अक्षी सिंह.jpeg',
      registeredAt: new Date('2026-02-28')
    },
    {
      _id: 'prakosth-chikitsa-gaurav',
      fullName: language === 'en' ? 'Dr. Gaurav Singh' : 'डॉ. गौरव सिंह',
      city: language === 'en' ? 'Varanasi' : 'वाराणसी',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'MBBS, MD (General Medicine) — Ganesh Shankar Vidyarthi Memorial Medical College, Kanpur | Fellowship in Diabetes, CMC Vellore' : 'MBBS, MD (जनरल मेडिसिन) — Ganesh Shankar Vidyarthi Memorial Medical College, कानपुर | डायबिटीज में फेलोशिप, Christian Medical College, वेल्लोर',
      bio: language === 'en' ? 'Fellowships: Indian Society of Hypertension, Indian Society of Chronomedicine, Indian College of Haematology & Oncology Society, Diabetes India' : 'फेलोशिप्स: इंडियन सोसाइटी ऑफ हाइपरटेंशन, इंडियन सोसाइटी ऑफ क्रोनोमेडिसिन, इंडियन कॉलेज ऑफ हीमैटोलॉजी एंड ऑन्कोलॉजी सोसाइटी, डायबिटीज इंडिया',
      education: 'post-graduate',
      prakosth: 'chikitsa',
      photoPath: '/assets/डॉ. गौरव सिंह.jpeg',
      registeredAt: new Date('2026-02-28')
    },
    {
      _id: 'prakosth-4',
      fullName: language === 'en' ? 'Shri Rajkumar Singh Ji' : 'श्री राजकुमार सिंह जी',
      city: language === 'en' ? 'Bithauli, Prayagraj' : 'बिठौली, प्रयागराज',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      occupation: language === 'en' ? 'Advocate' : 'एडवोकेट',
      education: 'post-graduate',
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
      prakosth: 'khel',
      photoPath: '/assets/श्री यजुवेंद्र सिंह जी.jpeg',
      registeredAt: new Date('2026-02-19')
    }
  ];

  // Combine API members with placeholder members
  const allMembers = [...members, ...placeholderMembers];

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
                          <img src={member.photoPath} alt={member.fullName} className="panel-member-photo" />
                        ) : (
                          <div className="panel-member-photo-placeholder">👤</div>
                        )}
                      </div>
                      <div className="panel-member-info">
                        <h4>{member.fullName}</h4>
                        <p className="panel-member-designation">🏛️ {prakosths.find(p => p.id === member.prakosth)?.title || member.prakosth}</p>
                        <p className="panel-member-location">📍 {member.city}, {member.state}</p>
                        {member.occupation && (
                          <p className="panel-member-occupation">
                            💼 {expandedBios[member._id + '_occ']
                              ? member.occupation
                              : member.occupation.slice(0, BIO_LIMIT)}
                            {(member.occupation.length > BIO_LIMIT || member.bio) && (
                              <button className="read-more-btn" onClick={() => toggleBio(member._id + '_occ')}>
                                {expandedBios[member._id + '_occ']
                                  ? (language === 'en' ? ' − Read less' : ' − कम पढ़ें')
                                  : (language === 'en' ? '... Read more' : '... और देखें')}
                              </button>
                            )}
                          </p>
                        )}
                        {member.bio && expandedBios[member._id + '_occ'] && (
                          <p className="panel-member-bio">🏅 {member.bio}</p>
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
                          <img src={member.photoPath} alt={member.fullName} className="panel-member-photo" />
                        ) : (
                          <div className="panel-member-photo-placeholder">👤</div>
                        )}
                      </div>
                      <div className="panel-member-info">
                        <h4>{member.fullName}</h4>
                        <p className="panel-member-designation upadhi-title-badge">{member.honoraryTitle}</p>
                        <p className="panel-member-location">📍 {member.city}, {member.state}</p>
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
