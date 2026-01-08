# 📸 Cloudinary Integration Guide - Upload Files to Cloud

## Why Cloudinary?
- ✅ **Free tier:** 25GB storage, 25GB bandwidth/month
- ✅ **Persistent storage:** Files never disappear
- ✅ **Fast CDN:** Images load super fast worldwide
- ✅ **Image optimization:** Automatic compression

---

## Step 1: Create Cloudinary Account (2 minutes)

1. **Go to:** https://cloudinary.com/users/register_free
2. **Sign up** with email or Google
3. **Verify email** and login
4. **Go to Dashboard:** https://console.cloudinary.com/

---

## Step 2: Get Your API Credentials (1 minute)

On the Dashboard, you'll see:

```
Cloud Name: your-cloud-name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz
```

**Copy these values!** You'll need them.

---

## Step 3: Install Cloudinary Package (Local)

Open terminal in the **backend** folder:

```bash
cd backend
npm install cloudinary multer-storage-cloudinary
```

---

## Step 4: Update Backend Environment Variables

Open `backend/.env` and add:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

**Replace with your actual values from Step 2!**

---

## Step 5: Update Render Environment Variables

1. Go to **Render Dashboard:** https://dashboard.render.com
2. Select your **backend service**
3. Go to **Environment** tab
4. Click **"Add Environment Variable"**
5. Add these three variables:
   ```
   CLOUDINARY_CLOUD_NAME = your-cloud-name
   CLOUDINARY_API_KEY = 123456789012345
   CLOUDINARY_API_SECRET = abcdefghijklmnopqrstuvwxyz
   ```
6. Click **"Save Changes"**
7. Wait for automatic redeployment (2-3 minutes)

---

## Step 6: Create New Upload Middleware

Create file: `backend/middleware/cloudinaryUpload.js`

```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for different file types
const createStorage = (folder, allowedFormats) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `maunas-parivar/${folder}`,
      allowed_formats: allowedFormats,
      resource_type: 'auto'
    }
  });
};

// Storage for images (photos)
const photoStorage = createStorage('photos', ['jpg', 'jpeg', 'png']);

// Storage for documents (PDFs)
const documentStorage = createStorage('documents', ['pdf']);

// Create multer upload instances
const uploadPhoto = multer({ 
  storage: photoStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadDocument = multer({ 
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Combined upload for registration (multiple file types)
const uploadRegistration = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      // Determine folder and format based on field name
      let folder = 'maunas-parivar/';
      let allowed_formats = [];
      
      if (file.fieldname === 'photo') {
        folder += 'photos';
        allowed_formats = ['jpg', 'jpeg', 'png'];
      } else if (file.fieldname === 'idProof' || file.fieldname === 'addressProof' || file.fieldname === 'donationDocument') {
        folder += 'documents';
        allowed_formats = ['pdf'];
      }
      
      return {
        folder: folder,
        allowed_formats: allowed_formats,
        resource_type: 'auto'
      };
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = {
  uploadPhoto,
  uploadDocument,
  uploadRegistration,
  cloudinary
};
```

---

## Step 7: Update User Registration Route

Open `backend/routes/userRoutes.js` and update:

**BEFORE (Line 1-5):**
```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OathAgreement = require('../models/OathAgreement');
const upload = require('../middleware/upload');
```

**AFTER:**
```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OathAgreement = require('../models/OathAgreement');
const { uploadRegistration } = require('../middleware/cloudinaryUpload');
```

**BEFORE (Line ~65):**
```javascript
router.post('/register', upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'donationDocument', maxCount: 1 }
]), async (req, res) => {
```

**AFTER:**
```javascript
router.post('/register', uploadRegistration.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'donationDocument', maxCount: 1 }
]), async (req, res) => {
```

**BEFORE (Line ~120-125):**
```javascript
      idProofPath: req.files.idProof[0].filename,
      addressProofPath: req.files.addressProof[0].filename,
      photoPath: req.files.photo[0].filename,
      donationDocumentPath: req.files.donationDocument ? req.files.donationDocument[0].filename : null,
```

**AFTER:**
```javascript
      idProofPath: req.files.idProof[0].path, // Cloudinary URL
      addressProofPath: req.files.addressProof[0].path, // Cloudinary URL
      photoPath: req.files.photo[0].path, // Cloudinary URL
      donationDocumentPath: req.files.donationDocument ? req.files.donationDocument[0].path : null,
```

---

## Step 8: Update Admin Routes

Open `backend/routes/adminRoutes.js`:

