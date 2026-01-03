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

// Middleware to check if user is Diamond tier or admin
const requireDiamond = async (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];
  
  // Check if admin password is provided
  if (adminPassword === process.env.ADMIN_PASSWORD) {
    req.isAdmin = true;
    return next();
  }

  // Otherwise check user tier
  try {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Diamond membership or admin access required' 
      });
    }

    const user = await User.findOne({ phone, password, status: 'approved' });
    
    if (!user || user.membershipTier !== 'diamond') {
      return res.status(403).json({ 
        success: false, 
        message: 'Diamond membership required for this action' 
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

// Middleware to check if user is Gold tier or higher
const requireGold = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Gold or Diamond membership required' 
      });
    }

    const user = await User.findOne({ phone, password, status: 'approved' });
    
    if (!user || (user.membershipTier !== 'gold' && user.membershipTier !== 'diamond')) {
      return res.status(403).json({ 
        success: false, 
        message: 'Gold or Diamond membership required for this action' 
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

// Middleware to check if user is Silver tier or higher (any approved member)
const requireSilver = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Membership required' 
      });
    }

    const user = await User.findOne({ phone, password, status: 'approved' });
    
    if (!user) {
      return res.status(403).json({ 
        success: false, 
        message: 'Active membership required for this action' 
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
  requireDiamond,
  requireGold,
  requireSilver
};
