const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OathAgreement = require('../models/OathAgreement');
const { upload, uploadToCloudinary } = require('../middleware/cloudinaryUpload');
const { mapWithConcurrency } = require('../utils/promisePool');

const REGISTER_UPLOAD_CONCURRENCY = Number(process.env.REGISTER_UPLOAD_CONCURRENCY || 2);
const REGISTER_MAX_TOTAL_UPLOAD_BYTES = Number(process.env.REGISTER_MAX_TOTAL_UPLOAD_BYTES || 20 * 1024 * 1024);
const REGISTER_MAX_FAMILY_FILES = 20;

const getFileSize = (file) => {
  if (!file) {
    return 0;
  }

  if (typeof file.size === 'number') {
    return file.size;
  }

  if (Buffer.isBuffer(file.buffer)) {
    return file.buffer.length;
  }

  return 0;
};

const parseFamilyMembers = (rawFamilyMembers) => {
  if (!rawFamilyMembers) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawFamilyMembers);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((member, sourceIndex) => ({ member, sourceIndex }))
      .filter(({ member }) => {
        return member
          && typeof member === 'object'
          && member.name
          && member.name.trim()
          && member.relation
          && member.relation.trim();
      })
      .map(({ member, sourceIndex }) => ({
        sourceIndex,
        name: member.name.trim(),
        relation: member.relation.trim(),
        dateOfBirth: member.dateOfBirth || null,
        gender: member.gender || null,
        occupation: member.occupation || '',
        phone: member.phone || ''
      }));
  } catch (error) {
    return [];
  }
};

// Save oath agreement
router.post('/save-oath', async (req, res) => {
  try {
    const { name, mobileNumber, agreedAt } = req.body;
    
    console.log('Oath agreement received:', { name, mobileNumber, agreedAt });
    
    // Check if this mobile number has already taken oath
    // Only mobile number matters - prevents same person taking oath multiple times with different names
    const existingOath = await OathAgreement.findOne({ 
      mobileNumber: mobileNumber.trim() 
    });
    
    if (existingOath) {
      console.log('This mobile number has already taken oath. Returning existing agreement.');
      return res.json({ 
        success: true, 
        message: 'This mobile number has already taken the oath',
        data: { 
          name: existingOath.name, 
          mobileNumber: existingOath.mobileNumber, 
          agreedAt: existingOath.agreedAt,
          isExisting: true
        }
      });
    }
    
    // Get real IP address from the request
    const ipAddress = req.clientIp || req.ip || req.connection.remoteAddress;
    
    // Save oath agreement to database
    const oathAgreement = new OathAgreement({
      name,
      mobileNumber,
      agreedAt: agreedAt || new Date(),
      ipAddress: ipAddress,
      userAgent: req.get('user-agent')
    });
    
    await oathAgreement.save();
    console.log('Oath agreement saved to database', { name, mobileNumber, ipAddress });
    
    res.json({ 
      success: true, 
      message: 'Oath agreement recorded successfully',
      data: { 
        name, 
        mobileNumber, 
        agreedAt: oathAgreement.agreedAt,
        ipAddress: ipAddress,
        isExisting: false
      }
    });
  } catch (error) {
    console.error('Error saving oath agreement:', error);
    
    // Check if it's a duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'This mobile number has already taken the oath. Only one oath per phone number is allowed.',
        code: 'DUPLICATE_OATH'
      });
    }
    
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
const registerUpload = upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'donationDocument', maxCount: 1 },
  { name: 'familyMemberPhoto', maxCount: 20 }
]);

