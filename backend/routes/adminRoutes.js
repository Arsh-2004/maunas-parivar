const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Gallery = require('../models/Gallery');
const OathAgreement = require('../models/OathAgreement');
const Donor = require('../models/Donor');
const SahyogSubmission = require('../models/SahyogSubmission');
const CommunityMember = require('../models/CommunityMember');
const CommitteeMember = require('../models/CommitteeMember');
const HeritagePost = require('../models/Heritage');
const path = require('path');
const fs = require('fs');
const { upload, uploadToCloudinary, getSignedUrl, cloudinary } = require('../middleware/cloudinaryUpload');
const { generateIDCard } = require('../middleware/idCardGenerator');

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

    console.log('🔄 Generating ID card for user:', user.fullName);

    // Generate digital ID card
    try {
      console.log('📸 Creating canvas...');
      const idCardBuffer = await generateIDCard(user);
      console.log('✅ Canvas created, buffer size:', idCardBuffer.length);
      
      console.log('☁️ Uploading to Cloudinary...');
      // Upload ID card to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            public_id: `id-cards/${user._id}-${Date.now()}`,
            format: 'jpg',
            quality: 'auto:good'
          },
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log('✅ Uploaded to Cloudinary:', result.secure_url);
              resolve(result);
            }
          }
        );
        uploadStream.end(idCardBuffer);
      });

      console.log('💾 Saving ID card URL to database...');
      // Update user with ID card URL
      user.idCardPath = uploadResult.secure_url;
      user.idCardGeneratedAt = new Date();
      await user.save();
      console.log('✅ ID card saved successfully!');
    } catch (idCardError) {
      console.error('❌ Error generating ID card:', idCardError.message);
      console.error('Full error:', idCardError);
      // Continue without ID card - don't fail the approval
    }
    
    res.json({ 
      success: true, 
      message: 'User approved successfully',
      user 
    });
  } catch (error) {
    console.error('❌ Approve user error:', error);
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

// Gallery management routes
router.post('/gallery', adminAuth, upload.single('image'), async (req, res) => {
  try {
    console.log('Uploading gallery photo with data:', req.body);
    console.log('File received:', req.file ? req.file.originalname : 'No file');
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image is required' 
      });
    }

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(req.file, 'gallery');

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
    const photos = await Gallery.find().sort({ sortOrder: 1, uploadedAt: -1 });
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

// Generate signed URL for PDF access
router.post('/generate-pdf-url', adminAuth, async (req, res) => {
  try {
    const { pdfUrl } = req.body;
    
    if (!pdfUrl) {
      return res.status(400).json({ success: false, message: 'PDF URL is required' });
    }
    
    // Extract public_id from Cloudinary URL
    const urlParts = pdfUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) {
      return res.status(400).json({ success: false, message: 'Invalid Cloudinary URL' });
    }
    
    // Get everything after 'upload/' (excluding version if present)
    const afterUpload = urlParts.slice(uploadIndex + 1).join('/');
    const publicId = afterUpload.replace(/^v\d+\//, ''); // Remove version number
    
    // Generate signed URL
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      type: 'upload',
      sign_url: true,
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
    });
    
    res.json({ success: true, signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ success: false, message: 'Failed to generate signed URL' });
  }
});

// Regenerate ID card for a user
router.post('/regenerate-id-card/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.status !== 'approved') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only approved users can have ID cards' 
      });
    }

    // Generate digital ID card
    try {
      const idCardBuffer = await generateIDCard(user);
      
      // Upload ID card to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            public_id: `id-cards/${user._id}-${Date.now()}`,
            format: 'jpg',
            quality: 'auto:good'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(idCardBuffer);
      });

      // Update user with new ID card URL
      user.idCardPath = uploadResult.secure_url;
      user.idCardGeneratedAt = new Date();
      await user.save();

      res.json({ 
        success: true, 
        message: 'ID card regenerated successfully',
        idCardPath: user.idCardPath 
      });
    } catch (idCardError) {
      console.error('Error generating ID card:', idCardError);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate ID card' 
      });
    }
  } catch (error) {
    console.error('Regenerate ID card error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to regenerate ID card' 
    });
  }
});

// Get all contact messages
const Contact = require('../models/Contact');

router.get('/contacts', adminAuth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 });
    res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    console.error('Fetch contacts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contact messages' });
  }
});

// Mark contact message as read
router.patch('/contacts/:id/read', adminAuth, async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update message' });
  }
});

// Delete contact message
router.delete('/contacts/:id', adminAuth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
});

// ===== Sahyog Submissions (Public Form Notifications) =====

router.get('/sahyog-submissions', adminAuth, async (req, res) => {
  try {
    const submissions = await SahyogSubmission.find().sort({ submittedAt: -1 });
    res.json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    console.error('Fetch sahyog submissions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sahyog submissions' });
  }
});

