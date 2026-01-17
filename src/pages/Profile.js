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
        updateUser(data.user);
        setIsEditing(false);
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
      <div className="profile-container">
        <div className="profile-header">
          <h1>{language === 'en' ? '👤 My Profile' : '👤 मेरी प्रोफ़ाइल'}</h1>
        </div>

        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-photo-section">
          <div className="profile-photo">
            {user.photoPath ? (
              <img 
                src={user.photoPath} 
                alt="Profile"
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  console.log('User photoPath:', user.photoPath);
                  e.target.style.display = 'none';
                }}
                onLoad={() => console.log('Image loaded successfully')}
              />
            ) : (
              <div className="no-photo">👤</div>
            )}
          </div>
          <div className="profile-info">
            <h2>{user.fullName}</h2>
            <p className="status-badge">{user.status.toUpperCase()}</p>
            {user.membershipTier && (
              <p className={`tier-badge tier-${user.membershipTier.toLowerCase()}`}>
                {user.membershipTier === 'diamond' && '💎 '}
                {user.membershipTier === 'gold' && '🥇 '}
                {user.membershipTier === 'silver' && '🥈 '}
                {user.membershipTier.toUpperCase()} {language === 'en' ? 'TIER' : 'स्तर'}
              </p>
            )}
            {!user.membershipTier && (
              <p style={{color: 'red', fontSize: '0.9rem', marginTop: '10px'}}>
                ⚠️ {language === 'en' ? 'Tier not loaded - Please logout and login again' : 'टियर लोड नहीं हुआ - कृपया लॉगआउट करें और फिर से लॉगिन करें'}
              </p>
            )}

            {/* Digital ID Card Component - Modern UI */}
            {user.status === 'approved' && (
              <DigitalIDCard user={user} />
            )}

            {user.status !== 'approved' && (
              <div className="id-card-section pending">
                <span className="id-card-pending">🔒 {language === 'en' ? 'ID Card will be available after approval' : 'आईडी कार्ड अनुमोदन के बाद उपलब्ध होगा'}</span>
              </div>
            )}
            
            {/* Dashboard Access Section */}
            {user.membershipTier === 'diamond' && (
              <div className="tier-access-info">
                <h4>🎯 {language === 'en' ? 'Your Diamond Privileges:' : 'आपके डायमंड विशेषाधिकार:'}</h4>
                <ul>
                  <li>✅ {language === 'en' ? 'Approve/Reject new members' : 'नए सदस्यों को स्वीकृत/अस्वीकृत करें'}</li>
                  <li>✅ {language === 'en' ? 'Add events & gallery photos' : 'कार्यक्रम और गैलरी फोटो जोड़ें'}</li>
                  <li>✅ {language === 'en' ? 'Manage community activities' : 'सामुदायिक गतिविधियां प्रबंधित करें'}</li>
                </ul>
                <button 
                  className="dashboard-access-btn diamond"
                  onClick={() => navigate('/diamond-dashboard')}
                >
                  💎 {language === 'en' ? 'Go to Diamond Panel' : 'डायमंड पैनल पर जाएं'}
                </button>
              </div>
            )}
            
            {user.membershipTier === 'gold' && (
              <div className="tier-access-info">
                <h4>🥇 {language === 'en' ? 'Your Gold Privileges:' : 'आपके गोल्ड विशेषाधिकार:'}</h4>
                <ul>
                  <li>✅ {language === 'en' ? 'View all upcoming events' : 'सभी आगामी कार्यक्रम देखें'}</li>
                  <li>✅ {language === 'en' ? 'Volunteer to organize events' : 'कार्यक्रम आयोजित करने के लिए स्वयंसेवक'}</li>
                  <li>✅ {language === 'en' ? 'Priority event participation' : 'प्राथमिकता कार्यक्रम भागीदारी'}</li>
                </ul>
                <button 
                  className="dashboard-access-btn gold"
                  onClick={() => navigate('/gold-dashboard')}
                >
                  🥇 {language === 'en' ? 'Go to Gold Panel' : 'गोल्ड पैनल पर जाएं'}
                </button>
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3>{language === 'en' ? 'Update Photo' : 'फोटो अपडेट करें'}</h3>
              <div className="form-group">
                <label htmlFor="photoInput">
                  {language === 'en' ? 'Upload New Photo (JPG/PNG)' : 'नई फोटो अपलोड करें (JPG/PNG)'}
                </label>
                <input
                  type="file"
                  id="photoInput"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>{language === 'en' ? 'Contact Information' : 'संपर्क जानकारी'}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>{language === 'en' ? 'Email' : 'ईमेल'}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{language === 'en' ? 'Phone' : 'फोन'}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>{language === 'en' ? 'Address' : 'पता'}</h3>
              <div className="form-group">
                <label>{language === 'en' ? 'Address' : 'पता'}</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{language === 'en' ? 'City' : 'शहर'}</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{language === 'en' ? 'State' : 'राज्य'}</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{language === 'en' ? 'Pincode' : 'पिन कोड'}</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>{language === 'en' ? 'Other Information' : 'अन्य जानकारी'}</h3>
              <div className="form-group">
                <label>{language === 'en' ? 'Occupation' : 'व्यवसाय'}</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? (language === 'en' ? 'Saving...' : 'सहेज रहे हैं...') : (language === 'en' ? 'Save Changes' : 'परिवर्तन सहेजें')}
              </button>
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                {language === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-section">
              <h3>{language === 'en' ? 'Personal Information' : 'व्यक्तिगत जानकारी'}</h3>
              <div className="detail-item">
                <span className="label">{language === 'en' ? 'Full Name:' : 'पूरा नाम:'}</span>
                <span className="value">{user.fullName}</span>
              </div>
              <div className="detail-item">
                <span className="label">{language === 'en' ? "Father's Name:" : 'पिता का नाम:'}</span>
                <span className="value">{user.fatherName}</span>
              </div>
              <div className="detail-item">
                <span className="label">{language === 'en' ? 'Date of Birth:' : 'जन्म तिथि:'}</span>
                <span className="value">{new Date(user.dateOfBirth).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="detail-item">
                <span className="label">{language === 'en' ? 'Gender:' : 'लिंग:'}</span>
                <span className="value">{user.gender}</span>
              </div>
              <div className="detail-item">
                <span className="label">{language === 'en' ? 'Education:' : 'शिक्षा:'}</span>
                <span className="value">{user.education}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>{language === 'en' ? 'Contact Information' : 'संपर्क जानकारी'}</h3>
              <div className="detail-item">
                <span className="label">{language === 'en' ? 'Email:' : 'ईमेल:'}</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="label">{language === 'en' ? 'Phone:' : 'फोन:'}</span>
                <span className="value">{user.phone}</span>
              </div>
              <div className="detail-item">
                <span className="label">{language === 'en' ? 'Address:' : 'पता:'}</span>
                <span className="value">{user.address}</span>
              </div>
              <div className="detail-item">
                <span className="label">{language === 'en' ? 'City:' : 'शहर:'}</span>
                <span className="value">{user.city}</span>
              </div>
              <div className="detail-item">
                <span className="label">{language === 'en' ? 'State:' : 'राज्य:'}</span>
                <span className="value">{user.state}</span>
              </div>
              <div className="detail-item">
                <span className="label">{language === 'en' ? 'Pincode:' : 'पिन कोड:'}</span>
                <span className="value">{user.pincode}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>{language === 'en' ? 'Other Information' : 'अन्य जानकारी'}</h3>
              <div className="detail-item">
                <span className="label">{language === 'en' ? 'Occupation:' : 'व्यवसाय:'}</span>
                <span className="value">{user.occupation}</span>
              </div>
            </div>

            {/* Digital ID Card Component */}
            {user.status === 'approved' && (
              <div className="digital-id-card-section">
                <h3>{language === 'en' ? '📱 Digital ID Card' : '📱 डिजिटल आईडी कार्ड'}</h3>
                <DigitalIDCard user={user} />
              </div>
            )}

            <button className="edit-btn" onClick={() => {
              // Reset form data with current user data when entering edit mode
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
              setIsEditing(true);
            }}>
              ✏️ {language === 'en' ? 'Edit Profile' : 'प्रोफ़ाइल संपादित करें'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
