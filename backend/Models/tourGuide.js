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
        type: Number, default:null,
    },
    yearsOfExperience: {
        type: Number, default:null, 
    },
    previousWork: {
        type: String, default:null,
    },
    Photo: {
     type:String,
     required:false,
    },
      },{ timestamps: true });
       
const tourGuide = mongoose.models.tourGuide || mongoose.model('tourGuide', tourGuideSchema);
module.exports = tourGuide;
