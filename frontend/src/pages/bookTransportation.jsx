import React, { useState } from 'react';

const BookTransportation = () => {
  const [fromPlace, setFromPlace] = useState('');
  const [toPlace, setToPlace] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [numItineraries, setNumItineraries] = useState(3);

  // Function to convert location name to coordinates
  const getCoordinates = async (placeName) => {
    const apiKey = 'f71f196fc43f4a0d848f181469c65201'; // Replace with your OpenCage or Google Maps API key
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${placeName}&key=${apiKey}`);
    const data = await response.json();
    
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return `${lat},${lng}`;
    } else {
      throw new Error('Location not found');
    }
  };

  // Function to fetch trip data from transit API
  const fetchTrip = async () => {
    if (!fromCoords || !toCoords) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(`https://external.transitapp.com/v3/otp/plan?fromPlace=${fromCoords}&toPlace=${toCoords}&date=${date}&time=${time}&numItineraries=${numItineraries}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `a6beb7e5f3f916988bf2feec5c0258a8774dd0a1ffee4c19d3cb716641777f7f`, // replace with your actual API key
        },
      });
      const data = await response.json();
      setTripData(data.plan.itineraries);
    } catch (error) {
      console.error('Error fetching trip data:', error);
    }
  };

  return (
    <div>
      <h1>Book Transportation</h1>

      <div>
        <label>From:</label>
        <input
          type="text"
          placeholder="Enter starting location (e.g., Central Park)"
          value={fromPlace}
          onChange={(e) => setFromPlace(e.target.value)}
          onBlur={() => getCoordinates(fromPlace, setFromCoords)}
        />
      </div>

      <div>
        <label>To:</label>
        <input
          type="text"
          placeholder="Enter destination (e.g., Times Square)"
          value={toPlace}
          onChange={(e) => setToPlace(e.target.value)}
          onBlur={() => getCoordinates(toPlace, setToCoords)}
        />
      </div>

      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label>Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <button onClick={fetchTrip}>Find Trip</button>

      {tripData && (
        <div>
          <h2>Trip Itineraries</h2>
          {tripData.map((itinerary, index) => (
            <div key={index}>
              <p>Itinerary {index + 1}:</p>
              {/* Display itinerary details here */}
              <p>Duration: {itinerary.duration} minutes</p>
              {itinerary.legs.map((leg, i) => (
                <div key={i}>
                  <p>Mode: {leg.mode}</p>
                  <p>From: {leg.from.name}</p>
                  <p>To: {leg.to.name}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookTransportation;
