const canvas = require('canvas');
const { createCanvas, registerFont } = canvas;
const path = require('path');

// Generate Digital ID Card as JPG
const generateIDCard = async (user) => {
  try {
    console.log('🎨 Starting ID card generation for user:', user.fullName);
    
    // Create a canvas for ID card (3.5" x 2.25" at 300 DPI = 1050 x 675 pixels)
    const width = 1050;
    const height = 675;
    console.log('📐 Canvas dimensions:', width, 'x', height);
    
    const cnv = createCanvas(width, height);
    console.log('✅ Canvas created successfully');
    
    const ctx = cnv.getContext('2d');
    console.log('✅ Canvas context obtained');

    // Gradient background - Professional blue to purple
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0f3460');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // White accent band at top
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, 80);

    // Logo/Organization Name
    ctx.fillStyle = '#0f3460';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MAUNAS PARIVAR', width / 2, 50);

    // ID Card title
    ctx.fillStyle = '#e94560';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Digital Member ID', width / 2, 130);

    // Divider line
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(width - 100, 150);
    ctx.stroke();

    // Create unique ID (based on phone number)
    const uniqueId = `MP-${user.phone.slice(-6).toUpperCase()}-${user._id.toString().slice(-4).toUpperCase()}`;

    // Left side - Photo placeholder (200x250px)
    const photoX = 60;
    const photoY = 170;
    const photoSize = 150;

    // Photo background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(photoX, photoY, photoSize, photoSize);

    // Add border to photo area
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 3;
    ctx.strokeRect(photoX, photoY, photoSize, photoSize);

    // Photo placeholder text
    ctx.fillStyle = '#999999';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PHOTO', photoX + photoSize / 2, photoY + photoSize / 2);

    // Right side - User Information
    const infoX = photoX + photoSize + 40;
    const infoStartY = 170;
    let currentY = infoStartY;
    const lineHeight = 35;

    // Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('NAME', infoX, currentY);
    ctx.font = '14px Arial';
    ctx.fillText(user.fullName.substring(0, 25), infoX + 150, currentY);
    currentY += lineHeight;

    // Father's Name
    ctx.font = 'bold 16px Arial';
    ctx.fillText("FATHER'S NAME", infoX, currentY);
    ctx.font = '14px Arial';
    ctx.fillText(user.fatherName.substring(0, 22), infoX + 150, currentY);
    currentY += lineHeight;

    // Date of Birth
    const dob = new Date(user.dateOfBirth).toLocaleDateString('en-IN');
    ctx.font = 'bold 16px Arial';
    ctx.fillText('DATE OF BIRTH', infoX, currentY);
    ctx.font = '14px Arial';
    ctx.fillText(dob, infoX + 150, currentY);
    currentY += lineHeight;

    // Membership Tier
    ctx.font = 'bold 16px Arial';
    ctx.fillText('MEMBERSHIP', infoX, currentY);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#e94560';
    ctx.fillText(user.membershipTier.toUpperCase(), infoX + 150, currentY);
    currentY += lineHeight;

    // ID Card Number at bottom
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`ID: ${uniqueId}`, width / 2, height - 40);

    // Validation date
    const approvedDate = user.approvedAt ? new Date(user.approvedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    ctx.fillStyle = '#cccccc';
    ctx.font = '12px Arial';
    ctx.fillText(`Valid from: ${approvedDate}`, width / 2, height - 15);

    // Convert canvas to buffer
    console.log('🖼️ Converting canvas to JPEG buffer...');
    const buffer = cnv.toBuffer('image/jpeg', { quality: 0.95 });
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
