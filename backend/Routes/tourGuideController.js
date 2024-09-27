const tourGuideModel = require('../models/tourGuide.js');
const { default: mongoose } = require('mongoose');
const createTourGuide = async(req,res) => {

    const{Username,Email,Password}=req.body;
    try{
       const tourGuide=await tourGuideModel.create({Username,Email,Password});
       res.status(200).json(tourGuide);
    }
    catch{
       res.status(400).json({error:error.message})
 
    }
 }
 const getTourGuide= async(req,res) =>{
    const Username= req.params.Username;
    
    try {
        const tourGuide = await tourGuideModel.findOne({ Userame: Username }); 

            res.status(200).json(tourGuide);
    } 
    catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 }
 module.exports = {createTourGuide,getTourGuide};
