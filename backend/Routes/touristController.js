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
 

 const viewProductsTourist = async (req, res) => {
   try {
     const products = await productModel.find(); 
     res.json(products); 
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 };
 const sortItinerary= async (req,res)=>{
  try{
   const currentDate= new Date();
   const sortField=req.body.sortField || 1 ; // 1 asc -1 dsc
   const data = await itineraryModel.find().find({ date: { $gt: currentDate } }).sort({ Price: sortField }); 
   res.status(200).json(data);
  }catch(error){
   res.status(400).json({ error: error.message })
   }
 }
 
 
 module.exports = {createTourist,gethistoricalLocationByName,createProductTourist,getProductTourist,filterActivities,viewProductsTourist,sortItinerary};
