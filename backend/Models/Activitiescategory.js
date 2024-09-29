const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitiescategorySchema  = new Schema({
  
Name: {
    type: String,
    required: true
  
  }
 




}, { timestamps: true });

const Activitiescategory = mongoose.models.Activitiescategory|| mongoose.model('Activitiescategory',ActivitiescategorySchema );
module.exports = Activitiescategory;
