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
const {createItinerary,getItinerary,updateItinerary,deleteItinerary,getTouristItinerary,createTouristItinerary,updateTouristItinerary,deleteTouristItinerary,getMyItineraries,getMyTouristItineraries}=require("./Routes/tourGuideController");


//Guest
const {viewAllHistoricalPlacesGuest, viewAllItinerariesGuest,viewAllUpcomingActivitiesGuest,filterActivitiesGuest,filterHistoricalLocationsByTagsGuest,filterMuseumsByTagsGuest,viewAllMuseumsGuest}=require("./Routes/guestController");


//Tourist
const {createTourist,gethistoricalLocationByName,filterActivities,getProductTourist,createProductTourist,viewProductsTourist,viewAllUpcomingActivitiesTourist
  ,viewAllItinerariesTourist,viewAllHistoricalPlacesTourist,sortProductsByRatingTourist,sortItinPASC,getActivityByCategory,sortItinPDSC,sortActPASCRASC,sortActPASCRDSC,sortActPDSCRASC,sortActPDSCRDSC,filterMuseumsByTagsTourist,filterHistoricalLocationsByTagsTourist,getActivityByname,getTourist,updateTourist,viewAllMuseumsTourist,filterProductsByPriceRange,getUniqueHistoricalPeriods,searchMuseums,searchHistoricalLocations,filterItineraries,searchActivities} = require("./Routes/touristController");

//Advertiser
const{createAdvertiser,getAdvertiser,updateAdvertiser,createActivity,getActivity,updateActivity,deleteActivity}=require("./Routes/advertiserController");

//Seller
const{ createSeller,getSeller,updateSeller,createProductseller,getProductSeller,viewProductsSeller,sortProductsByRatingSeller}=require("./Routes/sellerController");

//Admin
const{createAdmin,createCategory,
  getCategory,
  updateCategory,
  deleteCategory,getProduct,createProduct,deleteAdvertiser,deleteSeller,deleteTourGuide,deleteTourismGov,deleteTourist
,createPrefTag,updatePreftag,deletePreftag,getPrefTag,
viewProducts,sortProductsByRatingAdmin,AdminLogin,addTourismGov,
tourismGovLogin}=require("./Routes/adminController");




//TourismGoverner
const{createhistoricalLocation,updatehistoricalLocation,gethistoricalLocation,deletehistoricalLocation,
  createMuseum,getMuseum,deleteMuseum,updateMuseum
}=require("./Routes/tourismGovController");




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
const museums=require("./Models/Museums");


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
app.post("/createProductTourist",createProductTourist);
app.get("/getProductTourist",getProductTourist);
app.get("/filterActivities",filterActivities);
app.get("/viewProductsTourist",viewProductsTourist);
app.get("/viewAllUpcomingActivitiesTourist",viewAllUpcomingActivitiesTourist);
app.get("/viewAllItinerariesTourist",viewAllItinerariesTourist);
app.get("/viewAllHistoricalPlacesTourist",viewAllHistoricalPlacesTourist);
app.get("/sortProductsByRatingTourist",sortProductsByRatingTourist);
app.get("/sortItinPASC",sortItinPASC);
app.get("/getActivityByCategory",getActivityByCategory);
app.get("/sortItinPDSC",sortItinPDSC);
app.get("/sortActPASCRASC",sortActPASCRASC);
app.get("/sortActPASCRDSC",sortActPASCRDSC);
app.get("/sortActPDSCRASC",sortActPDSCRASC);
app.get("/sortActPDSCRDSC",sortActPDSCRDSC);
app.get("/filterHistoricalLocationsByTagsTourist",filterHistoricalLocationsByTagsTourist);
app.get("/filterMuseumsByTagsTourist",filterMuseumsByTagsTourist);
app.get("/getActivityByname",getActivityByname);
app.get("/getTourist",getTourist);
app.patch("/updateTourist",updateTourist);viewAllMuseumsTourist
app.get("/viewAllMuseumsTourist",viewAllMuseumsTourist);
app.get("/filterProductsByPriceRange",filterProductsByPriceRange);
app.get('/getUniqueHistoricalPeriods', getUniqueHistoricalPeriods);
app.get("/searchMuseums",searchMuseums);
app.get("/searchHistoricalLocations",searchHistoricalLocations);
app.get("/filterItineraries",filterItineraries);
app.get("/searchActivities",searchActivities);



