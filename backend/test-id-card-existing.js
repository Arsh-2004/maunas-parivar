const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const User = require('./models/User');

const testIDCardWithExistingUser = async () => {
  try {
    console.log('📋 Testing ID Card Generation with Existing User');
    console.log('=============================================\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://kaushalmaunas:Kaush%401234@maunasparivar.zfhro.mongodb.net/maunas-parivar?retryWrites=true&w=majority');
    console.log('✅ Connected to MongoDB\n');

    // Find any user with documents
    console.log('🔍 Looking for existing registered users...');
    const existingUser = await User.findOne({ photoPath: { $exists: true, $ne: null } });
    
    if (!existingUser) {
      console.log('❌ No users with photos found in database');
      console.log('📝 Please register a user through the web app first');
      mongoose.disconnect();
      return;
    }

    console.log('✅ Found existing user:', existingUser.fullName);
    console.log('   Phone:', existingUser.phone);
    console.log('   Status:', existingUser.status);
    console.log('   Has Photo:', !!existingUser.photoPath);
    console.log('   ID:', existingUser._id, '\n');

    if (existingUser.status === 'approved' && !existingUser.idCardPath) {
      console.log('⚠️ User is approved but has NO ID Card generated!');
      console.log('   This is the issue we\'re debugging.\n');
    }

    // Reset to pending if already approved
    if (existingUser.status === 'approved') {
      console.log('🔄 Resetting user to pending for re-approval test...');
      existingUser.status = 'pending';
      existingUser.idCardPath = null;
      existingUser.idCardGeneratedAt = null;
      // Keep all other fields as-is
      const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        {
          status: 'pending',
          idCardPath: null,
          idCardGeneratedAt: null
        },
        { new: true }
      );
      console.log('✅ Reset complete\n');
    }

    // Get admin password
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';
    
    console.log('🔐 Approving user via API...');
    console.log('⏳ Waiting for ID card generation...\n');
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/approve/${existingUser._id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${adminPassword}`
          }
        }
      );

      console.log('\n✅ User approval API response received');
      const approvedUser = response.data.user;
      
      console.log('📊 Response Details:');
      console.log('   Status:', approvedUser.status);
      console.log('   Approved At:', approvedUser.approvedAt);
      console.log('   ID Card Path:', approvedUser.idCardPath ? '✅ SET' : '❌ NULL');
      console.log('   ID Card Generated At:', approvedUser.idCardGeneratedAt || '❌ NULL\n');
      
      if (approvedUser.idCardPath) {
        console.log('✅✅✅ SUCCESS! ID CARD GENERATION WORKING! ✅✅✅');
        console.log('\n📥 ID Card Download URL:');
        console.log('   ' + approvedUser.idCardPath);
        console.log('\n⏰ Generated At:', approvedUser.idCardGeneratedAt);
      } else {
        console.log('\n❌ FAILURE: ID Card not generated despite approval');
        console.log('   User is approved but idCardPath is still NULL');
        console.log('\n⚠️  This means one of these happened:');
        console.log('   1. Canvas failed to create the image');
        console.log('   2. Cloudinary upload failed');
        console.log('   3. Database save failed');
        console.log('\n📋 CHECK BACKEND TERMINAL ABOVE FOR ERROR LOGS!');
      }
    } catch (apiError) {
      if (apiError.response) {
        console.error('❌ API Error:', apiError.response.status);
        console.error('Response:', apiError.response.data);
      } else {
        console.error('❌ Connection Error:', apiError.message);
      }
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Test error:', error.message);
    process.exit(1);
  }
};

testIDCardWithExistingUser();
