const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagsSchema = new Schema({
  
  tagName: {
    type: String,
    required: true,
  
  },


}, { timestamps: true });

const Activities = mongoose.model('Activities', tagsSchema);
module.exports = Activities;