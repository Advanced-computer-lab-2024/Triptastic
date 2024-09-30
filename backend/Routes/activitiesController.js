const activitiesModel = require('../Models/Activities.js');
const { default: mongoose } = require('mongoose');
const activitiescategoryModel = require('../Models/Activitiescategory.js');
const advertiserModel = require('../Models/Advertiser.js');

const createActivity = async (req, res) => {
    const { Category,date,time,location,price,tags,specialDiscounts,bookingOpen,Advertiser } = req.body;

    try {
        // Find the category by name or by its _id
        const foundCategory = await activitiescategoryModel.findOne({ Name: Category }) ;
        const foundAdvertiser = await advertiserModel.findOne({ Username: Advertiser })

        if (!foundCategory||!foundAdvertiser) {
            return res.status(400).json({ error: 'Category not found or advertiser not found' });
        }
        console.log(foundCategory);
        console.log('Found Advertiser:', foundAdvertiser);

        // Create a new activity
        const activity = await activitiesModel.create({Category: foundCategory.Name,date,time,location,price,tags,specialDiscounts,bookingOpen,Advertiser:foundAdvertiser.Username });
        res.status(200).json(activity);
        
        
    } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getActivity = async (req, res) => {
    const { Advertiser } = req.body; // Use Advertiser as a parameter to find the activities

    try {
        // Find all activities for the given Advertiser
        const activities = await activitiesModel.find({ Advertiser: Advertiser });

        if (!activities.length) {
            return res.status(404).json({ message: 'No activities found for this advertiser' });
        }

        res.status(200).json(activities);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const updateActivity = async (req, res) => {
    const { Category,date,time,location,price,tags,specialDiscounts,bookingOpen,Advertiser }= req.body; // The current category name from the URL parameter
   // The new name to be updated, taken directly from the request body

    try {
        const activity = await activitiesModel.findOneAndUpdate(
            { Advertiser:Advertiser }, // Find category by the current name
            { $set: { Category:Category,date:date,time:time,location:location,price:price,tags:tags,specialDiscounts:specialDiscounts,bookingOpen:bookingOpen  } }, // Update to the new name
            { new: true } // Return the updated document
        );

      

        res.status(200).json(activity); // Return the updated category
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const deleteActivity = async (req, res) => {
    const {Advertiser}= req.body;
    try {
        const activity = await activitiesModel.findOneAndDelete({ Advertiser });
       
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
