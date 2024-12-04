const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  rating: {
    type: Number,
    required: false
  },
  seller: {
    type: String,
    required: false
  },
  reviews: [{ 
    type: String, // Array of review strings
    required: false
  }],
  stock: {
    type: Number,
    required: false,
    default: 0
  },
  archived: {
    type: Boolean,
    required: false,
    default: false
  },
  image: {  
    type: String,  
    required: false,
  },
  sales: {
    type: Number,
    required: false,
    default: 0
  },
  notificationSent: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
