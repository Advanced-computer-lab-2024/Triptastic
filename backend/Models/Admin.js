const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  
  Username: {
    type: String,
    required: true,
    unique: true,
  },

  Password: {
    type: String,
    required: true,
    unique: true,
  },

  //admin,tourism governer and so on
  
  Role: {
    type: String,
    required: false,
  },

}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;