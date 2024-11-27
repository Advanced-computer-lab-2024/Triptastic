const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinbookingsSchema = new Schema({
    itineraryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary', // Reference to the itinerary model
        required: true,
    },
    },{timestamps: true});

const itinbookings = mongoose.models.itinbookings||mongoose.model('itinBookings', itinbookingsSchema);
module.exports = itinbookings;