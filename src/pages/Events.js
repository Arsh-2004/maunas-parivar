import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import './Events.css';

const Events = () => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  const upcomingEvents = [
    {
      title: language === 'en' ? 'Annual Community Gathering 2025' : 'वार्षिक समुदाय समारोह 2025',
      date: language === 'en' ? 'January 15, 2025' : '15 जनवरी 2025',
      time: '10:00 AM - 6:00 PM',
      location: language === 'en' ? 'Jaipur Convention Center' : 'जयपुर कन्वेंशन सेंटर',
      description: language === 'en' ? 'Join us for our annual gathering with cultural programs, discussions, and networking.' : 'सांस्कृतिक कार्यक्रमों, चर्चाओं और नेटवर्किंग के साथ हमारे वार्षिक समारोह में शामिल हों।',
      icon: '🎉'
    },
    {
      title: language === 'en' ? 'Youth Leadership Summit' : 'युवा नेतृत्व शिखर सम्मेलन',
      date: language === 'en' ? 'February 20, 2025' : '20 फरवरी 2025',
      time: '9:00 AM - 4:00 PM',
      location: language === 'en' ? 'Udaipur Resort' : 'उदयपुर रिसॉर्ट',
      description: language === 'en' ? 'Empowering young leaders through workshops, mentorship, and skill development.' : 'कार्यशालाओं, mentorship और कौशल विकास के माध्यम से युवा नेताओं को सशक्त बनाना।',
      icon: '🎓'
    },
    {
      title: language === 'en' ? 'Cultural Heritage Festival' : 'सांस्कृतिक विरासत महोत्सव',
      date: language === 'en' ? 'March 10, 2025' : '10 मार्च 2025',
      time: '5:00 PM - 10:00 PM',
      location: language === 'en' ? 'City Palace, Jaipur' : 'सिटी पैलेस, जयपुर',
      description: language === 'en' ? 'Celebrate our rich heritage with traditional performances, art, and cuisine.' : 'पारंपरिक प्रदर्शन, कला और व्यंजनों के साथ हमारी समृद्ध विरासत का जश्न मनाएं।',
      icon: '🎭'
    }
  ];

  const pastEvents = [
    {
      title: language === 'en' ? 'Scholarship Distribution Ceremony' : 'छात्रवृत्ति वितरण समारोह',
      date: language === 'en' ? 'October 20, 2024' : '20 अक्टूबर 2024',
      location: language === 'en' ? 'Community Hall, Jaipur' : 'कम्युनिटी हॉल, जयपुर',
      description: language === 'en' ? 'Awarded scholarships to 50 meritorious students from our community.' : 'हमारे समुदाय के 50 मेधावी छात्रों को छात्रवृत्ति से सम्मानित किया।',
      image: '🎓'
    },
    {
      title: language === 'en' ? 'Diwali Celebration 2024' : 'दिवाली समारोह 2024',
      date: language === 'en' ? 'November 1, 2024' : '1 नवंबर 2024',
      location: language === 'en' ? 'Community Center' : 'कम्युनिटी सेंटर',
      description: language === 'en' ? 'Grand Diwali celebration with traditional rituals and community dinner.' : 'पारंपरिक अनुष्ठानों और सामुदायिक डिनर के साथ भव्य दिवाली समारोह।',
      image: '🪔'
    },
    {
      title: language === 'en' ? 'Blood Donation Camp' : 'रक्तदान शिविर',
      date: language === 'en' ? 'September 15, 2024' : '15 सितंबर 2024',
      location: language === 'en' ? 'City Hospital' : 'सिटी हॉस्पिटल',
      description: language === 'en' ? 'Organized blood donation camp with participation from 100+ members.' : '100+ सदस्यों की भागीदारी के साथ रक्तदान शिविर का आयोजन किया।',
      image: '💉'
    },
    {
      title: language === 'en' ? 'Sports Tournament' : 'क्रीड़ा टूर्नामेंट',
      date: language === 'en' ? 'August 5, 2024' : '5 अगस्त 2024',
      location: language === 'en' ? 'Sports Complex' : 'स्पोर्ट्स कॉम्प्लेक्स',
      description: language === 'en' ? 'Inter-city sports tournament promoting fitness and unity.' : 'फिटनेस और एकता को बढ़ावा देने वाला अंतर-शहरीय खेल टूर्नामेंट।',
      image: '⚽'
    }
  ];

  return (
    <div className="events-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>{t('events.title')}</h1>
          <p>{t('events.subtitle')}</p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="upcoming-events">
        <div className="container">
          <div className="section-header">
            <h2>{t('events.upcomingEvents')}</h2>
            <div className="underline"></div>
          </div>
          <div className="events-grid">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="event-card upcoming">
                <div className="event-icon">{event.icon}</div>
                <div className="event-content">
                  <h3>{event.title}</h3>
                  <div className="event-details">
                    <p><span className="detail-icon">📅</span> {event.date}</p>
                    <p><span className="detail-icon">🕐</span> {event.time}</p>
                    <p><span className="detail-icon">📍</span> {event.location}</p>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <button className="register-btn">{t('events.registerBtn')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Calendar CTA */}
      <section className="calendar-section">
        <div className="container">
          <div className="calendar-content">
            <div className="calendar-icon">📆</div>
            <h2>{t('events.stayUpdated')}</h2>
            <p>{t('events.subscribeText')}</p>
            <div className="subscribe-form">
              <input type="email" placeholder={language === 'en' ? 'Enter your email' : 'अपना ईमेल दर्ज करें'} />
              <button className="subscribe-btn">{t('events.subscribeBtn')}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="past-events">
        <div className="container">
          <div className="section-header">
            <h2>{t('events.pastEvents')}</h2>
            <div className="underline"></div>
          </div>
          <div className="past-events-grid">
            {pastEvents.map((event, index) => (
              <div key={index} className="past-event-card">
                <div className="past-event-image">
                  <div className="image-placeholder">{event.image}</div>
                  <div className="event-overlay">
                    <button className="view-photos-btn">{language === 'en' ? 'View Photos' : 'फोटो देखें'}</button>
                  </div>
                </div>
                <div className="past-event-content">
                  <h3>{event.title}</h3>
                  <p className="event-date">📅 {event.date}</p>
                  <p className="event-location">📍 {event.location}</p>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="event-types">
        <div className="container">
          <div className="section-header">
            <h2>{t('events.whatWeOrganize')}</h2>
            <div className="underline"></div>
          </div>
          <div className="types-grid">
            <div className="type-card">
              <div className="type-icon">🎭</div>
              <h3>{language === 'en' ? 'Cultural Events' : 'सांस्कृतिक कार्यक्रम'}</h3>
              <p>{language === 'en' ? 'Traditional celebrations, festivals, and cultural programs' : 'पारंपरिक समारोह, त्योहार और सांस्कृतिक कार्यक्रम'}</p>
            </div>
            <div className="type-card">
              <div className="type-icon">🎓</div>
              <h3>{language === 'en' ? 'Educational Programs' : 'शैक्षणिक कार्यक्रम'}</h3>
              <p>{language === 'en' ? 'Workshops, seminars, and skill development sessions' : 'कार्यशालाएं, सेमिनार और कौशल विकास सत्र'}</p>
            </div>
            <div className="type-card">
              <div className="type-icon">🤝</div>
              <h3>{language === 'en' ? 'Social Welfare' : 'सामाजिक कल्याण'}</h3>
              <p>{language === 'en' ? 'Blood donation camps, health checkups, and community service' : 'रक्तदान शिविर, स्वास्थ्य जांच और सामुदायिक सेवा'}</p>
            </div>
            <div className="type-card">
              <div className="type-icon">⚽</div>
              <h3>{language === 'en' ? 'Sports Activities' : 'खेल गतिविधियां'}</h3>
              <p>{language === 'en' ? 'Tournaments, fitness camps, and recreational activities' : 'टूर्नामेंट, फिटनेस कैंप और मनोरंजन गतिविधियां'}</p>
            </div>
            <div className="type-card">
              <div className="type-icon">💼</div>
              <h3>{language === 'en' ? 'Networking Events' : 'नेटवर्किंग इवेंट्स'}</h3>
              <p>{language === 'en' ? 'Business meets, professional gatherings, and career guidance' : 'व्यावसायिक बैठकें, पेशेवर समारोह और करियर मार्गदर्शन'}</p>
            </div>
            <div className="type-card">
              <div className="type-icon">👨‍👩‍👧‍👦</div>
              <h3>{language === 'en' ? 'Family Gatherings' : 'पारिवारिक समारोह'}</h3>
              <p>{language === 'en' ? 'Community picnics, family days, and social meetups' : 'सामुदायिक पिकनिक, परिवार के दिन और सामाजिक बैठकें'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
