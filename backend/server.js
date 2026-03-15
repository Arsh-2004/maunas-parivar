const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Middleware
// Configure CORS for local + production domains.
// FRONTEND_URLS can be a comma-separated list.
const defaultAllowedOrigins = [
  'http://localhost:3000',
  'https://maunas.in',
  'https://www.maunas.in'
];

const envAllowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = envAllowedOrigins.length > 0 ? envAllowedOrigins : defaultAllowedOrigins;

console.log('✅ CORS allowed origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (no Origin header)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in whitelist
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS allowed: ${origin}`);
      return callback(null, true);
    }

    // Check if origin is from same domain but different port (helpful for mobile testing)
    // e.g., https://maunas.in from https://maunas.in:3000
    const originHostname = new URL(origin).hostname;
    const isLocalhost = originHostname.includes('localhost') || originHostname.includes('127.0.0.1');
    const isSameDomain = allowedOrigins.some(allowed => {
      try {
        return new URL(allowed).hostname === originHostname;
      } catch {
        return false;
      }
    });

    if (isLocalhost || isSameDomain) {
      console.log(`✅ CORS allowed (same domain variant): ${origin}`);
      return callback(null, true);
    }

    // Log rejected origins to help debug mobile issues
    console.warn(`⚠️  CORS BLOCKED: ${origin}`);
    console.warn(`📱 Allowed origins: ${allowedOrigins.join(', ')}`);
    console.warn(`📱 If this is your mobile user's browser, add the origin to FRONTEND_URLS env var`);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Trust proxy to get real IP address (important for deployed apps)
app.set('trust proxy', 1);

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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const memberRoutes = require('./routes/memberRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/contact', contactRoutes);

// Global error handling middleware for network and upload issues
app.use((err, req, res, next) => {
  console.error('❌ Server error:', {
    message: err.message,
    name: err.name,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.clientIp
  });

  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS error: This domain is not allowed to access this API',
      origin: req.get('origin')
    });
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        code: 'FILE_TOO_LARGE',
        message: 'File size too large. Maximum allowed size is 10MB per file.'
      });
    }

    return res.status(400).json({
      success: false,
      code: err.code || 'UPLOAD_ERROR',
      message: err.message || 'File upload failed.'
    });
  }

  if (err.message && (err.message.includes('Only image files') || err.message.includes('Only PDF') || err.message.includes('Unsupported file type'))) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_FILE_TYPE',
      message: err.message
    });
  }

  res.status(500).json({
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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
