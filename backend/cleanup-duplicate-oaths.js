// Script to remove duplicate oath agreements from the database
// Keeps only the first occurrence of each mobile number
// (prevents same phone being used multiple times with different names)

require('dotenv').config();
const mongoose = require('mongoose');
const OathAgreement = require('./models/OathAgreement');

async function cleanupDuplicateOaths() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get all oath agreements
    const allOaths = await OathAgreement.find().sort({ agreedAt: 1 });
    console.log(`\n📊 Total Oath Agreements in database: ${allOaths.length}`);
    
    // Track which mobile numbers we've seen
    const seenMobileNumbers = new Set();
    const duplicatesToDelete = [];
    
    // Separate originals from duplicates (by mobile number only)
    allOaths.forEach((oath) => {
      const mobileKey = oath.mobileNumber.trim();
      
      if (seenMobileNumbers.has(mobileKey)) {
        // This is a duplicate - mark for deletion
        duplicatesToDelete.push(oath._id);
        console.log(`❌ Duplicate found: ${oath.name} (${oath.mobileNumber}) - ID: ${oath._id}`);
      } else {
        // First occurrence of this mobile number - keep it
        seenMobileNumbers.add(mobileKey);
        console.log(`✅ Keeping: ${oath.name} (${oath.mobileNumber}) - ID: ${oath._id}`);
      }
    });
    
    console.log(`\n📋 Summary:`);
    console.log(`   - Unique mobile numbers: ${seenMobileNumbers.size}`);
    console.log(`   - Duplicates found: ${duplicatesToDelete.length}`);
    
    if (duplicatesToDelete.length > 0) {
      console.log(`\n🗑️  Deleting ${duplicatesToDelete.length} duplicate oath agreements...`);
      
      const result = await OathAgreement.deleteMany({
        _id: { $in: duplicatesToDelete }
      });
      
      console.log(`✅ Deleted ${result.deletedCount} duplicate records`);
    } else {
      console.log('\n✅ No duplicates found - database is clean!');
    }
    
    // Show final count
    const finalCount = await OathAgreement.countDocuments();
    console.log(`\n📊 Final Oath Agreements count: ${finalCount}`);
    
    // Show summary of unique mobile numbers
    const uniqueOaths = await OathAgreement.find();
    console.log(`\n📝 Final unique oath takers:`);
    uniqueOaths.forEach((oath) => {
      console.log(`   - ${oath.name} (${oath.mobileNumber})`);
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupDuplicateOaths();
