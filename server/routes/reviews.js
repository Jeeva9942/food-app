const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

// Create review
router.post('/', auth, async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    // Validate order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is the vendor who placed the order
    if (order.vendorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({ 
        message: 'Can only review delivered orders' 
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      reviewerId: req.user.userId,
      orderId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'Review already exists for this order' 
      });
    }

    // Create review
    const review = new Review({
      reviewerId: req.user.userId,
      revieweeId: order.supplierId,
      orderId,
      rating,
      comment,
      isVerified: true // Since it's based on actual order
    });

    await review.save();

    // Update supplier's rating
    const allReviews = await Review.find({ revieweeId: order.supplierId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating.overall, 0) / allReviews.length;

    await User.findByIdAndUpdate(order.supplierId, {
      'rating.average': avgRating,
      'rating.count': allReviews.length
    });

    const populatedReview = await Review.findById(review._id)
      .populate('reviewerId', 'profile.name profile.businessName');

    res.status(201).json({
      message: 'Review created successfully',
      review: populatedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error during review creation' });
  }
});

// Get reviews for a supplier
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ revieweeId: req.params.supplierId })
      .populate('reviewerId', 'profile.name profile.businessName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Review.countDocuments({ revieweeId: req.params.supplierId });

    // Calculate rating breakdown
    const ratingBreakdown = await Review.aggregate([
      { $match: { revieweeId: req.params.supplierId } },
      {
        $group: {
          _id: null,
          avgOverall: { $avg: '$rating.overall' },
          avgQuality: { $avg: '$rating.quality' },
          avgDelivery: { $avg: '$rating.delivery' },
          avgPricing: { $avg: '$rating.pricing' },
          avgCommunication: { $avg: '$rating.communication' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      reviews,
      ratingBreakdown: ratingBreakdown[0] || null,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark review as helpful
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user already marked as helpful
    if (review.helpful.users.includes(req.user.userId)) {
      return res.status(400).json({ 
        message: 'Already marked as helpful' 
      });
    }

    review.helpful.users.push(req.user.userId);
    review.helpful.count += 1;
    
    await review.save();

    res.json({ message: 'Review marked as helpful' });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;