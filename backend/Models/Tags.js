const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagsSchema = new Schema({
  
  tagName: {
    type: String,
    required: true,
  
  },


}, { timestamps: true });

const Tags = mongoose.model('Tags', tagsSchema);
module.exports = Tags;