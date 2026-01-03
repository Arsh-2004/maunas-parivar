import React, { useState, useEffect, useCallback } from 'react';
import './GoldDashboard.css';

const GoldDashboard = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [myVolunteers, setMyVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchUpcomingEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/members/events/upcoming`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: user.phone,
          password: user.password
        })
      });

      const data = await response.json();
      if (data.success) {
        setUpcomingEvents(data.events);
        
        // Find events user has volunteered for
        const volunteeredEvents = data.events.filter(event => 
          event.volunteers?.some(v => v.phone === user.phone)
        );
        setMyVolunteers(volunteeredEvents.map(e => e._id));
      }
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    }
    setLoading(false);
  }, [API_URL, user.password, user.phone]);

  useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  const volunteerForEvent = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/members/events/${eventId}/volunteer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: user.phone,
          password: user.password
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Successfully volunteered for the event!');
        fetchUpcomingEvents();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to volunteer');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error volunteering:', error);
      setMessage('Failed to volunteer for event');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const cancelVolunteer = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/members/events/${eventId}/volunteer`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: user.phone,
          password: user.password
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Volunteer registration cancelled');
        fetchUpcomingEvents();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error cancelling volunteer:', error);
      setMessage('Failed to cancel registration');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="gold-dashboard">
      <h1>🥇 Gold Member Dashboard</h1>
      <p className="subtitle">View upcoming events and volunteer to help!</p>
      
      {message && <div className="message">{message}</div>}

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="events-grid">
          {upcomingEvents.length === 0 ? (
            <p>No upcoming events at this time.</p>
          ) : (
            upcomingEvents.map(event => {
              const isVolunteered = myVolunteers.includes(event._id);
              const volunteerCount = event.volunteers?.length || 0;

              return (
                <div key={event._id} className="event-card">
                  {event.imagePath && (
                    <img 
                      src={`${API_URL.replace('/api', '')}/uploads/${event.imagePath}`}
                      alt={event.title}
                      className="event-image"
                    />
                  )}
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <p className="event-date">
                      📅 {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="event-location">📍 {event.location}</p>
                    <p className="event-description">{event.description}</p>
                    <p className="volunteer-count">
                      👥 {volunteerCount} volunteer{volunteerCount !== 1 ? 's' : ''}
                    </p>
                    
                    {isVolunteered ? (
                      <button 
                        className="volunteer-btn volunteered"
                        onClick={() => cancelVolunteer(event._id)}
                      >
                        ✓ Volunteered - Click to Cancel
                      </button>
                    ) : (
                      <button 
                        className="volunteer-btn"
                        onClick={() => volunteerForEvent(event._id)}
                      >
                        Volunteer for this Event
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default GoldDashboard;
