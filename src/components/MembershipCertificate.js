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
    let offscreenWrap = null;
    try {
      const el = certRef.current;
      if (!el) return;

      const CERT_WIDTH = 860;

      const clone = el.cloneNode(true);

      // Remove the close button from the clone
      const closeBtn = clone.querySelector('.cert-close-btn');
      if (closeBtn) closeBtn.remove();

      offscreenWrap = document.createElement('div');
      offscreenWrap.style.cssText = `
        position: absolute;
        top: 0;
        left: -9999px;
        width: ${CERT_WIDTH}px;
        z-index: -9999;
        pointer-events: none;
      `;

      // Force inline styles on clone root
      clone.style.cssText = `
        position: relative;
        width: ${CERT_WIDTH}px;
        font-family: Georgia, 'Times New Roman', serif;
        background: #fffdf6;
        box-shadow: none;
        box-sizing: border-box;
        overflow: visible;
      `;

      const forceStyle = (selector, styles) => {
        const el = clone.querySelector(selector);
        if (el) Object.assign(el.style, styles);
      };

      forceStyle('.cert-outer-border', {
        padding: '14px',
        background: 'linear-gradient(135deg, #FF6B35, #F7931E, #e8820a, #FF6B35)',
        width: '100%',
        boxSizing: 'border-box',
        display: 'block',
      });

      forceStyle('.cert-inner-border', {
        background: '#fffdf6',
        border: '3px double #d4a017',
        padding: '28px 36px 24px',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'visible',
        width: '100%',
        display: 'block',
      });

      forceStyle('.cert-header', {
        textAlign: 'center',
        marginBottom: '18px',
        display: 'block',
      });

      forceStyle('.cert-logo-row', {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        marginBottom: '10px',
      });

      forceStyle('.cert-org-name', {
        margin: '0',
        fontSize: '2.4rem',
        fontWeight: '800',
        color: '#FF6B35',
        letterSpacing: '1px',
        lineHeight: '1.2',
        display: 'block',
      });

      forceStyle('.cert-org-tagline', {
        margin: '2px 0 0 0',
        fontSize: '0.78rem',
        color: '#888',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        fontFamily: 'Arial, sans-serif',
        display: 'block',
      });

      forceStyle('.cert-title-band', {
        background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
        color: 'white',
        padding: '10px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '4px',
        marginTop: '10px',
      });

      forceStyle('.cert-title-text', {
        fontSize: '1.35rem',
        fontWeight: '700',
        letterSpacing: '0.5px',
        color: 'white',
        display: 'block',
      });

      forceStyle('.cert-title-en', {
        fontSize: '0.7rem',
        letterSpacing: '3px',
        opacity: '0.9',
        fontFamily: 'Arial, sans-serif',
        fontWeight: '400',
        marginTop: '1px',
        color: 'white',
        display: 'block',
      });

      forceStyle('.cert-body', {
        textAlign: 'center',
        padding: '0 10px',
        display: 'block',
      });

      forceStyle('.cert-intro', {
        fontSize: '1rem',
        color: '#555',
        margin: '0 0 6px 0',
        display: 'block',
      });

      forceStyle('.cert-member-name', {
        fontSize: '2rem',
        fontWeight: '800',
        color: '#c85a10',
        margin: '4px auto 6px',
        letterSpacing: '0.5px',
        lineHeight: '1.3',
        padding: '6px 28px',
        background: '#fff3ec',
        borderRadius: '4px',
        display: 'block',
        borderBottom: '2px solid #d4a017',
        textAlign: 'center',
      });

      forceStyle('.cert-member-meta', {
        fontSize: '0.85rem',
        color: '#555',
        margin: '0 0 8px 0',
        fontFamily: 'Arial, sans-serif',
        display: 'block',
      });

      forceStyle('.cert-member-id-line', {
        fontSize: '0.82rem',
        color: '#777',
        margin: '0 0 12px 0',
        fontFamily: 'Arial, sans-serif',
        display: 'block',
      });

      forceStyle('.cert-member-id', {
        background: '#fff0e8',
        border: '1px solid #FF6B35',
        color: '#FF6B35',
        fontWeight: '700',
        borderRadius: '4px',
        padding: '2px 10px',
        letterSpacing: '2px',
        fontSize: '0.88rem',
        display: 'inline-block',
      });

      forceStyle('.cert-footer', {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: '22px',
        paddingTop: '14px',
        borderTop: '1.5px solid #e8d5b0',
      });

      forceStyle('.cert-seal-circle', {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        border: '3px solid #d4a017',
        background: '#fffbe6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '8px',
        boxSizing: 'border-box',
      });

      offscreenWrap.appendChild(clone);
      document.body.appendChild(offscreenWrap);

      // Wait two frames for full layout
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      // Use getBoundingClientRect for accurate rendered height (no whitespace)
      const rect = clone.getBoundingClientRect();
      const captureHeight = Math.ceil(rect.height) || clone.offsetHeight;

      const canvas = await html2canvas(clone, {
        backgroundColor: '#fffdf6',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: CERT_WIDTH,
        height: captureHeight,
        windowWidth: CERT_WIDTH,
        windowHeight: captureHeight,
        scrollX: 0,
        scrollY: 0,
      });

      document.body.removeChild(offscreenWrap);
      offscreenWrap = null;

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
      if (offscreenWrap && offscreenWrap.parentNode) {
        document.body.removeChild(offscreenWrap);
      }
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
                  <p className="cert-sig-label">राष्ट्रीय अध्यक्ष</p>
                  <p className="cert-sig-name">मौनस परिवार</p>
                </div>
                <div className="cert-seal">
                  <div className="cert-seal-circle">
                    <span className="cert-seal-icon">🔏</span>
                    <p className="cert-seal-text">मौनस परिवार<br/>आधिकारिक मुहर</p>
                  </div>
                </div>
                <div className="cert-sig-block">
                  <div className="cert-sig-line"></div>
                  <p className="cert-sig-label">राष्ट्रीय महासचिव</p>
                  <p className="cert-sig-name">मौनस परिवार</p>
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
          <button className="cert-print-btn" onClick={() => window.print()}>
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipCertificate;
