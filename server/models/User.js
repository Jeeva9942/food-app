const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.auth0Id; // Password required only if not using OAuth
    }
  },
  userType: {
    type: String,
    enum: ['vendor', 'supplier'],
    default: 'vendor'
  },
  profile: {
    name: String,
    businessName: String,
    phone: String,
    address: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [77.2090, 28.6139] // Delhi coordinates
      }
    },
    // Vendor specific fields
    foodType: String,
    businessHours: String,
    // Supplier specific fields
    fssaiNumber: String,
    gstNumber: String,
    certificates: [{
      name: String,
      url: String,
      uploadDate: { type: Date, default: Date.now },
      verified: { type: Boolean, default: false }
    }],
    products: [String],
    minimumOrder: Number,
    deliveryRadius: Number
  },
  picture: {
    type: String,
    required: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
userSchema.index({ auth0Id: 1 });
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ "profile.location": "2dsphere" });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);