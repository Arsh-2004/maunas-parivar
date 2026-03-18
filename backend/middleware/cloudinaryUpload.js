const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const MAX_FILE_SIZE_BYTES = Number(process.env.UPLOAD_MAX_FILE_SIZE_BYTES || 6 * 1024 * 1024);
const MAX_UPLOAD_FILES = Number(process.env.UPLOAD_MAX_FILES || 24);

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname || '').toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype || '');

  if (mimetype && extname) {
    return cb(null, true);
  }

  return cb(new Error('Only JPEG, JPG, and PNG images are allowed!'));
};

const upload = multer({ 
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_UPLOAD_FILES,
    fields: 80
  },
  fileFilter
});

const uploadBufferToCloudinary = (buffer, folder, mimeType) => {
  const uploadOptions = {
    folder: `maunas-parivar/${folder}`,
    resource_type: 'auto',
    use_filename: true,
    unique_filename: true
  };

  if ((mimeType || '').startsWith('image/')) {
    uploadOptions.quality = 'auto:good';
    uploadOptions.fetch_format = 'auto';
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });

    uploadStream.end(buffer);
  });
};

// Accepts multer memory file object or raw Buffer.
const uploadToCloudinary = async (fileInput, folder) => {
  try {
    if (!fileInput) {
      throw new Error('No file data provided for upload');
    }

    // Keep a legacy fallback so old utility scripts passing file paths do not crash.
    if (typeof fileInput === 'string') {
      const result = await cloudinary.uploader.upload(fileInput, {
        folder: `maunas-parivar/${folder}`,
        resource_type: 'auto'
      });
      return result.secure_url;
    }

    const buffer = Buffer.isBuffer(fileInput) ? fileInput : fileInput.buffer;
    const mimeType = fileInput.mimetype || '';

    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      throw new Error('Invalid file buffer for Cloudinary upload');
    }

    const result = await uploadBufferToCloudinary(buffer, folder, mimeType);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
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
