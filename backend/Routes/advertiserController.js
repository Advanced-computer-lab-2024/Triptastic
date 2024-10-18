const advertiserModel = require('../Models/Advertiser.js');
const activitiescategoryModel = require('../Models/Activitiescategory.js');
const activitiesModel = require('../Models/Activities.js');
const PreferenceTagsModel = require('../Models/PreferenceTags.js');
const RequestModel = require('../Models/Request.js');
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
   const {Username}= req.query;
   
   try {
       const advertiser = await advertiserModel.findOne({ Username: Username }); 

           res.status(200).json(advertiser);
   } 
   catch (error) {
       res.status(400).json({ error:error.message }); 
   }
}

const updateAdvertiser = async(req,res) => {

    const {Username, Password,Email,Website_Link,Hotline,Company_Profile,Logo } = req.body; 
    try{
       const advertiser=await advertiserModel.findOneAndUpdate({Username: Username },{$set:{Email: Email,Password:Password,Website_Link:Website_Link,Hotline:Hotline,Company_Profile:Company_Profile,Logo:Logo}},{ new: true });
       res.status(200).json(advertiser);
    }
    catch{
       res.status(400).json({error:error.message})
  
    }
  }



const createActivity = async (req, res) => {
   const { Category,name,date,time,location,price,tags,rating,specialDiscounts,bookingOpen,Advertiser } = req.body;

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
        if(tags){
            const availableTags = await PreferenceTagsModel.find({}, { PrefTagName: 1 });
            const availableTagNames = availableTags.map(tag => tag.PrefTagName);
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
           const activity = await activitiesModel.create({Category: foundCategory.Name,name,date,time,location,price,tags,rating,specialDiscounts,bookingOpen,Advertiser:foundAdvertiser.Username });
           res.status(200).json(activity);
        }

        }
        else{
            const activity = await activitiesModel.create({Category: foundCategory.Name,name,date,time,location,price,tags,rating,specialDiscounts,bookingOpen,Advertiser:foundAdvertiser.Username });
            res.status(200).json(activity);
        }


        // Validate the provided tags against the available tags

       
   } catch (error) {
       console.error('Error creating activity:', error);
       res.status(500).json({ error: 'Server error' });
   }
};

const getActivity = async (req, res) => {
   const { Advertiser } = req.query; // Use Advertiser as a parameter to find the activities

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
const viewActivitydetails = async (req, res) => {
    const { Advertiser, name } = req.query; // Get both Advertiser and name from the request body
 
    try {
        // Find the activity for the given Advertiser and name
        const activity = await activitiesModel.findOne({ Advertiser: Advertiser, name: name });
        
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found for this advertiser and name' });
        }
 
        // Return the activity details
        res.status(200).json(activity);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const updateActivity = async (req, res) => {
    const {name,Advertiser}=req.query;
   const { Category,date,time,location,price,tags,rating,specialDiscounts,bookingOpen }= req.body; // The current category name from the URL parameter
  // The new name to be updated, taken directly from the request body

   try {
       const activity = await activitiesModel.findOneAndUpdate(
        { Advertiser: Advertiser, name: name }, // Find category by the current name
           { $set: { Category:Category,name:name,date:date,time:time,location:location,price:price,tags:tags,rating:rating,specialDiscounts:specialDiscounts,bookingOpen:bookingOpen  } }, // Update to the new name
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
 
const requestAccountDeletionAdvertiser = async (req, res) => {
    const { Username } = req.query; // Assuming the username is passed in the query or retrieved from the authenticated user

    try {
        // Check if the user has any upcoming activities or itineraries with paid bookings
        const now = new Date();
        
        const hasUpcomingActivities = await activitiesModel.findOne({
            Advertiser: Username,
            date: { $gte: now }, // Upcoming activities
            // 'bookings.status': 'paid' // Uncomment if you need to check for paid bookings
        });

        if (hasUpcomingActivities) {
            // Create a new deletion request with a rejected status
            const deleteRequest = new RequestModel({
                Username: Username,
                requestDate: new Date(),
                status: 'rejected' // Mark as rejected due to upcoming activities
            });

            // Save the request to the database
            await deleteRequest.save();

            return res.status(400).json({
                msg: "Your account deletion request has been rejected due to upcoming activities with paid bookings."
            });
        }

        // Check if the user has already made a request
        const existingRequest = await RequestModel.findOne({ Username, status: 'pending' });
        if (existingRequest) {
            return res.status(400).json({
                msg: "You already have a pending request for account deletion."
            });
        }

        // Create a new deletion request
        const deleteRequest = new RequestModel({
            Username: Username,
            requestDate: new Date(),
            status: 'pending' // Mark as pending by default
        });

        // Save the request to the database
        await deleteRequest.save();
         // Send success response
         res.status(200).json({
            msg: "Your request for account deletion has been submitted and is pending approval."
        });

       

    } catch (error) {
        // Handle any errors that occur during the request process
        res.status(500).json({ error: "Failed to submit deletion request" });
    }
};




 module.exports = {createAdvertiser,getAdvertiser,updateAdvertiser,createActivity,
   getActivity,
   updateActivity,
   deleteActivity,viewActivitydetails,requestAccountDeletionAdvertiser};