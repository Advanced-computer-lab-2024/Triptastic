const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    Activities:{ 
        type: [String] ,required: true
    },
    Locations:{
        type: [String], required:true
    },
    Timeline:{
        type: String, required: true
    },
    DurationOfActivity:{
        type: String, required: true
    },
    Language:{
        type: String, required: true
    },
    Price:{
        type: Number, required: true
    },
    DatesTimes:{
        type: Date , required: true
    },
    Accesibility:{
        type: String, required: true
    },
    pickUpDropOff:{
        type: String, required: true
    },
    bookingOpen: {
      type: Boolean,
      default: true // Default to open for booking
  },
    Booked:{
        type: Boolean,
        default: false
    },
    TourGuide: {
        type: String,  
        required: true
    },
    PreferenceTag:{
      type: String,
      enum: ['historical areas', 'shopping', 'family friendly','beaches'], 
      required: true
    },
    FlagInappropriate:{
        type: Boolean,
        default: false
    },
    active:{
        type: Boolean,
        default: true
    },
    sales: {// total amount of money made
        type: Number,
        default: 0,
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
      notificationRequests: [
        {
          username: {
            type: String,
            required: true,
          },
        },
      ],
    },{timestamps: true})

const Itinerary = mongoose.models.Itinerary || mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;



