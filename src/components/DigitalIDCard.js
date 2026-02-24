import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import './DigitalIDCard.css';

const DigitalIDCard = ({ user }) => {
  const qrRef = useRef();

  if (!user) {
    return <div className="id-card-container">User data not available</div>;
  }

  // Generate unique URL for QR code - points to web page showing user profile
  const frontendURL = window.location.origin;
  const qrValue = `${frontendURL}/member-profile/${user._id}`;

  // Detect if user is on mobile device
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
  };

  const downloadIDCard = async () => {
    const isMobile = isMobileDevice();
    
    try {
      // On mobile capture only front face; on desktop capture full side-by-side
      const cardElement = isMobile
        ? document.querySelector('#id-card-capture-target .id-card-front-face')
        : document.getElementById('id-card-capture-target');
      
      if (!cardElement) {
        alert('Card element not found');
        return;
      }

      // Show loading message
      const loadingMsg = document.createElement('div');
      loadingMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        z-index: 10000;
        font-size: 16px;
        text-align: center;
      `;
      loadingMsg.innerHTML = isMobile ?
        '⏳ Generating ID Card...<br><small>Please wait</small>' :
        '⏳ Preparing download...';
      document.body.appendChild(loadingMsg);

      // Wait for images to load
      const images = cardElement.getElementsByTagName('img');
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the whole side-by-side card in one shot
      // Use scrollWidth/scrollHeight to capture full content (fixes text clipping)
      const capturedCanvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        width: cardElement.scrollWidth,
        height: cardElement.scrollHeight,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
      });

      document.body.removeChild(loadingMsg);

      // Convert canvas to data URL
      const imageDataUrl = capturedCanvas.toDataURL('image/png', 1.0);

      if (isMobile) {
        // MOBILE: Open in new tab so user can long-press and save
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
              <title>Maunas Parivar ID Card - ${user.fullName}</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  background: #f0f0f0;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  font-family: Arial, sans-serif;
                }
                .instruction {
                  background: #4CAF50;
                  color: white;
                  padding: 15px 20px;
                  border-radius: 10px;
                  margin-bottom: 20px;
                  text-align: center;
                  max-width: 90%;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .instruction strong {
                  display: block;
                  font-size: 18px;
                  margin-bottom: 5px;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                  border-radius: 10px;
                  background: white;
                }
                .download-btn {
                  background: #2196F3;
                  color: white;
                  border: none;
                  padding: 15px 30px;
                  font-size: 16px;
                  border-radius: 8px;
                  margin-top: 20px;
                  cursor: pointer;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                  display: inline-flex;
                  align-items: center;
                  gap: 10px;
                }
                .download-btn:active {
                  transform: scale(0.95);
                }
              </style>
            </head>
            <body>
              <div class="instruction">
                <strong>📱 How to Save:</strong>
                Long press (tap and hold) on the image below, then select "Save Image" or "Download Image"
              </div>
              <img src="${imageDataUrl}" alt="Maunas Parivar ID Card - ${user.fullName}" />
              <button class="download-btn" onclick="tryDownload()">
                <span>📥</span>
                <span>Download Image</span>
              </button>
              <script>
                function tryDownload() {
                  const link = document.createElement('a');
                  link.href = "${imageDataUrl}";
                  link.download = "Maunas-Parivar-ID-Card-${user.fullName.replace(/\s+/g, '-')}-${user.phone}.png";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              </script>
            </body>
            </html>
          `);
          newWindow.document.close();
          
          // Show success message
          setTimeout(() => {
            alert('✅ ID Card opened in new tab!\n\nTo save:\n1. Long press the image\n2. Select "Save Image" or "Download Image"\n\nOR tap the Download button at the bottom.');
          }, 500);
        } else {
          // Popup blocked - try alternative
          alert('⚠️ Please allow popups for this site.\n\nAlternatively, try downloading from a desktop browser.');
        }
      } else {
        // DESKTOP: Direct download
        capturedCanvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Maunas-Parivar-ID-Card-${user.fullName.replace(/\s+/g, '-')}-${user.phone}.png`;
          document.body.appendChild(link);
          link.click();

          // Cleanup
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 100);

          alert('✅ ID Card downloaded successfully!');
        }, 'image/png', 1.0);
      }

    } catch (error) {
      console.error('Download error:', error);
      // Remove loading message if exists
      const loadingMsg = document.querySelector('div[style*="position: fixed"]');
      if (loadingMsg && loadingMsg.parentNode) {
        loadingMsg.parentNode.removeChild(loadingMsg);
      }
      
      if (isMobile) {
        alert('❌ Unable to generate ID card.\n\nPlease try:\n1. Refreshing the page\n2. Using a different browser\n3. Checking your internet connection');
      } else {
        alert('❌ Unable to download ID card. Please try again or contact support.');
      }
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
        {/* Side-by-Side Card */}
        <div className="id-card-side-by-side" id="id-card-capture-target">
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
                  <span className="id-detail-value">
                    <span className="id-tier-badge">
                      {user.membershipTier === 'diamond' ? '💎 DIAMOND' :
                       user.membershipTier === 'gold' ? '🥇 GOLD' :
                       user.membershipTier === 'silver' ? '🥈 SILVER' :
                       user.membershipTier === 'bronze' ? '🥉 BRONZE' :
                       user.membershipTier === 'general' ? '🌟 GENERAL' : '🥈 SILVER'}
                    </span>
                  </span>
                </div>
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
                <p className="id-qr-text">Scan to View Full Profile</p>
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
                  <span className="id-detail-label">पता/Address</span>
                  <span className="id-detail-value id-detail-address">
                    {[user.village, user.block, user.tehsil, user.district, user.city, user.state, user.pincode]
                      .filter(Boolean)
                      .join(', ') || 'N/A'}
                  </span>
                </div>
                <div className="id-back-detail-row">
                  <span className="id-detail-label">सदस्य ID</span>
                  <span className="id-detail-value">{user._id ? user._id.slice(-8).toUpperCase() : 'N/A'}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="id-card-actions">
          <button 
            onClick={downloadIDCard}
            className="id-btn id-btn-download"
            title={/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 
              "Will open in new tab - Long press image to save" : 
              "Download ID Card (both sides)"}
          >
            <span>📥</span> {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 
              'Get ID Card (Mobile)' : 
              'Download ID Card'}
          </button>
        </div>

        <div className="id-card-info-box">
          <h4>ℹ️ How to Use Your ID Card:</h4>
          <ul>
            <li>💾 <strong>Download:</strong> {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 
              'Tap button to open in new tab, then long-press image and select "Save Image"' : 
              'Get both front and back sides in one image'}</li>
            <li>� <strong>QR Code:</strong> Anyone can scan the QR on the right side to view your full verified profile</li>
          </ul>
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
