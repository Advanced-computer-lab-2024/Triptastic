const activitiesModel = require('../Models/Activities.js');
const { default: mongoose } = require('mongoose');
const activitiescategoryModel = require('../Models/Activitiescategory.js');
const advertiserModel = require('../Models/Advertiser.js');

const createActivity = async (req, res) => {
    const { Category,date,time,location,price,tags,specialDiscounts,bookingOpen,Advertiser } = req.body;

    try {
        // Find the category by name or by its _id
        const foundCategory = await activitiescategoryModel.findOne({ Name: Category }) ;

        if (!foundCategory) {
            return res.status(400).json({ error: 'Category not found' });
        }
        console.log(foundCategory);


        // Create a new activity
        const activity = await activitiesModel.create({Category: foundCategory.Name,date,time,location,price,tags,specialDiscounts,bookingOpen,Advertiser });
        res.status(200).json(activity);
        
        
    } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
// const createActivity = async (req, res) => {
//     const {Category,date,time,location,price,tags,specialDiscounts,bookingOpen,Advertiser} = req.body;
    
//     try {
//         const category = await activitiesModel.create({ Category,date,time,location,price,tags,specialDiscounts,bookingOpen,Advertiser });
//         res.status(200).json(category);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

const getActivity = async (req, res) => {
    const Category = req.body; // Use Name as a parameter to find the category
    try {
        if (Name) {
            const category = await activitiesModel.findOne({ Name });
            if (!category) {
                return res.status(404).json({ msg: "Category not found" });
            }
            res.status(200).json(category);
        } else {
            const categories = await activitiesModel.find();
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

const updateActivity = async (req, res) => {
    const {Name, newName }= req.body; // The current category name from the URL parameter
   // The new name to be updated, taken directly from the request body

    try {
        const category = await activitiesModel.findOneAndUpdate(
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
        const category = await activitiesModel.findOneAndDelete({ Name });
        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }
        res.status(200).json({ msg: "Category deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    createActivity,
    getActivity,
    updateActivity,
    deleteActivity,  
};
