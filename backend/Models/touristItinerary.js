const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const touristItinerarySchema = new Schema({
    Activities:{
        type:[String], required: true
    },
    Locations:{
        type: [String], required :true 
    },
    startDate:{
        type: String, required:true
    },
    endDate:{
        type: String, required: true
    },
    Tags:{
        type:[String], required:true
    },
    tourGuide:{
        type: String, required: true
    },
    FlagInappropriate:{
        type: Boolean,
        default: false
    }    
},{timestamps: true})

const touristItinerary = mongoose.models.touristItinerary || mongoose.model('touristItinerary', touristItinerarySchema);
module.exports = touristItinerary;