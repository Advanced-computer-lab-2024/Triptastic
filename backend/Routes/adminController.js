const adminModel = require('../Models/Admin.js');

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
const createActivity = async (req, res) => {
    const { Name } = req.body;
    try {
        const category = await adminModel.create({ Name });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getActivity = async (req, res) => {
    const Name = req.body; // Use Name as a parameter to find the category
    try {
        if (Name) {
            const category = await adminModel.findOne({ Name });
            if (!category) {
                return res.status(404).json({ msg: "Category not found" });
            }
            res.status(200).json(category);
        } else {
            const categories = await adminModel.find();
            res.status(200).json(categories); // Return all categories if no Name is provided
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const updateActivity = async (req, res) => {
    const {Name, newName }= req.body; // The current category name from the URL parameter
   // The new name to be updated, taken directly from the request body

    try {
        const category = await adminModel.findOneAndUpdate(
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



const deleteActivity = async (req, res) => {
    const {Name }= req.body;
    try {
        const category = await adminModel.findOneAndDelete({ Name });
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
        const category = await adminModel.create({ PrefTagName });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




module.exports = {createAdmin ,createActivity, getActivity, updateActivity, deleteActivity,createPrefTag};