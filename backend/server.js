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
const {createTourist,deleteTourist,gethistoricalLocationByName,createProductTourist} = require("./Routes/touristController");

//Advertiser
const{createAdvertiser,getAdvertiser,updateAdvertiser,deleteAdvertiser}=require("./Routes/advertiserController");

//Seller
const{ createSeller,getSeller,updateSeller,createProductseller}=require("./Routes/sellerController");

//Admin
const{createAdmin,createCategory,
  getCategory,
  updateCategory,
  deleteCategory,createPrefTag,getPrefTag,updatePreftag,deletePreftag,createProduct}=require("./routes/adminController");


//Activities 
const{createActivity,getActivity,updateActivity,deleteActivity}=require("./Routes/activitiesController");

//TourismGoverner
const{createhistoricalLocation,updatehistoricalLocation,gethistoricalLocation,deletehistoricalLocation}=require("./Routes/tourismGovController");




const app = express();
const port = process.env.PORT || "8000";
const tourist = require("./models/Tourist");
const tourGuide=require("./Models/tourGuide");
const advertiser=require("./Models/Advertiser");
const seller=require("./Models/Seller");
const admin=require("./models/Admin")
const museum=require("./models/historicalLocation");
const tourismGov=require("./models/tourismGov");
const categories=require("./models/Activitiescategory");
const activities=require("./models/Activities");
const prefTag=require("./models/PreferenceTags");


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
app.get("/getHistoricalLocationByName",gethistoricalLocationByName);
app.post("/createProductTourist",createProductTourist);

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
app.post("/createProductseller",createProductseller);

//Admin
app.post("/createAdmin",createAdmin);
app.post("/createCategory",createCategory);
app.delete("/deleteCategory",deleteCategory);
app.patch("/updateCategory",updateCategory);
app.get("/getCategory",getCategory);
app.post("/createPrefTag",createPrefTag);
app.get("/getPrefTag",getPrefTag);
app.patch("/updatePreftag",updatePreftag);
app.delete("/deletePreftag",deletePreftag);
app.post("/createProduct",createProduct);

//TourismGoverner
app.post("/createHistoricalLocation",createhistoricalLocation);
app.patch("/updateHistoricalLocation",updatehistoricalLocation);
app.get("/getHistoricalLocation",gethistoricalLocation);
app.delete("/deleteHistoricalLocation",deletehistoricalLocation);







