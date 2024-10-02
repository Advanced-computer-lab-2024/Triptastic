const mongoose = require('mongoose');
const {Activities}=require("./Models/Activities.js")
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    Activities:{ 
        type: [Activities] ,required: true
    },
    Locations:{
        type: [String], required:true
    },
    Timeline:{
        type:String, required: true
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
    Booked:{
        type: Boolean,
        default: false
    }

},{timestamps: true})

const Itinerary = mongoose.models.Itinerary || mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;



