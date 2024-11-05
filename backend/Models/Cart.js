const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartSchema = new Schema({
    Username: {
      type: String,
      required: true
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ]
  }, { timestamps: true });
  
  const Cart = mongoose.model('Cart', cartSchema);
  module.exports = Cart;


