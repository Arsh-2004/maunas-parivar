// Quick script to check oath agreements in database
require('dotenv').config();
const mongoose = require('mongoose');
const OathAgreement = require('./models/OathAgreement');

async function checkOathData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    
    // Count total oath agreements
    const count = await OathAgreement.countDocuments();
    console.log(`\n📊 Total Oath Agreements: ${count}`);
    
    // Get all oath agreements
    const agreements = await OathAgreement.find().sort({ agreedAt: -1 }).limit(10);
    
    if (agreements.length > 0) {
      console.log('\n📋 Latest Oath Agreements:\n');
      agreements.forEach((agreement, index) => {
        console.log(`${index + 1}. Name: ${agreement.name}`);
        console.log(`   Mobile: ${agreement.mobileNumber}`);
        console.log(`   Agreed At: ${agreement.agreedAt}`);
        console.log(`   IP: ${agreement.ipAddress || 'N/A'}`);
        console.log('   ---');
      });
    } else {
      console.log('\n⚠️  No oath agreements found in database yet.');
      console.log('   Make sure to:');
      console.log('   1. Clear localStorage in browser');
      console.log('   2. Refresh the website');
      console.log('   3. Fill the oath form and click Agree');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  }
}

checkOathData();
