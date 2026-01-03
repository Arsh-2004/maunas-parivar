const express = require('express');
const router = express.Router();
const User = require('../models/User');
const upload = require('../middleware/upload');

// Register new user
router.post('/register', upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'donationDocument', maxCount: 1 }
]), async (req, res) => {
  try {
    // Check if phone number already exists
    const existingUser = await User.findOne({ phone: req.body.phone });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number already registered' 
      });
    }

    // Check if required files were uploaded
    if (!req.files || !req.files.idProof) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID proof document is required' 
      });
    }
    if (!req.files.addressProof) {
      return res.status(400).json({ 
        success: false, 
        message: 'Address proof document is required' 
      });
    }
    if (!req.files.photo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Photo is required' 
      });
    }

    // Create new user
    const userData = {
      fullName: req.body.fullName,
      fatherName: req.body.fatherName,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      occupation: req.body.occupation,
      education: req.body.education,
      idProofPath: req.files.idProof[0].filename,
      addressProofPath: req.files.addressProof[0].filename,
      photoPath: req.files.photo[0].filename,
      donationDocumentPath: req.files.donationDocument ? req.files.donationDocument[0].filename : null,
      status: 'pending'
    };

    const user = new User(userData);
    await user.save();

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful! Your application is pending approval.',
      userId: user._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
});

// Login with phone number and password
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number and password are required' 
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Phone number not registered. Please register first.',
        code: 'NOT_REGISTERED'
      });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password',
        code: 'INVALID_PASSWORD'
      });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your registration is pending approval. Please wait for admin verification.',
        code: 'PENDING'
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ 
        success: false, 
        message: `Your registration was rejected. Reason: ${user.rejectionReason || 'Not specified'}`,
        code: 'REJECTED'
      });
    }

    // User is approved - login successful
    res.json({ 
      success: true, 
      message: 'Login successful!',
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
});

// Get user profile (for logged in user)
router.get('/profile/:phone', async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone, status: 'approved' });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      user: {
        id: user._id,
        fullName: user.fullName,
        fatherName: user.fatherName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state,
        occupation: user.occupation,
        education: user.education,
        status: user.status,
        approvedAt: user.approvedAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile' 
    });
  }
});

module.exports = router;
