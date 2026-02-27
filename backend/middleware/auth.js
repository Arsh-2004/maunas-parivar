const User = require('../models/User');

// Middleware to authenticate user by phone and password
const authenticateUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Phone and password are required' 
      });
    }

    const user = await User.findOne({ phone, password, status: 'approved' });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials or account not approved' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

// Middleware to check if user is an approved member (replaces all tier-based checks)
const requireApprovedMember = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone) {
      return res.status(401).json({
        success: false,
        message: 'Phone is required for authentication'
      });
    }

    const user = await User.findOne({ phone, status: 'approved' });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or not approved'
      });
    }

    if (password && user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization failed'
    });
  }
};

module.exports = {
  authenticateUser,
  requireApprovedMember
};
