const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const { requireDiamond, requireGold, requireSilver } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ============= DIAMOND MEMBER ROUTES =============

// Diamond: Approve/Reject new members
router.post('/members/approve/:id', requireDiamond, async (req, res) => {
  try {
    const { membershipTier } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.status = 'approved';
    user.membershipTier = membershipTier || 'silver';
    user.approvedAt = new Date();
    await user.save();

    res.json({ 
      success: true, 
      message: 'Member approved successfully',
      user 
    });
  } catch (error) {
    console.error('Error approving member:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to approve member' 
    });
  }
});

router.post('/members/reject/:id', requireDiamond, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.status = 'rejected';
    user.rejectionReason = rejectionReason;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Member rejected',
      user 
    });
  } catch (error) {
    console.error('Error rejecting member:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reject member' 
    });
  }
});

// Diamond: Get pending members
router.post('/members/pending', requireDiamond, async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' })
      .sort({ registeredAt: -1 });
    
    res.json({ 
      success: true, 
      count: pendingUsers.length,
      users: pendingUsers 
    });
  } catch (error) {
    console.error('Error fetching pending members:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pending members' 
    });
  }
});

// Diamond: Create/Edit Events
router.post('/events', requireDiamond, upload.single('image'), async (req, res) => {
  try {
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      imagePath: req.file ? req.file.filename : null,
      createdBy: req.user ? req.user.fullName : 'admin'
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({ 
      success: true, 
      message: 'Event created successfully',
      event 
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create event' 
    });
  }
});

router.put('/events/:id', requireDiamond, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.date = req.body.date || event.date;
    event.location = req.body.location || event.location;
    
    if (req.file) {
      event.imagePath = req.file.filename;
    }

    await event.save();

    res.json({ 
      success: true, 
      message: 'Event updated successfully',
      event 
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update event' 
    });
  }
});

router.delete('/events/:id', requireDiamond, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete event' 
    });
  }
});

// Diamond: Create/Edit Gallery
router.post('/gallery', requireDiamond, upload.single('photo'), async (req, res) => {
  try {
    const galleryData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      imagePath: req.file ? req.file.filename : null,
      uploadedBy: req.user ? req.user.fullName : 'admin'
    };

    const gallery = new Gallery(galleryData);
    await gallery.save();

    res.status(201).json({ 
      success: true, 
      message: 'Gallery photo uploaded successfully',
      gallery 
    });
  } catch (error) {
    console.error('Error uploading gallery photo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload photo' 
    });
  }
});

router.delete('/gallery/:id', requireDiamond, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    
    if (!gallery) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gallery photo not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Gallery photo deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete photo' 
    });
  }
});

// ============= GOLD MEMBER ROUTES =============

// Gold: View upcoming events
router.post('/events/upcoming', requireGold, async (req, res) => {
  try {
    const upcomingEvents = await Event.find({ 
      date: { $gte: new Date() } 
    }).sort({ date: 1 });

    res.json({ 
      success: true, 
      events: upcomingEvents 
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch upcoming events' 
    });
  }
});

// Gold: Volunteer for an event
router.post('/events/:id/volunteer', requireGold, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Check if already volunteered
    const alreadyVolunteered = event.volunteers.some(
      v => v.userId.toString() === req.user._id.toString()
    );

    if (alreadyVolunteered) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already volunteered for this event' 
      });
    }

    event.volunteers.push({
      userId: req.user._id,
      name: req.user.fullName,
      phone: req.user.phone
    });

    await event.save();

    res.json({ 
      success: true, 
      message: 'Successfully volunteered for the event',
      event 
    });
  } catch (error) {
    console.error('Error volunteering for event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to volunteer for event' 
    });
  }
});

// Gold: Cancel volunteer registration
router.delete('/events/:id/volunteer', requireGold, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    event.volunteers = event.volunteers.filter(
      v => v.userId.toString() !== req.user._id.toString()
    );

    await event.save();

    res.json({ 
      success: true, 
      message: 'Volunteer registration cancelled',
      event 
    });
  } catch (error) {
    console.error('Error cancelling volunteer registration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel registration' 
    });
  }
});

// ============= SILVER MEMBER ROUTES =============

// Silver: View past events
router.post('/events/past', requireSilver, async (req, res) => {
  try {
    const pastEvents = await Event.find({ 
      date: { $lt: new Date() } 
    }).sort({ date: -1 });

    res.json({ 
      success: true, 
      events: pastEvents 
    });
  } catch (error) {
    console.error('Error fetching past events:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch past events' 
    });
  }
});

// Silver: View all gallery
router.post('/gallery/view', requireSilver, async (req, res) => {
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

// Silver: View all approved members
router.post('/members/view', requireSilver, async (req, res) => {
  try {
    const members = await User.find({ status: 'approved' })
      .select('fullName phone email city state membershipTier photoPath registeredAt')
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
