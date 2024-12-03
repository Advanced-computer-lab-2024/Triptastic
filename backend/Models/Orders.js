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
    type: String,  // Change from ObjectId to String to store the username
    required: true,
  },
  products: [{  // Change to an array of product names (strings)
    type: String,
    required: true,
  }],
 
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
