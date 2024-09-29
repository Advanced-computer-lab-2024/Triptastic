const tourismGovModel = require('../models/tourismGov.js');
const historicalLocationModel = require('../models/historicalLocation.js');
const { default: mongoose } = require('mongoose');

const createhistoricalLocation = async(req,res)=>{

const{Name,Description,Location,OpeningHours,TicketPrices}=req.body;
try{
   const historicalLocation=await historicalLocationModel.create({Name,Description,Location,OpeningHours,TicketPrices});
   res.status(200).json(historicalLocation);
}
catch{
   res.status(400).json({error:error.message})

}
}

const updatehistoricalLocation = async(req,res) => {

const{Name,Description,Location,OpeningHours,TicketPrices}=req.body;
try{
   const historicalLocation=await historicalLocationModel.findOneAndUpdate({Name:Name },{$set:{Description:Description,Location:Location,OpeningHours:OpeningHours,TicketPrices:TicketPrices}},{ new: true });
   res.status(200).json(historicalLocation);
}
catch{
   res.status(400).json({error:error.message})

}
}

const gethistoricalLocation= async(req,res) =>{
    const {Name}= req.body;
    
    try {
        const historicalLocation = await historicalLocationModel.findOne({ Name: Name }); 

            res.status(200).json(historicalLocation);
    } 
    catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 }
 

const deletehistoricalLocation = async (req, res) => {
    const{Name}=req.body;
   try {
      const historicalLocation = await historicalLocationModel.deleteOne({Name:Name}); 
      if (!historicalLocation) {
         return res.status(404).json({ msg: "Historical Location not found" });
      }
      res.status(200).json({ msg: "Historical Location has been deleted successfully" });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}

module.exports = {createhistoricalLocation,updatehistoricalLocation,gethistoricalLocation,deletehistoricalLocation};