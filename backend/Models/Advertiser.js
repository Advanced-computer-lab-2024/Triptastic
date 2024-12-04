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
  flaggedActivities:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Activities',
    default: [],
  },
  Password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
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
  },docsApproved: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },

  createdAt: { type: Date, default: Date.now }, // Automatically add creation date


}, { timestamps: true });

const Advertiser = mongoose.models.Advertiser ||mongoose.model('Advertiser', advertiserSchema);
module.exports = Advertiser;