router.post('/register', registerUpload, async (req, res) => {
  try {
    if (!req.body.phone || !req.body.phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const idProofFile = req.files?.idProof?.[0];
    const addressProofFile = req.files?.addressProof?.[0];
    const photoFile = req.files?.photo?.[0];
    const donationDocumentFile = req.files?.donationDocument?.[0] || null;
    const familyPhotoFiles = Array.isArray(req.files?.familyMemberPhoto) ? req.files.familyMemberPhoto : [];

    if (!idProofFile) {
      return res.status(400).json({
        success: false,
        message: 'ID proof document is required'
      });
    }

    if (!addressProofFile) {
      return res.status(400).json({
        success: false,
        message: 'Address proof document is required'
      });
    }

    if (!photoFile) {
      return res.status(400).json({
        success: false,
        message: 'Photo is required'
      });
    }

    if (familyPhotoFiles.length > REGISTER_MAX_FAMILY_FILES) {
      return res.status(400).json({
        success: false,
        message: 'Too many family member photos uploaded'
      });
    }

    const allUploadFiles = [
      idProofFile,
      addressProofFile,
      photoFile,
      donationDocumentFile,
      ...familyPhotoFiles
    ].filter(Boolean);

    const totalUploadBytes = allUploadFiles.reduce((total, file) => total + getFileSize(file), 0);
    if (totalUploadBytes > REGISTER_MAX_TOTAL_UPLOAD_BYTES) {
      return res.status(400).json({
        success: false,
        message: 'Total upload size is too large. Please compress files and try again.'
      });
    }

    // Check if phone number already exists
    const existingUser = await User.findOne({ phone: req.body.phone.trim() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number already registered' 
      });
    }

    const normalizedFamilyMembers = parseFamilyMembers(req.body.familyMembers);

    const uploadJobs = [
      { key: 'idProofPath', folder: 'documents', file: idProofFile },
      { key: 'addressProofPath', folder: 'documents', file: addressProofFile },
      { key: 'photoPath', folder: 'photos', file: photoFile }
    ];

    if (donationDocumentFile) {
      uploadJobs.push({ key: 'donationDocumentPath', folder: 'documents', file: donationDocumentFile });
    }

    normalizedFamilyMembers.forEach((member, memberIndex) => {
      const familyPhotoFile = familyPhotoFiles[member.sourceIndex];
      if (familyPhotoFile) {
        uploadJobs.push({
          key: `familyMemberPhoto:${memberIndex}`,
          folder: 'photos',
          file: familyPhotoFile
        });
      }
    });

    const uploadResults = await mapWithConcurrency(
      uploadJobs,
      async (job) => {
        const uploadedUrl = await uploadToCloudinary(job.file, job.folder);
        return { key: job.key, uploadedUrl };
      },
      REGISTER_UPLOAD_CONCURRENCY
    );

    const uploadedPathMap = uploadResults.reduce((accumulator, result) => {
      accumulator[result.key] = result.uploadedUrl;
      return accumulator;
    }, {});

    const familyMembers = normalizedFamilyMembers.map((member, memberIndex) => ({
      name: member.name,
      relation: member.relation,
      dateOfBirth: member.dateOfBirth,
      gender: member.gender,
      occupation: member.occupation,
      phone: member.phone,
      photoPath: uploadedPathMap[`familyMemberPhoto:${memberIndex}`] || '',
      addedAt: new Date(),
      addedFrom: 'registration'
    }));

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
      idProofPath: uploadedPathMap.idProofPath,
      addressProofPath: uploadedPathMap.addressProofPath,
      photoPath: uploadedPathMap.photoPath,
      donationDocumentPath: uploadedPathMap.donationDocumentPath || null,
      familyMembers,
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
        _id: user._id,
        fullName: user.fullName,
        fatherName: user.fatherName,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
        address: user.address,
        village: user.village,
        block: user.block,
        tehsil: user.tehsil,
        district: user.district,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        occupation: user.occupation,
        education: user.education,
        photoPath: user.photoPath,
        status: user.status,
        password: user.password,
        familyMembers: user.familyMembers || []
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
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        fatherName: user.fatherName,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        email: user.email,
        phone: user.phone,
        address: user.address,
        village: user.village,
        block: user.block,
        tehsil: user.tehsil,
        district: user.district,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        occupation: user.occupation,
        education: user.education,
        status: user.status,
        approvedAt: user.approvedAt,
        photoPath: user.photoPath,
        idCardPath: user.idCardPath,
        idCardGeneratedAt: user.idCardGeneratedAt,
        familyMembers: user.familyMembers || []
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
    if (req.body.education) user.education = req.body.education;

    // Update photo if new one uploaded
    if (req.file) {
      const photoUrl = await uploadToCloudinary(req.file, 'photos');
      user.photoPath = photoUrl;
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
        village: user.village,
        block: user.block,
        tehsil: user.tehsil,
        district: user.district,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        occupation: user.occupation,
        education: user.education,
        photoPath: user.photoPath,
        idCardPath: user.idCardPath,
        idCardGeneratedAt: user.idCardGeneratedAt,
        status: user.status,
        approvedAt: user.approvedAt,
        familyMembers: user.familyMembers || []
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

// Get ID Card data by user ID (for QR code scanning)
router.get('/id-card/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Return only necessary data for ID card display
    res.json({ 
      success: true, 
      user: {
        _id: user._id,
        fullName: user.fullName,
        fatherName: user.fatherName,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
        address: user.address,
        village: user.village,
        block: user.block,
        tehsil: user.tehsil,
        district: user.district,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        occupation: user.occupation,
        education: user.education,
        photoPath: user.photoPath,
        status: user.status,
        registeredAt: user.registeredAt,
        approvedAt: user.approvedAt
      }
    });
  } catch (error) {
    console.error('Error fetching ID card data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch ID card data' 
    });
  }
});

// Get committee members (now uses CommitteeMember model, supports ?page=about|home)
router.get('/committee-members/:committeeId', async (req, res) => {
  try {
    const { committeeId } = req.params;
    const { page } = req.query;

    const validCommittees = ['sanrakshak', 'prabandhan', 'sanchalan'];
    if (!validCommittees.includes(committeeId)) {
      return res.status(400).json({ success: false, message: 'Invalid committee ID' });
    }

    const CommitteeMember = require('../models/CommitteeMember');
    const query = { committee: committeeId };
    if (page === 'home') query.displayPage = { $in: ['home', 'both'] };
    else if (page === 'about') query.displayPage = { $in: ['about', 'both'] };

    const members = await CommitteeMember.find(query).sort({ sortOrder: 1, addedAt: 1 });
    res.json({ success: true, members: members || [] });
  } catch (error) {
    console.error('Error fetching committee members:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch committee members' });
  }
});

