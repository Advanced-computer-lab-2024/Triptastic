const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Order Schema
const orderSchema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,  // Ensure order numbers are unique
  },
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist', // Reference to the Tourist model
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Ensure that the quantity is at least 1
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'], // Possible order statuses
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
}, { timestamps: true });

// Create and export the Order model
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
module.exports = Order;