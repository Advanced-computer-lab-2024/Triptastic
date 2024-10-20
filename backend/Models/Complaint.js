const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComplaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Removes leading/trailing spaces
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  username: {
    type: String,
    required: true, // Ensure that the username is required
  },
  status: {
    type: String,
    enum: ['pending', 'solved'],
    default: 'pending', // Default status when a complaint is filed
  },
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', ComplaintSchema);

module.exports = Complaint;
