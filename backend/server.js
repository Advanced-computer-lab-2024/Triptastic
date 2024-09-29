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
const{createAdvertiser,getAdvertiser,updateAdvertiser,deleteAdvertiser}=require("./routes/advertiserController");

//Seller
const{ createSeller,getSeller,updateSeller}=require("./routes/sellerController");

//Admin
const{createAdmin,createActivity,getActivity,updateActivity,deleteActivity,createPrefTag}=require("./routes/adminController");


//Activities 


//TourismGoverner
const{createMuseum,updateMuseum,getMuseum,deleteMuseum}=require("./routes/tourismGovController");




const app = express();
const port = process.env.PORT || "8000";
const tourist = require("./Models/Tourist");
const tourGuide=require("./Models/tourGuide");
const advertiser=require("./Models/Advertiser");
const seller=require("./Models/Seller");
const admin=require("./Models/Admin")
const museum=require("./Models/Museum");
const tourismGov=require("./Models/tourismGov");
const activities=require("./Models/Activitiescategory")
const preferenceTags= require("./Models/PreferenceTags")


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
app.get("/getTourGuide/:Username",getTourGuide);
app.patch("/updateTourGuide/:Username",updateTourGuide);
app.delete("/deleteTourGuide",deleteTourGuide);
app.post("/addItinerary",createItinerary);
app.get("/getItinerary",getItinerary);
app.patch("/updateItinerary/:location/:datesTimes",updateItinerary);
app.delete("/deleteItinerary/:location/:datesTimes",deleteItinerary);
app.patch("/updateItinerary",updateItinerary);
app.delete("/deleteItinerary",deleteItinerary);

//Advertiser
app.post("/addAdvertiser",createAdvertiser);

app.patch("/updateAdvertiser",updateAdvertiser);
app.get("/getAdvertiser",getAdvertiser);
app.delete("/deleteAdvertiser",deleteAdvertiser);

//Seller
app.post("/createSeller",createSeller);
app.patch("/updateSeller",updateSeller);
app.get("/getSeller",getSeller);

//Admin
app.post("/createAdmin",createAdmin);
app.post("/createActivity",createActivity);
app.delete("/deleteActivity",deleteActivity);
app.patch("/updateActivity",updateActivity);
app.get("/getActivity",getActivity);
app.post("/createPrefTag",createPrefTag);


//TourismGoverner 
app.post("/createMuseum",createMuseum);
app.patch("/updateMuseum",updateMuseum);
app.get("/getMuseum",getMuseum);
app.delete("/deleteMuseum",deleteMuseum);











