import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatusMessage('');

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.user);
        navigate('/');
      } else {
        if (data.code === 'PENDING') {
          setStatusMessage(language === 'en' 
            ? 'Your registration is pending approval. Please wait for admin verification.'
            : 'आपका पंजीकरण अनुमोदन के लिए लंबित है। कृपया व्यवस्थापक सत्यापन की प्रतीक्षा करें।'
          );
        } else if (data.code === 'REJECTED') {
          setError(data.message);
        } else {
          setError(language === 'en' 
            ? 'Phone number not registered. Please register first.'
            : 'फ़ोन नंबर पंजीकृत नहीं है। कृपया पहले पंजीकरण करें।'
          );
        }
      }
    } catch (err) {
      setError(language === 'en' 
        ? 'Connection error. Please try again.'
        : 'कनेक्शन त्रुटि। कृपया पुन: प्रयास करें।'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>{language === 'en' ? 'Member Login' : 'सदस्य लॉगिन'}</h1>
          <p>{language === 'en' 
            ? 'Login with your registered phone number' 
            : 'अपने पंजीकृत फ़ोन नंबर से लॉगिन करें'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="phone">
              {language === 'en' ? 'Phone Number' : 'फ़ोन नंबर'}
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={language === 'en' ? 'Enter your registered phone number' : 'अपना पंजीकृत फ़ोन नंबर दर्ज करें'}
              required
              pattern="[0-9]{10}"
              title={language === 'en' ? 'Please enter a valid 10-digit phone number' : 'कृपया 10 अंकों का फ़ोन नंबर दर्ज करें'}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {statusMessage && <div className="status-message">{statusMessage}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading 
              ? (language === 'en' ? 'Logging in...' : 'लॉगिन हो रहा है...')
              : (language === 'en' ? 'Login' : 'लॉगिन करें')
            }
          </button>
        </form>

        <div className="login-footer">
          <p>
            {language === 'en' ? "Don't have an account? " : "खाता नहीं है? "}
            <Link to="/membership#registration-form">{language === 'en' ? 'Register here' : 'यहां पंजीकरण करें'}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
