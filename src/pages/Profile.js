import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import DigitalIDCard from '../components/DigitalIDCard';
import './Profile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const { language } = useLanguage();
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const isEditingRef = React.useRef(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    occupation: '',
    photo: null
  });

  // ---- Non-Member Records state ----
  const emptyNm = {
    fullName: '', place: '', age: '',
    relationship: '', fatherName: '', gender: '',
    email: '', phone: '', address: '', village: '',
    block: '', tehsil: '', district: '', state: '',
    pincode: '', occupation: '', education: '', photo: null
  };
  const [showNmModal, setShowNmModal]       = useState(false);
  const [nmFormData, setNmFormData]         = useState(emptyNm);
  const [nmLoading, setNmLoading]           = useState(false);
  const [nmMessage, setNmMessage]           = useState({ type: '', text: '' });
  const [nonMembers, setNonMembers]         = useState([]);
  const [showNmOptional, setShowNmOptional] = useState(false);
  const [nmViewRecord, setNmViewRecord]     = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Load user data and fetch fresh photo
    const fetchUserData = async () => {
      if (user && user.phone) {
        try {
          const response = await fetch(`${API_URL}/users/profile/${user.phone}`);
          const data = await response.json();
          if (data.success && data.user) {
            console.log('🔄 Profile refresh - ID Card Path:', data.user.idCardPath ? '✅ Present' : '❌ Not yet');
            // Update user in context with fresh data including photo and ID card
            updateUser(data.user);
            // Only reset form data if NOT currently editing (prevents wiping user's typed input)
            if (!isEditingRef.current) {
              setFormData({
                email: data.user.email || '',
                phone: data.user.phone || '',
                address: data.user.address || '',
                city: data.user.city || '',
                state: data.user.state || '',
                pincode: data.user.pincode || '',
                occupation: data.user.occupation || '',
                photo: null
              });
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else if (user) {
        // Fallback to user from context
        setFormData({
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          pincode: user.pincode || '',
          occupation: user.occupation || '',
          photo: null
        });
      }
    };

    // Initial fetch
    fetchUserData();
    
    // Fetch non-member records added by this user
    if (user?._id) {
      fetch(`${API_URL}/users/non-members/by-user/${user._id}`)
        .then(r => r.json())
        .then(d => { if (d.success) setNonMembers(d.records); })
        .catch(() => {});
    }
    
    // Poll every 3 seconds only if user is approved but doesn't have ID card yet
    if (user?.status === 'approved' && !user?.idCardPath) {
      console.log('⏳ ID card generating... polling for updates');
      const interval = setInterval(fetchUserData, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, navigate, updateUser, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
      setFormData({
        ...formData,
        photo: file
      });
    } else if (file) {
      alert(language === 'en' ? 'Please upload a JPG/PNG image file only' : 'कृपया केवल JPG/PNG छवि फ़ाइल अपलोड करें');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const submitData = new FormData();
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('address', formData.address);
      submitData.append('city', formData.city);
      submitData.append('state', formData.state);
      submitData.append('pincode', formData.pincode);
      submitData.append('occupation', formData.occupation);
      
      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }

      const response = await fetch(`${API_URL}/users/update-profile/${user._id}`, {
        method: 'PUT',
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: language === 'en' ? 'Profile updated successfully!' : 'प्रोफ़ाइल सफलतापूर्वक अपडेट हुई!'
        });
        updateUser(data.user);        isEditingRef.current = false;        setIsEditing(false);
        if (formData.photo) {
          document.getElementById('photoInput').value = '';
          setFormData({ ...formData, photo: null });
        }
      } else {
        setMessage({
          type: 'error',
          text: data.message || (language === 'en' ? 'Failed to update profile' : 'प्रोफ़ाइल अपडेट करने में विफल')
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: language === 'en' ? 'Connection error. Please try again.' : 'कनेक्शन त्रुटि। कृपया पुन: प्रयास करें।'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="profile-loading">{language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}</div>;
  }

  // ---- Non-Member Handlers ----
  const handleNmChange = (e) => {
    setNmFormData({ ...nmFormData, [e.target.name]: e.target.value });
  };

  const handleNmFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setNmFormData({ ...nmFormData, photo: file });
    } else if (file) {
      alert(language === 'en' ? 'Please upload JPG/PNG only' : 'कृपया केवल JPG/PNG अपलोड करें');
      e.target.value = '';
    }
  };

  const handleNmSubmit = async (e) => {
    e.preventDefault();
    if (!nmFormData.fullName.trim()) {
      setNmMessage({ type: 'error', text: language === 'en' ? '❌ Full name is required.' : '❌ पूरा नाम आवश्यक है।' });
      return;
    }
    if (!nmFormData.place.trim()) {
      setNmMessage({ type: 'error', text: language === 'en' ? '❌ Place is required.' : '❌ स्थान आवश्यक है।' });
      return;
    }
    if (!nmFormData.age || isNaN(nmFormData.age) || nmFormData.age <= 0) {
      setNmMessage({ type: 'error', text: language === 'en' ? '❌ Age is required.' : '❌ आयु आवश्यक है।' });
      return;
    }
    setNmLoading(true);
    setNmMessage({ type: '', text: '' });
    try {
      const fd = new FormData();
      Object.entries(nmFormData).forEach(([k, v]) => {
        if (k !== 'photo' && v) fd.append(k, v);
      });
      fd.append('addedBy', user._id);
      if (nmFormData.photo) fd.append('photo', nmFormData.photo);

      const res = await fetch(`${API_URL}/users/add-non-member`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setNonMembers(prev => [data.record, ...prev]);
        setNmFormData(emptyNm);
        setShowNmOptional(false);
        setShowNmModal(false);
        if (document.getElementById('nmPhoto')) document.getElementById('nmPhoto').value = '';
      } else {
        setNmMessage({ type: 'error', text: data.message || (language === 'en' ? '❌ Failed to add record.' : '❌ रिकॉर्ड जोड़ने में विफल।') });
      }
    } catch {
      setNmMessage({ type: 'error', text: language === 'en' ? '❌ Connection error.' : '❌ कनेक्शन त्रुटि।' });
    } finally {
      setNmLoading(false);
    }
  };

  const handleNmDelete = async (id) => {
    if (!window.confirm(language === 'en' ? 'Delete this record?' : 'यह रिकॉर्ड हटाएं?')) return;
    try {
      await fetch(`${API_URL}/users/non-members/${id}`, { method: 'DELETE' });
      setNonMembers(prev => prev.filter(r => r._id !== id));
    } catch { /* ignore */ }
  };

  return (
    <div className="profile-page">
      <div className="profile-wrapper">

        {/* ---- SIDEBAR ---- */}
        <div className="profile-sidebar">

          {/* Photo + Name + Badges */}
          <div className="sidebar-card">
            <div className="sidebar-banner"></div>
            <div className="sidebar-body">
              <div className="profile-photo-wrap">
                <div className="profile-photo">
                  {user.photoPath ? (
                    <img src={user.photoPath} alt="Profile"
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="no-photo">👤</div>
                  )}
                </div>
              </div>
              <p className="sidebar-name">{user.fullName}</p>
              <span className={`status-badge ${user.status}`}>{user.status.toUpperCase()}</span>

              <ul className="sidebar-info-list">
                <li>
                  <span className="sil-icon">📞</span>
                  <span className="sil-text">
                    <span className="sil-label">{language === 'en' ? 'Phone' : 'फोन'}</span>
                    <span className="sil-value">{user.phone}</span>
                  </span>
                </li>
                <li>
                  <span className="sil-icon">✉️</span>
                  <span className="sil-text">
                    <span className="sil-label">{language === 'en' ? 'Email' : 'ईमेल'}</span>
                    <span className="sil-value">{user.email}</span>
                  </span>
                </li>
                <li>
                  <span className="sil-icon">📍</span>
                  <span className="sil-text">
                    <span className="sil-label">{language === 'en' ? 'Location' : 'स्थान'}</span>
                    <span className="sil-value">{user.city}{user.state ? `, ${user.state}` : ''}</span>
                  </span>
                </li>
                <li>
                  <span className="sil-icon">💼</span>
                  <span className="sil-text">
                    <span className="sil-label">{language === 'en' ? 'Occupation' : 'व्यवसाय'}</span>
                    <span className="sil-value">{user.occupation || '—'}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* ID Card status indicator in sidebar */}
          {user.status !== 'approved' && (
            <div className="sidebar-card" style={{padding: '16px 20px'}}>
              <span className="id-card-pending">🔒 {language === 'en' ? 'ID Card available after approval' : 'आईडी कार्ड अनुमोदन के बाद उपलब्ध होगा'}</span>
            </div>
          )}

        </div>

        {/* ---- MAIN CONTENT ---- */}
        <div className="profile-main">

          {message.text && (
            <div className={`profile-message ${message.type}`}>{message.text}</div>
          )}

          {/* Digital ID Card - full width here for proper display */}
          {user.status === 'approved' && <DigitalIDCard user={user} />}

          {isEditing ? (
            <div className="profile-card">
              <div className="profile-card-header">
                <h3><span className="card-icon">✏️</span> {language === 'en' ? 'Edit Profile' : 'प्रोफ़ाइल संपादित करें'}</h3>
              </div>
              <div className="profile-card-body">
                <form onSubmit={handleSubmit} className="profile-form">

                  <div className="form-section-title">{language === 'en' ? '📷 Photo' : '📷 फोटो'}</div>
                  <div className="form-group">
                    <label htmlFor="photoInput">{language === 'en' ? 'Upload New Photo (JPG/PNG)' : 'नई फोटो अपलोड करें (JPG/PNG)'}</label>
                    <input type="file" id="photoInput" accept="image/jpeg,image/png,image/jpg"
                      onChange={handleFileChange} className="file-input" />
                  </div>

                  <div className="form-section-title">{language === 'en' ? '📞 Contact' : '📞 संपर्क'}</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{language === 'en' ? 'Email' : 'ईमेल'}</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>{language === 'en' ? 'Phone' : 'फोन'}</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-section-title">{language === 'en' ? '📍 Address' : '📍 पता'}</div>
                  <div className="form-group" style={{marginBottom: '13px'}}>
                    <label>{language === 'en' ? 'Address' : 'पता'}</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{language === 'en' ? 'City' : 'शहर'}</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>{language === 'en' ? 'State' : 'राज्य'}</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>{language === 'en' ? 'Pincode' : 'पिन कोड'}</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-section-title">{language === 'en' ? '💼 Other' : '💼 अन्य'}</div>
                  <div className="form-group">
                    <label>{language === 'en' ? 'Occupation' : 'व्यवसाय'}</label>
                    <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={loading}>
                      {loading ? (language === 'en' ? 'Saving…' : 'सहेज रहे हैं…') : (language === 'en' ? 'Save Changes' : 'परिवर्तन सहेजें')}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => { isEditingRef.current = false; setIsEditing(false); }}>
                      {language === 'en' ? 'Cancel' : 'रद्द करें'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              {/* Personal Info */}
              <div className="profile-card">
                <div className="profile-card-header">
                  <h3><span className="card-icon">👤</span> {language === 'en' ? 'Personal Information' : 'व्यक्तिगत जानकारी'}</h3>
                  <button className="edit-btn" onClick={() => {
                    setFormData({ email: user.email || '', phone: user.phone || '', address: user.address || '',
                      city: user.city || '', state: user.state || '', pincode: user.pincode || '',
                      occupation: user.occupation || '', photo: null });
                    isEditingRef.current = true;
                    setIsEditing(true);
                  }}>✏️ {language === 'en' ? 'Edit' : 'संपादित करें'}</button>
                </div>
                <div className="profile-card-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label">{language === 'en' ? 'Full Name' : 'पूरा नाम'}</div>
                      <div className="info-value">{user.fullName}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">{language === 'en' ? "Father's Name" : 'पिता का नाम'}</div>
                      <div className="info-value">{user.fatherName}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">{language === 'en' ? 'Date of Birth' : 'जन्म तिथि'}</div>
                      <div className="info-value">{new Date(user.dateOfBirth).toLocaleDateString('en-IN')}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">{language === 'en' ? 'Gender' : 'लिंग'}</div>
                      <div className="info-value">{user.gender}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">{language === 'en' ? 'Education' : 'शिक्षा'}</div>
                      <div className="info-value">{user.education}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">{language === 'en' ? 'Occupation' : 'व्यवसाय'}</div>
                      <div className="info-value">{user.occupation}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Address */}
              <div className="profile-card">
                <div className="profile-card-header">
                  <h3><span className="card-icon">📍</span> {language === 'en' ? 'Contact & Address' : 'संपर्क और पता'}</h3>
                </div>
                <div className="profile-card-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label">{language === 'en' ? 'Email' : 'ईमेल'}</div>
                      <div className="info-value">{user.email}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">{language === 'en' ? 'Phone' : 'फोन'}</div>
                      <div className="info-value">{user.phone}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">{language === 'en' ? 'City' : 'शहर'}</div>
                      <div className="info-value">{user.city}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">{language === 'en' ? 'State' : 'राज्य'}</div>
                      <div className="info-value">{user.state}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">{language === 'en' ? 'Pincode' : 'पिन कोड'}</div>
                      <div className="info-value">{user.pincode}</div>
                    </div>
                    <div className="info-item full-width">
                      <div className="info-label">{language === 'en' ? 'Address' : 'पता'}</div>
                      <div className="info-value">{user.address}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ===== NON-MEMBER RECORDS SECTION ===== */}
          <div className="profile-card nm-section">
            <div className="profile-card-header">
              <h3><span className="card-icon">👥</span>
                {language === 'en' ? 'Non-Member Records' : 'सदस्येतर रिकॉर्ड'}
              </h3>
              <button className="nm-add-btn" onClick={() => { setNmMessage({ type:'', text:'' }); setShowNmModal(true); }}>
                + {language === 'en' ? 'Add Record' : 'रिकॉर्ड जोड़ें'}
              </button>
            </div>
            <div className="profile-card-body">
              {nonMembers.length === 0 ? (
                <p className="nm-empty">{language === 'en'
                  ? 'No records added yet. You can add details of family/community members who are not registered.'
                  : 'अभी तक कोई रिकॉर्ड नहीं जोड़ा गया। आप उन परिवार/समुदाय के सदस्यों का विवरण जोड़ सकते हैं जो पंजीकृत नहीं हैं।'}
                </p>
              ) : (
                <div className="nm-list">
                  {nonMembers.map(r => (
                    <div className="nm-card" key={r._id}>
                      <div className="nm-card-photo">
                        {r.photoPath
                          ? <img src={r.photoPath} alt={r.fullName} />
                          : <div className="nm-card-no-photo">👤</div>}
                      </div>
                      <div className="nm-card-info">
                        <p className="nm-card-name">{r.fullName}</p>
                        {r.relationship && <span className="nm-relation-tag">{r.relationship}</span>}
                        <p className="nm-card-detail">📍 {r.place}</p>
                        <p className="nm-card-detail">🎂 {language === 'en' ? `Age: ${r.age}` : `आयु: ${r.age}`}</p>
                        {r.occupation && <p className="nm-card-detail">💼 {r.occupation}</p>}
                      </div>
                      <div className="nm-card-actions">
                        <button className="nm-view-btn" onClick={() => setNmViewRecord(r)}>
                          {language === 'en' ? 'View' : 'देखें'}
                        </button>
                        <button className="nm-del-btn" onClick={() => handleNmDelete(r._id)}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ===== ADD NON-MEMBER MODAL ===== */}
      {showNmModal && (
        <div className="nm-modal-overlay" onClick={() => setShowNmModal(false)}>
          <div className="nm-modal" onClick={e => e.stopPropagation()}>
            <div className="nm-modal-header">
              <h3>👥 {language === 'en' ? 'Add Non-Member Record' : 'गैर-सदस्य रिकॉर्ड जोड़ें'}</h3>
              <button className="nm-modal-close" onClick={() => setShowNmModal(false)}>✕</button>
            </div>
            <div className="nm-modal-body">
              {nmMessage.text && (
                <div className={`profile-message ${nmMessage.type}`}>{nmMessage.text}</div>
              )}
              <form onSubmit={handleNmSubmit}>

                {/* --- MANDATORY FIELDS --- */}
                <div className="nm-required-note">
                  {language === 'en'
                    ? '★ Fields marked with * are mandatory'
                    : '★ * से चिह्नित फ़ील्ड अनिवार्य हैं'}
                </div>

                <div className="form-section-title">
                  {language === 'en' ? '📋 Basic Details' : '📋 बुनियादी विवरण'}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{language === 'en' ? 'Full Name *' : 'पूरा नाम *'}</label>
                    <input type="text" name="fullName" value={nmFormData.fullName}
                      onChange={handleNmChange} placeholder={language === 'en' ? 'Enter full name' : 'पूरा नाम दर्ज करें'} required />
                  </div>
                  <div className="form-group">
                    <label>{language === 'en' ? 'Place (City/Village) *' : 'स्थान (शहर/गाँव) *'}</label>
                    <input type="text" name="place" value={nmFormData.place}
                      onChange={handleNmChange} placeholder={language === 'en' ? 'City or village' : 'शहर या गाँव'} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{language === 'en' ? 'Age *' : 'आयु *'}</label>
                    <input type="number" name="age" value={nmFormData.age}
                      onChange={handleNmChange} min="1" max="120" placeholder={language === 'en' ? 'Enter age' : 'आयु दर्ज करें'} required />
                  </div>
                  <div className="form-group">
                    <label>{language === 'en' ? 'Relationship (optional)' : 'संबंध (वैकल्पिक)'}</label>
                    <input type="text" name="relationship" value={nmFormData.relationship}
                      onChange={handleNmChange} placeholder={language === 'en' ? 'e.g. Brother, Uncle' : 'जैसे भाई, चाचा'} />
                  </div>
                </div>

                {/* --- OPTIONAL FIELDS TOGGLE --- */}
                <button type="button" className="nm-optional-toggle"
                  onClick={() => setShowNmOptional(v => !v)}>
                  {showNmOptional
                    ? (language === 'en' ? '▲ Hide Optional Details' : '▲ वैकल्पिक विवरण छुपाएं')
                    : (language === 'en' ? '▼ Add More Details (Optional)' : '▼ और विवरण जोड़ें (वैकल्पिक)')}
                </button>

                {showNmOptional && (
                  <>
                    <div className="form-section-title">
                      {language === 'en' ? '👤 Personal (Optional)' : '👤 व्यक्तिगत (वैकल्पिक)'}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{language === 'en' ? "Father's Name" : 'पिता का नाम'}</label>
                        <input type="text" name="fatherName" value={nmFormData.fatherName}
                          onChange={handleNmChange} />
                      </div>
                      <div className="form-group">
                        <label>{language === 'en' ? 'Gender' : 'लिंग'}</label>
                        <select name="gender" value={nmFormData.gender} onChange={handleNmChange}>
                          <option value="">{language === 'en' ? '-- Select --' : '-- चुनें --'}</option>
                          <option value="male">{language === 'en' ? 'Male' : 'पुरुष'}</option>
                          <option value="female">{language === 'en' ? 'Female' : 'महिला'}</option>
                          <option value="other">{language === 'en' ? 'Other' : 'अन्य'}</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{language === 'en' ? 'Email' : 'ईमेल'}</label>
                        <input type="email" name="email" value={nmFormData.email} onChange={handleNmChange} />
                      </div>
                      <div className="form-group">
                        <label>{language === 'en' ? 'Phone' : 'फोन'}</label>
                        <input type="tel" name="phone" value={nmFormData.phone} onChange={handleNmChange} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{language === 'en' ? 'Occupation' : 'व्यवसाय'}</label>
                        <input type="text" name="occupation" value={nmFormData.occupation} onChange={handleNmChange} />
                      </div>
                      <div className="form-group">
                        <label>{language === 'en' ? 'Education' : 'शिक्षा'}</label>
                        <select name="education" value={nmFormData.education} onChange={handleNmChange}>
                          <option value="">{language === 'en' ? '-- Select --' : '-- चुनें --'}</option>
                          <option value="below-10th">{language === 'en' ? 'Below 10th' : '10वीं से कम'}</option>
                          <option value="10th">{language === 'en' ? '10th Pass' : '10वीं पास'}</option>
                          <option value="12th">{language === 'en' ? '12th Pass' : '12वीं पास'}</option>
                          <option value="graduate">{language === 'en' ? 'Graduate' : 'स्नातक'}</option>
                          <option value="post-graduate">{language === 'en' ? 'Post Graduate' : 'स्नातकोत्तर'}</option>
                          <option value="diploma">{language === 'en' ? 'Diploma' : 'डिप्लोमा'}</option>
                          <option value="others">{language === 'en' ? 'Others' : 'अन्य'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-section-title">
                      {language === 'en' ? '📍 Address (Optional)' : '📍 पता (वैकल्पिक)'}
                    </div>
                    <div className="form-group" style={{marginBottom:'13px'}}>
                      <label>{language === 'en' ? 'Full Address' : 'पूरा पता'}</label>
                      <textarea name="address" value={nmFormData.address}
                        onChange={handleNmChange} rows="2" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{language === 'en' ? 'Village' : 'गाँव'}</label>
                        <input type="text" name="village" value={nmFormData.village} onChange={handleNmChange} />
                      </div>
                      <div className="form-group">
                        <label>{language === 'en' ? 'Block' : 'ब्लॉक'}</label>
                        <input type="text" name="block" value={nmFormData.block} onChange={handleNmChange} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{language === 'en' ? 'Tehsil' : 'तहसील'}</label>
                        <input type="text" name="tehsil" value={nmFormData.tehsil} onChange={handleNmChange} />
                      </div>
                      <div className="form-group">
                        <label>{language === 'en' ? 'District' : 'जिला'}</label>
                        <input type="text" name="district" value={nmFormData.district} onChange={handleNmChange} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{language === 'en' ? 'State' : 'राज्य'}</label>
                        <input type="text" name="state" value={nmFormData.state} onChange={handleNmChange} />
                      </div>
                      <div className="form-group">
                        <label>{language === 'en' ? 'Pincode' : 'पिन कोड'}</label>
                        <input type="text" name="pincode" value={nmFormData.pincode} onChange={handleNmChange} />
                      </div>
                    </div>

                    <div className="form-section-title">
                      {language === 'en' ? '📷 Photo (Optional)' : '📷 फोटो (वैकल्पिक)'}
                    </div>
                    <div className="form-group">
                      <label>{language === 'en' ? 'Upload Photo (JPG/PNG)' : 'फोटो अपलोड करें (JPG/PNG)'}</label>
                      <input id="nmPhoto" type="file" accept="image/jpeg,image/png,image/jpg"
                        onChange={handleNmFileChange} className="file-input" />
                    </div>
                  </>
                )}

                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={nmLoading}>
                    {nmLoading
                      ? (language === 'en' ? 'Saving…' : 'सहेज रहे हैं…')
                      : (language === 'en' ? 'Save Record' : 'रिकॉर्ड सहेजें')}
                  </button>
                  <button type="button" className="cancel-btn"
                    onClick={() => { setShowNmModal(false); setNmFormData(emptyNm); setNmMessage({ type:'', text:'' }); setShowNmOptional(false); }}>
                    {language === 'en' ? 'Cancel' : 'रद्द करें'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== VIEW NON-MEMBER RECORD MODAL ===== */}
      {nmViewRecord && (
        <div className="nm-modal-overlay" onClick={() => setNmViewRecord(null)}>
          <div className="nm-modal nm-view-modal" onClick={e => e.stopPropagation()}>
            <div className="nm-modal-header">
              <h3>👤 {nmViewRecord.fullName}</h3>
              <button className="nm-modal-close" onClick={() => setNmViewRecord(null)}>✕</button>
            </div>
            <div className="nm-modal-body">
              <div className="nm-view-photo-wrap">
                {nmViewRecord.photoPath
                  ? <img src={nmViewRecord.photoPath} alt={nmViewRecord.fullName} className="nm-view-photo" />
                  : <div className="nm-view-no-photo">👤</div>}
              </div>
              <div className="info-grid">
                {[
                  ['fullName',    language === 'en' ? 'Full Name'    : 'पूरा नाम',      nmViewRecord.fullName],
                  ['place',       language === 'en' ? 'Place'        : 'स्थान',         nmViewRecord.place],
                  ['age',         language === 'en' ? 'Age'          : 'आयु',           nmViewRecord.age],
                  ['rel',         language === 'en' ? 'Relationship' : 'संबंध',         nmViewRecord.relationship],
                  ['father',      language === 'en' ? "Father's Name": 'पिता का नाम',   nmViewRecord.fatherName],
                  ['gender',      language === 'en' ? 'Gender'       : 'लिंग',          nmViewRecord.gender],
                  ['email',       language === 'en' ? 'Email'        : 'ईमेल',          nmViewRecord.email],
                  ['phone',       language === 'en' ? 'Phone'        : 'फोन',           nmViewRecord.phone],
                  ['occ',         language === 'en' ? 'Occupation'   : 'व्यवसाय',       nmViewRecord.occupation],
                  ['edu',         language === 'en' ? 'Education'    : 'शिक्षा',        nmViewRecord.education],
                  ['state',       language === 'en' ? 'State'        : 'राज्य',         nmViewRecord.state],
                  ['district',    language === 'en' ? 'District'     : 'जिला',          nmViewRecord.district],
                  ['tehsil',      language === 'en' ? 'Tehsil'       : 'तहसील',         nmViewRecord.tehsil],
                  ['village',     language === 'en' ? 'Village'      : 'गाँव',          nmViewRecord.village],
                  ['block',       language === 'en' ? 'Block'        : 'ब्लॉक',         nmViewRecord.block],
                  ['pincode',     language === 'en' ? 'Pincode'      : 'पिन कोड',       nmViewRecord.pincode],
                ].filter(([,, val]) => val).map(([key, label, val]) => (
                  <div className="info-item" key={key}>
                    <div className="info-label">{label}</div>
                    <div className="info-value" style={{textTransform: key === 'gender' ? 'capitalize' : 'none'}}>{val}</div>
                  </div>
                ))}
                {nmViewRecord.address && (
                  <div className="info-item full-width">
                    <div className="info-label">{language === 'en' ? 'Address' : 'पता'}</div>
                    <div className="info-value">{nmViewRecord.address}</div>
                  </div>
                )}
              </div>
              <div style={{marginTop:'18px', fontSize:'0.78rem', color:'#aaa', textAlign:'right'}}>
                {language === 'en' ? 'Added on: ' : 'जोड़ा गया: '}
                {new Date(nmViewRecord.addedAt).toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
