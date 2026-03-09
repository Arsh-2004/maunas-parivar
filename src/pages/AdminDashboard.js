import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import MembershipCertificate from '../components/MembershipCertificate';
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
  const [gallery, setGallery] = useState([]);
  const [oathAgreements, setOathAgreements] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [nonMembers, setNonMembers] = useState([]);
  const [viewNmRecord, setViewNmRecord] = useState(null);
  const [nmSearch, setNmSearch] = useState('');
  const [galleryForm, setGalleryForm] = useState({ title: '', description: '', category: 'general', image: null });
  const [donors, setDonors] = useState([]);
  const [donorForm, setDonorForm] = useState({ fullName: '', city: '', state: '', donationAmount: '', donationPurpose: '', message: '', photo: null });
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateUser, setCertificateUser] = useState(null);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [familyModalUser, setFamilyModalUser] = useState(null);
  
  // New state for district/block filtering and sorting
  const [districtFilter, setDistrictFilter] = useState('all');
  const [blockFilter, setBlockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

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
        fetchGallery();
        fetchOathAgreements();
        fetchContacts();
        fetchNonMembers();
        fetchDonors();
      } else {
        setError(language === 'en' ? 'Invalid admin password' : 'गलत व्यवस्थापक पासवर्ड');
      }
    } catch (err) {
      setError(language === 'en' ? 'Connection error' : 'कनेक्शन त्रुटि');
    }
  };

  // Fetch oath agreements
  const fetchOathAgreements = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/admin/oath-agreements`, {
        headers: { 'x-admin-password': adminPassword }
      });
      const data = await response.json();
      if (data.success) {
        setOathAgreements(data.agreements);
      }
    } catch (err) {
      console.error('Error fetching oath agreements:', err);
    }
  }, [adminPassword]);

  // Fetch contact messages
  const fetchContacts = useCallback(async () => {
    try {
      const storedPassword = localStorage.getItem('adminPassword');
      const response = await fetch(`${API_URL}/admin/contacts`, {
        headers: { 'x-admin-password': storedPassword || adminPassword }
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.contacts);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  }, [adminPassword]);

  const fetchNonMembers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/users/non-members`);
      const data = await res.json();
      if (data.success) setNonMembers(data.records);
    } catch (err) {
      console.error('Error fetching non-members:', err);
    }
  }, []);

  // Check stored admin session
  useEffect(() => {
    const storedPassword = localStorage.getItem('adminPassword');
    if (storedPassword) {
      setAdminPassword(storedPassword);
      setIsLoggedIn(true);
      fetchUsers();
      fetchStats();
      fetchGallery();
      fetchOathAgreements();
      fetchContacts();
      fetchNonMembers();
    }
  }, [fetchOathAgreements, fetchContacts, fetchNonMembers]);

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

  // Donors management
  const fetchDonors = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/donors`);
      const data = await response.json();
      if (data.success) setDonors(data.donors);
    } catch (err) {
      console.error('Error fetching donors:', err);
    }
  };

  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullName', donorForm.fullName);
    formData.append('city', donorForm.city);
    formData.append('state', donorForm.state);
    formData.append('donationAmount', donorForm.donationAmount);
    formData.append('donationPurpose', donorForm.donationPurpose);
    formData.append('message', donorForm.message);
    if (donorForm.photo) formData.append('photo', donorForm.photo);
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      const response = await fetch(`${API_URL}/admin/donors`, {
        method: 'POST',
        headers: { 'x-admin-password': pwd },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert(language === 'en' ? 'Donor added successfully!' : 'सहयोगी सफलतापूर्वक जोड़ा गया!');
        fetchDonors();
        setDonorForm({ fullName: '', city: '', state: '', donationAmount: '', donationPurpose: '', message: '', photo: null });
        document.querySelectorAll('#donor-form input[type="file"]').forEach(i => { i.value = ''; });
      } else {
        alert(language === 'en' ? `Failed: ${data.message}` : `विफल: ${data.message}`);
      }
    } catch (err) {
      console.error('Error adding donor:', err);
    }
  };

  const handleDeleteDonor = async (id) => {
    if (!window.confirm(language === 'en' ? 'Delete this donor record?' : 'इस सहयोगी रिकॉर्ड को हटाएं?')) return;
    try {
      const pwd = localStorage.getItem('adminPassword') || adminPassword;
      await fetch(`${API_URL}/admin/donors/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': pwd },
      });
      fetchDonors();
    } catch (err) {
      console.error('Error deleting donor:', err);
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

  // Get unique districts and blocks from users
  const uniqueDistricts = [...new Set(users.map(u => u.district).filter(Boolean))].sort();
  const uniqueBlocks = [...new Set(users.map(u => u.block).filter(Boolean))].sort();

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      // Status filter
      if (filter !== 'all' && user.status !== filter) return false;
      
      // District filter
      if (districtFilter !== 'all' && user.district !== districtFilter) return false;
      
      // Block filter
      if (blockFilter !== 'all' && user.block !== blockFilter) return false;
      
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const searchFields = [
          user.fullName,
          user.phone,
          user.district,
          user.block,
          user.village,
          user.tehsil,
          user.city,
          user.email,
          user.fatherName
        ].filter(Boolean).map(field => field.toLowerCase());
        
        const matches = searchFields.some(field => field.includes(query));
        if (!matches) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'name':
          comparison = (a.fullName || '').localeCompare(b.fullName || '');
          break;
        case 'district':
          comparison = (a.district || '').localeCompare(b.district || '');
          break;
        case 'block':
          comparison = (a.block || '').localeCompare(b.block || '');
          break;
        case 'date':
        default:
          comparison = new Date(a.registeredAt) - new Date(b.registeredAt);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

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
          className={activeTab === 'oath' ? 'active' : ''}
          onClick={() => setActiveTab('oath')}
        >
          {language === 'en' ? 'Oath Agreements' : 'शपथ समझौते'}
        </button>
        <button 
          className={activeTab === 'gallery' ? 'active' : ''}
          onClick={() => setActiveTab('gallery')}
        >
          {language === 'en' ? 'Gallery' : 'गैलरी'}
        </button>
        <button 
          className={activeTab === 'contacts' ? 'active' : ''}
          onClick={() => setActiveTab('contacts')}
        >
          {language === 'en' ? 'Contact Messages' : 'संदेश'}
          {contacts.filter(c => !c.isRead).length > 0 && (
            <span style={{ background: '#e07b39', color: '#fff', borderRadius: '50%', padding: '2px 7px', marginLeft: '6px', fontSize: '12px' }}>
              {contacts.filter(c => !c.isRead).length}
            </span>
          )}
        </button>
        <button
          className={activeTab === 'nonmembers' ? 'active' : ''}
          onClick={() => setActiveTab('nonmembers')}
        >
          {language === 'en' ? 'Non-Members' : 'अन्य सदस्य'}
          {nonMembers.length > 0 && (
            <span style={{ background: '#5678c9', color: '#fff', borderRadius: '50%', padding: '2px 7px', marginLeft: '6px', fontSize: '12px' }}>
              {nonMembers.length}
            </span>
          )}
        </button>
        <button
          className={activeTab === 'donors' ? 'active' : ''}
          onClick={() => setActiveTab('donors')}
        >
          {language === 'en' ? 'Sahyogi Sadashya' : 'सहयोगी सदस्य'}
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

          <div className="search-bar-container">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder={language === 'en' 
                  ? 'Search by name, phone, district, block, village...' 
                  : 'नाम, फोन, जिला, खंड, गाँव से खोजें...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  title={language === 'en' ? 'Clear search' : 'खोज साफ़ करें'}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="advanced-filters">
            <div className="filter-group">
              <label>{language === 'en' ? 'District:' : 'जिला:'}</label>
              <select 
                value={districtFilter} 
                onChange={(e) => {
                  setDistrictFilter(e.target.value);
                  setBlockFilter('all'); // Reset block when district changes
                }}
                className="filter-dropdown"
              >
                <option value="all">{language === 'en' ? 'All Districts' : 'सभी जिले'}</option>
                {uniqueDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{language === 'en' ? 'Block:' : 'खंड:'}</label>
              <select 
                value={blockFilter} 
                onChange={(e) => setBlockFilter(e.target.value)}
                className="filter-dropdown"
              >
                <option value="all">{language === 'en' ? 'All Blocks' : 'सभी खंड'}</option>
                {uniqueBlocks
                  .filter(block => {
                    if (districtFilter === 'all') return true;
                    return users.some(u => u.block === block && u.district === districtFilter);
                  })
                  .map(block => (
                    <option key={block} value={block}>{block}</option>
                  ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{language === 'en' ? 'Sort by:' : 'क्रमबद्ध करें:'}</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-dropdown"
              >
                <option value="date">{language === 'en' ? 'Registration Date' : 'पंजीकरण तिथि'}</option>
                <option value="name">{language === 'en' ? 'Name' : 'नाम'}</option>
                <option value="district">{language === 'en' ? 'District' : 'जिला'}</option>
                <option value="block">{language === 'en' ? 'Block' : 'खंड'}</option>
              </select>
            </div>

            <div className="filter-group">
              <label>{language === 'en' ? 'Order:' : 'क्रम:'}</label>
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
                className="filter-dropdown"
              >
                <option value="asc">{language === 'en' ? 'Ascending' : 'आरोही'}</option>
                <option value="desc">{language === 'en' ? 'Descending' : 'अवरोही'}</option>
              </select>
            </div>

            <button 
              className="reset-filters-btn"
              onClick={() => {
                setDistrictFilter('all');
                setBlockFilter('all');
                setSortBy('date');
                setSortOrder('desc');
                setSearchQuery('');
              }}
            >
              {language === 'en' ? '🔄 Reset All' : '🔄 सभी रीसेट करें'}
            </button>
          </div>

          <div className="results-summary">
            <p>
              {language === 'en' 
                ? `Showing ${filteredUsers.length} of ${users.length} members` 
                : `${users.length} में से ${filteredUsers.length} सदस्य दिखा रहे हैं`}
              {searchQuery && (
                <span className="active-search-indicator">
                  {' '}{language === 'en' ? '(Search active)' : '(खोज सक्रिय)'}
                </span>
              )}
              {(districtFilter !== 'all' || blockFilter !== 'all') && (
                <span className="active-filter-indicator">
                  {' '}{language === 'en' ? '(Filters active)' : '(फ़िल्टर सक्रिय)'}
                </span>
              )}
            </p>
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
                      <th>{language === 'en' ? 'District' : 'जिला'}</th>
                      <th>{language === 'en' ? 'Block' : 'खंड'}</th>
                      <th>{language === 'en' ? 'Family' : 'परिवार'}</th>
                      <th>{language === 'en' ? 'Date' : 'तारीख'}</th>
                      <th>{language === 'en' ? 'Action' : 'कार्यवाई'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.fullName}</td>
                        <td>{user.phone}</td>
                        <td>{user.district || 'N/A'}</td>
                        <td>{user.block || 'N/A'}</td>
                        <td>
                          {user.familyMembers && user.familyMembers.length > 0
                            ? <button
                                onClick={() => { setFamilyModalUser(user); setShowFamilyModal(true); }}
                                title={language === 'en' ? 'Click to view family members' : 'परिवार की जानकारी देखें'}
                                style={{ background: '#e3f2fd', color: '#1565c0', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: '600', border: '1px solid #90caf9', cursor: 'pointer' }}
                              >👨‍👩‍👧‍👦 {user.familyMembers.length}</button>
                            : <span style={{ color: '#ccc', fontSize: '12px' }}>—</span>
                          }
                        </td>
                        <td>{new Date(user.registeredAt).toLocaleDateString('en-GB')}</td>
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
                          {user.status === 'approved' && (
                            <button
                              className="view-btn-inline"
                              style={{ marginLeft: '6px', background: 'linear-gradient(135deg, #d4a017, #e8c44a)', color: '#fff', border: 'none' }}
                              onClick={() => {
                                setCertificateUser(user);
                                setShowCertificate(true);
                              }}
                              title={language === 'en' ? 'View Certificate' : 'प्रमाण-पत्र'}
                            >
                              🏅
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Family Members Detail Modal */}
          {showFamilyModal && familyModalUser && (
            <div className="modal-overlay" onClick={() => setShowFamilyModal(false)}>
              <div className="modal-content family-detail-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowFamilyModal(false)}>×</button>
                <h2 style={{ marginBottom: '4px' }}>
                  👨‍👩‍👧‍👦 {language === 'en' ? 'Family Members' : 'पारिवारिक सदस्य'}
                </h2>
                <p style={{ color: '#666', fontSize: '14px', marginTop: 0, marginBottom: '16px' }}>
                  {familyModalUser.fullName} — {familyModalUser.familyMembers.length} {language === 'en' ? 'member(s)' : 'सदस्य'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {familyModalUser.familyMembers.map((member, idx) => (
                    <div key={member._id || idx} style={{
                      background: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      {member.photoPath
                        ? <img src={member.photoPath} alt={member.name} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #90caf9', flexShrink: 0 }} />
                        : <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>👤</div>
                      }
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#212529', marginBottom: '4px' }}>{member.name}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ background: '#e3f2fd', color: '#1565c0', borderRadius: '4px', padding: '2px 8px', fontSize: '12px', fontWeight: '600' }}>{member.relation}</span>
                          {member.gender && (
                            <span style={{ background: '#f3e5f5', color: '#6a1b9a', borderRadius: '4px', padding: '2px 8px', fontSize: '12px' }}>
                              {member.gender === 'male' ? (language === 'en' ? '♂ Male' : '♂ पुरुष') : member.gender === 'female' ? (language === 'en' ? '♀ Female' : '♀ महिला') : (language === 'en' ? 'Other' : 'अन्य')}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: '#555', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {member.dateOfBirth && (
                            <span>🎂 {language === 'en' ? 'DOB:' : 'जन्म तिथि:'} {new Date(member.dateOfBirth).toLocaleDateString('en-IN')}</span>
                          )}
                          {member.occupation && (
                            <span>💼 {language === 'en' ? 'Occupation:' : 'व्यवसाय:'} {member.occupation}</span>
                          )}
                          {member.phone && (
                            <span>📞 {member.phone}</span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>
                          {member.addedFrom === 'registration'
                            ? (language === 'en' ? '📝 Added during registration' : '📝 पंजीकरण के समय जोड़ा गया')
                            : member.addedAt
                              ? (language === 'en' ? `✏️ Added on ${new Date(member.addedAt).toLocaleDateString('en-IN')}` : `✏️ ${new Date(member.addedAt).toLocaleDateString('en-IN')} को जोड़ा गया`)
                              : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                    <span className="detail-label">{language === 'en' ? 'Village:' : 'गाँव:'}</span>
                    <span className="detail-value">{selectedUser.village}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Block:' : 'खंड:'}</span>
                    <span className="detail-value">{selectedUser.block}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'Tehsil:' : 'तहसील:'}</span>
                    <span className="detail-value">{selectedUser.tehsil}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{language === 'en' ? 'District:' : 'जिला:'}</span>
                    <span className="detail-value">{selectedUser.district}</span>
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
                    <a href={selectedUser.idProofPath} target="_blank" rel="noreferrer" className="pdf-link">
                      PDF {language === 'en' ? 'View' : 'देखें'} 📄
                    </a>
                  </div>

                  {/* Family Members Section */}
                  {selectedUser.familyMembers && selectedUser.familyMembers.length > 0 && (
                    <div className="detail-row family-detail-row" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '12px' }}>
                      <span className="detail-label" style={{ marginBottom: '8px' }}>
                        👨‍👩‍👧‍👦 {language === 'en' ? `Family Members (${selectedUser.familyMembers.length}):` : `पारिवारिक सदस्य (${selectedUser.familyMembers.length}):`}
                      </span>
                      <div style={{ width: '100%' }}>
                        {selectedUser.familyMembers.map((member, idx) => (
                          <div key={member._id || idx} style={{
                            background: '#f8f9fa',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            marginBottom: '6px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}>
                            <span style={{ fontSize: '20px' }}>👤</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '600', color: '#333' }}>{member.name}</div>
                              <div style={{ fontSize: '13px', color: '#666' }}>
                                <span style={{ background: '#e3f2fd', color: '#1565c0', borderRadius: '4px', padding: '1px 6px', marginRight: '6px', fontSize: '12px' }}>{member.relation}</span>
                                {member.gender && <span style={{ marginRight: '6px' }}>{member.gender === 'male' ? (language === 'en' ? 'Male' : 'पुरुष') : member.gender === 'female' ? (language === 'en' ? 'Female' : 'महिला') : (language === 'en' ? 'Other' : 'अन्य')}</span>}
                                {member.dateOfBirth && <span style={{ marginRight: '6px' }}>DOB: {new Date(member.dateOfBirth).toLocaleDateString('en-IN')}</span>}
                                {member.occupation && <span style={{ marginRight: '6px' }}>{member.occupation}</span>}
                                {member.phone && <span>📞 {member.phone}</span>}
                              </div>
                              <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>
                                {member.addedFrom === 'registration'
                                  ? (language === 'en' ? '📝 Added during registration' : '📝 पंजीकरण के समय जोड़ा गया')
                                  : (language === 'en' ? `✏️ Added from profile on ${new Date(member.addedAt).toLocaleDateString('en-IN')}` : `✏️ प्रोफ़ाइल से ${new Date(member.addedAt).toLocaleDateString('en-IN')} को जोड़ा गया`)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedUser.familyMembers && selectedUser.familyMembers.length === 0 && (
                    <div className="detail-row" style={{ marginTop: '8px' }}>
                      <span className="detail-label">👨‍👩‍👧‍👦 {language === 'en' ? 'Family Members:' : 'पारिवारिक सदस्य:'}</span>
                      <span className="detail-value" style={{ color: '#999', fontStyle: 'italic' }}>{language === 'en' ? 'None added' : 'कोई नहीं'}</span>
                    </div>
                  )}
                </div>
                
                {selectedUser.status === 'pending' && (
                  <div className="modal-actions">
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

                {selectedUser.status === 'approved' && (
                  <div className="modal-actions">
                    <button
                      className="approve-btn"
                      style={{ background: 'linear-gradient(135deg, #d4a017, #e8c44a)', fontSize: '14px' }}
                      onClick={() => {
                        setCertificateUser(selectedUser);
                        setShowCertificate(true);
                        setShowUserModal(false);
                      }}
                    >
                      🏅 {language === 'en' ? 'View Certificate' : 'प्रमाण-पत्र देखें'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'oath' && (
        <div className="oath-agreements-section">
          <h2>{language === 'en' ? '📜 Oath Agreements' : '📜 शपथ समझौते'}</h2>
          <div className="stats-grid">
            <div className="stat-card total-card">
              <div className="stat-number">{oathAgreements.length}</div>
              <div className="stat-label">{language === 'en' ? 'Total Agreements' : 'कुल समझौते'}</div>
            </div>
          </div>

          {oathAgreements.length === 0 ? (
            <p className="no-data">{language === 'en' ? 'No oath agreements yet' : 'अभी तक कोई शपथ समझौता नहीं'}</p>
          ) : (
            <div className="members-table-container">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>{language === 'en' ? 'Name' : 'नाम'}</th>
                    <th>{language === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'}</th>
                    <th>{language === 'en' ? 'Agreed At' : 'सहमति दिनांक'}</th>
                    <th>{language === 'en' ? 'IP Address' : 'आईपी पता'}</th>
                  </tr>
                </thead>
                <tbody>
                  {oathAgreements.map((agreement) => (
                    <tr key={agreement._id}>
                      <td>{agreement.name}</td>
                      <td>{agreement.mobileNumber}</td>
                      <td>{new Date(agreement.agreedAt).toLocaleString()}</td>
                      <td>{agreement.ipAddress || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
                  <img src={photo.imagePath} alt={photo.title} />
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

      {activeTab === 'contacts' && (
        <div className="oath-agreements-section">
          <h2>{language === 'en' ? '📩 Contact Messages' : '📩 संपर्क संदेश'}</h2>
          <div className="stats-grid">
            <div className="stat-card total-card">
              <div className="stat-number">{contacts.length}</div>
              <div className="stat-label">{language === 'en' ? 'Total Messages' : 'कुल संदेश'}</div>
            </div>
            <div className="stat-card pending-card">
              <div className="stat-number">{contacts.filter(c => !c.isRead).length}</div>
              <div className="stat-label">{language === 'en' ? 'Unread' : 'अपठित'}</div>
            </div>
          </div>

          {contacts.length === 0 ? (
            <p className="no-data">{language === 'en' ? 'No contact messages yet' : 'अभी तक कोई संदेश नहीं'}</p>
          ) : (
            <div className="members-table-container">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>{language === 'en' ? 'Name' : 'नाम'}</th>
                    <th>{language === 'en' ? 'Email' : 'ईमेल'}</th>
                    <th>{language === 'en' ? 'Phone' : 'फोन'}</th>
                    <th>{language === 'en' ? 'Subject' : 'विषय'}</th>
                    <th>{language === 'en' ? 'Message' : 'संदेश'}</th>
                    <th>{language === 'en' ? 'Date' : 'दिनांक'}</th>
                    <th>{language === 'en' ? 'Status' : 'स्थिति'}</th>
                    <th>{language === 'en' ? 'Actions' : 'कार्यवाही'}</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id} style={{ background: contact.isRead ? 'transparent' : '#fff8f0' }}>
                      <td><strong>{contact.name}</strong></td>
                      <td><a href={`mailto:${contact.email}`}>{contact.email}</a></td>
                      <td>{contact.phone || '-'}</td>
                      <td>{contact.subject}</td>
                      <td style={{ maxWidth: '200px', wordBreak: 'break-word' }}>{contact.message}</td>
                      <td>{new Date(contact.submittedAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <span style={{ color: contact.isRead ? '#888' : '#e07b39', fontWeight: contact.isRead ? 'normal' : 'bold' }}>
                          {contact.isRead ? (language === 'en' ? 'Read' : 'पढ़ा') : (language === 'en' ? 'Unread' : 'अपठित')}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {!contact.isRead && (
                          <button
                            className="approve-btn"
                            style={{ padding: '4px 10px', fontSize: '12px' }}
                            onClick={async () => {
                              const pwd = localStorage.getItem('adminPassword');
                              await fetch(`${API_URL}/admin/contacts/${contact._id}/read`, {
                                method: 'PATCH',
                                headers: { 'x-admin-password': pwd }
                              });
                              fetchContacts();
                            }}
                          >
                            {language === 'en' ? 'Mark Read' : 'पढ़ा हुआ'}
                          </button>
                        )}
                        <button
                          className="delete-btn"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={async () => {
                            if (!window.confirm(language === 'en' ? 'Delete this message?' : 'इस संदेश को हटाएं?')) return;
                            const pwd = localStorage.getItem('adminPassword');
                            await fetch(`${API_URL}/admin/contacts/${contact._id}`, {
                              method: 'DELETE',
                              headers: { 'x-admin-password': pwd }
                            });
                            fetchContacts();
                          }}
                        >
                          {language === 'en' ? 'Delete' : 'हटाएं'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'nonmembers' && (
        <div className="oath-agreements-section">
          <h2>{language === 'en' ? '👥 Non-Members Directory' : '👥 अन्य सदस्य डायरेक्टरी'}</h2>
          <div className="stats-grid">
            <div className="stat-card total-card">
              <div className="stat-number">{nonMembers.length}</div>
              <div className="stat-label">{language === 'en' ? 'Total Records' : 'कुल रिकॉर्ड'}</div>
            </div>
            <div className="stat-card approved-card">
              <div className="stat-number">{[...new Set(nonMembers.map(r => r.state).filter(Boolean))].length}</div>
              <div className="stat-label">{language === 'en' ? 'States' : 'राज्य'}</div>
            </div>
            <div className="stat-card pending-card">
              <div className="stat-number">{[...new Set(nonMembers.map(r => r.place).filter(Boolean))].length}</div>
              <div className="stat-label">{language === 'en' ? 'Places' : 'स्थान'}</div>
            </div>
          </div>

          <div style={{ margin: '16px 0' }}>
            <input
              type="text"
              placeholder={language === 'en' ? 'Search by name, place, state, district...' : 'नाम, स्थान, राज्य, जिले से खोजें...'}
              value={nmSearch}
              onChange={e => setNmSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          {nonMembers.length === 0 ? (
            <p className="no-data">{language === 'en' ? 'No non-member records yet' : 'अभी तक कोई अन्य सदस्य रिकॉर्ड नहीं'}</p>
          ) : (
            <div className="members-table-container">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>{language === 'en' ? 'Photo' : 'फोटो'}</th>
                    <th>{language === 'en' ? 'Name' : 'नाम'}</th>
                    <th>{language === 'en' ? 'Age' : 'आयु'}</th>
                    <th>{language === 'en' ? 'Place' : 'स्थान'}</th>
                    <th>{language === 'en' ? 'Relationship' : 'संबंध'}</th>
                    <th>{language === 'en' ? 'District' : 'जिला'}</th>
                    <th>{language === 'en' ? 'State' : 'राज्य'}</th>
                    <th>{language === 'en' ? 'Added By' : 'जोड़ा किसने'}</th>
                    <th>{language === 'en' ? 'Added On' : 'जोड़ा गया'}</th>
                    <th>{language === 'en' ? 'Actions' : 'कार्यवाही'}</th>
                  </tr>
                </thead>
                <tbody>
                  {nonMembers
                    .filter(r => {
                      const q = nmSearch.toLowerCase();
                      return !q ||
                        r.fullName?.toLowerCase().includes(q) ||
                        r.place?.toLowerCase().includes(q) ||
                        r.state?.toLowerCase().includes(q) ||
                        r.district?.toLowerCase().includes(q) ||
                        r.relationship?.toLowerCase().includes(q);
                    })
                    .map(r => (
                    <tr key={r._id}>
                      <td>
                        {r.photoPath
                          ? <img src={r.photoPath} alt={r.fullName} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '1.6rem' }}>👤</span>}
                      </td>
                      <td><strong>{r.fullName}</strong></td>
                      <td>{r.age}</td>
                      <td>{r.place}</td>
                      <td>{r.relationship || '-'}</td>
                      <td>{r.district || '-'}</td>
                      <td>{r.state || '-'}</td>
                      <td>
                        {r.addedBy
                          ? <span style={{ fontWeight: 600, color: '#FF6B35' }}>{r.addedBy.fullName}</span>
                          : <span style={{ color: '#aaa' }}>-</span>}
                      </td>
                      <td>{new Date(r.addedAt).toLocaleDateString('en-IN')}</td>
                      <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          className="approve-btn"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => setViewNmRecord(r)}
                        >
                          {language === 'en' ? 'View' : 'देखें'}
                        </button>
                        <button
                          className="delete-btn"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={async () => {
                            if (!window.confirm(language === 'en' ? 'Delete this record?' : 'इस रिकॉर्ड को हटाएं?')) return;
                            const pwd = localStorage.getItem('adminPassword');
                            await fetch(`${API_URL}/users/non-members/${r._id}`, {
                              method: 'DELETE',
                              headers: { 'x-admin-password': pwd }
                            });
                            fetchNonMembers();
                          }}
                        >
                          {language === 'en' ? 'Delete' : 'हटाएं'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'donors' && (
        <div className="gallery-management">
          <div className="gallery-form">
            <h2>{language === 'en' ? '🙏 Add Sahyogi Sadashya (Donor)' : '🙏 सहयोगी सदस्य जोड़ें'}</h2>
            <form id="donor-form" onSubmit={handleDonorSubmit}>
              <input
                type="text"
                placeholder={language === 'en' ? 'Full Name *' : 'पूरा नाम *'}
                value={donorForm.fullName}
                onChange={(e) => setDonorForm({...donorForm, fullName: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder={language === 'en' ? 'City' : 'शहर'}
                value={donorForm.city}
                onChange={(e) => setDonorForm({...donorForm, city: e.target.value})}
              />
              <input
                type="text"
                placeholder={language === 'en' ? 'State' : 'राज्य'}
                value={donorForm.state}
                onChange={(e) => setDonorForm({...donorForm, state: e.target.value})}
              />
              <input
                type="number"
                placeholder={language === 'en' ? 'Donation Amount (₹) *' : 'दान राशि (₹) *'}
                value={donorForm.donationAmount}
                onChange={(e) => setDonorForm({...donorForm, donationAmount: e.target.value})}
                min="1"
                required
              />
              <input
                type="text"
                placeholder={language === 'en' ? 'Donation Purpose (e.g. Parivar Bhavan)' : 'दान का उद्देश्य (जैसे परिवार भवन)'}
                value={donorForm.donationPurpose}
                onChange={(e) => setDonorForm({...donorForm, donationPurpose: e.target.value})}
              />
              <textarea
                placeholder={language === 'en' ? 'Message (optional)' : 'संदेश (वैकल्पिक)'}
                value={donorForm.message}
                onChange={(e) => setDonorForm({...donorForm, message: e.target.value})}
              />
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>
                  {language === 'en' ? 'Donor Photo (optional):' : 'सहयोगी की फोटो (वैकल्पिक):'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDonorForm({...donorForm, photo: e.target.files[0]})}
                />
                {donorForm.photo && (
                  <p style={{marginTop: '5px', color: '#28a745', fontSize: '14px'}}>✓ {donorForm.photo.name}</p>
                )}
              </div>
              <button type="submit">{language === 'en' ? 'Add Donor' : 'सहयोगी जोड़ें'}</button>
            </form>
          </div>

          <div className="gallery-list">
            <h2>{language === 'en' ? `All Donors (${donors.length})` : `सभी सहयोगी (${donors.length})`}</h2>
            <div className="gallery-grid">
              {donors.length === 0 ? (
                <p style={{ color: '#888' }}>{language === 'en' ? 'No donors added yet' : 'अभी तक कोई सहयोगी नहीं जोड़ा गया'}</p>
              ) : donors.map((donor) => (
                <div key={donor._id} className="gallery-card">
                  {donor.photoPath
                    ? <img src={donor.photoPath} alt={donor.fullName} style={{ objectFit: 'cover' }} />
                    : <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: '#fff5ef' }}>🙏</div>
                  }
                  <div className="gallery-info">
                    <h3>{donor.fullName}</h3>
                    <p style={{ fontWeight: 700, color: '#FF6B35', fontSize: '1.05rem' }}>₹{Number(donor.donationAmount).toLocaleString('en-IN')}</p>
                    {donor.donationPurpose && <p>{donor.donationPurpose}</p>}
                    {(donor.city || donor.state) && <p>📍 {[donor.city, donor.state].filter(Boolean).join(', ')}</p>}
                    {donor.message && <p style={{ fontStyle: 'italic', color: '#888' }}>"{donor.message}"</p>}
                    <button onClick={() => handleDeleteDonor(donor._id)} className="delete-btn">
                      {language === 'en' ? 'Delete' : 'हटाएं'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewNmRecord && (
        <div className="modal-overlay" onClick={() => setViewNmRecord(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setViewNmRecord(null)}>×</button>
            <h2>👤 {viewNmRecord.fullName}</h2>
            {viewNmRecord.photoPath && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <img src={viewNmRecord.photoPath} alt={viewNmRecord.fullName}
                  style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffe0d4' }} />
              </div>
            )}
            <div className="user-details">
              {[
                [language === 'en' ? 'Full Name' : 'पूरा नाम', viewNmRecord.fullName],
                [language === 'en' ? 'Age' : 'आयु', viewNmRecord.age],
                [language === 'en' ? 'Place' : 'स्थान', viewNmRecord.place],
                [language === 'en' ? 'Relationship' : 'संबंध', viewNmRecord.relationship],
                [language === 'en' ? "Father's Name" : 'पिता का नाम', viewNmRecord.fatherName],
                [language === 'en' ? 'Gender' : 'लिंग', viewNmRecord.gender],
                [language === 'en' ? 'Phone' : 'फोन', viewNmRecord.phone],
                [language === 'en' ? 'Email' : 'ईमेल', viewNmRecord.email],
                [language === 'en' ? 'Occupation' : 'व्यवसाय', viewNmRecord.occupation],
                [language === 'en' ? 'Education' : 'शिक्षा', viewNmRecord.education],
                [language === 'en' ? 'Village' : 'गाँव', viewNmRecord.village],
                [language === 'en' ? 'Block' : 'ब्लॉक', viewNmRecord.block],
                [language === 'en' ? 'Tehsil' : 'तहसील', viewNmRecord.tehsil],
                [language === 'en' ? 'District' : 'जिला', viewNmRecord.district],
                [language === 'en' ? 'State' : 'राज्य', viewNmRecord.state],
                [language === 'en' ? 'Pincode' : 'पिन कोड', viewNmRecord.pincode],
                [language === 'en' ? 'Address' : 'पता', viewNmRecord.address],
                [language === 'en' ? 'Added On' : 'जोड़ा गया', new Date(viewNmRecord.addedAt).toLocaleDateString('en-IN')],
                [language === 'en' ? 'Added By' : 'जोड़ा किसने', viewNmRecord.addedBy?.fullName || null],
                [language === 'en' ? 'Adder Email' : 'जोड़ने वाले का ईमेल', viewNmRecord.addedBy?.email || null],
              ].filter(([, val]) => val).map(([label, val]) => (
                <div className="detail-group" key={label}>
                  <label>{label}:</label>
                  <p style={{ textTransform: label === (language === 'en' ? 'Gender' : 'लिंग') ? 'capitalize' : 'none' }}>{val}</p>
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
              
              <div className="detail-group">                <label>{language === 'en' ? 'Password:' : 'पासवर्ड:'}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <p style={{ margin: 0 }}>
                    {showPassword ? selectedUser.password : '••••••••'}
                  </p>
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      background: '#ff6b35',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px'
                    }}
                  >
                    {showPassword ? (language === 'en' ? '👁️ Hide' : '👁️ छुपाएं') : (language === 'en' ? '👁️ Show' : '👁️ दिखाएं')}
                  </button>
                </div>
              </div>
              
              <div className="detail-group">                <label>{language === 'en' ? 'Address:' : 'पता:'}</label>
                <p>{selectedUser.address}, {selectedUser.city}, {selectedUser.state} - {selectedUser.pincode}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Occupation:' : 'व्यवसाय:'}</label>
                <p>{selectedUser.occupation}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Registered:' : 'पंजीकृत:'}</label>
                <p>{new Date(selectedUser.registeredAt).toLocaleString()}</p>
              </div>
              
              <div className="detail-group">
                <label>{language === 'en' ? 'Status:' : 'स्थिति:'}</label>
                <span className={`status-badge ${selectedUser.status}`}>{selectedUser.status}</span>
              </div>

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
                        src={selectedUser.photoPath} 
                        alt={selectedUser.fullName} 
                        className="user-photo-thumbnail"
                      />
                      <a 
                        href={selectedUser.photoPath} 
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
                    <a href={selectedUser.idProofPath} target="_blank" rel="noopener noreferrer">
                      {language === 'en' ? 'View ID Proof' : 'पहचान प्रमाण देखें'}
                    </a>
                  </div>
                )}
                
                {selectedUser.addressProofPath && (
                  <div className="document-item">
                    <label>{language === 'en' ? 'Address Proof:' : 'पता प्रमाण:'}</label>
                    <a href={selectedUser.addressProofPath} target="_blank" rel="noopener noreferrer">
                      {language === 'en' ? 'View Address Proof' : 'पता प्रमाण देखें'}
                    </a>
                  </div>
                )}
                
                {selectedUser.donationDocumentPath && (
                  <div className="document-item">
                    <label>{language === 'en' ? 'Donation Document:' : 'सहयोग दस्तावेज़:'}</label>
                    <a href={selectedUser.donationDocumentPath} target="_blank" rel="noopener noreferrer">
                      {language === 'en' ? 'View Donation Document' : 'सहयोग दस्तावेज़ देखें'}
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

      {/* Membership Certificate Overlay */}
      {showCertificate && certificateUser && (
        <MembershipCertificate
          user={certificateUser}
          onClose={() => { setShowCertificate(false); setCertificateUser(null); }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
