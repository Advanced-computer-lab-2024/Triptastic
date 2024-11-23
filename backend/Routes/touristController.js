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
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');

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
  const { Username, Email, Password, Nationality, DOB, Occupation } = req.body;

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
    });

    res.status(200).json({
      message: 'Tourist registered successfully',
      tourist,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const loginTourist = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Check if the user exists
    const tourist = await touristModel.findOne({ Email });
    if (!tourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(Password, tourist.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
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
  const { productName, review, rating } = req.body;

  try {
    // Find the product by name and update its review and rating
    const product = await productModel.findOneAndUpdate(
      { productName },
      { $set: { review, rating } },
      { new: true } // Return the updated document
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
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
    res.status(500).json({ error: 'An error occurred while fetching complaints.' });
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

  if (tourist.badge === 1) {
    pointsToAdd = amountPaid * 0.5;
  } else if (tourist.badge === 2) {
    pointsToAdd = amountPaid * 1;
  } else if (tourist.badge === 3) {
    pointsToAdd = amountPaid * 1.5;
  }

  tourist.points += pointsToAdd;

  if (tourist.points > 500000) {
    tourist.badge = 3;
  } else if (tourist.points > 100000) {
    tourist.badge = 2;
  } else {
    tourist.badge = 1;
  }

  await tourist.save(); 
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

    await calculateAndAddPoints(tourist, activity.price);
    if (tourist.points >= 10000) {
      const cashBonus = Math.floor(tourist.points / 10000) * 100; // Calculate cash based on total points
      tourist.Wallet = (tourist.Wallet || 0) + cashBonus;
    }
    tourist.Bookings.push(activity);

    // Save the updated tourist record
    await tourist.save();

    res.status(200).json({ message: 'Activity booked successfully!', tourist });
  } catch (error) {
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
    await calculateAndAddPoints(tourist, itinerary.Price);
if (tourist.points >= 10000) {
  const cashBonus = Math.floor(tourist.points / 10000) * 100; // Calculate cash based on total points
  tourist.Wallet = (tourist.Wallet || 0) + cashBonus;
}
    tourist.Bookings.push(itinerary);
    await tourist.save();

    res.status(200).json({
      message: 'Itinerary booked successfully!', tourist
    });
  } catch (error) {
    res.status(500).json({ error: 'Error booking itinerary' });
  }
 };
const submitFeedbackItinerary = async (req, res) => {
  const { username } = req.query; // Get the username from the query parameters
  const { Itinerary, rating, comment } = req.body; // Use itineraryId passed in the body

  // Validate input
  if (!Itinerary || !rating || !comment) {
    return res.status(400).json({ message: 'Itinerary ID, rating, and comment are required' });
  }

  // Retrieve the tourist's username from the request or session (logged-in user)
  const touristUsername = await touristModel.findOne({ Username: username });

  // Check if the tourist is authenticated
  if (!touristUsername) {
    return res.status(403).json({ message: 'User is not authenticated' });
  }

  try {
    // Fetch the itinerary
    const itinerary = await itineraryModel.findById(Itinerary); // Ensure you have the correct model here
    console.log(Itinerary);

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Create the feedback object
    const feedbackEntry = {
      touristUsername: touristUsername.Username, // Add the tourist's username
      itineraryId: Itinerary, // Use the ID from the itinerary object directly
      rating,
      comment,
      date: Date.now(), // Automatically set to current date
    };

    // Add the feedback to the itinerary's feedback array
    itinerary.feedback.push(feedbackEntry);

    // Save the updated itinerary document
    await itinerary.save();

    res.status(200).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.log(comment);
    console.log(rating);

    console.error(error);
    res.status(500).json({ message: 'Server error while submitting feedback' });
  }
};


const submitFeedback = async (req, res) => {
  const { username } = req.query; // Get the username from the query parameters
  const { Itinerary, rating, comment} = req.body; // Use itineraryId passed in the body

  // Validate input
  if (!Itinerary || !rating || !comment) {
   
    return res.status(400).json({ message: 'Itinerary ID, rating, and comment are required' });
  }

  // Retrieve the tourist's username from the request or session (logged-in user)
  const touristUsername = await touristModel.findOne({ Username: username });

  // Check if the tourist is authenticated
  if (!touristUsername) {
    return res.status(403).json({ message: 'User is not authenticated' });
  }

  try {
    // Fetch the itinerary to find the associated tour guide's username
    const itinerary = await itineraryModel.findById(Itinerary).populate('TourGuide'); // Ensure you have the correct model here

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5.' });
    }
    const tourGuideUsername = itinerary.TourGuide; // Get the tour guide's username from the itinerary

    // Create the feedback object
    const feedbackEntry = {
      touristUsername: touristUsername.Username, // Add the tourist's username
      itineraryId:Itinerary, // Use the ID from the itinerary object directly
      rating,
      comment,
      date: Date.now(), // Automatically set to current date
    };
    
    // Find the tour guide and add the feedback
    const foundTourGuide = await TourGuideModel.findOne({ Username: tourGuideUsername });

    if (!foundTourGuide) {
      return res.status(404).json({ message: `Tour guide '${tourGuideUsername}' not found` });
    }

    // Add the feedback to the tour guide's feedback array
    foundTourGuide.feedback.push(feedbackEntry);

    // Save the updated tour guide document
    await foundTourGuide.save();

    res.status(200).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while submitting feedback' });
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
};

const cancelBookedItinerary = async (req, res) => {
  const { itineraryId } = req.params; // Get the itinerary ID from the request parameters
  const { username } = req.query; // Get the username from the query parameters

  try {
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

    // Remove the booked itinerary from the tourist's bookings
    tourist.Bookings = tourist.Bookings.filter(booking => booking._id.toString() !== itineraryId);

    // Save the updated tourist record
    await tourist.save();

    res.status(200).json({ message: 'Itinerary booking cancelled successfully' });
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

  console.log('cancelBookedActivity function called'); // Initial log to confirm function call
  console.log('Received activityId:', activityId); // Log received activityId
  console.log('Received username:', username); // Log received username

  try {
    // Find the tourist by username
    const tourist = await touristModel.findOne({ Username: username });
    if (!tourist) {
      console.log('Tourist not found'); // Log if tourist is not found
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Log the tourist's bookings for debugging
    console.log('Tourist Bookings:', tourist.Bookings);

    // Find the booked activity by ID
    const bookedActivity = tourist.Bookings.find(booking => booking._id.toString() === activityId);
    if (!bookedActivity) {
      console.log('Activity not found in the tourist\'s bookings'); // Log if activity is not found
      return res.status(404).json({ message: 'Activity not found in the tourist\'s bookings' });
    }

    // Check if the activity is within the cancellation window (48 hours before start date)
    const activityStartDate = new Date(bookedActivity.DatesTimes);
    const currentDate = new Date();
    const timeDifference = activityStartDate - currentDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

    if (hoursDifference <= 48) {
      console.log('Activity cannot be cancelled within 48 hours of start date'); // Log if within cancellation window
      return res.status(400).json({ message: 'Activity cannot be cancelled within 48 hours of start date' });
    }

    // Remove the booked activity from the tourist's bookings
    tourist.Bookings = tourist.Bookings.filter(booking => booking._id.toString() !== activityId);

    // Save the updated tourist record
    await tourist.save();

    res.status(200).json({ message: 'Activity booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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


 module.exports = {removeProductFromCart,bookmarkEvent, removeBookmark,getBookmarkedEvents,resetPassword,requestOTP,getCart,addProductToCart,getAttendedActivities,getCurrencyRates,getActivityToShare,changepasswordTourist,createTourist,gethistoricalLocationByName,createProductTourist,getProductTourist,filterActivities,
  viewProductsTourist,sortItinPASC,viewAllUpcomingActivitiesTourist,viewAllItinerariesTourist,viewAllHistoricalPlacesTourist
  ,getActivityByCategory,sortActPASCRASC,sortActPASCRDSC,sortActPDSCRASC,sortActPDSCRDSC,
  sortProductsByRatingTourist,sortItinPDSC,filterMuseumsByTagsTourist,filterHistoricalLocationsByTagsTourist
  ,getActivityByname,getTourist,updateTourist,viewAllMuseumsTourist,filterProductsByPriceRange
  ,getUniqueHistoricalPeriods,searchMuseums,searchHistoricalLocations,filterItineraries,searchActivities
  ,commentOnActivity,rateActivity,fileComplaint,getComplaintsByTourist,
  shareActivity,shareMuseum,shareHistorical,addReviewToProduct,bookActivity,bookItinerary,shareItinerary
  
  ,getBookedItineraries,submitFeedback,cancelBookedItinerary,requestAccountDeletionTourist,cancelActivity,
  getBookedActivities,setPreferences,getTransportation,submitFeedbackItinerary,loginTourist,addProductToWishlist,removeProductFromWishlist,getWishlist};