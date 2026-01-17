# Digital ID Card Feature - Installation Guide

## Overview
This feature automatically generates a professional digital ID card for each user after their registration is approved by admin. The ID card is generated in JPG format and can be downloaded from the user's profile dashboard.

## Installation Steps

### 1. Install Required Backend Package

The ID card generation feature requires the `canvas` package to create digital ID cards.

Navigate to the backend directory and run:

```bash
cd backend
npm install canvas@latest
```

**Note for Windows users**: Canvas requires build tools. If you encounter errors, you may need to install Windows Build Tools:
```bash
npm install --global windows-build-tools
```

Then retry installing canvas.

### 2. Verify Installation

After installation, ensure the package is in your backend `package.json`:

```json
{
  "dependencies": {
    "canvas": "^2.x.x",
    ...
  }
}
```

### 3. Restart Backend Server

After installation, restart your backend server:

```bash
npm start
# or
npm run dev
```

## How It Works

### Backend Flow:
1. When an admin approves a user registration via `/api/admin/approve/:id`
2. The system automatically generates a digital ID card using the `idCardGenerator.js` utility
3. The ID card is created with:
   - User name, father's name, date of birth
   - Membership tier (Silver/Gold/Diamond)
   - Unique ID (based on phone number)
   - Professional design with gradients
4. The ID card image is uploaded to Cloudinary
5. The URL is stored in the User model (`idCardPath` field)

### Frontend Flow:
1. User logs in and goes to "My Profile"
2. If user status is "approved" and ID card is ready:
   - Shows ID card preview in the profile
   - Shows a download button (JPG format)
   - Shows the generation date
3. If user status is "approved" but ID card is still generating:
   - Shows "ID Card being generated..." message
4. If user status is not "approved":
   - Shows "ID Card will be available after approval" message

## API Endpoints

### Approve User & Generate ID Card
**POST** `/api/admin/approve/:id`
- Requires: Admin authentication (x-admin-password header)
- Automatically generates and uploads ID card
- Returns: Updated user object with `idCardPath`

### Regenerate ID Card (Manual)
**POST** `/api/admin/regenerate-id-card/:id`
- Requires: Admin authentication (x-admin-password header)
- Regenerates the ID card for an already approved user
- Useful if user details changed or card needs update
- Returns: `idCardPath` URL

## Database Updates

The User model now includes:
```javascript
idCardPath: {
  type: String,
  default: null  // URL to the generated ID card on Cloudinary
},
idCardGeneratedAt: {
  type: Date,
  default: null  // When the ID card was generated
}
```

## Troubleshooting

### Canvas Installation Issues

**Error: "Node-pre-built binaries not available for your Node.js version"**
- Solution: Use `npm install canvas --build-from-source`

**Error on Mac: "Python 2 not found"**
- Solution: Install Python 3 and set: `npm config set python /usr/bin/python3`

**Error on Windows: "Could not find node-gyp"**
- Solution: Install Windows Build Tools: `npm install --global windows-build-tools`

### ID Card Not Generating

1. Check backend server is running
2. Verify `ADMIN_PASSWORD` environment variable is set
3. Check Cloudinary credentials in `.env`
4. Review backend console for error logs

### ID Card Not Showing in Profile

1. Verify user status is "approved"
2. Wait 5-10 seconds after approval (ID generation takes time)
3. Refresh the browser
4. Check browser console for API errors

## Features

✅ **Automatic Generation**: ID card auto-generates when user is approved
✅ **Professional Design**: Gradient backgrounds, proper formatting
✅ **Unique IDs**: Each card has a unique ID based on phone number
✅ **JPG Format**: Downloaded as JPG for universal compatibility
✅ **Cloud Storage**: Stored on Cloudinary for reliability
✅ **Bilingual**: Card details support English and can be extended for Hindi
✅ **Regenerate Option**: Admin can regenerate ID if needed

## Files Modified/Created

### New Files:
- `backend/middleware/idCardGenerator.js` - ID card generation utility

### Modified Files:
- `backend/models/User.js` - Added `idCardPath` and `idCardGeneratedAt` fields
- `backend/routes/adminRoutes.js` - Updated approve endpoint and added regenerate endpoint
- `src/pages/Profile.js` - Added ID card display section
- `src/pages/Profile.css` - Added ID card styling and animations

## Next Steps

1. Install canvas package: `npm install canvas@latest`
2. Restart backend server
3. Test by:
   - Registering a test user
   - Approving from admin dashboard
   - Check user profile for ID card
   - Download and verify JPG file

## Support

If you encounter any issues:
1. Check the backend console for errors
2. Verify all environment variables are set
3. Ensure Cloudinary is properly configured
4. Check network connectivity to Cloudinary
