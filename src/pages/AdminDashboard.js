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
    }
  }, []);

  // Fetch stats and users
  useEffect(() => {
    if (isLoggedIn) {
      fetchStats();
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, filter]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'x-admin-password': adminPassword },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/users?status=${filter}`, {
        headers: { 'x-admin-password': adminPassword },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
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
        fetchStats();
        fetchUsers();
        setSelectedUser(null);
      }
    } catch (err) {
      alert('Failed to approve user');
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
        fetchStats();
        fetchUsers();
        setSelectedUser(null);
        setRejectReason('');
      }
    } catch (err) {
      alert('Failed to reject user');
    }
  };

  // Set user back to pending
  const handleSetPending = async (userId) => {
    if (window.confirm(language === 'en' ? 'Set this user back to pending status?' : 'इस उपयोगकर्ता को लंबित स्थिति पर वापस सेट करें?')) {
      try {
        const response = await fetch(`${API_URL}/admin/set-pending/${userId}`, {
          method: 'PUT',
          headers: { 'x-admin-password': adminPassword },
        });
        const data = await response.json();
        if (data.success) {
          fetchStats();
          fetchUsers();
          setSelectedUser(null);
        }
      } catch (err) {
        alert('Failed to update status');
      }
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('adminPassword');
    setIsLoggedIn(false);
    setAdminPassword('');
    navigate('/');
  };

  // Delete rejected user
  const handleDelete = async (userId) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to permanently delete this application? This action cannot be undone.' : 'क्या आप इस आवेदन को स्थायी रूप से हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।')) {
      try {
        const response = await fetch(`${API_URL}/admin/delete/${userId}`, {
          method: 'DELETE',
          headers: {
            'x-admin-password': adminPassword
          }
        });

        const data = await response.json();
        
        if (data.success) {
          alert(language === 'en' ? 'Application deleted successfully!' : 'आवेदन सफलतापूर्वक हटाया गया!');
          fetchUsers();
          fetchStats();
          setSelectedUser(null);
        } else {
          alert(data.message || (language === 'en' ? 'Failed to delete application' : 'आवेदन हटाने में विफल'));
        }
      } catch (err) {
        alert(language === 'en' ? 'Failed to delete application' : 'आवेदन हटाने में विफल');
      }
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Admin login form
  if (!isLoggedIn) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-container">
          <h1>{language === 'en' ? '🔐 Admin Login' : '🔐 व्यवस्थापक लॉगिन'}</h1>
          <form onSubmit={handleAdminLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'en' ? 'Enter admin password' : 'व्यवस्थापक पासवर्ड दर्ज करें'}
              required
            />
            {error && <div className="error-msg">{error}</div>}
            <button type="submit">{language === 'en' ? 'Login' : 'लॉगिन'}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>{language === 'en' ? '📊 Admin Dashboard' : '📊 व्यवस्थापक डैशबोर्ड'}</h1>
        <button className="logout-btn" onClick={handleLogout}>
          {language === 'en' ? 'Logout' : 'लॉगआउट'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card pending">
          <h3>{stats.pending}</h3>
          <p>{language === 'en' ? 'Pending' : 'लंबित'}</p>
        </div>
        <div className="stat-card approved">
          <h3>{stats.approved}</h3>
          <p>{language === 'en' ? 'Approved' : 'स्वीकृत'}</p>
        </div>
        <div className="stat-card rejected">
          <h3>{stats.rejected}</h3>
          <p>{language === 'en' ? 'Rejected' : 'अस्वीकृत'}</p>
        </div>
        <div className="stat-card total">
          <h3>{stats.total}</h3>
          <p>{language === 'en' ? 'Total' : 'कुल'}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={filter === 'pending' ? 'active' : ''} 
          onClick={() => setFilter('pending')}
        >
          {language === 'en' ? 'Pending' : 'लंबित'}
        </button>
        <button 
          className={filter === 'approved' ? 'active' : ''} 
          onClick={() => setFilter('approved')}
        >
          {language === 'en' ? 'Approved' : 'स्वीकृत'}
        </button>
        <button 
          className={filter === 'rejected' ? 'active' : ''} 
          onClick={() => setFilter('rejected')}
        >
          {language === 'en' ? 'Rejected' : 'अस्वीकृत'}
        </button>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        {loading ? (
          <div className="loading">{language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}</div>
        ) : users.length === 0 ? (
          <div className="no-data">{language === 'en' ? 'No registrations found' : 'कोई पंजीकरण नहीं मिला'}</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>{language === 'en' ? 'Name' : 'नाम'}</th>
                <th>{language === 'en' ? 'Phone' : 'फ़ोन'}</th>
                <th>{language === 'en' ? 'Email' : 'ईमेल'}</th>
                <th>{language === 'en' ? 'City' : 'शहर'}</th>
                <th>{language === 'en' ? 'Date' : 'तारीख'}</th>
                <th>{language === 'en' ? 'Actions' : 'क्रियाएं'}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.city}</td>
                  <td>{formatDate(user.registeredAt)}</td>
                  <td>
                    <button 
                      className="view-btn"
                      onClick={() => setSelectedUser(user)}
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
            <h2>{selectedUser.fullName}</h2>
            
            <div className="user-details">
              <div className="detail-row">
                <span>{language === 'en' ? "Father's Name:" : 'पिता का नाम:'}</span>
                <span>{selectedUser.fatherName}</span>
              </div>
              <div className="detail-row">
                <span>{language === 'en' ? 'Date of Birth:' : 'जन्म तिथि:'}</span>
                <span>{formatDate(selectedUser.dateOfBirth)}</span>
              </div>
              <div className="detail-row">
                <span>{language === 'en' ? 'Gender:' : 'लिंग:'}</span>
                <span>{selectedUser.gender}</span>
              </div>
              <div className="detail-row">
                <span>{language === 'en' ? 'Phone:' : 'फ़ोन:'}</span>
                <span>{selectedUser.phone}</span>
              </div>
              <div className="detail-row">
                <span>{language === 'en' ? 'Email:' : 'ईमेल:'}</span>
                <span>{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <span>{language === 'en' ? 'Address:' : 'पता:'}</span>
                <span>{selectedUser.address}</span>
              </div>
              <div className="detail-row">
                <span>{language === 'en' ? 'City:' : 'शहर:'}</span>
                <span>{selectedUser.city}, {selectedUser.state} - {selectedUser.pincode}</span>
              </div>
              <div className="detail-row">
                <span>{language === 'en' ? 'Occupation:' : 'व्यवसाय:'}</span>
                <span>{selectedUser.occupation}</span>
              </div>
              <div className="detail-row">
                <span>{language === 'en' ? 'Education:' : 'शिक्षा:'}</span>
                <span>{selectedUser.education}</span>
              </div>
              <div className="detail-row">
                <span>{language === 'en' ? 'ID Proof:' : 'पहचान प्रमाण:'}</span>
                <a href={`${API_URL.replace('/api', '')}/uploads/${selectedUser.idProofPath}`} target="_blank" rel="noopener noreferrer">
                  {language === 'en' ? 'View PDF' : 'PDF देखें'} 📄
                </a>
              </div>
              {selectedUser.addressProofPath && (
                <div className="detail-row">
                  <span>{language === 'en' ? 'Address Proof:' : 'पते का प्रमाण:'}</span>
                  <a href={`${API_URL.replace('/api', '')}/uploads/${selectedUser.addressProofPath}`} target="_blank" rel="noopener noreferrer">
                    {language === 'en' ? 'View PDF' : 'PDF देखें'} 📄
                  </a>
                </div>
              )}
              {selectedUser.photoPath && (
                <div className="detail-row">
                  <span>{language === 'en' ? 'Photo:' : 'फोटो:'}</span>
                  <a href={`${API_URL.replace('/api', '')}/uploads/${selectedUser.photoPath}`} target="_blank" rel="noopener noreferrer">
                    {language === 'en' ? 'View Photo' : 'फोटो देखें'} 🖼️
                  </a>
                </div>
              )}
              {selectedUser.donationDocumentPath && (
                <div className="detail-row">
                  <span>{language === 'en' ? 'Donation Doc:' : 'दान दस्तावेज़:'}</span>
                  <a href={`${API_URL.replace('/api', '')}/uploads/${selectedUser.donationDocumentPath}`} target="_blank" rel="noopener noreferrer">
                    {language === 'en' ? 'View PDF' : 'PDF देखें'} 📄
                  </a>
                </div>
              )}
              <div className="detail-row">
                <span>{language === 'en' ? 'Status:' : 'स्थिति:'}</span>
                <span className={`status-badge ${selectedUser.status}`}>{selectedUser.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="action-buttons">
              <div className="status-change-section">
                <label>{language === 'en' ? 'Change Status:' : 'स्थिति बदलें:'}</label>
                <div className="status-buttons">
                  {selectedUser.status !== 'approved' && (
                    <button className="approve-btn" onClick={() => handleApprove(selectedUser._id)}>
                      ✅ {language === 'en' ? 'Approve' : 'स्वीकृत करें'}
                    </button>
                  )}
                  {selectedUser.status !== 'rejected' && (
                    <div className="reject-section">
                      <input
                        type="text"
                        placeholder={language === 'en' ? 'Rejection reason (optional)' : 'अस्वीकृति का कारण (वैकल्पिक)'}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                      <button className="reject-btn" onClick={() => handleReject(selectedUser._id)}>
                        ❌ {language === 'en' ? 'Reject' : 'अस्वीकृत करें'}
                      </button>
                    </div>
                  )}
                  {selectedUser.status !== 'pending' && (
                    <button className="pending-btn" onClick={() => handleSetPending(selectedUser._id)}>
                      ⏳ {language === 'en' ? 'Set to Pending' : 'लंबित पर सेट करें'}
                    </button>
                  )}
                </div>
              </div>
              
              {selectedUser.status === 'rejected' && (
                <div className="delete-section">
                  <label>{language === 'en' ? 'Permanent Actions:' : 'स्थायी क्रियाएं:'}</label>
                  <button className="delete-btn" onClick={() => handleDelete(selectedUser._id)}>
                    🗑️ {language === 'en' ? 'Delete Application' : 'आवेदन हटाएं'}
                  </button>
                </div>
              )}
            </div>

            {selectedUser.status === 'rejected' && selectedUser.rejectionReason && (
              <div className="rejection-reason">
                <strong>{language === 'en' ? 'Rejection Reason:' : 'अस्वीकृति का कारण:'}</strong> {selectedUser.rejectionReason}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
