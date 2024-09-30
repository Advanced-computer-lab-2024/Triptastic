const advertiserModel = require('../Models/Advertiser.js');
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



const getAdvertiser= async(req,res) =>{
   const {Username}= req.body;
   
   try {
       const advertiser = await advertiserModel.findOne({ Username: Username }); 

           res.status(200).json(advertiser);
   } 
   catch (error) {
       res.status(400).json({ error:error.message }); 
   }
}


const updateAdvertiser = async(req,res) => {

   const{Username,website_Link,Hotline,Company_Profile}=req.body;
   try{
      const advertiser=await advertiserModel.findOneAndUpdate({Username: Username },{$set:{website_Link:website_Link,Hotline:Hotline,Company_Profile:Company_Profile}},{ new: true });
      res.status(200).json(advertiser);
   }
   catch{
      res.status(400).json({error:error.message})

   }
}



 module.exports = {createAdvertiser,getAdvertiser,updateAdvertiser};