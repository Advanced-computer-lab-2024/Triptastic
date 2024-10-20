const tourismGovModel = require('../Models/tourismGov.js');
const museumModel=require('../Models/Museums.js');
const historicalLocationModel = require('../Models/historicalLocation.js');
const { default: mongoose } = require('mongoose');


const createhistoricalLocation = async (req, res) => {
    const { Name, Description, Location, OpeningHours, TicketPrices, Tags, image, TourismGovernor} = req.body;
    const validTagTypes = ["Monuments", "Religious Sites", "Palaces", "Castles"];
 
    if (!Tags || !Tags.Types) {
        return res.status(400).json({ error: "Tags and Tags.Types are required." });
    }
 
    if (!validTagTypes.includes(Tags.Types)) {
        return res.status(400).json({ error: `Invalid tag type. Valid types are: ${validTagTypes.join(', ')}` });
    }
 
    try {
        // Find the tourism governor by the provided username
        const foundTourismgov = await tourismGovModel.findOne({ Username: TourismGovernor});
 
        if (!foundTourismgov) {
            return res.status(404).json({ error: "Tourism Governor not found." });
        }
 
        // Proceed with creating the historical location with the found TourismGovernor username
        const historicalLocation = await historicalLocationModel.create({
            Name,
            Description,
            Location,
            OpeningHours,
            TicketPrices,
            Tags,
            image,
            TourismGovernor: foundTourismgov.Username // Use the found governor's username
        });
 
        res.status(200).json(historicalLocation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
 };
 


const updatehistoricalLocation  = async (req, res) => {
    const {Name ,Description, Location, OpeningHours, TicketPrices, Tags } = req.body;
    

    const validTagTypes = ["Monuments", "Religious Sites", "Palaces", "Castles"];

    try {
        if (Tags && Tags.Types) {
            if (!validTagTypes.includes(Tags.Types)) {
                return res.status(400).json({ error: `Invalid tag type. Valid types are: ${validTagTypes.join(', ')}` });
            }
        }
        

        const updatehistoricalLocation = await historicalLocationModel.findOneAndUpdate(
            { Name: Name },
            {
                $set: {
                    Description: Description,
                    Location: Location,
                    OpeningHours: OpeningHours,
                    TicketPrices: TicketPrices,
                    Tags:Tags,
                    // Only update Tags if they are provided
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatehistoricalLocation ) {
            return res.status(404).json({ msg: "Historical Location not found" });
        }

        res.status(200).json(updatehistoricalLocation );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const gethistoricalLocation= async(req,res) =>{
    const {Name}= req.query;
    
    try {
        const historicalLocation = await historicalLocationModel.findOne({ Name:Name }); 

            res.status(200).json(historicalLocation);
    } 
    catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 }
 

 const deletehistoricalLocation = async (req, res) => {
    const { Name } = req.query; // Extract Name from req.query
    try {
        // Use deleteOne and check if a museum was actually deleted
        const result = await historicalLocationModel.deleteOne({ Name: Name });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "Historical Location not found" });
        }

        res.status(200).json({ msg: "Historical Location has been deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


   
const createMuseum = async (req, res) => {
    const { Name, Description, Location, OpeningHours, TicketPrices, Tags,image ,TourismGovernor} = req.body;
    
    try {
        // Find the tourism governor by the provided username
        const foundTourismgov = await tourismGovModel.findOne({ Username: TourismGovernor});
 
        if (!foundTourismgov) {
            return res.status(404).json({ error: "Tourism Governor not found." });
        }
 
        // Proceed with creating the historical location with the found TourismGovernor username
        const Museums = await museumModel.create({
            Name,
            Description,
            Location,
            OpeningHours,
            TicketPrices,
            Tags,
            image,
            TourismGovernor: foundTourismgov.Username // Use the found governor's username
        });
        res.status(200).json(Museums);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
 };
 
 
 const updateMuseum = async (req, res) => {
    const {Name, Description, Location, OpeningHours, TicketPrices, Tags } = req.body;

    try {
        
 
        const updateMuseum = await museumModel.findOneAndUpdate(
            { Name: Name },
            {
                $set: {
                    Description: Description,
                    Location: Location,
                    OpeningHours: OpeningHours,
                    TicketPrices: TicketPrices,
                    Tags:Tags 
                }
            },
            { new: true }
        );
 
        if (!updateMuseum) {
            return res.status(404).json({ msg: "Museum not found" });
        }
 
        res.status(200).json(updateMuseum);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
 };
 
 const getMuseum= async(req,res) =>{
     const {Name}= req.query;
     
     try {
         const museum = await museumModel.findOne({ Name: Name }); 
 
             res.status(200).json(museum);
     } 
     catch (error) {
         res.status(400).json({ error: error.message }); 
     }
  }
  
 
  const deleteMuseum = async (req, res) => {
    const { Name  } = req.query; 
    try {
        
        const result = await museumModel.deleteOne({ Name: Name  });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "Museum not found" });
        }

        res.status(200).json({ msg: "Museum has been deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const viewMyLocations= async(req,res) =>{
    const {TourismGovernor}= req.query;
    
    try {
        const locations = await historicalLocationModel.find({ TourismGovernor:TourismGovernor }); 

            res.status(200).json(locations);
    } 
    catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 }

 const viewMyMuseums= async(req,res) =>{
    const {TourismGovernor}= req.query;
    
    try {
        const museum = await museumModel.find({ TourismGovernor:TourismGovernor }); 

            res.status(200).json(museum);
    } 
    catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 }


 
 const changePasswordTourismGov= async (req, res) => {
    const {Username, currentPassword, newPassword } = req.body;
  
    try {
      // Find the seller by Username
      const TourismGov = await tourismGovModel.findOne({ Username });
  
      if (!TourismGov) {
        return res.status(404).json({ error: "Tourism Governer not found" });
      }
  
      // Compare current password directly (plain text comparison)
      if (currentPassword !== TourismGov.Password) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
  
      // Update the seller's password (plain text)
      TourismGov.Password = newPassword;
      await TourismGov.save();
  
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error changing password" });
    }
  };
  
 
    
 
 












module.exports = {changePasswordTourismGov,createhistoricalLocation,updatehistoricalLocation,gethistoricalLocation,deletehistoricalLocation,createMuseum,updateMuseum,getMuseum,deleteMuseum,
    viewMyLocations,viewMyMuseums
};