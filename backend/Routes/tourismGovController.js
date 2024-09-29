const tourismGovModel = require('../Models/tourismGov.js');
const museumModel = require('../Models/Museum.js');
const { default: mongoose } = require('mongoose');

const createMuseum = async(req,res)=>{

const{Name,Description,Location,OpeningHours,TicketPrices}=req.body;
try{
   const museum=await museumModel.create({Name,Description,Location,OpeningHours,TicketPrices});
   res.status(200).json(museum);
}
catch{
   res.status(400).json({error:error.message})

}
}

const updateMuseum = async(req,res) => {

const{Name,Description,Location,OpeningHours,TicketPrices}=req.body;
try{
   const museum=await museumModel.findOneAndUpdate({Name:Name },{$set:{Description:Description,Location:Location,OpeningHours:OpeningHours,TicketPrices:TicketPrices}},{ new: true });
   res.status(200).json(museum);
}
catch{
   res.status(400).json({error:error.message})

}
}

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

module.exports = {createMuseum,updateMuseum,getMuseum,deleteMuseum};