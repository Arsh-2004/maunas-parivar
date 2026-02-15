import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

const About = () => {
  const { language } = useLanguage();
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [committeeMembers, setCommitteeMembers] = useState({});
  const [loading, setLoading] = useState(false);

  // Function to get static members for Prabandhan Committee based on language
  const getPrabandhanMembers = () => [
    {
      _id: '1',
      fullName: language === 'en' ? 'Shri Ravi Kumar Singh Ji' : 'श्री रवि कुमार सिंह जी',
      position: language === 'en' ? 'Varanasi' : 'वाराणसी',
      city: language === 'en' ? 'Varanasi' : 'वाराणसी',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      photoPath: '/assets/national-president.jpeg'
    },
    {
      _id: '2',
      fullName: language === 'en' ? 'Dr J P Singh Ji' : 'डॉ जे पी सिंह जी',
      position: language === 'en' ? 'Varanasi' : 'वाराणसी',
      city: language === 'en' ? 'Varanasi' : 'वाराणसी',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      photoPath: '/assets/national-vice-president.jpeg'
    },
    {
      _id: '3',
      fullName: language === 'en' ? 'Dr Om Prakash Singh Ji' : 'डॉ ओम प्रकाश सिंह जी',
      position: language === 'en' ? 'Varanasi' : 'वाराणसी',
      city: language === 'en' ? 'Varanasi' : 'वाराणसी',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      photoPath: '/assets/National Secretary.jpeg'
    },
    {
      _id: '4',
      fullName: language === 'en' ? 'Shri Suresh Singh Ji' : 'श्री सुरेश सिंह जी',
      position: language === 'en' ? 'Varanasi' : 'वाराणसी',
      city: language === 'en' ? 'Varanasi' : 'वाराणसी',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      photoPath: '/assets/National Treasurer.jpeg'
    },
    {
      _id: '5',
      fullName: language === 'en' ? 'Shri Ashish Singh Ji' : 'श्री आशीष सिंह जी',
      position: language === 'en' ? 'Bhadohi' : 'भदोही',
      city: language === 'en' ? 'Bhadohi' : 'भदोही',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      photoPath: '/assets/ashishsingh.jpeg'
    },
    {
      _id: '6',
      fullName: language === 'en' ? 'Shri Shailendra Pratap Singh Ji' : 'श्री शैलेन्द्र प्रताप सिंह जी',
      position: language === 'en' ? 'Varanasi' : 'वाराणसी',
      city: language === 'en' ? 'Varanasi' : 'वाराणसी',
      state: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश',
      photoPath: '/assets/shailendra.jpeg'
    }
  ];

  const committees = [
    {
      id: 'sanrakshak',
      nameEn: 'Protective Committee',
      nameHi: 'संरक्षक कमेटी',
      icon: '🛡️',
      description: language === 'en' ? 'Protecting community interests and welfare' : 'समुदाय के हितों और कल्याण की रक्षा करना'
    },
    {
      id: 'prabandhan',
      nameEn: 'Management Committee',
      nameHi: 'प्रबन्धन कमेटी',
      icon: '📋',
      description: language === 'en' ? 'Managing organization operations and initiatives' : 'संगठन के संचालन और कार्यक्रमों का प्रबंधन'
    },
    {
      id: 'sanchalan',
      nameEn: 'Execution Committee',
      nameHi: 'संचालक कमेटी',
      icon: '⚙️',
      description: language === 'en' ? 'Executing programs and community activities' : 'कार्यक्रमों और सामुदायिक गतिविधियों का संचालन'
    }
  ];

  const fetchCommitteeMembers = useCallback(async (committeeId) => {
    try {
      setLoading(true);
      
      // For prabandhan committee, use static members
      if (committeeId === 'prabandhan') {
        setCommitteeMembers(prev => ({
          ...prev,
          [committeeId]: getPrabandhanMembers()
        }));
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/committee-members/${committeeId}`);
      const data = await response.json();
      
      if (data.success) {
        setCommitteeMembers(prev => ({
          ...prev,
          [committeeId]: data.members || []
        }));
      } else {
        // If no API data, show placeholder
        setCommitteeMembers(prev => ({
          ...prev,
          [committeeId]: []
        }));
      }
    } catch (error) {
      console.error('Error fetching committee members:', error);
      
      // For prabandhan committee, use static members even on error
      if (committeeId === 'prabandhan') {
        setCommitteeMembers(prev => ({
          ...prev,
          [committeeId]: getPrabandhanMembers()
        }));
      } else {
        setCommitteeMembers(prev => ({
          ...prev,
          [committeeId]: []
        }));
      }
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    if (selectedCommittee) {
      fetchCommitteeMembers(selectedCommittee);
    }
  }, [selectedCommittee, fetchCommitteeMembers]);

  return (
    <div className="about-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>{language === 'en' ? 'About Kshatriya Maunas Parivar' : 'क्षत्रिय मौनस परिवार के बारे में'}</h1>
          <p>{language === 'en' ? 'Preserve Heritage | Empower Community' : 'विरासत को संरक्षित करें | वंश को सशक्त करें'}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon">🎯</div>
              <h2>{language === 'en' ? 'Our Mission' : 'हमारा लक्ष्य'}</h2>
              <p>
                {language === 'en'
                  ? 'To unite and empower the Kshatriya Maunas community, preserve our rich cultural heritage, promote social welfare, and provide opportunities for educational and economic advancement.'
                  : 'क्षत्रिय मौनस वंश को संयुक्त और सशक्त करना, हमारी समृद्ध सांस्कृतिक विरासत को संरक्षित करना, सामाजिक कल्याण को बढ़ावा देना, और शैक्षणिक एवं आर्थिक उन्नति के लिए अवसर प्रदान करना।'}
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">👁️</div>
              <h2>{language === 'en' ? 'Our Vision' : 'हमारा दृष्टिकोण'}</h2>
              <p>
                {language === 'en'
                  ? 'To build a progressive Kshatriya Maunas community that honors its glorious past and embraces modern development, ensuring growth opportunities for every member.'
                  : 'एक प्रगतिशील क्षत्रिय मौनस वंश बनाना जो अपने गौरवशाली अतीत को सम्मानित करता है और आधुनिक विकास को अपनाता है, हर सदस्य के लिए विकास के अवसर सुनिश्चित करता है।'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="history-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Heritage' : 'हमारी विरासत'}</h2>
            <div className="underline"></div>
          </div>
          <div className="history-content">
            <div className="history-text">
              <h3>{language === 'en' ? 'Maunas Kshatriya Traditions' : 'मौनस क्षत्रियों की परंपरा'}</h3>
              <p>
                {language === 'en'
                  ? 'The Kshatriya Maunas community has a glorious and prestigious history rooted in centuries-old traditions. Known for valor, administrative skills, and dedication to protecting righteousness, Maunas Kshatriyas have played significant roles in various kingdoms and regions throughout Indian history.'
                  : 'क्षत्रिय मौनस वंश का एक गौरवशाली और प्रतिष्ठित इतिहास है जो सदियों पुरानी परंपराओं में निहित है। वीरता, प्रशासनिक कौशल और धर्म की रक्षा के लिए समर्पण के लिए जाने जाते हैं, मौनस क्षत्रियों ने भारतीय इतिहास में विभिन्न राज्यों और क्षेत्रों में महत्वपूर्ण भूमिका निभाई है, जो भारतीय इतिहास में दर्ज है।'}
              </p>
              <p>
                {language === 'en'
                  ? 'Our ancestors were renowned warriors, administrators, and protectors of our people. They maintained the highest standards of honor, duty, and service. The Maunas Kshatriya community has made significant contributions to the cultural and social fabric of India.'
                  : 'हमारे पूर्वज प्रसिद्ध योद्धा, प्रशासक और सर्वसमाज के रक्षक थे। उन्होंने सम्मान, कर्तव्य और सेवा के सर्वोच्च मानदंड को बनाए रखा। मौनस क्षत्रिय वंश ने भारतीय संस्कृति और सामाजिक संरचना में महत्वपूर्ण योगदान दिया है।'}
              </p>
              <p>
                {language === 'en'
                  ? 'Today, while honoring these traditions, our community has evolved to embrace modern education, business, and various professional fields.'
                  : 'आज,अपनी पुरानी परंपराओं का सम्मान करते हुए हमें आधुनिक शिक्षा, रोजगार एवं व्यवसाय अपनाने के लिए प्रतिबद्ध होना पड़ेगा।'}
              </p>
            </div>
            <div className="history-image">
              <div className="image-placeholder">
                <span>🏛️</span>
                <p>{language === 'en' ? 'Centuries of Heritage' : 'सदियों की विरासत'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Core Values' : 'हमारे मूल मूल्य'}</h2>
            <div className="underline"></div>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">⚔️</div>
              <h3>{language === 'en' ? 'Courage' : 'साहस'}</h3>
              <p>{language === 'en' ? 'Face challenges and move forward fearlessly' : 'चुनौतियों का सामना करना और निर्भयता से आगे बढ़ना'}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>{language === 'en' ? 'Unity' : 'एकता'}</h3>
              <p>{language === 'en' ? 'Stand together as a strong community' : 'एक मजबूत समुदाय के रूप में एक साथ खड़े होना'}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💎</div>
              <h3>{language === 'en' ? 'Integrity' : 'सततता'}</h3>
              <p>{language === 'en' ? 'Maintain honesty and ethical principles' : 'ईमानदारी और नैतिक सिद्धांतों को बनाए रखना'}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎓</div>
              <h3>{language === 'en' ? 'Progress' : 'प्रगति'}</h3>
              <p>{language === 'en' ? 'Embrace education and modern development' : 'शिक्षा एवं आधुनिक तकनीक को विकास के लिए अपनाना'}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🙏</div>
              <h3>{language === 'en' ? 'Tradition' : 'परंपरा'}</h3>
              <p>{language === 'en' ? 'Preserve our cultural heritage and customs' : 'हमारी सांस्कृतिक विरासत और रीति-रिवाजों को संरक्षित करना'}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>{language === 'en' ? 'Service' : 'सेवा'}</h3>
              <p>{language === 'en' ? 'Serve our community and society' : 'अपने कुल की सेवा के साथ-साथ समाज की सेवा करना'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* President Message */}
      <section className="president-message">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? "Moderator's Message" : 'संचालक का संदेश'}</h2>
            <div className="underline"></div>
          </div>
          <div className="message-content">
            <div className="president-image">
              <img 
                src="/assets/president-ravindra-kumar-singh.jpg" 
                alt={language === 'en' ? 'Ravindra Kumar Singh' : 'रविंद्र कुमार सिंह'}
                className="president-photo"
              />
              <h3>{language === 'en' ? 'Moderator' : 'संचालक'}</h3>
              <p>{language === 'en' ? 'Ravindra Kumar Singh' : 'रवीन्द्र कुमार सिंह'}</p>
            </div>
            <div className="message-text">
              <p className="quote-mark">"</p>
              <p>
                {language === 'en'
                  ? 'Dear Members and Well-Wishers,'
                  : 'प्रिय परिवार के सदस्यों और शुभचिंतकों को नमस्कार,'}
              </p>
              <p>
                {language === 'en'
                  ? 'It is with great pride that I speak to you as the Moderator of the Kshatriya Maunas family. Our organization stands as a testament to the enduring spirit of our community, built upon centuries of tradition, valor, and dedication to righteousness.'
                  : 'मुझे गर्व है कि मैं क्षत्रिय मौनस परिवार के संचालक के रूप में आपसे बात कर रहा हूं। हमारा संगठन सदियों की परंपरा, वीरता और धर्म के प्रति समर्पण अपने में संजोए हुए है जो हमारे वंश की स्थायी भावना का प्रमाण है।'}
              </p>
              <p>
                {language === 'en'
                  ? 'In these modern times, while we honor our glorious past, we must also embrace progress and unity. Our mission is to ensure that every member of our community has opportunities for growth, education, and prosperity.'
                  : 'इस आधुनिक समय में, हमें गौरवशाली अतीत का सम्मान करते हुए अपनी प्रगति और एकता को भी बनाये रखना होगा। हमारा उद्देश्य यह सुनिश्चित करना है की हमारे वंश के हर सदस्य को शिक्षा, रोजगार एवं विकास का अवसर सुलभ हो।'}
              </p>
              <p>
                {language === 'en'
                  ? 'I invite each of you to actively participate in our initiatives, programs, and operations. Together, we can strengthen our bonds and lead our community toward a better future.'
                  : 'मैं अपने परिवार के प्रत्येक सदस्य को, क्षत्रिय मौनस परिवार के कार्यक्रमों में सक्रिय रूप से भाग लेने के लिए आमंत्रित करता हूं। हम एक साथ मिलकर अपने संबंधों को मजबूत कर सकते हैं और अपने वंश को एक उज्ज्वल भविष्य की ओर ले जा सकते हैं।'}
              </p>
              <p className="signature">
                {language === 'en' ? (
                  <>
                    With Best Wishes,
                    <br />
                    <strong>Moderator</strong>
                  </>
                ) : (
                  <>
                    शुभकामनाओं सहित,
                    <br />
                    <strong>संचालक</strong>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Committees Section */}
      <section className="committees-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Committees' : 'हमारी कमेटियाँ'}</h2>
            <div className="underline"></div>
          </div>

          {/* Committees Grid */}
          <div className="committees-grid">
            {committees.map((committee) => (
              <div 
                key={committee.id}
                className={`committee-card ${selectedCommittee === committee.id ? 'active' : ''}`}
                onClick={() => setSelectedCommittee(selectedCommittee === committee.id ? null : committee.id)}
              >
                <div className="committee-icon">{committee.icon}</div>
                <h3>{language === 'en' ? committee.nameEn : committee.nameHi}</h3>
                <p className="committee-desc">{committee.description}</p>
                <span className="click-hint">
                  {language === 'en' ? (selectedCommittee === committee.id ? 'Hide Members' : 'View Members') : (selectedCommittee === committee.id ? 'सदस्य छुपाएं' : 'सदस्य देखें')}
                </span>
              </div>
            ))}
          </div>

          {/* Committee Members Display */}
          {selectedCommittee && (
            <div className="committee-members-section">
              <div className="members-header">
                <h3>
                  {committees.find(c => c.id === selectedCommittee) && 
                   (language === 'en' ? committees.find(c => c.id === selectedCommittee).nameEn : committees.find(c => c.id === selectedCommittee).nameHi)}
                  {' - '}{language === 'en' ? 'Members' : 'सदस्य'}
                </h3>
              </div>

              {loading ? (
                <div className="loading-message">
                  {language === 'en' ? 'Loading members...' : 'सदस्य लोड हो रहे हैं...'}
                </div>
              ) : committeeMembers[selectedCommittee] && committeeMembers[selectedCommittee].length > 0 ? (
                <div className="members-grid">
                  {committeeMembers[selectedCommittee].map((member) => (
                    <div key={member._id} className="member-card">
                      {member.photoPath && (
                        <img 
                          src={member.photoPath} 
                          alt={member.fullName}
                          className="member-photo"
                        />
                      )}
                      <div className="member-details">
                        <h4>{member.fullName}</h4>
                        <p className="member-position">{member.position || 'Member'}</p>
                        <p className="member-contact">📍 {member.city}, {member.state}</p>
                        {member.phone && <p className="member-phone">📱 {member.phone}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-members-message">
                  <p>{language === 'en' ? 'No members added yet for this committee' : 'इस कमेटी के लिए अभी कोई सदस्य नहीं जोड़े गए हैं'}</p>
                  <p className="hint">{language === 'en' ? 'Members will be displayed here' : 'सदस्यों को यहाँ दिखाया जाएगा'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Achievements */}
      <section className="achievements-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Our Impact' : 'हमारा प्रभाव'}</h2>
            <div className="underline"></div>
          </div>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-number">5000+</div>
              <div className="achievement-label">{language === 'en' ? 'Active Members' : 'सक्रिय सदस्य'}</div>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">50+</div>
              <div className="achievement-label">{language === 'en' ? 'Events Organized' : 'आयोजित कार्यक्रम'}</div>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">200+</div>
              <div className="achievement-label">{language === 'en' ? 'Scholarships Provided' : 'छात्रवृत्ति प्रदान की गई'}</div>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">15+</div>
              <div className="achievement-label">{language === 'en' ? 'Cities Connected' : 'शहर जुड़े हुए'}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
