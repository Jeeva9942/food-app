const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

// Get vendor dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'vendor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const vendorId = req.user.userId;

    // Get recent orders
    const recentOrders = await Order.find({ vendorId })
      .populate('supplierId', 'profile.businessName')
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get order statistics
    const orderStats = await Order.aggregate([
      { $match: { vendorId: vendorId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get favorite suppliers (most ordered from)
    const favoriteSuppliers = await Order.aggregate([
      { $match: { vendorId: vendorId } },
      {
        $group: {
          _id: '$supplierId',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'supplier'
        }
      },
      { $unwind: '$supplier' }
    ]);

    res.json({
      recentOrders,
      orderStats,
      favoriteSuppliers
    });
  } catch (error) {
    console.error('Vendor dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get vendor's orders
router.get('/orders', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'vendor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, page = 1, limit = 10 } = req.query;
    let query = { vendorId: req.user.userId };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('supplierId', 'profile.businessName profile.phone')
      .populate('items.productId', 'name category')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get vendor orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;