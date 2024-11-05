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
  replies: [
    {
      content: {
        type: String,
        required: false,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      replier: {
        type: String,
        required: false, // To identify who replied (e.g., admin or support staff)
      },
    },
  ],
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', ComplaintSchema);

module.exports = Complaint;
