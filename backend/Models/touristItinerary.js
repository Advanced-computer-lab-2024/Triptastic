const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {Activities}=require("./Activities.js")
;const {Tags}= require("./Tags.js");
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
        type:[Tags], required:true
    }    
},{timestamps: true})

const touristItinerary = mongoose.models.touristItinerary || mongoose.model('touristItinerary', touristItinerarySchema);
module.exports = touristItinerary;