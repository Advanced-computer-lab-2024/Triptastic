const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema({
    Name: {
        type: String, required : true,
    },
    Username: {
        type: String, required: true,
    },
    Email: {
        type: String,  required: true
    },
    Password: {
        type: String, required: true,
    },
    mobileNumber: {
        type: Number, required: true,
    },
    yearsOfExperience: {
        type: Number, required: true, 
    },
    previousWork: {
        type: String, required: true,
    }
      },{ timestamps: true });
       
const tourGuide = mongoose.models.tourGuide || mongoose.model('tourGuide', tourGuideSchema);
module.exports = tourGuide;
