import React, { useState, useEffect } from 'react';
import './OathModal.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const OathModal = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  // Check URL parameter for forcing modal display
  const urlParams = new URLSearchParams(window.location.search);
  const forceShow = urlParams.get('showOath') === 'true';
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: ''
  });
  
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Initialize state - always start with checking localStorage
  const [isOpen, setIsOpen] = useState(() => {
    if (forceShow) {
      console.log('OathModal: FORCED SHOW via URL parameter');
      return true;
    }
    const hasAgreed = localStorage.getItem('oathAgreed');
    console.log('OathModal: hasAgreed from localStorage:', hasAgreed);
    console.log('OathModal: Will show modal:', !hasAgreed);
    return !hasAgreed;
  });

  useEffect(() => {
    console.log('OathModal: isOpen state:', isOpen);
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!isChecked) {
      newErrors.checkbox = 'You must agree to the oath';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAgree = async () => {
    if (!validateForm()) {
      return;
    }
    
    console.log('OathModal: User agreed to oath', formData);
    
    try {
      // Save oath agreement to backend
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      console.log('OathModal: Attempting to save to:', `${API_URL}/users/save-oath`);
      
      const response = await fetch(`${API_URL}/users/save-oath`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          mobileNumber: formData.mobileNumber,
          agreedAt: new Date().toISOString()
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('OathModal: Oath saved to backend successfully', data);
      } else {
        console.warn('OathModal: Failed to save oath to backend:', data.message);
        alert('Note: Your agreement was recorded locally, but could not be saved to the server.');
      }
    } catch (error) {
      console.error('OathModal: Error saving oath:', error);
      alert('Note: Your agreement was recorded locally, but could not be saved to the server. Please check if the backend is running.');
    }
    
    localStorage.setItem('oathAgreed', 'true');
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleDisagree = () => {
    console.log('OathModal: User disagreed to oath');
    alert(t.oath?.disagreeMessage || 'You must agree to the oath to access this website.');
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  console.log('OathModal: Rendering, isOpen:', isOpen);
  
  if (!isOpen) return null;

  return (
    <div className="oath-modal-overlay">
      <div className="oath-modal">
        <div className="oath-header">
          <h2>{t.oath?.title || 'प्रामाणिकता की शपथ'}</h2>
          <div className="oath-subtitle">{t.oath?.subtitle || 'Oath of Genuity'}</div>
        </div>
        
        <div className="oath-content">
          <div className="oath-form">
            <div className="form-group">
              <label htmlFor="name">
                नाम / Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="अपना पूरा नाम लिखें / Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="mobileNumber">
                मोबाइल नंबर / Mobile Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="10 अंकों का मोबाइल नंबर / 10-digit mobile number"
                maxLength="10"
                className={errors.mobileNumber ? 'error' : ''}
              />
              {errors.mobileNumber && <span className="error-message">{errors.mobileNumber}</span>}
            </div>
          </div>
          
          <div className="oath-text">
            <p className="hindi-text">
              मैं <strong>{formData.name || '................'}</strong> मो. नं. <strong>{formData.mobileNumber || '..............'}</strong> प्रमाणित करता हूँ कि मैं क्षत्रिय मौनस वंश से हूँ। 
              भविष्य में कोई यदि यह प्रमाणित करता है कि मैं क्षत्रिय मौनस वंश से नहीं हूँ तो 
              मेरे ऊपर वैधानिक कार्यवाही की जाएगी ।
            </p>
            <p className="english-text">
              I <strong>{formData.name || '................'}</strong> Mo. No. <strong>{formData.mobileNumber || '..............'}</strong> certify that I belong to the Kshatriya Maunas lineage. If in the future anyone proves that I do not belong to the Kshatriya Maunas lineage, then legal action will be taken against me.
            </p>
          </div>

          <div className="oath-checkbox">
            <label>
              <input 
                type="checkbox" 
                id="agreeCheckbox" 
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                  if (errors.checkbox) {
                    setErrors(prev => ({ ...prev, checkbox: '' }));
                  }
                }}
              />
              <span>{t.oath?.agreeText || 'मैं इस शपथ को स्वीकार करता/करती हूँ (I agree to this oath)'}</span>
            </label>
            {errors.checkbox && <span className="error-message">{errors.checkbox}</span>}
          </div>
        </div>

        <div className="oath-actions">
          <button 
            className="oath-btn oath-btn-disagree" 
            onClick={handleDisagree}
          >
            {t.oath?.disagree || 'असहमत / Disagree'}
          </button>
          <button 
            className="oath-btn oath-btn-agree" 
            onClick={handleAgree}
          >
            {t.oath?.agree || 'सहमत / Agree'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OathModal;
