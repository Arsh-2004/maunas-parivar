import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MemberProfile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MemberProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
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
  };

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
    <div className="member-profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="org-logo">
            <h1>मौनस परिवार</h1>
            <p>Maunas Parivar</p>
          </div>
          <div className="verified-badge">
            <span>✓</span> Verified Member
          </div>
        </div>

        <div className="profile-photo-section">
          {user.photoPath ? (
            <img src={user.photoPath} alt={user.fullName} className="profile-photo" />
          ) : (
            <div className="profile-photo-placeholder">
              <span>👤</span>
            </div>
          )}
          <div className="membership-badge">
            {user.membershipTier === 'diamond' ? '💎 DIAMOND' :
             user.membershipTier === 'gold' ? '🥇 GOLD' :
             '🥈 SILVER'}
          </div>
        </div>

        <div className="profile-name">
          <h2>{user.fullName}</h2>
          <p className="member-id">Member ID: {user._id.slice(-8).toUpperCase()}</p>
        </div>

        <div className="profile-details">
          <div className="detail-section">
            <h3>📋 Personal Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Father's Name:</span>
                <span className="value">{user.fatherName}</span>
              </div>
              <div className="detail-item">
                <span className="label">Date of Birth:</span>
                <span className="value">{new Date(user.dateOfBirth).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="detail-item">
                <span className="label">Gender:</span>
                <span className="value">{user.gender}</span>
              </div>
              <div className="detail-item">
                <span className="label">Occupation:</span>
                <span className="value">{user.occupation}</span>
              </div>
              <div className="detail-item">
                <span className="label">Education:</span>
                <span className="value">{user.education}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>📞 Contact Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span className="value">{user.phone}</span>
              </div>
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>📍 Address Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Village:</span>
                <span className="value">{user.village}</span>
              </div>
              <div className="detail-item">
                <span className="label">Block:</span>
                <span className="value">{user.block}</span>
              </div>
              <div className="detail-item">
                <span className="label">Tehsil:</span>
                <span className="value">{user.tehsil}</span>
              </div>
              <div className="detail-item">
                <span className="label">District:</span>
                <span className="value">{user.district}</span>
              </div>
              <div className="detail-item">
                <span className="label">City:</span>
                <span className="value">{user.city}</span>
              </div>
              <div className="detail-item">
                <span className="label">State:</span>
                <span className="value">{user.state}</span>
              </div>
              <div className="detail-item">
                <span className="label">Pincode:</span>
                <span className="value">{user.pincode}</span>
              </div>
              <div className="detail-item full-width">
                <span className="label">Address:</span>
                <span className="value">{user.address}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>📅 Membership Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className={`status-badge ${user.status}`}>{user.status.toUpperCase()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Registered On:</span>
                <span className="value">{new Date(user.registeredAt).toLocaleDateString('en-IN')}</span>
              </div>
              {user.approvedAt && (
                <div className="detail-item">
                  <span className="label">Approved On:</span>
                  <span className="value">{new Date(user.approvedAt).toLocaleDateString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-footer">
          <p>This is an official verified member of Maunas Parivar organization.</p>
          <p className="scanned-info">✓ QR Code Scanned Successfully</p>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
