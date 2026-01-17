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
    const width = 1050;
    const height = 675;
    console.log('📐 Canvas dimensions:', width, 'x', height);
    
    const cnv = createCanvas(width, height);
    console.log('✅ Canvas created successfully');
    
    const ctx = cnv.getContext('2d');
    console.log('✅ Canvas context obtained');

    // ===== PROFESSIONAL CARD DESIGN =====
    
    // Main background - Professional gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#1a3a52');
    bgGradient.addColorStop(1, '#0f2940');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle accent stripe on left
    ctx.fillStyle = '#e94560';
    ctx.fillRect(0, 0, 8, height);

    // ===== TOP SECTION - HEADER =====
    
    // White header background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, 90);

    // Organization Name (Top left)
    ctx.fillStyle = '#0f2940';
    ctx.font = 'bold 28px "Arial", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('MAUNAS PARIVAR', 25, 45);

    // Card Type (Top right)
    ctx.fillStyle = '#e94560';
    ctx.font = 'bold 14px "Arial", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('DIGITAL MEMBER ID CARD', width - 25, 45);

    // Thin divider line
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 65);
    ctx.lineTo(width - 20, 65);
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
    const infoY = 120;
    const colWidth = (width - infoX - 30);
    
    // Information boxes background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(infoX, infoY, colWidth, photoSize - 10);

    // Info title background
    ctx.fillStyle = '#e94560';
    ctx.fillRect(infoX, infoY, colWidth, 30);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('MEMBER INFORMATION', infoX + 10, infoY + 20);

    // Information details
    const lineSpacing = 28;
    let detailY = infoY + 45;
    
    // Helper function to draw info line
    const drawInfoLine = (label, value) => {
      ctx.fillStyle = '#666666';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(label, infoX + 10, detailY);
      
      ctx.fillStyle = '#0f2940';
      ctx.font = '12px Arial';
      ctx.fillText(value.substring(0, 35), infoX + 110, detailY);
      
      detailY += lineSpacing;
    };

    // Member details
    drawInfoLine('NAME:', user.fullName);
    drawInfoLine('FATHER\'S NAME:', user.fatherName);
    
    const dob = new Date(user.dateOfBirth).toLocaleDateString('en-IN');
    drawInfoLine('DATE OF BIRTH:', dob);
    
    ctx.fillStyle = '#e94560';
    ctx.font = 'bold 12px Arial';
    drawInfoLine('MEMBERSHIP TIER:', user.membershipTier.toUpperCase());

    // ===== BOTTOM SECTION - ID & VALIDITY =====
    
    // Unique ID generation
    const uniqueId = `MP-${user.phone.slice(-6).toUpperCase()}-${user._id.toString().slice(-4).toUpperCase()}`;
    
    // ID Card Number box
    ctx.fillStyle = '#e94560';
    ctx.fillRect(0, height - 70, width, 70);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`ID: ${uniqueId}`, width / 2, height - 35);

    // Validity dates
    const approvedDate = user.approvedAt ? new Date(user.approvedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Issued: ${approvedDate}`, 30, height - 15);

    ctx.textAlign = 'right';
    ctx.fillText('Valid for 5 years', width - 30, height - 15);

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
