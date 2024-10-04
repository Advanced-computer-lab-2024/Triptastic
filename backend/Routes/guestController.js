
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

  const filterActivitiesGuest =async (req, res) => {
    const { Category, date,minBudget, maxBudget, rating } = req.body;
    
    let filter = {};
    if (Category) {
       filter.Category = Category;
     }
  
     if (minBudget !== undefined && maxBudget !== undefined) {
       filter.price = {
         $gte: Number(minBudget), 
         $lte: Number(maxBudget), 
       };
     }
     if (date) {
       filter.date = new Date(date);
     }
    if (rating) {
      filter.rating = { $gte: rating };
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    filter.date = { $gte: today };
   
    try {
      const activities = await activitiesModel.find(filter);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  const filterHistoricalLocationsByTagsGuest = async (req, res) => {
    const { Types } = req.query;
    const validTagTypes = ["Monuments", "Religious Sites", "Palaces","Castles"];
  
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
        res.status(400).json({ error: error.message });
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
