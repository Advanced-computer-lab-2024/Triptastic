const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  
  Username: {
    type: String,
    required: true,
    unique: true,
  },
Email:{
  type: String,
  required: true
},
  Password: {
    type: String,
    required: true,
    unique: false,
  },
  
  Role: {
    type: String,
    required: false,
    
  },

}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;