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
    required:false

  },
  Bookings: [{
    type: Object, 
    required: true,
  }],
}, { timestamps: true });

const Tourist = mongoose.models.Tourist || mongoose.model('Tourist', touristSchema);
module.exports = Tourist;