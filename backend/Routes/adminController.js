const adminModel = require('../models/Admin.js');
const activitiescategoryModel = require('../models/Activitiescategory.js');
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
    const Name = req.body; // Use Name as a parameter to find the category
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

// const updateActivity = async (req, res) => {
//     const {Name}= req.body;
//     const {update} = req.body;
//     try {
//         const category = await activitiesModel.findOneAndUpdate({ Name }, { $set: update }, { new: true });
//         if (!category) {
//             return res.status(404).json({ msg: "Category not found" });
//         }
//         res.status(200).json(category);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

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




module.exports = {createAdmin ,createCategory, getCategory, updateCategory, deleteCategory};