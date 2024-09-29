
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitiesSchema = new Schema({
  
Name: {
    type: String,
    required: true
  
  },
  date: {
    type: Date,
    required: false
},
time: {
    type: String,
    required: false
},
location: {
    type: String,
    required: false
},
price: {
    type: Number,
    required: false
},

tags: {
    type: [String], // Array of strings for tags
    required: false
},
specialDiscounts: {
    type: String,
    required: false
},
bookingOpen: {
    type: Boolean,
    default: true // Default to open for booking
},
Advertiser: {
  type: String,
  required: false
},




}, { timestamps: true });

const Activities = mongoose.models.Activities||mongoose.model('Activities', ActivitiesSchema);

module.exports = Activities;


