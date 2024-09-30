
const sellerModel = require('../Models/Seller.js');
const productModel= require('../Models/Product.js');
const { default: mongoose } = require('mongoose');
const createSeller = async(req,res) => {

    const{Username,Email,Password}=req.body;
    try{
       const seller=await sellerModel.create({Username,Email,Password});
       res.status(200).json(seller);
    }
    catch{
       res.status(400).json({error:error.message})
 
    }
 }

 const updateSeller = async(req,res) => {

    const{Username,Name,Description}=req.body;
    try{
       const seller=await sellerModel.findOneAndUpdate({Username: Username },{$set:{Name: Name,Description:Description}},{ new: true });
       res.status(200).json(seller);
    }
    catch{
       res.status(400).json({error:error.message})
 
    }
 }
//  const updateSeller= async(req,res)=>{
//     const {Username,update}=req.body;
    
//     try{
//        const seller = await sellerModel.findOneAndUpdate({Username: Username},{$set: update},{new:true});
//        res.status(200).json(seller);
//     }
//     catch (error){
//        res.status(400).json({error: error.message});
//     }
 
//  }
 const getSeller= async(req,res) =>{
    const {Username}= req.body;
    
    try {
        const seller = await sellerModel.findOne({ Username: Username }); 

            res.status(200).json(seller);
    } 
    catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 }

 const createProductseller = async (req, res) => {
   const { productName } = req.body;
 
   try {
     const product = await productModel.create({ productName });
     res.status(201).json(product);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};

const getProductSeller = async (req, res) => {
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




 module.exports = {createSeller,updateSeller,getSeller,createProductseller,getProductSeller};