
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actBookingSchema = new Schema({
    activityId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activities', // Reference to the activity model
        required: true,
    },
    },{timestamps: true});

const actBooking = mongoose.models.actBooking||mongoose.model('actBooking', actBookingSchema);
module.exports = actBooking;