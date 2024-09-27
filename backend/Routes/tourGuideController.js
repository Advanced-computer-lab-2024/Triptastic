const tourGuideModel = require('../Models/tourGuide.js');
const { default: mongoose } = require('mongoose');
const createTourGuide = async(req,res) => {

    const{Name,Username,Email,Password,mobileNumber,yearsOfExperience,previousWork}=req.body;
    try{
       const tourGuide=await tourGuideModel.create({Name,UsernameEmail,Password,mobileNumber,yearsOfExperience,previousWork});
       res.status(200).json(tourGuide);
    }
    catch{
       res.status(400).json({error:error.message})
 
    }
 }
 const getTourGuide= async(req,res) =>{
    const name= req.params.name;
    
    try {
        const tourGuide = await tourGuideModel.findOne({ Name: name }); 

            res.status(200).json(tourGuide);
    } 
    catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 }
