const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Gallery = require('../models/Gallery');
const { requireApprovedMember } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ============= APPROVED MEMBER ROUTES =============

// View all gallery (any approved member)
router.post('/gallery/view', requireApprovedMember, async (req, res) => {
  try {
    const galleryPhotos = await Gallery.find().sort({ uploadedAt: -1 });

    res.json({ 
      success: true, 
      gallery: galleryPhotos 
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch gallery' 
    });
  }
});

// View all approved members (any approved member)
router.post('/members/view', requireApprovedMember, async (req, res) => {
  try {
    const members = await User.find({ status: 'approved' })
      .select('fullName phone email city state photoPath registeredAt')
      .sort({ registeredAt: -1 });

    res.json({ 
      success: true, 
      members 
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch members' 
    });
  }
});

module.exports = router;