router.patch('/sahyog-submissions/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const submission = await SahyogSubmission.findByIdAndUpdate(
      req.params.id,
      { status, reviewedAt: status === 'pending' ? null : new Date() },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    res.json({ success: true, submission });
  } catch (error) {
    console.error('Update sahyog submission status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update submission status' });
  }
});

router.delete('/sahyog-submissions/:id', adminAuth, async (req, res) => {
  try {
    await SahyogSubmission.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Delete sahyog submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete submission' });
  }
});

// ===== Sahyogi Sadashya (Donor) Routes =====

// Add a donor
router.post('/donors', adminAuth, upload.single('photo'), async (req, res) => {
  try {
    let photoPath = null;
    if (req.file) {
      photoPath = await uploadToCloudinary(req.file, 'donors');
    }

    const donor = new Donor({
      fullName: req.body.fullName,
      city: req.body.city || '',
      state: req.body.state || '',
      donationAmount: Number(req.body.donationAmount),
      donationPurpose: req.body.donationPurpose || '',
      message: req.body.message || '',
      photoPath
    });

    await donor.save();
    res.status(201).json({ success: true, donor });
  } catch (error) {
    console.error('Add donor error:', error);
    res.status(500).json({ success: false, message: 'Failed to add donor', error: error.message });
  }
});

// Get all donors (public)
router.get('/donors', async (req, res) => {
  try {
    const donors = await Donor.find().sort({ sortOrder: 1, addedAt: 1 });
    res.json({ success: true, donors });
  } catch (error) {
    console.error('Fetch donors error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch donors' });
  }
});

// Delete a donor
router.delete('/donors/:id', adminAuth, async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Donor deleted successfully' });
  } catch (error) {
    console.error('Delete donor error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete donor' });
  }
});

// ===== Community Members (Upadhidharak & Prakosht) Routes =====

// Get all community members (public)
router.get('/community-members', async (req, res) => {
  try {
    const members = await CommunityMember.find().sort({ sortOrder: 1, addedAt: 1 });
    res.json({ success: true, members });
  } catch (error) {
    console.error('Fetch community members error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch community members' });
  }
});

// Add a community member (admin only)
router.post('/community-members', adminAuth, upload.single('photo'), async (req, res) => {
  try {
    let photoPath = null;
    if (req.file) {
      photoPath = await uploadToCloudinary(req.file, 'community-members');
    }

    const member = new CommunityMember({
      fullName: req.body.fullName,
      designation: req.body.designation || '',
      occupation: req.body.occupation || '',
      city: req.body.city || '',
      state: req.body.state || '',
      bio: req.body.bio || '',
      awards: req.body.awards || '',
      publications: req.body.publications || '',
      honoraryTitle: req.body.honoraryTitle || null,
      prakosth: req.body.prakosth || null,
      photoPath
    });

    await member.save();
    res.status(201).json({ success: true, member });
  } catch (error) {
    console.error('Add community member error:', error);
    res.status(500).json({ success: false, message: 'Failed to add community member', error: error.message });
  }
});

// Delete a community member (admin only)
router.delete('/community-members/:id', adminAuth, async (req, res) => {
  try {
    await CommunityMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Community member deleted successfully' });
  } catch (error) {
    console.error('Delete community member error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete community member' });
  }
});

