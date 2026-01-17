const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const User = require('./models/User');

const testIDCardGeneration = async () => {
  try {
    console.log('📋 Testing ID Card Generation');
    console.log('=====================================\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://kaushalmaunas:Kaush%401234@maunasparivar.zfhro.mongodb.net/maunas-parivar?retryWrites=true&w=majority');
    console.log('✅ Connected to MongoDB\n');

    // Find a pending user
    console.log('🔍 Looking for pending users...');
    const pendingUser = await User.findOne({ status: 'pending' });
    
    if (!pendingUser) {
      console.log('❌ No pending users found');
      console.log('📝 Please register a user first\n');
      mongoose.disconnect();
      return;
    }

    console.log('✅ Found pending user:', pendingUser.fullName);
    console.log('   Phone:', pendingUser.phone);
    console.log('   ID:', pendingUser._id, '\n');

    // Get admin password from env
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';
    
    console.log('🔐 Approving user via API...');
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/approve/${pendingUser._id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${adminPassword}`
          }
        }
      );

      console.log('✅ User approved successfully!');
      console.log('   ID Card Path:', response.data.user.idCardPath);
      console.log('   Generated At:', response.data.user.idCardGeneratedAt, '\n');

      if (response.data.user.idCardPath) {
        console.log('✅ ID CARD GENERATION SUCCESSFUL!');
        console.log('📥 Download link:', response.data.user.idCardPath);
      } else {
        console.log('⚠️ User approved but ID card path is still null');
        console.log('📋 Check backend logs for generation errors above ⬆️');
      }
    } catch (apiError) {
      console.error('❌ API Error:', apiError.response?.data || apiError.message);
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Test error:', error.message);
    process.exit(1);
  }
};

testIDCardGeneration();
