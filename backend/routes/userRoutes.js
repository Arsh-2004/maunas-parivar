const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OathAgreement = require('../models/OathAgreement');
const { upload, uploadToCloudinary } = require('../middleware/cloudinaryUpload');

// Save oath agreement
router.post('/save-oath', async (req, res) => {
  try {
    const { name, mobileNumber, agreedAt } = req.body;
    
    console.log('Oath agreement received:', { name, mobileNumber, agreedAt });
    
    // Save oath agreement to database
    const oathAgreement = new OathAgreement({
      name,
      mobileNumber,
      agreedAt: agreedAt || new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });
    
    await oathAgreement.save();
    console.log('Oath agreement saved to database');
    
    res.json({ 
      success: true, 
      message: 'Oath agreement recorded successfully',
      data: { 
        name, 
        mobileNumber, 
        agreedAt: oathAgreement.agreedAt 
      }
    });
  } catch (error) {
    console.error('Error saving oath agreement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save oath agreement' 
    });
  }
});

// Get all approved users (for membership cards - public route)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ status: 'approved' })
      .select('-password -idProofPath -addressProofPath -donationDocumentPath -rejectionReason')
      .sort({ registeredAt: -1 });
    
    res.json({ 
      success: true, 
      users 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users' 
    });
  }
});

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

    // Upload files to Cloudinary
    const idProofUrl = await uploadToCloudinary(req.files.idProof[0].path, 'documents');
    const addressProofUrl = await uploadToCloudinary(req.files.addressProof[0].path, 'documents');
    const photoUrl = await uploadToCloudinary(req.files.photo[0].path, 'photos');
    const donationDocUrl = req.files.donationDocument 
      ? await uploadToCloudinary(req.files.donationDocument[0].path, 'documents')
      : null;

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
      village: req.body.village,
      block: req.body.block,
      tehsil: req.body.tehsil,
      district: req.body.district,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      occupation: req.body.occupation,
      education: req.body.education,
      idProofPath: idProofUrl,
      addressProofPath: addressProofUrl,
      photoPath: photoUrl,
      donationDocumentPath: donationDocUrl,
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

// Debug endpoint - check user tier
router.get('/check-tier/:phone', async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      phone: user.phone,
      fullName: user.fullName,
      membershipTier: user.membershipTier,
      status: user.status
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
        _id: user._id,
        fullName: user.fullName,
        fatherName: user.fatherName,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        occupation: user.occupation,
        education: user.education,
        photoPath: user.photoPath,
        membershipTier: user.membershipTier,
        status: user.status,
        password: user.password
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

// Update user profile
router.put('/update-profile/:id', upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update fields
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.state = req.body.state || user.state;
    user.pincode = req.body.pincode || user.pincode;
    user.occupation = req.body.occupation || user.occupation;

    // Update photo if new one uploaded
    if (req.file) {
      user.photoPath = req.file.filename;
    }

    await user.save();

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        fatherName: user.fatherName,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        occupation: user.occupation,
        education: user.education,
        photoPath: user.photoPath,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile' 
    });
  }
});

module.exports = router;