// Edit a community member (admin only)
router.put('/community-members/:id', adminAuth, upload.single('photo'), async (req, res) => {
  try {
    const member = await CommunityMember.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Not found' });
    if (req.file) {
      member.photoPath = await uploadToCloudinary(req.file, 'community-members');
    }
    if (req.body.fullName) member.fullName = req.body.fullName;
    if (req.body.designation !== undefined) member.designation = req.body.designation;
    if (req.body.occupation !== undefined) member.occupation = req.body.occupation;
    if (req.body.city !== undefined) member.city = req.body.city;
    if (req.body.state !== undefined) member.state = req.body.state;
    if (req.body.bio !== undefined) member.bio = req.body.bio;
    if (req.body.awards !== undefined) member.awards = req.body.awards;
    if (req.body.publications !== undefined) member.publications = req.body.publications;
    if (req.body.honoraryTitle !== undefined) member.honoraryTitle = req.body.honoraryTitle || null;
    if (req.body.prakosth !== undefined) member.prakosth = req.body.prakosth || null;
    await member.save();
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Batch reorder community members
router.put('/community-members-reorder', adminAuth, async (req, res) => {
  try {
    const { updates } = req.body;
    for (const u of updates) {
      await CommunityMember.findByIdAndUpdate(u.id, { sortOrder: u.sortOrder });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Edit gallery item (admin)
router.put('/gallery/:id', adminAuth, async (req, res) => {
  try {
    const photo = await Gallery.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, description: req.body.description, category: req.body.category },
      { new: true }
    );
    if (!photo) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, photo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Batch reorder gallery
router.put('/gallery-reorder', adminAuth, async (req, res) => {
  try {
    const { updates } = req.body;
    for (const u of updates) {
      await Gallery.findByIdAndUpdate(u.id, { sortOrder: u.sortOrder });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Edit donor (admin)
router.put('/donors/:id', adminAuth, upload.single('photo'), async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ success: false, message: 'Not found' });
    if (req.file) {
      donor.photoPath = await uploadToCloudinary(req.file, 'donors');
    }
    if (req.body.fullName) donor.fullName = req.body.fullName;
    if (req.body.city !== undefined) donor.city = req.body.city;
    if (req.body.state !== undefined) donor.state = req.body.state;
    if (req.body.donationAmount) donor.donationAmount = Number(req.body.donationAmount);
    if (req.body.donationPurpose !== undefined) donor.donationPurpose = req.body.donationPurpose;
    if (req.body.message !== undefined) donor.message = req.body.message;
    await donor.save();
    res.json({ success: true, donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Batch reorder donors
router.put('/donors-reorder', adminAuth, async (req, res) => {
  try {
    const { updates } = req.body;
    for (const u of updates) {
      await Donor.findByIdAndUpdate(u.id, { sortOrder: u.sortOrder });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== Committee Members Routes =====

// Get committee members (public, query ?committee=sanrakshak&page=about)
router.get('/committee-members', async (req, res) => {
  try {
    const { committee, page } = req.query;
    const query = {};
    if (committee) query.committee = committee;
    if (page === 'home') query.displayPage = { $in: ['home', 'both'] };
    else if (page === 'about') query.displayPage = { $in: ['about', 'both'] };
    const members = await CommitteeMember.find(query).sort({ sortOrder: 1, addedAt: 1 });
    res.json({ success: true, members });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch committee members' });
  }
});

// Add committee member (admin)
router.post('/committee-members-admin', adminAuth, upload.single('photo'), async (req, res) => {
  try {
    let photoPath = null;
    if (req.file) {
      photoPath = await uploadToCloudinary(req.file, 'committee-members');
    }
    const maxOrder = await CommitteeMember.findOne({ committee: req.body.committee }).sort({ sortOrder: -1 });
    const sortOrder = maxOrder ? maxOrder.sortOrder + 1 : 0;
    const member = new CommitteeMember({
      fullName: req.body.fullName,
      designation: req.body.designation || '',
      position: req.body.position || '',
      city: req.body.city || '',
      state: req.body.state || '',
      committee: req.body.committee,
      displayPage: req.body.displayPage || 'about',
      sortOrder,
      photoPath
    });
    await member.save();
    res.status(201).json({ success: true, member });
  } catch (error) {
    console.error('Add committee member error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Edit committee member (admin) — PUT must come before reorder to avoid conflict
router.put('/committee-members-admin/:id', adminAuth, upload.single('photo'), async (req, res) => {
  try {
    const member = await CommitteeMember.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Not found' });
    if (req.file) {
      member.photoPath = await uploadToCloudinary(req.file, 'committee-members');
    }
    if (req.body.fullName) member.fullName = req.body.fullName;
    if (req.body.designation !== undefined) member.designation = req.body.designation;
    if (req.body.position !== undefined) member.position = req.body.position;
    if (req.body.city !== undefined) member.city = req.body.city;
    if (req.body.state !== undefined) member.state = req.body.state;
    if (req.body.displayPage) member.displayPage = req.body.displayPage;
    await member.save();
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Batch reorder committee members
router.put('/committee-members-reorder', adminAuth, async (req, res) => {
  try {
    const { updates } = req.body;
    for (const u of updates) {
      await CommitteeMember.findByIdAndUpdate(u.id, { sortOrder: u.sortOrder });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete committee member (admin)
router.delete('/committee-members-admin/:id', adminAuth, async (req, res) => {
  try {
    await CommitteeMember.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── Heritage Posts ────────────────────────────────────────────────────────

router.get('/heritage-posts', async (req, res) => {
  try {
    const posts = await HeritagePost.find().sort({ sortOrder: 1, addedAt: 1 });
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/heritage-posts/seed-static', adminAuth, async (req, res) => {
  try {
    const existing = await HeritagePost.countDocuments({ isBuiltIn: true });
    if (existing > 0) return res.json({ success: false, message: 'Static sites already initialized.' });
    const staticSites = [
      { titleHi: 'सीता समाहित स्थल (सीतामढ़ी)', titleEn: 'Sita Samaahit Sthal (Sitamarhi), Bhadohi', descriptionHi: 'मौनस वंश के आदिपुरुष एवं भगवान श्रीराम जी के ज्येष्ठ पुत्र श्री कुश जी का जन्मस्थल। सीता समाहित स्थल (सीतामढ़ी) तहसील - ज्ञानपुर, जिला - भदोही उ० प्र० में स्थित है।', descriptionEn: 'The birthplace of Shri Kush Ji, the eldest son of Lord Shri Ram and the progenitor of the Maunas dynasty. Located in Tehsil Gyanpur, District Bhadohi, UP.', imagePath: '/assets/सीता समाहित स्थल.jpeg', imageCaption: 'सीता समाहित स्थल (सीतामढ़ी), भदोही', sortOrder: 1, isBuiltIn: true },
      { titleHi: 'नवमठा मंदिर', titleEn: 'Navmatha Mandir, Gird Badgaon, Bhadohi', descriptionHi: 'गिर्द बड़गांव, भदोही में स्थित नवमठा मंदिर मौनस क्षत्रिय वंश की प्राचीन धार्मिक आस्था एवं गौरवशाली सांस्कृतिक विरासत का प्रतीक है।', descriptionEn: 'Located in Gird Badgaon, Bhadohi, Navmatha Mandir is a symbol of the ancient religious faith and glorious cultural heritage of the Maunas Kshatriya lineage.', imagePath: '/assets/सदियों की विरासत.jpeg', imageCaption: 'नवमठा मंदिर, गिर्द बड़गांव, भदोही', sortOrder: 2, isBuiltIn: true },
      { titleHi: 'सुरियावां गढ़ (रंग महल)', titleEn: 'Suriyawan Garh (Rang Mahal), Suriyawan, Bhadohi', descriptionHi: 'मौनसों की राजधानी सुरियावां गढ़ थी। राजधानी में बने किले को 1739 के युद्ध में तोपों से ध्वस्त कर दिया गया। सुरियावां गढ़ अब रंग महल के नाम से राजस्व विभाग में दर्ज है।', descriptionEn: 'The capital of the Maunas was Suriyawan Garh. The fort built in the capital was destroyed by cannons in the war of 1739. Now recorded as Rang Mahal in the revenue department.', imagePath: null, imageCaption: '', sortOrder: 3, isBuiltIn: true },
      { titleHi: 'अमर शहीद ठा० झूरी सिंह स्मारक', titleEn: 'Amar Shaheed Tha. Jhoori Singh Smarak, Parauppur, Bhadohi', descriptionHi: 'परऊपुर, भदोही में स्थित यह स्मारक 1857 की क्रांति के महान वीर अमर शहीद ठाकुर झूरी सिंह की अदम्य देशभक्ति एवं बलिदान को समर्पित है।', descriptionEn: 'Located in Parauppur, Bhadohi, this memorial is dedicated to the undying patriotism and sacrifice of Amar Shaheed Thakur Jhoori Singh, a great hero of the 1857 revolution.', imagePath: '/assets/अमर शहीद ठा० झूरी सिंह स्मारक.jpeg', imageCaption: 'अमर शहीद ठा० झूरी सिंह स्मारक, परऊपुर, भदोही', sortOrder: 4, isBuiltIn: true },
      { titleHi: 'महाराजा अचल सिंह का तालाब (52 बीघा)', titleEn: "MahaRaja Achal Singh's Pond (52 Bigha), Suriyawan, Bhadohi", descriptionHi: 'महाराजा अचल सिंह का 52 बीघा तालाब सुरियावां, भदोही में स्थित है।', descriptionEn: 'The 52 Bigha pond of MahaRaja Achal Singh is located in Suriyawan, Bhadohi.', imagePath: null, imageCaption: '', sortOrder: 5, isBuiltIn: true },
      { titleHi: 'भूल्ली सिंह दीवान तालाब (45 बीघा)', titleEn: 'Bhulli Singh Diwan Pond (45 Bigha), Mahuapur (Janakpur), Bhadohi', descriptionHi: 'भूल्ली सिंह दीवान तालाब 45 बीघा, ग्राम महुआपुर (जनकपुर), भदोही में स्थित है।', descriptionEn: 'Bhulli Singh Diwan Pond, spanning 45 Bigha, is located in village Mahuapur (Janakpur), Bhadohi.', imagePath: null, imageCaption: '', sortOrder: 6, isBuiltIn: true },
      { titleHi: 'महाराजा जोधराज सिंह तालाब (48 बीघा)', titleEn: 'MahaRaja Jodhraj Singh Pond (48 Bigha)', descriptionHi: 'महाराजा जोधराज सिंह तालाब 48 बीघा, मौनस क्षत्रिय वंश के गौरवशाली इतिहास की एक अमूल्य धरोहर है।', descriptionEn: 'MahaRaja Jodhraj Singh Pond, spanning 48 Bigha, is a priceless heritage of the glorious history of the Maunas Kshatriya lineage.', imagePath: '/assets/महाराज जोधराज तालाब.jpeg', imageCaption: 'राजा जोधराज सिंह तालाब (48 बीघा)', sortOrder: 7, isBuiltIn: true },
      { titleHi: 'कुलदेवी माता दुर्गा मंदिर', titleEn: 'Kuldevi Mata Durga Temple, Chakwara (Bhavapur), Bhadohi', descriptionHi: 'मौनस वंश की कुलदेवी माता दुर्गा जी हैं। चकौड़ा (भावापुर) तहसील औराई जनपद भदोही में कुलदेवी माता दुर्गा जी का मंदिर बनवाया गया, जो आज भी विद्यमान है।', descriptionEn: 'The Maunas clan\'s family deity is Mata Durga. A temple dedicated to Mata Durga was built in Chakoura (Bhavapur), Tehsil Aurai, District Bhadohi, which still exists today.', imagePath: '/assets/कुलदेवी माता दुर्गा.jpeg', imageCaption: 'कुलदेवी माता दुर्गा मंदिर, चकौड़ा (भावापुर), भदोही', sortOrder: 8, isBuiltIn: true },
      { titleHi: 'दिघवट कोट', titleEn: 'Dighwat Kot, Maharajganj, Bhadohi', descriptionHi: 'दिघवट किला मौनसों द्वारा आततायियों से मुक्त कराया गया था। यह भदोही जिले के महाराजगंज क्षेत्र में स्थित है।', descriptionEn: 'Dighwat Fort was liberated from the invaders by the Maunas. Located in the Maharajganj area of Bhadohi district, it currently belongs to the Swami Dayanand Saraswati Ashram.', imagePath: '/assets/दिघवट कोट.jpeg', imageCaption: 'दिघवट कोट, महाराजगंज, भदोही', sortOrder: 9, isBuiltIn: true },
      { titleHi: 'अगियावीर कोट', titleEn: 'Agiyaveer Kot, Dwarikpur, Bhadohi', descriptionHi: 'अगियावीर कोट के ध्वंसावशेष भदोही जनपद उत्तर प्रदेश के द्वारिकापुर में स्थित हैं। यह स्थल उस ऐतिहासिक घटना का साक्षी है, जहाँ मौनसों ने भरों को पराजित किया था।', descriptionEn: 'The ruins of Agiyaveer Kot are located in Dwarikapur, Bhadohi district, Uttar Pradesh. This site bears witness to the historic event where the Maunas defeated the Bhars.', imagePath: '/assets/अगियावीर कोट.jpeg', imageCaption: 'अगियावीर कोट, द्वारिकापुर, भदोही', sortOrder: 10, isBuiltIn: true },
    ];
    await HeritagePost.insertMany(staticSites);
    res.json({ success: true, inserted: staticSites.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/heritage-posts', adminAuth, upload.single('photo'), async (req, res) => {
  try {
    let imagePath = null;
    if (req.file) {
      imagePath = await uploadToCloudinary(req.file, 'heritage');
    }
    const maxOrder = await HeritagePost.findOne().sort({ sortOrder: -1 });
    const sortOrder = maxOrder ? maxOrder.sortOrder + 1 : 0;
    const post = new HeritagePost({
      titleHi: req.body.titleHi,
      titleEn: req.body.titleEn || '',
      descriptionHi: req.body.descriptionHi,
      descriptionEn: req.body.descriptionEn || '',
      imagePath,
      imageCaption: req.body.imageCaption || '',
      sortOrder,
    });
    await post.save();
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/heritage-posts/:id', adminAuth, upload.single('photo'), async (req, res) => {
  try {
    const update = {
      titleHi: req.body.titleHi,
      titleEn: req.body.titleEn || '',
      descriptionHi: req.body.descriptionHi,
      descriptionEn: req.body.descriptionEn || '',
      imageCaption: req.body.imageCaption || '',
    };
    if (req.file) {
      update.imagePath = await uploadToCloudinary(req.file, 'heritage');
    }
    const post = await HeritagePost.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/heritage-posts-reorder', adminAuth, async (req, res) => {
  try {
    const { updates } = req.body;
    await Promise.all(updates.map(({ id, sortOrder }) =>
      HeritagePost.findByIdAndUpdate(id, { sortOrder })
    ));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/heritage-posts/:id', adminAuth, async (req, res) => {
  try {
    await HeritagePost.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── Community Members Seed (Prakosth existing static members) ─────────────

router.post('/upadhi-members-seed', adminAuth, async (req, res) => {
  try {
    const existing = await CommunityMember.countDocuments({ honoraryTitle: { $exists: true, $ne: null } });
    if (existing > 0) {
      return res.json({ success: false, message: 'Upadhidharak members already exist. Seed skipped.' });
    }
    const members = [
      { fullName: 'डॉ. राजेश शर्मा', occupation: 'प्रोफेसर', city: 'वाराणसी', state: 'उत्तर प्रदेश', honoraryTitle: 'मौनस शिरोमणि', sortOrder: 0 },
      { fullName: 'कर्नल विक्रम सिंह', occupation: 'सैन्य अधिकारी (सेवानिवृत्त)', city: 'दिल्ली', state: 'दिल्ली', honoraryTitle: 'मौनस कुबेर', sortOrder: 1 },
      { fullName: 'अधिवक्ता अनिल कुमार', occupation: 'अधिवक्ता', city: 'लखनऊ', state: 'उत्तर प्रदेश', honoraryTitle: 'मौनस रत्न', sortOrder: 2 },
      { fullName: 'प्रो. सुरेश कुमार', occupation: 'विश्वविद्यालय प्रोफेसर', city: 'कानपुर', state: 'उत्तर प्रदेश', honoraryTitle: 'मौनस कुलभूषण', sortOrder: 3 },
      { fullName: 'श्री महेंद्र चौधरी', occupation: 'व्यवसायी', city: 'मुंबई', state: 'महाराष्ट्र', honoraryTitle: 'मौनस कुलदीपक', sortOrder: 4 },
      { fullName: 'डॉ. प्रदीप सिंह', occupation: 'चिकित्सक', city: 'पटना', state: 'बिहार', honoraryTitle: 'मौनस नायक', sortOrder: 5 },
    ];
    await CommunityMember.insertMany(members);
    res.json({ success: true, inserted: members.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/community-members-seed', adminAuth, async (req, res) => {
  try {
    const existing = await CommunityMember.countDocuments({ prakosth: { $exists: true, $ne: null } });
    if (existing > 0) {
      return res.json({ success: false, message: 'Prakosht members already exist. Seed skipped.' });
    }
    const members = [
      // बुद्धिजीवी प्रकोष्ठ
      { fullName: 'डॉ राम सुधार सिंह जी', city: 'वाराणसी', state: 'उत्तर प्रदेश', prakosth: 'buddhijivi', photoPath: '/assets/ram-sudhar-singh.jpeg', sortOrder: 0 },
      { fullName: 'डॉ जयदीप सिंह जी', occupation: 'वरिष्ठ वैज्ञानिक कृषि विज्ञान केंद्र, आई०सी०ए०आर०, ए० टी० ए० आर० आई० जोन IV', city: 'गुवाहाटी', state: 'आसाम', prakosth: 'buddhijivi', photoPath: '/assets/डॉ जयदीप सिंह जी.jpeg', sortOrder: 1 },
      { fullName: 'श्री अमर देव सिंह जी (प्रबंधक)', city: 'सराय कस्तूरिया, हंडिया प्रयागराज', state: 'उत्तर प्रदेश', prakosth: 'buddhijivi', photoPath: '/assets/श्री अमर देव सिंह जी.jpeg', sortOrder: 2 },
      { fullName: 'श्री दिनेश सिंह जी (प्रबंधक)', city: 'सेहरा, रामपुर जौनपुर', state: 'उत्तर प्रदेश', prakosth: 'buddhijivi', photoPath: '/assets/श्री दिनेश सिंह जी.png', sortOrder: 3 },
      // मानव सेवा प्रकोष्ठ
      { fullName: 'श्री के के सिंह जी', occupation: 'मानव सेवा प्रकोष्ठ सदस्य', city: 'सरबतखानी, भदोही', state: 'उत्तर प्रदेश', prakosth: 'manav-seva', photoPath: '/assets/श्री के के सिंह जी.jpeg', sortOrder: 0 },
      // चिकित्सा प्रकोष्ठ
      { fullName: 'डॉ. अक्षी सिंह जी', occupation: 'MBBS, MD (पीडियाट्रिक्स) — Datta Meghe Medical College, वर्धा (नागपुर) | पोस्ट ग्रेजुएट इन पीडियाट्रिक न्यूट्रिशन, Boston University, यूएसए', bio: 'विशेष रुचि: प्री-टर्म (असमय जन्मे) एवं हाई-रिस्क नवजात शिशुओं की देखभाल | फेलोशिप्स: इंडियन एकेडमी ऑफ पीडियाट्रिक्स (IAP) | इंडियन कॉलेज ऑफ हीमैटोलॉजी एंड ऑन्कोलॉजी सोसाइटी', awards: 'सर्वश्रेष्ठ शोध पुरस्कार (PG थीसिस) — नवजात शिशुओं में पल्मोनरी हाइपरटेंशन पर शोध, Datta Meghe Medical College, वर्धा', publications: 'भारत एवं विदेशों की विभिन्न शोध पत्रिकाओं में लेखक एवं सह-लेखक के रूप में शोध पत्र प्रकाशित', city: 'वाराणसी', state: 'उत्तर प्रदेश', prakosth: 'chikitsa', photoPath: '/assets/डॉ. अक्षी सिंह.jpeg', sortOrder: 0 },
      { fullName: 'डॉ. गौरव सिंह जी', occupation: 'MBBS, MD (जनरल मेडिसिन) — Ganesh Shankar Vidyarthi Memorial Medical College, कानपुर | डायबिटीज में फेलोशिप, Christian Medical College, वेल्लोर', bio: 'फेलोशिप्स: इंडियन सोसाइटी ऑफ हाइपरटेंशन | इंडियन सोसाइटी ऑफ क्रोनोमेडिसिन | इंडियन कॉलेज ऑफ हीमैटोलॉजी एंड ऑन्कोलॉजी सोसाइटी | डायबिटीज इंडिया', awards: 'काशी गौरव सम्मान 2023 | चिकित्सा सेवा सम्मान 2024 | बेस्ट प्रोजेक्ट वर्क एवं शैक्षणिक उत्कृष्टता (डिस्टिंक्शन) — सीएमसी वेल्लोर 2025 | डायबिटीज क्षेत्र में उत्कृष्टता पुरस्कार — World Congress of Diabetes and Obesity, हैदराबाद 2026', publications: 'भारत एवं विदेशों की विभिन्न शोध पत्रिकाओं में लेखक एवं सह-लेखक के रूप में शोध पत्र प्रकाशित | वर्ष 2025 में बैंकॉक में आयोजित International Diabetes Federation कॉन्फ्रेंस में मूल शोध पत्र का प्रस्तुतीकरण', city: 'वाराणसी', state: 'उत्तर प्रदेश', prakosth: 'chikitsa', photoPath: '/assets/डॉ. गौरव सिंह.jpeg', sortOrder: 1 },
      // विधि प्रकोष्ठ
      { fullName: 'श्री राजकुमार सिंह जी', occupation: 'एडवोकेट', city: 'बिठौली, प्रयागराज', state: 'उत्तर प्रदेश', prakosth: 'vidhi', photoPath: '/assets/श्री राजकुमार सिंह जी.jpeg', sortOrder: 0 },
      // खेल एवं सैनिक प्रकोष्ठ
      { fullName: 'श्री यजुवेंद्र सिंह जी', occupation: 'खेल एवं सैनिक प्रकोष्ठ सदस्य', city: 'गजाधरपुर', state: 'भदोही', prakosth: 'khel', photoPath: '/assets/श्री यजुवेंद्र सिंह जी.jpeg', sortOrder: 0 },
      { fullName: 'पुष्पराज सिंह मौनस', occupation: 'खेल एवं सैनिक प्रकोष्ठ सदस्य', city: 'कटौली, भिटारी, रामपुर नैकिन', state: 'सीधी, मध्य प्रदेश', prakosth: 'khel', photoPath: '/assets/पुष्पराज सिंह मौनस.jpeg', sortOrder: 1 },
    ];
    await CommunityMember.insertMany(members);
    res.json({ success: true, inserted: members.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Seed static members for a committee (only if none exist yet)
router.post('/committee-members-seed', adminAuth, async (req, res) => {
  try {
    const { committee } = req.body;
    if (!['sanrakshak', 'prabandhan', 'sanchalan'].includes(committee)) {
      return res.status(400).json({ success: false, message: 'Invalid committee' });
    }
    const existing = await CommitteeMember.countDocuments({ committee });
    if (existing > 0) {
      return res.json({ success: false, message: 'Members already exist for this committee. Seed skipped.' });
    }

    const SEED_DATA = {
      prabandhan: [
        { fullName: 'श्री रवि कुमार सिंह जी', designation: '', position: 'वाराणसी', city: 'वाराणसी', state: 'उत्तर प्रदेश', photoPath: '/assets/national-president.jpeg', displayPage: 'both', sortOrder: 0 },
        { fullName: 'डॉ जे पी सिंह जी', designation: '', position: 'वाराणसी', city: 'वाराणसी', state: 'उत्तर प्रदेश', photoPath: '/assets/national-vice-president.jpeg', displayPage: 'both', sortOrder: 1 },
        { fullName: 'डॉ ओम प्रकाश सिंह जी', designation: '', position: 'वाराणसी', city: 'वाराणसी', state: 'उत्तर प्रदेश', photoPath: '/assets/National Secretary.jpeg', displayPage: 'both', sortOrder: 2 },
        { fullName: 'श्री सुरेश सिंह जी', designation: '', position: 'वाराणसी', city: 'वाराणसी', state: 'उत्तर प्रदेश', photoPath: '/assets/National Treasurer.jpeg', displayPage: 'both', sortOrder: 3 },
        { fullName: 'श्री रोहित सिंह जी', designation: '', position: 'वाराणसी', city: 'वाराणसी', state: 'उत्तर प्रदेश', photoPath: '/assets/rohit-singh.jpeg', displayPage: 'both', sortOrder: 4 },
        { fullName: 'श्री शैलेन्द्र प्रताप सिंह जी', designation: '', position: 'वाराणसी', city: 'वाराणसी', state: 'उत्तर प्रदेश', photoPath: '/assets/shailendra.jpeg', displayPage: 'both', sortOrder: 5 },
        { fullName: 'श्री राजन सिंह जी', designation: '', position: 'गिर्द बड़गांव भदोही', city: 'भदोही', state: 'उत्तर प्रदेश', photoPath: '/assets/rajan-singh.jpeg', displayPage: 'both', sortOrder: 6 },
        { fullName: 'श्री अंबिका सिंह जी', designation: '', position: 'मठहाॅ भदोही', city: 'भदोही', state: 'उत्तर प्रदेश', photoPath: '/assets/श्री अंबिका सिंह जी.jpeg', displayPage: 'both', sortOrder: 7 },
        { fullName: 'श्री विनोद सिंह जी', designation: '', position: 'सुरियावां भदोही', city: 'भदोही', state: 'उत्तर प्रदेश', photoPath: '/assets/श्री विनोद सिंह जी.jpeg', displayPage: 'both', sortOrder: 8 },
        { fullName: 'श्री आशीष सिंह जी', designation: '', position: 'भदोही', city: 'भदोही', state: 'उत्तर प्रदेश', photoPath: '/assets/ashishsingh.jpeg', displayPage: 'both', sortOrder: 9 },
        { fullName: 'श्री संजय सिंह जी', designation: '', position: 'सेहरा रामपुर जौनपुर', city: 'जौनपुर', state: 'उत्तर प्रदेश', photoPath: '/assets/श्री संजय सिंह जी.png', displayPage: 'about', sortOrder: 10 },
      ],
      sanchalan: [
        { fullName: 'श्री रवींद्र कुमार सिंह जी', designation: '', position: 'अवलेशपुर', city: 'वाराणसी', state: 'उत्तर प्रदेश', photoPath: '/assets/president-ravindra-kumar-singh.jpg', displayPage: 'about', sortOrder: 0 },
        { fullName: 'श्री बड़े बहादुर सिंह जी', designation: '', position: 'गोलखरा भदोही', city: 'भदोही', state: 'उत्तर प्रदेश', photoPath: '/assets/bade_bahadur.jpeg', displayPage: 'about', sortOrder: 1 },
        { fullName: 'श्री रविंद्र सिंह जी', designation: '', position: 'द्वारिकापुर भदोही', city: 'भदोही', state: 'उत्तर प्रदेश', photoPath: '/assets/ravindra-singh.jpeg', displayPage: 'about', sortOrder: 2 },
        { fullName: 'श्री मनोज कुमार सिंह जी', designation: '', position: 'अजयपुर भदोही', city: 'भदोही', state: 'उत्तर प्रदेश', photoPath: '/assets/manoj-kumar-singh.jpeg', displayPage: 'about', sortOrder: 3 },
        { fullName: 'श्री सुरेश कुमार सिंह जी', designation: '', position: 'टिकैतपुर भदोही', city: 'भदोही', state: 'उत्तर प्रदेश', photoPath: '/assets/सुरेश कुमार सिंह.jpeg', displayPage: 'about', sortOrder: 4 },
        { fullName: 'विनीत सिंह मौनस', designation: '', position: 'कटौली, भिटारी, रामपुर नैकिन', city: 'सीधी', state: 'मध्य प्रदेश', photoPath: '/assets/विनीत सिंह मौनस.jpeg', displayPage: 'about', sortOrder: 5 },
      ],
      sanrakshak: [
        { fullName: 'श्री सुखराज सिंह जी', designation: '', position: 'गिर्दकोट प्रयागराज', city: 'प्रयागराज', state: 'उत्तर प्रदेश', photoPath: '/assets/sukhraj-singh.jpeg', displayPage: 'about', sortOrder: 0 },
        { fullName: 'श्री शिव शंकर सिंह जी', designation: '', position: 'मोढ़ भदोही', city: 'भदोही', state: 'उत्तर प्रदेश', photoPath: '/assets/shiv-shankar-singh.jpeg', displayPage: 'about', sortOrder: 1 },
        { fullName: 'श्री पारसनाथ सिंह जी', designation: '', position: 'बगहा', city: 'मिर्जापुर', state: 'उत्तर प्रदेश', photoPath: '/assets/श्री पारसनाथ सिंह जी.jpeg', displayPage: 'about', sortOrder: 2 },
        { fullName: 'श्री उपेंद्र सिंह जी', designation: '', position: 'दारूनहा‌‌ॅ', city: 'भदोही', state: 'उत्तर प्रदेश', photoPath: '/assets/श्री उपेंद्र सिंह जी.jpeg', displayPage: 'about', sortOrder: 3 },
      ],
    };

    const members = SEED_DATA[committee].map(m => ({ ...m, committee }));
    await CommitteeMember.insertMany(members);
    res.json({ success: true, inserted: members.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
