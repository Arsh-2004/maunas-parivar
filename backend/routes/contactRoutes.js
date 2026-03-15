const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, ''); // strip spaces from App Password
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: pass
    }
  });
};

// GET /api/contact/test-email - Admin test to verify email works
router.get('/test-email', async (req, res) => {
  const adminPassword = req.headers['x-admin-password'];
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const transporter = createTransporter();
    await transporter.verify();
    await transporter.sendMail({
      from: `"Maunas Parivar" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Email Test - Maunas Parivar',
      text: 'This is a test email to confirm your email configuration is working correctly.'
    });
    res.json({ success: true, message: 'Test email sent successfully to ' + process.env.ADMIN_EMAIL });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ success: false, message: err.message, code: err.code });
  }
});

// POST /api/contact - Submit contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    console.log('📨 Contact form submission from IP:', req.clientIp);
    console.log('📨 Form data received:', { name, email, phone, subject });

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all required fields',
        missingFields: {
          name: !name,
          email: !email,
          subject: !subject,
          message: !message
        }
      });
    }

    // Save to MongoDB
    const contact = new Contact({ 
      name, 
      email, 
      phone, 
      subject, 
      message,
      submittedAt: new Date(),
      submittedFromIp: req.clientIp
    });
    await contact.save();
    console.log('✅ Contact message saved to DB:', contact._id);

    // Send email notification if email credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.ADMIN_EMAIL) {
      try {
        const transporter = createTransporter();

        // Email to admin
        await transporter.sendMail({
          from: `"Maunas Parivar Website" <${process.env.EMAIL_USER}>`,
          to: process.env.ADMIN_EMAIL,
          subject: `New Contact Message: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #e07b39; border-bottom: 2px solid #e07b39; padding-bottom: 10px;">New Contact Message</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name:</td><td style="padding: 8px;">${name}</td></tr>
                <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px;">${phone || 'Not provided'}</td></tr>
                <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold; color: #555;">Subject:</td><td style="padding: 8px;">${subject}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; color: #555; vertical-align: top;">Message:</td><td style="padding: 8px;">${message.replace(/\n/g, '<br>')}</td></tr>
                <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold; color: #555;">Received At:</td><td style="padding: 8px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
              </table>
            </div>
          `
        });

        console.log('✅ Admin notification email sent');

        // Auto-reply to sender
        await transporter.sendMail({
          from: `"Kshatriya Maunas Parivar" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'We received your message - Kshatriya Maunas Parivar',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #e07b39;">Thank you, ${name}!</h2>
              <p>We have received your message and will get back to you soon.</p>
              <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #e07b39; margin: 20px 0;">
                <p><strong>Your message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              <p style="color: #888; font-size: 13px;">— Kshatriya Maunas Parivar Team</p>
            </div>
          `
        });

        console.log('✅ Auto-reply email sent to:', email);

      } catch (emailErr) {
        console.error('❌ Email sending failed (message still saved to DB):', {
          message: emailErr.message,
          code: emailErr.code,
          emailUser: process.env.EMAIL_USER
        });
        // Message is already saved to DB, don't fail the request
      }
    } else {
      console.warn('⚠️ Email credentials not configured - skipping email notifications');
    }

    res.json({ 
      success: true, 
      message: 'Message submitted successfully',
      contactId: contact._id
    });
  } catch (error) {
    console.error('❌ Contact form error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      ip: req.clientIp
    });
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: ' + messages.join(', '),
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit message. Please try again later.',
      code: 'CONTACT_FAILED'
    });
  }
});

module.exports = router;
