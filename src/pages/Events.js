import React from 'react';
import './Events.css';

const Events = () => {
  const upcomingEvents = [
    {
      title: 'Annual Community Gathering 2025',
      date: 'January 15, 2025',
      time: '10:00 AM - 6:00 PM',
      location: 'Jaipur Convention Center',
      description: 'Join us for our annual gathering with cultural programs, discussions, and networking.',
      icon: '🎉'
    },
    {
      title: 'Youth Leadership Summit',
      date: 'February 20, 2025',
      time: '9:00 AM - 4:00 PM',
      location: 'Udaipur Resort',
      description: 'Empowering young leaders through workshops, mentorship, and skill development.',
      icon: '🎓'
    },
    {
      title: 'Cultural Heritage Festival',
      date: 'March 10, 2025',
      time: '5:00 PM - 10:00 PM',
      location: 'City Palace, Jaipur',
      description: 'Celebrate our rich heritage with traditional performances, art, and cuisine.',
      icon: '🎭'
    }
  ];

  const pastEvents = [
    {
      title: 'Scholarship Distribution Ceremony',
      date: 'October 20, 2024',
      location: 'Community Hall, Jaipur',
      description: 'Awarded scholarships to 50 meritorious students from our community.',
      image: '🎓'
    },
    {
      title: 'Diwali Celebration 2024',
      date: 'November 1, 2024',
      location: 'Community Center',
      description: 'Grand Diwali celebration with traditional rituals and community dinner.',
      image: '🪔'
    },
    {
      title: 'Blood Donation Camp',
      date: 'September 15, 2024',
      location: 'City Hospital',
      description: 'Organized blood donation camp with participation from 100+ members.',
      image: '💉'
    },
    {
      title: 'Sports Tournament',
      date: 'August 5, 2024',
      location: 'Sports Complex',
      description: 'Inter-city sports tournament promoting fitness and unity.',
      image: '⚽'
    }
  ];

  return (
    <div className="events-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Events & Activities</h1>
          <p>Bringing Our Community Together</p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="upcoming-events">
        <div className="container">
          <div className="section-header">
            <h2>Upcoming Events</h2>
            <div className="underline"></div>
            <p className="section-subtitle">Mark your calendars for these exciting events</p>
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
                  <button className="register-btn">Register Now</button>
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
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter to receive updates about upcoming events and activities</p>
            <div className="subscribe-form">
              <input type="email" placeholder="Enter your email" />
              <button className="subscribe-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="past-events">
        <div className="container">
          <div className="section-header">
            <h2>Past Events</h2>
            <div className="underline"></div>
            <p className="section-subtitle">Celebrating our successful community gatherings</p>
          </div>
          <div className="past-events-grid">
            {pastEvents.map((event, index) => (
              <div key={index} className="past-event-card">
                <div className="past-event-image">
                  <div className="image-placeholder">{event.image}</div>
                  <div className="event-overlay">
                    <button className="view-photos-btn">View Photos</button>
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
            <h2>What We Organize</h2>
            <div className="underline"></div>
          </div>
          <div className="types-grid">
            <div className="type-card">
              <div className="type-icon">🎭</div>
              <h3>Cultural Events</h3>
              <p>Traditional celebrations, festivals, and cultural programs</p>
            </div>
            <div className="type-card">
              <div className="type-icon">🎓</div>
              <h3>Educational Programs</h3>
              <p>Workshops, seminars, and skill development sessions</p>
            </div>
            <div className="type-card">
              <div className="type-icon">🤝</div>
              <h3>Social Welfare</h3>
              <p>Blood donation camps, health checkups, and community service</p>
            </div>
            <div className="type-card">
              <div className="type-icon">⚽</div>
              <h3>Sports Activities</h3>
              <p>Tournaments, fitness camps, and recreational activities</p>
            </div>
            <div className="type-card">
              <div className="type-icon">💼</div>
              <h3>Networking Events</h3>
              <p>Business meets, professional gatherings, and career guidance</p>
            </div>
            <div className="type-card">
              <div className="type-icon">👨‍👩‍👧‍👦</div>
              <h3>Family Gatherings</h3>
              <p>Community picnics, family days, and social meetups</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
