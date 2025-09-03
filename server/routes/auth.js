const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('express-oauth-server');
const User = require('../models/User');
const auth0Middleware = require('../middleware/auth');
const auth = require('../middleware/auth');

const router = express.Router();

// Auth0 profile sync endpoint
router.post('/profile', auth0Middleware, async (req, res) => {
  try {
    const { auth0Id, email, name, picture } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ auth0Id });
    
    if (!user) {
      // Create new user
      user = new User({
        auth0Id,
        email,
        name,
        picture,
        userType: 'vendor', // Default to vendor, can be updated later
        isVerified: false,
        profile: {
          contactInfo: {
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: ''
          }
        }
      });
      await user.save();
    } else {
      // Update existing user
      user.email = email;
      user.name = name;
      user.picture = picture;
      await user.save();
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        auth0Id: user.auth0Id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        userType: user.userType,
        isVerified: user.isVerified,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Profile sync error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, userType, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      userType,
      profile
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        profile: user.profile,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        profile: user.profile,
        verified: user.verified,
        rating: user.rating
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// OAuth login/register
router.post('/oauth', async (req, res) => {
  try {
    const { auth0Id, email, name, userType, profile } = req.body;

    let user = await User.findOne({ $or: [{ auth0Id }, { email }] });

    if (!user) {
      // Create new user
      user = new User({
        auth0Id,
        email,
        userType,
        profile: {
          ...profile,
          name
        },
        verified: true // OAuth users are pre-verified
      });
      await user.save();
    } else if (!user.auth0Id) {
      // Link existing account with OAuth
      user.auth0Id = auth0Id;
      user.verified = true;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'OAuth authentication successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        profile: user.profile,
        verified: user.verified,
        rating: user.rating
      }
    });
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ message: 'Server error during OAuth authentication' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { profile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { profile } },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

module.exports = router;