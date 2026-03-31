import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import DigitalIDCard from '../components/DigitalIDCard';
import './MemberProfile.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const MemberProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/users/id-card/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        setError('Member not found');
      }
    } catch (err) {
      console.error('Error fetching member profile:', err);
      setError('Failed to load member profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (loading) {
    return (
      <div className="member-profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading member profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="member-profile-container">
        <div className="error-card">
          <h2>❌ {error || 'Member not found'}</h2>
          <p>The QR code you scanned is invalid or the member doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="member-profile-qr-page">
      <div className="member-profile-qr-header">
        <h1>मौनस परिवार</h1>
        <p>Maunas Parivar — Verified Member ID Card</p>
      </div>

      <DigitalIDCard user={user} />

      <div className="member-profile-qr-footer">
        <p>✓ This is an official verified member card of Maunas Parivar.</p>
      </div>
    </div>
  );
};

export default MemberProfile;
