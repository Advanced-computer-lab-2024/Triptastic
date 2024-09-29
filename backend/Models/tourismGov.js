const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourismGovSchema = new Schema({
 
  Username: {
    type: String,
    required: true,
  },

  Password: {
    type: String,
    required: true,
  }
  
}, { timestamps: true });

const tourismGov = mongoose.model('tourismGov',tourismGovSchema);
module.exports = tourismGov;