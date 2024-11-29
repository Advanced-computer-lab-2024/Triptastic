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
const complaintsModel=require('../Models/Complaint.js');
const requestModel=require('../Models/Request.js');
const nodemailer = require('nodemailer');
const PromoCode = require('../Models/PromoCode'); // Adjust the path as necessary


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "malook25062003@gmail.com", 
    pass: "sxvo feuu woie gpfn",   
  },
});
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
    const { Username, Password ,Email} = req.body;

    try {
        const existingAdmin = await adminModel.findOne({ Username });
        
        if (existingAdmin) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const admin = await adminModel.create({ Username, Password ,Email});
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
  const { Username } = req.query; // Extract seller's username from query

  if (!Username) {
    return res.status(400).json({ error: 'Username is required in the query.' });
  }

  const { productName, description, price, rating, review, stock } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    // Create the product with the seller's username
    const product = await productModel.create({
      productName,
      description,
      price,
      rating,
      seller: Username, // Use the Username as the seller
      review,
      stock,
      image,
    });

    res.status(201).json(product); // Return the created product
  } catch (error) {
    res.status(400).json({ error: error.message }); // Handle errors
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
const unarchiveProduct = async (req, res) => {
  const { productName } = req.params;

  try {
    // Find the product by name and set its archived status to false
    const updatedProduct = await productModel.findOneAndUpdate(
      { productName: productName },
      { archived: false },
      { new: true }
    );

    if (updatedProduct) {
      res.status(200).json({ message: 'Product unarchived successfully', product: updatedProduct });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to unarchive product', details: error.message });
  }
};


const archiveProduct = async (req, res) => {
  const { productName } = req.params; // Assuming productName is sent in the request body

  try {
    // Find the product by name and set its archived status to true
    const updatedProduct = await productModel.findOneAndUpdate(
      { productName: productName },
      { archived: true },
      { new: true } // Return the updated document
    );

    if (updatedProduct) {
      res.status(200).json({ message: 'Product archived successfully', product: updatedProduct });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive product', details: error.message });
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
    // Find products where archived is false
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
        const itinerary = await itineraryModel.findById(id);
        await itineraryModel.findByIdAndUpdate(id,{FlagInappropriate: true});
        const tourGuide = await tourGuideModel.findOne({ Username: itinerary.TourGuide });
        tourGuide.flaggedItineraries.push(itinerary._id);
        await tourGuide.save();

        const email= tourGuide.Email;
        const mailOptions = {
          from: "malook25062003@gmail.com",  
          to: email,  
          subject: 'Flagged itinerary',  // Subject line
          text: 'Hello, one of your itineraries have been flagged',  // Plain text body
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log('Error sending email:', error);
          }
          console.log('Email sent:', info.response);
        });
        
        
      res.status(200).json({msg:" Itinerary is flagged"});
   }
   catch (error){
      res.status(400).json({error: error.message});
   }    
    }
    const flagTouristItinerary= async(req,res)=>{
      const id=req.params.id;
      try{
        await touristItineraryModel.findByIdAndUpdate(id,{FlagInappropriate: true});
      res.status(200).json({msg:" Tourist itinerary is flagged"});
   }
   catch (error){
      res.status(400).json({error: error.message});
   }    
    }
    const flagActivity= async(req,res)=>{
      const id=req.params.id;
      try{
        const activity = await activityModel.findById(id);
        const advertiser=await advertiserModel.findOne({Username :activity.Advertiser});
        await activityModel.findByIdAndUpdate(id,{FlagInappropriate: true});
        advertiser.flaggedActivities.push(activity._id);
        await advertiser.save();
        const email= advertiser.Email;
        const mailOptions = {
          from: "malook25062003@gmail.com",  
          to: email,  
          subject: 'Flagged activity',  // Subject line
          text: 'Hello, one of your activities have been flagged',  // Plain text body
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log('Error sending email:', error);
          }
          console.log('Email sent:', info.response);
        });
        

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

    const changePasswordAdmin = async (req, res) => { 
      const { Username, Email, currentPassword, newPassword } = req.body;
    
      try {
        // Find the admin by Username and Email
        const admin = await adminModel.findOne({ Username, Email });
    
        if (!admin) {
          return res.status(404).json({ error: "Admin with the provided Username and Email not found" });
        }
    
        // Compare current password directly (plain text comparison)
        if (currentPassword !== admin.Password) {
          return res.status(400).json({ error: "Current password is incorrect" });
        }
    
        // Update the admin's password (plain text)
        admin.Password = newPassword;
        await admin.save();
    
        res.status(200).json({ message: "Password changed successfully" });
      } catch (error) {
        console.error('Error during password change:', error); // Log the error for debugging
        res.status(500).json({ error: error.message || "Error changing password" });
      }
    };
    

    const getComplaints=async(req,res)=>{
      try{
        const { sortOrder, filterStatus } = req.query;
  
        let filterQuery = {};
        if (filterStatus && filterStatus !== 'all') {
          filterQuery.status = filterStatus;
        }
      
        let sortQuery = {};
        if (sortOrder) {
          sortQuery.date = sortOrder === 'asc' ? 1 : -1;
        }
      
        const data = await complaintsModel.find(filterQuery).sort(sortQuery);
        res.json(data);
      }
      catch (error){
        res.status(400).json({error: error.message});
     }  

    }

    const getComplaintDetails = async (req, res) => {
      const { id } = req.params;
    
      try {
        // Trim the ID to remove any extra newline or whitespace characters
        const trimmedId = id.trim();
        const complaint = await complaintsModel.findById(trimmedId);
    
        if (!complaint) {
          return res.status(404).json({ error: "Complaint not found" });
        }
    
        res.status(200).json(complaint);
      } catch (error) {
        console.error("Error retrieving complaint details:", error.message);
        res.status(500).json({ error: "Error retrieving complaint details" });
      }
    };

    const updateComplaintStatus = async (req, res) => {
      const { id } = req.params; // Get the complaint ID from URL parameters
      const { status } = req.body; // Get the desired status from the request body
    
      // Check that the status is either 'pending' or 'resolved'
      if (status !== 'pending' && status !== 'resolved') {
        return res.status(400).json({ error: 'Status must be either "pending" or "resolved"' });
      }
    
      try {
        // Find the complaint by ID and update its status
        const updatedComplaint = await complaintsModel.findByIdAndUpdate(
          id.trim(),
          { status },
          { new: true }
        );
    
        // If no complaint was found, return a 404 error
        if (!updatedComplaint) {
          return res.status(404).json({ error: 'Complaint not found' });
        }
    
        // Return the updated complaint
        res.status(200).json({ message: 'Complaint status updated successfully', updatedComplaint });
      } catch (error) {
        console.error('Error updating complaint status:', error.message);
        res.status(500).json({ error: 'Error updating complaint status' });
      }
    };
    const replyToComplaint = async (req, res) => {
      const { id } = req.params; // Complaint ID from URL parameters
      const { content, replier } = req.body; // Reply content and the user replying
    
      if (!content || !replier) {
        return res.status(400).json({ error: 'Reply content and replier name are required' });
      }
    
      try {
        const updatedComplaint = await complaintsModel.findByIdAndUpdate(
          id.trim(),
          {
            $push: {
              replies: {
                content,
                replier,
              },
            },
          },
          { new: true }
        );
    
        if (!updatedComplaint) {
          return res.status(404).json({ error: 'Complaint not found' });
        }
    
        res.status(200).json({ message: 'Reply added successfully', updatedComplaint });
      } catch (error) {
        console.error('Error replying to complaint:', error.message);
        res.status(500).json({ error: 'Error replying to complaint' });
      }
    };
    
   // Route to get all pending deletion requests
const getPendingDeletionRequests = async (req, res) => {
  try {
    const requests = await requestModel.find({ Status: 'pending' });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending deletion requests" });
  }
}; 
// Route for admin to accept a deletion request
const acceptDeletionRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    // Find the deletion request by ID
    const deleteRequest = await requestModel.findById(requestId);
    if (!deleteRequest) {
      return res.status(404).json({ message: "Deletion request not found" });
    }

    const { Username } = deleteRequest;

    // Check each model for a user match
    let userModel = null;
    let userRole = null;

    const advertiser = await advertiserModel.findOne({ Username });
    const seller = await sellerModel.findOne({ Username });
    const tourGuide = await tourGuideModel.findOne({ Username });
    const tourist = await touristModel.findOne({ Username });

    if (advertiser) {
      userModel = advertiserModel;
      userRole = "Advertiser";
      // Delete associated activities
      await activityModel.deleteMany({ Advertiser: Username });
    } else if (seller) {
      userModel = sellerModel;
      userRole = "Seller";
      // Delete any seller-specific data if applicable
    } else if (tourGuide) {
      userModel = tourGuideModel;
      userRole = "TourGuide";
      // Delete associated itineraries
      await itineraryModel.deleteMany({ TourGuide: Username });
    } else if (tourist) {
      userModel = touristModel;
      userRole = "Tourist";
      // Delete any tourist-specific data if needed (e.g., bookings)
    } else {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user account
     await userModel.deleteOne({ Username });

    // Update the request status to 'approved' and save it
    deleteRequest.Status = 'approved';
    await deleteRequest.save();

    res.status(200).json({ message: `${userRole} account and associated data successfully deleted` });
  } catch (error) {
    console.error("Error processing deletion request:", error);
    res.status(500).json({ error: "Failed to process deletion request" });
  }
};

const rejectDeletionRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    // Find the deletion request by ID
    const deleteRequest = await requestModel.findById(requestId);
    if (!deleteRequest) {
      return res.status(404).json({ message: "Deletion request not found" });
    }

    // Update the request status to 'rejected'
    deleteRequest.Status = 'rejected';
    await deleteRequest.save();

    res.status(200).json({ message: "Deletion request rejected" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject deletion request" });
  }
};
//DD 
const getUserStatistics = async (req, res) => {
  try {
    const allModels = [touristModel,sellerModel, advertiserModel, tourGuideModel,tourismGovModel];
    const currentYear = new Date().getFullYear();

    const statistics = { totalUsers: 0, monthlyUsers: {} };

    for (const model of allModels) {
      const users = await model.find({});
      statistics.totalUsers += users.length;

      users.forEach(user => {
        const createdAt = new Date(user.createdAt);
        if (createdAt.getFullYear() === currentYear) {
          const month = createdAt.toLocaleString('default', { month: 'long' });

          if (!statistics.monthlyUsers[month]) {
            statistics.monthlyUsers[month] = 0;
          }
          statistics.monthlyUsers[month] += 1;
        }
      });
    }

    res.status(200).json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user statistics' });
  }
};

const createPromoCode = async (req, res) => {
  const { code, discount, isPercentage, expirationDate, maxUsage } = req.body;

  try {
    // Check if the code already exists
    const existingCode = await PromoCode.findOne({ code });
    if (existingCode) {
      return res.status(400).json({ error: 'Promo code already exists' });
    }

    // Create the promo code
    const promoCode = await PromoCode.create({
      code,
      discount,
      isPercentage,
      expirationDate,
      maxUsage,
    });

    res.status(201).json({ message: 'Promo code created successfully', promoCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json(promoCodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {getPromoCodes,createPromoCode,getUserStatistics,replyToComplaint,getPendingDeletionRequests,acceptDeletionRequest,rejectDeletionRequest,updateComplaintStatus,getComplaintDetails,changePasswordAdmin,createAdmin ,createCategory, getCategory, updateCategory, deleteCategory,createProduct,getProduct,deleteAdvertiser,deleteSeller,deleteTourGuide,deleteTourismGov,deleteTourist
    ,createPrefTag,getPrefTag,updatePreftag,deletePreftag,viewProducts,sortProductsByRatingAdmin,AdminLogin,addTourismGov,tourismGovLogin,viewAllPrefTag,deleteAdmin
    ,flagItinerary,flagTouristItinerary,flagActivity,getallItineraries,getallActivities,getallTouristItineraries,getComplaints,archiveProduct,unarchiveProduct};