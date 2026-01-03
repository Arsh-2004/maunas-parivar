import React, { useState, useEffect } from 'react';
import './DiamondDashboard.css';

const DiamondDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingMembers, setPendingMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Event form
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: null
  });
  
  // Gallery form
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    category: 'events',
    photo: null
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingMembers();
    } else if (activeTab === 'events') {
      fetchEvents();
    } else if (activeTab === 'gallery') {
      fetchGallery();
    }
  }, [activeTab]);

  const fetchPendingMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/members/members/pending`, {
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
        setPendingMembers(data.users);
      }
    } catch (error) {
      console.error('Error fetching pending members:', error);
    }
    setLoading(false);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/events`);
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setLoading(false);
  };

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/gallery`);
      const data = await response.json();
      if (data.success) {
        setGallery(data.photos || []);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
    setLoading(false);
  };

  const approveMember = async (id, tier) => {
    try {
      const response = await fetch(`${API_URL}/members/members/approve/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: user.phone,
          password: user.password,
          membershipTier: tier
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage(`Member approved as ${tier}!`);
        fetchPendingMembers();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error approving member:', error);
      setMessage('Failed to approve member');
    }
  };

  const rejectMember = async (id, reason) => {
    try {
      const response = await fetch(`${API_URL}/members/members/reject/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: user.phone,
          password: user.password,
          rejectionReason: reason
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Member rejected');
        fetchPendingMembers();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error rejecting member:', error);
      setMessage('Failed to reject member');
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', eventForm.title);
    formData.append('description', eventForm.description);
    formData.append('date', eventForm.date);
    formData.append('location', eventForm.location);
    formData.append('phone', user.phone);
    formData.append('password', user.password);
    if (eventForm.image) {
      formData.append('image', eventForm.image);
    }

    try {
      const response = await fetch(`${API_URL}/members/events`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Event created successfully!');
        fetchEvents();
        setEventForm({ title: '', description: '', date: '', location: '', image: null });
        document.querySelector('input[type="file"]').value = '';
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to create event');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setMessage('Failed to create event');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`${API_URL}/members/events/${id}`, {
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
        setMessage('Event deleted successfully!');
        fetchEvents();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setMessage('Failed to delete event');
    }
  };

  const uploadGalleryPhoto = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', galleryForm.title);
    formData.append('description', galleryForm.description);
    formData.append('category', galleryForm.category);
    formData.append('phone', user.phone);
    formData.append('password', user.password);
    if (galleryForm.photo) {
      formData.append('photo', galleryForm.photo);
    }

    try {
      const response = await fetch(`${API_URL}/members/gallery`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Photo uploaded successfully!');
        fetchGallery();
        setGalleryForm({ title: '', description: '', category: 'events', photo: null });
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to upload photo');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setMessage('Failed to upload photo');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteGalleryPhoto = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`${API_URL}/members/gallery/${id}`, {
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
        setMessage('Photo deleted successfully!');
        fetchGallery();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      setMessage('Failed to delete photo');
    }
  };

  return (
    <div className="diamond-dashboard">
      <h1>💎 Diamond Member Dashboard</h1>
      {message && <div className="message">{message}</div>}

      <div className="tabs">
        <button 
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Pending Members
        </button>
        <button 
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          Manage Events
        </button>
        <button 
          className={activeTab === 'gallery' ? 'active' : ''}
          onClick={() => setActiveTab('gallery')}
        >
          Manage Gallery
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {activeTab === 'pending' && (
            <div className="pending-members">
              <h2>Approve New Members</h2>
              {pendingMembers.length === 0 ? (
                <p>No pending members</p>
              ) : (
                pendingMembers.map(member => (
                  <div key={member._id} className="member-card">
                    <h3>{member.fullName}</h3>
                    <p>Phone: {member.phone}</p>
                    <p>Email: {member.email}</p>
                    <p>City: {member.city}, {member.state}</p>
                    <div className="approve-actions">
                      <button onClick={() => approveMember(member._id, 'silver')}>
                        Approve as Silver
                      </button>
                      <button onClick={() => approveMember(member._id, 'gold')}>
                        Approve as Gold
                      </button>
                      <button onClick={() => approveMember(member._id, 'diamond')}>
                        Approve as Diamond
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => {
                          const reason = prompt('Enter rejection reason:');
                          if (reason) rejectMember(member._id, reason);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-management">
              <h2>Manage Events</h2>
              
              <form onSubmit={createEvent} className="event-form">
                <h3>Create New Event</h3>
                <input
                  type="text"
                  placeholder="Event Title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Event Description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  required
                  rows="4"
                />
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEventForm({...eventForm, image: e.target.files[0]})}
                />
                <button type="submit">Create Event</button>
              </form>

              <div className="events-list">
                <h3>Existing Events</h3>
                {events.length === 0 ? (
                  <p>No events yet</p>
                ) : (
                  events.map(event => (
                    <div key={event._id} className="event-item">
                      {event.imagePath && (
                        <img 
                          src={`${API_URL.replace('/api', '')}/uploads/${event.imagePath}`}
                          alt={event.title}
                        />
                      )}
                      <div className="event-info">
                        <h4>{event.title}</h4>
                        <p>{event.description}</p>
                        <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                        <p>📍 {event.location}</p>
                        {event.volunteers && event.volunteers.length > 0 && (
                          <p>👥 {event.volunteers.length} volunteer(s)</p>
                        )}
                        <button 
                          className="delete-btn"
                          onClick={() => deleteEvent(event._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="gallery-management">
              <h2>Manage Gallery</h2>
              
              <form onSubmit={uploadGalleryPhoto} className="gallery-form">
                <h3>Upload New Photo</h3>
                <input
                  type="text"
                  placeholder="Photo Title"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Photo Description"
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
                  required
                  rows="3"
                />
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value})}
                  required
                >
                  <option value="events">Events</option>
                  <option value="community">Community</option>
                  <option value="festivals">Festivals</option>
                  <option value="activities">Activities</option>
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGalleryForm({...galleryForm, photo: e.target.files[0]})}
                  required
                />
                <button type="submit">Upload Photo</button>
              </form>

              <div className="gallery-grid">
                <h3>Existing Photos</h3>
                {gallery.length === 0 ? (
                  <p>No photos yet</p>
                ) : (
                  gallery.map(photo => (
                    <div key={photo._id} className="gallery-item">
                      <img 
                        src={`${API_URL.replace('/api', '')}/uploads/${photo.imagePath}`}
                        alt={photo.title}
                      />
                      <div className="gallery-info">
                        <h4>{photo.title}</h4>
                        <p>{photo.description}</p>
                        <span className="category-badge">{photo.category}</span>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteGalleryPhoto(photo._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DiamondDashboard;
