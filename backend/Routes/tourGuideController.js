const tourGuideModel = require('../models/tourGuide.js');
const { default: mongoose } = require('mongoose');
const createTourGuideInfo = async(req,res) => {

    const{Username,mobileNumber,yearsOfExperience,previousWork}=req.body;
    try{
       const tourGuide=await tourGuideModel.findOneAndUpdate({Username: Username },{$set:{mobileNumber: mobileNumber,yearsOfExperience: yearsOfExperience,previousWork: previousWork}});
       res.status(200).json(tourGuide);
    }
    catch{
       res.status(400).json({error:error.message})
 
    }
 }
 const getTourGuide= async(req,res) =>{
    const Username= req.params.Username;
    
    try {
        const tourGuide = await tourGuideModel.findOne({ Username: Username }); 

            res.status(200).json(tourGuide);
    } 
    catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 }
 const updateTourGuide= async(req,res)=>{
   const{Username,Email,Password,mobileNumber,yearsOfExperience,previousWork}=req.body;
   try{
      await tourGuideModel.updateOne({Username: Username},{$set:{Username: Username, Email: Email,Password: Password,mobileNuber: mobileNumber,yearsOfExperience: yearsOfExperience, previousWork: previousWork}});
      res.status(200).json({msg:" user is updated"});
   }
   catch (error){
      res.status(400).json({error: error.message});
   }

 }
 module.exports = {createTourGuideInfo,getTourGuide,updateTourGuide};
