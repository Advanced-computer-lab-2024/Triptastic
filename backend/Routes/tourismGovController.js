const tourismGovModel = require('../Models/tourismGov.js');
const historicalLocationModel = require('../Models/historicalLocation.js');
const { default: mongoose } = require('mongoose');


<<<<<<< HEAD
const createhistoricalLocation = async (req, res) => {
   const { Name, Description, Location, OpeningHours, TicketPrices, Tags } = req.body;
   const validTagTypes = ["Monuments", "Museums", "Religious Sites", "Palaces","Castles"];
   if (!Tags || !Tags.Types) {
       return res.status(400).json({ error: "Tags and Tags.Types are required." });
   }
   if (!validTagTypes.includes(Tags.Types)) {
       return res.status(400).json({ error: `Invalid tag type. Valid types are: ${validTagTypes.join(', ')}` });
   }
   try {
       const historicalLocation = await historicalLocationModel.create({
          Name,Description,Location,OpeningHours,TicketPrices,Tags,
       });
       res.status(200).json(historicalLocation);
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};
=======
const{Name,Description,Location,OpeningHours,TicketPrices}=req.body;
try{
   const historicalLocation=await historicalLocationModel.create({Name,Description,Location,OpeningHours,TicketPrices});
   res.status(200).json(historicalLocation);
}
catch{
   res.status(400).json({error:error.message})
>>>>>>> 57e9cd58f08f1b28435546f6908b3e59f95424b7


const updatehistoricalLocation = async (req, res) => {
   const { Name, Description, Location, OpeningHours, TicketPrices, Tags } = req.body;

<<<<<<< HEAD
   const validTagTypes = ["Monuments", "Museums", "Religious Sites", "Palaces","Castles"];

   try {
       if (Tags && Tags.Types) {
           if (!validTagTypes.includes(Tags.Types)) {
               return res.status(400).json({ error: `Invalid tag type. Valid types are: ${validTagTypes.join(', ')}` });
           }
       }

       const updatedHistoricalLocation = await historicalLocationModel.findOneAndUpdate(
           { Name: Name },
           {
               $set: {
                   Description: Description,
                   Location: Location,
                   OpeningHours: OpeningHours,
                   TicketPrices: TicketPrices,
                   ...(Tags && { Tags }) 
               }
           },
           { new: true }
       );

       if (!updatedHistoricalLocation) {
           return res.status(404).json({ msg: "Historical Location not found" });
       }

       res.status(200).json(updatedHistoricalLocation);
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};
=======
const{Name,Description,Location,OpeningHours,TicketPrices}=req.body;
try{
   const historicalLocation=await historicalLocationModel.findOneAndUpdate({Name:Name },{$set:{Description:Description,Location:Location,OpeningHours:OpeningHours,TicketPrices:TicketPrices}},{ new: true });
   res.status(200).json(historicalLocation);
}
catch{
   res.status(400).json({error:error.message})
>>>>>>> 57e9cd58f08f1b28435546f6908b3e59f95424b7


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