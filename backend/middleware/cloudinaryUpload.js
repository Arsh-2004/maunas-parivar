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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const imageExt = ['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp'];
    const imageMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
    const isImage = imageExt.includes(ext) || imageMime.includes((file.mimetype || '').toLowerCase());

    const pdfExt = ext === '.pdf';
    const pdfMime = (file.mimetype || '').toLowerCase() === 'application/pdf';
    const isPdf = pdfExt || pdfMime;

    const documentFields = ['idProof', 'addressProof', 'donationDocument'];
    const imageOnlyFields = ['photo', 'familyMemberPhoto', 'image'];

    if (documentFields.includes(file.fieldname)) {
      if (isPdf || isImage) {
        return cb(null, true);
      }
      return cb(new Error('Only PDF or image files are allowed for documents.'));
    }

    if (imageOnlyFields.includes(file.fieldname)) {
      if (isImage) {
        return cb(null, true);
      }
      return cb(new Error('Only image files are allowed for photos.'));
    }

    if (isImage || isPdf) {
      return cb(null, true);
    }

    cb(new Error('Unsupported file type. Please upload PDF or image files.'));
  }
});

// Function to upload file to Cloudinary and delete local file
const uploadToCloudinary = async (filePath, folder) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const isPdf = ext === '.pdf';
    const uploadOptions = {
      folder: `maunas-parivar/${folder}`,
      resource_type: isPdf ? 'raw' : 'image'
    };
    
    console.log(`Uploading ${isPdf ? 'document' : 'image'} to Cloudinary:`, filePath);
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
