const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
mongoose.set('strictQuery', false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI ;
//Tour Guide
const {createTourGuideInfo,createTourGuide}=require("./Routes/tourGuideController");
const {updateTourGuide}=require("./Routes/tourGuideController");
const {getTourGuide}=require("./Routes/tourGuideController");
const {deleteTourGuide}=require("./Routes/tourGuideController");
const {createItinerary,getItinerary,updateItinerary,deleteItinerary}=require("./Routes/tourGuideController");

//Tourist
const {createTourist,deleteTourist} = require("./routes/touristController");

//Advertiser
const{createAdvertiser,createAdvertiserInfo,getAdvertiser,updateAdvertiser,deleteAdvertiser}=require("./routes/advertiserController");

//Seller
const{createSellerInfo, createSeller,getSeller,updateSeller}=require("./routes/sellerController");


const app = express();
const port = process.env.PORT || "8000";
const tourist = require("./models/Tourist");
const tourGuide=require("./models/tourGuide");
const advertiser=require("./models/Advertiser");
const seller=require("./models/Seller");

mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));
app.use(express.json());
app.use(cors());

//Tourist
app.post("/addTourist",createTourist);
app.delete("/deleteTourist",deleteTourist);
//TourGuide
app.post("/addTourGuide",createTourGuide);
app.patch("/addTourGuideInfo",createTourGuideInfo);
app.get("/getTourGuide",getTourGuide);
app.patch("/updateTourGuide",updateTourGuide);
app.delete("/deleteTourGuide",deleteTourGuide);
app.post("/addItinerary",createItinerary);
app.get("/getItinerary",getItinerary);
app.patch("/updateItinerary",updateItinerary);
app.delete("/deleteItinerary",deleteItinerary);
//Advertiser
app.post("/addAdvertiser",createAdvertiser);
app.patch("/createAdvertiserInfo",createAdvertiserInfo);
app.patch("/updateAdvertiser",updateAdvertiser);
app.get("/getAdvertiser",getAdvertiser);
app.delete("/deleteAdvertiser",deleteAdvertiser);

//Seller
app.post("/createSeller",createSeller);
app.patch("/createSellerInfo",createSellerInfo);
app.patch("/updateSeller",updateSeller);
app.get("/getSeller",getSeller);




