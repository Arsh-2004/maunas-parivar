const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

async function fixTiers() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Update ALL users without membershipTier to silver
    const result = await User.updateMany(
      { $or: [
        { membershipTier: { $exists: false } },
        { membershipTier: null }
      ]},
      { $set: { membershipTier: 'silver' } }
    );

    console.log(`Updated ${result.modifiedCount} users with default silver tier`);

    // List all users to see their data
    const allUsers = await User.find({}, 'fullName phone membershipTier status');
    console.log('\nAll Users:');
    allUsers.forEach(u => {
      console.log(`- ${u.fullName} (${u.phone}): ${u.membershipTier || 'NO TIER'} [${u.status}]`);
    });

    // Update first approved user to diamond for testing
    const firstApproved = await User.findOne({ status: 'approved' });
    if (firstApproved) {
      await User.updateOne(
        { _id: firstApproved._id },
        { $set: { membershipTier: 'diamond' } }
      );
      console.log(`\nSet ${firstApproved.fullName} to Diamond tier`);
    }

    // Update Kaushal Dahal to approved and diamond
    const kaushal = await User.updateOne(
      { phone: '1234567890' },
      { $set: { 
        status: 'approved',
        membershipTier: 'diamond',
        approvedAt: new Date()
      }}
    );
    
    if (kaushal.modifiedCount > 0) {
      console.log('\n✅ Updated Kaushal Dahal to APPROVED + DIAMOND tier');
    }

    await mongoose.connection.close();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixTiers();
