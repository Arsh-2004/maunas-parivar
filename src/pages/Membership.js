import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import { indianStates } from '../data/indianStates';
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
    village: '',
    block: '',
    tehsil: '',
    district: '',
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
  const [selectedState, setSelectedState] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [showOtherState, setShowOtherState] = useState(false);
  const [showOtherCity, setShowOtherCity] = useState(false);

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

  const handleStateChange = (e) => {
    const value = e.target.value;
    if (value === 'other') {
      setShowOtherState(true);
      setSelectedState('');
      setAvailableCities([]);
      setFormData({ ...formData, state: '', city: '' });
      setShowOtherCity(true);
    } else {
      setShowOtherState(false);
      setSelectedState(value);
      const stateData = indianStates.find(s => s.state === value);
      setAvailableCities(stateData ? stateData.cities : []);
      setFormData({ ...formData, state: value, city: '' });
      setShowOtherCity(false);
    }
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    if (value === 'other') {
      setShowOtherCity(true);
      setFormData({ ...formData, city: '' });
    } else {
      setShowOtherCity(false);
      setFormData({ ...formData, city: value });
    }
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
    // All other fields also accept images only
    else {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (file && allowedTypes.includes(file.type)) {
        setFormData({
          ...formData,
          [fieldName]: file
        });
      } else if (file) {
        alert(language === 'en' ? 'Please upload a JPG/PNG image file only' : 'कृपया केवल JPG/PNG छवि फ़ाइल अपलोड करें');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprehensive form validation
    
    // Name validation - only letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!formData.fullName.trim()) {
      alert(language === 'en' ? '❌ Please enter your full name' : '❌ कृपया अपना पूरा नाम दर्ज करें');
      document.getElementById('fullName').focus();
      return;
    }
    if (!nameRegex.test(formData.fullName)) {
      alert(language === 'en' ? '❌ Full name should contain only letters' : '❌ पूरे नाम में केवल अक्षर होने चाहिए');
      document.getElementById('fullName').focus();
      return;
    }
    
    // Father name validation
    if (!formData.fatherName.trim()) {
      alert(language === 'en' ? "❌ Please enter father's name" : '❌ कृपया पिता का नाम दर्ज करें');
      document.getElementById('fatherName').focus();
      return;
    }
    if (!nameRegex.test(formData.fatherName)) {
      alert(language === 'en' ? "❌ Father's name should contain only letters" : '❌ पिता के नाम में केवल अक्षर होने चाहिए');
      document.getElementById('fatherName').focus();
      return;
    }
    
    // Date of birth validation
    if (!formData.dateOfBirth) {
      alert(language === 'en' ? '❌ Please select your date of birth' : '❌ कृपया अपनी जन्म तिथि चुनें');
      document.getElementById('dateOfBirth').focus();
      return;
    }
    
    // Age validation - must be at least 18 years old
    const dob = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) ? age - 1 : age;
    
    if (actualAge < 18) {
      alert(language === 'en' ? '❌ You must be at least 18 years old to register' : '❌ पंजीकरण के लिए आपकी आयु कम से कम 18 वर्ष होनी चाहिए');
      document.getElementById('dateOfBirth').focus();
      return;
    }
    if (actualAge > 120) {
      alert(language === 'en' ? '❌ Please enter a valid date of birth' : '❌ कृपया वैध जन्म तिथि दर्ज करें');
      document.getElementById('dateOfBirth').focus();
      return;
    }
    
    // Gender validation
    if (!formData.gender) {
      alert(language === 'en' ? '❌ Please select your gender' : '❌ कृपया अपना लिंग चुनें');
      document.getElementById('gender').focus();
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      alert(language === 'en' ? '❌ Please enter your email address' : '❌ कृपया अपना ईमेल पता दर्ज करें');
      document.getElementById('email').focus();
      return;
    }
    if (!emailRegex.test(formData.email)) {
      alert(language === 'en' ? '❌ Please enter a valid email address' : '❌ कृपया वैध ईमेल पता दर्ज करें');
      document.getElementById('email').focus();
      return;
    }
    
    // Phone validation - Indian phone number (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      alert(language === 'en' ? '❌ Please enter your phone number' : '❌ कृपया अपना फोन नंबर दर्ज करें');
      document.getElementById('phone').focus();
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      alert(language === 'en' ? '❌ Please enter a valid 10-digit phone number' : '❌ कृपया वैध 10 अंकों का फोन नंबर दर्ज करें');
      document.getElementById('phone').focus();
      return;
    }
    
    // Password validation
    if (!formData.password) {
      alert(language === 'en' ? '❌ Please enter a password' : '❌ कृपया पासवर्ड दर्ज करें');
      document.getElementById('password').focus();
      return;
    }
    if (formData.password.length < 6) {
      alert(language === 'en' ? '❌ Password must be at least 6 characters long' : '❌ पासवर्ड कम से कम 6 अक्षरों का होना चाहिए');
      document.getElementById('password').focus();
      return;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      alert(language === 'en' ? '❌ Please confirm your password' : '❌ कृपया अपने पासवर्ड की पुष्टि करें');
      document.getElementById('confirmPassword').focus();
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert(language === 'en' ? '❌ Passwords do not match!' : '❌ पासवर्ड मेल नहीं खाते!');
      document.getElementById('confirmPassword').focus();
      return;
    }
    
    // Address validation
    if (!formData.address.trim()) {
      alert(language === 'en' ? '❌ Please enter your address' : '❌ कृपया अपना पता दर्ज करें');
      document.getElementById('address').focus();
      return;
    }
    if (formData.address.trim().length < 10) {
      alert(language === 'en' ? '❌ Please enter a complete address (minimum 10 characters)' : '❌ कृपया पूरा पता दर्ज करें (न्यूनतम 10 अक्षर)');
      document.getElementById('address').focus();
      return;
    }
    
    // State validation
    if (!formData.state.trim()) {
      alert(language === 'en' ? '❌ Please select or enter your state' : '❌ कृपया अपना राज्य चुनें या दर्ज करें');
      document.getElementById('state').focus();
      return;
    }
    
    // City validation
    if (!formData.city.trim()) {
      alert(language === 'en' ? '❌ Please select or enter your city' : '❌ कृपया अपना शहर चुनें या दर्ज करें');
      document.getElementById('city').focus();
      return;
    }
    
    // Pincode validation - 6 digits
    const pincodeRegex = /^\d{6}$/;
    if (!formData.pincode.trim()) {
      alert(language === 'en' ? '❌ Please enter your pincode' : '❌ कृपया अपना पिन कोड दर्ज करें');
      document.getElementById('pincode').focus();
      return;
    }
    if (!pincodeRegex.test(formData.pincode)) {
      alert(language === 'en' ? '❌ Please enter a valid 6-digit pincode' : '❌ कृपया वैध 6 अंकों का पिन कोड दर्ज करें');
      document.getElementById('pincode').focus();
      return;
    }
    
    // Education validation
    if (!formData.education) {
      alert(language === 'en' ? '❌ Please select your educational qualification' : '❌ कृपया अपनी शैक्षिक योग्यता चुनें');
      document.getElementById('education').focus();
      return;
    }

    // Occupation validation
    if (!formData.occupation.trim()) {
      alert(language === 'en' ? '❌ Please enter your occupation' : '❌ कृपया अपना व्यवसाय दर्ज करें');
      document.getElementById('occupation').focus();
      return;
    }
    if (formData.occupation.trim().length < 2) {
      alert(language === 'en' ? '❌ Please enter a valid occupation' : '❌ कृपया वैध व्यवसाय दर्ज करें');
      document.getElementById('occupation').focus();
      return;
    }
    
    // File validations
    if (!formData.idProof) {
      alert(language === 'en' ? '❌ Please upload your ID proof photo (JPG/PNG)' : '❌ कृपया अपना पहचान प्रमाण फोटो अपलोड करें (JPG/PNG)');
      document.getElementById('idProof').focus();
      return;
    }
    
    if (!formData.addressProof) {
      alert(language === 'en' ? '❌ Please upload your address proof photo (JPG/PNG)' : '❌ कृपया अपना पते का प्रमाण फोटो अपलोड करें (JPG/PNG)');
      document.getElementById('addressProof').focus();
      return;
    }
    
    if (!formData.photo) {
      alert(language === 'en' ? '❌ Please upload your photo (JPG/PNG)' : '❌ कृपया अपनी फोटो अपलोड करें (JPG/PNG)');
      document.getElementById('photo').focus();
      return;
    }
    
    // File size validations
    if (formData.idProof && formData.idProof.size > 5 * 1024 * 1024) {
      alert(language === 'en' ? '❌ ID proof file size should be less than 5MB' : '❌ पहचान प्रमाण फाइल का आकार 5MB से कम होना चाहिए');
      document.getElementById('idProof').focus();
      return;
    }
    
    if (formData.addressProof && formData.addressProof.size > 5 * 1024 * 1024) {
      alert(language === 'en' ? '❌ Address proof file size should be less than 5MB' : '❌ पते के प्रमाण फाइल का आकार 5MB से कम होना चाहिए');
      document.getElementById('addressProof').focus();
      return;
    }
    
    if (formData.photo && formData.photo.size > 2 * 1024 * 1024) {
      alert(language === 'en' ? '❌ Photo file size should be less than 2MB' : '❌ फोटो फाइल का आकार 2MB से कम होना चाहिए');
      document.getElementById('photo').focus();
      return;
    }
    
    if (formData.donationDocument && formData.donationDocument.size > 5 * 1024 * 1024) {
      alert(language === 'en' ? '❌ Donation document file size should be less than 5MB' : '❌ सहयोग दस्तावेज़ फाइल का आकार 5MB से कम होना चाहिए');
      document.getElementById('donationDocument').focus();
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
      submitData.append('village', formData.village);
      submitData.append('block', formData.block);
      submitData.append('tehsil', formData.tehsil);
      submitData.append('district', formData.district);
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
          fullName: '', fatherName: '', dateOfBirth: '', gender: '', email: '', education: '',
          phone: '', password: '', confirmPassword: '', address: '', village: '', block: '', tehsil: '', district: '', city: '', state: '', pincode: '', occupation: '',
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
            <h2>{language === 'en' ? 'Membership Benefits' : 'सदस्यता लाभ'}</h2>
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
              <p>{language === 'en' ? 'Access to community gatherings, cultural programs and celebrations' : 'सामुदायिक समारोह, सांस्कृतिक कार्यक्रमों और समारोहों तक पहुँच'}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎓</div>
              <h3>{language === 'en' ? 'Educational Support' : 'शैक्षणिक सहायता'}</h3>
              <p>{language === 'en' ? 'Scholarships and educational guidance for students' : 'छात्रों के लिए छात्रवृत्ति और शैक्षणिक मार्गदर्शन'}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💼</div>
              <h3>{language === 'en' ? 'Career Opportunities' : 'कैरियर की संभावनाएं'}</h3>
              <p>{language === 'en' ? 'Job referrals and professional networking opportunities' : 'नौकरी के रेफ़रल और व्यावसायिक नेटवर्किंग के अवसर'}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🏥</div>
              <h3>{language === 'en' ? 'Wellness Programs' : 'कल्याण कार्यक्रम'}</h3>
              <p>{language === 'en' ? 'Access to community welfare and support programs' : 'सामुदायिक कल्याण और सहायता कार्यक्रमों तक पहुँच'}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📜</div>
              <h3>{language === 'en' ? 'Member ID Card' : 'सदस्य आईडी कार्ड'}</h3>
              <p>{language === 'en' ? 'Official membership certificate and digital ID card' : 'आधिकारिक सदस्यता प्रमाणपत्र और डिजिटल आईडी कार्ड'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tiers-section">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'Membership Tiers' : 'सदस्यता स्तर'}</h2>
            <div className="underline"></div>
          </div>
          <div className="tiers-grid">
            <div className="tier-card diamond">
              <div className="tier-icon">💎</div>
              <h3>{language === 'en' ? 'Diamond Tier' : 'डायमंड स्तर'}</h3>
              <ul className="tier-benefits">
                <li>{language === 'en' ? '✓ Can approve new members (admin-like privileges)' : '✓ नए सदस्यों को मंजूरी दे सकते हैं'}</li>
                <li>{language === 'en' ? '✓ All Gold Tier benefits' : '✓ सभी गोल्ड स्तर लाभ'}</li>
                <li>{language === 'en' ? '✓ Priority support and assistance' : '✓ प्राथमिकता सहायता'}</li>
                <li>{language === 'en' ? '✓ Decision-making authority' : '✓ निर्णय लेने का अधिकार'}</li>
              </ul>
            </div>
            <div className="tier-card gold">
              <div className="tier-icon">🏆</div>
              <h3>{language === 'en' ? 'Gold Tier' : 'गोल्ड स्तर'}</h3>
              <ul className="tier-benefits">
                <li>{language === 'en' ? '✓ View all upcoming events' : '✓ आगामी सभी कार्यक्रम देखें'}</li>
                <li>{language === 'en' ? '✓ Volunteer to join and organize events' : '✓ कार्यक्रमों में शामिल हों और आयोजन करें'}</li>
                <li>{language === 'en' ? '✓ All Silver Tier benefits' : '✓ सभी सिल्वर स्तर लाभ'}</li>
                <li>{language === 'en' ? '✓ Exclusive networking opportunities' : '✓ विशेष नेटवर्किंग अवसर'}</li>
              </ul>
            </div>
            <div className="tier-card silver">
              <div className="tier-icon">🥈</div>
              <h3>{language === 'en' ? 'Silver Tier' : 'सिल्वर स्तर'}</h3>
              <ul className="tier-benefits">
                <li>{language === 'en' ? '✓ Access to Community, Events, and Gallery tabs' : '✓ समुदाय, कार्यक्रम और गैलरी टैब देखें'}</li>
                <li>{language === 'en' ? '✓ View membership list of all members' : '✓ सभी सदस्यों की सूची देखें'}</li>
                <li>{language === 'en' ? '✓ Browse photo gallery' : '✓ फोटो गैलरी ब्राउज़ करें'}</li>
                <li>{language === 'en' ? '✓ View completed events' : '✓ पूर्ण किए गए कार्यक्रम देखें'}</li>
              </ul>
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
                <label htmlFor="address">{language === 'en' ? 'Address / पता *' : 'पता / Address *'}</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="2"
                  placeholder={language === 'en' ? 'House No., Street Name' : 'मकान नं., गली का नाम'}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="village">{language === 'en' ? 'Village/Locality/Colony / ग्राम/मोहल्ला/कॉलोनी *' : 'ग्राम/मोहल्ला/कॉलोनी / Village/Locality/Colony *'}</label>
                  <input
                    type="text"
                    id="village"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter village/locality/colony' : 'ग्राम/मोहल्ला/कॉलोनी दर्ज करें'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="block">{language === 'en' ? 'Block / ब्लॉक *' : 'ब्लॉक / Block *'}</label>
                  <input
                    type="text"
                    id="block"
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter block' : 'ब्लॉक दर्ज करें'}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tehsil">{language === 'en' ? 'Tehsil / तहसील *' : 'तहसील / Tehsil *'}</label>
                  <input
                    type="text"
                    id="tehsil"
                    name="tehsil"
                    value={formData.tehsil}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter tehsil' : 'तहसील दर्ज करें'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="district">{language === 'en' ? 'District / जिला *' : 'जिला / District *'}</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    placeholder={language === 'en' ? 'Enter district' : 'जिला दर्ज करें'}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="state">{t('membership.state')}</label>
                  <select
                    id="state"
                    name="state"
                    value={showOtherState ? 'other' : formData.state}
                    onChange={handleStateChange}
                    required={!showOtherState}
                  >
                    <option value="">{language === 'en' ? 'Select State' : 'राज्य चुनें'}</option>
                    {indianStates.map((stateObj) => (
                      <option key={stateObj.state} value={stateObj.state}>
                        {stateObj.state}
                      </option>
                    ))}
                    <option value="other">{language === 'en' ? 'Other' : 'अन्य'}</option>
                  </select>
                  {showOtherState && (
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      placeholder={language === 'en' ? 'Enter state name' : 'राज्य का नाम दर्ज करें'}
                      style={{ marginTop: '10px' }}
                    />
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="city">{t('membership.city')}</label>
                  <select
                    id="city"
                    name="city"
                    value={showOtherCity ? 'other' : formData.city}
                    onChange={handleCityChange}
                    required={!showOtherCity}
                    disabled={!selectedState && !showOtherState}
                  >
                    <option value="">{language === 'en' ? 'Select City' : 'शहर चुनें'}</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                    <option value="other">{language === 'en' ? 'Other' : 'अन्य'}</option>
                  </select>
                  {showOtherCity && (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder={language === 'en' ? 'Enter city name' : 'शहर का नाम दर्ज करें'}
                      style={{ marginTop: '10px' }}
                    />
                  )}
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
                  <label htmlFor="education">
                    {language === 'en' ? 'Educational Qualification *' : 'शैक्षिक योग्यता *'}
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      {language === 'en' ? 'Select education level' : 'शिक्षा स्तर चुनें'}
                    </option>
                    <option value="below-10th">
                      {language === 'en' ? 'Below 10th' : '10वीं से कम'}
                    </option>
                    <option value="10th">
                      {language === 'en' ? '10th Pass' : '10वीं पास'}
                    </option>
                    <option value="12th">
                      {language === 'en' ? '12th Pass' : '12वीं पास'}
                    </option>
                    <option value="graduate">
                      {language === 'en' ? 'Graduate' : 'स्नातक'}
                    </option>
                    <option value="post-graduate">
                      {language === 'en' ? 'Post Graduate' : 'स्नातकोत्तर'}
                    </option>
                    <option value="diploma">
                      {language === 'en' ? 'Diploma' : 'डिप्लोमा'}
                    </option>
                    <option value="others">
                      {language === 'en' ? 'Others' : 'अन्य'}
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="idProof">
                    {language === 'en' ? 'ID Proof Photo (JPG/PNG) *' : 'पहचान प्रमाण फोटो (JPG/PNG) *'}
                  </label>
                  <input
                    type="file"
                    id="idProof"
                    name="idProof"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    required
                    className="file-input"
                  />
                  <small className="file-hint">
                    {language === 'en' ? 'Upload clear photo of ID proof (Aadhar, PAN, Voter ID, etc.)' : 'पहचान प्रमाण की स्पष्ट फोटो अपलोड करें (आधार, पैन, वोटर आईडी, आदि)'}
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="addressProof">
                    {language === 'en' ? 'Address Proof Photo (JPG/PNG) *' : 'पते का प्रमाण फोटो (JPG/PNG) *'}
                  </label>
                  <input
                    type="file"
                    id="addressProof"
                    name="addressProof"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    required
                    className="file-input"
                  />
                  <small className="file-hint">
                    {language === 'en' ? 'Upload clear photo of address proof (Utility bill, Bank statement, etc.)' : 'पते के प्रमाण की स्पष्ट फोटो अपलोड करें (बिजली बिल, बैंक स्टेटमेंट, आदि)'}
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
                    {language === 'en' ? 'Donation Receipt Photo (JPG/PNG)' : 'सहयोग रसीद फोटो (JPG/PNG)'}
                  </label>
                  <input
                    type="file"
                    id="donationDocument"
                    name="donationDocument"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <small className="file-hint">
                    {language === 'en' ? 'Optional: Upload donation receipt photo (JPG/PNG)' : 'वैकल्पिक: सहयोग रसीद की फोटो अपलोड करें (JPG/PNG)'}
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
