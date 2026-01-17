const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkIDCardIssue = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find approved users
    const approvedUsers = await User.find({ status: 'approved' }).limit(5);
    
    console.log('\n📊 APPROVED USERS STATUS:\n');
    approvedUsers.forEach(user => {
      console.log(`👤 ${user.fullName} (${user.phone})`);
      console.log(`   Status: ${user.status}`);
      console.log(`   ID Card Path: ${user.idCardPath ? '✅ ' + user.idCardPath.substring(0, 50) + '...' : '❌ NULL'}`);
      console.log(`   Generated At: ${user.idCardGeneratedAt || '❌ NULL'}`);
      console.log('');
    });

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkIDCardIssue();
