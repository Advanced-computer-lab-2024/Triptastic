const mongoose = require('mongoose');

// Define the schema for a notification
const NotificationSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,  // The recipient of the notification (e.g., 'Admin', 'Seller', or specific username)
  },
  message: {
    type: String,
    required: true,  // The content of the notification
  },
  type: {
    type: String,
    required: true,
  },
 
  
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically sets the timestamp when notification is created
  },
  updatedAt: {
    type: Date,
    default: Date.now,  // Automatically updates the timestamp when notification is updated
  },
});

// Add a pre-save hook to update the 'updatedAt' field when the document is updated
NotificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model based on the schema
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
