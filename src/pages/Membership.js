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
  const [educationCategory, setEducationCategory] = useState('');
  const [otherEducationText, setOtherEducationText] = useState('');
  const [subDegreeOther, setSubDegreeOther] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '', show: false });
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showFamilyForm, setShowFamilyForm] = useState(true);
  const [newFamilyMember, setNewFamilyMember] = useState({ name: '', relation: '', gender: '', dateOfBirth: '', occupation: '', phone: '' });
  const [fmDobDay, setFmDobDay] = useState('');
  const [fmDobMonth, setFmDobMonth] = useState('');
  const [fmDobYear, setFmDobYear] = useState('');
  const [fmPhotoFile, setFmPhotoFile] = useState(null);
  const [fmPhotoPreview, setFmPhotoPreview] = useState('');
  const [familyMemberPhotos, setFamilyMemberPhotos] = useState([]);
  const [fmOtherRelation, setFmOtherRelation] = useState('');
  const [fmEducationCategory, setFmEducationCategory] = useState('');
  const [fmSubDegreeOther, setFmSubDegreeOther] = useState('');
  const [fmOtherEducationText, setFmOtherEducationText] = useState('');
  const [editingFamilyIndex, setEditingFamilyIndex] = useState(null);

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

  // Helper function to show notifications
  const showNotification = (type, text) => {
    setNotification({ type, text, show: true });
    setTimeout(() => {
      setNotification({ type: '', text: '', show: false });
    }, 5000); // Auto close after 5 seconds
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDobChange = (field, value) => {
    const newDay   = field === 'day'   ? value : dobDay;
    const newMonth = field === 'month' ? value : dobMonth;
    const newYear  = field === 'year'  ? value : dobYear;
    if (field === 'day')   setDobDay(value);
    if (field === 'month') setDobMonth(value);
    if (field === 'year')  setDobYear(value);
    if (newDay && newMonth && newYear) {
      setFormData(prev => ({
        ...prev,
        dateOfBirth: `${newYear}-${newMonth}-${newDay}`
      }));
    } else {
      setFormData(prev => ({ ...prev, dateOfBirth: '' }));
    }
  };

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

  const graduateDegrees = [
    { value: 'B.A. (Bachelor of Arts)', en: 'B.A. (Bachelor of Arts)', hi: 'बी.ए. (कला स्नातक)' },
    { value: 'B.Sc (Bachelor of Science)', en: 'B.Sc (Bachelor of Science)', hi: 'बी.एससी (विज्ञान स्नातक)' },
    { value: 'B.Com (Bachelor of Commerce)', en: 'B.Com (Bachelor of Commerce)', hi: 'बी.कॉम (वाणिज्य स्नातक)' },
    { value: 'B.Tech / B.E. (Engineering)', en: 'B.Tech / B.E. (Engineering)', hi: 'बी.टेक / बी.ई. (इंजीनियरिंग)' },
    { value: 'BBA (Business Administration)', en: 'BBA (Business Administration)', hi: 'बीबीए (व्यवसाय प्रशासन)' },
    { value: 'BCA (Computer Applications)', en: 'BCA (Computer Applications)', hi: 'बीसीए (कंप्यूटर एप्लीकेशन)' },
    { value: 'LLB (Law)', en: 'LLB (Law)', hi: 'एलएलबी (विधि)' },
    { value: 'MBBS (Medicine)', en: 'MBBS (Medicine)', hi: 'एमबीबीएस (चिकित्सा)' },
    { value: 'BDS (Dental)', en: 'BDS (Dental)', hi: 'बीडीएस (दंत चिकित्सा)' },
    { value: 'B.Pharm (Pharmacy)', en: 'B.Pharm (Pharmacy)', hi: 'बी.फार्म (फार्मेसी)' },
    { value: 'B.Arch (Architecture)', en: 'B.Arch (Architecture)', hi: 'बी.आर्च (वास्तुकला)' },
    { value: 'B.Ed (Education)', en: 'B.Ed (Education)', hi: 'बी.एड (शिक्षा)' },
    { value: 'B.Nursing', en: 'B.Nursing', hi: 'बी.नर्सिंग' },
    { value: 'B.Des (Design)', en: 'B.Des (Design)', hi: 'बी.डेस (डिज़ाइन)' },
    { value: 'B.Sc Agriculture', en: 'B.Sc Agriculture', hi: 'बी.एससी कृषि' },
    { value: 'B.Sc Nursing', en: 'B.Sc Nursing', hi: 'बी.एससी नर्सिंग' },
    { value: 'Other Graduate Degree', en: 'Other Graduate Degree', hi: 'अन्य स्नातक डिग्री' },
  ];

  const postGraduateDegrees = [
    { value: 'M.A. (Master of Arts)', en: 'M.A. (Master of Arts)', hi: 'एम.ए. (कला स्नातकोत्तर)' },
    { value: 'M.Sc (Master of Science)', en: 'M.Sc (Master of Science)', hi: 'एम.एससी (विज्ञान स्नातकोत्तर)' },
    { value: 'M.Com (Master of Commerce)', en: 'M.Com (Master of Commerce)', hi: 'एम.कॉम (वाणिज्य स्नातकोत्तर)' },
    { value: 'M.Tech / M.E. (Engineering)', en: 'M.Tech / M.E. (Engineering)', hi: 'एम.टेक / एम.ई. (इंजीनियरिंग)' },
    { value: 'MBA (Business Administration)', en: 'MBA (Business Administration)', hi: 'एमबीए (व्यवसाय प्रशासन)' },
    { value: 'MCA (Computer Applications)', en: 'MCA (Computer Applications)', hi: 'एमसीए (कंप्यूटर एप्लीकेशन)' },
    { value: 'LLM (Law)', en: 'LLM (Law)', hi: 'एलएलएम (विधि)' },
    { value: 'MD (Medicine)', en: 'MD (Medicine)', hi: 'एमडी (चिकित्सा)' },
    { value: 'MS (Master of Surgery)', en: 'MS (Master of Surgery)', hi: 'एमएस (शल्य चिकित्सा)' },
    { value: 'M.Pharm (Pharmacy)', en: 'M.Pharm (Pharmacy)', hi: 'एम.फार्म (फार्मेसी)' },
    { value: 'M.Arch (Architecture)', en: 'M.Arch (Architecture)', hi: 'एम.आर्च (वास्तुकला)' },
    { value: 'M.Ed (Education)', en: 'M.Ed (Education)', hi: 'एम.एड (शिक्षा)' },
    { value: 'M.Nursing', en: 'M.Nursing', hi: 'एम.नर्सिंग' },
    { value: 'M.Des (Design)', en: 'M.Des (Design)', hi: 'एम.डेस (डिज़ाइन)' },
    { value: 'M.Sc Agriculture', en: 'M.Sc Agriculture', hi: 'एम.एससी कृषि' },
    { value: 'Ph.D (Doctorate)', en: 'Ph.D (Doctorate)', hi: 'पीएच.डी (डॉक्टरेट)' },
    { value: 'Other PG Degree', en: 'Other PG Degree', hi: 'अन्य स्नातकोत्तर डिग्री' },
  ];

  const diplomaDegrees = [
    { value: 'Diploma in Engineering', en: 'Diploma in Engineering', hi: 'डिप्लोमा इन इंजीनियरिंग' },
    { value: 'Diploma in Computer Science', en: 'Diploma in Computer Science', hi: 'डिप्लोमा इन कंप्यूटर साइंस' },
    { value: 'Diploma in Mechanical Engineering', en: 'Diploma in Mechanical Engineering', hi: 'डिप्लोमा इन मैकेनिकल इंजीनियरिंग' },
    { value: 'Diploma in Civil Engineering', en: 'Diploma in Civil Engineering', hi: 'डिप्लोमा इन सिविल इंजीनियरिंग' },
    { value: 'Diploma in Electrical Engineering', en: 'Diploma in Electrical Engineering', hi: 'डिप्लोमा इन इलेक्ट्रिकल इंजीनियरिंग' },
    { value: 'Diploma in Electronics', en: 'Diploma in Electronics', hi: 'डिप्लोमा इन इलेक्ट्रॉनिक्स' },
    { value: 'Diploma in Pharmacy', en: 'Diploma in Pharmacy', hi: 'डिप्लोमा इन फार्मेसी' },
    { value: 'Diploma in Nursing', en: 'Diploma in Nursing', hi: 'डिप्लोमा इन नर्सिंग' },
    { value: 'Diploma in Hotel Management', en: 'Diploma in Hotel Management', hi: 'डिप्लोमा इन होटल मैनेजमेंट' },
    { value: 'Diploma in Fashion Design', en: 'Diploma in Fashion Design', hi: 'डिप्लोमा इन फैशन डिज़ाइन' },
    { value: 'Diploma in Interior Design', en: 'Diploma in Interior Design', hi: 'डिप्लोमा इन इंटीरियर डिज़ाइन' },
    { value: 'Diploma in Automobile Engineering', en: 'Diploma in Automobile Engineering', hi: 'डिप्लोमा इन ऑटोमोबाइल इंजीनियरिंग' },
    { value: 'Diploma in IT', en: 'Diploma in IT', hi: 'डिप्लोमा इन आईटी' },
    { value: 'Diploma in Agriculture', en: 'Diploma in Agriculture', hi: 'डिप्लोमा इन कृषि' },
    { value: 'Other Diploma', en: 'Other Diploma', hi: 'अन्य डिप्लोमा' },
  ];

  const handleEducationCategoryChange = (e) => {
    const val = e.target.value;
    setEducationCategory(val);
    setOtherEducationText('');
    setSubDegreeOther('');
    if (['below-10th', '10th', '12th'].includes(val)) {
      setFormData({ ...formData, education: val });
    } else {
      setFormData({ ...formData, education: '' });
    }
  };

  const handleEducationDegreeChange = (e) => {
    const val = e.target.value;
    if (val === 'Other Graduate Degree') {
      setSubDegreeOther('graduate');
      setOtherEducationText('');
      setFormData({ ...formData, education: '' });
    } else if (val === 'Other PG Degree') {
      setSubDegreeOther('pg');
      setOtherEducationText('');
      setFormData({ ...formData, education: '' });
    } else if (val === 'Other Diploma') {
      setSubDegreeOther('diploma');
      setOtherEducationText('');
      setFormData({ ...formData, education: '' });
    } else {
      setSubDegreeOther('');
      setOtherEducationText('');
      setFormData({ ...formData, education: val });
    }
  };

  const handleOtherEducationChange = (e) => {
    setOtherEducationText(e.target.value);
    setFormData({ ...formData, education: e.target.value });
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
        showNotification('error', language === 'en' ? '❌ Please upload a JPG/PNG image file only' : '❌ कृपया केवल JPG/PNG छवि फ़ाइल अपलोड करें');
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
        showNotification('error', language === 'en' ? '❌ Please upload a JPG/PNG image file only' : '❌ कृपया केवल JPG/PNG छवि फ़ाइल अपलोड करें');
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
      showNotification('error', language === 'en' ? '❌ Please enter your full name' : '❌ कृपया अपना पूरा नाम दर्ज करें');
      document.getElementById('fullName').focus();
      return;
    }
    if (!nameRegex.test(formData.fullName)) {
      showNotification('error', language === 'en' ? '❌ Full name should contain only letters' : '❌ पूरे नाम में केवल अक्षर होने चाहिए');
      document.getElementById('fullName').focus();
      return;
    }
    
    // Father name validation
    if (!formData.fatherName.trim()) {
      showNotification('error', language === 'en' ? "❌ Please enter father's name" : '❌ कृपया पिता का नाम दर्ज करें');
      document.getElementById('fatherName').focus();
      return;
    }
    if (!nameRegex.test(formData.fatherName)) {
      showNotification('error', language === 'en' ? "❌ Father's name should contain only letters" : '❌ पिता के नाम में केवल अक्षर होने चाहिए');
      document.getElementById('fatherName').focus();
      return;
    }
    
    // Date of birth validation
    if (!dobDay || !dobMonth || !dobYear) {
      showNotification('error', language === 'en' ? '❌ Please select your complete date of birth' : '❌ कृपया अपनी पूरी जन्म तिथि चुनें');
      if (!dobYear) document.getElementById('dobYear').focus();
      else if (!dobMonth) document.getElementById('dobMonth').focus();
      else document.getElementById('dobDay').focus();
      return;
    }
    
    // Age validation - must be at least 18 years old
    const dob = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) ? age - 1 : age;
    
    if (actualAge < 18) {
      showNotification('error', language === 'en' ? '❌ You must be at least 18 years old to register' : '❌ पंजीकरण के लिए आपकी आयु कम से कम 18 वर्ष होनी चाहिए');
      document.getElementById('dobYear').focus();
      return;
    }
    if (actualAge > 120) {
      showNotification('error', language === 'en' ? '❌ Please enter a valid date of birth' : '❌ कृपया वैध जन्म तिथि दर्ज करें');
      document.getElementById('dobYear').focus();
      return;
    }
    
    // Gender validation
    if (!formData.gender) {
      showNotification('error', language === 'en' ? '❌ Please select your gender' : '❌ कृपया अपना लिंग चुनें');
      document.getElementById('gender').focus();
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      showNotification('error', language === 'en' ? '❌ Please enter your email address' : '❌ कृपया अपना ईमेल पता दर्ज करें');
      document.getElementById('email').focus();
      return;
    }
    if (!emailRegex.test(formData.email)) {
      showNotification('error', language === 'en' ? '❌ Please enter a valid email address' : '❌ कृपया वैध ईमेल पता दर्ज करें');
      document.getElementById('email').focus();
      return;
    }
    
    // Phone validation - Indian phone number (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      showNotification('error', language === 'en' ? '❌ Please enter your phone number' : '❌ कृपया अपना फोन नंबर दर्ज करें');
      document.getElementById('phone').focus();
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      showNotification('error', language === 'en' ? '❌ Please enter a valid 10-digit phone number' : '❌ कृपया वैध 10 अंकों का फोन नंबर दर्ज करें');
      document.getElementById('phone').focus();
      return;
    }
    
    // Password validation
    if (!formData.password) {
      showNotification('error', language === 'en' ? '❌ Please enter a password' : '❌ कृपया पासवर्ड दर्ज करें');
      document.getElementById('password').focus();
      return;
    }
    if (formData.password.length < 6) {
      showNotification('error', language === 'en' ? '❌ Password must be at least 6 characters long' : '❌ पासवर्ड कम से कम 6 अक्षरों का होना चाहिए');
      document.getElementById('password').focus();
      return;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      showNotification('error', language === 'en' ? '❌ Please confirm your password' : '❌ कृपया अपने पासवर्ड की पुष्टि करें');
      document.getElementById('confirmPassword').focus();
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showNotification('error', language === 'en' ? '❌ Passwords do not match!' : '❌ पासवर्ड मेल नहीं खाते!');
      document.getElementById('confirmPassword').focus();
      return;
    }
    
    // Address validation
    if (!formData.address.trim()) {
      showNotification('error', language === 'en' ? '❌ Please enter your address' : '❌ कृपया अपना पता दर्ज करें');
      document.getElementById('address').focus();
      return;
    }
    if (formData.address.trim().length < 10) {
      showNotification('error', language === 'en' ? '❌ Please enter a complete address (minimum 10 characters)' : '❌ कृपया पूरा पता दर्ज करें (न्यूनतम 10 अक्षर)');
      document.getElementById('address').focus();
      return;
    }
    
    // State validation
    if (!formData.state.trim()) {
      showNotification('error', language === 'en' ? '❌ Please select or enter your state' : '❌ कृपया अपना राज्य चुनें या दर्ज करें');
      document.getElementById('state').focus();
      return;
    }
    
    // City validation
    if (!formData.city.trim()) {
      showNotification('error', language === 'en' ? '❌ Please select or enter your city' : '❌ कृपया अपना शहर चुनें या दर्ज करें');
      document.getElementById('city').focus();
      return;
    }
    
    // Pincode validation - 6 digits
    const pincodeRegex = /^\d{6}$/;
    if (!formData.pincode.trim()) {
      showNotification('error', language === 'en' ? '❌ Please enter your pincode' : '❌ कृपया अपना पिन कोड दर्ज करें');
      document.getElementById('pincode').focus();
      return;
    }
    if (!pincodeRegex.test(formData.pincode)) {
      showNotification('error', language === 'en' ? '❌ Please enter a valid 6-digit pincode' : '❌ कृपया वैध 6 अंकों का पिन कोड दर्ज करें');
      document.getElementById('pincode').focus();
      return;
    }
    
    // Education validation
    if (!educationCategory) {
      showNotification('error', language === 'en' ? '❌ Please select your educational qualification' : '❌ कृपया अपनी शैक्षिक योग्यता चुनें');
      document.getElementById('education').focus();
      return;
    }
    if (['graduate', 'post-graduate', 'diploma', 'others'].includes(educationCategory) && !formData.education) {
      showNotification('error', language === 'en' ? '❌ Please select or enter your specific degree' : '❌ कृपया अपनी विशिष्ट डिग्री चुनें या लिखें');
      return;
    }

    // Occupation validation
    if (!formData.occupation.trim()) {
      showNotification('error', language === 'en' ? '❌ Please enter your occupation' : '❌ कृपया अपना व्यवसाय दर्ज करें');
      document.getElementById('occupation').focus();
      return;
    }
    if (formData.occupation.trim().length < 2) {
      showNotification('error', language === 'en' ? '❌ Please enter a valid occupation' : '❌ कृपया वैध व्यवसाय दर्ज करें');
      document.getElementById('occupation').focus();
      return;
    }
    
    // File validations
    if (!formData.idProof) {
      showNotification('error', language === 'en' ? '❌ Please upload your ID proof photo (JPG/PNG)' : '❌ कृपया अपना पहचान प्रमाण फोटो अपलोड करें (JPG/PNG)');
      document.getElementById('idProof').focus();
      return;
    }
    
    if (!formData.addressProof) {
      showNotification('error', language === 'en' ? '❌ Please upload your address proof photo (JPG/PNG)' : '❌ कृपया अपना पते का प्रमाण फोटो अपलोड करें (JPG/PNG)');
      document.getElementById('addressProof').focus();
      return;
    }
    
    if (!formData.photo) {
      showNotification('error', language === 'en' ? '❌ Please upload your photo (JPG/PNG)' : '❌ कृपया अपनी फोटो अपलोड करें (JPG/PNG)');
      document.getElementById('photo').focus();
      return;
    }
    
    // File size validations
    if (formData.idProof && formData.idProof.size > 5 * 1024 * 1024) {
      showNotification('error', language === 'en' ? '❌ ID proof file size should be less than 5MB' : '❌ पहचान प्रमाण फाइल का आकार 5MB से कम होना चाहिए');
      document.getElementById('idProof').focus();
      return;
    }
    
    if (formData.addressProof && formData.addressProof.size > 5 * 1024 * 1024) {
      showNotification('error', language === 'en' ? '❌ Address proof file size should be less than 5MB' : '❌ पते के प्रमाण फाइल का आकार 5MB से कम होना चाहिए');
      document.getElementById('addressProof').focus();
      return;
    }
    
    if (formData.photo && formData.photo.size > 2 * 1024 * 1024) {
      showNotification('error', language === 'en' ? '❌ Photo file size should be less than 2MB' : '❌ फोटो फाइल का आकार 2MB से कम होना चाहिए');
      document.getElementById('photo').focus();
      return;
    }
    
    if (formData.donationDocument && formData.donationDocument.size > 5 * 1024 * 1024) {
      showNotification('error', language === 'en' ? '❌ Donation document file size should be less than 5MB' : '❌ सहयोग दस्तावेज़ फाइल का आकार 5MB से कम होना चाहिए');
      document.getElementById('donationDocument').focus();
      return;
    }

    // All validations passed - show review modal
    setShowReviewModal(true);
  };

  const handleConfirmRegistration = async () => {
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
      const pendingMemberName = newFamilyMember.name.trim();
      const effectiveFamilyMembers = pendingMemberName
        ? [...familyMembers, { ...newFamilyMember, relation: newFamilyMember.relation === 'Other' ? (fmOtherRelation || 'Other') : newFamilyMember.relation }]
        : familyMembers;
      const effectiveFamilyPhotos = pendingMemberName
        ? [...familyMemberPhotos, fmPhotoFile]
        : familyMemberPhotos;
      submitData.append('familyMembers', JSON.stringify(effectiveFamilyMembers));
      effectiveFamilyPhotos.forEach(file => {
        if (file) submitData.append('familyMemberPhoto', file);
      });
      
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
        setShowReviewModal(false);
        setShowConfirmation(false);
        setEducationCategory('');
        setOtherEducationText('');
        setSubDegreeOther('');
        setDobDay('');
        setDobMonth('');
        setDobYear('');
        setFamilyMembers([]);
        setFamilyMemberPhotos([]);
        setNewFamilyMember({ name: '', relation: '', gender: '', dateOfBirth: '', occupation: '', phone: '' });
        setFmDobDay(''); setFmDobMonth(''); setFmDobYear('');
        setFmPhotoFile(null); setFmPhotoPreview('');
        setShowFamilyForm(true);
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
        showNotification('error', data.message || (language === 'en' ? '❌ Registration failed. Please try again.' : '❌ पंजीकरण विफल। कृपया पुन: प्रयास करें।'));
      }
    } catch (error) {
      const errorMsg = language === 'en' 
        ? 'Connection error. Please check if the server is running.' 
        : 'कनेक्शन त्रुटि। कृपया जांचें कि सर्वर चल रहा है।';
      setMessage({
        type: 'error',
        text: errorMsg
      });
      showNotification('error', `❌ ${errorMsg}`);
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

      {/* Notification Toast for Errors & Warnings */}
      {notification.show && (
        <div className={`notification-toast notification-${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === 'error' && '❌'}
              {notification.type === 'success' && '✅'}
              {notification.type === 'warning' && '⚠️'}
              {notification.type === 'info' && 'ℹ️'}
            </span>
            <span className="notification-text">{notification.text}</span>
          </div>
          <div className="notification-close" onClick={() => setNotification({ type: '', text: '', show: false })}>
            ✕
          </div>
        </div>
      )}

      {/* Review Modal - Summary of all details */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">📋</div>
            <h2>{language === 'en' ? 'Review Your Details' : 'अपने विवरण की समीक्षा करें'}</h2>
            <p className="review-subtitle">
              {language === 'en' 
                ? 'Please check all your information carefully before confirming:'
                : 'कृपया पुष्टि करने से पहले अपनी सभी जानकारी को सावधानीपूर्वक जांचें:'}
            </p>
            
            <div className="review-details">
              <div className="review-row">
                <div className="review-col">
                  <strong>{language === 'en' ? 'Full Name:' : 'पूरा नाम:'}</strong>
                  <p>{formData.fullName}</p>
                </div>
                <div className="review-col">
                  <strong>{language === 'en' ? "Father's Name:" : 'पिता का नाम:'}</strong>
                  <p>{formData.fatherName}</p>
                </div>
              </div>

              <div className="review-row">
                <div className="review-col">
                  <strong>{language === 'en' ? 'Date of Birth:' : 'जन्म तिथि:'}</strong>
                  <p>{dobDay && dobMonth && dobYear ? `${dobDay} - ${months.find(m => m.value === dobMonth)?.[language] || dobMonth} - ${dobYear}` : formData.dateOfBirth}</p>
                </div>
                <div className="review-col">
                  <strong>{language === 'en' ? 'Gender:' : 'लिंग:'}</strong>
                  <p>{formData.gender === 'male' ? (language === 'en' ? 'Male' : 'पुरुष') : formData.gender === 'female' ? (language === 'en' ? 'Female' : 'महिला') : 'Other'}</p>
                </div>
              </div>

              <div className="review-row">
                <div className="review-col">
                  <strong>{language === 'en' ? 'Email:' : 'ईमेल:'}</strong>
                  <p>{formData.email}</p>
                </div>
                <div className="review-col">
                  <strong>{language === 'en' ? 'Phone Number:' : 'फोन नंबर:'}</strong>
                  <p>{formData.phone}</p>
                </div>
              </div>

              <div className="review-row">
                <div className="review-col-full">
                  <strong>{language === 'en' ? 'Address:' : 'पता:'}</strong>
                  <p>{formData.address}</p>
                </div>
              </div>

              <div className="review-row">
                <div className="review-col">
                  <strong>{language === 'en' ? 'City:' : 'शहर:'}</strong>
                  <p>{formData.city}</p>
                </div>
                <div className="review-col">
                  <strong>{language === 'en' ? 'State:' : 'राज्य:'}</strong>
                  <p>{formData.state}</p>
                </div>
                <div className="review-col">
                  <strong>{language === 'en' ? 'Pincode:' : 'पिन कोड:'}</strong>
                  <p>{formData.pincode}</p>
                </div>
              </div>

              <div className="review-row">
                <div className="review-col">
                  <strong>{language === 'en' ? 'Occupation:' : 'व्यवसाय:'}</strong>
                  <p>{formData.occupation}</p>
                </div>
                <div className="review-col">
                  <strong>{language === 'en' ? 'Education:' : 'शिक्षा:'}</strong>
                  <p>{formData.education}</p>
                </div>
              </div>

              <div className="review-row">
                <div className="review-col-full">
                  <strong>{language === 'en' ? '✓ Documents Uploaded:' : '✓ अपलोड किए गए दस्तावेज़:'}</strong>
                  <ul className="document-list">
                    <li>✓ {language === 'en' ? 'ID Proof Photo' : 'पहचान प्रमाण फोटो'}</li>
                    <li>✓ {language === 'en' ? 'Address Proof Photo' : 'पते का प्रमाण फोटो'}</li>
                    <li>✓ {language === 'en' ? 'Profile Photo' : 'प्रोफ़ाइल फोटो'}</li>
                    {formData.donationDocument && <li>✓ {language === 'en' ? 'Donation Receipt' : 'सहयोग रसीद'}</li>}
                  </ul>
                </div>
              </div>

{(() => {
                const pendingName = newFamilyMember.name.trim();
                const allMembers = pendingName
                  ? [...familyMembers, { ...newFamilyMember, relation: newFamilyMember.relation === 'Other' ? (fmOtherRelation || 'अन्य') : newFamilyMember.relation }]
                  : familyMembers;
                return allMembers.length > 0 ? (
                  <div className="review-row">
                    <div className="review-col-full">
                      <strong>{language === 'en' ? 'Family Members:' : 'परिवार के सदस्य:'}</strong>
                      {allMembers.map((member, idx) => (
                        <div key={idx} style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '10px 14px', marginTop: '10px', background: '#fafafa' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                            <span><span style={{ color: '#e65c00', fontWeight: 600 }}>{language === 'en' ? 'Name:' : 'नाम:'}</span> {member.name}</span>
                            <span><span style={{ color: '#e65c00', fontWeight: 600 }}>{language === 'en' ? 'Relation:' : 'संबंध:'}</span> {member.relation}</span>
                            {member.gender && <span><span style={{ color: '#e65c00', fontWeight: 600 }}>{language === 'en' ? 'Gender:' : 'लिंग:'}</span> {member.gender === 'male' ? (language === 'en' ? 'Male' : 'पुरुष') : member.gender === 'female' ? (language === 'en' ? 'Female' : 'महिला') : (language === 'en' ? 'Other' : 'अन्य')}</span>}
                            {member.dateOfBirth && <span><span style={{ color: '#e65c00', fontWeight: 600 }}>{language === 'en' ? 'DOB:' : 'जन्म तिथि:'}</span> {member.dateOfBirth}</span>}
                            {member.education && <span><span style={{ color: '#e65c00', fontWeight: 600 }}>{language === 'en' ? 'Education:' : 'शिक्षा:'}</span> {member.education}</span>}
                            {member.occupation && <span><span style={{ color: '#e65c00', fontWeight: 600 }}>{language === 'en' ? 'Occupation:' : 'व्यवसाय:'}</span> {member.occupation}</span>}
                            {member.phone && <span><span style={{ color: '#e65c00', fontWeight: 600 }}>{language === 'en' ? 'Phone:' : 'फोन:'}</span> {member.phone}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>

            <div className="review-actions">
              <button 
                className="modal-btn cancel-btn" 
                onClick={() => setShowReviewModal(false)}
              >
                {language === 'en' ? 'Back to Edit' : 'संपादन के लिए वापस जाएं'}
              </button>
              <button 
                className="modal-btn confirm-btn" 
                onClick={() => {
                  setShowConfirmation(true);
                  setConfirmCheckbox(false);
                }}
                disabled={loading}
              >
                {language === 'en' ? 'Continue to Confirm' : 'पुष्टि के लिए जारी रखें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h2>{language === 'en' ? 'Final Confirmation' : 'अंतिम पुष्टि'}</h2>
            <p className="confirmation-message">
              {language === 'en' 
                ? 'By clicking "Confirm Registration", you certify that all the information provided is true and accurate. Any false information may result in rejection of your application.'
                : 'पंजीकरण की पुष्टि करें" पर क्लिक करके, आप प्रमाणित करते हैं कि प्रदान की गई सभी जानकारी सत्य और सटीक है। कोई भी गलत जानकारी आपके आवेदन को अस्वीकार कर सकती है।'}
            </p>

            <div className="confirmation-checklist">
              <label className="checklist-item">
                <input 
                  type="checkbox" 
                  checked={confirmCheckbox}
                  onChange={(e) => setConfirmCheckbox(e.target.checked)}
                />
                <span>
                  {language === 'en' 
                    ? 'I confirm that all details are accurate and complete'
                    : 'मैं पुष्टि करता हूं कि सभी विवरण सटीक और पूर्ण हैं'}
                </span>
              </label>
            </div>

            <div className="confirmation-actions">
              <button 
                className="modal-btn cancel-btn" 
                onClick={() => {
                  setShowConfirmation(false);
                  setConfirmCheckbox(false);
                  setShowReviewModal(true);
                }}
              >
                {language === 'en' ? 'Back' : 'वापस'}
              </button>
              <button 
                className="modal-btn final-confirm-btn" 
                onClick={handleConfirmRegistration}
                disabled={loading || !confirmCheckbox}
              >
                {loading
                  ? (language === 'en' ? 'Confirming...' : 'पुष्टि हो रही है...')
                  : (language === 'en' ? 'Confirm Registration' : 'पंजीकरण की पुष्टि करें')
                }
              </button>
            </div>
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

      {/* <section className="tiers-section">
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
            <div className="tier-card bronze">
              <div className="tier-icon">🥉</div>
              <h3>{language === 'en' ? 'Bronze Tier' : 'ब्रांज स्तर'}</h3>
              <ul className="tier-benefits">
                <li>{language === 'en' ? '✓ Access to Community tab' : '✓ समुदाय टैब देखें'}</li>
                <li>{language === 'en' ? '✓ View basic member profiles' : '✓ बुनियादी सदस्य प्रोफ़ाइल देखें'}</li>
                <li>{language === 'en' ? '✓ Participate in community discussions' : '✓ सामुदायिक चर्चाओं में भाग लें'}</li>
                <li>{language === 'en' ? '✓ Receive community newsletters' : '✓ सामुदायिक समाचार पत्र प्राप्त करें'}</li>
              </ul>
            </div>
            <div className="tier-card general">
              <div className="tier-icon" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <img src="/assets/general.jpeg" alt="General" style={{width: '80px', height: '80px', objectFit: 'contain', borderRadius: '50%', background: '#f5f5f5'}} />
              </div>
              <h3>{language === 'en' ? 'General Tier' : 'जनरल स्तर'}</h3>
              <ul className="tier-benefits">
                <li>{language === 'en' ? '✓ Basic profile access' : '✓ बुनियादी प्रोफ़ाइल एक्सेस'}</li>
                <li>{language === 'en' ? '✓ View public announcements' : '✓ सार्वजनिक घोषणाएं देखें'}</li>
                <li>{language === 'en' ? '✓ Community identity card' : '✓ सामुदायिक पहचान पत्र'}</li>
                <li>{language === 'en' ? '✓ Entry-level membership' : '✓ प्रारंभिक स्तर की सदस्यता'}</li>
              </ul>
            </div>
          </div>
        </div>
      </section> */}

      <section className="help-section">
        <div className="help-section-bg-overlay"></div>
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="section-header">
            <p className="help-section-eyebrow">{language === 'en' ? '🙏 Be Part of Something Greater' : '🙏 कुछ महान का हिस्सा बनें'}</p>
            <h2>{language === 'en' ? 'Support Your Community' : 'अपने समुदाय का समर्थन करें'}</h2>
            <div className="underline"></div>
          </div>

          <div className="help-impact-grid">
            <div className="help-impact-card">
              <div className="help-impact-icon">🎓</div>
              <h4>{language === 'en' ? 'Education' : 'शिक्षा'}</h4>
              <p>{language === 'en' ? 'Supporting students with scholarships & resources' : 'छात्रवृत्ति व संसाधनों से विद्यार्थियों की मदद'}</p>
            </div>
            <div className="help-impact-card">
              <div className="help-impact-icon">🏥</div>
              <h4>{language === 'en' ? 'Health & Welfare' : 'स्वास्थ्य एवं कल्याण'}</h4>
              <p>{language === 'en' ? 'Medical aid & welfare programs for families' : 'परिवारों के लिए चिकित्सा सहायता व कल्याण कार्यक्रम'}</p>
            </div>
            <div className="help-impact-card">
              <div className="help-impact-icon">🏛️</div>
              <h4>{language === 'en' ? 'Heritage' : 'विरासत'}</h4>
              <p>{language === 'en' ? 'Preserving our cultural identity & traditions' : 'सांस्कृतिक पहचान व परंपराओं का संरक्षण'}</p>
            </div>
            <div className="help-impact-card">
              <div className="help-impact-icon">🤝</div>
              <h4>{language === 'en' ? 'Unity' : 'एकता'}</h4>
              <p>{language === 'en' ? 'Strengthening bonds across the Maunas family' : 'मौनस परिवार में संगठन व एकजुटता को सुदृढ़ करना'}</p>
            </div>
          </div>

          {/* <p className="help-subtitle">
            {language === 'en' 
              ? 'The participation of all of us is essential for the progress of society and the creation of a strong future. To achieve this objective, you are humbly requested to participate in this noble work by voluntarily providing financial support as per your capacity for the development of your clan.'
              : 'समाज की उन्नति और सशक्त भविष्य के निर्माण में हम सभी की सहभागिता आवश्यक है। इसी उद्देश्य की पूर्ति हेतु आपसे विनम्र आग्रह है कि अपने कुल के विकास के लिए स्वेच्छा से यथाशक्ति आर्थिक सहयोग प्रदान कर इस पुनीत कार्य में सहभागी बनें।'}
          </p> */}
          {/* <div className="support-tiers-grid">
            <div className="support-card general">
              <div className="support-icon" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <img src="/assets/general.jpeg" alt="General" style={{width: '70px', height: '70px', objectFit: 'contain', borderRadius: '50%', background: '#f5f5f5'}} />
              </div>
              <h3>{language === 'en' ? 'General Support' : 'जनरल सहयोग'}</h3>
              <p className="support-amount">₹0</p>
              <p className="support-description">
                {language === 'en'
                  ? 'Community unity is the foundation of development'
                  : 'सामुदायिक एकता ही विकास का आधार'}
              </p>
            </div>
            <div className="support-card bronze">
              <div className="support-icon">🥉</div>
              <h3>{language === 'en' ? 'Bronze Support' : 'ब्रांज सहयोग'}</h3>
              <p className="support-amount">₹100</p>
              <p className="support-description">
                {language === 'en' 
                  ? 'Basic support to help community initiatives'
                  : 'समुदाय की पहल में मदद के लिए बुनियादी सहायता'}
              </p>
            </div>
            <div className="support-card silver">
              <div className="support-icon">🥈</div>
              <h3>{language === 'en' ? 'Silver Support' : 'सिल्वर सहयोग'}</h3>
              <p className="support-amount">₹500</p>
              <p className="support-description">
                {language === 'en' 
                  ? 'Enhanced support for community welfare programs'
                  : 'सामुदायिक कल्याण कार्यक्रमों के लिए बेहतर सहायता'}
              </p>
            </div>
            <div className="support-card gold">
              <div className="support-icon">🥇</div>
              <h3>{language === 'en' ? 'Golden Support' : 'गोल्डन सहयोग'}</h3>
              <p className="support-amount">₹5,100</p>
              <p className="support-description">
                {language === 'en' 
                  ? 'Premium support for major community projects'
                  : 'बड़ी सामुदायिक परियोजनाओं के लिए प्रीमियम सहायता'}
              </p>
            </div>
            <div className="support-card diamond">
              <div className="support-icon">💎</div>
              <h3>{language === 'en' ? 'Diamond Support' : 'डायमंड सहयोग'}</h3>
              <p className="support-amount">₹21,000</p>
              <p className="support-description">
                {language === 'en' 
                  ? 'Premier support for transformative community initiatives'
                  : 'समुदाय की महत्वपूर्ण परियोजनाओं के लिए शीर्ष सहायता'}
              </p>
            </div> */}
          {/* </div> */}
          <div className="help-note">
            <div className="help-note-icon">💝</div>
            <p>
              {language === 'en'
                ? 'The participation of all of us is essential for the progress of society and the creation of a strong future. To achieve this objective, you are humbly requested to participate in this noble work by voluntarily providing financial support as per your capacity for the development of your clan.'
                : 'समाज की उन्नति और सशक्त भविष्य के निर्माण में हम सभी की सहभागिता आवश्यक है। इसी उद्देश्य की पूर्ति हेतु आपसे विनम्र आग्रह है कि अपने कुल के विकास के लिए स्वेच्छा से यथाशक्ति आर्थिक सहयोग प्रदान कर इस पुनीत कार्य में सहभागी बनें।'}
            </p>
            <a href="/community?section=sahyogi" className="help-donate-btn">
              {language === 'en' ? '🤲 View Sahyogi Sadashya' : '🤲 सहयोगी सदस्य देखें'}
            </a>
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
            
            <form onSubmit={handleSubmit} className="registration-form" noValidate>
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
                  <label>{t('membership.dateOfBirth')}</label>
                  <div className="dob-dropdowns">
                    <select
                      id="dobYear"
                      value={dobYear}
                      onChange={e => handleDobChange('year', e.target.value)}
                      required
                    >
                      <option value="">{language === 'en' ? 'Year' : 'वर्ष'}</option>
                      {Array.from({ length: new Date().getFullYear() - 1909 }, (_, i) => new Date().getFullYear() - i)
                        .map(y => (
                          <option key={y} value={String(y)}>{y}</option>
                        ))}
                    </select>
                    <select
                      id="dobMonth"
                      value={dobMonth}
                      onChange={e => handleDobChange('month', e.target.value)}
                      required
                    >
                      <option value="">{language === 'en' ? 'Month' : 'माह'}</option>
                      {months.map(m => (
                        <option key={m.value} value={m.value}>
                          {language === 'en' ? m.en : m.hi}
                        </option>
                      ))}
                    </select>
                    <select
                      id="dobDay"
                      value={dobDay}
                      onChange={e => handleDobChange('day', e.target.value)}
                      required
                    >
                      <option value="">{language === 'en' ? 'Day' : 'दिन'}</option>
                      {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
                        .map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                  </div>
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
                    name="educationCategory"
                    value={educationCategory}
                    onChange={handleEducationCategoryChange}
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

                  {educationCategory === 'diploma' && (
                    <>
                      <select
                        style={{ marginTop: '8px' }}
                        value={subDegreeOther === 'diploma' ? 'Other Diploma' : formData.education}
                        onChange={handleEducationDegreeChange}
                      >
                        <option value="">
                          {language === 'en' ? 'Select Diploma' : 'डिप्लोमा चुनें'}
                        </option>
                        {diplomaDegrees.map(d => (
                          <option key={d.value} value={d.value}>
                            {language === 'en' ? d.en : d.hi}
                          </option>
                        ))}
                      </select>
                      {subDegreeOther === 'diploma' && (
                        <input
                          type="text"
                          style={{ marginTop: '8px' }}
                          placeholder={language === 'en' ? 'Enter your diploma name' : 'अपने डिप्लोमा का नाम लिखें'}
                          value={otherEducationText}
                          onChange={handleOtherEducationChange}
                        />
                      )}
                    </>
                  )}

                  {educationCategory === 'graduate' && (
                    <>
                      <select
                        style={{ marginTop: '8px' }}
                        value={subDegreeOther === 'graduate' ? 'Other Graduate Degree' : formData.education}
                        onChange={handleEducationDegreeChange}
                      >
                        <option value="">
                          {language === 'en' ? 'Select Graduate Degree' : 'स्नातक डिग्री चुनें'}
                        </option>
                        {graduateDegrees.map(d => (
                          <option key={d.value} value={d.value}>
                            {language === 'en' ? d.en : d.hi}
                          </option>
                        ))}
                      </select>
                      {subDegreeOther === 'graduate' && (
                        <input
                          type="text"
                          style={{ marginTop: '8px' }}
                          placeholder={language === 'en' ? 'Enter your graduate degree name' : 'अपनी स्नातक डिग्री का नाम लिखें'}
                          value={otherEducationText}
                          onChange={handleOtherEducationChange}
                        />
                      )}
                    </>
                  )}

                  {educationCategory === 'post-graduate' && (
                    <>
                      <select
                        style={{ marginTop: '8px' }}
                        value={subDegreeOther === 'pg' ? 'Other PG Degree' : formData.education}
                        onChange={handleEducationDegreeChange}
                      >
                        <option value="">
                          {language === 'en' ? 'Select Post Graduate Degree' : 'स्नातकोत्तर डिग्री चुनें'}
                        </option>
                        {postGraduateDegrees.map(d => (
                          <option key={d.value} value={d.value}>
                            {language === 'en' ? d.en : d.hi}
                          </option>
                        ))}
                      </select>
                      {subDegreeOther === 'pg' && (
                        <input
                          type="text"
                          style={{ marginTop: '8px' }}
                          placeholder={language === 'en' ? 'Enter your post graduate degree name' : 'अपनी स्नातकोत्तर डिग्री का नाम लिखें'}
                          value={otherEducationText}
                          onChange={handleOtherEducationChange}
                        />
                      )}
                    </>
                  )}

                  {educationCategory === 'others' && (
                    <input
                      type="text"
                      style={{ marginTop: '8px' }}
                      placeholder={language === 'en' ? 'Enter your degree / qualification' : 'अपनी डिग्री / योग्यता लिखें'}
                      value={otherEducationText}
                      onChange={handleOtherEducationChange}
                    />
                  )}
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

              {/* ====== OPTIONAL FAMILY DETAILS SECTION ====== */}
              <div className="family-section">
                <div className="family-section-header">
                  <h3>
                    <span className="family-icon">👨‍👩‍👧‍👦</span>
                    {language === 'en' ? 'Family Details' : 'पारिवारिक विवरण'}
                    <span className="family-optional-tag">{language === 'en' ? '(Optional)' : '(वैकल्पिक)'}</span>
                  </h3>
                </div>
                <p className="family-section-note">
                  {language === 'en'
                    ? 'You can add your family members now or manage them later from your profile after approval.'
                    : 'आप अभी अपने परिवार के सदस्यों को जोड़ सकते हैं या अनुमोदन के बाद अपनी प्रोफ़ाइल से प्रबंधित कर सकते हैं।'}
                </p>

                {showFamilyForm && (
                  <div className="family-form-container">
                    {/* Existing family members list */}
                    {familyMembers.length > 0 && (
                      <div className="family-members-list">
                        {familyMembers.map((member, index) => (
                          <div key={index} className={`family-member-tag${editingFamilyIndex === index ? ' fm-editing' : ''}`}>
                            <span className="fm-icon">👤</span>
                            <span className="fm-info">
                              <strong>{member.name}</strong>
                              <span className="fm-relation"> ({member.relation})</span>
                              {member.gender && <span className="fm-extra">, {member.gender === 'male' ? (language === 'en' ? 'Male' : 'पुरुष') : member.gender === 'female' ? (language === 'en' ? 'Female' : 'महिला') : (language === 'en' ? 'Other' : 'अन्य')}</span>}
                              {member.education && <span className="fm-extra">, {member.education}</span>}
                              {member.occupation && <span className="fm-extra">, {member.occupation}</span>}
                            </span>
                            <button
                              type="button"
                              className="fm-edit-btn"
                              onClick={() => {
                                // Determine education category from stored education value
                                const edu = member.education || '';
                                let cat = '';
                                if (edu === 'below-10th' || edu === '10th' || edu === '12th') cat = edu;
                                else if (graduateDegrees.some(d => d.value === edu)) cat = 'graduate';
                                else if (postGraduateDegrees.some(d => d.value === edu)) cat = 'post-graduate';
                                else if (diplomaDegrees.some(d => d.value === edu)) cat = 'diploma';
                                else if (edu) cat = 'graduate'; // fallback for custom text

                                // Detect if it's a custom "other" degree
                                const isOtherGrad = cat === 'graduate' && !graduateDegrees.some(d => d.value === edu);
                                const isOtherPG   = cat === 'post-graduate' && !postGraduateDegrees.some(d => d.value === edu);
                                const isOtherDip  = cat === 'diploma' && !diplomaDegrees.some(d => d.value === edu);

                                // Parse stored DOB YYYY-MM-DD
                                const dob = member.dateOfBirth || '';
                                const [dobY, dobM, dobD] = dob ? dob.split('-') : ['', '', ''];

                                setEditingFamilyIndex(index);
                                setNewFamilyMember({ ...member, relation: member.relation });
                                setFmOtherRelation('');
                                setFmDobYear(dobY || ''); setFmDobMonth(dobM || ''); setFmDobDay(dobD || '');
                                setFmEducationCategory(cat);
                                if (isOtherGrad) { setFmSubDegreeOther('graduate'); setFmOtherEducationText(edu); }
                                else if (isOtherPG) { setFmSubDegreeOther('pg'); setFmOtherEducationText(edu); }
                                else if (isOtherDip) { setFmSubDegreeOther('diploma'); setFmOtherEducationText(edu); }
                                else { setFmSubDegreeOther(''); setFmOtherEducationText(''); }
                                setFmPhotoFile(null); setFmPhotoPreview('');
                                const fmPhotoInput = document.getElementById('fmPhotoInput');
                                if (fmPhotoInput) fmPhotoInput.value = '';
                              }}
                              title={language === 'en' ? 'Edit' : 'संपादित करें'}
                            >✏️</button>
                            <button
                              type="button"
                              className="fm-remove-btn"
                              onClick={() => {
                                setFamilyMembers(familyMembers.filter((_, i) => i !== index));
                                setFamilyMemberPhotos(familyMemberPhotos.filter((_, i) => i !== index));
                                if (editingFamilyIndex === index) {
                                  setEditingFamilyIndex(null);
                                  setNewFamilyMember({ name: '', relation: '', gender: '', dateOfBirth: '', occupation: '', phone: '', education: '' });
                                  setFmDobDay(''); setFmDobMonth(''); setFmDobYear('');
                                  setFmOtherRelation(''); setFmEducationCategory(''); setFmSubDegreeOther(''); setFmOtherEducationText('');
                                }
                              }}
                              title={language === 'en' ? 'Remove' : 'हटाएं'}
                            >✕</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add / Edit family member form */}
                    <div className="add-family-member-form">
                      <h4>{editingFamilyIndex !== null ? (language === 'en' ? 'Edit Family Member' : 'सदस्य संपादित करें') : (language === 'en' ? 'Add Family Member' : 'परिवार के सदस्य जोड़ें')}</h4>
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
                          {newFamilyMember.relation === 'Other' && (
                            <input
                              type="text"
                              value={fmOtherRelation}
                              onChange={e => setFmOtherRelation(e.target.value)}
                              placeholder={language === 'en' ? 'Please specify relation' : 'संबंध बताएं'}
                              style={{ marginTop: '6px' }}
                            />
                          )}
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
                        <div className="form-group">
                          <label>{language === 'en' ? 'Education' : 'शिक्षा'}</label>
                          <select
                            value={fmEducationCategory}
                            onChange={e => {
                              const val = e.target.value;
                              setFmEducationCategory(val);
                              setFmSubDegreeOther('');
                              setFmOtherEducationText('');
                              if (['below-10th', '10th', '12th'].includes(val)) {
                                setNewFamilyMember(prev => ({ ...prev, education: val }));
                              } else {
                                setNewFamilyMember(prev => ({ ...prev, education: '' }));
                              }
                            }}
                          >
                            <option value="">{language === 'en' ? 'Select Education' : 'शिक्षा चुनें'}</option>
                            <option value="below-10th">{language === 'en' ? 'Below 10th' : '10वीं से कम'}</option>
                            <option value="10th">{language === 'en' ? '10th Pass' : '10वीं पास'}</option>
                            <option value="12th">{language === 'en' ? '12th Pass' : '12वीं पास'}</option>
                            <option value="graduate">{language === 'en' ? 'Graduate' : 'स्नातक'}</option>
                            <option value="post-graduate">{language === 'en' ? 'Post Graduate' : 'स्नातकोत्तर'}</option>
                            <option value="diploma">{language === 'en' ? 'Diploma' : 'डिप्लोमा'}</option>
                          </select>
                          {fmEducationCategory === 'graduate' && (
                            <select
                              value={newFamilyMember.education}
                              onChange={e => {
                                const val = e.target.value;
                                if (val === 'Other Graduate Degree') {
                                  setFmSubDegreeOther('graduate');
                                  setFmOtherEducationText('');
                                  setNewFamilyMember(prev => ({ ...prev, education: '' }));
                                } else {
                                  setFmSubDegreeOther('');
                                  setFmOtherEducationText('');
                                  setNewFamilyMember(prev => ({ ...prev, education: val }));
                                }
                              }}
                              style={{ marginTop: '6px' }}
                            >
                              <option value="">{language === 'en' ? 'Select Degree' : 'डिग्री चुनें'}</option>
                              {graduateDegrees.map(d => <option key={d.value} value={d.value}>{language === 'en' ? d.en : d.hi}</option>)}
                            </select>
                          )}
                          {fmEducationCategory === 'post-graduate' && (
                            <select
                              value={newFamilyMember.education}
                              onChange={e => {
                                const val = e.target.value;
                                if (val === 'Other PG Degree') {
                                  setFmSubDegreeOther('pg');
                                  setFmOtherEducationText('');
                                  setNewFamilyMember(prev => ({ ...prev, education: '' }));
                                } else {
                                  setFmSubDegreeOther('');
                                  setFmOtherEducationText('');
                                  setNewFamilyMember(prev => ({ ...prev, education: val }));
                                }
                              }}
                              style={{ marginTop: '6px' }}
                            >
                              <option value="">{language === 'en' ? 'Select Degree' : 'डिग्री चुनें'}</option>
                              {postGraduateDegrees.map(d => <option key={d.value} value={d.value}>{language === 'en' ? d.en : d.hi}</option>)}
                            </select>
                          )}
                          {fmEducationCategory === 'diploma' && (
                            <select
                              value={newFamilyMember.education}
                              onChange={e => {
                                const val = e.target.value;
                                if (val === 'Other Diploma') {
                                  setFmSubDegreeOther('diploma');
                                  setFmOtherEducationText('');
                                  setNewFamilyMember(prev => ({ ...prev, education: '' }));
                                } else {
                                  setFmSubDegreeOther('');
                                  setFmOtherEducationText('');
                                  setNewFamilyMember(prev => ({ ...prev, education: val }));
                                }
                              }}
                              style={{ marginTop: '6px' }}
                            >
                              <option value="">{language === 'en' ? 'Select Diploma' : 'डिप्लोमा चुनें'}</option>
                              {diplomaDegrees.map(d => <option key={d.value} value={d.value}>{language === 'en' ? d.en : d.hi}</option>)}
                            </select>
                          )}
                          {fmSubDegreeOther && (
                            <input
                              type="text"
                              value={fmOtherEducationText}
                              onChange={e => {
                                setFmOtherEducationText(e.target.value);
                                setNewFamilyMember(prev => ({ ...prev, education: e.target.value }));
                              }}
                              placeholder={language === 'en' ? 'Specify education' : 'शिक्षा बताएं'}
                              style={{ marginTop: '6px' }}
                            />
                          )}
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
                          <label htmlFor="fmPhotoInput" className="file-upload-label fm-photo-upload-btn">
                            📁 {language === 'en' ? 'Choose Photo' : 'फोटो चुनें'}
                          </label>
                          <input
                            type="file"
                            id="fmPhotoInput"
                            accept="image/jpeg,image/png,image/jpg"
                            className="file-input hidden-input"
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) {
                                setFmPhotoFile(file);
                                setFmPhotoPreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="add-family-btn"
                          onClick={() => {
                            if (!newFamilyMember.name.trim()) {
                              showNotification('error', language === 'en' ? '❌ Please enter family member name' : '❌ कृपया परिवार के सदस्य का नाम दर्ज करें');
                              return;
                            }
                            if (!newFamilyMember.relation) {
                              showNotification('error', language === 'en' ? '❌ Please select relation' : '❌ कृपया संबंध चुनें');
                              return;
                            }
                            const finalRelation = newFamilyMember.relation === 'Other' ? fmOtherRelation : newFamilyMember.relation;
                            const updatedMember = { ...newFamilyMember, relation: finalRelation };
                            if (editingFamilyIndex !== null) {
                              // Update existing entry
                              const updatedMembers = familyMembers.map((m, i) => i === editingFamilyIndex ? updatedMember : m);
                              const updatedPhotos  = familyMemberPhotos.map((p, i) => i === editingFamilyIndex ? (fmPhotoFile || p) : p);
                              setFamilyMembers(updatedMembers);
                              setFamilyMemberPhotos(updatedPhotos);
                              setEditingFamilyIndex(null);
                            } else {
                              setFamilyMembers([...familyMembers, updatedMember]);
                              setFamilyMemberPhotos([...familyMemberPhotos, fmPhotoFile]);
                            }
                            setNewFamilyMember({ name: '', relation: '', gender: '', dateOfBirth: '', occupation: '', phone: '', education: '' });
                            setFmDobDay(''); setFmDobMonth(''); setFmDobYear('');
                            setFmPhotoFile(null); setFmPhotoPreview('');
                            setFmOtherRelation(''); setFmEducationCategory(''); setFmSubDegreeOther(''); setFmOtherEducationText('');
                            const fmPhotoInput = document.getElementById('fmPhotoInput');
                            if (fmPhotoInput) fmPhotoInput.value = '';
                          }}
                        >
                          {editingFamilyIndex !== null ? (language === 'en' ? '✔ Update Member' : '✔ सदस्य अपडेट करें') : `+ ${language === 'en' ? 'Add Member' : 'सदस्य जोड़ें'}`}
                        </button>
                        {editingFamilyIndex !== null && (
                          <button
                            type="button"
                            className="fm-cancel-edit-btn"
                            onClick={() => {
                              setEditingFamilyIndex(null);
                              setNewFamilyMember({ name: '', relation: '', gender: '', dateOfBirth: '', occupation: '', phone: '', education: '' });
                              setFmDobDay(''); setFmDobMonth(''); setFmDobYear('');
                              setFmOtherRelation(''); setFmEducationCategory(''); setFmSubDegreeOther(''); setFmOtherEducationText('');
                              setFmPhotoFile(null); setFmPhotoPreview('');
                            }}
                          >
                            {language === 'en' ? '✕ Cancel Edit' : '✕ संपादन रद्द करें'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading 
                    ? (language === 'en' ? 'Submitting...' : 'जमा हो रहा है...')
                    : (language === 'en' ? 'Review & Confirm Registration' : 'समीक्षा और पंजीकरण की पुष्टि करें')
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
