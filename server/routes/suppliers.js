const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all suppliers with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      location,
      minRating,
      maxDistance,
      priceRange,
      verified,
      search,
      sortBy = 'rating.average',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    let query = { userType: 'supplier', isActive: true };
    
    // Apply filters
    if (verified === 'true') {
      query.verified = true;
    }
    
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    if (search) {
      query.$or = [
        { 'profile.businessName': { $regex: search, $options: 'i' } },
        { 'profile.products': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Location-based filtering (if coordinates provided)
    if (location && maxDistance) {
      const [lng, lat] = location.split(',').map(Number);
      query['profile.location'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: parseInt(maxDistance) * 1000 // Convert km to meters
        }
      };
    }

    const suppliers = await User.find(query)
      .select('-password')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get products for each supplier
    const suppliersWithProducts = await Promise.all(
      suppliers.map(async (supplier) => {
        const products = await Product.find({ 
          supplierId: supplier._id, 
          isActive: true 
        }).limit(5);
        
        const reviews = await Review.find({ revieweeId: supplier._id })
          .populate('reviewerId', 'profile.name profile.businessName')
          .sort({ createdAt: -1 })
          .limit(3);

        return {
          ...supplier.toObject(),
          products,
          recentReviews: reviews
        };
      })
    );

    const total = await User.countDocuments(query);

    res.json({
      suppliers: suppliersWithProducts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const supplier = await User.findOne({
      _id: req.params.id,
      userType: 'supplier',
      isActive: true
    }).select('-password');

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Get supplier's products
    const products = await Product.find({ 
      supplierId: supplier._id, 
      isActive: true 
    });

    // Get reviews
    const reviews = await Review.find({ revieweeId: supplier._id })
      .populate('reviewerId', 'profile.name profile.businessName')
      .sort({ createdAt: -1 });

    res.json({
      supplier,
      products,
      reviews
    });
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Compare suppliers
router.post('/compare', async (req, res) => {
  try {
    const { supplierIds } = req.body;

    if (!supplierIds || supplierIds.length < 2) {
      return res.status(400).json({ message: 'At least 2 suppliers required for comparison' });
    }

    const suppliers = await User.find({
      _id: { $in: supplierIds },
      userType: 'supplier',
      isActive: true
    }).select('-password');

    // Get products and reviews for each supplier
    const comparison = await Promise.all(
      suppliers.map(async (supplier) => {
        const products = await Product.find({ 
          supplierId: supplier._id, 
          isActive: true 
        });

        const reviews = await Review.find({ revieweeId: supplier._id });
        
        // Calculate average ratings by category
        const ratingBreakdown = reviews.reduce((acc, review) => {
          acc.quality += review.rating.quality || 0;
          acc.delivery += review.rating.delivery || 0;
          acc.pricing += review.rating.pricing || 0;
          acc.communication += review.rating.communication || 0;
          acc.count++;
          return acc;
        }, { quality: 0, delivery: 0, pricing: 0, communication: 0, count: 0 });

        if (ratingBreakdown.count > 0) {
          ratingBreakdown.quality /= ratingBreakdown.count;
          ratingBreakdown.delivery /= ratingBreakdown.count;
          ratingBreakdown.pricing /= ratingBreakdown.count;
          ratingBreakdown.communication /= ratingBreakdown.count;
        }

        return {
          supplier,
          products,
          totalProducts: products.length,
          reviewCount: reviews.length,
          ratingBreakdown,
          priceRange: {
            min: Math.min(...products.map(p => p.price.amount)),
            max: Math.max(...products.map(p => p.price.amount))
          }
        };
      })
    );

    res.json({ comparison });
  } catch (error) {
    console.error('Compare suppliers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;