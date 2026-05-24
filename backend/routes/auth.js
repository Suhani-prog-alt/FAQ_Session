const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// ==================== LOCAL AUTH (Email/Password) ====================

// POST /auth/register - Register new user with email and password
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Please provide email, password, and name' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email already registered. Please login or use a different email.' 
      });
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      role: 'student'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: user.toJSON()
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      error: 'Registration failed. Please try again.' 
    });
  }
});

// POST /auth/login - Login with email and password
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  try {
    const token = generateToken(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: req.user.toJSON()
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      error: 'Login failed. Please try again.' 
    });
  }
});

// ==================== GOOGLE OAUTH ====================

// GET /auth/google - Redirect to Google login
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

// GET /auth/google/callback - Google OAuth callback
router.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login?error=google_auth_failed',
    session: false 
  }), 
  (req, res) => {
    try {
      const token = generateToken(req.user._id);
      
      // Redirect to frontend with token
      // Adjust the URL based on your frontend setup
      res.redirect(`/dashboard?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user.toJSON()))}`);
    } catch (err) {
      console.error('Google callback error:', err);
      res.redirect('/login?error=auth_failed');
    }
  }
);

// ==================== LOGOUT ====================

// POST /auth/logout - Logout user
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.status(200).json({ 
      success: true,
      message: 'Logout successful!' 
    });
  });
});

// ==================== GET CURRENT USER ====================

// GET /auth/me - Get current user (protected route)
router.get('/me', (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Not authenticated. Please login.' 
      });
    }
    res.status(200).json({
      success: true,
      user: req.user.toJSON()
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch user details.' 
    });
  }
});

// ==================== ERROR HANDLER FOR FAILED LOGINS ====================

// POST /auth/login/error - Handle login errors
router.post('/login/error', (req, res) => {
  const { message } = req.body;
  res.status(401).json({
    error: message || 'Authentication failed'
  });
});

module.exports = router;
