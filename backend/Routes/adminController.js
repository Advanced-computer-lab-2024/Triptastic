const adminModel = require('../models/Admin.js');
const activitiescategoryModel = require('../models/Activitiescategory.js');
const prefTagModel = require('../models/PreferenceTags.js');
const productModel= require('../models/Product.js');

const { default: mongoose } = require('mongoose');

const createAdmin = async (req, res) => {
    
    const { Username, Password, Role } = req.body;
    try {
        const admin = await adminModel.create({ Username, Password, Role });
        res.status(200).json(admin);
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









module.exports = {createAdmin ,createCategory, getCategory, updateCategory, deleteCategory,createPrefTag,getPrefTag,updatePreftag,deletePreftag,createProduct
    ,getProduct
};