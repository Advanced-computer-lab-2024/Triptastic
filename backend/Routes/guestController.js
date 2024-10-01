
const historicalLocationModel = require('../Models/historicalLocation.js');
const activitiesModel=require('../Models/Activities.js');
const itineraryModel= require('../Models/Itinerary.js');
const { default: mongoose } = require('mongoose');

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

  module.exports = {viewAllHistoricalPlacesGuest, viewAllItinerariesGuest,viewAllUpcomingActivitiesGuest};