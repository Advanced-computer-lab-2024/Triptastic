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
      reminded: { type: Boolean, default: false }, // To track if a reminder has been sent
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
}, 
{ timestamps: true });

const Tourist = mongoose.models.Tourist || mongoose.model('Tourist', touristSchema);
module.exports = Tourist;
