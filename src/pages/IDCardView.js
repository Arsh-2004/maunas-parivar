import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DigitalIDCard from '../components/DigitalIDCard';
import './IDCardView.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const IDCardView = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/users/id-card/${userId}`);
        const data = await response.json();

        if (data.success && data.user) {
          setUser(data.user);
          setError(null);
        } else {
          setError(data.message || 'User not found');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="id-card-view-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading ID Card...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="id-card-view-container">
        <div className="error-message">
          <h2>❌ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="id-card-view-container">
      <div className="id-card-view-header">
        <h1>📋 Member Profile - Digital ID Card</h1>
        <p className="subtitle">स्कैन किए गए QR कोड से सदस्य की जानकारी</p>
      </div>

      {user && <DigitalIDCard user={user} />}

      <div className="id-card-view-footer">
        <p className="footer-text">
          यह डिजिटल ID कार्ड मौनस परिवार का आधिकारिक सदस्य प्रमाण पत्र है।
        </p>
        <p className="footer-text">
          This Digital ID Card is an official member certificate of Maunas Parivar.
        </p>
      </div>
    </div>
  );
};

export default IDCardView;
