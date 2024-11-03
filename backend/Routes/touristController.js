const touristModel = require('../Models/Tourist.js');
const historicalLocationModel = require('../Models/historicalLocation.js');
const productModel= require('../Models/Product.js');
const activitiesModel=require('../Models/Activities.js');
const itineraryModel= require('../Models/Itinerary.js');
const museumsModel=require('../Models/Museums.js');
const { default: mongoose } = require('mongoose');
const complaintModel = require('../Models/Complaint.js'); // Adjust the path based on your project structure
const TourGuideModel = require('../Models/tourGuide.js'); // Adjust path as needed
const requestModel = require('../Models/Request.js'); // Adjust path as needed

const axios = require('axios');


const getCurrencyRates = async (req, res) => {
  try {
    const baseCurrency = 'USD';
    const selectedCurrency = (req.query.currency || 'USD').trim(); // Trim any extra whitespace

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


const createTourist = async(req,res) => {

    const{Username,Email,Password,Nationality,DOB,Occupation}=req.body;
    try{
       const tourist=await touristModel.create({Username,Email,Password,Nationality,DOB,Occupation});
       res.status(200).json(tourist);
    }
    catch{
       res.status(400).json({error:error.message})
 
    }
 }

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
    const products = await productModel.find(); 
    res.json(products); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const filterProductsByPriceRange = async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  try {
    // Set up filter criteria based on provided min and max prices
    let filter = {};
    
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
   const data = await activitiesModel.find({ date: { $gte: currentDate } }).sort({Price : 1, Rating : 1}); 
   res.status(200).json(data);

 }
 catch(error){
   res.status(400).json({ error: error.message })
 }
}
const sortActPASCRDSC= async(req,res)=>{
  try{
   const currentDate= new Date();
   const data = await activitiesModel.find({ date: { $gte: currentDate } }).sort({Price : 1, Rating : -1}); 
   res.status(200).json(data);

 }
 catch(error){
   res.status(400).json({ error: error.message })
 }
}
const sortActPDSCRASC= async(req,res)=>{
  try{
   const currentDate= new Date();
   const data = await activitiesModel.find({ date: { $gte: currentDate } }).sort({Price : -1, Rating : 1}); 
   res.status(200).json(data);

 }
 catch(error){
   res.status(400).json({ error: error.message })
 }
}
const sortActPDSCRDSC= async(req,res)=>{
  try{
   const currentDate= new Date();
   const data = await activitiesModel.find({ date: { $gte: currentDate } }).sort({Price : -1, Rating : -1}); 
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

const shareActivity = async (req, res) => {
  const { name } = req.params; // Get the activity name from the request

  try {
    // Find the activity by name
    const activity = await activitiesModel.findOne({ name: name });
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Generate the shareable link using the activity ID (or another unique identifier)
    const shareableLink =`http://localhost:3000/activities/${encodeURIComponent(activity.name)}`; // Add any other details you want


    // Return the link for sharing
    res.status(200).json({ link: shareableLink });
  } catch (error) {
    console.error('Error generating shareable link:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


const shareHistorical = async (req, res) => {
  const { Name } = req.params; 

  try {
      // Find the activity by ID
      const historical = await historicalLocationModel.findOne({ Name: Name });
      if (!historical) {
          return res.status(404).json({ error: 'Historical not found' });
      }

      // Generate the shareable link
      const shareableLink = `https://yourwebsite.com/historical/${Name}`;

      // Return the link for sharing
      res.status(200).json({ link: shareableLink });
  } catch (error) {
      console.error('Error generating shareable link:', error);
      res.status(500).json({ error: 'Server error' });
  }
};
const shareMuseum = async (req, res) => {
  const { Name } = req.params; 

  try {
      // Find the activity by ID
      const Museum = await museumsModel.findOne({ Name: Name });
      if (!Museum) {
          return res.status(404).json({ error: 'Museum not found' });
      }

      // Generate the shareable link
      const shareableLink = `https://localhost:3000/${Name}`;

      // Return the link for sharing
      res.status(200).json({ link: shareableLink });
  } catch (error) {
      console.error('Error generating shareable link:', error);
      res.status(500).json({ error: 'Server error' });
  }
};
const shareItinerary = async (req, res) => {
  const { Activities } = req.params; 

  try {
      // Find the activity by ID
      const Itinerary = await itineraryModel.findOne({ Activities: Activities });
      if (!Itinerary) {
          return res.status(404).json({ error: 'Itinerary not found' });
      }

      // Generate the shareable link
      const shareableLink = `https://yourwebsite.com/Itinerary/${Activities}`;

      // Return the link for sharing
      res.status(200).json({ link: shareableLink });
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
// const bookItinerary = async (req, res) => {
//   const { itineraryId, Username } = req.body;

//   try {
//     const itinerary = await itineraryModel.findById(itineraryId);
//     if (!itinerary) {
//       return res.status(404).json({ error: 'Itinerary not found' });
//     }

//     const tourist = await touristModel.findOne({ Username });
//     if (!tourist) {
//       return res.status(404).json({ error: 'Tourist not found' });
//     }

//     const alreadyBooked = tourist.Bookings.some(
//       booking => booking._id.toString() === itinerary._id.toString()
//     );

//     if (alreadyBooked) {
//       return res.status(400).json({ error: 'You have already booked this itinerary' });
//     }

//     if (itinerary.Booked) {
//       return res.status(400).json({ message: 'Itinerary is Full' });
//     }

//     // Calculate points based on badge level
//     let pointsEarned;
//     if (tourist.badge === 1) {
//       pointsEarned = itinerary.Price * 0.5;
//     } else if (tourist.badge === 2) {
//       pointsEarned = itinerary.Price * 1;
//     } else if (tourist.badge === 3) {
//       pointsEarned = itinerary.Price * 1.5;
//     } else {
//       pointsEarned = 0; // In case badge level is invalid or undefined
//     }

//     // Add points to the tourist's total points
//     tourist.points += pointsEarned;

//     // Check if points reach or exceed 10,000 to add cash to wallet
//     if (tourist.points >= 10000) {
//       const cashBonus = Math.floor(tourist.points / 10000) * 100; // Calculate cash based on total points
//       tourist.Wallet = (tourist.Wallet || 0) + cashBonus;
//     }

//     if (tourist.points > 500000) {
//       tourist.badge = 3;
//     } else if (tourist.points > 100000) {
//       tourist.badge = 2;
//     } else {
//       tourist.badge = 1;
//     }
  
//     // Save the booking and updated tourist information
//     tourist.Bookings.push(itinerary);
//     await tourist.save();

//     res.status(200).json({
//       message: 'Itinerary booked successfully',
//       pointsEarned,
//       newTotalPoints: tourist.points,
//       newWalletBalance: tourist.Wallet,
//       tourist,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error booking itinerary' });
//   }
// };



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


 module.exports = {getActivityToShare,changepasswordTourist,createTourist,gethistoricalLocationByName,createProductTourist,getProductTourist,filterActivities,
  viewProductsTourist,sortItinPASC,viewAllUpcomingActivitiesTourist,viewAllItinerariesTourist,viewAllHistoricalPlacesTourist
  ,getActivityByCategory,sortActPASCRASC,sortActPASCRDSC,sortActPDSCRASC,sortActPDSCRDSC,
  sortProductsByRatingTourist,sortItinPDSC,filterMuseumsByTagsTourist,filterHistoricalLocationsByTagsTourist
  ,getActivityByname,getTourist,updateTourist,viewAllMuseumsTourist,filterProductsByPriceRange
  ,getUniqueHistoricalPeriods,searchMuseums,searchHistoricalLocations,filterItineraries,searchActivities
  ,commentOnActivity,rateActivity,fileComplaint,getComplaintsByTourist,
  shareActivity,shareMuseum,shareHistorical,addReviewToProduct,bookActivity,bookItinerary,shareItinerary,getBookedItineraries,submitFeedback,cancelBookedItinerary,requestAccountDeletionTourist,cancelActivity,getBookedActivities,setPreferences};