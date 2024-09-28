const touristModel = require('../models/Tourist.js');
const { default: mongoose } = require('mongoose');
const createTourist = async(req,res) => {

    const{Username,Email,Password,Nationality,DOB,Occupation}=req.body;
    try{
       const tourist=await touristModel.create({Username,Email,Password,Nationality,DOB,Occupation});
       res.status(200).json(tourist);
    }
    catch{
       res.status(400).json({error:error.message})
 
    }
 }

 const deleteTourist = async (req, res) => {
     try {
         const tourist = await touristModel.deleteOne({ Username: req.params.Username }); 
         if (!tourist) {
             return res.status(404).json({ msg: "Tourist not found" });
         }
         res.status(200).json({ msg: "Tourist has been deleted successfully" });
     } catch (error) {
         res.status(400).json({ error: error.message });
     }
 };
 
 
 module.exports = {createTourist,deleteTourist};
