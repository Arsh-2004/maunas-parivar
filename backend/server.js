const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 180000);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Middleware
// Configure CORS for production
const defaultAllowedOrigins = [
  'https://maunas.in',
  'https://www.maunas.in',
  'https://maunas.netlify.app',
  'http://localhost:3000'
];

const envAllowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envAllowedOrigins]));

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const hostname = new URL(origin).hostname.toLowerCase();
    return hostname === 'maunas.in' || hostname.endsWith('.maunas.in');
  } catch (error) {
    return false;
  }
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-admin-password'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  optionsSuccessStatus: 200
};

console.log('CORS allowed origins:', allowedOrigins);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Trust proxy to get real IP address (important for deployed apps)
app.set('trust proxy', 1);

// Keep upload requests alive longer on unstable mobile networks and avoid proxy buffering where supported.
app.use((req, res, next) => {
  req.setTimeout(REQUEST_TIMEOUT_MS);
  res.setTimeout(REQUEST_TIMEOUT_MS);
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('Cache-Control', 'no-transform');
  next();
});

// Middleware to capture real IP address
app.use((req, res, next) => {
  // Try multiple header sources for the real IP
  const ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress || 
             req.connection.socket?.remoteAddress;
  
  // Clean up IPv6 localhost (::1) or IPv4 localhost (127.0.0.1)
  if (ip && ip !== '::1' && ip !== '127.0.0.1') {
    req.clientIp = ip.split(',')[0].trim(); // Handle comma-separated proxy chain
  } else {
    req.clientIp = ip;
  }
  next();
});

// Serve uploads with permissive CORS for direct file access
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(uploadsDir));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb', parameterLimit: 1000 }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const memberRoutes = require('./routes/memberRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/contact', contactRoutes);

// Global error handling middleware for CORS and upload failures
app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  console.error('Server error:', {
    message: err.message,
    name: err.name,
    code: err.code,
    path: req.originalUrl,
    method: req.method
  });

  if (err.message && err.message.includes('CORS blocked')) {
    return res.status(403).json({
      success: false,
      code: 'CORS_BLOCKED',
      message: 'Request blocked by CORS policy for this origin.'
    });
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        code: 'FILE_TOO_LARGE',
        message: 'One of the files is too large. Please upload smaller files.'
      });
    }

    return res.status(400).json({
      success: false,
      code: err.code || 'UPLOAD_ERROR',
      message: err.message || 'File upload failed.'
    });
  }

  if (err.message && err.message.includes('Only JPEG, JPG, and PNG images are allowed!')) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_FILE_TYPE',
      message: err.message
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Server error. Please try again later.'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.requestTimeout = REQUEST_TIMEOUT_MS;
server.headersTimeout = REQUEST_TIMEOUT_MS + 5000;
server.setTimeout(REQUEST_TIMEOUT_MS);
server.keepAliveTimeout = 65000;
