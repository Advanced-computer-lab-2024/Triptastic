
const sellerModel = require('../Models/Seller.js');
const requestModel= require('../Models/Request.js');
const productModel= require('../Models/Product.js');
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
  const { Username } = req.query; 
  const { docsApproved } = req.body; 

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






const checkAndNotifyOutOfStock = async (req, res) => {
  try {
    // Fetch all products with stock === 0
    const outOfStockProducts = await productModel.find({ stock: 0 });

    console.log('Out-of-stock products:', outOfStockProducts);  // Check if products are retrieved

    if (outOfStockProducts.length === 0) {
      console.log('No out-of-stock products found.');
      return res.status(200).json({ message: 'No out-of-stock products found.' });
    }

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'malook25062003@gmail.com',  // Your email
        pass: 'sxvo feuu woie gpfn',       // Your app-specific password
      },
    });

    const notifications = []; // Array to track emails sent

    // Loop through the products and notify each seller
    for (const product of outOfStockProducts) {
      console.log(`Processing product: ${product.productName}, seller: ${product.seller}`);

      // Find the seller by username
      const seller = await sellerModel.findOne({ Username: product.seller });
      console.log(`Found seller: ${seller ? seller.email : 'Not found'}`);  // Log seller email

      if (!seller) {
        console.error(`No seller found for product: ${product.productName}, seller: ${product.seller}`);
        continue;  // Skip to the next product if no seller is found
      }

      const sellerEmail = seller.email;
      console.log(`Sending email to seller: ${sellerEmail}`);

      // Email options for the seller
      const sellerMailOptions = {
        from: 'malook25062003@gmail.com',
        to: sellerEmail,
        subject: `Product Out of Stock: ${product.productName}`,
        text: `Dear ${product.seller},\n\nYour product "${product.productName}" is out of stock.\n\nThank you!`,
      };

      try {
        console.log('Mail options:', sellerMailOptions);  // Log mail options for debugging
        // Send email to the seller
        await transporter.sendMail(sellerMailOptions);
        console.log(`Email sent to ${sellerEmail}`);

        // Add the email notification to the notifications array
        notifications.push({
          productName: product.productName,
          sellerEmail,
        });
        console.log(`Notification added for product: ${product.productName}`);
      } catch (emailError) {
        // Log any email sending errors
        console.error(`Failed to send email to ${sellerEmail}:`, emailError);
      }
    }

    // Respond with the status and notifications array
    res.status(200).json({
      message: 'Out-of-stock notifications sent successfully.',
      notifications,  // List of notifications
    });
  } catch (error) {
    console.error('Error in notifying out-of-stock products:', error);
    res.status(500).json({ message: 'An error occurred while sending notifications.', error });
  }
};













 module.exports = {checkAndNotifyOutOfStock,incrementProductSales,viewProductSales ,changePasswordSeller,createSeller,updateSeller,getSeller,createProductseller,getProductSeller,viewProductsSeller,sortProductsByRatingSeller,requestAccountDeletionSeller,getPendingSellers,settleDocsSeller,loginSeller};