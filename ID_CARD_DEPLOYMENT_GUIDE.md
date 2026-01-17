# Digital ID Card Feature - Deployment Guide

## Pre-Deployment Checklist

- [ ] Canvas package installed: `npm install canvas@latest`
- [ ] Backend server tested locally
- [ ] ID card generation tested with test user
- [ ] Cloudinary credentials verified
- [ ] Download functionality tested
- [ ] Mobile responsiveness verified
- [ ] Error handling tested

---

## Step-by-Step Deployment

### Phase 1: Backend Preparation

#### 1.1 Install Canvas Package
```bash
cd backend
npm install canvas@latest
```

**Troubleshooting:**
- If installation fails, install build tools first
- Windows: `npm install --global windows-build-tools`
- Mac: Install Xcode Command Line Tools
- Linux: `sudo apt-get install build-essential`

#### 1.2 Verify Package Installation
```bash
npm list canvas
```

Expected output shows canvas version (e.g., `canvas@2.11.0`)

#### 1.3 Update package.json
Ensure the following in `backend/package.json`:
```json
{
  "dependencies": {
    "canvas": "^2.11.0",
    "cloudinary": "^2.8.0",
    ...
  }
}
```

---

### Phase 2: Backend Testing (Local)

#### 2.1 Start Backend Server
```bash
npm start
# or
npm run dev
```

Expected output:
```
Server running on port 5000
Database connected
```

#### 2.2 Test Admin Endpoints
```bash
# Check if routes are accessible
curl -X GET http://localhost:5000/api/admin/pending \
  -H "x-admin-password: your_password"
```

#### 2.3 Test ID Card Generation
Using Postman or similar:
```
PUT http://localhost:5000/api/admin/approve/{userId}
Header: x-admin-password: your_password
```

Expected Response:
```json
{
  "success": true,
  "user": {
    "idCardPath": "https://cloudinary.../...",
    "idCardGeneratedAt": "2024-01-17T10:30:00Z"
  }
}
```

---

### Phase 3: Frontend Testing (Local)

#### 3.1 Run Frontend Development Server
```bash
npm start
```

#### 3.2 Test User Registration
1. Navigate to /membership
2. Register test user
3. Submit registration

#### 3.3 Test Admin Approval
1. Login as admin
2. Go to admin dashboard
3. Find pending user
4. Click approve
5. Verify no errors in console

#### 3.4 Test Profile Display
1. Logout from admin
2. Login as registered user
3. Go to profile
4. Verify ID card section appears
5. Download JPG file

#### 3.5 Verify Download
1. Check file downloaded correctly
2. Open JPG in image viewer
3. Verify all user details visible
4. Check file name format

---

### Phase 4: Production Deployment

#### 4.1 Update Production Environment Variables
Verify these in production `.env`:
```
# Cloudinary
CLOUDINARY_NAME=your_production_name
CLOUDINARY_API_KEY=your_production_key
CLOUDINARY_API_SECRET=your_production_secret

# Admin
ADMIN_PASSWORD=your_strong_password

# Database
MONGODB_URI=your_production_uri

# Frontend
REACT_APP_API_URL=https://your-api-domain.com/api
```

#### 4.2 Build Frontend
```bash
# In frontend directory
npm run build
```

Expected output:
```
> Build successful
> Build directory: ./build
```

#### 4.3 Deploy Backend
Using your hosting platform (Render, Heroku, etc.):

```bash
# Example for Render/Heroku
git add .
git commit -m "Add digital ID card feature"
git push origin main
# Platform automatically deploys
```

Or manually:
```bash
# Copy files to production server
scp -r backend/* user@server:/app/backend/

# Install dependencies
ssh user@server "cd /app/backend && npm install"

# Restart service
ssh user@server "systemctl restart app"
```

#### 4.4 Deploy Frontend
Using your hosting platform (Netlify, Vercel, etc.):

```bash
# Example for Netlify
npm run build
# Deploy build folder
```

Or copy to web server:
```bash
# Copy built files
scp -r build/* user@server:/var/www/html/
```

#### 4.5 Verify Production Deployment
1. Open production URL
2. Register test user
3. Approve from admin
4. Login and check profile
5. Download ID card
6. Verify in production database

---

## Post-Deployment Verification

### Automated Tests
```bash
# Test endpoint availability
curl -X GET https://your-api-domain.com/api/admin/pending \
  -H "x-admin-password: $ADMIN_PASSWORD"

# Test ID card generation
curl -X PUT https://your-api-domain.com/api/admin/approve/{userId} \
  -H "x-admin-password: $ADMIN_PASSWORD"
```

### Manual Testing
1. **User Registration**: Complete full registration
2. **Admin Approval**: Test approval workflow
3. **ID Card Display**: Verify profile shows card
4. **Download**: Test download functionality
5. **Mobile**: Test on mobile device
6. **Different Tiers**: Test with SILVER/GOLD/DIAMOND

### Database Verification
```javascript
// Check Mongo for ID cards
db.users.find({ idCardPath: { $ne: null } }).count()

// Recent cards
db.users.find({ 
  status: 'approved',
  idCardGeneratedAt: { $gte: new Date('2024-01-17') }
}).pretty()
```

### Cloudinary Verification
1. Login to Cloudinary dashboard
2. Check id-cards folder exists
3. Verify images are uploading
4. Check storage usage

---

## Rollback Plan

If issues occur in production:

### Quick Rollback
```bash
# Git rollback
git revert HEAD
git push origin main

# Or restore previous version
git checkout previous-tag
git push origin main --force
```

