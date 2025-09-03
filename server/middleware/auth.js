const jwt = require('jsonwebtoken');
const { auth } = require('express-oauth-server');
const jwksClient = require('jwks-rsa');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');

// Auth0 JWT verification middleware
const auth0Middleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // For development, we'll skip actual JWT verification
    // In production, you would verify the JWT against Auth0's public key
    
    // Decode the token without verification for development
    const decoded = jsonwebtoken.decode(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth0 middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { authMiddleware, auth0Middleware };