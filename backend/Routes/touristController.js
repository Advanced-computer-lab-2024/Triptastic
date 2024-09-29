const touristModel = require('../models/Tourist.js');
const historicalLocationModel = require('../models/historicalLocation.js');
const productModel= require('../models/Product.js');

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

 const deleteTourist = async (req, res) => {
     try {
         const tourist = await touristModel.deleteOne({ Username: req.params.Username }); 
         if (!tourist) {
             return res.status(404).json({ msg: "Tourist not found" });
         }
         res.status(200).json({ msg: "Tourist has been deleted successfully" });
     } catch (error) {
         res.status(400).json({ error: error.message });
     }
 };
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
 
 
 module.exports = {createTourist,deleteTourist,gethistoricalLocationByName,createProductTourist,getProductTourist};
