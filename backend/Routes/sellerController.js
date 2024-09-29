
const sellerModel = require('../Models/Seller.js');
const productModel= require('../models/Product.js');
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
 



 module.exports = {createSeller,updateSeller,getSeller};