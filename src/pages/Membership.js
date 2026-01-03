import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import './Membership.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Membership = () => {
  const { language } = useLanguage();
  const t = (path) => getTranslation(language, path);

  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    occupation: '',
    education: '',
    idProof: null,
    addressProof: null,
    photo: null,
    donationDocument: null
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Scroll to registration form if hash is present
  useEffect(() => {
    if (window.location.hash === '#registration-form') {
      setTimeout(() => {
        const element = document.getElementById('registration-form');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    
    // Photo field accepts images
    if (fieldName === 'photo') {
      if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
        setFormData({
          ...formData,
          [fieldName]: file
        });
      } else if (file) {
        alert(language === 'en' ? 'Please upload a JPG/PNG image file only' : 'कृपया केवल JPG/PNG छवि फ़ाइल अपलोड करें');
        e.target.value = '';
      }
    } 
    // Other fields accept PDFs
    else {
      if (file && file.type === 'application/pdf') {
        setFormData({
          ...formData,
          [fieldName]: file
        });
      } else if (file) {
        alert(language === 'en' ? 'Please upload a PDF file only' : 'कृपया केवल पीडीएफ फाइल अपलोड करें');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        text: language === 'en' ? 'Passwords do not match!' : 'पासवर्ड मेल नहीं खाते!'
      });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('fullName', formData.fullName);
      submitData.append('fatherName', formData.fatherName);
      submitData.append('dateOfBirth', formData.dateOfBirth);
      submitData.append('gender', formData.gender);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('password', formData.password);
      submitData.append('address', formData.address);
      submitData.append('city', formData.city);
      submitData.append('state', formData.state);
      submitData.append('pincode', formData.pincode);
      submitData.append('occupation', formData.occupation);
      submitData.append('education', formData.education);
      
      if (formData.idProof) {
        submitData.append('idProof', formData.idProof);
      }
      if (formData.addressProof) {
        submitData.append('addressProof', formData.addressProof);
      }
      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }
      if (formData.donationDocument) {
        submitData.append('donationDocument', formData.donationDocument);
      }

      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: language === 'en' 
            ? 'Registration successful! Your application is pending approval. You will be notified once approved.' 
            : 'पंजीकरण सफल! आपका आवेदन अनुमोदन के लिए लंबित है। अनुमोदित होने पर आपको सूचित किया जाएगा।'
        });
        setShowModal(true);
        setFormData({
          fullName: '', fatherName: '', dateOfBirth: '', gender: '', email: '',
          phone: '', password: '', confirmPassword: '', address: '', city: '', state: '', pincode: '', occupation: '', education: '',
          idProof: null, addressProof: null, photo: null, donationDocument: null
        });
        // Reset file inputs
        document.getElementById('idProof').value = '';
        document.getElementById('addressProof').value = '';
        document.getElementById('photo').value = '';
        const donationInput = document.getElementById('donationDocument');
        if (donationInput) donationInput.value = '';
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMessage({
          type: 'error',
          text: data.message || (language === 'en' ? 'Registration failed. Please try again.' : 'पंजीकरण विफल। कृपया पुन: प्रयास करें।')
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: language === 'en' 
          ? 'Connection error. Please check if the server is running.' 
          : 'कनेक्शन त्रुटि। कृपया जांचें कि सर्वर चल रहा है।'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="membership-page">
      {/* Success Modal Popup */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">✅</div>
            <h2>{language === 'en' ? 'Registration Successful!' : 'पंजीकरण सफल!'}</h2>
            <p>{message.text}</p>
            <button className="modal-btn" onClick={() => setShowModal(false)}>
              {language === 'en' ? 'OK' : 'ठीक है'}
            </button>
          </div>
        </div>
      )}

      <section className="page-header">
        <div className="container">
          <h1>{t('membership.title')}</h1>
          <p>{t('membership.subtitle')}</p>
        </div>
      </section>

      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('membership.benefits')}</h2>
            <div className="underline"></div>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>{language === 'en' ? 'Community Network' : 'सामुदायिक नेटवर्क'}</h3>
              <p>{language === 'en' ? 'Connect with thousands of community members across India' : 'पूरे भारत में समुदाय के हजारों सदस्यों से जुड़ें'}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎉</div>
              <h3>{language === 'en' ? 'Exclusive Events' : 'एक्सक्लूसिव इवेंट्स'}</h3>
              <p>{language === 'en' ? 'Access to community gatherings, cultural programs, and celebrations' : 'सामुदायिक समारोह, सांस्कृतिक कार्यक्रमों और समारोहों तक पहुंच'}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎓</div>
              <h3>{language === 'en' ? 'Educational Support' : 'शैक्षणिक सहायता'}</h3>
              <p>{language === 'en' ? 'Scholarships and educational guidance for students' : 'छात्रों के लिए छात्रवृत्ति और शैक्षणिक मार्गदर्शन'}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💼</div>
              <h3>{language === 'en' ? 'Career Opportunities' : 'कैरियर की संभावनाएं'}</h3>
              <p>{language === 'en' ? 'Job referrals and business networking opportunities' : 'नौकरी के रेफरल और व्यावसायिक नेटवर्किंग के अवसर'}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🏥</div>
              <h3>{language === 'en' ? 'Welfare Programs' : 'कल्याण कार्यक्रम'}</h3>
              <p>{language === 'en' ? 'Access to community welfare and support programs' : 'सामुदायिक कल्याण और सहायता कार्यक्रमों तक पहुंच'}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📜</div>
              <h3>{language === 'en' ? 'Member ID Card' : 'सदस्य आईडी कार्ड'}</h3>
              <p>{language === 'en' ? 'Official membership certificate and digital ID card' : 'आधिकारिक सदस्यता प्रमाणपत्र और डिजिटल आईडी कार्ड'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="registration-section" id="registration-form">
        <div className="container">
          <div className="form-container">
            <h2>{t('membership.registrationForm')}</h2>
            <p className="form-description">{t('membership.formDescription')}</p>
            
            {message.text && (
              <div className={`form-message ${message.type}`}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">{t('membership.fullName')}</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fatherName">{t('membership.fatherName')}</label>
                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? "Enter father's name" : "अपने पिता का नाम दर्ज करें"}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">{t('membership.dateOfBirth')}</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">{t('membership.gender')}</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{language === 'en' ? 'Select Gender' : 'लिंग चुनें'}</option>
                    <option value="male">{language === 'en' ? 'Male' : 'पुरुष'}</option>
                    <option value="female">{language === 'en' ? 'Female' : 'महिला'}</option>
                    <option value="other">{language === 'en' ? 'Other' : 'अन्य'}</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">{t('membership.email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter email address' : 'ईमेल पता दर्ज करें'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t('membership.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter phone number' : 'फोन नंबर दर्ज करें'}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">{language === 'en' ? 'Password *' : 'पासवर्ड *'}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      placeholder={language === 'en' ? 'Create a password (min 6 characters)' : 'पासवर्ड बनाएं (न्यूनतम 6 अक्षर)'}
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">{language === 'en' ? 'Confirm Password *' : 'पासवर्ड की पुष्टि करें *'}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength="6"
                      placeholder={language === 'en' ? 'Re-enter password' : 'पासवर्ड फिर से दर्ज करें'}
                      className={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'password-mismatch' : ''}
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <small className="password-error">
                      {language === 'en' ? '❌ Passwords do not match' : '❌ पासवर्ड मेल नहीं खाते'}
                    </small>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <small className="password-match">
                      {language === 'en' ? '✅ Passwords match' : '✅ पासवर्ड मेल खाते हैं'}
                    </small>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">{t('membership.address')}</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder={language === 'en' ? 'Enter complete address' : 'पूरा पता दर्ज करें'}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">{t('membership.city')}</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter city' : 'शहर दर्ज करें'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">{t('membership.state')}</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter state' : 'राज्य दर्ज करें'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pincode">{t('membership.pincode')}</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter pincode' : 'पिन कोड दर्ज करें'}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="occupation">{t('membership.occupation')}</label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter occupation' : 'व्यवसाय दर्ज करें'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="education">{t('membership.education')}</label>
                  <input
                    type="text"
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter education qualification' : 'शैक्षणिक योग्यता दर्ज करें'}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="idProof">
                    {language === 'en' ? 'ID Valid Proof (PDF) *' : 'पहचान प्रमाण (पीडीएफ) *'}
                  </label>
                  <input
                    type="file"
                    id="idProof"
                    name="idProof"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required
                    className="file-input"
                  />
                  <small className="file-hint">
                    {language === 'en' ? 'Upload ID proof in PDF (Aadhar, PAN, Voter ID, etc.)' : 'पीडीएफ में पहचान प्रमाण अपलोड करें (आधार, पैन, वोटर आईडी, आदि)'}
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="addressProof">
                    {language === 'en' ? 'Address Proof (PDF) *' : 'पते का प्रमाण (पीडीएफ) *'}
                  </label>
                  <input
                    type="file"
                    id="addressProof"
                    name="addressProof"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required
                    className="file-input"
                  />
                  <small className="file-hint">
                    {language === 'en' ? 'Upload address proof in PDF (Utility bill, Bank statement, etc.)' : 'पीडीएफ में पते का प्रमाण अपलोड करें (बिजली बिल, बैंक स्टेटमेंट, आदि)'}
                  </small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="photo">
                    {language === 'en' ? 'Photo (JPG/PNG) *' : 'फोटो (JPG/PNG) *'}
                  </label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange}
                    required
                    className="file-input"
                  />
                  <small className="file-hint">
                    {language === 'en' ? 'Upload a recent passport-size photo' : 'एक हालिया पासपोर्ट आकार की फोटो अपलोड करें'}
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="donationDocument">
                    {language === 'en' ? 'Donation Towards Community (PDF)' : 'समुदाय के लिए दान (पीडीएफ)'}
                  </label>
                  <input
                    type="file"
                    id="donationDocument"
                    name="donationDocument"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <small className="file-hint">
                    {language === 'en' ? 'Optional: Upload donation receipt or document in PDF format' : 'वैकल्पिक: पीडीएफ प्रारूप में दान रसीद या दस्तावेज अपलोड करें'}
                  </small>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading 
                    ? (language === 'en' ? 'Submitting...' : 'जमा हो रहा है...')
                    : t('membership.submitBtn')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
