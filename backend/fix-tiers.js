const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

// Script retained for legacy reference — tier system has been removed.
// Now simply lists all users and their approval status.
async function listUsers() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const allUsers = await User.find({}, 'fullName phone status');
    console.log('\nAll Users:');
    allUsers.forEach(u => {
      console.log(`- ${u.fullName} (${u.phone}): [${u.status}]`);
    });

    await mongoose.connection.close();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listUsers();

