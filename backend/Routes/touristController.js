const touristModel = require('../Models/Tourist.js');
const historicalLocationModel = require('../Models/historicalLocation.js');
const productModel= require('../Models/Product.js');
const activitiesModel=require('../Models/Activities.js');
const itineraryModel= require('../Models/Itinerary.js');
const museumsModel=require('../Models/Museums.js');
const { default: mongoose } = require('mongoose');
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
  const validTagTypes = ["Monuments", "Museums", "Religious Sites", "Palaces","Castles"];

  try {
    if (!validTagTypes.includes(Types)) {
      return res.status(400).json({ error: `Invalid tag type. Valid types are: ${validTagTypes.join(', ')}` }); 
  }
      const filteredLocations = await historicalLocationModel.find({ 'Tags.Types': Types });

      if (filteredLocations.length === 0) {
          return res.status(404).json({ msg: "No historical locations found with the specified tag type." });
      }
      res.status(200).json(filteredLocations);
  } catch (error) {
      res.status(400).json({ error: error.message });
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
    
      const itineraries = await itineraryModel.find({});
      res.status(200).json(itineraries);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching itineraries' });
  }
};



const sortItinPASC= async (req,res)=>{
 try{
  const currentDate= new Date(); // 1 asc -1 dsc
  const data = await itineraryModel.find({ date: { $gte: currentDate } }).sort({ Price:1}); 
  res.status(200).json(data);
 }catch(error){
  res.status(400).json({ error: error.message })
  }
}
const sortItinPDSC= async (req,res)=>{
  try{
   const currentDate= new Date(); // 1 asc -1 dsc
   const data = await itineraryModel.find({ date: { $gte: currentDate } }).sort({ Price:-1}); 
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
 
 
 module.exports = {createTourist,gethistoricalLocationByName,createProductTourist,getProductTourist,filterActivities,
  viewProductsTourist,sortItinPASC,viewAllUpcomingActivitiesTourist,viewAllItinerariesTourist,viewAllHistoricalPlacesTourist
  ,getActivityByCategory,sortActPASCRASC,sortActPASCRDSC,sortActPDSCRASC,sortActPDSCRDSC,
  sortProductsByRatingTourist,sortItinPDSC,filterMuseumsByTagsTourist,filterHistoricalLocationsByTagsTourist,getActivityByname,getTourist,updateTourist,viewAllMuseumsTourist,filterProductsByPriceRange};
