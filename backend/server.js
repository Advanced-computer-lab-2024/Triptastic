const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI ;
//Tour Guide
const {createTourGuideInfo}=require("./routes/tourGuideController");
const {updateTourGuide}=require("./routes/tourGuideController");
const {getTourGuide}=require("./routes/tourGuideController");

//Tourist
const {createTourist} = require("./Routes/touristController");

//Advertiser
const{createAdvertiser,createAdvertiserInfo,getAdvertiser,updateAdvertiser}=require("./routes/advertiserController");

//Seller
const{createSellerInfo, createSeller,getSeller,updateSeller}=require("./Routes/sellerController");

//Admin
const{createAdmin,getAdmin}=require("./Routes/adminController")


const app = express();
const port = process.env.PORT || "8000";
const tourist = require("./models/Tourist");
const tourGuide=require("./models/tourGuide");
const advertiser=require("./models/Advertiser");
const seller=require("./models/Seller");
const admin=require("./models/Admin");

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

//Tourist
app.post("/addTourist",createTourist);

//TourGuide
app.patch("/addTourGuide",createTourGuideInfo);
app.get("/getTourGuide",getTourGuide);
app.patch("/updateTourGuide",updateTourGuide);

//Advertiser
app.post("/addAdvertiser",createAdvertiser);
app.patch("/createAdvertiserInfo",createAdvertiserInfo);
app.patch("/updateAdvertiser",updateAdvertiser);
app.get("/getAdvertiser",getAdvertiser);

//Seller
app.post("/createSeller",createSeller);
app.patch("/createSellerInfo",createSellerInfo);
app.patch("/updateSeller",updateSeller);
app.get("/getSeller",getSeller);

//Admin
app.get("/createAdmin",createAdmin);
app.post("/getAdmin",getAdmin);




