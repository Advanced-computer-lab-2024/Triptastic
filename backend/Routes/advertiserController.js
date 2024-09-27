const advertiserModel = require('../models/Advertiser.js');
const { default: mongoose } = require('mongoose');
const createAdvertiser = async(req,res) => {

    const{Username,Email,Password}=req.body;
    try{
       const advertiser=await advertiserModel.create({Username,Email,Password});
       res.status(200).json(advertiser);
    }
    catch{
       res.status(400).json({error:error.message})
 
    }
 }
 module.exports = {createAdvertiser};