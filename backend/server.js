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
const {createItinerary,getItinerary,updateItinerary,deleteItinerary}=require("./Routes/tourGuideController");


//Tourist
const {createTourist,gethistoricalLocationByName} = require("./Routes/touristController");

//Advertiser
const{createAdvertiser,getAdvertiser,updateAdvertiser}=require("./Routes/advertiserController");

//Seller
const{ createSeller,getSeller,updateSeller}=require("./Routes/sellerController");

//Admin
const{createAdmin,createCategory,
  getCategory,
  updateCategory,
  deleteCategory,deleteTourGuide,deleteAdvertiser,deleteTourist,
  deleteSeller,deleteTourismGov}=require("./Routes/adminController");


//Activities 
const{createActivity,getActivity,updateActivity,deleteActivity}=require("./Routes/activitiesController");

//TourismGoverner
const{createhistoricalLocation,updatehistoricalLocation,gethistoricalLocation,deletehistoricalLocation}=require("./Routes/tourismGovController");




const app = express();
const port = process.env.PORT || "8000";
const tourist = require("./Models/Tourist");
const tourGuide=require("./Models/tourGuide");
const advertiser=require("./Models/Advertiser");
const seller=require("./Models/Seller");
const admin=require("./Models/Admin");
const museum=require("./Models/historicalLocation");
const tourismGov=require("./Models/tourismGov");
const categories=require("./Models/Activitiescategory");
const activities=require("./Models/Activities");
const historicalLocation=require("./Models/historicalLocation")

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
app.get("/getHistoricalLocationByName",gethistoricalLocationByName);
//TourGuide
app.post("/addTourGuide",createTourGuide);
app.patch("/addTourGuideInfo",createTourGuideInfo);
app.get("/getTourGuide/:Username",getTourGuide);
app.patch("/updateTourGuide/:Username",updateTourGuide);
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

//Seller
app.post("/createSeller",createSeller);
app.patch("/updateSeller",updateSeller);
app.get("/getSeller",getSeller);

//Admin
app.delete("/deleteTourGuide",deleteTourGuide);
app.delete("/deleteAdvertiser",deleteAdvertiser);
app.delete("/deleteTourist",deleteTourist);
app.delete("/deleteSeller",deleteSeller);
app.delete("/deleteTourismGov",deleteTourismGov);
app.post("/createAdmin",createAdmin);
app.post("/createCategory",createCategory);
app.delete("/deleteCategory",deleteCategory);
app.patch("/updateCategory",updateCategory);
app.get("/getCategory",getCategory);

//TourismGoverner
app.post("/createHistoricalLocation",createhistoricalLocation);
app.patch("/updateHistoricalLocation",updatehistoricalLocation);
app.get("/getHistoricalLocation",gethistoricalLocation);
app.delete("/deleteHistoricalLocation",deletehistoricalLocation);







