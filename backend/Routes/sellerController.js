
const sellerModel = require('../Models/Seller.js');
const requestModel= require('../Models/Request.js');
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

  const{Username,Email,Password,Name,Description,Logo}=req.body;
  try{
     const seller=await sellerModel.findOneAndUpdate({Username: Username },{$set:{Email: Email,Password:Password,Name:Name,Description:Description,Logo:Logo}},{ new: true });
     res.status(200).json(seller);
  }
  catch{
     res.status(400).json({error:error.message})

  }
}

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
  const { productName,description,price,rating,seller,review,stock,image } = req.body;

  try {
    const product = await productModel.create({ productName,description,price,rating,seller,review,stock,image });
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

   const requestAccountDeletionSeller = async (req, res) => {
    const { Username } = req.query; 

    try {
       
         // Check if the user has already made a request
         const existingRequest = await requestModel.findOne({ Username, status: 'pending' });
         if (existingRequest) {
             return res.status(400).json({
                 msg: "You already have a pending request for account deletion."
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
        // Handle any errors that occur during the request process
        res.status(500).json({ error: "Failed to submit deletion request" });
    }
};

// Function to change seller's password

const changePassword = async (req, res) => {
  const { Username, currentPassword, newPassword } = req.body;

  try {
    // Find the seller by Username
    const seller = await sellerModel.findOne({ Username });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Compare current password directly (plain text comparison)
    if (currentPassword !== seller.Password) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Update the seller's password (plain text)
    seller.Password = newPassword;
    await seller.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error changing password" });
  }
};



 module.exports = {changePassword,createSeller,updateSeller,getSeller,createProductseller,getProductSeller,viewProductsSeller,sortProductsByRatingSeller,requestAccountDeletionSeller};