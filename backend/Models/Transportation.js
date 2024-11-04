const mongoose = require('mongoose');

const transportationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Bus', 'Taxi', 'Train', 'Boat'], 
  },
  company: {
    name: {
      type: String,
      required: true,
    },
    contact: {
      phone: String,
      email: String,
    },
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  seatsAvailable: {
    type: Number,
    default: 0,
  },
});

const Transportation = mongoose.models.Transportation || mongoose.model('Transportation', transportationSchema);
module.exports = Transportation;