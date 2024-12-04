const express = require("express");
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
mongoose.set('strictQuery', false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI ;
const upload = require("./Middleware/uploadMiddleware"); 
//Tour Guide
const {createTourGuideInfo,createTourGuide,getTouristReportForItinerary,filterItinerariesByMonth,loginTourGuide}=require("./Routes/tourGuideController");
const {updateTourGuide}=require("./Routes/tourGuideController");
const {getTourGuide}=require("./Routes/tourGuideController");
const {createItinerary,getItinerary,updateItinerary,deleteItinerary,getTouristItinerary,createTouristItinerary,updateTouristItinerary,deleteTouristItinerary,getMyItineraries,getMyTouristItineraries,requestAccountDeletionTourG}=require("./Routes/tourGuideController");
const {resetPasswordTG,requestOTPTG,changePasswordTourGuide,getPendingTourGuides,settleDocsTourGuide,deactivateItinrary,activateItinrary,getFilteredItineraries,filterByItinerary}=require("./Routes/tourGuideController");

//Guest
const {viewAllHistoricalPlacesGuest, viewAllItinerariesGuest,viewAllUpcomingActivitiesGuest,filterActivitiesGuest,filterHistoricalLocationsByTagsGuest,filterMuseumsByTagsGuest,viewAllMuseumsGuest}=require("./Routes/guestController");


//Tourist
const {getTouristIntroStatus,sendItineraryReminders,sendActivityReminders,getNotifications,markNotificationsRead,requestNotification,requestNotificationItinerary,updateProductQuantityInCart,removeProductFromCart,bookmarkEvent,addToCartAndRemoveFromWishlist,removeBookmark,getBookmarkedEvents,resetPassword,requestOTP,getCart,addProductToCart,getAttendedActivities,getCurrencyRates,changepasswordTourist,createTourist,gethistoricalLocationByName,filterActivities,getProductTourist,createProductTourist,viewProductsTourist,viewAllUpcomingActivitiesTourist
  ,viewAllItinerariesTourist,viewAllHistoricalPlacesTourist,sortProductsByRatingTourist,sortItinPASC,getActivityByCategory,
  sortItinPDSC,sortActPASCRASC,sortActPASCRDSC,sortActPDSCRASC,sortActPDSCRDSC,filterMuseumsByTagsTourist,filterHistoricalLocationsByTagsTourist,
  getActivityByname,getTourist,updateTourist,viewAllMuseumsTourist,filterProductsByPriceRange,getUniqueHistoricalPeriods,searchMuseums,searchHistoricalLocations,filterItineraries,searchActivities,commentOnActivity,rateActivity,
  fileComplaint,getComplaintsByTourist,shareActivity,shareHistorical,shareMuseum,addReviewToProduct,bookActivity,bookItinerary,shareItinerary,getBookedItineraries,submitFeedback,cancelBookedItinerary,requestAccountDeletionTourist,cancelActivity,getBookedActivities,getActivityToShare,setPreferences,getTransportation,submitFeedbackItinerary,loginTourist,addProductToWishlist,getWishlist,removeProductFromWishlist,addAddress,getAddresses,createOrder,payWithWallet,sendConfirmationEmail,applyPromoCode,getTouristOrders} = require("./Routes/touristController");

//Advertiser
const{changePasswordAdvertiser,createAdvertiser,getAdvertiser,updateAdvertiser,createActivity,getActivity,updateActivity,deleteActivity,viewActivitydetails,requestAccountDeletionAdvertiser,getPendingAdvertisers,createTransportation,settleDocsAdvertiser,getTouristReportForActivity,filterActivitiesByMonth,loginAdvertiser,filterByActivity,getFilteredActivities}=require("./Routes/advertiserController");

//Seller
const{viewMyProducts,deleteAllNotifications,getNotificationsForAdmin,checkAndNotifyOutOfStockAdmin,getNotificationsForSeller,checkAndNotifyOutOfStockSeller,changePasswordSeller, createSeller,getSeller,updateSeller,createProductseller,getProductSeller,viewProductsSeller,sortProductsByRatingSeller,requestAccountDeletionSeller,getPendingSellers,settleDocsSeller,loginSeller,filterByProduct,getFilteredProducts}=require("./Routes/sellerController");

//Admin
const{getPromoCodes,createPromoCode,getUserStatistics,replyToComplaint,rejectDeletionRequest,acceptDeletionRequest,getPendingDeletionRequests,updateComplaintStatus,getComplaintDetails,changePasswordAdmin,createAdmin,createCategory,
  getCategory,
  updateCategory,
  deleteCategory,getProduct,createProduct,deleteAdvertiser,deleteSeller,deleteTourGuide,deleteTourismGov,deleteTourist
,createPrefTag,updatePreftag,deletePreftag,getPrefTag,
viewProducts,sortProductsByRatingAdmin,AdminLogin,addTourismGov,
tourismGovLogin,viewAllPrefTag,deleteAdmin,flagItinerary,flagTouristItinerary,
flagActivity,getallActivities,getallTouristItineraries,getallItineraries,getComplaints,archiveProduct,unarchiveProduct,getFilteredP,viewAllProducts,actProfits,itinProfits}=require("./Routes/adminController");




//TourismGoverner
const{changePasswordTourismGov,createhistoricalLocation,updatehistoricalLocation,gethistoricalLocation,deletehistoricalLocation,
  createMuseum,getMuseum,deleteMuseum,updateMuseum,viewMyLocations,viewMyMuseums,gethistoricalDetails,getMuseumDetails
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
const cart=require("./Models/Cart");
const stripe = require('stripe')('sk_test_51QPR4CHmIrhpZsCU2LMQa6mIZ31UWoQneetd05jwMgPmu7bdstdZmu6L17w0tLU3xSzPbBSeTruUPAyrWCpTCpj900oMSuTeOi'); // Replace with your secret Stripe key




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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.query; // The amount should come from the activity's booking price
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents (e.g., 1000 = $10)
      currency: 'usd', // or your desired currency
      payment_method_types: ['card'], // Allow credit/debit card payments
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Tourist
app.post("/bookActivity",bookActivity);
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
app.patch("/updateTourist",updateTourist);
app.get("/viewAllMuseumsTourist",viewAllMuseumsTourist);
app.get("/filterProductsByPriceRange",filterProductsByPriceRange);
app.get('/getUniqueHistoricalPeriods', getUniqueHistoricalPeriods);
app.get("/searchMuseums",searchMuseums);
app.get("/searchHistoricalLocations",searchHistoricalLocations);
app.get("/filterItineraries",filterItineraries);
app.get("/searchActivities",searchActivities);
app.post("/commentOnActivity",commentOnActivity);
app.post("/rateActivity",rateActivity);
app.post("/shareActivity/:name",shareActivity);
app.post("/shareHistorical/:Name",shareHistorical);
app.post("/shareMuseum/:Name",shareMuseum);
app.post("/shareItinerary/:id",shareItinerary);
app.post('/fileComplaint', fileComplaint);
app.get("/getComplaintsByTourist", getComplaintsByTourist);
app.patch("/changepasswordTourist",changepasswordTourist);
app.patch("/addReviewToProduct",addReviewToProduct);
app.post("/bookItinerary",bookItinerary);
app.get("/getBookedItineraries", getBookedItineraries);
app.post("/submitFeedback",submitFeedback);
app.post("/submitFeedbackItinerary",submitFeedbackItinerary);
app.patch('/cancelBookedItinerary/:itineraryId',cancelBookedItinerary);
app.post("/requestAccountDeletionTourist",requestAccountDeletionTourist);
app.delete('/cancelBookedActivity/:activityId', cancelActivity);
app.get('/getBookedActivities',getBookedActivities)
app.get('/getActivityToShare/:name',getActivityToShare)
app.post('/setPreferences',setPreferences);
app.get('/getTransportation',getTransportation);
app.get('/getCurrencyRates',getCurrencyRates);
app.get('/getAttendedActivities',getAttendedActivities);
app.post("/addProductToCart",addProductToCart);
app.get('/getCart',getCart);
app.post('/loginTourist',loginTourist);
app.post('/requestOTP',requestOTP);
app.post('/resetPassword',resetPassword); 
app.post('/bookmarkEvent',bookmarkEvent);
app.post('/removeBookmark',removeBookmark);
app.get('/getBookmarkedEvents',getBookmarkedEvents);
app.patch('/addProductToWishlist',addProductToWishlist);
app.patch('/removeProductFromWishlist',removeProductFromWishlist);
app.get('/getWishlist',getWishlist);
app.post('/addToCartAndRemoveFromWishlist', addToCartAndRemoveFromWishlist);
app.post('/removeProductFromCart',removeProductFromCart);
app.patch('/updateProductQuantityInCart',updateProductQuantityInCart);
app.post('/requestNotification',requestNotification);
app.post('/requestNotificationItinerary',requestNotificationItinerary);
app.get("/getNotifications", getNotifications);
app.patch("/markNotificationsRead", markNotificationsRead);
app.post('/addAddress',addAddress);
app.get("/getAddresses", getAddresses);
app.post("/sendItineraryReminders", sendItineraryReminders);
app.post('/createOrder',createOrder);
app.patch('/payWithWallet',payWithWallet);
app.post('/sendPaymentEmail',sendConfirmationEmail);
app.patch('/applyPromoCode',applyPromoCode);
app.get("/getTouristIntroStatus", getTouristIntroStatus);
app.get('/getTouristOrders',getTouristOrders);



//TourGuide
app.get("/getTouristReportForItinerary/:itineraryId",getTouristReportForItinerary);
app.post("/addTourGuide",upload.fields([{ name: 'Id', maxCount: 1 }, { name: 'Certificate', maxCount: 1 } ]),createTourGuide);
app.patch("/addTourGuideInfo",createTourGuideInfo);
app.get("/getTourGuide/",getTourGuide);
app.patch("/updateTourGuide/:Username",upload.single('photo'),updateTourGuide);
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
app.patch("/changePasswordTourGuide",changePasswordTourGuide);
app.get("/getPendingTourGuides",getPendingTourGuides);
app.patch("/settleDocsTourGuide",settleDocsTourGuide);
app.patch("/deactivateItinrary/:id",deactivateItinrary);
app.patch("/activateItinrary/:id",activateItinrary);
app.get("/filterItinerariesByMonth", filterItinerariesByMonth);
app.post('/loginTourGuide',loginTourGuide);
app.get('/getFilteredItineraries',getFilteredItineraries);
app.get('/filterByItinerary',filterByItinerary);
app.post('/requestOTPTG',requestOTPTG);
app.post('/resetPasswordTG',resetPasswordTG); 

//Advertiser
app.get("/getTouristReportForActivity/:activityId",getTouristReportForActivity);
app.post("/addAdvertiser",upload.fields([{ name: 'Id', maxCount: 1 }, { name: 'TaxationRegistryCard', maxCount: 1 } ]),createAdvertiser);
app.patch("/updateAdvertiser",upload.single('Logo'),updateAdvertiser);
app.get("/getAdvertiser",getAdvertiser);
app.post("/createActivity",createActivity);
app.delete("/deleteActivity",deleteActivity);
app.patch("/updateActivity",updateActivity);
app.get("/getActivity",getActivity);
app.get("/viewActivitydetails",viewActivitydetails);
app.post("/requestAccountDeletionAdvertiser",requestAccountDeletionAdvertiser);
app.patch("/changePasswordAdvertiser",changePasswordAdvertiser);
app.get('/getPendingAdvertisers',getPendingAdvertisers);
app.post('/createTransportation',createTransportation);
app.patch('/settleDocsAdvertiser',settleDocsAdvertiser);
app.get('/filterActivitiesByMonth', filterActivitiesByMonth);
app.post('/loginAdvertiser',loginAdvertiser);
app.get('/filterByActivity',filterByActivity);
app.get('/getFilteredActivities',getFilteredActivities);
//Seller
app.post('/createSeller', upload.fields([{ name: 'Id', maxCount: 1 }, { name: 'TaxationRegistryCard', maxCount: 1 } ]), createSeller);
app.patch('/updateSeller', upload.single('Logo'),updateSeller);
app.get("/getSeller",getSeller);
app.post("/createProductseller", upload.single('image'),createProductseller);
app.get("/getProductSeller",getProductSeller);
app.get("/viewProductsSeller",viewProductsSeller);
app.get("/sortProductsByRatingSeller",sortProductsByRatingSeller);
app.post("/requestAccountDeletionSeller",requestAccountDeletionSeller);
app.patch("/changePasswordSeller",changePasswordSeller);
app.get("/getPendingSellers",getPendingSellers);
app.patch("/settleDocsSeller",settleDocsSeller);
app.post('/loginSeller',loginSeller);
app.get("/checkAndNotifyOutOfStockSeller",checkAndNotifyOutOfStockSeller);
app.get('/getNotificationsForSeller', getNotificationsForSeller);
app.get("/checkAndNotifyOutOfStockAdmin",checkAndNotifyOutOfStockAdmin);
app.get('/getNotificationsForAdmin', getNotificationsForAdmin);
app.delete("/deleteAllNotifications",deleteAllNotifications);
app.post("/sendActivityReminders", sendActivityReminders);
app.get("/viewMyProducts",viewMyProducts);
app.get('/filterByProduct',filterByProduct);
app.get('/getFilteredProducts',getFilteredProducts);


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
app.post("/createProduct",upload.single('image'),createProduct);
app.get("/getProduct",getProduct);
app.get("/viewProducts",viewProducts);
app.get("/sortProductsByRatingAdmin",sortProductsByRatingAdmin);
app.post("/AdminLogin",AdminLogin);
app.post("/addTourismGov",addTourismGov);
app.get("/viewAllPrefTag",viewAllPrefTag);
app.delete("/deleteAdmin",deleteAdmin);
app.patch('/flagItinerary/:id',flagItinerary);
app.patch('/flagTouristItinerary/:id',flagTouristItinerary);
app.patch('/flagActivity/:id',flagActivity);
app.get('/getAllItineraries',getallItineraries);
app.get('/getAllActivities',getallActivities);
app.get('/getAllTouristItineraries',getallTouristItineraries)
app.patch("/changePasswordAdmin",changePasswordAdmin);
app.get("/getComplaints",getComplaints);
app.get('/getComplaintDetails/:id', getComplaintDetails);
app.patch('/updateComplaintStatus/:id', updateComplaintStatus);
app.get("/getPendingDeletionRequests",getPendingDeletionRequests);
app.post("/acceptDeletionRequest",acceptDeletionRequest);
app.post("/rejectDeletionRequest",rejectDeletionRequest);
app.post("/replyToComplaint/:id",replyToComplaint);
app.patch("/archiveProduct/:productName",archiveProduct);
app.patch("/unarchiveProduct/:productName",unarchiveProduct);
app.get("/getUserStatistics",getUserStatistics);
app.post("/createPromoCode",createPromoCode);
app.get('/getPromoCodes',getPromoCodes);
app.get('/getFilteredP',getFilteredP)
app.get('/viewAllProducts',viewAllProducts);
app.get('/actProfits',actProfits);
app.get('/itinProfits',itinProfits);


//TourismGoverner
app.post("/createHistoricalLocation",createhistoricalLocation);
app.patch("/updateHistoricalLocation",updatehistoricalLocation);
app.get("/getHistoricalLocation",gethistoricalLocation);
app.get("/gethistoricalDetails/:Name",gethistoricalDetails);
app.delete("/deleteHistoricalLocation",deletehistoricalLocation);
app.post("/createMuseum",createMuseum);
app.patch("/updateMuseum",updateMuseum);
app.get("/getMuseumDetails/:Name",getMuseumDetails);
app.get("/getMuseum",getMuseum);
app.delete("/deleteMuseum",deleteMuseum);
app.get("/viewMyLocations",viewMyLocations);
app.get("/viewMyMuseums",viewMyMuseums);
app.patch("/changePasswordTourismGov",changePasswordTourismGov);


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


