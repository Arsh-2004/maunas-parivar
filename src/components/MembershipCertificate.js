import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import './MembershipCertificate.css';

const MembershipCertificate = ({ user, onClose }) => {
  const certRef = useRef();

  if (!user) return null;

  const memberSince = user.approvedAt
    ? new Date(user.approvedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date(user.registeredAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const memberId = user._id ? user._id.slice(-8).toUpperCase() : 'N/A';

  const downloadCertificate = async () => {
    try {
      const el = certRef.current;
      if (!el) return;

      // Hide the close button before capture, restore after
      const closeBtn = el.querySelector('.cert-close-btn');
      if (closeBtn) closeBtn.style.visibility = 'hidden';

      // Wait one frame so the hide takes effect
      await new Promise((r) => requestAnimationFrame(r));

      const canvas = await html2canvas(el, {
        backgroundColor: '#fffdf6',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: -window.pageXOffset,
        scrollY: -window.pageYOffset,
      });

      if (closeBtn) closeBtn.style.visibility = '';

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Maunas-Parivar-Certificate-${user.fullName.replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      }, 'image/png', 1.0);
    } catch (err) {
      console.error('Certificate download error:', err);
      alert('Certificate download failed. Please try again.');
    }
  };

  return (
    <div className="cert-overlay" onClick={onClose}>
      <div className="cert-modal-wrap" onClick={(e) => e.stopPropagation()}>

        {/* ── The Printable Certificate ── */}
        <div className="cert-paper" ref={certRef}>
          <button className="cert-close-btn" onClick={onClose}>×</button>
          {/* Outer decorative border */}
          <div className="cert-outer-border">
            <div className="cert-inner-border">

              {/* Header */}
              <div className="cert-header">
                <div className="cert-logo-row">
                  <span className="cert-logo-icon">🏵️</span>
                  <div className="cert-org-block">
                    <h1 className="cert-org-name">मौनस परिवार</h1>
                    <p className="cert-org-tagline">Maunas Parivar — एकता, विरासत, प्रगति</p>
                  </div>
                  <span className="cert-logo-icon">🏵️</span>
                </div>
                <div className="cert-title-band">
                  <span className="cert-title-text">सदस्यता प्रमाण-पत्र</span>
                  <span className="cert-title-en">CERTIFICATE OF MEMBERSHIP</span>
                </div>
              </div>

              {/* Body */}
              <div className="cert-body">
                <p className="cert-intro">यह प्रमाणित किया जाता है कि</p>
                <p className="cert-member-name">{user.fullName}</p>
                <p className="cert-member-meta">
                  पुत्र/पुत्री: <strong>{user.fatherName || '—'}</strong>
                  &nbsp;|&nbsp;
                  निवास: <strong>{[user.village, user.district, user.state].filter(Boolean).join(', ') || '—'}</strong>
                </p>
                <p className="cert-member-id-line">
                  सदस्यता संख्या: <span className="cert-member-id">{memberId}</span>
                </p>

                <div className="cert-divider"><span>✦</span></div>

                <p className="cert-body-text">
                  मौनस परिवार के एक सम्माननीय सदस्य के रूप में विधिवत रूप से स्वीकृत एवं पंजीकृत किए जाते हैं।
                  यह परिवार अपनी गौरवशाली विरासत, सामाजिक एकता एवं सामूहिक प्रगति के संकल्प के साथ
                  समाज-निर्माण के पथ पर अग्रसर है।
                </p>

                <p className="cert-body-text">
                  हम सब मिलकर अपने पूर्वजों की धरोहर को संरक्षित करते हुए, अपने समुदाय एवं समाज के
                  उत्थान के लिए समर्पित हैं — शिक्षा, स्वास्थ्य, और सांस्कृतिक चेतना के माध्यम से
                  एक सशक्त, स्वाभिमानी एवं समृद्ध परिवार की नींव को और सुदृढ़ करते रहेंगे।
                </p>

                <p className="cert-body-text">
                  <em>
                    "एकता में शक्ति है, विरासत में पहचान है, और प्रगति में हमारा भविष्य है।"
                  </em>
                </p>

                <div className="cert-divider"><span>✦</span></div>

                <p className="cert-date-line">
                  सदस्यता दिनांक: <strong>{memberSince}</strong>
                </p>
              </div>

              {/* Footer / Signatures */}
              <div className="cert-footer">
                <div className="cert-sig-block">
                  <div className="cert-sig-line"></div>
                  <p className="cert-sig-label">संचालक</p>
                  <p className="cert-sig-name">मौनस परिवार</p>
                </div>
                <div className="cert-sig-block">
                  <div className="cert-sig-line"></div>
                  <p className="cert-sig-label">सदस्यता दिनांक</p>
                  <p className="cert-sig-name">{memberSince}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Action buttons below the certificate */}
        <div className="cert-actions">
          <button className="cert-download-btn" onClick={downloadCertificate}>
            📥 प्रमाण-पत्र डाउनलोड करें
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipCertificate;
