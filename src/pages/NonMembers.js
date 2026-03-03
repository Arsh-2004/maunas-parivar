import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './NonMembers.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const emptyForm = {
  fullName: '', place: '', age: '',
  relationship: '', fatherName: '', gender: '',
  email: '', phone: '', address: '', village: '',
  block: '', tehsil: '', district: '', state: '',
  pincode: '', occupation: '', education: '', photo: null
};

const NonMembers = () => {
  const { language } = useLanguage();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [showOptional, setShowOptional] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [viewRecord, setViewRecord] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Fetch all non-member records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch(`${API_URL}/users/non-members`);
        const data = await res.json();
        if (data.success) setRecords(data.records);
      } catch (e) {
        console.error('Failed to load non-member records', e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setFormData({ ...formData, photo: file });
    } else if (file) {
      alert(language === 'en' ? 'Please upload JPG/PNG only' : 'कृपया केवल JPG/PNG अपलोड करें');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setMessage({ type: 'error', text: language === 'en' ? '❌ Full name is required.' : '❌ पूरा नाम आवश्यक है।' });
      return;
    }
    if (!formData.place.trim()) {
      setMessage({ type: 'error', text: language === 'en' ? '❌ Place is required.' : '❌ स्थान आवश्यक है।' });
      return;
    }
    if (!formData.age || isNaN(formData.age) || formData.age <= 0) {
      setMessage({ type: 'error', text: language === 'en' ? '❌ Age is required.' : '❌ आयु आवश्यक है।' });
      return;
    }
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k !== 'photo' && v) fd.append(k, v);
      });
      if (formData.photo) fd.append('photo', formData.photo);

      const res = await fetch(`${API_URL}/users/add-non-member`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setRecords(prev => [data.record, ...prev]);
        setFormData(emptyForm);
        setShowOptional(true);
        setShowModal(false);
        if (document.getElementById('nmPhotoInput')) document.getElementById('nmPhotoInput').value = '';
      } else {
        setMessage({ type: 'error', text: data.message || (language === 'en' ? '❌ Failed to add record.' : '❌ रिकॉर्ड जोड़ने में विफल।') });
      }
    } catch {
      setMessage({ type: 'error', text: language === 'en' ? '❌ Connection error.' : '❌ कनेक्शन त्रुटि।' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter(r =>
    r.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
    r.place?.toLowerCase().includes(searchText.toLowerCase()) ||
    r.relationship?.toLowerCase().includes(searchText.toLowerCase()) ||
    r.district?.toLowerCase().includes(searchText.toLowerCase()) ||
    r.state?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="nm-page">

      {/* ---- HERO ---- */}
      <section className="nm-hero">
        <div className="nm-hero-overlay">
          <div className="container">
            <h1 className="nm-hero-title">
              {language === 'en' ? 'Non-Members' : 'गैर-सदस्य'}
            </h1>
            <p className="nm-hero-sub">
              {language === 'en'
                ? 'Community members who are part of our family but not yet formally registered — their records are maintained here.'
                : 'परिवार के वे सदस्य जो हमारे समाज का हिस्सा हैं लेकिन अभी तक औपचारिक रूप से पंजीकृत नहीं हैं — उनके विवरण यहाँ संरक्षित हैं।'}
            </p>
            <button className="nm-hero-btn" onClick={() => { setMessage({ type: '', text: '' }); setShowModal(true); }}>
              + {language === 'en' ? 'Add Record' : 'रिकॉर्ड जोड़ें'}
            </button>
          </div>
        </div>
      </section>

      {/* ---- MAIN CONTENT ---- */}
      <div className="container nm-container">

        {/* Stats bar */}
        <div className="nm-stats-bar">
          <div className="nm-stat">
            <span className="nm-stat-num">{records.length}</span>
            <span className="nm-stat-label">{language === 'en' ? 'Total Records' : 'कुल रिकॉर्ड'}</span>
          </div>
          <div className="nm-stat">
            <span className="nm-stat-num">{new Set(records.map(r => r.place)).size}</span>
            <span className="nm-stat-label">{language === 'en' ? 'Places' : 'स्थान'}</span>
          </div>
          <div className="nm-stat">
            <span className="nm-stat-num">{new Set(records.map(r => r.state).filter(Boolean)).size}</span>
            <span className="nm-stat-label">{language === 'en' ? 'States' : 'राज्य'}</span>
          </div>
        </div>

        {/* Search */}
        <div className="nm-search-row">
          <input
            className="nm-search-input"
            type="text"
            placeholder={language === 'en' ? '🔍  Search by name, place, relationship, state…' : '🔍  नाम, स्थान, संबंध, राज्य से खोजें…'}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <button className="nm-add-btn-top" onClick={() => { setMessage({ type: '', text: '' }); setShowModal(true); }}>
            + {language === 'en' ? 'Add Record' : 'रिकॉर्ड जोड़ें'}
          </button>
        </div>

        {/* Records Grid */}
        {loading ? (
          <div className="nm-loading">
            {language === 'en' ? 'Loading records…' : 'रिकॉर्ड लोड हो रहे हैं…'}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="nm-empty-state">
            <div className="nm-empty-icon">👥</div>
            <p>{searchText
              ? (language === 'en' ? 'No records match your search.' : 'खोज से कोई रिकॉर्ड नहीं मिला।')
              : (language === 'en' ? 'No records yet. Be the first to add one!' : 'अभी कोई रिकॉर्ड नहीं है। पहले आप जोड़ें!')
            }</p>
          </div>
        ) : (
          <div className="nm-grid">
            {filteredRecords.map(r => (
              <div className="nm-card" key={r._id} onClick={() => setViewRecord(r)}>
                <div className="nm-card-photo">
                  {r.photoPath
                    ? <img src={r.photoPath} alt={r.fullName} />
                    : <div className="nm-card-no-photo">👤</div>}
                </div>
                <div className="nm-card-body">
                  <p className="nm-card-name">{r.fullName}</p>
                  {r.relationship && <span className="nm-relation-tag">{r.relationship}</span>}
                  <p className="nm-card-detail">📍 {r.place}{r.district ? `, ${r.district}` : ''}</p>
                  <p className="nm-card-detail">🎂 {language === 'en' ? `Age: ${r.age}` : `आयु: ${r.age}`}</p>
                  {r.occupation && <p className="nm-card-detail">💼 {r.occupation}</p>}
                  {r.state && <p className="nm-card-detail">🗺️ {r.state}</p>}
                </div>
                <div className="nm-card-footer">
                  <button className="nm-view-btn" onClick={e => { e.stopPropagation(); setViewRecord(r); }}>
                    {language === 'en' ? 'View Details' : 'विवरण देखें'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== ADD RECORD MODAL ===== */}
      {showModal && (
        <div className="nm-overlay" onClick={() => setShowModal(false)}>
          <div className="nm-modal" onClick={e => e.stopPropagation()}>
            <div className="nm-modal-header">
              <h3>👥 {language === 'en' ? 'Add Non-Member Record' : 'गैर-सदस्य रिकॉर्ड जोड़ें'}</h3>
              <button className="nm-modal-close" onClick={() => { setShowModal(false); setFormData(emptyForm); setShowOptional(false); setMessage({ type: '', text: '' }); }}>✕</button>
            </div>
            <div className="nm-modal-body">
              {message.text && (
                <div className={`nm-message ${message.type}`}>{message.text}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="nm-required-note">
                  {language === 'en' ? '★ Fields marked with * are mandatory' : '★ * से चिह्नित फ़ील्ड अनिवार्य हैं'}
                </div>

                <div className="nm-section-title">{language === 'en' ? '📋 Basic Details' : '📋 बुनियादी विवरण'}</div>
                <div className="nm-form-row">
                  <div className="nm-form-group">
                    <label>{language === 'en' ? 'Full Name *' : 'पूरा नाम *'}</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                      placeholder={language === 'en' ? 'Enter full name' : 'पूरा नाम दर्ज करें'} />
                  </div>
                  <div className="nm-form-group">
                    <label>{language === 'en' ? 'Place (City/Village) *' : 'स्थान (शहर/गाँव) *'}</label>
                    <input type="text" name="place" value={formData.place} onChange={handleChange}
                      placeholder={language === 'en' ? 'City or village' : 'शहर या गाँव'} />
                  </div>
                </div>
                <div className="nm-form-row">
                  <div className="nm-form-group">
                    <label>{language === 'en' ? 'Age *' : 'आयु *'}</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange}
                      min="1" max="120" placeholder={language === 'en' ? 'Enter age' : 'आयु दर्ज करें'} />
                  </div>
                  <div className="nm-form-group">
                    <label>{language === 'en' ? 'Relationship (optional)' : 'संबंध (वैकल्पिक)'}</label>
                    <input type="text" name="relationship" value={formData.relationship} onChange={handleChange}
                      placeholder={language === 'en' ? 'e.g. Brother, Uncle' : 'जैसे भाई, चाचा'} />
                  </div>
                </div>

                <button type="button" className="nm-optional-toggle" onClick={() => setShowOptional(v => !v)}>
                  {showOptional
                    ? (language === 'en' ? '▲ Hide Optional Details' : '▲ वैकल्पिक विवरण छुपाएं')
                    : (language === 'en' ? '▼ Add More Details (Optional)' : '▼ और विवरण जोड़ें (वैकल्पिक)')}
                </button>

                {showOptional && (
                  <>
                    <div className="nm-section-title">{language === 'en' ? '👤 Personal (Optional)' : '👤 व्यक्तिगत (वैकल्पिक)'}</div>
                    <div className="nm-form-row">
                      <div className="nm-form-group">
                        <label>{language === 'en' ? "Father's Name" : 'पिता का नाम'}</label>
                        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                      </div>
                      <div className="nm-form-group">
                        <label>{language === 'en' ? 'Gender' : 'लिंग'}</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                          <option value="">{language === 'en' ? '-- Select --' : '-- चुनें --'}</option>
                          <option value="male">{language === 'en' ? 'Male' : 'पुरुष'}</option>
                          <option value="female">{language === 'en' ? 'Female' : 'महिला'}</option>
                          <option value="other">{language === 'en' ? 'Other' : 'अन्य'}</option>
                        </select>
                      </div>
                    </div>
                    <div className="nm-form-row">
                      <div className="nm-form-group">
                        <label>{language === 'en' ? 'Email' : 'ईमेल'}</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                      </div>
                      <div className="nm-form-group">
                        <label>{language === 'en' ? 'Phone' : 'फोन'}</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="nm-form-row">
                      <div className="nm-form-group">
                        <label>{language === 'en' ? 'Occupation' : 'व्यवसाय'}</label>
                        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} />
                      </div>
                      <div className="nm-form-group">
                        <label>{language === 'en' ? 'Education' : 'शिक्षा'}</label>
                        <select name="education" value={formData.education} onChange={handleChange}>
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

                    <div className="nm-section-title">{language === 'en' ? '📍 Address (Optional)' : '📍 पता (वैकल्पिक)'}</div>
                    <div className="nm-form-group" style={{ marginBottom: '13px' }}>
                      <label>{language === 'en' ? 'Full Address' : 'पूरा पता'}</label>
                      <textarea name="address" value={formData.address} onChange={handleChange} rows="2" />
                    </div>
                    <div className="nm-form-row">
                      <div className="nm-form-group">
                        <label>{language === 'en' ? 'Village' : 'गाँव'}</label>
                        <input type="text" name="village" value={formData.village} onChange={handleChange} />
                      </div>
                      <div className="nm-form-group">
                        <label>{language === 'en' ? 'Block' : 'ब्लॉक'}</label>
                        <input type="text" name="block" value={formData.block} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="nm-form-row">
                      <div className="nm-form-group">
                        <label>{language === 'en' ? 'Tehsil' : 'तहसील'}</label>
                        <input type="text" name="tehsil" value={formData.tehsil} onChange={handleChange} />
                      </div>
                      <div className="nm-form-group">
                        <label>{language === 'en' ? 'District' : 'जिला'}</label>
                        <input type="text" name="district" value={formData.district} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="nm-form-row">
                      <div className="nm-form-group">
                        <label>{language === 'en' ? 'State' : 'राज्य'}</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} />
                      </div>
                      <div className="nm-form-group">
                        <label>{language === 'en' ? 'Pincode' : 'पिन कोड'}</label>
                        <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="nm-section-title">{language === 'en' ? '📷 Photo (Optional)' : '📷 फोटो (वैकल्पिक)'}</div>
                    <div className="nm-form-group">
                      <label>{language === 'en' ? 'Upload Photo (JPG/PNG)' : 'फोटो अपलोड करें (JPG/PNG)'}</label>
                      <input id="nmPhotoInput" type="file" accept="image/jpeg,image/png,image/jpg"
                        onChange={handleFileChange} className="nm-file-input" />
                    </div>
                  </>
                )}

                <div className="nm-form-actions">
                  <button type="submit" className="nm-save-btn" disabled={submitting}>
                    {submitting
                      ? (language === 'en' ? 'Saving…' : 'सहेज रहे हैं…')
                      : (language === 'en' ? 'Save Record' : 'रिकॉर्ड सहेजें')}
                  </button>
                  <button type="button" className="nm-cancel-btn"
                    onClick={() => { setShowModal(false); setFormData(emptyForm); setShowOptional(true); setMessage({ type: '', text: '' }); }}>
                    {language === 'en' ? 'Cancel' : 'रद्द करें'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== VIEW RECORD MODAL ===== */}
      {viewRecord && (
        <div className="nm-overlay" onClick={() => setViewRecord(null)}>
          <div className="nm-modal nm-view-modal" onClick={e => e.stopPropagation()}>
            <div className="nm-modal-header">
              <h3>👤 {viewRecord.fullName}</h3>
              <button className="nm-modal-close" onClick={() => setViewRecord(null)}>✕</button>
            </div>
            <div className="nm-modal-body">
              <div className="nm-view-photo-wrap">
                {viewRecord.photoPath
                  ? <img src={viewRecord.photoPath} alt={viewRecord.fullName} className="nm-view-photo" />
                  : <div className="nm-view-no-photo">👤</div>}
              </div>
              <div className="nm-view-grid">
                {[
                  ['fullName',  language === 'en' ? 'Full Name'     : 'पूरा नाम',      viewRecord.fullName],
                  ['place',     language === 'en' ? 'Place'         : 'स्थान',         viewRecord.place],
                  ['age',       language === 'en' ? 'Age'           : 'आयु',           viewRecord.age],
                  ['rel',       language === 'en' ? 'Relationship'  : 'संबंध',         viewRecord.relationship],
                  ['father',    language === 'en' ? "Father's Name" : 'पिता का नाम',   viewRecord.fatherName],
                  ['gender',    language === 'en' ? 'Gender'        : 'लिंग',          viewRecord.gender],
                  ['email',     language === 'en' ? 'Email'         : 'ईमेल',          viewRecord.email],
                  ['phone',     language === 'en' ? 'Phone'         : 'फोन',           viewRecord.phone],
                  ['occ',       language === 'en' ? 'Occupation'    : 'व्यवसाय',       viewRecord.occupation],
                  ['edu',       language === 'en' ? 'Education'     : 'शिक्षा',        viewRecord.education],
                  ['village',   language === 'en' ? 'Village'       : 'गाँव',          viewRecord.village],
                  ['block',     language === 'en' ? 'Block'         : 'ब्लॉक',         viewRecord.block],
                  ['tehsil',    language === 'en' ? 'Tehsil'        : 'तहसील',         viewRecord.tehsil],
                  ['district',  language === 'en' ? 'District'      : 'जिला',          viewRecord.district],
                  ['state',     language === 'en' ? 'State'         : 'राज्य',         viewRecord.state],
                  ['pincode',   language === 'en' ? 'Pincode'       : 'पिन कोड',       viewRecord.pincode],
                ].filter(([,, val]) => val).map(([key, label, val]) => (
                  <div className="nm-view-item" key={key}>
                    <div className="nm-view-label">{label}</div>
                    <div className="nm-view-value" style={{ textTransform: key === 'gender' ? 'capitalize' : 'none' }}>{val}</div>
                  </div>
                ))}
                {viewRecord.address && (
                  <div className="nm-view-item nm-full-width">
                    <div className="nm-view-label">{language === 'en' ? 'Address' : 'पता'}</div>
                    <div className="nm-view-value">{viewRecord.address}</div>
                  </div>
                )}
              </div>
              <div className="nm-view-date">
                {language === 'en' ? 'Added on: ' : 'जोड़ा गया: '}
                {new Date(viewRecord.addedAt).toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NonMembers;
