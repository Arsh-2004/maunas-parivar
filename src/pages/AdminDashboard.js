import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '', image: null });
  const [galleryForm, setGalleryForm] = useState({ title: '', description: '', category: 'general', image: null });
  const [showUserModal, setShowUserModal] = useState(false);

  // Admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        setAdminPassword(password);
        localStorage.setItem('adminPassword', password);
        fetchUsers();
        fetchStats();
        fetchEvents();
        fetchGallery();
      } else {
        setError(language === 'en' ? 'Invalid admin password' : 'गलत व्यवस्थापक पासवर्ड');
      }
    } catch (err) {
      setError(language === 'en' ? 'Connection error' : 'कनेक्शन त्रुटि');
    }
  };

  // Check stored admin session
  useEffect(() => {
    const storedPassword = localStorage.getItem('adminPassword');
    if (storedPassword) {
      setAdminPassword(storedPassword);
      setIsLoggedIn(true);
      fetchUsers();
      fetchStats();
      fetchEvents();
      fetchGallery();
    }
  }, []);

  // Fetch users
  const fetchUsers = async (searchTerm = '') => {
    setLoading(true);
    const storedPassword = localStorage.getItem('adminPassword');
    
    try {
      const url = searchTerm 
        ? `${API_URL}/admin/search?query=${encodeURIComponent(searchTerm)}`
        : `${API_URL}/admin/users`;
        
      const response = await fetch(url, {
        headers: { 'x-admin-password': storedPassword },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
    setLoading(false);
  };

  // Fetch stats
  const fetchStats = async () => {
    const storedPassword = localStorage.getItem('adminPassword');
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'x-admin-password': storedPassword },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Approve user
  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/admin/approve/${userId}`, {
        method: 'PUT',
        headers: { 'x-admin-password': adminPassword },
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error('Error approving user:', err);
    }
  };

  // Reject user
  const handleReject = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/admin/reject/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
        setSelectedUser(null);
        setRejectReason('');
      }
    } catch (err) {
      console.error('Error rejecting user:', err);
    }
  };

  // Set to pending
  const handleSetPending = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/admin/set-pending/${userId}`, {
        method: 'PUT',
        headers: { 'x-admin-password': adminPassword },
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error('Error setting pending:', err);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm(language === 'en' ? 'Are you sure you want to delete this user?' : 'क्या आप वाकई इस उपयोगकर्ता को हटाना चाहते हैं?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/admin/delete/${userId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': adminPassword },
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Update membership tier
  const handleUpdateTier = async (userId, tier) => {
    try {
      const response = await fetch(`${API_URL}/admin/update-tier/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword
        },
        body: JSON.stringify({ tier }),
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Error updating tier:', err);
    }
  };

  // Event management
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/events`);
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', eventForm.title);
    formData.append('description', eventForm.description);
    formData.append('date', eventForm.date);
    formData.append('location', eventForm.location);
    if (eventForm.image) {
      formData.append('image', eventForm.image);
    }

    try {
      const response = await fetch(`${API_URL}/admin/events`, {
        method: 'POST',
        headers: { 'x-admin-password': adminPassword },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert(language === 'en' ? 'Event created successfully!' : 'कार्यक्रम सफलतापूर्वक बनाया गया!');
        fetchEvents();
        setEventForm({ title: '', description: '', date: '', location: '', image: null });
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        alert(language === 'en' ? `Failed to create event: ${data.message}` : `कार्यक्रम बनाने में विफल: ${data.message}`);
      }
    } catch (err) {
      console.error('Error creating event:', err);
      alert(language === 'en' ? 'Error creating event. Please try again.' : 'कार्यक्रम बनाने में त्रुटि। कृपया पुनः प्रयास करें।');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await fetch(`${API_URL}/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': adminPassword },
      });
      const data = await response.json();
      if (data.success) {
        fetchEvents();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  // Gallery management
  const fetchGallery = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/gallery`);
      const data = await response.json();
      if (data.success) {
        setGallery(data.photos);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    
    if (!galleryForm.image) {
      alert(language === 'en' ? 'Please select an image to upload' : 'कृपया अपलोड करने के लिए एक छवि चुनें');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', galleryForm.title);
    formData.append('description', galleryForm.description);
    formData.append('category', galleryForm.category);
    formData.append('image', galleryForm.image);

    try {
      const response = await fetch(`${API_URL}/admin/gallery`, {
        method: 'POST',
        headers: { 'x-admin-password': adminPassword },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert(language === 'en' ? 'Photo uploaded successfully!' : 'फोटो सफलतापूर्वक अपलोड की गई!');
        fetchGallery();
        setGalleryForm({ title: '', description: '', category: 'general', image: null });
        // Reset file input
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
      } else {
        alert(language === 'en' ? `Failed to upload photo: ${data.message}` : `फोटो अपलोड करने में विफल: ${data.message}`);
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert(language === 'en' ? 'Error uploading photo. Please try again.' : 'फोटो अपलोड करने में त्रुटि। कृपया पुनः प्रयास करें।');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    
    try {
      const response = await fetch(`${API_URL}/admin/gallery/${photoId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': adminPassword },
      });
      const data = await response.json();
      if (data.success) {
        fetchGallery();
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  // Filter users by status
  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(user => user.status === filter);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminPassword('');
    localStorage.removeItem('adminPassword');
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h2>{language === 'en' ? 'Admin Login' : 'व्यवस्थापक लॉगिन'}</h2>
          <form onSubmit={handleAdminLogin}>
            <input
              type="password"
              placeholder={language === 'en' ? 'Enter Admin Password' : 'व्यवस्थापक पासवर्ड दर्ज करें'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{language === 'en' ? 'Login' : 'लॉगिन करें'}</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>📊 {language === 'en' ? 'Admin Dashboard' : 'व्यवस्थापक डैशबोर्ड'}</h1>
        <button onClick={handleLogout} className="logout-btn">
          {language === 'en' ? 'Logout' : 'लॉगआउट'}
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          {language === 'en' ? 'Members' : 'सदस्य'}
        </button>
        <button 
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          {language === 'en' ? 'Events' : 'कार्यक्रम'}
        </button>
        <button 
          className={activeTab === 'gallery' ? 'active' : ''}
          onClick={() => setActiveTab('gallery')}
        >
          {language === 'en' ? 'Gallery' : 'गैलरी'}
        </button>
      </div>

      {activeTab === 'users' && (
        <>
          <div className="stats-grid">
            <div className="stat-card pending-card">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">{language === 'en' ? 'Pending' : 'लंबित'}</div>
            </div>
            <div className="stat-card approved-card">
              <div className="stat-number">{stats.approved}</div>
              <div className="stat-label">{language === 'en' ? 'Approved' : 'स्वीकृत'}</div>
            </div>
            <div className="stat-card rejected-card">
              <div className="stat-number">{stats.rejected}</div>
              <div className="stat-label">{language === 'en' ? 'Rejected' : 'अस्वीकृत'}</div>
            </div>
            <div className="stat-card total-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">{language === 'en' ? 'Total' : 'कुल'}</div>
            </div>
          </div>

          <div className="filter-tabs">
            <button 
              onClick={() => setFilter('pending')} 
              className={filter === 'pending' ? 'active' : ''}
            >
              {language === 'en' ? 'Pending' : 'लंबित'}
            </button>
            <button 
              onClick={() => setFilter('approved')} 
              className={filter === 'approved' ? 'active' : ''}
            >
              {language === 'en' ? 'Approved' : 'स्वीकृत'}
            </button>
            <button 
              onClick={() => setFilter('rejected')} 
              className={filter === 'rejected' ? 'active' : ''}
            >
              {language === 'en' ? 'Rejected' : 'अस्वीकृत'}
            </button>
          </div>

          {loading ? (
            <p className="loading-text">{language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}</p>
          ) : (
            <div className="members-table-container">
              {filteredUsers.length === 0 ? (
                <p className="no-data">{language === 'en' ? 'No registrations found' : 'कोई पंजीकरण नहीं मिला'}</p>
              ) : (
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>{language === 'en' ? 'Name' : 'नाम'}</th>
                      <th>{language === 'en' ? 'Phone' : 'फोन'}</th>
                      <th>{language === 'en' ? 'Date' : 'तारीख'}</th>
                      <th>{language === 'en' ? 'Tier' : 'स्तर'}</th>
                      <th>{language === 'en' ? 'Action' : 'कार्यवाई'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.fullName}</td>
                        <td>{user.phone}</td>
                        <td>{new Date(user.registeredAt).toLocaleDateString('en-GB')}</td>
                        <td>
                          <select
                            value={user.membershipTier || 'silver'}
                            onChange={(e) => handleUpdateTier(user._id, e.target.value)}
                            className="tier-dropdown-inline"
                          >
                            <option value="silver">Silver</option>
                            <option value="gold">Gold</option>
                            <option value="diamond">Diamond</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="view-btn-inline"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                          >
                            {language === 'en' ? 'View' : 'देखें'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {showUserModal && selectedUser && (
            <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowUserModal(false)}>×</button>
                <h2>{selectedUser.fullName}</h2>
                <div className="modal-details">
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? "Father's Name:" : 'पिता का नाम:'}</span>
                    <span className="detail-value">{selectedUser.fatherName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Date of Birth:' : 'जन्म तिथि:'}</span>
                    <span className="detail-value">{new Date(selectedUser.dateOfBirth).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Gender:' : 'लिंग:'}</span>
                    <span className="detail-value">{selectedUser.gender}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Phone:' : 'फोन:'}</span>
                    <span className="detail-value">{selectedUser.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Email:' : 'ईमेल:'}</span>
                    <span className="detail-value">{selectedUser.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Address:' : 'पता:'}</span>
                    <span className="detail-value">{selectedUser.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'City:' : 'शहर:'}</span>
                    <span className="detail-value">{selectedUser.city}, {selectedUser.state} - {selectedUser.pincode}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Occupation:' : 'व्यवसाय:'}</span>
                    <span className="detail-value">{selectedUser.occupation}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Education:' : 'शिक्षा:'}</span>
                    <span className="detail-value">{selectedUser.education}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'ID Proof:' : 'पहचान प्रमाण:'}</span>
                    <a href={`${API_URL.replace('/api', '')}/uploads/${selectedUser.idProofPath}`} target="_blank" rel="noreferrer" className="pdf-link">
                      PDF {language === 'en' ? 'View' : 'देखें'} 📄
                    </a>
                  </div>
                </div>
                
                {selectedUser.status === 'pending' && (
                  <div className="modal-actions">
                    <select
                      value={selectedUser.membershipTier || 'silver'}
                      onChange={(e) => handleUpdateTier(selectedUser._id, e.target.value)}
                      className="tier-dropdown"
                    >
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="diamond">Diamond</option>
                    </select>
                    <button className="approve-btn" onClick={() => { handleApprove(selectedUser._id); setShowUserModal(false); }}>
                      {language === 'en' ? 'Approve' : 'स्वीकृत करें'}
                    </button>
                    <button className="reject-btn" onClick={() => {
                      const reason = prompt(language === 'en' ? 'Enter rejection reason:' : 'अस्वीकृति कारण दर्ज करें:');
                      if (reason) {
                        handleReject(selectedUser._id, reason);
                        setShowUserModal(false);
                      }
                    }}>
                      {language === 'en' ? 'Reject' : 'अस्वीकृत करें'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'events' && (
        <div className="events-management">
          <div className="event-form">
            <h2>{language === 'en' ? 'Add New Event' : 'नया कार्यक्रम जोड़ें'}</h2>
            <form onSubmit={handleEventSubmit}>
              <input
                type="text"
                placeholder={language === 'en' ? 'Event Title' : 'कार्यक्रम शीर्षक'}
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                required
              />
              <textarea
                placeholder={language === 'en' ? 'Event Description' : 'कार्यक्रम विवरण'}
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                required
              />
              <div className="date-input-wrapper">
                <label>{language === 'en' ? 'Event Date:' : 'कार्यक्रम तिथि:'}</label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                  required
                  className="date-input"
                />
              </div>
              <input
                type="text"
                placeholder={language === 'en' ? 'Location' : 'स्थान'}
                value={eventForm.location}
                onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                required
              />
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>
                  {language === 'en' ? 'Event Image (optional):' : 'कार्यक्रम छवि (वैकल्पिक):'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEventForm({...eventForm, image: e.target.files[0]})}
                />
                {eventForm.image && (
                  <p style={{marginTop: '5px', color: '#28a745', fontSize: '14px'}}>
                    ✓ {eventForm.image.name}
                  </p>
                )}
              </div>
              <button type="submit">{language === 'en' ? 'Add Event' : 'कार्यक्रम जोड़ें'}</button>
            </form>
          </div>

          <div className="events-list">
            <h2>{language === 'en' ? 'All Events' : 'सभी कार्यक्रम'}</h2>
            <div className="events-grid">
              {events.map((event) => (
                <div key={event._id} className="event-card">
                  {event.imagePath && (
                    <img src={`${API_URL.replace('/api', '')}/uploads/${event.imagePath}`} alt={event.title} />
                  )}
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <p><strong>{language === 'en' ? 'Date:' : 'तिथि:'}</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>{language === 'en' ? 'Location:' : 'स्थान:'}</strong> {event.location}</p>
                  <button onClick={() => handleDeleteEvent(event._id)} className="delete-btn">
                    {language === 'en' ? 'Delete' : 'हटाएं'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="gallery-management">
          <div className="gallery-form">
            <h2>{language === 'en' ? 'Upload Photo' : 'फोटो अपलोड करें'}</h2>
            <form onSubmit={handleGallerySubmit}>
              <input
                type="text"
                placeholder={language === 'en' ? 'Photo Title' : 'फोटो शीर्षक'}
                value={galleryForm.title}
                onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                required
              />
              <textarea
                placeholder={language === 'en' ? 'Description (optional)' : 'विवरण (वैकल्पिक)'}
                value={galleryForm.description}
                onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
              />
              <select
                value={galleryForm.category}
                onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value})}
              >
                <option value="general">{language === 'en' ? 'General' : 'सामान्य'}</option>
                <option value="events">{language === 'en' ? 'Events' : 'कार्यक्रम'}</option>
                <option value="community">{language === 'en' ? 'Community' : 'समुदाय'}</option>
              </select>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>
                  {language === 'en' ? 'Select Image:' : 'छवि चुनें:'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGalleryForm({...galleryForm, image: e.target.files[0]})}
                  required
                />
                {galleryForm.image && (
                  <p style={{marginTop: '5px', color: '#28a745', fontSize: '14px'}}>
                    ✓ {galleryForm.image.name}
                  </p>
                )}
              </div>
              <button type="submit">{language === 'en' ? 'Upload Photo' : 'फोटो अपलोड करें'}</button>
            </form>
          </div>

          <div className="gallery-list">
            <h2>{language === 'en' ? 'All Photos' : 'सभी फोटो'}</h2>
            <div className="gallery-grid">
              {gallery.map((photo) => (
                <div key={photo._id} className="gallery-card">
                  <img src={`${API_URL.replace('/api', '')}/uploads/${photo.imagePath}`} alt={photo.title} />
                  <div className="gallery-info">
                    <h3>{photo.title}</h3>
                    <p>{photo.description}</p>
                    <span className="category-badge">{photo.category}</span>
                    <button onClick={() => handleDeletePhoto(photo._id)} className="delete-btn">
                      {language === 'en' ? 'Delete' : 'हटाएं'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedUser(null)}>×</button>
            
            <h2>{language === 'en' ? 'User Details' : 'उपयोगकर्ता विवरण'}</h2>
            
            <div className="user-details">
              <div className="detail-group">
                <label>{language === 'en' ? 'Full Name:' : 'पूरा नाम:'}</label>
                <p>{selectedUser.fullName}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? "Father's Name:" : 'पिता का नाम:'}</label>
                <p>{selectedUser.fatherName}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Phone:' : 'फोन:'}</label>
                <p>{selectedUser.phone}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Email:' : 'ईमेल:'}</label>
                <p>{selectedUser.email}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Address:' : 'पता:'}</label>
                <p>{selectedUser.address}, {selectedUser.city}, {selectedUser.state} - {selectedUser.pincode}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Occupation:' : 'व्यवसाय:'}</label>
                <p>{selectedUser.occupation}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Education:' : 'शिक्षा:'}</label>
                <p>{selectedUser.education}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Registered:' : 'पंजीकृत:'}</label>
                <p>{new Date(selectedUser.registeredAt).toLocaleString()}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Status:' : 'स्थिति:'}</label>
                <span className={`status-badge ${selectedUser.status}`}>{selectedUser.status}</span>
              </div>

              {selectedUser.status === 'approved' && (
                <div className="detail-group">
                  <label>{language === 'en' ? 'Membership Tier:' : 'सदस्यता स्तर:'}</label>
                  <select
                    value={selectedUser.membershipTier || 'silver'}
                    onChange={(e) => handleUpdateTier(selectedUser._id, e.target.value)}
                    className="tier-select"
                  >
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="diamond">Diamond</option>
                  </select>
                </div>
              )}
              
              {selectedUser.rejectionReason && (
                <div className="detail-group">
                  <label>{language === 'en' ? 'Rejection Reason:' : 'अस्वीकृति कारण:'}</label>
                  <p className="rejection-reason">{selectedUser.rejectionReason}</p>
                </div>
              )}
              
              <div className="documents-section">
                <h3>{language === 'en' ? 'Documents' : 'दस्तावेज़'}</h3>
                
                {selectedUser.photoPath && (
                  <div className="document-item">
                    <label>{language === 'en' ? 'Photo:' : 'फोटो:'}</label>
                    <div className="photo-preview">
                      <img 
                        src={`${API_URL.replace('/api', '')}/uploads/${selectedUser.photoPath}`} 
                        alt={selectedUser.fullName} 
                        className="user-photo-thumbnail"
                      />
                      <a 
                        href={`${API_URL.replace('/api', '')}/uploads/${selectedUser.photoPath}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="view-photo-btn"
                      >
                        {language === 'en' ? '🔍 View Full Size' : '🔍 पूर्ण आकार देखें'}
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedUser.idProofPath && (
                  <div className="document-item">
                    <label>{language === 'en' ? 'ID Proof:' : 'पहचान प्रमाण:'}</label>
                    <a href={`${API_URL.replace('/api', '')}/uploads/${selectedUser.idProofPath}`} target="_blank" rel="noopener noreferrer">
                      {language === 'en' ? 'View ID Proof' : 'पहचान प्रमाण देखें'}
                    </a>
                  </div>
                )}
                
                {selectedUser.addressProofPath && (
                  <div className="document-item">
                    <label>{language === 'en' ? 'Address Proof:' : 'पता प्रमाण:'}</label>
                    <a href={`${API_URL.replace('/api', '')}/uploads/${selectedUser.addressProofPath}`} target="_blank" rel="noopener noreferrer">
                      {language === 'en' ? 'View Address Proof' : 'पता प्रमाण देखें'}
                    </a>
                  </div>
                )}
                
                {selectedUser.donationDocumentPath && (
                  <div className="document-item">
                    <label>{language === 'en' ? 'Donation Document:' : 'दान दस्तावेज़:'}</label>
                    <a href={`${API_URL.replace('/api', '')}/uploads/${selectedUser.donationDocumentPath}`} target="_blank" rel="noopener noreferrer">
                      {language === 'en' ? 'View Donation Document' : 'दान दस्तावेज़ देखें'}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              {selectedUser.status === 'pending' && (
                <>
                  <button onClick={() => handleApprove(selectedUser._id)} className="approve-btn">
                    {language === 'en' ? 'Approve' : 'स्वीकृत करें'}
                  </button>
                  <div className="reject-section">
                    <textarea
                      placeholder={language === 'en' ? 'Rejection reason...' : 'अस्वीकृति कारण...'}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <button onClick={() => handleReject(selectedUser._id)} className="reject-btn">
                      {language === 'en' ? 'Reject' : 'अस्वीकृत करें'}
                    </button>
                  </div>
                </>
              )}
              
              {(selectedUser.status === 'approved' || selectedUser.status === 'rejected') && (
                <button onClick={() => handleSetPending(selectedUser._id)} className="pending-btn">
                  {language === 'en' ? 'Set to Pending' : 'लंबित पर सेट करें'}
                </button>
              )}
              
              {selectedUser.status === 'rejected' && (
                <button onClick={() => handleDelete(selectedUser._id)} className="delete-btn">
                  {language === 'en' ? 'Delete' : 'हटाएं'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
