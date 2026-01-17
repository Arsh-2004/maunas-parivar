const mongoose = require('mongoose');
const User = require('./models/User');
const { generateIDCard } = require('./middleware/idCardGenerator');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const regenerateAllIDCards = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all approved users
    const approvedUsers = await User.find({ status: 'approved' });
    console.log(`📊 Found ${approvedUsers.length} approved users\n`);

    if (approvedUsers.length === 0) {
      console.log('No approved users to regenerate');
      mongoose.disconnect();
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const user of approvedUsers) {
      try {
        console.log(`🔄 Regenerating ID card for: ${user.fullName} (${user.phone})`);
        
        // Generate new ID card
        const idCardBuffer = await generateIDCard(user);
        
        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              public_id: `id-cards/${user._id}-${Date.now()}`,
              format: 'jpg',
              quality: 'auto:good'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(idCardBuffer);
        });

        // Update user
        user.idCardPath = uploadResult.secure_url;
        user.idCardGeneratedAt = new Date();
        await user.save();
        
        console.log(`✅ Updated: ${uploadResult.secure_url.substring(0, 50)}...\n`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error for ${user.fullName}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 REGENERATION COMPLETE');
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

regenerateAllIDCards();
