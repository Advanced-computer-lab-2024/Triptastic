const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI ;
const {createTourist} = require("./Routes/touristController");
const {createTourGuide,getTourGuide}= require("./Routes/tourGuideController");

const app = express();
const port = process.env.PORT 
const tourist = require('./Models/Tourist');


mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));
app.use(express.json())
app.post("/addTourist",createTourist);
app.post("/addTourGuide",createTourGuide);