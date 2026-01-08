const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use disk storage temporarily, then upload to Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Function to upload file to Cloudinary and delete local file
const uploadToCloudinary = async (filePath, folder) => {
  try {
    // Determine resource type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const isPDF = ext === '.pdf';
    
    const uploadOptions = {
      folder: `maunas-parivar/${folder}`,
      resource_type: isPDF ? 'raw' : 'image'
    };
    
    console.log(`Uploading ${isPDF ? 'PDF' : 'image'} to Cloudinary:`, filePath);
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    console.log('Cloudinary upload success:', result.secure_url);
    
    // Delete local file after successful upload
    fs.unlinkSync(filePath);
    
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    console.error('File path:', filePath);
    throw error;
  }
};

// Function to generate signed URL for secure access to raw files (PDFs)
const getSignedUrl = (publicId, resourceType = 'raw') => {
  try {
    // Generate a signed URL that expires in 1 hour
    const signedUrl = cloudinary.url(publicId, {
      resource_type: resourceType,
      type: 'upload',
      sign_url: true,
      secure: true
    });
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  getSignedUrl,
  cloudinary
};
