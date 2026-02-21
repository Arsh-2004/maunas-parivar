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
              {user.membershipTier && (
                <div>
                  <span className={`tier-badge tier-${user.membershipTier.toLowerCase()}`}>
                    {user.membershipTier === 'diamond' && '💎 '}
                    {user.membershipTier === 'gold' && '🥇 '}
                    {user.membershipTier === 'silver' && '🥈 '}
                    {user.membershipTier === 'bronze' && '🥉 '}
                    {user.membershipTier === 'general' && '🌟 '}
                    {user.membershipTier.toUpperCase()} {language === 'en' ? 'TIER' : 'स्तर'}
                  </span>
                </div>
              )}

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

          {/* Tier Privileges */}
          {(user.membershipTier === 'diamond' || user.membershipTier === 'gold') && (
            <div className="privilege-card">
              <div className="privilege-card-header">
                {user.membershipTier === 'diamond' ? '💎' : '🥇'} {language === 'en' ? 'Your Privileges' : 'आपके विशेषाधिकार'}
              </div>
              <div className="privilege-card-body">
                <ul className="privilege-list">
                  {user.membershipTier === 'diamond' && <>
                    <li>✅ {language === 'en' ? 'Approve / Reject new members' : 'नए सदस्यों को स्वीकृत/अस्वीकृत करें'}</li>
                    <li>✅ {language === 'en' ? 'Add events & gallery photos' : 'कार्यक्रम और गैलरी फोटो जोड़ें'}</li>
                    <li>✅ {language === 'en' ? 'Manage community activities' : 'सामुदायिक गतिविधियां प्रबंधित करें'}</li>
                  </>}
                  {user.membershipTier === 'gold' && <>
                    <li>✅ {language === 'en' ? 'View all upcoming events' : 'सभी आगामी कार्यक्रम देखें'}</li>
                    <li>✅ {language === 'en' ? 'Volunteer to organize events' : 'कार्यक्रम आयोजित करने के लिए स्वयंसेवक'}</li>
                    <li>✅ {language === 'en' ? 'Priority event participation' : 'प्राथमिकता कार्यक्रम भागीदारी'}</li>
                  </>}
                </ul>
                <button
                  className={`dashboard-access-btn ${user.membershipTier}`}
                  onClick={() => navigate(user.membershipTier === 'diamond' ? '/diamond-dashboard' : '/gold-dashboard')}
                >
                  {user.membershipTier === 'diamond' ? '💎' : '🥇'} {language === 'en' ? `Go to ${user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1)} Panel` : `${user.membershipTier === 'diamond' ? 'डायमंड' : 'गोल्ड'} पैनल पर जाएं`}
                </button>
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
