const touristModel = require('../Models/Tourist.js');
const historicalLocationModel = require('../Models/historicalLocation.js');
const productModel= require('../Models/Product.js');
const activitiesModel=require('../Models/Activities.js');
const itineraryModel= require('../Models/Itinerary.js');


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


 const gethistoricalLocationByName= async(req,res) =>{
    const {Name}= req.body;
    
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
   const {productName} = req.body; // Use Name as a parameter to find the category
   try {
       if (productName) {
           const Product = await productModel.findOne({ productName });
           if (!Product) {
               return res.status(404).json({ msg: "Product not found" });
           }
           res.status(200).json(Product);
       } else {
           const Products = await productModel.find();
           res.status(200).json(Products); // Return all categories if no Name is provided
       }
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};

const filterActivities =async (req, res) => {
   const { Category, date,minBudget, maxBudget, rating } = req.body;
   
   let filter = {};
   if (Category) {
      filter.Category = Category;
    }
 
    if (minBudget !== undefined && maxBudget !== undefined) {
      filter.minPrice = { $lte: Number(maxBudget) }; 
      filter.maxPrice = { $gte: Number(minBudget) }; 
    }
    if (date) {
      filter.date = new Date(date);
    }
   if (rating) {
     filter.rating = { $gte: rating };
   }
 
   const today = new Date();
   today.setHours(0, 0, 0, 0); 
   filter.date = { $gte: today };
  
   try {
     const activities = await activitiesModel.find(filter);
     res.json(activities);
   } catch (error) {
     res.status(500).json({ error: 'Server error' });
   }
 };
 
 const filterHistoricalLocationsByTag = async (req, res) => {
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



 
const viewProductsTourist = async (req, res) => {
  try {
    const products = await productModel.find(); 
    res.json(products); 
  } catch (error) {
    res.status(400).json({ error: error.message });
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

const viewAllItinerariesTourist = async (req, res) => {
  try {
    
      const itineraries = await itineraryModel.find({});
      res.status(200).json(itineraries);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching itineraries' });
  }
};



const sortItinerary= async (req,res)=>{
 try{
  const currentDate= new Date();
  const sortField=req.body.sortField || 1 ; // 1 asc -1 dsc
  const data = await itineraryModel.find({ date: { $gte: currentDate } }).sort({ Price: sortField }); 
  res.status(200).json(data);
 }catch(error){
  res.status(400).json({ error: error.message })
  }
}

 const sortActivity= async(req,res)=>{
  try{
   const currentDate= new Date();
   const sortCriteria= req.body.sortCriteria;
   const data = await activitiesModel.find({ date: { $gte: currentDate } }).sort(sortCriteria); 
   res.status(200).json(data);

 }
 catch(error){
   res.status(400).json({ error: error.message })
 }
}
const getActivityByCategory= async(req,res) =>{
  const {Category}= req.body;
  
  try {
      const activity = await activitiesModel.findOne({ Category: Category }); 

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
 
 
 module.exports = {createTourist,gethistoricalLocationByName,createProductTourist,getProductTourist,filterActivities,viewProductsTourist,sortItinerary,viewAllUpcomingActivitiesTourist,viewAllItinerariesTourist,viewAllHistoricalPlacesTourist,filterHistoricalLocationsByTag,getActivityByCategory,sortActivity,sortProductsByRatingTourist};
