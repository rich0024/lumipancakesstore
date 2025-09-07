const express = require('express');
const passport = require('../config/passport');
const { generateToken, verifyTokenAndGetUser } = require('../middleware/auth');
const { findUserByEmail, createUser, validatePassword } = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Google OAuth routes (only if OAuth is configured)
if (process.env.GOOGLE_CLIENT_ID && 
    process.env.GOOGLE_CLIENT_SECRET && 
    process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id' && 
    process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret') {
  router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL + '/login?error=auth_failed' }),
    (req, res) => {
      try {
        console.log('Google OAuth callback successful, user:', req.user);
        
        // Generate JWT token
        const token = generateToken(req.user);
        console.log('Generated token for user:', req.user.email);
        
        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
      } catch (error) {
        console.error('Error in Google OAuth callback:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
      }
    }
  );
} else {
  // Fallback routes when OAuth is not configured
  router.get('/google', (req, res) => {
    res.status(503).json({ 
      error: 'Google OAuth not configured',
      message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables'
    });
  });

  router.get('/google/callback', (req, res) => {
    res.status(503).json({ 
      error: 'Google OAuth not configured',
      message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables'
    });
  });
}

// Email/Password Authentication Routes

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, name, password, role = 'user' } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await createUser({
      email,
      name,
      password: hashedPassword,
      role: role
    });

    if (result.success) {
      res.status(201).json({ 
        message: 'User created successfully', 
        user: result.user 
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login with email/password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Validate password
    const isValidPassword = await validatePassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({ 
      message: 'Login successful', 
      token,
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const user = await verifyTokenAndGetUser(token);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Remove sensitive data
    const { googleId, password, ...userInfo } = user;
    res.json({ user: userInfo });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Create admin user (for initial setup)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password are required' });
    }

    // Check if admin already exists
    const existingAdmin = findUserByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const result = await createUser({
      email,
      name,
      password: hashedPassword,
      role: 'admin'
    });

    if (result.success) {
      res.json({ message: 'Admin user created successfully', user: result.user });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
