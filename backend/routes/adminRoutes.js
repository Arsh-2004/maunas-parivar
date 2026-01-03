const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

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

module.exports = router;
