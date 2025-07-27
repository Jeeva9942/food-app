const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Vegetables', 'Fruits', 'Spices', 'Grains', 'Dairy', 'Meat', 'Oil', 'Other']
  },
  description: String,
  price: {
    amount: { type: Number, required: true },
    unit: { type: String, required: true }, // kg, liter, piece, etc.
    currency: { type: String, default: 'INR' }
  },
  bulkPricing: [{
    minQuantity: Number,
    pricePerUnit: Number
  }],
  availability: {
    inStock: { type: Boolean, default: true },
    quantity: Number,
    unit: String
  },
  quality: {
    grade: String,
    certifications: [String],
    shelfLife: String
  },
  images: [String],
  specifications: {
    origin: String,
    harvestDate: Date,
    storageConditions: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);