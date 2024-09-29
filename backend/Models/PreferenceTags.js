const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrefTagsSchema = new Schema({
  
  PrefTagName: {
    type: String,
    required: true,
  
  },


}, { timestamps: true });

const PreferenceTags = mongoose.model('PreferenceTags', PrefTagsSchema);
module.exports = PreferenceTags;