//TourGuide
app.post("/addTourGuide",createTourGuide);
app.patch("/addTourGuideInfo",createTourGuideInfo);
app.get("/getTourGuide/",getTourGuide);
app.patch("/updateTourGuide/:Username",updateTourGuide);
app.post("/addItinerary",createItinerary);
app.get("/getItinerary/:id",getItinerary);
app.patch("/updateItinerary/:id",updateItinerary);
app.delete("/deleteItinerary/:id",deleteItinerary);
app.post("/addTouristItinerary",createTouristItinerary);
app.get("/getTouristItinerary/:id",getTouristItinerary);
app.patch("/updatetouristItinerary/:id",updateTouristItinerary);
app.delete("/deletetouristItinerary/:id",deleteTouristItinerary);
app.get("/getMyItineraries",getMyItineraries);
app.get("/getMyTouristItineraries",getMyTouristItineraries);

//Advertiser
app.post("/addAdvertiser",createAdvertiser);
app.patch("/updateAdvertiser",updateAdvertiser);
app.get("/getAdvertiser",getAdvertiser);
app.post("/createActivity",createActivity);
app.delete("/deleteActivity",deleteActivity);
app.patch("/updateActivity",updateActivity);
app.get("/getActivity",getActivity);

//Seller
app.post("/createSeller",createSeller);
app.patch('/updateSeller', updateSeller);
app.get("/getSeller",getSeller);
app.post("/createProductseller",createProductseller);
app.get("/getProductSeller",getProductSeller);
app.get("/viewProductsSeller",viewProductsSeller);
app.get("/sortProductsByRatingSeller",sortProductsByRatingSeller);

//Admin
app.post("/tourismGovLogin",tourismGovLogin);
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
app.post("/createPrefTag",createPrefTag);
app.get("/getPrefTag",getPrefTag);
app.patch("/updatePreftag",updatePreftag);
app.delete("/deletePreftag",deletePreftag);
app.post("/createProduct",createProduct);
app.get("/getProduct",getProduct);
app.get("/viewProducts",viewProducts);
app.get("/sortProductsByRatingAdmin",sortProductsByRatingAdmin);
app.post("/AdminLogin",AdminLogin);
app.post("/addTourismGov",addTourismGov);


//TourismGoverner
app.post("/createHistoricalLocation",createhistoricalLocation);
app.patch("/updateHistoricalLocation",updatehistoricalLocation);
app.get("/getHistoricalLocation",gethistoricalLocation);
app.delete("/deleteHistoricalLocation",deletehistoricalLocation);
app.post("/createMuseum",createMuseum);
app.patch("/updateMuseum",updateMuseum);
app.get("/getMuseum",getMuseum);
app.delete("/deleteMuseum",deleteMuseum);


//Guest
app.get("/viewAllUpcomingActivitiesGuest",viewAllUpcomingActivitiesGuest);
app.get("/viewAllItinerariesGuest",viewAllItinerariesGuest);
app.get("/viewAllHistoricalPlacesGuest",viewAllHistoricalPlacesGuest);
app.get("/filterActivitiesGuest",filterActivitiesGuest);
app.get("/filterHistoricalLocationsByTagsGuest",filterHistoricalLocationsByTagsGuest);
app.get("/filterMuseumsByTagsGuest",filterMuseumsByTagsGuest);viewAllMuseumsGuest
app.get("/viewAllMuseumsGuest",viewAllMuseumsGuest);




