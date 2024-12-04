const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },

  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: false,
  },
  Description: {
    type: String,
    required: false,
  },
  Logo:{
    type:String,
    required: false,

  },  Id: { 
    type: String,
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
  TaxationRegistryCard: { 
    type: String,
    required: false,
  },docsApproved: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }, // Automatically add creation date

}, { timestamps: true });

const Seller =mongoose.models.Seller || mongoose.model('Seller', sellerSchema);
module.exports = Seller;