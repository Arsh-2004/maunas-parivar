const canvas = require('canvas');
const { createCanvas, registerFont } = canvas;
const path = require('path');
const http = require('http');
const https = require('https');

// Helper function to load image from URL
const loadImageFromUrl = (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const { Image } = require('canvas');
    
    protocol.get(url, (response) => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        try {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = Buffer.concat(chunks);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
};

// Generate Digital ID Card as JPG
const generateIDCard = async (user) => {
  try {
    console.log('🎨 Starting ID card generation for user:', user.fullName);
    
    // Create a canvas for ID card - Professional size (3.5" x 2.25" at 300 DPI = 1050 x 675 pixels)
    const width = 2100;
    const height = 675;
    const half = 1050;
    console.log('📐 Canvas dimensions:', width, 'x', height);
    
    const cnv = createCanvas(width, height);
    console.log('✅ Canvas created successfully');
    
    const ctx = cnv.getContext('2d');
    console.log('✅ Canvas context obtained');

    // ===== PROFESSIONAL CARD DESIGN =====
    
    // Main background - left half only (front face)
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#1a3a52');
    bgGradient.addColorStop(1, '#0f2940');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, half, height);

    // ===== RIGHT HALF BACKGROUND (Back Face) =====
    const bgGradientBack = ctx.createLinearGradient(half, 0, half, height);
    bgGradientBack.addColorStop(0, '#f093fb');
    bgGradientBack.addColorStop(1, '#f5576c');
    ctx.fillStyle = bgGradientBack;
    ctx.fillRect(half, 0, half, height);

    // Divider line between front and back
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(half - 1, 0, 3, height);

    // Add subtle accent stripe on left (front face only)
    ctx.fillStyle = '#e94560';
    ctx.fillRect(0, 0, 8, height);

    // ===== TOP SECTION - FRONT HEADER =====
    
    // White header background (front half only)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, half, 85);

    // Organization Name (Top left)
    ctx.fillStyle = '#0f2940';
    ctx.font = 'bold 26px "Arial", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('MAUNAS PARIVAR', 20, 40);

    // Card Type (Top right) - smaller and cleaner
    ctx.fillStyle = '#999999';
    ctx.font = '11px "Arial", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Member ID Card', width - 20, 35);

    // Thin divider line (front half only)
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 60);
    ctx.lineTo(half - 20, 60);
    ctx.stroke();

    // ===== MIDDLE SECTION - PHOTO & INFO =====
    
    const photoX = 30;
    const photoY = 110;
    const photoSize = 180;
    
    // Load and draw user photo if available
    if (user.photoPath) {
      try {
        console.log('📸 Loading user photo from:', user.photoPath);
        const img = await loadImageFromUrl(user.photoPath);
        
        // Draw photo with border
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(photoX - 3, photoY - 3, photoSize + 6, photoSize + 6);
        
        ctx.save();
        // Clip to square for circular-like effect
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(photoX, photoY, photoSize, photoSize);
        ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
        ctx.restore();
      } catch (photoError) {
        console.log('⚠️ Could not load photo, using placeholder:', photoError.message);
        // Draw placeholder
        ctx.fillStyle = '#e8e8e8';
        ctx.fillRect(photoX, photoY, photoSize, photoSize);
        ctx.fillStyle = '#999999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PHOTO', photoX + photoSize / 2, photoY + photoSize / 2 + 10);
      }
    } else {
      // Draw placeholder if no photo
      ctx.fillStyle = '#e8e8e8';
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
      ctx.fillStyle = '#999999';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('NO PHOTO', photoX + photoSize / 2, photoY + photoSize / 2);
    }

    // Photo border
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 2;
    ctx.strokeRect(photoX - 3, photoY - 3, photoSize + 6, photoSize + 6);

    // ===== RIGHT SECTION - USER INFORMATION =====
    
    const infoX = photoX + photoSize + 40;
    const infoY = 115;
    const colWidth = (half - infoX - 30);
    
    // Information box background - cleaner design
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(infoX, infoY, colWidth, photoSize + 5);
    
    // Subtle border
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(infoX, infoY, colWidth, photoSize + 5);

    // Info title with minimal styling
    ctx.fillStyle = '#0f2940';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('MEMBER DETAILS', infoX + 10, infoY + 18);

    // Information details
    const lineSpacing = 32;
    let detailY = infoY + 50;
    
    // Helper function to draw info line with proper spacing
    const drawInfoLine = (label, value) => {
      ctx.fillStyle = '#666666';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(label, infoX + 10, detailY);
      
      ctx.fillStyle = '#0f2940';
      ctx.font = '11px Arial';
      ctx.fillText(value.substring(0, 32), infoX + 100, detailY);
      
      detailY += lineSpacing;
    };

    // Member details
    drawInfoLine('NAME:', user.fullName);
    drawInfoLine('FATHER\'S NAME:', user.fatherName);
    
    const dob = new Date(user.dateOfBirth).toLocaleDateString('en-IN');
    drawInfoLine('DATE OF BIRTH:', dob);
    
    // Membership status on separate line with better formatting
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('MEMBERSHIP:', infoX + 10, detailY);
    
    ctx.fillStyle = '#e94560';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('MEMBER', infoX + 100, detailY);

    // ===== BOTTOM SECTION - ID & VALIDITY (Front Half) =====
    
    // Unique ID generation
    const uniqueId = `MP-${user.phone.slice(-6).toUpperCase()}-${user._id.toString().slice(-4).toUpperCase()}`;
    
    // Clean footer with subtle background (front half only)
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, height - 65, half, 65);
    
    // Red accent line (front)
    ctx.fillStyle = '#e94560';
    ctx.fillRect(0, height - 65, half, 3);
    
    // ID Card Number - centered in front half
    ctx.fillStyle = '#0f2940';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`ID: ${uniqueId}`, half / 2, height - 35);

    // Validity info
    const approvedDate = user.approvedAt ? new Date(user.approvedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    ctx.fillStyle = '#999999';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Issued: ${approvedDate}`, 20, height - 10);
    ctx.textAlign = 'right';
    ctx.fillText('Valid for 5 years', half - 20, height - 10);

    // ===== BACK PANEL (Right Half) =====

    // Back header
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(half + 0, 0, half, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('\u0938\u0926\u0938\u094d\u092f \u0935\u093f\u0935\u0930\u0923', half + half / 2, 40);

    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('Member Information', half + half / 2, 65);

    // Divider under back header
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(half + 30, 80);
    ctx.lineTo(half + half - 30, 80);
    ctx.stroke();

    // QR placeholder circle
    const qrX = half + half / 2;
    const qrY = 220;
    const qrR = 90;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.arc(qrX, qrY, qrR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#f5576c';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR CODE', qrX, qrY - 10);
    ctx.font = '11px Arial';
    ctx.fillText('Scan on App', qrX, qrY + 10);
    ctx.fillStyle = 'rgba(245,87,108,0.5)';
    ctx.font = '10px Arial';
    ctx.fillText('to view profile', qrX, qrY + 28);

    // Back details
    const backDetailX = half + 30;
    let backDetailY = 360;
    const backLineH = 42;

    const drawBackLine = (label, value) => {
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(backDetailX, backDetailY - 18, half - 60, 36);

      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(label, backDetailX + 10, backDetailY + 4);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(String(value || 'N/A').substring(0, 30), backDetailX + half - 90, backDetailY + 4);

      backDetailY += backLineH;
    };

    const dobFormatted = user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-IN') : 'N/A';
    drawBackLine('\u092a\u093f\u0924\u093e / Father', user.fatherName);
    drawBackLine('\u091c\u0928\u094d\u092e / DOB', dobFormatted);
    drawBackLine('\u0936\u0939\u0930 / City', user.city);
    drawBackLine('\u0930\u093e\u091c\u094d\u092f / State', user.state);
    drawBackLine('\u0938\u0926\u0938\u094d\u092f ID', uniqueId);

    // Convert canvas to buffer
    console.log('🖼️ Converting canvas to JPEG buffer...');
    const buffer = cnv.toBuffer('image/jpeg', { quality: 0.92 });
    console.log('✅ Buffer created, size:', buffer.length, 'bytes');
    return buffer;
  } catch (error) {
    console.error('❌ Error generating ID card:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

module.exports = {
  generateIDCard
};
