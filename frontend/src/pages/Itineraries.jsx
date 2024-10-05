import React, { useState, useEffect } from 'react';

const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // State to track the visibility of itinerary details
  const [expandedItineraries, setExpandedItineraries] = useState({});

  const fetchASCItineraries = async () => {
    try {
      const response = await fetch(`http://localhost:8000/sortItinPASC`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItineraries(data);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch itineraries');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching itineraries');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortAscending = () => {
    fetchASCItineraries();
  };

  const handleSortDescending = async () => {
    try {
      const response = await fetch(`http://localhost:8000/sortItinPDSC`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItineraries(data);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch itineraries');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching itineraries');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItineraryDetails = (id) => {
    setExpandedItineraries((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the boolean value for the given itinerary ID
    }));
  };

  useEffect(() => {
    fetchASCItineraries(); // Default to ascending sort
  }, []);

  return (
    <div>
      <h2>Itineraries</h2>
      {loading ? (
        <p>Loading itineraries...</p>
      ) : (
        <>
          <button onClick={handleSortAscending}>Sort by Price (Ascending)</button>
          <button onClick={handleSortDescending}>Sort by Price (Descending)</button>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          {itineraries.length > 0 ? (
            <ul>
              {itineraries.map((itinerary) => (
                <li key={itinerary._id}>
                  <strong>Activities:</strong> {itinerary.Activities.join(', ')} <br />
                  <strong>Price:</strong> {itinerary.Price} <br />
                  <strong>Dates:</strong> {itinerary.DatesTimes} <br />
                  {/* Button to toggle itinerary details */}
                  <button onClick={() => toggleItineraryDetails(itinerary._id)}>
                    {expandedItineraries[itinerary._id] ? 'Hide Itinerary Details' : 'View Itinerary Details'}
                  </button>
                  {/* Show details if expanded */}
                  {expandedItineraries[itinerary._id] && (
                    <div>
                      <p><strong>Locations:</strong> {itinerary.Locations.join(', ')}</p>
                      <p><strong>Timeline:</strong> {itinerary.Timeline}</p>
                      <p><strong>Duration of Activity:</strong> {itinerary.DurationOfActivity}</p>
                      <p><strong>Language:</strong> {itinerary.Language}</p>
                      <p><strong>Accessibility:</strong> {itinerary.Accesibility}</p>
                      <p><strong>Pick Up/Drop Off:</strong> {itinerary.pickUpDropOff}</p>
                      <p><strong>Booked:</strong> {itinerary.Booked ? 'Yes' : 'No'}</p>
                      <p><strong>Tour Guide:</strong> {itinerary.TourGuide}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No itineraries found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Itineraries;
