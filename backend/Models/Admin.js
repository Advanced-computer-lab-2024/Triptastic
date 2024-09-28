const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  
  Username: {
    type: String,
    required: true,
  },

  Password: {
    type: String,
    required: true,
  },

  //admin,tourism governer and so on
  
  Role: {
    type: String,
    required: true,
  },

}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;