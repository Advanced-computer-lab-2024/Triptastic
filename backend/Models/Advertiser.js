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
  Website_Link:
  {
    type: String,
    required: false,
  },
  Hotline:{
    type:Number,
    required: false,
  },
  Company_Profile:{
    type:String,
    required: false,

  },
  Logo:{
    type:String,
    required:false,
  },
  Id: { 
    type: String,
    required: true,
  },
  TaxationRegistryCard: { 
    type: String,
    required:true,
  },



}, { timestamps: true });

const Advertiser = mongoose.models.Advertiser ||mongoose.model('Advertiser', advertiserSchema);
module.exports = Advertiser;