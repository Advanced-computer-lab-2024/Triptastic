const tourGuideModel = require('../Models/tourGuide.js'); // Adjust path as needed
const advertiserModel = require('../Models/Advertiser.js');
const sellerModel = require('../Models/Seller.js');
const adminModel = require('../Models/Admin.js');
const tourismGovModel = require('../Models/tourismGov.js');
const activitiescategoryModel = require('../Models/Activitiescategory.js');
const activitiesModel = require('../Models/Activities.js');
const PreferenceTagsModel = require('../Models/PreferenceTags.js');
const RequestModel = require('../Models/Request.js');
const TransportationModel = require('../Models/Transportation.js');
const touristModel = require('../Models/Tourist.js');
const ActBookingModel=require('../Models/actBooking.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const nodemailer = require('nodemailer');



const createAdvertiser = async (req, res) => {
  const { Username, Email, Password } = req.body;
  const idDocument = req.files?.Id?.[0]?.path || null;
  const taxationRegistryCard = req.files?.TaxationRegistryCard?.[0]?.path || null;

  try {
    // Check if the username already exists in any model
    const userExistsInTourist = await touristModel.findOne({ Username });
    const userExistsInTourGuide = await tourGuideModel.findOne({ Username });
    const userExistsInAdvertiser = await advertiserModel.findOne({ Username });
    const userExistsInSeller = await sellerModel.findOne({ Username });
    const userExistsInAdmin = await adminModel.findOne({ Username });
    const userExistsInTourismGov = await tourismGovModel.findOne({ Username });

    if (userExistsInTourist || userExistsInTourGuide || userExistsInAdvertiser || userExistsInSeller || userExistsInAdmin || userExistsInTourismGov) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create the advertiser
    const advertiser = await advertiserModel.create({
      Username,
      Email,
      Password: hashedPassword,
      Id: idDocument,
      TaxationRegistryCard: taxationRegistryCard,
    });

    res.status(201).json({
      message: 'Advertiser registered successfully',
      advertiser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginAdvertiser = async (req, res) => {
  const { Username, Password } = req.body;

  try {
      // Find the advertiser by email
      const advertiser = await advertiserModel.findOne({ Username });
      if (!advertiser) {
          return res.status(404).json({ error: 'Advertiser not found' });
      }

      // Validate the password
      const isPasswordValid = await bcrypt.compare(Password, advertiser.Password);
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign(
          { id: advertiser._id, Email: advertiser.Email },
          'mydevsecretkey', // Replace with a secure environment variable in production
          { expiresIn: '1h' }
      );

      res.status(200).json({
          message: 'Login successful',
          token,
          user: {
              id: advertiser._id,
              Username: advertiser.Username,
              Email: advertiser.Email,
              docsApproved: advertiser.docsApproved,
              TaxationRegistryCard: advertiser.TaxationRegistryCard,
              Id: advertiser.Id,
          },
      });
  } catch (error) {
      res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();




const requestOTPADV = async (req, res) => {
  const { Email } = req.body;

  try {
    const tourist = await advertiserModel.findOne({ Email });
    if (!tourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = generateOTP();

    // Save the OTP and expiration in the database
    tourist.otp = otp;
    tourist.otpExpiry = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes
    await tourist.save();

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

const resetPasswordADV = async (req, res) => {
  const { Email, otp, newPassword } = req.body;

  try {
    const tourist = await advertiserModel.findOne({ Email });
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


const getAdvertiser= async(req,res) =>{
   const {Username}= req.query;
   
   try {
       const advertiser = await advertiserModel.findOne({ Username: Username }).populate('flaggedActivities'); 

           res.status(200).json(advertiser);
   } 
   catch (error) {
       res.status(400).json({ error:error.message }); 
   }
}

const updateAdvertiser = async (req, res) => {
    const { Username, Password, Email, Website_Link, Hotline, Company_Profile } = req.body; 
    const Logo = req.file ? req.file.path : null; // Only set Logo if file is uploaded
  
    try {
      const advertiser = await advertiserModel.findOneAndUpdate(
        { Username },
        { 
          $set: { 
            Email, 
            Password, 
            Website_Link, 
            Hotline, 
            Company_Profile,
            ...(Logo && { Logo })  } },
        { new: true }
      );
  
      if (!advertiser) {
        return res.status(404).json({ error: 'Advertiser not found' });
      }
  
      res.status(200).json(advertiser);
    } catch (error) {
      res.status(400).json({ error: error.message }); // Correct error handling
    }
  };
  



const createActivity = async (req, res) => {
   const { Category,name,date,time,location,price,tags,rating,specialDiscounts,bookingOpen,Advertiser } = req.body;

   try {
       // Find the category by name or by its _id
       const foundCategory = await activitiescategoryModel.findOne({ Name: Category }) ;
       const foundAdvertiser = await advertiserModel.findOne({ Username: Advertiser })

       if (!foundCategory||!foundAdvertiser) {
           return res.status(400).json({ error: 'Category not found or advertiser not found' });
       }
       console.log(foundCategory);
       console.log('Found Advertiser:', foundAdvertiser);
       
        // Get all available preference tags
        if(tags){
            const availableTags = await PreferenceTagsModel.find({}, { PrefTagName: 1 });
            const availableTagNames = availableTags.map(tag => tag.PrefTagName);
            const validTags = tags.filter(tag => availableTagNames.includes(tag));
            const invalidTags = tags.filter(tag => !availableTagNames.includes(tag));
    
            // If there are invalid tags, return an error message along with available tags
            if (invalidTags.length > 0) {
                return res.status(400).json({
                    error: `The following tags are invalid: ${invalidTags.join(', ')}`,
                    availableTags: availableTagNames
                });
            }else{
    
           // Create a new activity
           const activity = await activitiesModel.create({Category: foundCategory.Name,name,date,time,location,price,rating,tags,specialDiscounts,bookingOpen,Advertiser:foundAdvertiser.Username });
           res.status(200).json(activity);
        }

        }
        else{
            const activity = await activitiesModel.create({Category: foundCategory.Name,name,date,time,location,price,rating,tags,specialDiscounts,bookingOpen,Advertiser:foundAdvertiser.Username });
            res.status(200).json(activity);
        }


        // Validate the provided tags against the available tags

       
   } catch (error) {
       console.error('Error creating activity:', error);
       res.status(500).json({ error: 'Server error' });
   }
};

const getActivity = async (req, res) => {
   const { Advertiser } = req.query; // Use Advertiser as a parameter to find the activities

   try {
       // Find all activities for the given Advertiser
       const activities = await activitiesModel.find({ Advertiser: Advertiser });

       if (!activities.length) {
           return res.status(404).json({ message: 'No activities found for this advertiser' });
       }

       res.status(200).json(activities);
       
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};
const viewActivitydetails = async (req, res) => {
    const { Advertiser, name } = req.query; // Get both Advertiser and name from the request body
 
    try {
        // Find the activity for the given Advertiser and name
        const activity = await activitiesModel.findOne({ Advertiser: Advertiser, name: name });
        
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found for this advertiser and name' });
        }
 
        // Return the activity details
        res.status(200).json(activity);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const sendNotificationsForActivity = async (activity) => {
  try {
    if (!activity.notificationRequests || activity.notificationRequests.length === 0) {
      console.log('No users to notify.');
      return;
    }

    const message = `The activity "${activity.name}" is now open for bookings!`;
    const now = new Date();

    for (const { username } of activity.notificationRequests) {
      const tourist = await touristModel.findOne({ Username: username }); // Find tourist by username
      if (tourist) {
        tourist.notifications.push({ message, date: now });
        await tourist.save();
        console.log(`Notification sent to user: ${username}`);
      } else {
        console.log(`User with username ${username} not found.`);
      }
    }

    // Clear the notificationRequests array in the activity
    activity.notificationRequests = [];
    await activity.save();

    console.log('Notifications sent to all tourists.');
  } catch (error) {
    console.error('Error sending notifications:', error.message);
  }
};



const updateActivity = async (req, res) => {
  const { name, Advertiser } = req.query;
  const { Category, date, time, rating, location, price, tags, specialDiscounts, bookingOpen } = req.body;

  try {
    // Fetch the existing activity to compare the bookingOpen status
    const existingActivity = await activitiesModel.findOne({ Advertiser, name });

    if (!existingActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const wasBookingOpen = existingActivity.bookingOpen;

    // Update the activity
    const updatedActivity = await activitiesModel.findOneAndUpdate(
      { Advertiser, name },
      {
        $set: {
          Category,
          name,
          date,
          time,
          location,
          rating,
          price,
          tags,
          specialDiscounts,
          bookingOpen,
        },
      },
      { new: true }
    );

    // If bookingOpen transitioned from false to true, notify tourists
    if (!wasBookingOpen && bookingOpen) {
      await sendNotificationsForActivity(updatedActivity);
    }

    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(400).json({ error: error.message });
  }
};




const deleteActivity = async (req, res) => {
   const {Advertiser,name}= req.query;
   try {
       const activity = await activitiesModel.findOneAndDelete({ Advertiser:Advertiser,name:name });
      
       res.status(200).json({ msg: "activity deleted successfully" });
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};
 
const requestAccountDeletionAdvertiser = async (req, res) => {
    const { Username } = req.query; // Assuming the username is passed in the query or retrieved from the authenticated user

    try {
        // Check if the user has any upcoming activities or itineraries with paid bookings
        const now = new Date();
        
        const hasUpcomingActivities = await activitiesModel.findOne({
            Advertiser: Username,
            date: { $gte: now }, // Upcoming activities
            // 'bookings.status': 'paid' // Uncomment if you need to check for paid bookings
        });

        if (hasUpcomingActivities) {
           

            return res.status(400).json({
                msg: "Your account deletion request has been rejected due to upcoming activities "
            });
        }

        // Check if the user has already made a request
        const existingRequest = await RequestModel.findOne({ Username, status: 'pending' });
        if (existingRequest) {
            return res.status(400).json({
                msg: "You already have a pending request for account deletion."
            });
        }

        // Create a new deletion request
        const deleteRequest = new RequestModel({
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



const changePasswordAdvertiser = async (req, res) => {
  const { Username, currentPassword, newPassword } = req.body;

  try {
    // Step 1: Find the advertiser by Username
    const advertiser = await advertiserModel.findOne({ Username });

    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }

    // Step 2: Compare current password with the one stored in the database (hashed password comparison)
    const isMatch = await bcrypt.compare(currentPassword, advertiser.Password);

    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Step 3: Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds, you can adjust if needed

    // Step 4: Update only the password field using findOneAndUpdate
    await advertiserModel.findOneAndUpdate(
      { Username },  // Find by Username
      { $set: { Password: hashedNewPassword } },  // Update only the password field with hashed password
      { new: true, runValidators: false }   // Disable validation for other fields
    );

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ error: "Error changing password" });
  }
};

const getPendingAdvertisers = async (req, res) => {
    try {
        const pendingAdvertisers = await advertiserModel.find({ docsApproved: 'pending' });
        res.status(200).json(pendingAdvertisers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 
const createTransportation = async (req, res) => {
    const { type, company, origin, destination, departureTime, arrivalTime, price, availability, seatsAvailable } = req.body;

    try {
        const transportation = await TransportationModel.create({
            type,
            company,
            origin,
            destination,
            departureTime,
            arrivalTime,
            price,
            availability,
            seatsAvailable,
        });

        res.status(201).json(transportation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const settleDocsAdvertiser = async (req, res) => {
    const { Username } = req.query; 
    const { docsApproved } = req.body; 
  
    try {
        
        const advertiser = await advertiserModel.findOneAndUpdate(
            { Username },
            { $set: { docsApproved } },
            { new: true }
        );
  
        if (!advertiser) {
            return res.status(404).json({ error: 'Advertiser not found' });
        }
  
        res.status(200).json(advertiser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  }

  const getTouristReportForActivity = async (req, res) => {
    try {
      const { activityId } = req.params; // Get activity ID from URL
      const { advertiserUsername } = req.query; // Get advertiser username from query
  
      if (!advertiserUsername) {
        return res.status(400).json({ message: "Advertiser username is required" });
      }
  
      // Convert activityId to ObjectId if it's stored as an ObjectId
      let activityObjectId;
      try {
        activityObjectId = new mongoose.Types.ObjectId(activityId);
      } catch (error) {
        return res.status(400).json({ message: "Invalid activity ID format" });
      }
  
      // Step 1: Find tourists whose bookings match the activity and advertiser
      const tourists = await touristModel.find({
        Bookings: {
          $elemMatch: {
            _id: activityObjectId, // Match the activity ID
            Advertiser: advertiserUsername, // Match the advertiser username
          },
        },
      }).select("Username Email Bookings");
  
      if (tourists.length === 0) {
        return res.status(404).json({ message: "No tourists found for the specified activity" });
      }
  
      // Step 2: Prepare the report
      const report = {
        activityId,
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

  const filterActivitiesByMonth = async (req, res) => {
    const { month, Username } = req.query; // Expect 'Username' from the query
  
    if (!month) {
      return res.status(400).json({ error: "Month is required" });
    }
  
    if (!Username) {
      return res.status(400).json({ error: "Username is required" });
    }
  
    try {
      const monthInt = parseInt(month, 10);
  
      if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
        return res.status(400).json({ error: "Invalid month. Please provide a value between 1 and 12." });
      }
  
      // Fetch activities for the specific Username
      const activities = await activitiesModel.find({ Advertiser: Username }); // Match Advertiser field with Username
      const filteredActivities = activities.filter((activity) => {
        const activityDate = new Date(activity.date); // Assuming `date` is the date field
        return activityDate.getMonth() + 1 === monthInt; // Match the month (1-based index)
      });
  
      if (filteredActivities.length === 0) {
        return res.status(404).json({ msg: "No activities found for the given month." });
      }
  
      res.status(200).json(filteredActivities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error filtering activities by month" });
    }
  };
  const filterByActivity = async (req, res) => {
    const { activityId } = req.query;
    try{
      const x=await ActBookingModel.find({activityId:activityId});
      const r= x.map(x=> x.createdAt);
      res.status(200).json(r);
    }
    catch(error){
       res.status(400).json({error: error.message});
    }
  };
  const getFilteredActivities = async (req, res) => { //filtered by date
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
      const bookings = await ActBookingModel.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }).populate('activityId');
  
      // Extract itineraries from the populated bookings and filter by TourGuide
      const activities = bookings
        .map(booking => booking.activityId)
        .filter(activity => activity.Advertiser === Username);
  
      res.status(200).json(activities);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

 module.exports = {resetPasswordADV,requestOTPADV,changePasswordAdvertiser,createAdvertiser,getAdvertiser,updateAdvertiser,createActivity,
   getActivity,
   updateActivity,
   deleteActivity,viewActivitydetails,requestAccountDeletionAdvertiser,getPendingAdvertisers,createTransportation,settleDocsAdvertiser,getTouristReportForActivity,filterActivitiesByMonth,loginAdvertiser,filterByActivity,getFilteredActivities};