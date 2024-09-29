const tourGuideModel = require('../Models/tourGuide.js');
const itineraryModel = require('../Models/Itinerary.js');
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
   const Username=req.params.Username;
   const updates=req.body;
   try{
      const result=await tourGuideModel.updateOne({Username: Username},{$set: updates});
      if (result.modifiedCount === 0) {
         return res.status(404).json({ msg: "No user found " });}
      res.status(200).json({msg:" user is updated"});
   }
   catch (error){
      res.status(400).json({error: error.message});
   }

 }
 const deleteTourGuide = async (req, res) => {
   
   try {
       const tourGuide = await tourGuideModel.deleteOne({ Username: req.params.Username });
       
       if (!tourGuide) {
           return res.status(404).json({ msg: "Tour Guide not found" });
       }
       
       res.status(200).json({ msg: "Tour Guide has been deleted successfully" });
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};

 const createItinerary=async(req,res)=>{
   const{Activities,Location,Timeline,DurationOfActivity,Language,Price,DatesTimes,Accesibility,pickUpDropOff}=req.body;
   try{
      const itinerary=await itineraryModel.create({Activities,Location,Timeline,DurationOfActivity,Language,Price,DatesTimes,Accesibility,pickUpDropOff});
      res.status(200).json(itinerary);
   }
   catch{
      res.status(400).json({error:error.message})

   }
 }
 const getItinerary= async(req,res)=>{
   const {location}=req.body;
   try{
      const x=await itineraryModel.findOne({Location: location});
      res.status(200).json(x);
   }
   catch (error){
      res.status(400).json({error: error.message});
   }
 }
 const updateItinerary= async(req,res)=>{
   const location= req.params.Location;
   const date= req.params.DatesTimes
   const update= req.body;
   try{
      await itineraryModel.updateOne({Location: location, DatesTimes: date},{$set: update});
      res.status(200).json({msg:" Itinerary is updated"});
   }
   catch (error){
      res.status(400).json({error: error.message});
   }
 }
 const deleteItinerary = async (req, res) => {
   const location= req.params.Location;
   const date= req.params.DatesTimes
   try {
      const itinerary = await itinerary.findOne({ Location: location, DatesTimes: date  });
      if(itinerary.booked==false){
       const tourGuide = await itineraryModel.deleteOne({ Location: location, DatesTimes: date });
       res.status(200).json({ msg: "Itinerary has been deleted successfully" });
      }
   else{
      res.status(409).json({ msg: "Itinerary cannot be deleted because it is booked." });
   }
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};
 
 module.exports = {createTourGuideInfo,getTourGuide,updateTourGuide,createTourGuide,deleteTourGuide,createItinerary,getItinerary,updateItinerary,deleteItinerary};
 
