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
  },
  TicketPrices: {
    type: String,
    required: false,
  },

}, { timestamps: true });

const Museum = mongoose.model('Museum', museumSchema);
module.exports = Museum;