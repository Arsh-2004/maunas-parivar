// Quick script to check user data in database
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUserData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    
    // Find approved users
    const users = await User.find({ status: 'approved' })
      .select('fullName phone photoPath membershipTier')
      .limit(5);
    
    console.log('\n📋 Approved Users with Photos:');
    console.log('===================================');
    
    if (users.length === 0) {
      console.log('⚠️  No approved users found');
    } else {
      users.forEach((user, i) => {
        console.log(`\n${i+1}. Name: ${user.fullName}`);
        console.log(`   Phone: ${user.phone}`);
        console.log(`   Tier: ${user.membershipTier || 'N/A'}`);
        console.log(`   Photo Stored: ${user.photoPath ? 'YES ✓' : 'NO ✗'}`);
        if (user.photoPath) {
          console.log(`   Photo URL: ${user.photoPath.substring(0, 80)}...`);
        }
      });
    }
    
    // Count stats
    const totalUsers = await User.countDocuments();
    const approvedUsers = await User.countDocuments({ status: 'approved' });
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    
    console.log('\n📊 Statistics:');
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Approved: ${approvedUsers}`);
    console.log(`   Pending: ${pendingUsers}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkUserData();
