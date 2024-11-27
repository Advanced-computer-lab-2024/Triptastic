
const sellerModel = require('../Models/Seller.js');
const requestModel= require('../Models/Request.js');
const productModel= require('../Models/Product.js');
const adminModel = require('../Models/Admin.js');
const notificationModel = require('../Models/Notification.js');

const cartModel = require('../Models/Cart.js'); // Import the Cart model
const { default: mongoose } = require('mongoose');
const nodemailer = require('nodemailer'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createSeller = async (req, res) => {
  const { Username, Email, Password } = req.body;
  const idDocument = req.files?.Id?.[0]?.path || null;
  const taxationRegistryCard = req.files?.TaxationRegistryCard?.[0]?.path || null;

  try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Create the seller
      const seller = await sellerModel.create({
          Username,
          Email,
          Password: hashedPassword,
          Id: idDocument,
          TaxationRegistryCard: taxationRegistryCard,
      });

      res.status(201).json({
          message: 'Seller registered successfully',
          seller,
      });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};
const loginSeller = async (req, res) => {
  const { Email, Password } = req.body;

  try {
      // Find the seller by email
      const seller = await sellerModel.findOne({ Email });
      if (!seller) {
          return res.status(404).json({ error: 'Seller not found' });
      }

      // Validate the password
      const isPasswordValid = await bcrypt.compare(Password, seller.Password);
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign(
          { id: seller._id, Email: seller.Email },
          'mydevsecretkey', // Replace with a secure environment variable in production
          { expiresIn: '1h' }
      );

      res.status(200).json({
          message: 'Login successful',
          token,
          user: {
              id: seller._id,
              Username: seller.Username,
              Email: seller.Email,
              docsApproved: seller.docsApproved,
              TaxationRegistryCard: seller.TaxationRegistryCard,
              Id: seller.Id,
              Name: seller.Name,
              Description: seller.Description,
          },
      });
  } catch (error) {
      res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};


 const updateSeller = async(req,res) => {

  const{Username,Email,Password,Name,Description}=req.body;
  const Logo = req.file ? req.file.path : null;  
  
  try{
     const seller=await sellerModel.findOneAndUpdate(
      {Username },
      {$set:{Email,Password,Name,Description,...(Logo && { Logo }) }  },{ new: true });
     res.status(200).json(seller);
  }
  catch{
     res.status(400).json({error:error.message})

  }
}

 const getSeller= async(req,res) =>{
    const {Username}= req.query;
    
    try {
        const seller = await sellerModel.findOne({ Username: Username }); 

            res.status(200).json(seller);
    } 
    catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 }

 const createProductseller = async (req, res) => {
  const { productName,description,price,rating,seller,review,stock } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    const product = await productModel.create({ productName,description,price,rating,seller,review,stock,image });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProductSeller = async (req, res) => {
  const { productName } = req.query;

  try {
      const product = await productModel.findOne({ productName: productName });
      res.status(200).json(product);
  } 
  catch (error) {
      res.status(400).json({ error: error.message });
  }
};


const viewProductsSeller = async (req, res) => {
   try {
     const products = await productModel.find(); 
     res.json(products); 
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 };
 
 const sortProductsByRatingSeller = async (req, res) => {
   try {
     const products = await productModel.find({}).sort({ rating: -1 }); // -1 for descending order
     res.status(200).json(products);
   } catch (error) {
     
     res.status(500).json({ error: 'Server error' });
   }
   };

   const requestAccountDeletionSeller = async (req, res) => {
    const { Username } = req.query; 

    try {
       
         // Check if the user has already made a request
         const existingRequest = await requestModel.findOne({ Username, status: 'pending' });
         if (existingRequest) {
             return res.status(400).json({
                 msg: "You already have a pending request for account deletion."
             });
         }
        

        // Create a new deletion request
        const deleteRequest = new requestModel({
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

// Function to change seller's password

const changePasswordSeller = async (req, res) => {
  const { Username, currentPassword, newPassword } = req.body;

  try {
    // Find the seller by Username
    const seller = await sellerModel.findOne({ Username });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Compare current password directly (plain text comparison)
    if (currentPassword !== seller.Password) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Update the seller's password (plain text)
    seller.Password = newPassword;
    await seller.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error changing password" });
  }
};
const getPendingSellers=async(req,res)=>{
  try{
     const x=await sellerModel.find({docsApproved: 'pending'});
     res.status(200).json(x);
  }
  catch(error){
     res.status(400).json({error: error.message});
  }
};
const settleDocsSeller = async (req, res) => {
  const { Username }= req.query; 
  const { docsApproved }= req.body; 

  try {
      
      const seller = await sellerModel.findOneAndUpdate(
          { Username },
          { $set: { docsApproved } },
          { new: true }
      );

      if (!seller) {
          return res.status(404).json({ error: 'Seller not found' });
      }

      res.status(200).json(seller);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};
const incrementProductSales = async (req, res) => {
  const { productName } = req.body;

  try {
    const product = await productModel.findOneAndUpdate(
      { productName },
      { $inc: { sales: 1 } }, // Increment the sales count by 1
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Sales updated successfully', product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product sales' });
  }
};
const viewProductSales = async (req, res) => {
  const { productName } = req.query; // Optional query parameter

  try {
    if (productName) {
      const product = await productModel.findOne({ productName });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json({ productName: product.productName, sales: product.sales });
    } else {
      const products = await productModel.find({}, { productName: 1, sales: 1 });
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve product sales' });
  }
};






const storeNotification = async (notification) => {
  try {
    // Check if the notification already exists
    const existingNotification = await notificationModel.findOne({
      user: notification.user,
      type: notification.type,
      message: notification.message,
    });

    if (existingNotification) {
      console.log(`Notification already exists for user: ${notification.user}`);
      return; // Do not store a duplicate notification
    }

    // Store the new notification if it does not exist
    const newNotification = new notificationModel({
      user: notification.user,
      type: notification.type,
      message: notification.message,
      date: new Date(),
    });

    await newNotification.save();
    console.log(`Notification stored for user: ${notification.user}`);
  } catch (error) {
    console.error('Error storing notification:', error);
  }
};


const getNotificationsForSeller = async (req, res) => {
  try {
    const { Username  } = req.query;  // Assume sellerUsername is passed in the request

    // Fetch the notifications for the seller, sorted by creation date
    const notifications = await notificationModel.find({ user: Username ,type:'seller'}).sort({ createdAt: -1 });

    if (!notifications || notifications.length === 0) {
      return res.status(200).json({ message: 'No notifications found for the seller.' });
    }

    res.status(200).json({
      message: 'Notifications fetched successfully.',
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'An error occurred while fetching notifications.', error });
  }
};
const getNotificationsForAdmin = async (req, res) => {
  try {
    const { Username  } = req.query;  // Assume sellerUsername is passed in the request

    // Fetch the notifications for the seller, sorted by creation date
    const notifications = await notificationModel.find({ user: Username ,type:'admin'}).sort({ createdAt: -1 });

    if (!notifications || notifications.length === 0) {
      return res.status(200).json({ message: 'No notifications found for the admin.' });
    }

    res.status(200).json({
      message: 'Notifications fetched successfully.',
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'An error occurred while fetching notifications.', error });
  }
};



const checkAndNotifyOutOfStockSeller = async (req, res) => {
  try {
    // Find out-of-stock products where notification has not been sent
    const outOfStockProducts = await productModel.find({ stock: 0, notificationSent: { $ne: true } });

    if (outOfStockProducts.length === 0) {
      return res.status(200).json({ message: 'No out-of-stock products found or notifications already sent.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'malook25062003@gmail.com',
        pass: 'sxvo feuu woie gpfn',
      },
    });

    const notifications = [];

    for (const product of outOfStockProducts) {
      console.log(`Querying seller with Username: ${product.seller}`);
      const seller = await sellerModel.findOne({ Username: product.seller });
      console.log(`Result for ${product.seller}:`, seller);

      if (!seller) {
        console.error(`Seller not found for product: ${product.productName}`);
        continue;
      }

      const sellerEmail = seller.Email;
      console.log(`Sending email to seller: ${sellerEmail}`);

      // Prepare notification object
      const sellerNotification = {
        user: seller.Username,
        type: 'seller',
        message: `Your product "${product.productName}" is out of stock.`,
      };

      try {
        // Store the notification (only if not already sent)
        await storeNotification(sellerNotification);

        // Send email to seller
        const sellerMailOptions = {
          from: 'malook25062003@gmail.com',
          to: sellerEmail,
          subject: `Product Out of Stock: ${product.productName}`,
          text: `Dear ${product.seller},\n\nYour product "${product.productName}" is out of stock.\n\nThank you!`,
        };

        await transporter.sendMail(sellerMailOptions);
        console.log(`Email sent to ${sellerEmail}`);

        // Mark the product notification as sent
        await productModel.updateOne({ _id: product._id }, { $set: { notificationSent: true } });

        notifications.push({ productName: product.productName, sellerEmail });
      } catch (error) {
        console.error(`Error processing notification for product: ${product.productName}`, error);
      }
    }

    res.status(200).json({
      message: 'Out-of-stock notifications sent successfully.',
      notifications,
    });
  } catch (error) {
    console.error('Error in notifying out-of-stock products:', error);
    res.status(500).json({ message: 'An error occurred while sending notifications.', error });
  }
};




const checkAndNotifyOutOfStockAdmin = async (req, res) => {
  try {
    const { Username } = req.query;

    // Fetch out-of-stock products created by the admin where notification hasn't been sent
    const outOfStockProducts = await productModel.find({
      stock: 0,
      notificationSent: { $ne: true },
      seller: Username, // Filter products by the admin who created them
    });

    console.log(`Out-of-stock products for admin (${Username}):`, outOfStockProducts);

    if (outOfStockProducts.length === 0) {
      return res.status(200).json({ message: 'No out-of-stock products found for this admin.' });
    }

    // Fetch the admin's email (optional)
    const admin = await adminModel.findOne({ Username }, 'Email');
    const adminEmail = admin?.Email;

    // Prepare notification messages
    const notifications = [];
    const outOfStockProductsList = [];

    for (const product of outOfStockProducts) {
      const adminNotification = {
        user: Username,
        type: 'admin',
        message: `Your product "${product.productName}" is out of stock.`,
      };

      // Store notifications
      await storeNotification(adminNotification);
      outOfStockProductsList.push(`- ${product.productName}`);
    }

    // Send an email if the admin has an email
    if (adminEmail && outOfStockProductsList.length > 0) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'malook25062003@gmail.com',
          pass: 'sxvo feuu woie gpfn',
        },
      });

      const adminMailOptions = {
        from: 'malook25062003@gmail.com',
        to: adminEmail,
        subject: 'Your Out-of-Stock Products Notification',
        text: `Dear Admin,\n\nThe following products you created are out of stock:\n${outOfStockProductsList.join(
          '\n'
        )}\n\nThank you!`,
      };

      try {
        await transporter.sendMail(adminMailOptions);
        console.log(`Email sent to admin (${adminEmail}):`, outOfStockProductsList);

        // Mark all products as notified
        await productModel.updateMany(
          { _id: { $in: outOfStockProducts.map((p) => p._id) } },
          { $set: { notificationSent: true } }
        );

        notifications.push({
          message: 'Out-of-stock notifications sent to admin.',
          products: outOfStockProductsList,
        });
      } catch (emailError) {
        console.error('Failed to send email to admin:', emailError);
      }
    } else if (!adminEmail) {
      console.log('Admin does not have an email. Skipping email notification.');
      // Mark all products as notified
      await productModel.updateMany(
        { _id: { $in: outOfStockProducts.map((p) => p._id) } },
        { $set: { notificationSent: true } }
      );

      notifications.push({
        message: 'Out-of-stock notifications stored for admin without email.',
        products: outOfStockProductsList,
      });
    }

    res.status(200).json({
      message: 'Out-of-stock notifications processed successfully.',
      notifications,
    });
  } catch (error) {
    console.error('Error in notifying out-of-stock products:', error);
    res.status(500).json({ message: 'An error occurred while sending notifications.', error });
  }
};






const deleteAllNotifications = async () => {
  try {
    const result = await notificationModel.deleteMany({}); // Deletes all documents in the collection
    console.log(`Deleted ${result.deletedCount} notifications successfully.`);
    return { success: true, message: `Deleted ${result.deletedCount} notifications.` };
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return { success: false, message: 'Failed to delete notifications.', error };
  }
};





 module.exports = {deleteAllNotifications,getNotificationsForAdmin,checkAndNotifyOutOfStockAdmin,getNotificationsForSeller,checkAndNotifyOutOfStockSeller,incrementProductSales,viewProductSales ,changePasswordSeller,createSeller,updateSeller,getSeller,createProductseller,getProductSeller,viewProductsSeller,sortProductsByRatingSeller,requestAccountDeletionSeller,getPendingSellers,settleDocsSeller,loginSeller};