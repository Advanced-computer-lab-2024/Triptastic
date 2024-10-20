const touristModel = require('../Models/Tourist.js');
const historicalLocationModel = require('../Models/historicalLocation.js');
const productModel= require('../Models/Product.js');
const activitiesModel=require('../Models/Activities.js');
const itineraryModel= require('../Models/Itinerary.js');
const museumsModel=require('../Models/Museums.js');
const { default: mongoose } = require('mongoose');
const complaintModel = require('../Models/Complaint.js'); // Adjust the path based on your project structure


const setCurrency = (req, res) => {
  const { currency } = req.body;

  if (!currency) {
    return res.status(400).json({ error: 'Currency is required' });
  }

  // Store the selected currency in the session
  req.session.selectedCurrency = currency;

  res.status(200).json({ message: `Currency set to ${currency}` });
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
    // Step 1: Get the selected currency from the session, default to USD if not set
    const selectedCurrency = req.session.selectedCurrency || 'USD';

    // Step 2: Fetch products from the database
    const products = await productModel.find();

    // Step 3: Define exchange rates (you can move this to a separate file for larger applications)
    const exchangeRates = {
      USD: 1,      // Base currency
      EUR: 0.85,   // Example: 1 USD = 0.85 EUR
      GBP: 0.75,   // Example: 1 USD = 0.75 GBP
      EGP: 15.75   // Example: 1 USD = 15.75 EGP
    };

    // Step 4: Get the exchange rate for the selected currency
    const exchangeRate = exchangeRates[selectedCurrency] || 1;

    // Step 5: Convert product prices based on the selected currency
    const convertedProducts = products.map(product => ({
      productName: product.productName,
      description: product.description,
      price: (product.price * exchangeRate).toFixed(2),  // Convert the price
      currency: selectedCurrency,  // Add the currency info to the response
      rating: product.rating,
      seller: product.seller,
      review: product.review,
      stock: product.stock,
      image: product.image
    }));

    // Step 6: Return the products with converted prices
    res.status(200).json(convertedProducts);
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
  };
  const searchActivities = async (req, res) => {
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

  
      const activities = await activitiesModel.find(searchQuery);
      
      if (activities.length > 0) {
        res.status(200).json(activities);
      } else {
        res.status(404).json({ message: 'No activities found matching the search criteria.' });
      }
    } catch (error) {
      console.error('Error searching activities:', error);
      res.status(500).json({ message: 'Server error while searching for activities.', error: error.message });
    }


  }
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
  const { name } = req.params; // Get the activity ID from the request

  try {
      // Find the activity by ID
      const activity = await activitiesModel.findOne({ name: name });
      if (!activity) {
          return res.status(404).json({ error: 'Activity not found' });
      }

      // Generate the shareable link
      const shareableLink = `https://yourwebsite.com/activities/${name}`;

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
      const shareableLink = `https://yourwebsite.com/Museum/${Name}`;

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

 
 module.exports = {changepasswordTourist,setCurrency,createTourist,gethistoricalLocationByName,createProductTourist,getProductTourist,filterActivities,
  viewProductsTourist,sortItinPASC,viewAllUpcomingActivitiesTourist,viewAllItinerariesTourist,viewAllHistoricalPlacesTourist
  ,getActivityByCategory,sortActPASCRASC,sortActPASCRDSC,sortActPDSCRASC,sortActPDSCRDSC,
  sortProductsByRatingTourist,sortItinPDSC,filterMuseumsByTagsTourist,filterHistoricalLocationsByTagsTourist
  ,getActivityByname,getTourist,updateTourist,viewAllMuseumsTourist,filterProductsByPriceRange
  ,getUniqueHistoricalPeriods,searchMuseums,searchHistoricalLocations,filterItineraries,searchActivities
  ,commentOnActivity,rateActivity,fileComplaint,getComplaintsByTourist,shareActivity,shareMuseum,shareHistorical};