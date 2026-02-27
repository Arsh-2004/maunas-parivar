const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const User = require('./models/User');

const testIDCardGeneration = async () => {
  try {
    console.log('📋 Testing ID Card Generation Full Flow');
    console.log('=============================================\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://kaushalmaunas:Kaush%401234@maunasparivar.zfhro.mongodb.net/maunas-parivar?retryWrites=true&w=majority');
    console.log('✅ Connected to MongoDB\n');

    // Check if test user already exists
    console.log('🔍 Checking for existing test user...');
    let user = await User.findOne({ phone: '9999999999' });
    
    if (!user) {
      console.log('📝 Creating new test user...');
      user = new User({
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '9999999999',
        fathersName: 'Test Father',
        dateOfBirth: '1990-01-01',
        address: 'Test Address',
        city: 'Test City',
        state: 'Delhi',
        zipCode: '110001',
        status: 'pending',
        password: 'hashedPassword123'
      });
      await user.save();
      console.log('✅ Test user created\n');
    } else {
      console.log('✅ Test user already exists, resetting to pending...\n');
      user.status = 'pending';
      user.idCardPath = null;
      user.idCardGeneratedAt = null;
      await user.save();
    }

    console.log('👤 Test User Details:');
    console.log('   Name:', user.fullName);
    console.log('   Phone:', user.phone);
    console.log('   Email:', user.email);
    console.log('   ID:', user._id, '\n');

    // Get admin password from env
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';
    
    console.log('🔐 Approving user via API...');
    console.log('⏳ Waiting for ID card generation...\n');
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/approve/${user._id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${adminPassword}`
          }
        }
      );

      console.log('✅ User approved successfully!');
      const approvedUser = response.data.user;
      
      if (approvedUser.idCardPath) {
        console.log('\n✅✅✅ ID CARD GENERATION SUCCESS! ✅✅✅');
        console.log('📥 Download URL:', approvedUser.idCardPath);
        console.log('⏰ Generated At:', approvedUser.idCardGeneratedAt);
      } else {
        console.log('\n⚠️  User approved but ID card not generated');
        console.log('   Status:', approvedUser.status);
        console.log('   ID Card Path:', approvedUser.idCardPath);
        console.log('\n📋 Check the backend terminal for error logs ⬆️');
      }
    } catch (apiError) {
      console.error('❌ API Error:', apiError.response?.data || apiError.message);
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Test error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

testIDCardGeneration();
