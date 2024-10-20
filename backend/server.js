const express = require("express");
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
mongoose.set('strictQuery', false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI ;
const upload = require("./Middleware/uploadMiddleware"); 
//Tour Guide
const {createTourGuideInfo,createTourGuide}=require("./Routes/tourGuideController");
const {updateTourGuide}=require("./Routes/tourGuideController");
const {getTourGuide}=require("./Routes/tourGuideController");
const {createItinerary,getItinerary,updateItinerary,deleteItinerary,getTouristItinerary,createTouristItinerary,updateTouristItinerary,deleteTouristItinerary,getMyItineraries,getMyTouristItineraries,requestAccountDeletionTourG}=require("./Routes/tourGuideController");


//Guest
const {viewAllHistoricalPlacesGuest, viewAllItinerariesGuest,viewAllUpcomingActivitiesGuest,filterActivitiesGuest,filterHistoricalLocationsByTagsGuest,filterMuseumsByTagsGuest,viewAllMuseumsGuest}=require("./Routes/guestController");


//Tourist
const {createTourist,gethistoricalLocationByName,filterActivities,getProductTourist,createProductTourist,viewProductsTourist,viewAllUpcomingActivitiesTourist
  ,viewAllItinerariesTourist,viewAllHistoricalPlacesTourist,sortProductsByRatingTourist,sortItinPASC,getActivityByCategory,sortItinPDSC,sortActPASCRASC,sortActPASCRDSC,sortActPDSCRASC,sortActPDSCRDSC,filterMuseumsByTagsTourist,filterHistoricalLocationsByTagsTourist,getActivityByname,getTourist,updateTourist,viewAllMuseumsTourist,filterProductsByPriceRange,getUniqueHistoricalPeriods,searchMuseums,searchHistoricalLocations,filterItineraries,searchActivities,commentOnActivity,rateActivity,fileComplaint,getComplaintsByTourist} = require("./Routes/touristController");

//Advertiser
const{createAdvertiser,getAdvertiser,updateAdvertiser,createActivity,getActivity,updateActivity,deleteActivity,viewActivitydetails,requestAccountDeletionAdvertiser}=require("./Routes/advertiserController");

//Seller
const{changePassword, createSeller,getSeller,updateSeller,createProductseller,getProductSeller,viewProductsSeller,sortProductsByRatingSeller,requestAccountDeletionSeller}=require("./Routes/sellerController");

//Admin
const{createAdmin,createCategory,
  getCategory,
  updateCategory,
  deleteCategory,getProduct,createProduct,deleteAdvertiser,deleteSeller,deleteTourGuide,deleteTourismGov,deleteTourist
,createPrefTag,updatePreftag,deletePreftag,getPrefTag,
viewProducts,sortProductsByRatingAdmin,AdminLogin,addTourismGov,
tourismGovLogin,viewAllPrefTag,deleteAdmin,flagItinerary,flagTouristItinerary,flagActivity,getallActivities,getallTouristItineraries,getallItineraries}=require("./Routes/adminController");




//TourismGoverner
const{createhistoricalLocation,updatehistoricalLocation,gethistoricalLocation,deletehistoricalLocation,
  createMuseum,getMuseum,deleteMuseum,updateMuseum,viewMyLocations,viewMyMuseums
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
const request=require("./Models/Request");

// Set up session middleware
app.use(session({
  secret: 'yourSecretKey',  // Use a strong secret for signing the session ID
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set to true if using HTTPS in production
}));

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
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
}));




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
app.post("/commentOnActivity",commentOnActivity);
app.post("/rateActivity",rateActivity);
app.post('/setCurrency', (req, res) => {
  const { currency } = req.body;

  if (!currency) {
    return res.status(400).json({ error: 'Currency is required' });
  }

  // Store the selected currency in the session
  req.session.selectedCurrency = currency;

  res.status(200).json({ message: `Currency set to ${currency}` });
});
app.post('/fileComplaint', fileComplaint);

app.get("/getComplaintsByTourist", getComplaintsByTourist);



//TourGuide
app.post("/addTourGuide",upload.fields([{ name: 'Id', maxCount: 1 }, { name: 'Certificate', maxCount: 1 } ]),createTourGuide);
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
app.post("/requestAccountDeletionTourG",requestAccountDeletionTourG);

//Advertiser
app.post("/addAdvertiser",upload.fields([{ name: 'Id', maxCount: 1 }, { name: 'TaxationRegistryCard', maxCount: 1 } ]),createAdvertiser);
app.patch("/updateAdvertiser",upload.single('Logo'),updateAdvertiser);
app.get("/getAdvertiser",getAdvertiser);
app.post("/createActivity",createActivity);
app.delete("/deleteActivity",deleteActivity);
app.patch("/updateActivity",updateActivity);
app.get("/getActivity",getActivity);
app.get("/viewActivitydetails",viewActivitydetails);
app.post("/requestAccountDeletionAdvertiser",requestAccountDeletionAdvertiser);

//Seller
app.post('/createSeller', upload.fields([{ name: 'Id', maxCount: 1 }, { name: 'TaxationRegistryCard', maxCount: 1 } ]), createSeller);
app.patch('/updateSeller', upload.single('Logo'),updateSeller);
app.get("/getSeller",getSeller);
app.post("/createProductseller",createProductseller);
app.get("/getProductSeller",getProductSeller);
app.get("/viewProductsSeller",viewProductsSeller);
app.get("/sortProductsByRatingSeller",sortProductsByRatingSeller);
app.post("/requestAccountDeletionSeller",requestAccountDeletionSeller);
app.patch("/changePassword",changePassword);



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
app.get("/viewAllPrefTag",viewAllPrefTag);
app.delete("/deleteAdmin",deleteAdmin);
app.patch('/flagItinerary',flagItinerary);
app.patch('/flagTouristItinerary',flagTouristItinerary);
app.patch('/flagActivitiy',flagActivity)
app.get('/getAllItineraries',getallItineraries);
app.get('/getAllActivities',getallActivities);
app.get('getAllTouristItineraries',getallTouristItineraries)

//TourismGoverner
app.post("/createHistoricalLocation",createhistoricalLocation);
app.patch("/updateHistoricalLocation",updatehistoricalLocation);
app.get("/getHistoricalLocation",gethistoricalLocation);
app.delete("/deleteHistoricalLocation",deletehistoricalLocation);
app.post("/createMuseum",createMuseum);
app.patch("/updateMuseum",updateMuseum);
app.get("/getMuseum",getMuseum);
app.delete("/deleteMuseum",deleteMuseum);
app.get("/viewMyLocations",viewMyLocations);
app.get("/viewMyMuseums",viewMyMuseums);


//Guest
app.get("/viewAllUpcomingActivitiesGuest",viewAllUpcomingActivitiesGuest);
app.get("/viewAllItinerariesGuest",viewAllItinerariesGuest);
app.get("/viewAllHistoricalPlacesGuest",viewAllHistoricalPlacesGuest);
app.get("/filterActivitiesGuest",filterActivitiesGuest);
app.get("/filterHistoricalLocationsByTagsGuest",filterHistoricalLocationsByTagsGuest);
app.get("/filterMuseumsByTagsGuest",filterMuseumsByTagsGuest);viewAllMuseumsGuest
app.get("/viewAllMuseumsGuest",viewAllMuseumsGuest);

app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


