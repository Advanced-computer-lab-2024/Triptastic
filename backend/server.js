const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI ;
const {createTourist} = require("./Routes/touristController");
const {createTourGuide}=require("./routes/tourGuideController");
const{createAdvertiser}=require("./routes/advertiserController");


const app = express();
const port = process.env.PORT 
const tourist = require('./Models/Tourist');
const tourGuide=require('./models/tourGuide');
const advertiser=require("./models/Advertiser");


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
app.post("/addAdvertiser",createAdvertiser)

