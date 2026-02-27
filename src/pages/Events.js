import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import './Events.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Events = () => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/events`);
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const isUpcoming = (dateStr) => {
    return new Date(dateStr) >= new Date();
  };

  const upcomingEvents = events.filter(event => isUpcoming(event.date));
  const pastEvents = events.filter(event => !isUpcoming(event.date));

  return (
    <div className="events-page">
      <section className="events-hero">
        <div className="container">
          <h1>{t('header.events')}</h1>
          <p>{language === 'en' 
            ? 'Stay connected with our community events and celebrations' 
            : 'हमारे सामुदायिक कार्यक्रमों और समारोहों से जुड़े रहें'}</p>
        </div>
      </section>

      <section className="events-content">
        <div className="container">
          {/* Upcoming Events
          <div className="events-section">
            <h2 className="section-title">
              {language === 'en' ? 'Upcoming Events' : 'आगामी कार्यक्रम'}
            </h2>
            
            {loading ? (
              <p>{language === 'en' ? 'Loading events...' : 'कार्यक्रम लोड हो रहे हैं...'}</p>
            ) : upcomingEvents.length === 0 ? (
              <div className="no-events">
                <p>{language === 'en' 
                  ? 'No upcoming events at the moment. Check back soon!' 
                  : 'फिलहाल कोई आगामी कार्यक्रम नहीं है। जल्द ही वापस जांचें!'}</p>
              </div>
            ) : (
              <div className="events-grid">
                {upcomingEvents.map((event) => (
                  <div key={event._id} className="event-card upcoming">
                    <div className="event-img-wrap">
                      {event.imagePath ? (
                        <img src={event.imagePath} alt={event.title} className="event-photo" />
                      ) : (
                        <div className="event-photo-placeholder">🎉</div>
                      )}
                      <span className="event-badge upcoming-badge">{language === 'en' ? 'Upcoming' : 'आगामी'}</span>
                    </div>
                    <div className="event-body">
                      <h3>{event.title}</h3>
                      <p className="event-desc">{event.description}</p>
                      <div className="event-meta">
                        <span>📅 {new Date(event.date).toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>📍 {event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div> */}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div className="events-section">
              <h2 className="section-title">
                {language === 'en' ? 'Past Events' : 'पिछले कार्यक्रम'}
              </h2>
              
              <div className="events-grid">
                {pastEvents.map((event) => (
                  <div key={event._id} className="event-card past">
                    <div className="event-img-wrap">
                      {event.imagePath ? (
                        <img src={event.imagePath} alt={event.title} className="event-photo" />
                      ) : (
                        <div className="event-photo-placeholder">📅</div>
                      )}
                      <span className="event-badge past-badge">{language === 'en' ? 'Past' : 'पिछला'}</span>
                    </div>
                    <div className="event-body">
                      <h3>{event.title}</h3>
                      <p className="event-desc">{event.description}</p>
                      <div className="event-meta">
                        <span>📅 {new Date(event.date).toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>📍 {event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
