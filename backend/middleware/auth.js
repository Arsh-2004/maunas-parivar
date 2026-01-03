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
    
    console.log('requireDiamond - Phone from request:', phone);
    
    if (!phone) {
      console.log('requireDiamond - No phone provided');
      return res.status(401).json({ 
        success: false, 
        message: 'Phone is required for authentication' 
      });
    }

    // Find user by phone only
    const user = await User.findOne({ phone, status: 'approved' });
    
    console.log('requireDiamond - User found:', user ? `${user.fullName} (${user.membershipTier})` : 'NOT FOUND');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found or not approved' 
      });
    }

    // If password is provided, verify it
    if (password && user.password !== password) {
      console.log('requireDiamond - Password verification failed');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if user is diamond tier
    if (user.membershipTier !== 'diamond') {
      console.log('requireDiamond - User tier is not diamond:', user.membershipTier);
      return res.status(403).json({ 
        success: false, 
        message: 'Diamond membership required for this action' 
      });
    }

    console.log('requireDiamond - Authentication successful for diamond user');
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

    // If password is provided, verify it
    if (password && user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    if (user.membershipTier !== 'gold' && user.membershipTier !== 'diamond') {
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

    // If password is provided, verify it
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
  requireDiamond,
  requireGold,
  requireSilver
};
