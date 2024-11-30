const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const touristSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Nationality: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  Occupation: {
    type: String,
    required: true,
  },
  Wallet: {
    type: Number,
    default: 0,
    required: false,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
  createdAt: { 
    type: Date, 
    default: Date.now, // Automatically add creation date 
  },
  Bookings: [
    {
      type: Object, 
      required: true,

    }
  ],
  points: {
    type: Number,
    default: 0,
  },
  badge: {
    type: Number,
    default: 1,
  },
  preferences: {
    historicAreas: { type: Boolean, default: false },
    beaches: { type: Boolean, default: false },
    familyFriendly: { type: Boolean, default: false },
    shopping: { type: Boolean, default: false },
    budget: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  },
  birthdayPromoCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PromoCode',
    default: null, // Will hold the reference to the generated promo code
  },
  bookmarkedEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activities', // Reference to the Activities model
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to the Product model
    },
  ],
  notifications: [
    {
      message: String,
      date: Date,
      read: { type: Boolean, default: false }, // Track read/unread state
    },
  ],
  addresses: [
    {
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      isPrimary: {
        type: Boolean,
        default: false, // Mark one address as primary
      },
    }
  ],
  showIntro: {
    type: Boolean,
    default: true, // Set to true for new users
  },
}, 

{ timestamps: true });

const Tourist = mongoose.models.Tourist || mongoose.model('Tourist', touristSchema);
module.exports = Tourist;
