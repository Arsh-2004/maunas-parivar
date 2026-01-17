import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import './DigitalIDCard.css';

const DigitalIDCard = ({ user }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const qrRef = useRef();

  if (!user) {
    return <div className="id-card-container">User data not available</div>;
  }

  // Generate unique URL for QR code
  const qrValue = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/id-card/${user._id}`;

  const downloadIDCard = async () => {
    try {
      // Get the card flipper element
      const cardElement = document.querySelector('.id-card-flipper');
      
      if (!cardElement) {
        alert('Card element not found');
        return;
      }

      // Ensure card is showing front side before download
      if (isFlipped) {
        setIsFlipped(false);
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Capture the card as an image
      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Maunas-Parivar-ID-${user.phone || user._id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('ID Card downloaded successfully!');
      });

    } catch (error) {
      console.error('Download error:', error);
      alert('Unable to download ID card. Please try again.');
    }
  };

  return (
    <div className="digital-id-card-section">
      <div className="id-card-header-section">
        <h2 className="id-card-main-title">
          <span className="id-icon">🆔</span>
          <span>डिजिटल आईडी कार्ड</span>
          <span className="en-text">Digital ID Card</span>
        </h2>
        <p className="id-card-subtitle">आपका आधिकारिक सदस्य प्रमाण पत्र | Your Official Member Certificate</p>
      </div>

      <div className="id-card-display-container">
        {/* 3D Flip Card */}
        <div 
          className={`id-card-flipper ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front Side */}
          <div className="id-card-face id-card-front-face">
            <div className="id-card-bg-gradient"></div>
            <div className="id-card-content-front">
              <div className="id-card-org-header">
                <h3 className="id-org-name">मौनस परिवार</h3>
                <p className="id-org-subtitle">Maunas Parivar</p>
                <p className="id-card-type-label">MEMBER IDENTITY CARD</p>
              </div>

              <div className="id-card-photo-section">
                {user.photoPath ? (
                  <img 
                    src={user.photoPath} 
                    alt={user.fullName} 
                    className="id-member-photo"
                  />
                ) : (
                  <div className="id-photo-placeholder">
                    <span>📷</span>
                  </div>
                )}
              </div>

              <div className="id-card-member-details">
                <div className="id-detail-row">
                  <span className="id-detail-label">नाम/Name</span>
                  <span className="id-detail-value">{user.fullName}</span>
                </div>
                <div className="id-detail-row">
                  <span className="id-detail-label">फोन/Phone</span>
                  <span className="id-detail-value">{user.phone}</span>
                </div>
                <div className="id-detail-row">
                  <span className="id-detail-label">स्थिति/Status</span>
                  <span className="id-detail-value id-tier-badge">
                    {user.membershipTier === 'gold' ? '🥇 GOLD' : 
                     user.membershipTier === 'diamond' ? '💎 DIAMOND' : 
                     '🥈 SILVER'}
                  </span>
                </div>
              </div>

              <div className="id-card-flip-hint">
                <span>👆 Click to see back →</span>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="id-card-face id-card-back-face">
            <div className="id-card-bg-gradient-back"></div>
            <div className="id-card-content-back">
              <div className="id-back-header">
                <h4>सदस्य विवरण</h4>
                <p>Member Information</p>
              </div>

              <div className="id-qr-container">
                <QRCodeSVG 
                  ref={qrRef}
                  value={qrValue}
                  size={100}
                  level="H"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
                <p className="id-qr-text">Scan for Profile</p>
              </div>

              <div className="id-back-details">
                <div className="id-back-detail-row">
                  <span className="id-detail-label">पिता/Father</span>
                  <span className="id-detail-value">{user.fatherName || 'N/A'}</span>
                </div>
                <div className="id-back-detail-row">
                  <span className="id-detail-label">जन्म/DOB</span>
                  <span className="id-detail-value">
                    {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-IN') : 'N/A'}
                  </span>
                </div>
                <div className="id-back-detail-row">
                  <span className="id-detail-label">शहर/City</span>
                  <span className="id-detail-value">{user.city || 'N/A'}</span>
                </div>
                <div className="id-back-detail-row">
                  <span className="id-detail-label">जिला/District</span>
                  <span className="id-detail-value">{user.district || 'N/A'}</span>
                </div>
                <div className="id-back-detail-row">
                  <span className="id-detail-label">सदस्य ID</span>
                  <span className="id-detail-value">{user._id ? user._id.slice(-8).toUpperCase() : 'N/A'}</span>
                </div>
              </div>

              <div className="id-card-flip-hint">
                <span>← Click to see front</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="id-card-actions">
          <button 
            className="id-btn id-btn-flip"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <span>🔄</span> Flip Card
          </button>
          {user.idCardPath && (
            <button 
              onClick={downloadIDCard}
              className="id-btn id-btn-download"
            >
              <span>📥</span> Download Card
            </button>
          )}
        </div>
      </div>

      {user.idCardGeneratedAt && (
        <div className="id-card-footer">
          <p className="id-generated-info">
            📅 Generated: {new Date(user.idCardGeneratedAt).toLocaleDateString('en-IN')}
          </p>
        </div>
      )}
    </div>
  );
};

export default DigitalIDCard;
