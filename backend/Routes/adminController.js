const adminModel = require('../Models/Admin.js');
const activitiescategoryModel = require('../Models/Activitiescategory.js');
const prefTagModel = require('../Models/PreferenceTags.js');
const productModel= require('../Models/Product.js');
const { default: mongoose } = require('mongoose');
const touristModel = require('../Models/Tourist');
const tourGuideModel = require('../Models/tourGuide');
const sellerModel = require('../models/Seller');
const advertiserModel = require('../models/Advertiser');
const tourismGovModel = require('../Models/tourismGov');



const createAdmin = async (req, res) => {
    const { Username, Password, Role } = req.body;

    try {
        const existingAdmin = await adminModel.findOne({ Username });
        
        if (existingAdmin) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const admin = await adminModel.create({ Username, Password, Role });
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
    const {Name} = req.body; // Use Name as a parameter to find the category
    try {
        if (Name) {
            const category = await activitiescategoryModel.findOne({ Name });
            if (!category) {
                return res.status(404).json({ msg: "Category not found" });
            }
            res.status(200).json(category);
        } else {
            const categories = await activitiescategoryModel.find();
            res.status(200).json(categories); // Return all categories if no Name is provided
        }
    } catch (error) {
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
    const { productName } = req.body;
  
    try {
      const product = await productModel.create({ productName });
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
 
  const getProduct = async (req, res) => {
    const {productName} = req.body; // Use Name as a parameter to find the category
    try {
        if (productName) {
            const Product = await productModel.findOne({ productName });
            if (!Product) {
                return res.status(404).json({ msg: "Product not found" });
            }
            res.status(200).json(Product);
        } else {
            const Products = await productModel.find();
            res.status(200).json(Products); // Return all categories if no Name is provided
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const deleteAdvertiser = async (req, res) => {
    try {
       const Advertiser = await advertiserModel.deleteOne({Username: req.params.Username}); 
       if (!Advertiser) {
          return res.status(404).json({ msg: "Advertiser not found" });
       }
       res.status(200).json({ msg: "Advertiser has been deleted successfully" });
    } catch (error) {
       res.status(400).json({ error:error.message });
    }
 }
 const deleteSeller = async (req, res) => {
    try {
       const seller = await sellerModel.deleteOne({Username: req.params.Username}); 
       if (!seller) {
          return res.status(404).json({ msg: "Seller not found" });
       }
       res.status(200).json({ msg: "Seller has been deleted successfully" });
    } catch (error) {
       res.status(400).json({ error: error.message });
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

const deleteTourismGov = async (req, res) => {
    try {
        const tourismGov = await tourismGovModel.deleteOne({ Username: req.params.Username }); 
        if (!tourismGov) {
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
    const {PrefTagName} = req.body; // Use Name as a parameter to find the category
    try {
        if (PrefTagName) {
            const category = await prefTagModel.findOne({ PrefTagName });
            if (!category) {
                return res.status(404).json({ msg: "Category not found" });
            }
            res.status(200).json(category);
        } else {
            const categories = await prefTagModel.find();
            res.status(200).json(categories); // Return all categories if no Name is provided
        }
    } catch (error) {
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





module.exports = {createAdmin ,createCategory, getCategory, updateCategory, deleteCategory,createProduct,getProduct,deleteAdvertiser,deleteSeller,deleteTourGuide,deleteTourismGov,deleteTourist
    ,createPrefTag,getPrefTag,updatePreftag,deletePreftag,viewProducts,sortProductsByRatingAdmin
};