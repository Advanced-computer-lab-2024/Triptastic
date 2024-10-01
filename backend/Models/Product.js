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
  rating:{
    type:Number,
    required:false
  },
  seller:{
    type:String,
    required:false
  },
  review:{
    type:String,
    required:false
  },
  stock: {
    type: Number,
    required: false,
    default: 0
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;