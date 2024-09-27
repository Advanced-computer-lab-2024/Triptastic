const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advertiserSchema = new Schema({
  
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
  website_Link:
  {
    type: String
  },
  Hotline:{
    type:String
  },



}, { timestamps: true });

const Advertiser = mongoose.model('Advertiser', advertiserSchema);
module.exports = Advertiser;