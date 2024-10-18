const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },
 
  RequestDate: { 
    type: Date, 
    default: Date.now 
    },
    
    
  Status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending'
  },

 
}, { timestamps: true });

const Request =mongoose.models.Request || mongoose.model('Request', requestSchema);
module.exports = Request;