const multer = require('multer');
const storage = multer.memoryStorage();

// File filter for PDF and images
const fileFilter = (req, file, cb) => {
  // Allow images for photo, image fields (events, gallery, profile)
  if (file.fieldname === 'photo' || file.fieldname === 'image') {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Only JPG/PNG images are allowed for photo!'), false);
    }
  } else {
    // Allow only PDF for document fields
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for documents!'), false);
    }
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