// ===================== NON-MEMBER RECORDS =====================

const NonMemberRecord = require('../models/NonMemberRecord');

// POST  /api/users/add-non-member  — anyone can add a record for a non-registered person
router.post('/add-non-member', upload.single('photo'), async (req, res) => {
  try {
    const {
      fullName, place, age, addedBy,
      relationship, fatherName, gender, email, phone,
      address, village, block, tehsil, district,
      state, pincode, occupation, education
    } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!place || !place.trim()) {
      return res.status(400).json({ success: false, message: 'Place is required.' });
    }
    if (!age || isNaN(age) || age <= 0) {
      return res.status(400).json({ success: false, message: 'Age is required.' });
    }
    // addedBy is now optional — public users can submit without a user ID

    let photoPath = null;
    if (req.file) {
      photoPath = await uploadToCloudinary(req.file, 'non-member-photos');
    }

    const record = new NonMemberRecord({
      fullName: fullName.trim(),
      place: place.trim(),
      age: Number(age),
      relationship: relationship ? relationship.trim() : '',
      fatherName: fatherName ? fatherName.trim() : '',
      gender: gender || '',
      email: email ? email.trim().toLowerCase() : '',
      phone: phone ? phone.trim() : '',
      address: address || '',
      village: village ? village.trim() : '',
      block: block ? block.trim() : '',
      tehsil: tehsil ? tehsil.trim() : '',
      district: district ? district.trim() : '',
      state: state ? state.trim() : '',
      pincode: pincode ? pincode.trim() : '',
      occupation: occupation ? occupation.trim() : '',
      education: education || '',
      photoPath,
      addedBy
    });

    await record.save();

    res.status(201).json({ success: true, message: 'Record added successfully!', record });
  } catch (error) {
    console.error('Add non-member error:', error);
    res.status(500).json({ success: false, message: 'Failed to add record. Please try again.' });
  }
});

// GET  /api/users/non-members  — public route to fetch all non-member records
router.get('/non-members', async (req, res) => {
  try {
    const records = await NonMemberRecord.find({}).sort({ addedAt: -1 }).populate('addedBy', 'fullName email');
    res.json({ success: true, records });
  } catch (error) {
    console.error('Fetch all non-members error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch records.' });
  }
});

// GET  /api/users/non-members/by-user/:userId  — fetch all records added by a member
router.get('/non-members/by-user/:userId', async (req, res) => {
  try {
    const records = await NonMemberRecord.find({ addedBy: req.params.userId }).sort({ addedAt: -1 });
    res.json({ success: true, records });
  } catch (error) {
    console.error('Fetch non-members error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch records.' });
  }
});

// DELETE  /api/users/non-members/:id  — delete a non-member record added by this member
router.delete('/non-members/:id', async (req, res) => {
  try {
    await NonMemberRecord.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Record deleted successfully.' });
  } catch (error) {
    console.error('Delete non-member error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete record.' });
  }
});

// ===================== FAMILY MEMBERS =====================

