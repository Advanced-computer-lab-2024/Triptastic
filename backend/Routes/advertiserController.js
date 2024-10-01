const advertiserModel = require('../Models/Advertiser.js');
const activitiescategoryModel = require('../Models/Activitiescategory.js');
const activitiesModel = require('../Models/Activities.js');
const PreferenceTagsModel = require('../Models/PreferenceTags.js');
const { default: mongoose } = require('mongoose');
const createAdvertiser = async(req,res) => {

    const{Username,Email,Password}=req.body;
    try{
       const advertiser=await advertiserModel.create({Username,Email,Password});
       res.status(200).json(advertiser);
    }
    catch{
       res.status(400).json({error:error.message})
 
    }
 }



const getAdvertiser= async(req,res) =>{
   const {Username}= req.body;
   
   try {
       const advertiser = await advertiserModel.findOne({ Username: Username }); 

           res.status(200).json(advertiser);
   } 
   catch (error) {
       res.status(400).json({ error:error.message }); 
   }
}


const updateAdvertiser = async(req,res) => {

   const{Username,website_Link,Hotline,Company_Profile}=req.body;
   try{
      const advertiser=await advertiserModel.findOneAndUpdate({Username: Username },{$set:{website_Link:website_Link,Hotline:Hotline,Company_Profile:Company_Profile}},{ new: true });
      res.status(200).json(advertiser);
   }
   catch{
      res.status(400).json({error:error.message})

   }
}
const createActivity = async (req, res) => {
   const { Category,name,date,time,location,minPrice,maxPrice,tags,rating,specialDiscounts,bookingOpen,Advertiser } = req.body;

   try {
       // Find the category by name or by its _id
       const foundCategory = await activitiescategoryModel.findOne({ Name: Category }) ;
       const foundAdvertiser = await advertiserModel.findOne({ Username: Advertiser })

       if (!foundCategory||!foundAdvertiser) {
           return res.status(400).json({ error: 'Category not found or advertiser not found' });
       }
       console.log(foundCategory);
       console.log('Found Advertiser:', foundAdvertiser);
       
        // Get all available preference tags
        const availableTags = await PreferenceTagsModel.find({}, { PrefTagName: 1 });
        const availableTagNames = availableTags.map(tag => tag.PrefTagName);

        // Validate the provided tags against the available tags
        const validTags = tags.filter(tag => availableTagNames.includes(tag));
        const invalidTags = tags.filter(tag => !availableTagNames.includes(tag));

        // If there are invalid tags, return an error message along with available tags
        if (invalidTags.length > 0) {
            return res.status(400).json({
                error: `The following tags are invalid: ${invalidTags.join(', ')}`,
                availableTags: availableTagNames
            });
        }else{

       // Create a new activity
       const activity = await activitiesModel.create({Category: foundCategory.Name,name,date,time,location,minPrice,maxPrice,tags,rating,specialDiscounts,bookingOpen,Advertiser:foundAdvertiser.Username });
       res.status(200).json(activity);
    }
       
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
   const { Category,name,date,time,location,minPrice,maxPrice,tags,rating,specialDiscounts,bookingOpen,Advertiser }= req.body; // The current category name from the URL parameter
  // The new name to be updated, taken directly from the request body

   try {
       const activity = await activitiesModel.findOneAndUpdate(
           { Advertiser:Advertiser }, // Find category by the current name
           { $set: { Category:Category,name:name,date:date,time:time,location:location,minPrice:minPrice,maxPrice:maxPrice,tags:tags,rating:rating,specialDiscounts:specialDiscounts,bookingOpen:bookingOpen  } }, // Update to the new name
           { new: true } // Return the updated document
       );

     

       res.status(200).json(activity); // Return the updated category
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};



const deleteActivity = async (req, res) => {
   const {Advertiser,name}= req.body;
   try {
       const activity = await activitiesModel.findOneAndDelete({ Advertiser:Advertiser,name:name });
      
       res.status(200).json({ msg: "activity deleted successfully" });
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};



 module.exports = {createAdvertiser,getAdvertiser,updateAdvertiser,createActivity,
   getActivity,
   updateActivity,
   deleteActivity,};