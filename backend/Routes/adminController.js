const adminModel = require('../Models/Admin.js');
const activitiescategoryModel = require('../Models/Activitiescategory.js');
const prefTagModel = require('../Models/PreferenceTags.js');
const productModel= require('../Models/Product.js');
const { default: mongoose } = require('mongoose');
const touristModel = require('../Models/Tourist');
const tourGuideModel = require('../Models/tourGuide');
const sellerModel = require('../Models/Seller');
const advertiserModel = require('../Models/Advertiser');
const tourismGovModel = require('../Models/tourismGov');
const itineraryModel= require('../Models/Itinerary.js');
const touristItineraryModel=require('../Models/touristItinerary.js');
const activityModel= require('../Models/Activities.js');
const AdminLogin = async (req, res) => {
  const { Username, Password } = req.body;

  try {
      const admin = await adminModel.findOne({ Username, Password });

      if (!admin) {
          return res.status(401).json({ error: "Invalid username, password" });
      }
      res.status(200).json({ message: "Login successful", admin });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const tourismGovLogin = async (req, res) => {
  const { Username, Password } = req.body;

  try {
      const tourismGov = await tourismGovModel.findOne({ Username, Password });

      if (!tourismGov) {
          return res.status(401).json({ error: "Invalid username, password" });
      }
      res.status(200).json({ message: "Login successful", tourismGov });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



const createAdmin = async (req, res) => {
    const { Username, Password } = req.body;

    try {
        const existingAdmin = await adminModel.findOne({ Username });
        
        if (existingAdmin) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const admin = await adminModel.create({ Username, Password });
        res.status(201).json(admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const createCategory = async (req, res) => {
    const { Name } = req.body;
    try {
        const category = await activitiescategoryModel.create({ Name });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getCategory = async (req, res) => {
  const { Name } = req.query;

  try {
      const category = await activitiescategoryModel.findOne({ Name: Name });
      res.status(200).json(category);
  } 
  catch (error) {
      res.status(400).json({ error: error.message });
  }
};


const updateCategory = async (req, res) => {
    const {Name, newName }= req.body; // The current category name from the URL parameter
   // The new name to be updated, taken directly from the request body

    try {
        const category = await activitiescategoryModel.findOneAndUpdate(
            { Name: Name }, // Find category by the current name
            { $set: { Name: newName } }, // Update to the new name
            { new: true } // Return the updated document
        );

        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }

        res.status(200).json(category); // Return the updated category
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const deleteCategory = async (req, res) => {
    const {Name }= req.body;
    try {
        const category = await activitiescategoryModel.findOneAndDelete({ Name });
        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }
        res.status(200).json({ msg: "Category deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    const { productName,description,price,rating,seller,review,stock,image } = req.body;
  
    try {
      const product = await productModel.create({ productName,description,price,rating,seller,review,stock,image });
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
 

const getProduct = async (req, res) => {
  const { productName } = req.query;

  try {
      const product = await productModel.findOne({ productName: productName });
      res.status(200).json(product);
  } 
  catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const deleteAdvertiser = async (req, res) => {
    const { Username } = req.query;  
    try {
      const result = await advertiserModel.deleteOne({ Username: Username }); 
      if (result.deletedCount === 0) {
        return res.status(404).json({ msg: "Advertiser not found" });
      }
      res.status(200).json({ msg: "Advertiser has been deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  const deleteSeller = async (req, res) => {
    const { Username } = req.query;  
    try {
      const result = await sellerModel.deleteOne({ Username: Username }); 
      if (result.deletedCount === 0) {
        return res.status(404).json({ msg: "Seller not found" });
      }
      res.status(200).json({ msg: "Seller has been deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const deleteTourGuide = async (req, res) => {
    const { Username } = req.query;  
    try {
      const result = await tourGuideModel.deleteOne({ Username: Username }); 
      if (result.deletedCount === 0) {
        return res.status(404).json({ msg: "Tour Guide not found" });
      }
      res.status(200).json({ msg: "Tour Guide has been deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const deleteTourist = async (req, res) => {
    const { Username } = req.query;  
    try {
      const result = await touristModel.deleteOne({ Username: Username }); 
      if (result.deletedCount === 0) {
        return res.status(404).json({ msg: "Tourist not found" });
      }
      res.status(200).json({ msg: "Tourist has been deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const deleteAdmin = async (req, res) => {
    const { Username } = req.query;  
    try {
      const result = await adminModel.deleteOne({ Username: Username }); 
      if (result.deletedCount === 0) {
        return res.status(404).json({ msg: "Admin not found" });
      }
      res.status(200).json({ msg: "Admin has been deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
const deleteTourismGov = async (req, res) => {
    const { Username } = req.query;  
    try {
      const result = await tourismGovModel.deleteOne({ Username: Username }); 
      if (result.deletedCount === 0) {
        return res.status(404).json({ msg: "Tourism Governor not found" });
      }
      res.status(200).json({ msg: "Tourism Governor has been deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

const createPrefTag = async (req, res) => {
    const { PrefTagName } = req.body;
    try {
        const category = await prefTagModel.create({ PrefTagName });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getPrefTag = async (req, res) => {
  const { PrefTagName } = req.query;

  try {
      const category = await prefTagModel.findOne({ PrefTagName: PrefTagName });
      res.status(200).json(category);
  } 
  catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const viewAllPrefTag = async (req, res) => {
  

  try {
      const category = await prefTagModel.find({});
      res.status(200).json(category);
  } 
  catch (error) {
      res.status(400).json({ error: error.message });
  }
};


const updatePreftag = async (req, res) => {
    const {PrefTagName, newPrefTagName }= req.body; // The current category name from the URL parameter
   // The new name to be updated, taken directly from the request body

    try {
        const category = await prefTagModel.findOneAndUpdate(
            { PrefTagName: PrefTagName }, // Find category by the current name
            { $set: { PrefTagName: newPrefTagName } }, // Update to the new name
            { new: true } // Return the updated document
        );

        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }

        res.status(200).json(category); // Return the updated category
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const deletePreftag = async (req, res) => {
    const {PrefTagName }= req.body;
    try {
        const category = await prefTagModel.findOneAndDelete({ PrefTagName });
        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }
        res.status(200).json({ msg: "Category deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
 




const viewProducts = async (req, res) => {
  try {
    const products = await productModel.find(); 
    res.json(products); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sortProductsByRatingAdmin = async (req, res) => {
    try {
      const products = await productModel.find({}).sort({ rating: -1 }); // -1 for descending order
      res.status(200).json(products);
    } catch (error) {
     
      res.status(500).json({ error: 'Server error' });
    }
    };
   

  const addTourismGov = async (req, res) => {
      const { Username, Password } = req.body;
    
      try {
          const existingTourismGov = await tourismGovModel.findOne({ Username });
          
          if (existingTourismGov) {
              return res.status(400).json({ error: "Username already exists" });
          }
    
          const tourismGov = await tourismGovModel.create({ Username, Password });
          res.status(200).json(tourismGov);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
    }
    
    const flagItinerary= async(req,res)=>{
      const id=req.params.id;
      try{
        await itineraryModel.findByIdAndUpdate(id,{FlagInappropriate: true});
      res.status(200).json({msg:" Itinerary is flagged"});
   }
   catch (error){
      res.status(400).json({error: error.message});
   }    
    }
    const flagTouristItinerary= async(req,res)=>{
      const id=req.params.id;
      try{
        await touristItineraryModel.findByIdAndUpdate(id,{FlagInappropriate: false});
      res.status(200).json({msg:" Tourist itinerary is flagged"});
   }
   catch (error){
      res.status(400).json({error: error.message});
   }    
    }
    const flagActivity= async(req,res)=>{
      const id=req.params.id;
      try{
        await activityModel.findByIdAndUpdate(id,{FlagInappropriate: false});
      res.status(200).json({msg:" Activity is flagged"});
   }
   catch (error){
      res.status(400).json({error: error.message});
   }    
    }
    const getallItineraries= async(req,res)=>{
      try{
        const itineraries = await itineraryModel.find(); 
        res.json(itineraries);
      }
      catch (error){
        res.status(400).json({error: error.message});
     }   
    }
    const getallActivities= async(req,res)=>{
      try{
        const activities = await activityModel.find(); 
        res.json(activities);
      }
      catch (error){
        res.status(400).json({error: error.message});
     }   
    }
    const getallTouristItineraries= async(req,res)=>{
      try{
        const touristItineraries = await touristItineraryModel.find(); 
        res.json(touristItineraries);
      }
      catch (error){
        res.status(400).json({error: error.message});
     }   
    }

    const changePasswordAdmin= async (req, res) => {
      const {Username, currentPassword, newPassword } = req.body;
    
      try {
        // Find the seller by Username
        const admin = await adminModel.findOne({ Username });
    
        if (!admin) {
          return res.status(404).json({ error: "Admin not found" });
        }
    
        // Compare current password directly (plain text comparison)
        if (currentPassword !== admin.Password) {
          return res.status(400).json({ error: "Current password is incorrect" });
        }
    
        // Update the seller's password (plain text)
        admin.Password = newPassword;
        await admin.save();
    
        res.status(200).json({ message: "Password changed successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error changing password" });
      }
    };
    
module.exports = {changePasswordAdmin,createAdmin ,createCategory, getCategory, updateCategory, deleteCategory,createProduct,getProduct,deleteAdvertiser,deleteSeller,deleteTourGuide,deleteTourismGov,deleteTourist
    ,createPrefTag,getPrefTag,updatePreftag,deletePreftag,viewProducts,sortProductsByRatingAdmin,AdminLogin,addTourismGov,tourismGovLogin,viewAllPrefTag,deleteAdmin,flagItinerary,flagTouristItinerary,flagActivity,getallItineraries,getallActivities,getallTouristItineraries
};