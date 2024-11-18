const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const touristSchema = new Schema({
 
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
  Nationality: {
    type: String,
    required: true,
  },
  DOB:{
    type: Date,
    required: true,
  },
  Occupation:{
    type: String,
    required: true,
  },
  Wallet:{
    type:Number,
    default:0,
    required:false

  },
  Bookings: [{
    
    type: Object, 
    required: true,
  }],
  points:{
    type:Number,
    default:0,

  },
  badge:{
    type:Number,
    default:1,
  },
  preferences: {
    historicAreas: { type: Boolean, default: false },
    beaches: { type: Boolean, default: false },
    familyFriendly: { type: Boolean, default: false },
    shopping: { type: Boolean, default: false },
    budget: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  },
  createdAt: { type: Date, default: Date.now }, // Automatically add creation date
}, { timestamps: true });

const Tourist = mongoose.models.Tourist || mongoose.model('Tourist', touristSchema);
module.exports = Tourist;