# Triptastic

*A platform to help tourists plan their travels by booking flights, accommodations, transportation, and activities. Additionally, it allows sellers and advertisers to post their offers and products for tourists to book.*

## Motivation

*Travel planning can be overwhelming, with tourists needing to coordinate flights, accommodations, transportation, and activities while managing multiple platforms. Similarly, sellers and advertisers in the tourism industry often struggle to reach potential customers in a crowded market. This project aims to simplify the travel planning process by offering a one-stop platform for tourists to book all aspects of their trip, while also providing an easy way for sellers to connect with travelers and promote their offers. By bringing everything into a single platform, we can enhance user experience and create new opportunities for both tourists and vendors.*

## Build Status

- [ ] **Build Status**: [e.g., "In Progress", "Completed", "Bug Found"]
- Known Issues: *Describe any known issues or bugs here.*
- Last Updated: *Date of the last update or release.*

## Code Styles and Conventions

### Naming Conventions
- Camel Case for Variables and Functions
  - `loginTourist`, `createTourist`, `generateOTP`
- Consistent Capitalization in Model Imports
  - `const touristModel = require('../Models/Tourist.js')`
- Descriptive and Meaningful Variable Names
  - Clear naming that indicates purpose: `Username`, `Email`, `DOB`









## Screenshots

*Provide a few screenshots or images to showcase the project.*

![Screenshot](link-to-image)

## Tech/Framework Used

- MongoDb
- Express.js
- React.js
- Node.js



## Features

- Flight Booking
- Hotel Booking
- Activity and Itinerary booking
- Product Buying and Selling

## Code Examples

### 1. **Tourist creation**
This example shows how to create a new tourist.


## Code Examples

### 1. **Tourist creation**
This example shows how to create a new tourist.

const createTourist = async (req, res) => {
  const { Username, Email, Password, Nationality, DOB, Occupation, showIntro } = req.body;

  try {
    // Check if the username already exists in any model
    const userExistsInTourist = await touristModel.findOne({ Username });
    const userExistsInTourGuide = await tourGuideModel.findOne({ Username });
    const userExistsInAdvertiser = await advertiserModel.findOne({ Username });
    const userExistsInSeller = await sellerModel.findOne({ Username });
    const userExistsInAdmin = await adminModel.findOne({ Username });
    const userExistsInTourismGov = await tourismGovModel.findOne({ Username });

    if (userExistsInTourist || userExistsInTourGuide || userExistsInAdvertiser || userExistsInSeller || userExistsInAdmin || userExistsInTourismGov) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create a new tourist with the hashed password
    const tourist = await touristModel.create({
      Username,
      Email,
      Password: hashedPassword,
      Nationality,
      DOB,
      Occupation,
      showIntro
    });

    res.status(200).json({
      message: 'Tourist registered successfully',
      tourist,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




### 2. **Adding a new product**
This example shows how to add a new product to the website.


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







## Installation

*To install this project simply clone this repository and open it in vscode or your preferred text editor then open up 2 new terminals in your text editor.In the first terminal run cd backend then npm i and in the second terminal run cd frontend then npm i that should install all the necessary frameworks and libraries needed for you to run this project.*



## API reference



## Tests





## How to Use


## Contribute


## Credits


## License

*Apache License 2.0

Copyright [2024] [Triptastic]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*