### Database Cleanup
```javascript
// If needed, remove generated ID cards
db.users.updateMany(
  { status: 'approved' },
  { $unset: { idCardPath: 1, idCardGeneratedAt: 1 } }
)
```

### API Fallback
If ID card generation fails:
1. Approval still succeeds (fails gracefully)
2. Users see "ID card unavailable" message
3. Admin can retry via regenerate endpoint

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Backend logs for errors
- [ ] Cloudinary upload success rate
- [ ] User profile page loads correctly
- [ ] Download functionality working

### Weekly Checks
- [ ] ID card generation success rate
- [ ] Database backup completion
- [ ] Storage usage trends
- [ ] Performance metrics

### Monthly Checks
- [ ] Update canvas library if patches available
- [ ] Review Cloudinary usage
- [ ] Check for unused ID cards
- [ ] Verify design still matches brand

### Logs to Monitor
```bash
# Backend logs
tail -f /var/log/app/backend.log | grep "ID card"
tail -f /var/log/app/backend.log | grep "error"

# Watch Cloudinary uploads
# Dashboard → Media Library → Uploads folder
```

---

## Performance Optimization

### Reduce Image Size
Edit `idCardGenerator.js`:
```javascript
const uploadResult = await new Promise(...{
  quality: 'auto:good'  // Already optimized
  // Can use 'auto' for even smaller files
});
```

### Caching Strategy
```javascript
// Cache ID card URLs in Redis (optional)
const redis = require('redis');
const client = redis.createClient();

// Get cached card
const cachedCard = await client.get(`idcard:${userId}`);

// Set cache
await client.setex(`idcard:${userId}`, 86400, cardPath);
```

### Database Indexing
```javascript
// Ensure indexes for faster queries
db.users.createIndex({ status: 1 });
db.users.createIndex({ idCardPath: 1 });
db.users.createIndex({ idCardGeneratedAt: 1 });
```

---

## Troubleshooting in Production

### Issue: ID Cards Not Generating
```javascript
// Check backend logs
logs: "Error: canvas not found"

// Solution:
cd backend && npm install canvas@latest
npm start
```

### Issue: Cloudinary Upload Failing
```javascript
// Check credentials in .env
// Verify Cloudinary account active
// Check storage quota

// Test Cloudinary directly
node -e "const c=require('cloudinary').v2; 
         c.config({cloud_name:'...', api_key:'...', api_secret:'...'}); 
         console.log('Connected:', c.config())"
```

### Issue: Download Failing
```javascript
// Check CORS headers
// Verify Cloudinary URL is accessible
// Check browser console for errors
```

### Issue: Performance Slow
```javascript
// Check server resources
ps aux | grep node

// Check database
db.users.countDocuments()
db.users.stats()
```

---

## Security Checklist

- [ ] Admin password is strong (12+ characters, mixed case, numbers)
- [ ] Cloudinary credentials are never committed to git
- [ ] HTTPS enabled for all endpoints
- [ ] CORS properly configured
- [ ] Rate limiting on approve endpoint
- [ ] Backup of database before deployment
- [ ] Cloudinary backup enabled

---

## Performance Metrics

### Expected Performance
| Metric | Target | Actual |
|--------|--------|--------|
| ID Generation Time | < 2 seconds | - |
| Cloudinary Upload | < 3 seconds | - |
| Profile Load Time | < 1 second | - |
| Download Speed | > 5 MB/s | - |

### Monitor These
```bash
# Response time
curl -w "@curl-format.txt" -o /dev/null -s https://your-api.com/api/admin/pending

# Database query time
db.setProfilingLevel(1)
db.system.profile.find().pretty()

# Cloudinary metrics
# Dashboard → Reports → Usage
```

---

## Documentation URLs

After deployment, ensure team can access:
- ✅ Setup Guide: `ID_CARD_SETUP_GUIDE.md`
- ✅ Full Documentation: `DIGITAL_ID_CARD_DOCUMENTATION.md`
- ✅ Quick Reference: `ID_CARD_QUICK_REFERENCE.md`
- ✅ This Deployment Guide: `ID_CARD_DEPLOYMENT_GUIDE.md`

---

## Communication Plan

### Before Deployment
- [ ] Notify team of upcoming changes
- [ ] Schedule maintenance window if needed
- [ ] Backup database
- [ ] Brief QA team

### During Deployment
- [ ] Monitor logs in real-time
- [ ] Have rollback ready
- [ ] Check key functionality

### After Deployment
- [ ] Send deployment notification
- [ ] Announce feature to users
- [ ] Monitor for issues first 24 hours
- [ ] Get user feedback

---

## Success Criteria

✅ Feature is successfully deployed when:
1. ID cards generate without errors on approval
2. Users can see ID cards in their profile
3. Download functionality works
4. Mobile responsiveness confirmed
5. All tests passing
6. Zero critical errors in logs
7. Users successfully testing feature
8. Admin can regenerate cards if needed

---

## Contact & Support

| Role | Contact | Responsibility |
|------|---------|-----------------|
| Backend Dev | - | ID card generation, API endpoints |
| Frontend Dev | - | Profile display, UI/UX |
| DevOps | - | Deployment, infrastructure |
| QA | - | Testing, verification |
| Product | - | Feature communication |

---

## Deployment Checklist Summary

### Pre-Deployment
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Backups created

### Deployment
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Services restarted
- [ ] Logs monitored
- [ ] Health checks passing

### Post-Deployment
- [ ] Manual testing completed
- [ ] Performance verified
- [ ] Users notified
- [ ] Documentation updated
- [ ] Issue tracking set up

---

**Deployment Status**: Ready for Production  
**Last Updated**: January 17, 2024  
**Version**: 1.0.0
