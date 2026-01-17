const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const debugIDCard = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get the first approved user
    const user = await User.findOne({ status: 'approved' });
    
    if (!user) {
      console.log('No approved users found');
      mongoose.disconnect();
      return;
    }

    console.log('\n📊 APPROVED USER FULL RECORD:\n');
    console.log('Name:', user.fullName);
    console.log('Phone:', user.phone);
    console.log('Status:', user.status);
    console.log('Approved At:', user.approvedAt);
    console.log('\n🎨 ID CARD INFO:');
    console.log('ID Card Path:', user.idCardPath);
    console.log('ID Card Generated At:', user.idCardGeneratedAt);
    console.log('\n📋 Full Object Keys:');
    console.log(Object.keys(user.toObject()));

    // Try to fetch via API to see what's returned
    const apiUrl = 'http://localhost:5000/api/users/profile/' + user.phone;
    console.log('\n🌐 Fetching via API:', apiUrl);
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.success) {
      console.log('\n✅ API Response user.idCardPath:', data.user.idCardPath ? '✅ Present' : '❌ Missing');
      if (!data.user.idCardPath && user.idCardPath) {
        console.log('⚠️ ISSUE FOUND: Database has idCardPath but API is not returning it!');
      }
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

debugIDCard();
