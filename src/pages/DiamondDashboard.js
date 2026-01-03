import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DiamondDashboard.css';

const DiamondDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingMembers, setPendingMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
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

  // Check authentication and user data
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    if (!user) {
      setMessage('Loading user data...');
      return;
    }
    
    if (!user.phone) {
      setMessage('Session expired. Please logout and login again.');
      return;
    }
    
    if (user.membershipTier !== 'diamond') {
      setMessage('Diamond membership required');
      return;
    }
  }, [user, isAuthenticated, navigate]);

  const fetchPendingMembers = useCallback(async () => {
    if (!user || !user.phone) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/members/members/pending`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: user.phone
        })
      });

      const data = await response.json();
      if (data.success) {
        setPendingMembers(data.users);
        setMessage('');
      } else {
        setMessage(data.message || 'Failed to fetch pending members');
      }
    } catch (error) {
      console.error('Error fetching pending members:', error);
      setMessage('Error fetching pending members');
    }
    setLoading(false);
  }, [user, API_URL]);

  const fetchEvents = useCallback(async () => {
    if (!user || !user.phone) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: user.phone
        })
      });
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setLoading(false);
  }, [user, API_URL]);

  const fetchGallery = useCallback(async () => {
    if (!user || !user.phone) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: user.phone
        })
      });
      const data = await response.json();
      if (data.success) {
        setGallery(data.photos || []);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
    setLoading(false);
  }, [user, API_URL]);

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingMembers();
    } else if (activeTab === 'events') {
      fetchEvents();
    } else if (activeTab === 'gallery') {
      fetchGallery();
    }
  }, [activeTab, fetchPendingMembers, fetchEvents, fetchGallery]);

  const approveMember = async (id, tier) => {
    if (!user || !user.phone) return;
    
    try {
      const response = await fetch(`${API_URL}/members/members/approve/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: user.phone,
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
    if (!user || !user.phone) return;
    
    try {
      const response = await fetch(`${API_URL}/members/members/reject/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: user.phone,
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
    if (!user || !user.phone) {
      setMessage('User session invalid. Please logout and login again.');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', eventForm.title);
    formData.append('description', eventForm.description);
    formData.append('date', eventForm.date);
    formData.append('location', eventForm.location);
    formData.append('phone', user.phone);
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
    if (!user || !user.phone) return;

    try {
      const response = await fetch(`${API_URL}/members/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: user.phone
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
    if (!user || !user.phone) {
      setMessage('User session invalid. Please logout and login again.');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', galleryForm.title);
    formData.append('description', galleryForm.description);
    formData.append('category', galleryForm.category);
    formData.append('phone', user.phone);
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
    if (!user || !user.phone) return;

    try {
      const response = await fetch(`${API_URL}/members/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: user.phone
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
                <div className="members-table-container">
                  <table className="members-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>City</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingMembers.map(member => (
                        <tr key={member._id}>
                          <td>{member.fullName}</td>
                          <td>{member.phone}</td>
                          <td>{member.email}</td>
                          <td>{member.city}, {member.state}</td>
                          <td>
                            <button 
                              className="view-details-btn"
                              onClick={() => {
                                setSelectedMember(member);
                                setShowMemberModal(true);
                              }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Member Details Modal */}
              {showMemberModal && selectedMember && (
                <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setShowMemberModal(false)}>×</button>
                    <h2>{selectedMember.fullName}</h2>
                    
                    <div className="modal-details">
                      <div className="detail-section">
                        <h3>Personal Information</h3>
                        <div className="detail-row">
                          <span className="detail-label">Full Name:</span>
                          <span className="detail-value">{selectedMember.fullName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Father's Name:</span>
                          <span className="detail-value">{selectedMember.fatherName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Date of Birth:</span>
                          <span className="detail-value">{new Date(selectedMember.dateOfBirth).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Gender:</span>
                          <span className="detail-value">{selectedMember.gender}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Education:</span>
                          <span className="detail-value">{selectedMember.education}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Occupation:</span>
                          <span className="detail-value">{selectedMember.occupation}</span>
                        </div>
                      </div>
                      
                      <div className="detail-section">
                        <h3>Contact Information</h3>
                        <div className="detail-row">
                          <span className="detail-label">Phone:</span>
                          <span className="detail-value">{selectedMember.phone}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Email:</span>
                          <span className="detail-value">{selectedMember.email}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Address:</span>
                          <span className="detail-value">{selectedMember.address}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">City:</span>
                          <span className="detail-value">{selectedMember.city}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">State:</span>
                          <span className="detail-value">{selectedMember.state}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Pincode:</span>
                          <span className="detail-value">{selectedMember.pincode}</span>
                        </div>
                      </div>
                      
                      <div className="detail-section">
                        <h3>Documents</h3>
                        {selectedMember.photoPath && (
                          <div className="detail-row">
                            <span className="detail-label">Photo:</span>
                            <a 
                              href={`${API_URL.replace('/api', '')}/uploads/${selectedMember.photoPath}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="pdf-link"
                            >
                              View Photo 📷
                            </a>
                          </div>
                        )}
                        {selectedMember.idProofPath && (
                          <div className="detail-row">
                            <span className="detail-label">ID Proof:</span>
                            <a 
                              href={`${API_URL.replace('/api', '')}/uploads/${selectedMember.idProofPath}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="pdf-link"
                            >
                              View PDF 📄
                            </a>
                          </div>
                        )}
                        {selectedMember.addressProofPath && (
                          <div className="detail-row">
                            <span className="detail-label">Address Proof:</span>
                            <a 
                              href={`${API_URL.replace('/api', '')}/uploads/${selectedMember.addressProofPath}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="pdf-link"
                            >
                              View PDF 📄
                            </a>
                          </div>
                        )}
                        {selectedMember.donationDocumentPath && (
                          <div className="detail-row">
                            <span className="detail-label">Donation Document:</span>
                            <a 
                              href={`${API_URL.replace('/api', '')}/uploads/${selectedMember.donationDocumentPath}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="pdf-link"
                            >
                              View PDF 📄
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="modal-actions">
                      <button 
                        className="approve-btn silver-btn"
                        onClick={() => {
                          approveMember(selectedMember._id, 'silver');
                          setShowMemberModal(false);
                        }}
                      >
                        Approve as Silver
                      </button>
                      <button 
                        className="approve-btn gold-btn"
                        onClick={() => {
                          approveMember(selectedMember._id, 'gold');
                          setShowMemberModal(false);
                        }}
                      >
                        Approve as Gold
                      </button>
                      <button 
                        className="approve-btn diamond-btn"
                        onClick={() => {
                          approveMember(selectedMember._id, 'diamond');
                          setShowMemberModal(false);
                        }}
                      >
                        Approve as Diamond
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => {
                          const reason = prompt('Enter rejection reason:');
                          if (reason) {
                            rejectMember(selectedMember._id, reason);
                            setShowMemberModal(false);
                          }
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
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