**BEFORE (Line 1-8):**
```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const OathAgreement = require('../models/OathAgreement');
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
```

**AFTER:**
```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const OathAgreement = require('../models/OathAgreement');
const { uploadPhoto } = require('../middleware/cloudinaryUpload');
```

**Find and update Event upload:**
```javascript
// BEFORE:
router.post('/events', upload.single('image'), adminAuth, async (req, res) => {

// AFTER:
router.post('/events', uploadPhoto.single('image'), adminAuth, async (req, res) => {
```

**Update event image path:**
```javascript
// BEFORE:
imagePath: req.file ? req.file.filename : null,

// AFTER:
imagePath: req.file ? req.file.path : null,
```

**Find and update Gallery upload:**
```javascript
// BEFORE:
router.post('/gallery', upload.single('photo'), adminAuth, async (req, res) => {

// AFTER:
router.post('/gallery', uploadPhoto.single('photo'), adminAuth, async (req, res) => {
```

**Update gallery photo path:**
```javascript
// BEFORE:
photoPath: req.file.filename,

// AFTER:
photoPath: req.file.path,
```

---

## Step 9: Update Frontend Image URLs

Open `src/pages/Profile.js`:

**BEFORE (Line ~170):**
```javascript
src={`${API_URL.replace('/api', '')}/uploads/${user.photoPath}`}
```

**AFTER:**
```javascript
src={user.photoPath}
```

Open `src/pages/AdminDashboard.js`:

**Find all instances of:**
```javascript
`${API_URL.replace('/api', '')}/uploads/${...}`
```

**Replace with just:**
```javascript
{user.photoPath}  // or event.imagePath, gallery.photoPath, etc.
```

---

## Step 10: Test Locally

1. **Stop all Node processes:**
   ```bash
   Get-Process -Name node | Stop-Process -Force
   ```

2. **Start backend:**
   ```bash
   cd backend
   node server.js
   ```

3. **In another terminal, start frontend:**
   ```bash
   npm start
   ```

4. **Test registration:**
   - Go to Membership page
   - Fill form and upload files
   - Submit
   - Check Cloudinary dashboard - you should see uploaded files!

---

## Step 11: Deploy to Production

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Integrate Cloudinary for file uploads"
   git push origin main
   ```

2. **Render will auto-deploy** (if connected to GitHub)
   - Or manually: Render Dashboard → Manual Deploy

3. **Redeploy Netlify:**
   - Netlify Dashboard → Deploys → Clear cache and deploy

---

## Step 12: Verify Everything Works

1. **Test online registration** with file uploads
2. **Check Cloudinary dashboard** - files should appear
3. **Check admin panel** - images should load
4. **Check member cards** - photos should display

---

## 🎉 Benefits After Integration

✅ **Files never disappear** - permanent storage
✅ **Fast loading** - Cloudinary CDN worldwide
✅ **Automatic optimization** - smaller file sizes
✅ **Works on free plan** - no paid Render needed
✅ **Organized folders** - photos, documents separate

---

## 📊 Cloudinary Dashboard

After setup, check: https://console.cloudinary.com/

You'll see:
- **Media Library:** All uploaded files
- **Folders:** maunas-parivar/photos, maunas-parivar/documents
- **Usage stats:** Storage, bandwidth used

---

## 🔧 Troubleshooting

### Error: "Missing required parameter - public_id"
- Check environment variables are set correctly
- Restart backend after adding variables

### Files not uploading
- Check Cloudinary credentials in .env
- Check file size limits (5MB photos, 10MB docs)
- Check browser console for errors

### Images not displaying
- Check if photoPath contains full Cloudinary URL
- Example: `https://res.cloudinary.com/your-cloud/image/upload/v1234567890/maunas-parivar/photos/abc123.jpg`

### Old uploaded files still on local server
- Delete `backend/uploads` folder - not needed anymore
- Files are now on Cloudinary

---

## 💰 Cloudinary Free Tier Limits

- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** 25,000/month
- **Video:** 500 MB storage

This is MORE than enough for a community website!

---

## 🚀 Optional: Image Optimization

Cloudinary can automatically optimize images. In your frontend, use:

```javascript
// Instead of:
src={user.photoPath}

// Use (adds optimization):
src={user.photoPath.replace('/upload/', '/upload/w_500,h_500,c_fill,q_auto,f_auto/')}
```

This makes images load 5x faster!

---

Need help? Check:
- Cloudinary Docs: https://cloudinary.com/documentation/node_integration
- Error logs in Render dashboard
- Browser console (F12) for frontend errors
