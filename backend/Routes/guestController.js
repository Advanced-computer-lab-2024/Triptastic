
const historicalLocationModel = require('../Models/historicalLocation.js');
const activitiesModel=require('../Models/Activities.js');
const itineraryModel= require('../Models/Itinerary.js');
const { default: mongoose } = require('mongoose');
const museumsModel=require('../Models/Museums.js');

const viewAllUpcomingActivitiesGuest = async (req, res) => {
    try {
      const currentDate = new Date();
      
      const activities = await activitiesModel.find({ date: { $gte: currentDate } });
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching upcoming activities' });
    }
  };
  const viewAllItinerariesGuest = async (req, res) => {
    try {
      
        const itineraries = await itineraryModel.find({});
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching itineraries' });
    }
  };
  const viewAllHistoricalPlacesGuest = async (req, res) => {
    try {
        const places = await historicalLocationModel.find({});
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching historical places and museums' });
    }
  };

  const viewAllMuseumsGuest = async (req, res) => {
    try {
        const places = await museumsModel.find({});
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching  museums' });
    }
   };

   const filterActivitiesGuest = async (req, res) => {
    // Extract parameters from the query string for GET requests
    const { Category, date, minBudget, maxBudget, rating } = req.query;
    
    let filter = {};
  
    // Filter by category if provided
    if (Category) {
       filter.Category = Category;
    }
  
    // Filter by price (minBudget and maxBudget)
    if (minBudget !== undefined && maxBudget !== undefined) {
       filter.price = {
          $gte: Number(minBudget), // Convert to number for comparison
          $lte: Number(maxBudget), // Convert to number for comparison
       };
    }
  
    if (date) {
      // If a date is provided, filter by that specific date (exact match)
      const inputDate = new Date(date);
      const localDate = new Date(inputDate.setHours(0, 0, 0, 0)); // Normalize to local time start of the day
      filter.date = {
          $gte: localDate,  // Activities on or after the provided date (local time)
          $lt: new Date(localDate.getTime() + 24 * 60 * 60 * 1000) // Before the next day
      };
  } else {
      // If no date is provided, filter activities from today onwards (local time)
      const today = new Date();
      const localToday = new Date(today.setHours(0, 0, 0, 0)); // Normalize to local time start of today
      filter.date = { $gte: localToday }; // Activities today or later
  }
  
  
  
    // Filter by rating (if provided)
    if (rating) {
       filter.rating = { $gte: Number(rating) }; // Convert to number for comparison
    }
  
    try {
       
       const activities = await activitiesModel.find(filter);
       console.log("Filter object:", filter);
       res.json(activities); // Return the filtered activities
    } catch (error) {
       res.status(500).json({ error: 'Server error' });
    }
  };
  
  const filterHistoricalLocationsByTagsGuest = async (req, res) => {
    const { Types } = req.query;
    const validTagTypes = ["Monuments", "Museums", "Religious Sites", "Palaces", "Castles"];
  
    try {
        if (!validTagTypes.includes(Types)) {
            return res.status(400).json({ error: `Invalid tag type. Valid types are: ${validTagTypes.join(', ')}` }); 
        }

        const filteredLocations = await historicalLocationModel.find({ 'Tags.Types': Types });
  
        if (filteredLocations.length === 0) {
            return res.status(404).json({ msg: "No historical locations found with the specified tag type." });
        }

        res.status(200).json(filteredLocations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const filterMuseumsByTagsGuest = async (req, res) => {
  const { Tags } = req.query; // Extracting HistoricalPeriod from query parameters

  try {
      const filteredMuseums = await museumsModel.find({ 'Tags.HistoricalPeriod': Tags });

      if (filteredMuseums.length === 0) {
          return res.status(404).json({ msg: "No museums found with the specified historical period." });
      }
      
      res.status(200).json(filteredMuseums);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


  module.exports = {viewAllHistoricalPlacesGuest, viewAllItinerariesGuest,viewAllUpcomingActivitiesGuest,filterActivitiesGuest,filterHistoricalLocationsByTagsGuest,filterMuseumsByTagsGuest,viewAllMuseumsGuest};
