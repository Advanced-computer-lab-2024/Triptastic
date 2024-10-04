
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

 const updateSeller = async (req, res) => {
   const { Username } = req.query; 
   const { Email,Name, Description,Password } = req.body; 
   try {

      if (req.body.Username) {
         return res.status(400).json({ error: 'Username cannot be changed' });
     }
       
       const updates = {};
       if (Name) updates.Name = Name;
       if (Description) updates.Description = Description;
       if (Email) updates.Email = Email;
       if (Password) updates.Password = Password;

       
       const seller = await sellerModel.findOneAndUpdate(
           { Username: Username }, 
           { $set: updates }, 
           { new: true } 
       );

       if (!seller) {
           return res.status(404).json({ error: 'Seller not found' });
       }

       res.status(200).json(seller); 
   } catch (error) {
       res.status(400).json({ error: error.message }); 
   }
};

 const getSeller= async(req,res) =>{
    const {Username}= req.query;
    
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
  const { productName } = req.query;

  try {
      const product = await productModel.findOne({ productName: productName });
      res.status(200).json(product);
  } 
  catch (error) {
      res.status(400).json({ error: error.message });
  }
};


const viewProductsSeller = async (req, res) => {
   try {
     const products = await productModel.find(); 
     res.json(products); 
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 };
 
 const sortProductsByRatingSeller = async (req, res) => {
   try {
     const products = await productModel.find({}).sort({ rating: -1 }); // -1 for descending order
     res.status(200).json(products);
   } catch (error) {
     
     res.status(500).json({ error: 'Server error' });
   }
   };



 module.exports = {createSeller,updateSeller,getSeller,createProductseller,getProductSeller,viewProductsSeller,sortProductsByRatingSeller};