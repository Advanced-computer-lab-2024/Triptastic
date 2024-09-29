const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrefTagsSchema = new Schema({
  
  PrefTagName: {
    type: String,
    required: true,
    unique: true // Ensures no duplicate preference tag names
  
  },


}, { timestamps: true });

const PreferenceTags = mongoose.model('PreferenceTags', PrefTagsSchema);
module.exports = PreferenceTags;