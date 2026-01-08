const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const OathAgreement = require('../models/OathAgreement');
const path = require('path');
const fs = require('fs');
const { uploadPhoto, uploadToCloudinary } = require('../middleware/cloudinaryUpload');

// Simple admin authentication middleware
const adminAuth = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];
  
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized. Invalid admin password.' 
    });
  }
  next();
};

// Admin login
router.post('/login', (req, res) => {
  const { password } = req.body;
  
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ 
      success: true, 
      message: 'Admin login successful' 
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid admin password' 
    });
  }
});

// Get all oath agreements
router.get('/oath-agreements', adminAuth, async (req, res) => {
  try {
    const oathAgreements = await OathAgreement.find()
      .sort({ agreedAt: -1 });
    
    res.json({ 
      success: true, 
      count: oathAgreements.length,
      agreements: oathAgreements 
    });
  } catch (error) {
    console.error('Error fetching oath agreements:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch oath agreements' 
    });
  }
});

// Get all pending registrations
router.get('/pending', adminAuth, async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' })
      .sort({ registeredAt: -1 });
    
    res.json({ 
      success: true, 
      count: pendingUsers.length,
      users: pendingUsers 
    });
  } catch (error) {
    console.error('Fetch pending users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pending registrations' 
    });
  }
});

// Get all users (with optional status filter)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const users = await User.find(query).sort({ registeredAt: -1 });
    
    res.json({ 
      success: true, 
      count: users.length,
      users 
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users' 
    });
  }
});

// Get single user details
router.get('/user/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      user 
    });
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user details' 
    });
  }
});

// Approve user registration
router.put('/approve/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved',
        approvedAt: new Date()
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'User approved successfully',
      user 
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to approve user' 
    });
  }
});

// Reject user registration
router.put('/reject/:id', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        rejectionReason: reason || 'Application rejected by admin',
        approvedAt: null
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'User registration rejected',
      user 
    });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reject user' 
    });
  }
});

// Set user back to pending
router.put('/set-pending/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'pending',
        approvedAt: null,
        rejectionReason: null
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'User status set to pending',
      user 
    });
  } catch (error) {
    console.error('Set pending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update status' 
    });
  }
});

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const pending = await User.countDocuments({ status: 'pending' });
    const approved = await User.countDocuments({ status: 'approved' });
    const rejected = await User.countDocuments({ status: 'rejected' });
    const total = await User.countDocuments();
    
    res.json({ 
      success: true, 
      stats: {
        pending,
        approved,
        rejected,
        total
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch stats' 
    });
  }
});

// Delete rejected user
router.delete('/delete/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Only allow deletion of rejected users
    if (user.status !== 'rejected') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only rejected applications can be deleted' 
      });
    }

    // Delete associated files
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const filesToDelete = [
      user.idProofPath,
      user.addressProofPath,
      user.photoPath,
      user.donationDocumentPath
    ].filter(Boolean); // Remove null/undefined values

    filesToDelete.forEach(filename => {
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Delete user from database
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'User and associated files deleted successfully' 
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user' 
    });
  }
});

// Search users
router.get('/search', adminAuth, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }

    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } }
      ]
    }).sort({ registeredAt: -1 });
    
    res.json({ 
      success: true, 
      count: users.length,
      users 
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Search failed' 
    });
  }
});

// Update membership tier
router.put('/update-tier/:id', adminAuth, async (req, res) => {
  try {
    const { tier } = req.body;
    
    if (!['silver', 'gold', 'diamond'].includes(tier)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid membership tier' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { membershipTier: tier },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Membership tier updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update tier error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update tier' 
    });
  }
});

// Event management routes
router.post('/events', adminAuth, uploadPhoto.single('image'), async (req, res) => {
  try {
    console.log('Creating event with data:', req.body);
    console.log('File received:', req.file ? req.file.path : 'No file');
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image is required' 
      });
    }

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(req.file.path, 'events');
    
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      imagePath: cloudinaryUrl
    };

    const event = new Event(eventData);
    await event.save();

    console.log('Event created successfully:', event._id);
    
    res.status(201).json({ 
      success: true, 
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create event',
      error: error.message 
    });
  }
});

router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json({ 
      success: true, 
      events 
    });
  } catch (error) {
    console.error('Fetch events error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch events' 
    });
  }
});

router.delete('/events/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Delete image file if exists
    if (event.imagePath) {
      const filePath = path.join(__dirname, '..', 'uploads', event.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Event.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete event' 
    });
  }
});

// Gallery management routes
router.post('/gallery', adminAuth, uploadPhoto.single('image'), async (req, res) => {
  try {
    console.log('Uploading gallery photo with data:', req.body);
    console.log('File received:', req.file ? req.file.path : 'No file');
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image is required' 
      });
    }

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(req.file.path, 'gallery');

    const galleryData = {
      title: req.body.title,
      description: req.body.description || '',
      category: req.body.category || 'general',
      imagePath: cloudinaryUrl
    };

    const photo = new Gallery(galleryData);
    await photo.save();

    console.log('Photo uploaded successfully:', photo._id);

    res.status(201).json({ 
      success: true, 
      message: 'Photo uploaded successfully',
      photo
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload photo',
      error: error.message 
    });
  }
});

router.get('/gallery', async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ uploadedAt: -1 });
    res.json({ 
      success: true, 
      photos 
    });
  } catch (error) {
    console.error('Fetch gallery error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch gallery' 
    });
  }
});

router.delete('/gallery/:id', adminAuth, async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ 
        success: false, 
        message: 'Photo not found' 
      });
    }

    // Delete image file
    const filePath = path.join(__dirname, '..', 'uploads', photo.imagePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Photo deleted successfully' 
    });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete photo' 
    });
  }
});

module.exports = router;
