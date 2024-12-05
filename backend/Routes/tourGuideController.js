const tourGuideModel = require('../Models/tourGuide.js');
const itineraryModel = require('../Models/Itinerary.js');
const touristItineraryModel= require('../Models/touristItinerary.js');
const touristModel=require('../Models/Tourist.js');
const requestModel= require('../Models/Request.js');
const { default: mongoose } = require('mongoose');
const ItinBookingModel = require('../Models/itinbookings.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const createTourGuide = async (req, res) => {
  const { Username, Email, Password } = req.body;
  const idDocument = req.files?.Id?.[0]?.path || null;
  const certificate = req.files?.Certificate?.[0]?.path || null;

  try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Create the tour guide
      const tourGuide = await tourGuideModel.create({
          Username,
          Email,
          Password: hashedPassword,
          Id: idDocument,
          Certificate: certificate,
      });

      res.status(201).json({
          message: 'Tour Guide registered successfully',
          tourGuide,
      });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};
const loginTourGuide = async (req, res) => {
  const { Username, Password } = req.body;

  try {
      // Find the tour guide by email
      const tourGuide = await tourGuideModel.findOne({ Username });
      if (!tourGuide) {
          return res.status(404).json({ error: 'Tour Guide not found' });
      }

      // Validate the password
      const isPasswordValid = await bcrypt.compare(Password, tourGuide.Password);
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign(
          { id: tourGuide._id, Email: tourGuide.Email },
          'mydevsecretkey', // Replace with a secure environment variable in production
          { expiresIn: '1h' }
      );

      res.status(200).json({
          message: 'Login successful',
          token,
          user: {
              id: tourGuide._id,
              Username: tourGuide.Username,
              Email: tourGuide.Email,
              mobileNumber: tourGuide.mobileNumber,
              yearsOfExperience: tourGuide.yearsOfExperience,
              previousWork: tourGuide.previousWork,
              docsApproved: tourGuide.docsApproved,
              photo: tourGuide.photo,
              Certificate: tourGuide.Certificate,
          },
      });
  } catch (error) {
      res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const requestOTPTG = async (req, res) => {
  const { Email } = req.body;

  try {
    const tourGuide = await tourGuideModel.findOne({ Email });
      if (!tourGuide) {
          return res.status(404).json({ error: 'Tour Guide not found' });
      }

    const otp = generateOTP();

    // Save the OTP and expiration in the database
    tourGuide.otp = otp;
    tourGuide.otpExpiry = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes
    await tourGuide.save();

    // Send OTP to email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'malook25062003@gmail.com',
        pass: 'sxvo feuu woie gpfn',
      },
    });

    const mailOptions = {
      from: 'malook25062003@gmail.com',
      to: Email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

const resetPasswordTG = async (req, res) => {
  const { Email, otp, newPassword } = req.body;

  try {
    const tourist = await tourGuideModel.findOne({ Email });
    if (!tourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (tourist.otp !== otp || Date.now() > tourist.otpExpiry) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and clear the OTP fields
    tourist.Password = hashedPassword;
    tourist.otp = null;
    tourist.otpExpiry = null;
    await tourist.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};



const createTourGuideInfo = async (req, res) => {
   const { Username, mobileNumber, yearsOfExperience, previousWork } = req.body;
   const photo = req.file ? req.file.path : null; 
 
   try {
     const tourGuide = await tourGuideModel.findOneAndUpdate(
       { Username: Username }, 
       { 
         $set: { 
           mobileNumber: mobileNumber, 
           yearsOfExperience: yearsOfExperience, 
           previousWork: previousWork, 
           ...(photo && { photo }) 
         } 
       }, 
       { new: true } 
     );
     
     res.status(200).json(tourGuide);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 };
 
 const getTourGuide= async(req,res) =>{
    const Username= req.query.Username;
    
    try {
        const tourGuide = await tourGuideModel.findOne({ Username: Username }).populate('flaggedItineraries'); 

            res.status(200).json(tourGuide);
    } 
    catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 }
 const updateTourGuide= async(req,res)=>{
   const Username=req.params.Username;
   const photo = req.file ? req.file.path : null; 
   const updates=req.body;
   try{
      const result=await tourGuideModel.updateOne({Username: Username},{$set: updates,...(photo && { photo }) });
      if (result.modifiedCount === 0) {
         return res.status(404).json({ msg: "No user found " });}
      res.status(200).json({msg:" user is updated"});
   }
   catch (error){
      res.status(400).json({error: error.message});
   }

 }

 const createItinerary=async(req,res)=>{
   const{Activities,Locations,Timeline,DurationOfActivity,Language,Price,DatesTimes,Accesibility,pickUpDropOff,bookingOpen,TourGuide}=req.body;
   try{
      const itinerary=await itineraryModel.create({Activities,Locations,Timeline,DurationOfActivity,Language,Price,DatesTimes,Accesibility,pickUpDropOff,bookingOpen,TourGuide});
      res.status(200).json(itinerary);
   }
   catch(error){
      res.status(400).json({error:error.message})

   }
 }
 const getItinerary = async (req, res) => {
   const { id } = req.params; // Ensure you're using destructuring to get 'id' from req.params
   try {
     // Use the variable 'id' obtained from req.params
     const itinerary = await itineraryModel.findById(id);
     if (!itinerary) {
       return res.status(404).json({ error: 'Itinerary not found' });
     }
     res.status(200).json(itinerary);
   } catch (error) {
     console.error('Error retrieving itinerary:', error);
     res.status(400).json({ error: error.message });
   }
 };

 const sendNotificationsForItinerary = async (itinerary) => {
  try {
    if (!itinerary.notificationRequests || itinerary.notificationRequests.length === 0) {
      console.log('No users to notify.');
      return;
    }

    const message = `The itinerary "${itinerary.name}" is now open for bookings!`;
    const now = new Date();

    for (const { username } of itinerary.notificationRequests) {
      const tourist = await touristModel.findOne({ Username: username }); // Find tourist by username
      if (tourist) {
        // Add the notification to the tourist's notifications array
        tourist.notifications.push({ message, date: now });
        await tourist.save();
        console.log(`Notification sent to user: ${username}`);
      } else {
        console.log(`User with username ${username} not found.`);
      }
    }

    // Clear the notificationRequests array in the itinerary
    itinerary.notificationRequests = [];
    await itinerary.save();

    console.log('Notifications sent to all tourists for the itinerary.');
  } catch (error) {
    console.error('Error sending notifications for itinerary:', error.message);
    throw error; // Ensure error is re-thrown for proper handling
  }
};



 
const updateItinerary = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    // Find the existing itinerary
    const existingItinerary = await itineraryModel.findById(id);
    if (!existingItinerary) {
      return res.status(404).json({ error: 'Itinerary not found.' });
    }

    // Check if bookingOpen is being updated from false to true
    const wasBookingClosed = existingItinerary.bookingOpen === false;
    const isBookingNowOpen = update.bookingOpen === true;

    // Update the itinerary
    Object.assign(existingItinerary, update);
    await existingItinerary.save();

    // If bookingOpen changed from false to true, send notifications
    if (wasBookingClosed && isBookingNowOpen) {
      await sendNotificationsForItinerary(existingItinerary);
    }

    res.status(200).json({ msg: 'Itinerary updated successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



 const deleteItinerary = async (req, res) => {
   const id=req.params.id;
   try {
      const itinerary = await itineraryModel.findById(id);
      if(itinerary.Booked===false){
       await itineraryModel.findByIdAndDelete(id);
       res.status(200).json({ msg: "Itinerary has been deleted successfully" });
      }
     else{
      res.status(409).json({ msg: "Itinerary cannot be deleted because it is booked." });
     }
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};
const createTouristItinerary=async(req,res)=>{
   const{Activities, Locations, startDate, endDate, Tags,tourGuide}=req.body;
   try{
      const touristItinerary=await touristItineraryModel.create({Activities, Locations, startDate, endDate, Tags, tourGuide});
      res.status(200).json(touristItinerary);
   }
   catch(error){
      res.status(400).json({error:error.message})

   }
 }
 const getTouristItinerary= async(req,res)=>{
   const id=req.params.id;
   try{
      const x=await touristItineraryModel.findById(id);
      res.status(200).json(x);
   }
   catch (error){
      res.status(400).json({error: error.message});
   }
 }
 const updateTouristItinerary= async(req,res)=>{
   const {id}=req.params.id;
   const update= req.body;
   try{
      await touristItineraryModel.findByIdAndUpdate(id,{$set: update});
      res.status(200).json({msg:" Tourist itinerary is updated"});
   }
   catch (error){
      res.status(400).json({error: error.message});
   }
 }
 const deleteTouristItinerary = async (req, res) => {
   const {id}=req.params;
   try {
      
       const tourGuide = await touristItineraryModel.findByIdAndDelete(id);
       res.status(200).json({ msg: "Itinerary has been deleted successfully" });
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};
const getFilteredItineraries = async (req, res) => { //filtered by date
  const { date, Username } = req.query;

  if (!date || !Username) {
    return res.status(400).json({ error: 'Date and Username are required' });
  }

  try {
    // Parse the input date string
    const startDate = new Date(date);
    const endDate = new Date(date);

    // Check if the date parsing was successful
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Set the time for the start of the day
    startDate.setUTCHours(0, 0, 0, 0);

    // Set the time for the end of the day
    endDate.setUTCHours(23, 59, 59, 999);

    // Query for bookings within the date range and populate the itineraryID field
    const bookings = await ItinBookingModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('itineraryId');

    // Extract itineraries from the populated bookings and filter by TourGuide
    const itineraries = bookings
      .map(booking => booking.itineraryId)
      .filter(itinerary => itinerary.TourGuide === Username);

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getMyItineraries= async(req,res) =>{
   const {Username}= req.query;
   
   try {
       const itineraries = await itineraryModel.find({ TourGuide: Username }); 

           res.status(200).json(itineraries);
   } 
   catch (error) {
       res.status(400).json({ error: error.message }); 
   }
}
const getMyTouristItineraries= async(req,res)=>{
   const {Username}=req.query;

   try{
      const x= await touristItineraryModel.find({tourGuide: Username});
       res.status(200).json(x);
   }
   catch(error){
      res.status(400).json({ error: error.message });
   }
}
const requestAccountDeletionTourG = async (req, res) => {
   const { Username } = req.query; 

   try {
        // Check if the user has any upcoming activities or itineraries with paid bookings
        const now = new Date();
        
        const hasUpcomingItineraries = await itineraryModel.findOne({
         TourGuide: Username,
         DatesTimes: { $gte: now }, // Upcoming activities
            // 'bookings.status': 'paid' // Uncomment if you need to check for paid bookings
        });

        if (hasUpcomingItineraries) {
            // Create a new deletion request with a rejected status
            

            return res.status(400).json({
                msg: "Your account deletion request has been rejected due to upcoming Itineraries with paid bookings."
            });
        }
        // Check if the user has already made a request
        const existingRequest = await requestModel.findOne({ Username, status: 'pending' });
        if (existingRequest) {
            return res.status(400).json({
                msg: "You already have a pending request for account deletion."
            });
        }
       

       // Create a new deletion request
       const deleteRequest = new requestModel({
           Username: Username,
           requestDate: new Date(),
           status: 'pending' // Mark as pending by default
       });

       // Save the request to the database
       await deleteRequest.save();
        // Send success response
        res.status(200).json({
           msg: "Your request for account deletion has been submitted and is pending approval."
       });

      

   } catch (error) {
       // Handle any errors that occur during the request process
       res.status(500).json({ error: "Failed to submit deletion request" });
   }
};


const changePasswordTourGuide = async (req, res) => {
   const { Username, currentPassword, newPassword } = req.body;
 
   try {
     // Step 1: Find the tour guide by Username
     const tourGuide = await tourGuideModel.findOne({ Username });
 
     if (!tourGuide) {
       return res.status(404).json({ error: "Tour Guide not found" });
     }
 
     // Step 2: Compare current password with the one stored in the database (plain text comparison)
     if (currentPassword !== tourGuide.Password) {
       return res.status(400).json({ error: "Current password is incorrect" });
     }
 
     // Step 3: Update only the password field using findOneAndUpdate
     await tourGuideModel.findOneAndUpdate(
       { Username },  // Find by Username
       { $set: { Password: newPassword } },  // Update the password field only
       { new: true, runValidators: false }   // Disable validation, return updated document
     );
 
     res.status(200).json({ message: "Password changed successfully" });
   } catch (error) {
     console.error("Error changing password:", error.message);
     res.status(500).json({ error: "Error changing password" });
   }
 };
 const getPendingTourGuides=async(req,res)=>{
   try{
      const x=await tourGuideModel.find({docsApproved: 'pending'});
      res.status(200).json(x);
   }
   catch(error){
      res.status(400).json({error: error.message});
   }
};
const settleDocsTourGuide = async (req, res) => {
   const { Username } = req.query; 
   const { docsApproved } = req.body; 
 
   try {
       
       const tourGuide = await tourGuideModel.findOneAndUpdate(
           { Username },
           { $set: { docsApproved } },
           { new: true }
       );
 
       if (!tourGuide) {
           return res.status(404).json({ error: 'Tour guide not found' });
       }
 
       res.status(200).json(tourGuide);
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
 };
 const deactivateItinrary=async(req,res)=>{
   const {id}=req.params;
   try{
      await itineraryModel.findByIdAndUpdate(id,{$set: {active: false}});
      res.status(200).json({msg:" Itinerary is deactivated"});
   } catch (error){
      res.status(400).json({error: error.message});
   }
 };
 const activateItinrary=async(req,res)=>{
   const {id}=req.params;
   try{
      await itineraryModel.findByIdAndUpdate(id,{$set: {active: true}});
      res.status(200).json({msg:" Itinerary is activated"});
   } catch (error){
      res.status(400).json({error: error.message});
   }
 };

 const getTouristReportForItinerary = async (req, res) => {
   try {
     const { itineraryId } = req.params; // Get itinerary ID from URL
     const { tourGuideUsername } = req.query; // Get tour guide username from query
 
     if (!tourGuideUsername) {
       return res.status(400).json({ message: "TourGuide username is required" });
     }
 
     // Convert itineraryId to ObjectId if it's stored as an ObjectId
     let itineraryObjectId;
     try {
       itineraryObjectId = new mongoose.Types.ObjectId(itineraryId);
     } catch (error) {
       return res.status(400).json({ message: "Invalid itinerary ID format" });
     }
 
     // Step 1: Find tourists whose bookings match the itinerary and tour guide
     const tourists = await touristModel.find({
       Bookings: {
         $elemMatch: {
           _id: itineraryObjectId, // Match the itinerary ID
           TourGuide: tourGuideUsername, // Match the tour guide username
         },
       },
     }).select("Username Email Bookings");
 
     if (tourists.length === 0) {
       return res.status(404).json({ message: "No tourists found for the specified itinerary" });
     }
 
     // Step 2: Prepare the report
     const report = {
       itineraryId,
       totalTourists: tourists.length,
       tourists: tourists.map((tourist) => ({
         Username: tourist.Username,
         Email: tourist.Email,
       })),
     };
 
     // Step 3: Send the response
     return res.status(200).json({
       message: "Report generated successfully",
       report,
     });
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: "An error occurred", error });
   }
 };

 const filterItinerariesByMonth = async (req, res) => {
   const { Username, month } = req.query;
 
   if (!month) {
     return res.status(400).json({ error: "Month is required" });
   }
 
   if (!Username) {
     return res.status(400).json({ error: "Username is required" });
   }
 
   try {
     const monthInt = parseInt(month, 10);
     if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
       return res.status(400).json({ error: "Invalid month. Provide 1-12." });
     }
 
     const itineraries = await itineraryModel.find({ TourGuide: Username });
     const filteredItineraries = itineraries.filter((itinerary) => {
       const itineraryDate = new Date(itinerary.DatesTimes);
       return itineraryDate.getMonth() + 1 === monthInt;
     });
 
     if (filteredItineraries.length === 0) {
       return res.status(404).json({ msg: "No itineraries found for the given month." });
     }
 
     res.status(200).json(filteredItineraries);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Error filtering itineraries by month" });
   }
 };
 const filterByItinerary = async (req, res) => {
    const { itineraryId } = req.query;
    try{
      const x=await ItinBookingModel.find({itineraryId:itineraryId});
      const r= x.map(x=> x.createdAt);
      res.status(200).json(r);
    }
    catch(error){
       res.status(400).json({error: error.message});
    }
  };
 
 
 
 module.exports = {resetPasswordTG,requestOTPTG,createTourGuideInfo,getTourGuide,updateTourGuide,createTourGuide,createItinerary,getItinerary,updateItinerary,deleteItinerary,createTouristItinerary,getTouristItinerary,updateTouristItinerary,deleteTouristItinerary,getMyItineraries,getMyTouristItineraries,requestAccountDeletionTourG
   ,changePasswordTourGuide,getPendingTourGuides,settleDocsTourGuide,deactivateItinrary,activateItinrary,getTouristReportForItinerary,filterItinerariesByMonth,loginTourGuide,getFilteredItineraries,filterByItinerary};
 
