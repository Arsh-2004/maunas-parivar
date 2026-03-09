import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  // Family member state
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [familyLoading, setFamilyLoading] = useState(false);
  const [familyMessage, setFamilyMessage] = useState({ type: '', text: '' });
  const [newFamilyMember, setNewFamilyMember] = useState({ name: '', relation: '', gender: '', dateOfBirth: '', occupation: '', phone: '' });
  const [fmDobDay, setFmDobDay] = useState('');
  const [fmDobMonth, setFmDobMonth] = useState('');
  const [fmDobYear, setFmDobYear] = useState('');
  const [fmPhotoFile, setFmPhotoFile] = useState(null);
  const [fmPhotoPreview, setFmPhotoPreview] = useState('');

  // Edit family member state
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editFamilyMember, setEditFamilyMember] = useState({ name: '', relation: '', gender: '', dateOfBirth: '', occupation: '', phone: '' });
  const [editFmDobDay, setEditFmDobDay] = useState('');
  const [editFmDobMonth, setEditFmDobMonth] = useState('');
  const [editFmDobYear, setEditFmDobYear] = useState('');
  const [editFmPhotoFile, setEditFmPhotoFile] = useState(null);
  const [editFmPhotoPreview, setEditFmPhotoPreview] = useState('');

  const months = [
    { value: '01', en: '01 - January',  hi: '01 - जनवरी' },
    { value: '02', en: '02 - February', hi: '02 - फ़रवरी' },
    { value: '03', en: '03 - March',    hi: '03 - मार्च' },
    { value: '04', en: '04 - April',    hi: '04 - अप्रैल' },
    { value: '05', en: '05 - May',      hi: '05 - मई' },
    { value: '06', en: '06 - June',     hi: '06 - जून' },
    { value: '07', en: '07 - July',     hi: '07 - जुलाई' },
    { value: '08', en: '08 - August',   hi: '08 - अगस्त' },
    { value: '09', en: '09 - September',hi: '09 - सितंबर' },
    { value: '10', en: '10 - October',  hi: '10 - अक्तूबर' },
    { value: '11', en: '11 - November', hi: '11 - नवंबर' },
    { value: '12', en: '12 - December', hi: '12 - दिसंबर' },
  ];

  const handleFmDobChange = (field, value) => {
    const newDay   = field === 'day'   ? value : fmDobDay;
    const newMonth = field === 'month' ? value : fmDobMonth;
    const newYear  = field === 'year'  ? value : fmDobYear;
    if (field === 'day')   setFmDobDay(value);
    if (field === 'month') setFmDobMonth(value);
    if (field === 'year')  setFmDobYear(value);
    if (newDay && newMonth && newYear) {
      setNewFamilyMember(prev => ({ ...prev, dateOfBirth: `${newYear}-${newMonth}-${newDay}` }));
    } else {
      setNewFamilyMember(prev => ({ ...prev, dateOfBirth: '' }));
    }
  };

  const handleEditFmDobChange = (field, value) => {
    const newDay   = field === 'day'   ? value : editFmDobDay;
    const newMonth = field === 'month' ? value : editFmDobMonth;
    const newYear  = field === 'year'  ? value : editFmDobYear;
    if (field === 'day')   setEditFmDobDay(value);
    if (field === 'month') setEditFmDobMonth(value);
    if (field === 'year')  setEditFmDobYear(value);
    if (newDay && newMonth && newYear) {
      setEditFamilyMember(prev => ({ ...prev, dateOfBirth: `${newYear}-${newMonth}-${newDay}` }));
    } else {
      setEditFamilyMember(prev => ({ ...prev, dateOfBirth: '' }));
    }
  };

  const handleStartEditMember = (member) => {
    setEditingMemberId(member._id);
    setEditFamilyMember({
      name: member.name || '',
      relation: member.relation || '',
      gender: member.gender || '',
      dateOfBirth: member.dateOfBirth || '',
      occupation: member.occupation || '',
      phone: member.phone || ''
    });
    if (member.dateOfBirth) {
      const d = new Date(member.dateOfBirth);
      if (!isNaN(d)) {
        setEditFmDobYear(String(d.getUTCFullYear()));
        setEditFmDobMonth(String(d.getUTCMonth() + 1).padStart(2, '0'));
        setEditFmDobDay(String(d.getUTCDate()).padStart(2, '0'));
      }
    } else {
      setEditFmDobDay(''); setEditFmDobMonth(''); setEditFmDobYear('');
    }
    setEditFmPhotoFile(null);
    setEditFmPhotoPreview(member.photoPath || '');
    setShowFamilyForm(false);
  };

  const handleSaveEditMember = async () => {
    if (!editFamilyMember.name.trim()) {
      setFamilyMessage({ type: 'error', text: language === 'en' ? 'Please enter member name' : 'कृपया सदस्य का नाम दर्ज करें' });
      return;
    }
    if (!editFamilyMember.relation) {
      setFamilyMessage({ type: 'error', text: language === 'en' ? 'Please select relation' : 'कृपया संबंध चुनें' });
      return;
    }
    setFamilyLoading(true);
    setFamilyMessage({ type: '', text: '' });
    try {
      const submitData = new FormData();
      submitData.append('phone', user.phone);
      submitData.append('password', user.password);
      submitData.append('name', editFamilyMember.name.trim());
      submitData.append('relation', editFamilyMember.relation);
      if (editFamilyMember.gender) submitData.append('gender', editFamilyMember.gender);
      if (editFamilyMember.dateOfBirth) submitData.append('dateOfBirth', editFamilyMember.dateOfBirth);
      if (editFamilyMember.occupation) submitData.append('occupation', editFamilyMember.occupation);
      if (editFamilyMember.phone) submitData.append('memberPhone', editFamilyMember.phone);
      if (editFmPhotoFile) submitData.append('familyMemberPhoto', editFmPhotoFile);

      const response = await fetch(`${API_URL}/users/family/${user._id}/edit/${editingMemberId}`, {
        method: 'PUT',
        body: submitData,
      });
      const data = await response.json();
      if (data.success) {
        setFamilyMembers(data.familyMembers);
        setEditingMemberId(null);
        setFamilyMessage({ type: 'success', text: language === 'en' ? 'Family member updated!' : 'पारिवारिक सदस्य अपडेट हो गया!' });
      } else {
        setFamilyMessage({ type: 'error', text: data.message || (language === 'en' ? 'Failed to update' : 'अपडेट विफल') });
      }
    } catch (err) {
      setFamilyMessage({ type: 'error', text: language === 'en' ? 'Connection error. Please try again.' : 'कनेक्शन त्रुटि।' });
    } finally {
      setFamilyLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    occupation: '',
    education: '',
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
            // Load family members from fresh data
            setFamilyMembers(data.user.familyMembers || []);
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
                education: data.user.education || '',
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
          education: user.education || '',
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

  const handleAddFamilyMember = async () => {
    if (!newFamilyMember.name.trim()) {
      setFamilyMessage({ type: 'error', text: language === 'en' ? 'Please enter member name' : 'कृपया सदस्य का नाम दर्ज करें' });
      return;
    }
    if (!newFamilyMember.relation) {
      setFamilyMessage({ type: 'error', text: language === 'en' ? 'Please select relation' : 'कृपया संबंध चुनें' });
      return;
    }
    setFamilyLoading(true);
    setFamilyMessage({ type: '', text: '' });
    try {
      const submitData = new FormData();
      submitData.append('phone', user.phone);
      submitData.append('password', user.password);
      submitData.append('name', newFamilyMember.name.trim());
      submitData.append('relation', newFamilyMember.relation);
      if (newFamilyMember.gender) submitData.append('gender', newFamilyMember.gender);
      if (newFamilyMember.dateOfBirth) submitData.append('dateOfBirth', newFamilyMember.dateOfBirth);
      if (newFamilyMember.occupation) submitData.append('occupation', newFamilyMember.occupation);
      if (newFamilyMember.phone) submitData.append('memberPhone', newFamilyMember.phone);
      if (fmPhotoFile) submitData.append('familyMemberPhoto', fmPhotoFile);

      const response = await fetch(`${API_URL}/users/family/${user._id}/add`, {
        method: 'POST',
        body: submitData,
      });
      const data = await response.json();
      if (data.success) {
        setFamilyMembers(data.familyMembers);
        setNewFamilyMember({ name: '', relation: '', gender: '', dateOfBirth: '', occupation: '', phone: '' });
        setFmDobDay(''); setFmDobMonth(''); setFmDobYear('');
        setFmPhotoFile(null); setFmPhotoPreview('');
        const fmPhotoInput = document.getElementById('fmPhotoInputProfile');
        if (fmPhotoInput) fmPhotoInput.value = '';
        setShowFamilyForm(false);
        setFamilyMessage({ type: 'success', text: language === 'en' ? 'Family member added successfully!' : 'पारिवारिक सदस्य सफलतापूर्वक जोड़ा गया!' });
      } else {
        setFamilyMessage({ type: 'error', text: data.message || (language === 'en' ? 'Failed to add member' : 'सदस्य जोड़ने में विफल') });
      }
    } catch (err) {
      setFamilyMessage({ type: 'error', text: language === 'en' ? 'Connection error. Please try again.' : 'कनेक्शन त्रुटि। पुनः प्रयास करें।' });
    } finally {
      setFamilyLoading(false);
    }
  };

  const handleRemoveFamilyMember = async (memberId) => {
    if (!window.confirm(language === 'en' ? 'Remove this family member?' : 'इस पारिवारिक सदस्य को हटाएं?')) return;
    setFamilyLoading(true);
    setFamilyMessage({ type: '', text: '' });
    try {
      const response = await fetch(`${API_URL}/users/family/${user._id}/remove/${memberId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, password: user.password })
      });
      const data = await response.json();
      if (data.success) {
        setFamilyMembers(data.familyMembers);
        setFamilyMessage({ type: 'success', text: language === 'en' ? 'Family member removed.' : 'पारिवारिक सदस्य हटा दिया गया।' });
      } else {
        setFamilyMessage({ type: 'error', text: data.message || (language === 'en' ? 'Failed to remove' : 'हटाने में विफल') });
      }
    } catch (err) {
      setFamilyMessage({ type: 'error', text: language === 'en' ? 'Connection error.' : 'कनेक्शन त्रुटि।' });
    } finally {
      setFamilyLoading(false);
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
      submitData.append('education', formData.education);
      
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
                    <img key={user.photoPath} src={user.photoPath} alt="Profile"
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
                  <div className="form-group photo-edit-group">
                    {user.photoPath && !formData.photo && (
                      <div className="photo-preview-wrap">
                        <img src={user.photoPath} alt="Current" className="photo-preview-img" />
                        <span className="photo-preview-label">{language === 'en' ? 'Current photo' : 'वर्तमान फोटो'}</span>
                      </div>
                    )}
                    {formData.photo && (
                      <div className="photo-preview-wrap">
                        <img src={URL.createObjectURL(formData.photo)} alt="New" className="photo-preview-img" />
                        <span className="photo-preview-label">{language === 'en' ? 'New photo (preview)' : 'नई फोटो (प्रीव्यू)'}</span>
                      </div>
                    )}
                    <label htmlFor="photoInput" className="file-upload-label">
                      📁 {language === 'en' ? 'Choose from Gallery (JPG/PNG)' : 'गैलरी से चुनें (JPG/PNG)'}
                    </label>
                    <input type="file" id="photoInput" accept="image/jpeg,image/png,image/jpg"
                      onChange={handleFileChange} className="file-input" />
                    <label htmlFor="cameraInput" className="file-upload-label camera-label">
                      📷 {language === 'en' ? 'Take Photo (Camera)' : 'कैमरा से फोटो लें'}
                    </label>
                    <input type="file" id="cameraInput" accept="image/*" capture="environment"
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
                  <div className="form-row">
                    <div className="form-group">
                      <label>{language === 'en' ? 'Occupation' : 'व्यवसाय'}</label>
                      <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>{language === 'en' ? 'Education' : 'शिक्षा'}</label>
                      <select name="education" value={formData.education} onChange={handleChange}>
                        <option value="">{language === 'en' ? 'Select Education' : 'शिक्षा चुनें'}</option>
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
                      occupation: user.occupation || '', education: user.education || '', photo: null });
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

          {/* ===== FAMILY MEMBERS SECTION ===== */}
          {user.status === 'approved' && (
            <div className="profile-card family-members-card">
              <div className="profile-card-header">
                <h3><span className="card-icon">👨‍👩‍👧‍👦</span> {language === 'en' ? 'Family Members' : 'पारिवारिक सदस्य'}</h3>
                <button className="edit-btn" onClick={() => { setShowFamilyForm(!showFamilyForm); setFamilyMessage({ type: '', text: '' }); }}>
                  {showFamilyForm ? (language === 'en' ? '✕ Close' : '✕ बंद करें') : (language === 'en' ? '+ Add Member' : '+ सदस्य जोड़ें')}
                </button>
              </div>
              <div className="profile-card-body">
                {familyMessage.text && (
                  <div className={`profile-message ${familyMessage.type}`} style={{ marginBottom: '12px' }}>{familyMessage.text}</div>
                )}

                {/* Add family member form */}
                {showFamilyForm && (
                  <div className="family-add-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>{language === 'en' ? 'Name *' : 'नाम *'}</label>
                        <input
                          type="text"
                          value={newFamilyMember.name}
                          onChange={e => setNewFamilyMember({ ...newFamilyMember, name: e.target.value })}
                          placeholder={language === 'en' ? 'Full name' : 'पूरा नाम'}
                        />
                      </div>
                      <div className="form-group">
                        <label>{language === 'en' ? 'Relation *' : 'संबंध *'}</label>
                        <select
                          value={newFamilyMember.relation}
                          onChange={e => setNewFamilyMember({ ...newFamilyMember, relation: e.target.value })}
                        >
                          <option value="">{language === 'en' ? 'Select Relation' : 'संबंध चुनें'}</option>
                          <option value="Spouse">{language === 'en' ? 'Spouse (Wife/Husband)' : 'पत्नी/पति'}</option>
                          <option value="Son">{language === 'en' ? 'Son' : 'पुत्र'}</option>
                          <option value="Daughter">{language === 'en' ? 'Daughter' : 'पुत्री'}</option>
                          <option value="Father">{language === 'en' ? 'Father' : 'पिता'}</option>
                          <option value="Mother">{language === 'en' ? 'Mother' : 'माता'}</option>
                          <option value="Brother">{language === 'en' ? 'Brother' : 'भाई'}</option>
                          <option value="Sister">{language === 'en' ? 'Sister' : 'बहन'}</option>
                          <option value="Grandfather">{language === 'en' ? 'Grandfather' : 'दादा/नाना'}</option>
                          <option value="Grandmother">{language === 'en' ? 'Grandmother' : 'दादी/नानी'}</option>
                          <option value="Other">{language === 'en' ? 'Other' : 'अन्य'}</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{language === 'en' ? 'Gender' : 'लिंग'}</label>
                        <select
                          value={newFamilyMember.gender}
                          onChange={e => setNewFamilyMember({ ...newFamilyMember, gender: e.target.value })}
                        >
                          <option value="">{language === 'en' ? 'Select Gender' : 'लिंग चुनें'}</option>
                          <option value="male">{language === 'en' ? 'Male' : 'पुरुष'}</option>
                          <option value="female">{language === 'en' ? 'Female' : 'महिला'}</option>
                          <option value="other">{language === 'en' ? 'Other' : 'अन्य'}</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>{language === 'en' ? 'Date of Birth' : 'जन्म तिथि'}</label>
                        <div className="dob-dropdowns">
                          <select value={fmDobYear} onChange={e => handleFmDobChange('year', e.target.value)}>
                            <option value="">{language === 'en' ? 'Year' : 'वर्ष'}</option>
                            {Array.from({ length: new Date().getFullYear() - 1909 }, (_, i) => new Date().getFullYear() - i)
                              .map(y => <option key={y} value={String(y)}>{y}</option>)}
                          </select>
                          <select value={fmDobMonth} onChange={e => handleFmDobChange('month', e.target.value)}>
                            <option value="">{language === 'en' ? 'Month' : 'माह'}</option>
                            {months.map(m => <option key={m.value} value={m.value}>{language === 'en' ? m.en : m.hi}</option>)}
                          </select>
                          <select value={fmDobDay} onChange={e => handleFmDobChange('day', e.target.value)}>
                            <option value="">{language === 'en' ? 'Day' : 'दिन'}</option>
                            {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{language === 'en' ? 'Occupation' : 'व्यवसाय'}</label>
                        <input
                          type="text"
                          value={newFamilyMember.occupation}
                          onChange={e => setNewFamilyMember({ ...newFamilyMember, occupation: e.target.value })}
                          placeholder={language === 'en' ? 'Occupation (optional)' : 'व्यवसाय (वैकल्पिक)'}
                        />
                      </div>
                      <div className="form-group">
                        <label>{language === 'en' ? 'Phone' : 'फोन'}</label>
                        <input
                          type="tel"
                          value={newFamilyMember.phone}
                          onChange={e => setNewFamilyMember({ ...newFamilyMember, phone: e.target.value })}
                          placeholder={language === 'en' ? 'Phone (optional)' : 'फोन (वैकल्पिक)'}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group fm-photo-group">
                        <label>{language === 'en' ? 'Photo (optional)' : 'फोटो (वैकल्पिक)'}</label>
                        {fmPhotoPreview && (
                          <div className="fm-photo-preview-wrap">
                            <img src={fmPhotoPreview} alt="preview" className="fm-photo-preview" />
                          </div>
                        )}
                        <label htmlFor="fmPhotoInputProfile" className="file-upload-label fm-photo-upload-btn">
                          📁 {language === 'en' ? 'Choose Photo' : 'फोटो चुनें'}
                        </label>
                        <input
                          type="file"
                          id="fmPhotoInputProfile"
                          accept="image/jpeg,image/png,image/jpg"
                          className="file-input hidden-input"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) { setFmPhotoFile(file); setFmPhotoPreview(URL.createObjectURL(file)); }
                          }}
                        />
                      </div>
                    </div>
                    <div className="family-form-actions">
                      <button
                        type="button"
                        className="save-btn"
                        onClick={handleAddFamilyMember}
                        disabled={familyLoading}
                      >
                        {familyLoading ? (language === 'en' ? 'Adding...' : 'जोड़ रहे हैं...') : (language === 'en' ? 'Add Member' : 'सदस्य जोड़ें')}
                      </button>
                      <button type="button" className="cancel-btn" onClick={() => { setShowFamilyForm(false); setNewFamilyMember({ name: '', relation: '', gender: '', dateOfBirth: '', occupation: '', phone: '' }); setFmDobDay(''); setFmDobMonth(''); setFmDobYear(''); setFmPhotoFile(null); setFmPhotoPreview(''); const inp = document.getElementById('fmPhotoInputProfile'); if(inp) inp.value=''; }}>
                        {language === 'en' ? 'Cancel' : 'रद्द करें'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Family members list */}
                {familyMembers.length === 0 ? (
                  <p className="no-family-text">
                    {language === 'en' ? 'No family members added yet. Click "+ Add Member" to add.' : 'अभी तक कोई पारिवारिक सदस्य नहीं जोड़ा गया। "+ सदस्य जोड़ें" पर क्लिक करें।'}
                  </p>
                ) : (
                  <div className="family-members-grid">
                    {familyMembers.map((member) => (
                      editingMemberId === member._id ? (
                        /* ---- Inline Edit Form ---- */
                        <div key={member._id} className="family-member-edit-form">
                          <h4 className="fm-edit-title">✏️ {language === 'en' ? 'Edit Member' : 'सदस्य संपादित करें'}</h4>
                          <div className="form-row">
                            <div className="form-group">
                              <label>{language === 'en' ? 'Name *' : 'नाम *'}</label>
                              <input
                                type="text"
                                value={editFamilyMember.name}
                                onChange={e => setEditFamilyMember({ ...editFamilyMember, name: e.target.value })}
                                placeholder={language === 'en' ? 'Full name' : 'पूरा नाम'}
                              />
                            </div>
                            <div className="form-group">
                              <label>{language === 'en' ? 'Relation *' : 'संबंध *'}</label>
                              <select
                                value={editFamilyMember.relation}
                                onChange={e => setEditFamilyMember({ ...editFamilyMember, relation: e.target.value })}
                              >
                                <option value="">{language === 'en' ? 'Select Relation' : 'संबंध चुनें'}</option>
                                <option value="Spouse">{language === 'en' ? 'Spouse (Wife/Husband)' : 'पत्नी/पति'}</option>
                                <option value="Son">{language === 'en' ? 'Son' : 'पुत्र'}</option>
                                <option value="Daughter">{language === 'en' ? 'Daughter' : 'पुत्री'}</option>
                                <option value="Father">{language === 'en' ? 'Father' : 'पिता'}</option>
                                <option value="Mother">{language === 'en' ? 'Mother' : 'माता'}</option>
                                <option value="Brother">{language === 'en' ? 'Brother' : 'भाई'}</option>
                                <option value="Sister">{language === 'en' ? 'Sister' : 'बहन'}</option>
                                <option value="Grandfather">{language === 'en' ? 'Grandfather' : 'दादा/नाना'}</option>
                                <option value="Grandmother">{language === 'en' ? 'Grandmother' : 'दादी/नानी'}</option>
                                <option value="Other">{language === 'en' ? 'Other' : 'अन्य'}</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label>{language === 'en' ? 'Gender' : 'लिंग'}</label>
                              <select
                                value={editFamilyMember.gender}
                                onChange={e => setEditFamilyMember({ ...editFamilyMember, gender: e.target.value })}
                              >
                                <option value="">{language === 'en' ? 'Select Gender' : 'लिंग चुनें'}</option>
                                <option value="male">{language === 'en' ? 'Male' : 'पुरुष'}</option>
                                <option value="female">{language === 'en' ? 'Female' : 'महिला'}</option>
                                <option value="other">{language === 'en' ? 'Other' : 'अन्य'}</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>{language === 'en' ? 'Date of Birth' : 'जन्म तिथि'}</label>
                              <div className="dob-dropdowns">
                                <select value={editFmDobYear} onChange={e => handleEditFmDobChange('year', e.target.value)}>
                                  <option value="">{language === 'en' ? 'Year' : 'वर्ष'}</option>
                                  {Array.from({ length: new Date().getFullYear() - 1909 }, (_, i) => new Date().getFullYear() - i)
                                    .map(y => <option key={y} value={String(y)}>{y}</option>)}
                                </select>
                                <select value={editFmDobMonth} onChange={e => handleEditFmDobChange('month', e.target.value)}>
                                  <option value="">{language === 'en' ? 'Month' : 'माह'}</option>
                                  {months.map(m => <option key={m.value} value={m.value}>{language === 'en' ? m.en : m.hi}</option>)}
                                </select>
                                <select value={editFmDobDay} onChange={e => handleEditFmDobChange('day', e.target.value)}>
                                  <option value="">{language === 'en' ? 'Day' : 'दिन'}</option>
                                  {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group">
                              <label>{language === 'en' ? 'Occupation' : 'व्यवसाय'}</label>
                              <input
                                type="text"
                                value={editFamilyMember.occupation}
                                onChange={e => setEditFamilyMember({ ...editFamilyMember, occupation: e.target.value })}
                                placeholder={language === 'en' ? 'Occupation (optional)' : 'व्यवसाय (वैकल्पिक)'}
                              />
                            </div>
                            <div className="form-group">
                              <label>{language === 'en' ? 'Phone' : 'फोन'}</label>
                              <input
                                type="tel"
                                value={editFamilyMember.phone}
                                onChange={e => setEditFamilyMember({ ...editFamilyMember, phone: e.target.value })}
                                placeholder={language === 'en' ? 'Phone (optional)' : 'फोन (वैकल्पिक)'}
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="form-group fm-photo-group">
                              <label>{language === 'en' ? 'Photo' : 'फोटो'}</label>
                              {editFmPhotoPreview && (
                                <div className="fm-photo-preview-wrap">
                                  <img src={editFmPhotoPreview} alt="preview" className="fm-photo-preview" />
                                </div>
                              )}
                              <label htmlFor="editFmPhotoInput" className="file-upload-label fm-photo-upload-btn">
                                📁 {language === 'en' ? 'Change Photo' : 'फोटो बदलें'}
                              </label>
                              <input
                                type="file"
                                id="editFmPhotoInput"
                                accept="image/jpeg,image/png,image/jpg"
                                className="file-input hidden-input"
                                onChange={e => {
                                  const file = e.target.files[0];
                                  if (file) { setEditFmPhotoFile(file); setEditFmPhotoPreview(URL.createObjectURL(file)); }
                                }}
                              />
                            </div>
                          </div>
                          <div className="family-form-actions">
                            <button type="button" className="save-btn" onClick={handleSaveEditMember} disabled={familyLoading}>
                              {familyLoading ? (language === 'en' ? 'Saving...' : 'सहेज रहे हैं...') : (language === 'en' ? 'Save Changes' : 'बदलाव सहेजें')}
                            </button>
                            <button type="button" className="cancel-btn" onClick={() => { setEditingMemberId(null); setEditFmPhotoFile(null); setEditFmPhotoPreview(''); }}>
                              {language === 'en' ? 'Cancel' : 'रद्द करें'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ---- Member Card ---- */
                        <div key={member._id} className="family-member-card">
                          <div className="fm-card-icon">
                            {member.photoPath
                              ? <img src={member.photoPath} alt={member.name} className="fm-card-photo" />
                              : '👤'}
                          </div>
                          <div className="fm-card-info">
                            <div className="fm-card-name">{member.name}</div>
                            <div className="fm-card-relation">{member.relation}</div>
                            {member.gender && <div className="fm-card-detail">{member.gender === 'male' ? (language === 'en' ? 'Male' : 'पुरुष') : member.gender === 'female' ? (language === 'en' ? 'Female' : 'महिला') : (language === 'en' ? 'Other' : 'अन्य')}</div>}
                            {member.dateOfBirth && <div className="fm-card-detail">{new Date(member.dateOfBirth).toLocaleDateString('en-IN')}</div>}
                            {member.occupation && <div className="fm-card-detail">{member.occupation}</div>}
                            {member.phone && <div className="fm-card-detail">📞 {member.phone}</div>}
                            <div className="fm-card-source">
                              {member.addedFrom === 'registration'
                                ? (language === 'en' ? 'Added at registration' : 'पंजीकरण के समय जोड़ा गया')
                                : (language === 'en' ? `Added on ${new Date(member.addedAt).toLocaleDateString('en-IN')}` : `${new Date(member.addedAt).toLocaleDateString('en-IN')} को जोड़ा गया`)}
                            </div>
                          </div>
                          <div className="fm-card-actions">
                            <button
                              className="fm-edit-btn"
                              onClick={() => handleStartEditMember(member)}
                              disabled={familyLoading}
                              title={language === 'en' ? 'Edit' : 'संपादित करें'}
                            >✏️</button>
                            <button
                              className="fm-remove-btn"
                              onClick={() => handleRemoveFamilyMember(member._id)}
                              disabled={familyLoading}
                              title={language === 'en' ? 'Remove' : 'हटाएं'}
                            >🗑️</button>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== NON-MEMBER RECORDS SECTION ===== */}
          {/* ===== NON-MEMBERS SECTION LINK ===== */}
          <div className="profile-card nm-section">
            <div className="profile-card-header">
              <h3><span className="card-icon">👥</span>
                {language === 'en' ? 'Non-Members' : 'अन्य-सदस्य'}
              </h3>
            </div>
            <div className="profile-card-body">
              <div className="nm-ref-card">
                <div className="nm-ref-card-icon">👥</div>
                <div className="nm-ref-card-text">
                  <p className="nm-ref-card-title">
                    {language === 'en' ? 'Non-Members Directory' : 'अन्य-सदस्य डायरेक्टरी'}
                  </p>
                  <p className="nm-ref-card-desc">
                    {language === 'en'
                      ? 'View and add records of community members who are not yet formally registered. Open to everyone — no login required!'
                      : 'उन समाज के सदस्यों के रिकॉर्ड देखें और जोड़ें जो अभी तक पंजीकृत नहीं हैं। '}
                  </p>
                </div>
                <Link to="/non-members" className="nm-ref-go-btn" onClick={() => window.scrollTo(0, 0)}>
                  {language === 'en' ? 'Go to Non-Members →' : 'अन्य-सदस्य पेज जाएं →'}
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Profile;