// POST /api/users/family/:userId/add — Add a family member (approved members only)
const familyUpload = upload.fields([{ name: 'familyMemberPhoto', maxCount: 1 }]);
router.post('/family/:userId/add', familyUpload, async (req, res) => {
  try {
    const { phone, password, name, relation, dateOfBirth, gender, occupation, memberPhone } = req.body;

    // Authenticate the requesting user
    if (!phone || !password) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const requestingUser = await User.findOne({ phone, password, status: 'approved' });
    if (!requestingUser) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or account not approved' });
    }

    // Verify they are modifying their own profile
    if (String(requestingUser._id) !== String(req.params.userId)) {
      return res.status(403).json({ success: false, message: 'You can only manage your own family members' });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Family member name is required' });
    }
    if (!relation || !relation.trim()) {
      return res.status(400).json({ success: false, message: 'Relation is required' });
    }

    const newMember = {
      name: name.trim(),
      relation: relation.trim(),
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      occupation: occupation || '',
      phone: memberPhone || '',
      photoPath: '',
      addedAt: new Date(),
      addedFrom: 'profile'
    };

    // Upload photo if provided
    if (req.files && req.files.familyMemberPhoto && req.files.familyMemberPhoto[0]) {
      newMember.photoPath = await uploadToCloudinary(req.files.familyMemberPhoto[0], 'photos');
    }

    requestingUser.familyMembers.push(newMember);
    await requestingUser.save();

    res.json({
      success: true,
      message: 'Family member added successfully',
      familyMembers: requestingUser.familyMembers
    });
  } catch (error) {
    console.error('Add family member error:', error);
    res.status(500).json({ success: false, message: 'Failed to add family member' });
  }
});

// PUT /api/users/family/:userId/edit/:memberId — Edit a family member (approved members only)
const familyEditUpload = upload.fields([{ name: 'familyMemberPhoto', maxCount: 1 }]);
router.put('/family/:userId/edit/:memberId', familyEditUpload, async (req, res) => {
  try {
    const { phone, password, name, relation, dateOfBirth, gender, occupation, memberPhone } = req.body;

    if (!phone || !password) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const requestingUser = await User.findOne({ phone, password, status: 'approved' });
    if (!requestingUser) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or account not approved' });
    }
    if (String(requestingUser._id) !== String(req.params.userId)) {
      return res.status(403).json({ success: false, message: 'You can only manage your own family members' });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Family member name is required' });
    }
    if (!relation || !relation.trim()) {
      return res.status(400).json({ success: false, message: 'Relation is required' });
    }

    const member = requestingUser.familyMembers.id(req.params.memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Family member not found' });
    }

    member.name = name.trim();
    member.relation = relation.trim();
    if (dateOfBirth) member.dateOfBirth = dateOfBirth;
    if (gender) member.gender = gender;
    member.occupation = occupation || '';
    member.phone = memberPhone || '';

    // Upload new photo if provided
    if (req.files && req.files.familyMemberPhoto && req.files.familyMemberPhoto[0]) {
      member.photoPath = await uploadToCloudinary(req.files.familyMemberPhoto[0], 'photos');
    }

    await requestingUser.save();
    res.json({
      success: true,
      message: 'Family member updated successfully',
      familyMembers: requestingUser.familyMembers
    });
  } catch (error) {
    console.error('Edit family member error:', error);
    res.status(500).json({ success: false, message: 'Failed to edit family member' });
  }
});

// DELETE /api/users/family/:userId/remove/:memberId — Remove a family member (approved members only)
router.delete('/family/:userId/remove/:memberId', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Authenticate the requesting user
    if (!phone || !password) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const requestingUser = await User.findOne({ phone, password, status: 'approved' });
    if (!requestingUser) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or account not approved' });
    }

    // Verify they are modifying their own profile
    if (String(requestingUser._id) !== String(req.params.userId)) {
      return res.status(403).json({ success: false, message: 'You can only manage your own family members' });
    }

    const memberIndex = requestingUser.familyMembers.findIndex(
      m => String(m._id) === String(req.params.memberId)
    );

    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: 'Family member not found' });
    }

    requestingUser.familyMembers.splice(memberIndex, 1);
    await requestingUser.save();

    res.json({
      success: true,
      message: 'Family member removed successfully',
      familyMembers: requestingUser.familyMembers
    });
  } catch (error) {
    console.error('Remove family member error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove family member' });
  }
});

module.exports = router;
