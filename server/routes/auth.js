const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// OAuth login/register endpoint
router.post('/oauth', async (req, res) => {
  try {
    const { auth0Id, email, name, picture, userType } = req.body;

    console.log('OAuth request received:', { auth0Id, email, name, userType });

    let user = await User.findOne({ 
      $or: [
        { auth0Id: auth0Id },
        { email: email }
      ]
    });

    if (!user) {
      // Create new user
      user = new User({
        auth0Id,
        email,
        userType: userType || 'vendor', // Default to vendor
        profile: {
          name: name || email.split('@')[0],
          businessName: `${name || 'User'}'s Business`,
          phone: '',
          address: '',
          location: {
            type: 'Point',
            coordinates: [77.2090, 28.6139] // Default to Delhi coordinates
          }
        },
        picture,
        verified: true, // OAuth users are pre-verified
        isActive: true
      });
      
      await user.save();
      console.log('New user created:', user._id);
    } else {
      // Update existing user with OAuth info if needed
      if (!user.auth0Id) {
        user.auth0Id = auth0Id;
      }
      if (!user.picture && picture) {
        user.picture = picture;
      }
      if (!user.profile.name && name) {
        user.profile.name = name;
      }
      
      user.verified = true;
      await user.save();
      console.log('Existing user updated:', user._id);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        userType: user.userType,
        email: user.email 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'OAuth authentication successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.profile.name,
        picture: user.picture,
        userType: user.userType,
        profile: user.profile,
        verified: user.verified,
        rating: user.rating
      }
    });
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ 
      message: 'Server error during OAuth authentication',
      error: error.message 
    });
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
      profile: {
        ...profile,
        location: {
          type: 'Point',
          coordinates: [77.2090, 28.6139] // Default coordinates
        }
      },
      verified: userType === 'vendor' // Vendors are auto-verified, suppliers need manual verification
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || 'fallback-secret-key',
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
      process.env.JWT_SECRET || 'fallback-secret-key',
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

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { profile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { profile } },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
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
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

module.exports = router;