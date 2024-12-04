const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
  createdAt: { 
    type: Date, 
    default: Date.now, // Automatically add creation date 
  },
  mobileNumber: {
    type: Number,
    default: null,
  },
  yearsOfExperience: {
    type: Number,
    default: null,
  },
  previousWork: {
    type: String,
    default: null,
  },
  photo: {
    type: String,
    required: false,
  },
  Id: {
    type: String,
    required: false,
  },
  Certificate: {
    type: String,
    required: false,
  },
  docsApproved: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  flaggedItineraries:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Itinerary',
    default: [],
  },
  feedback: [
    {
      touristUsername: { // Add this field to store the tourist's name who submitted the feedback
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // Assuming ratings are from 1 to 5
      },
      comment: {
        type: String,
        required: false,
      },
      itineraryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary', // Reference to the itinerary model
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Automatically add creation date

}, { timestamps: true });

const TourGuide = mongoose.models.tourGuide || mongoose.model('tourGuide', tourGuideSchema);
module.exports = TourGuide;
