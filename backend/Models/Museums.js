const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const museumSchema = new Schema({
Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
  Location: {
    type: String,
    required: false,
  },
  OpeningHours: {
    type: String,
    required: false,
  }
  ,
  TicketPrices: {
    Foreigner: {
      type: Number,
      required: true
    },
    Native: {
      type: Number,
      required: true
    },
    Student: {
      type: Number,
      required: true
    }
  }
  ,
  Tags:{
    
    HistoricalPeriod:{
    type:String,
    required :false}
  },
  image: {  
    type: String,  
    required: false,
  },
  TourismGovernor:{
    type: String,
    required: true,
  }
}, { timestamps: true });

const museum = mongoose.model('museum', museumSchema);
module.exports = museum;