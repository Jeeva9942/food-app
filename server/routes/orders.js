const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { supplierId, items, deliveryAddress, notes } = req.body;

    // Validate supplier
    const supplier = await User.findOne({
      _id: supplierId,
      userType: 'supplier',
      isActive: true
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Validate and calculate order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        supplierId,
        isActive: true
      });

      if (!product) {
        return res.status(404).json({ 
          message: `Product ${item.productId} not found` 
        });
      }

      // Check availability
      if (!product.availability.inStock || 
          product.availability.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }

      // Calculate price (check for bulk pricing)
      let pricePerUnit = product.price.amount;
      
      if (product.bulkPricing && product.bulkPricing.length > 0) {
        const bulkPrice = product.bulkPricing
          .filter(bp => item.quantity >= bp.minQuantity)
          .sort((a, b) => b.minQuantity - a.minQuantity)[0];
        
        if (bulkPrice) {
          pricePerUnit = bulkPrice.pricePerUnit;
        }
      }

      const itemTotal = pricePerUnit * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        unit: product.price.unit,
        pricePerUnit,
        totalPrice: itemTotal
      });
    }

    // Create order
    const order = new Order({
      vendorId: req.user.userId,
      supplierId,
      items: orderItems,
      totalAmount,
      deliveryDetails: {
        address: deliveryAddress
      },
      notes
    });

    await order.save();

    // Update product quantities
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { 'availability.quantity': -item.quantity }
      });
    }

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('supplierId', 'profile.businessName profile.phone')
      .populate('items.productId', 'name category');

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error during order creation' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('vendorId', 'profile.businessName profile.phone')
      .populate('supplierId', 'profile.businessName profile.phone')
      .populate('items.productId', 'name category');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    if (order.vendorId._id.toString() !== req.user.userId && 
        order.supplierId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (suppliers only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only supplier can update order status
    if (order.supplierId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.status = status;
    
    if (status === 'delivered') {
      order.deliveryDetails.actualDate = new Date();
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('vendorId', 'profile.businessName')
      .populate('items.productId', 'name');

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;