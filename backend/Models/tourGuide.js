const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema({
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
        type: Number, required: false,
    },
    yearsOfExperience: {
        type: Number, required: false, 
    },
    previousWork: {
        type: String, required: false,
    }
      },{ timestamps: true });
       
const tourGuide = mongoose.models.tourGuide || mongoose.model('tourGuide', tourGuideSchema);
module.exports = tourGuide;
