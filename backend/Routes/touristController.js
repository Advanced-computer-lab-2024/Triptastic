const touristModel = require('../Models/Tourist.js');
const historicalLocationModel = require('../Models/historicalLocation.js');
const productModel= require('../Models/Product.js');
const activitiesModel=require('../Models/Activities.js');
const itineraryModel= require('../Models/Itinerary.js');
const museumsModel=require('../Models/Museums.js');
const TransportationModel = require('../Models/Transportation.js');
const cartModel = require('../Models/Cart.js'); // Import the Cart model
const { default: mongoose } = require('mongoose');
const complaintModel = require('../Models/Complaint.js'); // Adjust the path based on your project structure
const TourGuideModel = require('../Models/tourGuide.js'); // Adjust path as needed
const requestModel = require('../Models/Request.js'); // Adjust path as needed
const ItinBookingModel = require('../Models/itinbookings.js'); 
const ActBookingModel = require('../Models/actBooking.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const PromoCodeModel = require('../Models/PromoCode.js');
const Order = require('../Models/Orders.js'); 


const getCurrencyRates = async (req, res) => {
  try {
    const baseCurrency = 'EGP'; // Set base currency to EGP
    const selectedCurrency = (req.query.currency || 'EGP').trim(); // Default to EGP if no currency is selected

    // Fetch exchange rates from an external API
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    
    if (!response.data || !response.data.rates) {
      console.error('API response is missing expected data structure:', response.data);
      return res.status(500).json({ error: 'API response structure issue' });
    }
    
    // Log the complete response and selected currency
    console.log('API response:', response.data);
    console.log('Selected currency:', selectedCurrency);
    
    const rates = response.data.rates;
    const exchangeRate = rates[selectedCurrency];

    if (!exchangeRate) {
      console.warn(`Currency ${selectedCurrency} is not supported by the API response.`);
      return res.status(400).json({ error: `Currency ${selectedCurrency} not supported or unavailable` });
    }

    // Send the exchange rate for the selected currency
    res.json({ rate: exchangeRate });
  } catch (error) {
    console.error('Error fetching currency rates:', error.message || error);
    res.status(500).json({ error: 'Error fetching currency rates' });
  }
};



const createTourist = async (req, res) => {
  const { Username, Email, Password, Nationality, DOB, Occupation,showIntro } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create a new tourist with the hashed password
    const tourist = await touristModel.create({
      Username,
      Email,
      Password: hashedPassword,
      Nationality,
      DOB,
      Occupation,
      showIntro
    });

    res.status(200).json({
      message: 'Tourist registered successfully',
      tourist,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getTouristIntroStatus = async (req, res) => {
  const { Username } = req.query; // Get the user ID from request parameters

  try {
    // Find the tourist by ID
    const tourist = await touristModel.findOne({ Username: Username });

    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Respond with the showIntro status
    res.status(200).json({
      message: 'Intro status retrieved successfully',
      showIntro: tourist.showIntro, // Include the status in the response
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve intro status' });
  }
};




const loginTourist = async (req, res) => {
  const { Username, Password } = req.body;

  try {
    // Check if the user exists
    const tourist = await touristModel.findOne({ Username });
    if (!tourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(Password, tourist.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
      // Check and update the showIntro field
      if (tourist.showIntro) {
        // Update showIntro to false
        await touristModel.findByIdAndUpdate(
          tourist._id,
          { showIntro: false },
          { new: true }
        );
      }

    // Check if it's the tourist's birthday
    const today = new Date();
    const birthDate = new Date(tourist.DOB);
    
    // Check if it's their birthday (ignoring the year)
    if (today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate()) {
      // Check if they already have a birthday promo code
      if (!tourist.birthdayPromoCode) {
        // Find an existing promo code that can be used for the birthday
        const promoCode = await PromoCode.findOne({ 
          code: 'BIRTHDAY', 
          active: true, 
          expirationDate: { $gte: today }, // Ensure the promo code is still valid
        });

        if (promoCode) {
          // Assign the existing promo code to the tourist's profile
          tourist.birthdayPromoCode = promoCode._id;
          await tourist.save();

          // Send the promo code via email
          sendBirthdayEmail(tourist, promoCode);
          
          // Optionally, send a system notification
          sendNotification(tourist, promoCode);
        } else {
          console.log('No active birthday promo code found.');
        }
      }
    }

    // Generate JWT token for the logged-in user
    const token = jwt.sign(
      { id: tourist._id, Email: tourist.Email },
      'mydevsecretkey',
      { expiresIn: '1h' } // Token expiration time
    );

    // Respond with token and user details
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: tourist._id,
        Username: tourist.Username,
        Email: tourist.Email,
        Nationality: tourist.Nationality,
        DOB: tourist.DOB,
        Occupation: tourist.Occupation,
        Wallet: tourist.Wallet,
        points: tourist.points,
        badge: tourist.badge,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

// Function to send birthday email with promo code
function sendBirthdayEmail(tourist, promoCode) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'malook25062003@gmail.com',
      
      pass: 'sxvo feuu woie gpfn', // Use environment variables for this
    },
  });

  const mailOptions = {
    from: 'malook25062003@gmail.com',
    to: tourist.Email,
    subject: 'Happy Birthday! Here’s your promo code!',
    text: `Dear ${tourist.Username},\n\nHappy Birthday! As a special gift, we’ve created a promo code for you. Use the code: ${promoCode.code} to get a ${promoCode.discount}% discount on anything on our website. The offer expires on ${promoCode.expirationDate.toDateString()}.\n\nBest regards,\nYour Company`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Function to send system notification
function sendNotification(tourist, promoCode) {
  const notification = {
    message: `Happy Birthday, ${tourist.Username}! You’ve received a special promo code: ${promoCode.code} for a ${promoCode.discount}% discount.`,
    date: new Date(),
    read: false,
  };

  tourist.notifications.push(notification);
  tourist.save()
    .then(() => console.log('Notification sent to tourist'))
    .catch(err => console.log('Error saving notification:', err));
}
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();




const requestOTP = async (req, res) => {
  const { Email } = req.body;

  try {
    const tourist = await touristModel.findOne({ Email });
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

const resetPassword = async (req, res) => {
  const { Email, otp, newPassword } = req.body;

  try {
    const tourist = await touristModel.findOne({ Email });
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





 const getTourist= async(req,res) =>{
  const {Username}= req.query;
  
  try {
      const tourist = await touristModel.findOne({ Username: Username }); 

          res.status(200).json(tourist);
  } 
  catch (error) {
      res.status(400).json({ error: error.message }); 
  }
}
const updateTourist = async(req,res) => {

  const{Username,Email,Password,Nationality,DOB,Occupation}=req.body;
  try{
     const tourist=await touristModel.findOneAndUpdate({Username: Username },{$set:{Email: Email,Password:Password,Nationality:Nationality,DOB:DOB,Occupation:Occupation}},{ new: true });
     res.status(200).json(tourist);
  }
  catch{
     res.status(400).json({error:error.message})

  }
}

const fileComplaint = async (req, res) => {
  const { title, body, date } = req.body;
  const username = req.query.username; // Use req.query to get username from the query

  console.log('Incoming complaint:', { title, body, date, username }); // Debugging

  try {
    // Check if the username is provided
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Create a new complaint with the username attached
    const complaint = await complaintModel.create({
      title,
      body,
      date,
      username, // Ensure username is correctly passed here
      status: 'pending', // Default status is 'pending'
    });

    // Return the created complaint
    res.status(201).json(complaint);
  } catch (error) {
    console.error('Error creating complaint:', error); // Log the error for debugging
    res.status(400).json({ error: error.message });
  }
};


 const gethistoricalLocationByName= async(req,res) =>{
    const {Name}= req.query;
    
    try {
        const historicalLocation = await historicalLocationModel.findOne({ Name: Name }); 

            res.status(200).json(historicalLocation);
    } 
    catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 }

 const createProductTourist = async (req, res) => {
   const { productName } = req.body;
 
   try {
     const product = await productModel.create({ productName });
     res.status(201).json(product);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 };

 const addReviewToProduct = async (req, res) => {
  const { productName, review } = req.body; // We'll only need the productName and review text

  try {
    // Find the product by productName and add the new review to the reviews array
    const product = await productModel.findOneAndUpdate(
      { productName },
      { $push: { reviews: review } },  // Push the new review into the reviews array
      { new: true } // Return the updated document
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product); // Return the updated product with reviews
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Export this function and set up an endpoint for it

 const getProductTourist = async (req, res) => {
  const { productName } = req.query;

  try {
      const product = await productModel.findOne({ productName: productName });
      res.status(200).json(product);
  } 
  catch (error) {
      res.status(400).json({ error: error.message });
  }
};


const filterActivities = async (req, res) => {
  // Extract parameters from the query string for GET requests
  const { Category, date, minBudget, maxBudget, rating } = req.query;
  
  let filter = {};

  // Filter by category if provided
  if (Category) {
     filter.Category = Category;
  }

  // Filter by price (minBudget and maxBudget)
  if (minBudget !== undefined && maxBudget !== undefined) {
     filter.price = {
        $gte: Number(minBudget), // Convert to number for comparison
        $lte: Number(maxBudget), // Convert to number for comparison
     };
  }

  if (date) {
    // If a date is provided, filter by that specific date (exact match)
    const inputDate = new Date(date);
    const localDate = new Date(inputDate.setHours(0, 0, 0, 0)); // Normalize to local time start of the day
    filter.date = {
        $gte: localDate,  // Activities on or after the provided date (local time)
        $lt: new Date(localDate.getTime() + 24 * 60 * 60 * 1000) // Before the next day
    };
} else {
    // If no date is provided, filter activities from today onwards (local time)
    const today = new Date();
    const localToday = new Date(today.setHours(0, 0, 0, 0)); // Normalize to local time start of today
    filter.date = { $gte: localToday }; // Activities today or later
}



  // Filter by rating (if provided)
  if (rating) {
     filter.rating = { $gte: Number(rating) }; // Convert to number for comparison
  }

  try {
     
     const activities = await activitiesModel.find(filter);
     console.log("Filter object:", filter);
     res.json(activities); // Return the filtered activities
  } catch (error) {
     res.status(500).json({ error: 'Server error' });
  }
};



const filterHistoricalLocationsByTagsTourist = async (req, res) => {
  const { Types } = req.query;
  const validTagTypes = ["Monuments", "Religious Sites", "Palaces/Castles"];

  try {
    if (!validTagTypes.includes(Types)) {
      return res.status(400).json({ error: `Invalid tag type. Valid types are: ${validTagTypes.join(', ')}` });
    }

    // Adjust the query condition to fetch both Palaces and Castles when "Palaces/Castles" is selected
    const filterCondition = {
      'Tags.Types': Types === "Palaces/Castles" ? { $in: ["Palaces", "Castles"] } : Types
    };

    const filteredLocations = await historicalLocationModel.find(filterCondition);

    if (filteredLocations.length === 0) {
      return res.status(404).json({ msg: "No historical locations found with the specified tag type." });
    }
    res.status(200).json(filteredLocations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const filterMuseumsByTagsTourist = async (req, res) => {
  const { Tags } = req.query; // Extracting HistoricalPeriod from query parameters

  try {
      const filteredMuseums = await museumsModel.find({ 'Tags.HistoricalPeriod': Tags });

      if (filteredMuseums.length === 0) {
          return res.status(404).json({ msg: "No museums found with the specified historical period." });
      }
      
      res.status(200).json(filteredMuseums);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const getUniqueHistoricalPeriods = async (req, res) => {
  try {
    const uniquePeriods = await museumsModel.distinct('Tags.HistoricalPeriod'); // Adjust the path as necessary

    if (!uniquePeriods.length) {
      return res.status(404).json({ msg: "No historical periods found." });
    }

    // Return the unique periods in the expected format
    const periodsData = uniquePeriods.map(period => ({ name: period }));
    
    res.status(200).json(periodsData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



 //need to add to other methods still
const viewProductsTourist = async (req, res) => {
  try {
    const products = await productModel.find({ archived: false });
    res.json(products); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const filterProductsByPriceRange = async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  try {
    // Set up filter criteria based on provided min and max prices
    let filter = { archived: false }; // Include archived condition

    if (minPrice && maxPrice) {
      filter.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }; // Price between min and max
    } else if (minPrice) {
      filter.price = { $gte: parseFloat(minPrice) }; // Price greater than or equal to minPrice
    } else if (maxPrice) {
      filter.price = { $lte: parseFloat(maxPrice) }; // Price less than or equal to maxPrice
    }

    // Find products that match the filter criteria
    const products = await productModel.find(filter);

    if (products.length === 0) {
      return res.status(404).json({ msg: 'No products found within the specified price range.' });
    }

    // Return filtered products
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const viewAllUpcomingActivitiesTourist = async (req, res) => {
 try {
   const currentDate = new Date();
   
   const activities = await activitiesModel.find({ date: { $gte: currentDate } });
   res.status(200).json(activities);
 } catch (error) {
   res.status(500).json({ error: 'Error fetching upcoming activities' });
 }
};

const viewAllHistoricalPlacesTourist = async (req, res) => {
 try {
     const places = await historicalLocationModel.find({});
     res.status(200).json(places);
 } catch (error) {
     res.status(500).json({ error: 'Error fetching historical places and museums' });
 }
};

const viewAllMuseumsTourist = async (req, res) => {
  try {
      const places = await museumsModel.find({});
      res.status(200).json(places);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching  museums' });
  }
 };

const viewAllItinerariesTourist = async (req, res) => {
  try {
    const currentDate = new Date();
      const itineraries = await itineraryModel.find({ DatesTimes: { $gte: currentDate } });
      res.status(200).json(itineraries);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching itineraries' });
  }
};




const sortItinPASC= async (req,res)=>{
 try{
  const currentDate = new Date().toISOString().split('T')[0];
  const data = await itineraryModel.find({ DatesTimes: { $gte: currentDate } }).sort({ Price:1}); 
  res.status(200).json(data);
 }catch(error){
  res.status(400).json({ error: error.message })
  }
}
const sortItinPDSC= async (req,res)=>{
  try{
    const currentDate = new Date().toISOString().split('T')[0];
   const data = await itineraryModel.find({ DatesTimes: { $gte: currentDate } }).sort({ Price:-1}); 
   res.status(200).json(data);
  }catch(error){
   res.status(400).json({ error: error.message })
   }
 }
 const sortActPASCRASC= async(req,res)=>{
  try{
   const currentDate= new Date();
   const data = await activitiesModel.find({ date: { $gte: currentDate } }).sort({Price : 1, rating : 1}); 
   res.status(200).json(data);

 }
 catch(error){
   res.status(400).json({ error: error.message })
 }
}
const sortActPASCRDSC= async(req,res)=>{
  try{
   const currentDate= new Date();
   const data = await activitiesModel.find({ date: { $gte: currentDate } }).sort({Price : 1, rating : -1}); 
   res.status(200).json(data);

 }
 catch(error){
   res.status(400).json({ error: error.message })
 }
}
const sortActPDSCRASC= async(req,res)=>{
  try{
   const currentDate= new Date();
   const data = await activitiesModel.find({ date: { $gte: currentDate } }).sort({Price : -1, rating : 1}); 
   res.status(200).json(data);

 }
 catch(error){
   res.status(400).json({ error: error.message })
 }
}
const sortActPDSCRDSC= async(req,res)=>{
  try{
   const currentDate= new Date();
   const data = await activitiesModel.find({ date: { $gte: currentDate } }).sort({Price : -1, rating : -1}); 
   res.status(200).json(data);

 }
 catch(error){
   res.status(400).json({ error: error.message })
 }
}
const getActivityByCategory= async(req,res) =>{
  const {Category}= req.query;
  
  try {
      const activity = await activitiesModel.find({ Category: Category }); 

          res.status(200).json(activity);
  } 
  catch (error) {
      res.status(400).json({ error: error.message }); 
  }
}
const getActivityByname= async(req,res) =>{
  const {name}= req.query;
  
  try {
      const activity = await activitiesModel.find({ name: name }); 

          res.status(200).json(activity);
  } 
  catch (error) {
      res.status(400).json({ error: error.message }); 
  }
}


const sortProductsByRatingTourist = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ rating: -1 }); // -1 for descending order
    res.status(200).json(products);
  } catch (error) {
   
    res.status(500).json({ error: 'Server error' });
  }
  };
  const searchMuseums = async (req, res) => {
    const { name, category, tag } = req.query; // Extract query parameters
  
    let filter = {}; // Initialize an empty filter object
  
    // Add conditions to the filter object based on available query parameters
    if (name) {
      filter.Name = { $regex: name, $options: 'i' }; // Case-insensitive search for name
    }
  
    if (category) {
      filter['Tags.HistoricalPeriod'] = { $regex: category, $options: 'i' }; // Case-insensitive search for category/historical period
    }
  
    if (tag) {
      filter['Tags.HistoricalPeriod'] = { $regex: tag, $options: 'i' }; // Case-insensitive search for tag
    }
  
    try {
      const museums = await museumsModel.find(filter); // Query the database with the filter
  
      if (museums.length === 0) {
        return res.status(404).json({ msg: 'No museums found matching the criteria.' });
      }
  
      res.status(200).json(museums); // Return the found museums
    } catch (error) {
      res.status(500).json({ error: 'Server error while searching for museums' });
    }
  };
  const searchHistoricalLocations = async (req, res) => {
    const { name, tag } = req.query; // Extract name and tag from query parameters
  
    let filter = {}; // Initialize an empty filter object
  
    // If a name is provided, add a regex condition to the filter for case-insensitive search
    if (name) {
      filter.Name = { $regex: name, $options: 'i' }; // Case-insensitive search for name
    }
  
    // If a tag is provided, add a regex condition to the filter for case-insensitive search
    if (tag) {
      filter['Tags.Types'] = { $regex: tag, $options: 'i' }; // Case-insensitive search for tag
    }
  
    try {
      // Fetch historical locations based on the filter
      const historicalLocations = await historicalLocationModel.find(filter);
  
      if (historicalLocations.length === 0) {
        return res.status(404).json({ msg: 'No historical locations found matching the criteria.' });
      }
  
      res.status(200).json(historicalLocations); // Return the found historical locations
    } catch (error) {
      res.status(500).json({ error: 'Server error while searching for historical locations' });
    }
  };
  
  const filterItineraries = async (req, res) => {
    const { minBudget, maxBudget, date, preferences, language } = req.query;
  
    let filter = {};
  
    // Budget filter
    if (minBudget !== undefined && maxBudget !== undefined) {
      filter.Price = {
        $gte: Number(minBudget), // Minimum budget
        $lte: Number(maxBudget)  // Maximum budget
      };
    } else if (minBudget !== undefined) {
      filter.Price = { $gte: Number(minBudget) };
    } else if (maxBudget !== undefined) {
      filter.Price = { $lte: Number(maxBudget) };
    }
  
    // Date filter (for itineraries that are upcoming)
    if (date) {
      const inputDate = new Date(date);
      filter.DatesTimes = {
        $gte: inputDate // Itineraries on or after the given date
      };
    } else {
      const today = new Date();
      filter.DatesTimes = {
        $gte: today // Upcoming itineraries starting today or later
      };
    }
  
    // Preferences filter (historic areas, beaches, family-friendly, shopping)
    if (preferences) {
      filter.PreferenceTag = { $regex: preferences, $options: 'i' }; // Case-insensitive match for preferences
    }
  
    // Language filter
    if (language) {
      filter.Language = language;
    }
  
    try {
      // Fetch itineraries that match the filter criteria
      const itineraries = await itineraryModel.find(filter);
      
      if (itineraries.length === 0) {
        return res.status(404).json({ msg: "No itineraries found matching the criteria." });
      }
  
      res.status(200).json(itineraries);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching itineraries' });
    }
  };const searchActivities = async (req, res) => {
    const { name, category, tag } = req.query;
  
    try {
      // Create a dynamic search query
      const searchQuery = {};
  
      if (name) {
        searchQuery.name = { $regex: name, $options: 'i' }; // case-insensitive search for name
      }
      if (category) {
        searchQuery.Category = { $regex: category, $options: 'i' }; // case-insensitive search for category
      }
      if (tag) {
        searchQuery.tags = { $regex: tag, $options: 'i' }; // case-insensitive search for tags
      }
      
      console.log('Search Query:', searchQuery);
  
      // Check if any activities exist for the specified category before executing full query
      if (category) {
        const categoryExists = await activitiesModel.exists({ Category: { $regex: category, $options: 'i' } });
        if (!categoryExists) {
          return res.status(404).json({ message: 'No activities found matching your category criteria.' });
        }
      }
  
      // Execute full query with dynamic criteria
      const activities = await activitiesModel.find(searchQuery);
  
      if (activities.length > 0) {
        res.status(200).json(activities);
      } else {
        res.status(404).json({ message: 'No activities found matching your criteria.' });
      }
    } catch (error) {
      console.error('Error searching activities:', error);
      res.status(500).json({ message: 'Server error while searching for activities.', error: error.message });
    }
  };
  
  const commentOnActivity = async (req, res) => {
    
    const { name, Username,comment } = req.body; // Ensure you're passing Username and not username
  
    try {
      // Find the activity by its name
      const activity = await activitiesModel.findOne({ name: name });
      

      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }
  
      // Ensure Username is present
      if (!Username) {
        return res.status(400).json({ error: 'Username is required to submit a comment' });
      }
  
      // Add the user's comment
      activity.comments.push({ Username, comment });
   // Calculate the new average rating
   const totalRatings = activity.ratings.reduce((sum, r) => sum + r.rating, 0);
   const averageRating = totalRatings / activity.ratings.length;

   // Update the average rating in the activity document
   activity.rating = averageRating;
      // Save the updated activity with the new comment
      await activity.save();
  
      res.status(200).json({ msg: 'Comment submitted successfully', activity });
    } catch (error) {
      console.error('Error submitting comment:', error); // Log the error for better tracking
      res.status(500).json({ error: 'Failed to submit comment' });
    }
  };
  
  const rateActivity = async (req, res) => {
    const { Username } = req.query; // Get the Username from the query parameters
    const { name, rating } = req.body; // Get the name and rating from the request body

    try {
        // Find the activity by its name
        const activity = await activitiesModel.findOne({ name:name });

        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        // Ensure Username is present
        if (!Username) {
            return res.status(400).json({ error: 'Username is required to submit a rating' });
        }

        // Check if the rating is valid
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
        }

        
        // Add the new rating
        activity.ratings.push({ Username, rating });

        // Save the updated activity with the new rating
        await activity.save();

        res.status(200).json({ msg: 'Rating submitted successfully', activity });
    } catch (error) {
        console.error('Error submitting rating:', error); // Log the error for better tracking
        res.status(500).json({ error: 'Failed to submit rating' });
    }
};
const sendEmail = async (recipient, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'malook25062003@gmail.com', 
      pass: 'sxvo feuu woie gpfn' // Use app-specific password or secure it in environment variables
    },
    debug: true, // Enable debug output
    logger: true // Log information to console
  });

  const mailOptions = {
    from: 'malook25062003@gmail.com',
    to: recipient,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email');
  }
};

const shareActivity = async (req, res) => {
  const { name } = req.params; // Activity name from request params
  const { email } = req.body; // Recipient email from request body

  try {
    // Look up the activity by name
    const activity = await activitiesModel.findOne({ name });
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Create a shareable link using the activity's unique name
    const shareableLink = `http://localhost:3000/activities/${encodeURIComponent(activity.name)}`;

    if (email) {
      // Send an email if an address is provided
      await sendEmail(
        email,
        'Check out this activity!',
        `Here's a link to an activity you might be interested in: ${shareableLink}` // Wrap in backticks for template literals
      );
      res.status(200).json({ message: 'Link generated and email sent successfully', link: shareableLink });
    } else {
      // Only return the link for sharing
      res.status(200).json({ link: shareableLink });
    }
  } catch (error) {
    console.error('Error generating shareable link:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



const shareItinerary = async (req, res) => {
  const { id } = req.params; // Get the itinerary ID from the request
  const { email } = req.body; // Get the recipient email from the request body

  try {
    // Find the itinerary by ID
    const itinerary = await itineraryModel.findById(id);
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    // Generate the shareable link using the itinerary ID
    const shareableLink = `http://localhost:3000/itineraries/${encodeURIComponent(itinerary._id)}`;

    if (email) {
      // Send an email if an address is provided
      await sendEmail(
        email,
        'Check out this itinerary!',
        `Here's a link to an itinerary you might be interested in: ${shareableLink}`
      );
      res.status(200).json({ message: 'Link generated and email sent successfully', link: shareableLink });
    } else {
      // Only return the link for sharing
      res.status(200).json({ link: shareableLink });
    }
  } catch (error) {
    console.error('Error generating shareable link:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


const shareHistorical = async (req, res) => {
  const { Name } = req.params; // Historical location name from request params
  const { email } = req.body; // Recipient email from request body

  try {
    // Find the historical location by name
    const historical = await historicalLocationModel.findOne({ Name });
    if (!historical) {
      return res.status(404).json({ error: 'Historical location not found' });
    }

    // Generate the shareable link using the location's name
    const shareableLink = `http://localhost:3000/Historical/${encodeURIComponent(historical.Name)}`;

    if (email) {
      // Send an email if an address is provided
      await sendEmail(
        email,
        'Check out this historical location!',
        `Here's a link to a historical location you might be interested in: ${shareableLink}`
      );
      res.status(200).json({ message: 'Link generated and email sent successfully', link: shareableLink });
    } else {
      // Only return the link for sharing
      res.status(200).json({ link: shareableLink });
    }
  } catch (error) {
    console.error('Error generating shareable link:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const shareMuseum = async (req, res) => {
  const { Name } = req.params; // Museum name from request params
  const { email } = req.body; // Recipient email from request body

  try {
    // Find the museum by name
    const Museum = await museumsModel.findOne({ Name });
    if (!Museum) {
      return res.status(404).json({ error: 'Museum not found' });
    }

    // Generate the shareable link using the museum's name
    const shareableLink = `http://localhost:3000/Museum/${encodeURIComponent(Museum.Name)}`;

    if (email) {
      // Send an email if an address is provided
      await sendEmail(
        email,
        'Check out this museum!',
        `Here's a link to a museum you might be interested in: ${shareableLink}`
      );
      res.status(200).json({ message: 'Link generated and email sent successfully', link: shareableLink });
    } else {
      // Only return the link for sharing
      res.status(200).json({ link: shareableLink });
    }
  } catch (error) {
    console.error('Error generating shareable link:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


 
const getComplaintsByTourist = async (req, res) => {
  const { username } = req.query; // Get the username from the query parameters

  try {

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Find all complaints for the specified tourist username
    const complaints = await complaintModel.find({ username }).sort({ createdAt: -1 });

    if (complaints.length === 0) {
      return res.status(404).json({ message: 'No complaints found for this user.' });
    }

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while aaaaaaaafetching complaints.' });
  }
};


  

const changepasswordTourist = async (req, res) => {
  const { Username, currentPassword, newPassword } = req.body;

  try {
    // Step 1: Find the tourist by Username
    const tourist = await touristModel.findOne({ Username });

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Step 2: Compare current password with the one stored in the database (plain text comparison)
    if (currentPassword !== tourist.Password) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Step 3: Update only the password field
    tourist.Password = newPassword;
    await tourist.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ error: "Error changing password" });
  }
};


const calculateAndAddPoints = async (tourist, amountPaid) => {
  let pointsToAdd = 0;

  // Determine points based on the tourist's badge level
  if (tourist.badge === 1) {
    pointsToAdd = amountPaid * 0.5;
  } else if (tourist.badge === 2) {
    pointsToAdd = amountPaid * 1;
  } else if (tourist.badge === 3) {
    pointsToAdd = amountPaid * 1.5;
  }

  // Calculate total points available for bonus (newly earned + leftover points)
  const totalPointsForBonus = pointsToAdd + (tourist.points % 10000);

  // Calculate bonus cash
  const bonusCash = Math.floor(totalPointsForBonus / 10000) * 100;

  // Update tourist's total points
  tourist.points += pointsToAdd;

  // Upgrade badge if necessary
  if (tourist.points > 500000) {
    tourist.badge = 3;
  } else if (tourist.points > 100000) {
    tourist.badge = 2;
  } else {
    tourist.badge = 1;
  }

  // Save the tourist with updated points and badge
  await tourist.save();

  // Return both newly earned points and the calculated bonus cash
  return { newlyEarnedPoints: pointsToAdd, bonusCash };
};


const bookActivity = async (req, res) => {
  const { name, Username } = req.body;

  try {
    // Step 1: Find the activity by its name
    const activity = await activitiesModel.findOne({ name: name });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Check if the activity is open for booking
    if (!activity.bookingOpen) {
      return res.status(400).json({ error: 'This activity is not open for booking' });
    }

    // Step 2: Find the tourist by username
    const tourist = await touristModel.findOne({ Username: Username });

    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    const alreadyBooked = tourist.Bookings.some(
      booking => booking.name === activity.name
    );

    if (alreadyBooked) {
      return res.status(400).json({ error: 'You have already booked this activity' });
    }

    // Calculate newly earned points and apply bonus cash
    const { newlyEarnedPoints, bonusCash } = await calculateAndAddPoints(tourist, activity.price);

    // Update wallet with the bonus cash
    tourist.Wallet += bonusCash;

    // Add the activity to the tourist's bookings
    tourist.Bookings.push(activity);

    // Save the updated tourist record
    await tourist.save();

    // Update activity sales
    activity.sales += activity.price;
    await activity.save();
    const booking=await ActBookingModel.create({activityId:activity._id})
    res.status(200).json({
      message: 'Activity booked successfully!',
      tourist,
      newlyEarnedPoints,
      bonusCash,
      updatedWallet: tourist.Wallet,
      price:activity.price
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error booking the activity' });
  }
};


const bookItinerary = async (req, res) => {
  const { itineraryId, Username } = req.body;

  try {
    const itinerary = await itineraryModel.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
     // Check if the activity is open for booking
     if (!itinerary.bookingOpen) {
      return res.status(400).json({ error: 'This itinerary is not open for booking' });
    }

    const tourist = await touristModel.findOne({ Username: Username });
    console.log('Tourist:', tourist);
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    const alreadyBooked = tourist.Bookings.some(
      booking => booking._id.toString() === itinerary._id.toString()
    );

    if (alreadyBooked) {
      return res.status(400).json({ error: 'You have already booked this itinerary' });
    }

    if (itinerary.Booked) {
      return res.status(400).json({ message: 'Itinerary is Full' });
    }

    // Calculate newly earned points and apply bonus cash
    const { newlyEarnedPoints, bonusCash } = await calculateAndAddPoints(tourist, itinerary.Price);

    // Update wallet with the bonus cash
    tourist.Wallet += bonusCash;

    tourist.Bookings.push(itinerary);
    await tourist.save();

    itinerary.sales += itinerary.Price;
    await itinerary.save();
   const booking= await ItinBookingModel.create({itineraryId:itineraryId})

    res.status(200).json({
      message: 'Itinerary booked successfully!',
      tourist,
      newlyEarnedPoints,
      bonusCash,
      updatedWallet: tourist.Wallet,
      Price: itinerary.Price,
    },);
 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error booking itinerary' });
  }
};


const submitFeedbackItinerary = async (req, res) => {
  const { username } = req.query; 
  const {  itineraryId, rating, comment } = req.body;

  console.log("Received feedback submission request:", { itineraryId, rating, comment, username }); // Log request details

  if (!itineraryId || !rating || !comment) {
    console.log("Validation failed: Missing required fields."); // Log validation failure
    return res.status(400).json({ message: 'Itinerary ID, rating, and comment are required.' });
  }

  try {
    const tourist = await touristModel.findOne({ Username: username });
    console.log("Fetched tourist:", tourist); // Log fetched tourist

    if (!tourist) {
      console.log("Authentication failed: Tourist not found."); // Log authentication failure
      return res.status(403).json({ message: 'User is not authenticated.' });
    }

    const itinerary = await itineraryModel.findById(itineraryId);
    console.log("Fetched itinerary:", itinerary); // Log fetched itinerary

    if (!itinerary) {
      console.log("Itinerary not found."); // Log missing itinerary
      return res.status(404).json({ message: 'Itinerary not found.' });
    }

    if (rating < 1 || rating > 5) {
      console.log("Invalid rating value."); // Log invalid rating
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    console.log(`Submitting feedback for itinerary: ${itineraryId}, User: ${username}`);

    const feedbackEntry = {
      touristUsername: tourist.Username,
      itineraryId,
      rating,
      comment,
      date: Date.now(),
    };

    itinerary.feedback.push(feedbackEntry);
    await itinerary.save();

    res.status(200).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Error in submitFeedbackItinerary:', error); // Log server error
    res.status(500).json({ message: 'Server error while submitting feedback.' });
  }
};const submitFeedback = async (req, res) => {
  const { username } = req.query;  // From query parameters
  const { itineraryId, rating, comment, tourGuideUsername } = req.body;  // Ensure correct destructuring

  if (!itineraryId || !rating || !comment || !tourGuideUsername) {
    return res.status(400).json({ message: 'Itinerary ID, rating, comment, and tour guide username are required.' });
  }

  try {
    // Fetch the tourist by username
    const tourist = await touristModel.findOne({ Username: username });

    if (!tourist) {
      return res.status(403).json({ message: 'User is not authenticated.' });
    }

    // Fetch the itinerary and populate TourGuide
    const itinerary = await itineraryModel.findById(itineraryId).populate('TourGuide');

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    console.log(`Submitting tour guide feedback. Itinerary: ${itineraryId}, Tour Guide: ${tourGuideUsername}`);

    // Create the feedback entry
    const feedbackEntry = {
      touristUsername: tourist.Username,
      itineraryId,
      rating,
      comment,
      date: Date.now(),
    };

    // Find the tour guide and update their feedback
    const tourGuide = await TourGuideModel.findOne({ Username: tourGuideUsername });

    if (!tourGuide) {
      return res.status(404).json({ message: `Tour guide '${tourGuideUsername}' not found.` });
    }

    tourGuide.feedback.push(feedbackEntry);
    await tourGuide.save();

    res.status(200).json({ message: 'Tour guide feedback submitted successfully!' });
  } catch (error) {
    console.error('Error in submitFeedback:', error);
    res.status(500).json({ message: 'Server error while submitting feedback.' });
  }
};

const getBookedItineraries = async(req, res) => {
  const { username } = req.query; // Get the username from the query parameters

  try {

    // Retrieve the username of the logged-in tourist

    // Find the tourist by username
    const tourist = await touristModel.findOne({ Username: username });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Extract the Booking IDs from the tourist's Bookings array
    const bookingIds = tourist.Bookings.map(booking => booking._id);

    // Find itineraries that match the IDs in the tourist's Bookings array
    const bookedItineraries = await itineraryModel.find({
      _id: { $in: bookingIds } // Use the extracted booking IDs
    });

    // Return the booked itineraries
    res.status(200).json(bookedItineraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};const cancelBookedItinerary = async (req, res) => { 
  const { itineraryId } = req.params; // Get the itinerary ID from the request parameters
  const { username } = req.query; // Get the username from the query parameters

  try {
    // Find the itinerary by ID
    const itinerary = await itineraryModel.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Find the tourist by username
    const tourist = await touristModel.findOne({ Username: username });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Log the itineraryId and the tourist's bookings for debugging
    console.log('itineraryId:', itineraryId);
    console.log('Tourist Bookings:', tourist.Bookings);

    // Find the booked itinerary by ID
    const bookedItinerary = tourist.Bookings.find(booking => booking._id.toString() === itineraryId);
    if (!bookedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found in the tourist\'s bookings' });
    }

    // Check if the itinerary is within the cancellation window (48 hours before start date)
    const itineraryStartDate = new Date(bookedItinerary.DatesTimes);
    const currentDate = new Date();
    const timeDifference = itineraryStartDate - currentDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

    if (hoursDifference <= 48) {
      return res.status(400).json({ message: 'Itinerary cannot be cancelled within 48 hours of start date' });
    }

    // Calculate refund amount
    const refundAmount = itinerary.Price;
    tourist.Wallet += refundAmount; // Add refund amount to the wallet

    // Deduct points based on the badge level
    let pointsToDeduct = 0;

    if (tourist.badge === 1) {
      pointsToDeduct = refundAmount * 0.5;
    } else if (tourist.badge === 2) {
      pointsToDeduct = refundAmount * 1;
    } else if (tourist.badge === 3) {
      pointsToDeduct = refundAmount * 1.5;
    }

    // Decrease points, but ensure it doesn't go below zero
    tourist.points -= pointsToDeduct;
    if (tourist.points < 0) tourist.points = 0;

    // Update badge level if necessary
    if (tourist.points > 500000) {
      tourist.badge = 3;
    } else if (tourist.points > 100000) {
      tourist.badge = 2;
    } else {
      tourist.badge = 1;
    }

    // Remove the booked itinerary from the tourist's bookings
    tourist.Bookings = tourist.Bookings.filter(booking => booking._id.toString() !== itineraryId);

    // Save the updated tourist record
    await tourist.save();

    // Update itinerary sales
    itinerary.sales -= refundAmount;
    await itinerary.save();

    res.status(200).json({ 
      message: 'Itinerary booking cancelled successfully', 
      refundedAmount: refundAmount, 
      updatedWallet: tourist.Wallet,
      updatedPoints: tourist.points,
      updatedBadge: tourist.badge,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const requestAccountDeletionTourist = async (req, res) => {
  const { Username } = req.query;

  try {
    // Find the tourist by username
    const tourist = await touristModel.findOne({ Username });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Check if the tourist has any bookings
    if (tourist.Bookings.length > 0) {
      return res.status(400).json({
        msg: "Your account deletion request cannot be processed because you have active bookings."
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
    console.error(error);
    res.status(500).json({ error: "Failed to submit deletion request" });
  }
};

const cancelActivity = async (req, res) => {
  const { activityId } = req.params; // Get the activity ID from the request parameters
  const { username } = req.query; // Get the username from the query parameters

  try {
    // Find the activity by ID
    const activity = await activitiesModel.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Find the tourist by username
    const tourist = await touristModel.findOne({ Username: username });
    if (!tourist) {
      console.log('Tourist not found');
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Log the tourist's bookings for debugging
    console.log('Tourist Bookings:', tourist.Bookings);

    // Find the booked activity by ID
    const bookedActivity = tourist.Bookings.find(booking => booking._id.toString() === activityId);
    if (!bookedActivity) {
      console.log('Activity not found in the tourist\'s bookings');
      return res.status(404).json({ message: 'Activity not found in the tourist\'s bookings' });
    }

    // Check if the activity is within the cancellation window (48 hours before start date)
    const activityStartDate = new Date(bookedActivity.DatesTimes);
    const currentDate = new Date();
    const timeDifference = activityStartDate - currentDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

    if (hoursDifference <= 48) {
      console.log('Activity cannot be cancelled within 48 hours of start date');
      return res.status(400).json({ message: 'Activity cannot be cancelled within 48 hours of start date' });
    }

    // Calculate the refund amount
    const refundAmount = activity.price;
    tourist.Wallet += refundAmount;

    // Deduct points based on the badge level
    let pointsToDeduct = 0;

    if (tourist.badge === 1) {
      pointsToDeduct = refundAmount * 0.5;
    } else if (tourist.badge === 2) {
      pointsToDeduct = refundAmount * 1;
    } else if (tourist.badge === 3) {
      pointsToDeduct = refundAmount * 1.5;
    }

    // Decrease points, but ensure they don't go below zero
    tourist.points -= pointsToDeduct;
    if (tourist.points < 0) tourist.points = 0;

    // Update badge level if necessary
    if (tourist.points > 500000) {
      tourist.badge = 3;
    } else if (tourist.points > 100000) {
      tourist.badge = 2;
    } else {
      tourist.badge = 1;
    }

    // Remove the booked activity from the tourist's bookings
    tourist.Bookings = tourist.Bookings.filter(booking => booking._id.toString() !== activityId);

    // Save the updated tourist record
    await tourist.save();

    // Update activity sales
    activity.sales -= refundAmount;
    await activity.save();

    res.status(200).json({
      message: 'Activity booking cancelled successfully',
      refundAmount,
      updatedWallet: tourist.Wallet,
      updatedPoints: tourist.points,
      updatedBadge: tourist.badge,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAddresses = async (req, res) => {
  const { username } = req.query;

  try {
    const tourist = await touristModel.findOne({ Username: username });
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    res.status(200).json(tourist.addresses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const addAddress = async (req, res) => {
  const { addressLine1, addressLine2, city, state, postalCode, country, phoneNumber, isPrimary } = req.body;
  const username = req.query.username; // Get username from query string

  console.log('Incoming address:', { addressLine1, city, country, username }); // Debugging

  try {
    // Check if the username is provided
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Find the tourist by username
    const tourist = await touristModel.findOne({ Username: username });
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // New address structure
    const newAddress = {
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
      isPrimary,
    };

    // If the new address is primary, ensure all others are set to non-primary
    if (isPrimary) {
      tourist.addresses.forEach((address) => {
        address.isPrimary = false;
      });
    }

    // Add the new address to the addresses array
    tourist.addresses.push(newAddress);

    // Save the tourist document
    await tourist.save();

    // Return the updated tourist data or a success message
    res.status(201).json({ message: 'Address added successfully', addresses: tourist.addresses });
  } catch (error) {
    console.error('Error adding address:', error); // Log error for debugging
    res.status(400).json({ error: error.message });
  }
};
const getBookedActivities = async (req, res) => {
  const { username } = req.query; // Get the username from the query parameters

  try {
    // Find the tourist by username
    const tourist = await touristModel.findOne({ Username: username });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Extract the IDs of the booked activities
    const bookingIds = tourist.Bookings.map(booking => booking._id);

    // Find the booked activities by IDs
    const bookedActivities = await activitiesModel.find({
      _id: { $in: bookingIds } // Use the extracted booking IDs
    });

    // Return the booked activities
    res.status(200).json(bookedActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const setPreferences = async (req, res) => {
  try {
    const { username } = req.query;
    const preferences = req.body;
    await touristModel.findOneAndUpdate({ Username: username }, { preferences }, { new: true });
    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }

}


const getActivityToShare = async (req, res) => {
  const { name } = req.params; // Get the activity name from the request

  try {
    // Find the activity by name
    const activity = await activitiesModel.findOne({ name: name });
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Return the found activity
    res.status(200).json(activity);
  } catch (error) {
    console.error('Error retrieving activity:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
const getTransportation=async(req,res)=>{
  try{
    const Transportation=await TransportationModel.find();
    res.status(200).json(Transportation);


  }
  catch(error){
    console.error(error);
    res.status(500).json({ error: 'Failed to get Transportation' });
  }
};

const getAttendedActivities = async (req, res) => {
  const { Username } = req.query; // Retrieve username from query parameters

  try {
    // Find the tourist by their username
    const tourist = await touristModel.findOne({ Username: Username }); 
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Extract the IDs and details of booked activities
    const bookingNames = tourist.Bookings.map(booking => booking.name);

    // Find activities that were booked and have already taken place (date has passed)
    const attendedActivities = await activitiesModel.find({
      name: { $in: bookingNames },
      date: { $lt: new Date() } // Check if the date is in the past
    });

    // Return the attended activities
    res.status(200).json(attendedActivities);
  } catch (error) {
    console.error('Error fetching attended activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addProductToCart = async (req, res) => {
  const { productName, quantity } = req.body; // Product name and quantity passed in the request body
  const { Username } = req.query; // Username passed in the query params, adjust if needed

  try {
    // Find the product by its name to get its details
    const product = await productModel.findOne({ productName });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the cart for the given user (tourist)
    let cart = await cartModel.findOne({ Username });

    if (!cart) {
      // If the cart doesn't exist, create a new one
      cart = new cartModel({ Username, products: [] });
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.products.findIndex(item => item.productName === productName);

    if (existingProductIndex > -1) {
      // Product exists, update the quantity
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Add new product with its details to the cart
      cart.products.push({
        productId: product._id,
        productName: product.productName,
        price: product.price,
        description: product.description,
        quantity
      });
    }

    // Save the updated cart
    await cart.save();

    // Increment the sales count for the product and decrease stock
    await productModel.findByIdAndUpdate(
      product._id, // Use product._id for the update
      { $inc: { stock: -quantity, sales: quantity } }, // Decrease stock and increase sales
      { new: true }
    );

    res.status(200).json({ message: 'Product added to cart successfully and sales updated', cart });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};

const removeProductFromCart = async (req, res) => {
  const { Username, productName, quantity } = req.body;

  try {
    // Find the cart for the given user
    const cart = await cartModel.findOne({ Username });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found for this user' });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.productName === productName
    );
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    // Get the product details from the database
    const product = await productModel.findOne({ productName });
    if (!product) {
      return res.status(404).json({ error: 'Product not found in the database' });
    }

    // Adjust the quantity or remove the product entirely
    if (cart.products[productIndex].quantity > quantity) {
      cart.products[productIndex].quantity -= quantity;
    } else {
      cart.products.splice(productIndex, 1);
    }

    // Save the updated cart
    await cart.save();

    // Update the product stock and sales
    await productModel.findByIdAndUpdate(
      product._id,
      { $inc: { stock: quantity, sales: -quantity } }, // Increase stock and decrease sales
      { new: true }
    );

    res.status(200).json({ message: 'Product removed from cart and stock updated', cart });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


const getCart = async (req, res) => {
  const { Username } = req.query; // Username passed as a query parameter

  try {
    // Find the cart for the given user
    const cart = await cartModel.findOne({ Username }).populate('products.productId');

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found for this user' });
    }

    res.status(200).json(cart); // Return the cart data as JSON
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

//test
const bookmarkEvent = async (req, res) => {
  const { Username } = req.query; // Tourist username
  const { eventId } = req.body; // Event ID to bookmark

  try {
    const tourist = await touristModel.findOne({ Username });
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Check if the event is already bookmarked
    if (tourist.bookmarkedEvents.includes(eventId)) {
      return res.status(400).json({ error: 'Event already bookmarked' });
    }

    // Add the event to bookmarkedEvents
    tourist.bookmarkedEvents.push(eventId);
    await tourist.save();

    res.status(200).json({ message: 'Event bookmarked successfully!', tourist });
  } catch (error) {
    console.error('Error bookmarking event:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
const removeBookmark = async (req, res) => {
  const { Username } = req.query; // Tourist username
  const { eventId } = req.body; // Event ID to remove

  try {
    const tourist = await touristModel.findOne({ Username });
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Remove the event from bookmarkedEvents
    tourist.bookmarkedEvents = tourist.bookmarkedEvents.filter(
      (id) => id.toString() !== eventId
    );
    await tourist.save();

    res.status(200).json({ message: 'Event removed from bookmarks', tourist });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getBookmarkedEvents = async (req, res) => {
  const { Username } = req.query;

  try {
    const tourist = await touristModel
      .findOne({ Username })
      .populate('bookmarkedEvents'); // Populate event details

    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    res.status(200).json({ bookmarkedEvents: tourist.bookmarkedEvents });
  } catch (error) {
    console.error('Error fetching bookmarked events:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const addProductToWishlist = async (req, res) => {
  const { Username, productId } = req.body; // Expecting Username and productId in the request body

  try {
    // Validate if both Username and productId are provided
    if (!Username || !productId) {
      return res.status(400).json({ error: 'Username and productId are required' });
    }

    // Find the tourist by Username
    const tourist = await touristModel.findOne({ Username });
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Check if the product ID is already in the wishlist
    if (tourist.wishlist.includes(productId)) {
      return res.status(400).json({ error: 'Product already in the wishlist' });
    }

    // Add the product ID to the wishlist
    tourist.wishlist.push(productId);
    await tourist.save();

    // Respond with the updated wishlist
    res.status(200).json({
      message: 'Product added to wishlist successfully',
      wishlist: tourist.wishlist,
    });
  } catch (error) {
    console.error('Error adding product to wishlist:', error.message || error);
    res.status(500).json({ error: 'Failed to add product to wishlist' });
  }
};
const getWishlist = async (req, res) => {
  const { Username } = req.query; // Extract Username from query parameters

  try {
    // Find the tourist by Username
    const tourist = await touristModel.findOne({ Username }).populate('wishlist'); // Populate wishlist with product details

    if (!tourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ wishlist: tourist.wishlist }); // Return the wishlist
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Error fetching wishlist' });
  }
};
const removeProductFromWishlist = async (req, res) => {
  const { Username, productId } = req.body; // Extract Username and productId from request body

  try {
    // Find the tourist by Username
    const tourist = await touristModel.findOne({ Username });

    if (!tourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the product exists in the wishlist
    if (!tourist.wishlist.includes(productId)) {
      return res.status(400).json({ error: 'Product not found in wishlist' });
    }

    // Remove the product from the wishlist
    tourist.wishlist = tourist.wishlist.filter((id) => id.toString() !== productId);
    await tourist.save();

    res.status(200).json({ message: 'Product removed from wishlist', wishlist: tourist.wishlist });
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    res.status(500).json({ error: 'Error removing product from wishlist' });
  }
};

const addToCartAndRemoveFromWishlist = async (req, res) => {
  const { productName, quantity } = req.body;
  const { Username } = req.query;

  try {
    // Find the product by name
    const product = await productModel.findOne({ productName });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the user's cart
    let cart = await cartModel.findOne({ Username });
    if (!cart) {
      cart = new cartModel({ Username, products: [] });
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productName === productName
    );

    if (existingProductIndex > -1) {
      // Product already in the cart, update the quantity
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Add new product to the cart
      cart.products.push({
        productId: product._id,
        productName: product.productName,
        price: product.price,
        description: product.description,
        quantity,
      });
    }

    // Save the updated cart
    await cart.save();

    // Update the product stock and sales count
    await productModel.findByIdAndUpdate(
      product._id,
      { $inc: { stock: -quantity, sales: quantity } },
      { new: true }
    );

    // Remove the product from the user's wishlist
    const tourist = await touristModel.findOne({ Username });
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Filter the wishlist to remove the product
    const productIndexInWishlist = tourist.wishlist.indexOf(product._id.toString());
    if (productIndexInWishlist !== -1) {
      tourist.wishlist = tourist.wishlist.filter(
        (id) => id.toString() !== product._id.toString()
      );
      await tourist.save(); // Save the updated wishlist
    }

    // Send a successful response
    res.status(200).json({
      message: 'Product added to cart and removed from wishlist successfully',
      cart,
      wishlist: tourist.wishlist, // Return the updated wishlist
    });
  } catch (error) {
    console.error('Error adding product to cart and removing from wishlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateProductQuantityInCart = async (req, res) => {
  const { Username, productName, newQuantity } = req.body; // New quantity to be set

  if (!productName || newQuantity < 0) {
    return res.status(400).json({ error: 'Invalid product name or quantity' });
  }

  try {
    // Fetch the product from the database to validate stock
    const product = await productModel.findOne({ productName });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Ensure the new quantity does not exceed the current stock
    if (newQuantity > product.stock) {
      return res.status(400).json({ error: 'Insufficient stock available' });
    }

    // Find the user's cart
    const cart = await cartModel.findOne({ Username });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found for this user' });
    }

    // Locate the product in the cart
    const productIndex = cart.products.findIndex(item => item.productName === productName);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    const currentQuantity = cart.products[productIndex].quantity;

    // Update the stock and sales accordingly
    const quantityDifference = newQuantity - currentQuantity;

    if (quantityDifference > 0) {
      // Adding more to the cart, ensure stock can accommodate it
      if (quantityDifference > product.stock) {
        return res.status(400).json({ error: 'Not enough stock to increase quantity' });
      }
      cart.products[productIndex].quantity = newQuantity;
      await productModel.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -quantityDifference, sales: quantityDifference } },
        { new: true }
      );
    } else if (quantityDifference < 0) {
      // Decreasing the quantity
      cart.products[productIndex].quantity = newQuantity;
      await productModel.findByIdAndUpdate(
        product._id,
        { $inc: { stock: Math.abs(quantityDifference), sales: quantityDifference } },
        { new: true }
      );
    }

    // Remove the product if the new quantity is 0
    if (newQuantity === 0) {
      cart.products.splice(productIndex, 1);
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ 
      message: 'Product quantity updated successfully',
      cart,
      remainingStock: product.stock - quantityDifference,
    });
  } catch (error) {
    console.error('Error updating product quantity in cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const requestNotification = async (req, res) => {
  const { username, activityId } = req.body;

  try {
    const activity = await activitiesModel.findById(activityId);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }

    if (activity.bookingOpen) {
      return res.status(400).json({ message: 'Bookings are already open for this activity.' });
    }

    const existingRequest = activity.notificationRequests.find(
      (request) => request.username === username
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested a notification for this activity.' });
    }

    activity.notificationRequests.push({ username });
    await activity.save();

    res.status(200).json({ message: 'Notification request added successfully.' });
  } catch (error) {
    console.error('Error requesting notification:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const requestNotificationItinerary = async (req, res) => {
  const { username, itineraryId } = req.body;

  try {
    const itinerary = await itineraryModel.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }

    if (itinerary.bookingOpen) {
      return res.status(400).json({ message: 'Bookings are already open for this itinerary.' });
    }

    const existingRequest = itinerary.notificationRequests.find(
      (request) => request.username === username
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested a notification for this itinerary.' });
    }

    itinerary.notificationRequests.push({ username });
    await itinerary.save();

    res.status(200).json({ message: 'Notification request added successfully.' });
  } catch (error) {
    console.error('Error requesting notification:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



const getNotifications = async (req, res) => {
  const { username } = req.query;

  try {
    const tourist = await touristModel.findOne({ Username: username });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({ notifications: tourist.notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const markNotificationsRead = async (req, res) => {
  const { username } = req.query;

  try {
    const tourist = await touristModel.findOne({ Username: username });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    tourist.notifications = tourist.notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    await tourist.save();

    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendActivityReminders = async (req, res) => {
  const { username } = req.query; // Get the username from the query
  try {
    // Fetch the tourist by Username
    const tourist = await touristModel.findOne({ Username: username });
    if (!tourist) {
      console.log('Tourist not found:', username);
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    console.log('Tourist found:', tourist.Username);

    // Check if there are no bookings
    if (!tourist.Bookings || tourist.Bookings.length === 0) {
      console.log('No bookings found for the tourist:', username);
      return res.status(200).json({ message: 'No bookings found to send reminders for.' });
    }

    // Define start and end of "tomorrow"
    const today = new Date();
    const tomorrowStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const tomorrowEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);

    let notificationsSent = [];

    // Check bookings for reminders
    for (const booking of tourist.Bookings) {
      console.log('Checking booking:', booking);

      if (
        new Date(booking.date) >= tomorrowStart &&
        new Date(booking.date) < tomorrowEnd &&
        !booking.reminded
      ) {
        console.log('Upcoming booking found:', booking);

        // Find the activity associated with the booking
        const activity = await activitiesModel.findOne({ name: booking.name });
        if (!activity) {
          console.log('Activity not found for booking name:', booking.name);
          continue;
        }

        console.log('Activity details:', activity);

        // Check if the notification already exists
        const existingNotification = tourist.notifications.some(
          (notification) =>
            notification.message.includes(activity.name) &&
            new Date(notification.date).toDateString() === new Date().toDateString()
        );

        if (existingNotification) {
          console.log(`Notification already exists for activity "${activity.name}"`);
          continue;
        }

        // Prepare the notification
        const notificationMessage = `Reminder: Your activity "${activity.name}" is scheduled for tomorrow.`;
        tourist.notifications.push({
          message: notificationMessage,
          date: new Date(),
          read: false,
        });

        // Send an email notification
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'malook25062003@gmail.com',
            pass: 'sxvo feuu woie gpfn',
          },
        });

        const mailOptions = {
          from: 'malook25062003@gmail.com',
          to: tourist.Email,
          subject: 'Activity Reminder',
          text: notificationMessage,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Reminder sent for activity "${activity.name}" to ${tourist.Email}`);
          notificationsSent.push({
            activity: activity.name,
            email: tourist.Email,
            status: 'success',
          });
        } catch (emailError) {
          console.error(`Failed to send email for activity "${activity.name}":`, emailError.message);
          notificationsSent.push({
            activity: activity.name,
            email: tourist.Email,
            status: 'failed',
          });
        }

        // Mark the booking as reminded
        booking.reminded = true;
      } else {
        console.log('Booking does not meet criteria for reminder:', booking);
      }
    }

    // Save tourist data
    await tourist.save();

    if (notificationsSent.length === 0) {
      console.log('No reminders were sent as no bookings required reminders.');
      return res.status(200).json({ message: 'No booking reminders for tomorrow.' });
    }

    console.log('Final notifications sent:', notificationsSent);
    return res.status(200).json({ message: 'Reminders processed successfully.', notificationsSent });
  } catch (error) {
    console.error('Error sending activity reminders:', error.message);
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};




const sendItineraryReminders = async (req, res) => {
  const { username } = req.query; // Get the username from the query
  try {
    // Fetch the tourist by Username
    const tourist = await touristModel.findOne({ Username: username });
    if (!tourist) {
      console.log('Tourist not found:', username);
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    console.log('Tourist found:', tourist.Username);

    // Check if there are no booked itineraries
    if (!tourist.Bookings || tourist.Bookings.length === 0) {
      console.log('No itineraries found for the tourist:', username);
      return res.status(200).json({ message: 'No itineraries found to send reminders for.' });
    }

    // Define start and end of "tomorrow"
    const today = new Date();
    const tomorrowStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1));
    const tomorrowEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 2));
    

    const notificationsSent = [];
    

    // Check itineraries for reminders
    for (const booking of tourist.Bookings) {
      console.log('Checking itinerary booking:', booking);

      if (
        new Date(booking.DatesTimes) >= tomorrowStart &&
        new Date(booking.DatesTimes) < tomorrowEnd 
        //!booking.reminded

      )
       {
        console.log('Upcoming itinerary booking found:', booking);

        // Find the itinerary associated with the booking
        const itinerary = await itineraryModel.findById({ _id: booking._id });
        if (!itinerary) {
          console.log('Itinerary not found for booking name:', booking._id);
          continue;
        }

        console.log('Itinerary details:', itinerary);
                
        // Check if the notification already exists
        const existingNotification = tourist.notifications.some(
          (notification) =>
            notification.message.includes(itinerary.Activities) &&
            new Date(notification.date).toDateString() === new Date().toDateString()
        );

        if (existingNotification) {
          console.log(`Notification already exists for itinerary "${itinerary.Activities}"`);
          continue;
        }

        // Prepare the notification
        const notificationMessage = `Reminder: Your itinerary "${itinerary.Activities}" is scheduled for tomorrow.`;
        tourist.notifications.push({
          message: notificationMessage,
          date: new Date(),
          read: false,
        });

        // Send an email notification
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'malook25062003@gmail.com',
            pass: 'sxvo feuu woie gpfn',
          },
        });

        const mailOptions = {
          from: 'malook25062003@gmail.com',
          to: tourist.Email,
          subject: 'Itinerary Reminder',
          text: notificationMessage,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Reminder sent for itinerary "${itinerary.Activities}" to ${tourist.Email}`);
          notificationsSent.push({
            itinerary: itinerary.Activities,
            email: tourist.Email,
            status: 'success',
          });
        } catch (emailError) {
          console.error(`Failed to send email for itinerary "${itinerary.Activities}":`, emailError.message);
          notificationsSent.push({
            itinerary: itinerary.Activities,
            email: tourist.Email,
            status: 'failed',
          });
        }

        // Mark the booking as reminded
        booking.reminded = true;
      } else {
        console.log('Itinerary booking does not meet criteria for reminder:', booking);
        
      }
    }

    // Save tourist data
    await tourist.save();

    if (notificationsSent.length === 0) {
      console.log('No reminders were sent as no itineraries required reminders.');
      return res.status(200).json({ message: 'No itinerary reminders for tomorrow.' });
    }

    console.log('Final notifications sent:', notificationsSent);
    res.status(200).json({ message: 'Reminders processed successfully.', notificationsSent });
  } catch (error) {
    console.error('Error sending itinerary reminders:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

// Function to create a new order
const createOrder = async (req, res) => {
  try {
    const { touristUsername, products,  shippingAddress,totalPrice } = req.body;

    // Validate input data
    if (!touristUsername || !products  || !shippingAddress) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

   

    // Fetch the product details (name and price) for each product name
    const fetchedProducts = await productModel.find({ productName: { $in: products } });
    if (fetchedProducts.length !== products.length) {
      return res.status(404).json({ message: 'Some products were not found' });
    }

    // Create a map of product names to their prices
    const productMap = fetchedProducts.reduce((acc, product) => {
      acc[product.productName] = product.price;
      return acc;
    }, {});

    // Calculate the total price
 

    // Create the order
    const newOrder = new Order({
      orderNumber: `ORD${Date.now()}`, // Generate a unique order number
      tourist: touristUsername, // Store the tourist's username
      products: products, // Store product names
      totalPrice,
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending', // Initially set to pending
    });
console.log(shippingAddress);
    // Save the new order to the database
    await newOrder.save();

    // Return the created order
    res.status(201).json({ message: 'Order created successfully', order: newOrder });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




const payWithWallet = async (req, res) => {
  const { username, amount } = req.body;

  if (!username || !amount ) {
    return res.status(400).json({ message: 'Invalid request. Please provide all required fields.' });
  }

  try {
    // Find the tourist based on the username
    const tourist = await touristModel.findOne({ Username: username });
    
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    // Check if the tourist has enough balance in their wallet
    if (tourist.Wallet < amount) {
      return res.status(400).json({ message: 'Insufficient funds in wallet.' });
    }

    // Deduct the amount from the wallet balance
    tourist.Wallet -= amount;

    // Add the booking to the tourist's bookings

    // Save the changes to the tourist's profile
    await tourist.save();

    return res.status(200).json({ message: 'Payment successful', tourist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred during payment processing.' });
  }
};
const sendConfirmationEmail = async (req,res) => {
  const {email,amount}=req.body;
  // Create a transport object using SMTP or another email service like SendGrid
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use Gmail or another service
    auth: {
      user: 'malook25062003@gmail.com', // Your email here
      pass: 'sxvo feuu woie gpfn', // Your email password or App password for Gmail
    },
  });

  const mailOptions = {
    from: 'malook25062003@gmail.com',
    to: email,
    subject: 'Payment Confirmation',
    text: `Dear Customer,

Thank you for your purchase. We have successfully processed a payment of $${(amount / 100).toFixed(2)}.

Best regards,
Triptastic`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Payment confirmation email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
const applyPromoCode = async (req, res) => {
  const { code, amount } = req.body; // code from frontend and the amount in cents

  try {
    // Find the promo code in the database
    const promo = await PromoCodeModel.findOne({ code: code });

    // If promo code doesn't exist
    if (!promo) {
      return res.status(400).json({ success: false, message: 'Invalid promo code' });
    }

    // Check if the promo code is still active and not expired
    const currentDate = new Date();
    if (!promo.active || promo.expirationDate < currentDate) {
      return res.status(400).json({ success: false, message: 'Promo code is expired or inactive' });
    }

    // Ensure that the promo code hasn't been used too many times
    if (promo.usageCount >= promo.maxUsage) {
      return res.status(400).json({ success: false, message: 'Promo code usage limit reached' });
    }

    // Calculate the discount (flat or percentage)
    let discountAmount = 0;
    if (promo.isPercentage) {
      discountAmount = Math.floor((promo.discount / 100) * amount); // Percentage of the total amount
    } else {
      discountAmount = promo.discount; // Flat discount in cents
    }

    // Ensure discount does not exceed the total amount
    if (discountAmount > amount) {
      return res.status(400).json({
        success: false,
        message: 'Discount cannot exceed the total amount',
      });
    }

    // Apply the discount
    const discountedAmount = amount - discountAmount;

    // Update the promo code usage count
    await PromoCodeModel.updateOne(
      { code: code },
      { $inc: { usageCount: 1 } } // Increment the usage count by 1
    );

    // Return the discount and the discounted amount
    return res.status(200).json({
      success: true,
      discount: discountAmount,
      discountedAmount,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error while applying promo code' });
  }
};
const getTouristOrders = async (req, res) => {
  try {
    const { tourist } = req.query; // Get the tourist username from URL parameters

    // Find all orders for the given tourist
    const orders = await Order.find({ tourist });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this tourist.' });
    }

    // Get the current date
    const currentDate = new Date();

    // Loop through each order and check if it's more than 3 days old
    for (let order of orders) {
      const orderDate = new Date(order.orderDate);
      const daysDifference = currentDate.getDate() - orderDate.getDate();  // Correct difference in days
// console.log(order.shippingAddress);
      // If the order is more than 3 days old and its status is not already 'delivered', update it
      if (daysDifference > 2 && order.status !== 'delivered') {
        order.status = 'delivered';
        await order.save(); // Save the updated order
      }

    }

    // Return the updated orders
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Missing username in query" });
    }

    // Update the cart for the user, clearing the products array
    const result = await cartModel.updateOne(
      { Username: username }, // Find the user's cart
      { $set: { products: [] } } // Set the `products` array to an empty array
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "No cart found for this user" });
    }

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const { orderNumber, username } = req.body; // Get orderNumber and username from the request body

    if (!orderNumber || !username) {
      return res.status(400).json({ message: 'Order number and username are required' });
    }

    // Find and delete the order by orderNumber
    const deletedOrder = await Order.findOneAndDelete({ orderNumber:orderNumber });

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find the tourist by username
    const tourist = await touristModel.findOne({ Username: username });

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Update the tourist's wallet by adding the order amount
    tourist.Wallet += deletedOrder.totalPrice;  // Assuming 'amount' is a property in the order model

    // Save the updated tourist wallet
    await tourist.save();

    return res.status(200).json({
      message: 'Order cancelled successfully',
      deletedOrder,
      updatedWallet: tourist.Wallet,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


 module.exports = {getTouristIntroStatus,sendItineraryReminders,sendActivityReminders,getNotifications,markNotificationsRead,updateProductQuantityInCart,bookmarkEvent, removeBookmark,getBookmarkedEvents,resetPassword,requestOTP,getCart,addProductToCart,getAttendedActivities,getCurrencyRates,getActivityToShare,changepasswordTourist,createTourist,gethistoricalLocationByName,createProductTourist,getProductTourist,filterActivities,
  viewProductsTourist,sortItinPASC,viewAllUpcomingActivitiesTourist,viewAllItinerariesTourist,viewAllHistoricalPlacesTourist
  ,getActivityByCategory,sortActPASCRASC,sortActPASCRDSC,sortActPDSCRASC,sortActPDSCRDSC,
  sortProductsByRatingTourist,sortItinPDSC,filterMuseumsByTagsTourist,filterHistoricalLocationsByTagsTourist
  ,getActivityByname,getTourist,updateTourist,viewAllMuseumsTourist,filterProductsByPriceRange
  ,getUniqueHistoricalPeriods,searchMuseums,searchHistoricalLocations,filterItineraries,searchActivities
  ,commentOnActivity,rateActivity,fileComplaint,getComplaintsByTourist,
  shareActivity,shareMuseum,shareHistorical,addReviewToProduct,bookActivity,bookItinerary,shareItinerary,addToCartAndRemoveFromWishlist,
  getBookedItineraries,submitFeedback,cancelBookedItinerary,requestAccountDeletionTourist,cancelActivity,
  getBookedActivities,setPreferences,getTransportation,submitFeedbackItinerary,loginTourist,addProductToWishlist,removeProductFromWishlist,getWishlist,removeProductFromCart,requestNotification,requestNotificationItinerary,addAddress,getAddresses,createOrder,payWithWallet,sendConfirmationEmail,applyPromoCode,getTouristOrders,cancelOrder,clearCart};