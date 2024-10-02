const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {Activities}=require("./Activities.js")
;const {Tags}= require("./Tags.js");
const touristItinerarySchema = new Schema({
    Activities:{
        type:[Activities], required: true
    },
    Locations:{
        type: [String], required :true 
    },
    startDate:{
        type: Date, required:true
    },
    endDate:{
        type: Date, required: true
    },
    Tags:{
        type:[Tags], required:true
    }    
},{timestamps: true})
touristItinerarySchema.pre('validate', function(next) {
    if (this.startDate >= this.endDate) {
        return next(new Error('start Date must be before end Date'));
    }
    next();
});
const touristItinerary = mongoose.models.touristItinerary || mongoose.model('touristItinerary', touristItinerarySchema);
module.exports = touristItinerary;