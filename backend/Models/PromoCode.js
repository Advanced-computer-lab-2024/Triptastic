const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promoCodeSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  isPercentage: {
    type: Boolean,
    required: true, // true for percentage discount, false for flat discount
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  maxUsage: {
    type: Number,
    default: 1, // Maximum number of times this code can be used
  },
  usageCount: {
    type: Number,
    default: 0, // Tracks how many times the promo code has been used
  },
  active: {
    type: Boolean,
    default: true, // Whether the promo code is active or not
  },
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);
