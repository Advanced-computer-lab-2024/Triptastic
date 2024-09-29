const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitiesSchema = new Schema({
  
  Name: {
    type: String,
    required: true,
  
  },


}, { timestamps: true });

const Activities = mongoose.model('Activities', ActivitiesSchema);
module.exports = Activities;