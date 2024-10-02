const tourismGovModel = require('../Models/tourismGov.js');
const museumModel=require('../Models/Museums.js');
const historicalLocationModel = require('../Models/historicalLocation.js');
const { default: mongoose } = require('mongoose');


const createhistoricalLocation = async (req, res) => {
   const { Name, Description, Location, OpeningHours, TicketPrices, Tags,image } = req.body;
   const validTagTypes = ["Monuments", "Museums", "Religious Sites", "Palaces","Castles"];
   if (!Tags || !Tags.Types) {
       return res.status(400).json({ error: "Tags and Tags.Types are required." });
   }
   if (!validTagTypes.includes(Tags.Types)) {
       return res.status(400).json({ error: `Invalid tag type. Valid types are: ${validTagTypes.join(', ')}` });
   }
   try {
       const historicalLocation = await historicalLocationModel.create({
          Name,Description,Location,OpeningHours,TicketPrices,Tags,image
       });
       res.status(200).json(historicalLocation);
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};


const updatehistoricalLocation = async (req, res) => {
   const { Name, Description, Location, OpeningHours, TicketPrices, Tags } = req.body;

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

   
const createMuseum = async (req, res) => {
    const { Name, Description, Location, OpeningHours, TicketPrices, Tags,image } = req.body;
    const validTagTypes = ["Monuments", "Museums", "Religious Sites", "Palaces","Castles"];
    if (!Tags || !Tags.Types) {
        return res.status(400).json({ error: "Tags and Tags.Types are required." });
    }
    if (!validTagTypes.includes(Tags.Types)) {
        return res.status(400).json({ error: `Invalid tag type. Valid types are: ${validTagTypes.join(', ')}` });
    }
    try {
        const museum = await museumModel.create({
           Name,Description,Location,OpeningHours,TicketPrices,Tags,image
        });
        res.status(200).json(museumModel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
 };
 
 
 const updatedMuseum = async (req, res) => {
    const { Name, Description, Location, OpeningHours, TicketPrices, Tags } = req.body;
 
    const validTagTypes = ["Monuments", "Museums", "Religious Sites", "Palaces","Castles"];
 
    try {
        if (Tags && Tags.Types) {
            if (!validTagTypes.includes(Tags.Types)) {
                return res.status(400).json({ error: `Invalid tag type. Valid types are: ${validTagTypes.join(', ')}` });
            }
        }
 
        const updatedMuseum = await museumModel.findOneAndUpdate(
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
 
        if (!updatedMuseum) {
            return res.status(404).json({ msg: "Museum not found" });
        }
 
        res.status(200).json(updatedMuseum);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
 };
 
 const getMuseum= async(req,res) =>{
     const {Name}= req.body;
     
     try {
         const museum = await museumModel.findOne({ Name: Name }); 
 
             res.status(200).json(museum);
     } 
     catch (error) {
         res.status(400).json({ error: error.message }); 
     }
  }
  
 
 const deleteMuseum = async (req, res) => {
     const{Name}=req.body;
    try {
       const museum = await museumModel.deleteOne({Name:Name}); 
       if (!museum) {
          return res.status(404).json({ msg: "Museum not found" });
       }
       res.status(200).json({ msg: "Museum has been deleted successfully" });
    } catch (error) {
       res.status(400).json({ error: error.message });
    }
 }
 
    
 
 












module.exports = {createhistoricalLocation,updatehistoricalLocation,gethistoricalLocation,deletehistoricalLocation,createMuseum,updatedMuseum,getMuseum,deleteMuseum};