import React, { useState, useEffect } from 'react';

const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minBudget: '',
    maxBudget: '',
    date: '',
    preferences: '',
    language: '',
  });

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
        const filteredItineraries = data.filter(itinerary => !itinerary.FlagInappropriate);
        setItineraries(filteredItineraries);
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
        const filteredItineraries = data.filter(itinerary => !itinerary.FlagInappropriate);
        setItineraries(filteredItineraries);
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

  const fetchFilteredItineraries = async () => {
    const { minBudget, maxBudget, date, preferences, language } = filters;
    let query = `http://localhost:8000/filterItineraries?`;
    
    if (minBudget) query += `minBudget=${minBudget}&`;
    if (maxBudget) query += `maxBudget=${maxBudget}&`;
    if (date) query += `date=${date}&`;
    if (preferences) query += `preferences=${preferences}&`;
    if (language) query += `language=${language}&`;

    try {
      const response = await fetch(query, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const filteredItineraries = data.filter(itinerary => !itinerary.FlagInappropriate);
        setItineraries(filteredItineraries);
        setErrorMessage('');
      } else {
        throw new Error('No itineraries found matching the criteria');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching itineraries');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleItineraryDetails = (id) => {
    setExpandedItineraries((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the boolean value for the given itinerary ID
    }));
  };

  const handleBooking = async (itinerary) => {
    const username = localStorage.getItem('Username'); // Assuming you store the username in local storage
    try {
      const response = await fetch('http://localhost:8000/bookItinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Activities: itinerary.Activities,
          Username: username,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Show success message
        fetchASCItineraries(); // Refresh the itineraries to reflect the booking
      } else {
        const error = await response.json();
        alert(error.error || 'An error occurred while booking the itinerary'); // Show error message
      }
    } catch (error) {
      console.error('Error booking itinerary:', error);
      alert('An error occurred while booking the itinerary');
    }
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

          <h3>Filter Itineraries</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchFilteredItineraries();
            }}
          >
            <label>
              Min Budget:
              <input
                type="number"
                name="minBudget"
                value={filters.minBudget}
                onChange={handleFilterChange}
              />
            </label>
            <br />
            <label>
              Max Budget:
              <input
                type="number"
                name="maxBudget"
                value={filters.maxBudget}
                onChange={handleFilterChange}
              />
            </label>
            <br />
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </label>
            <br />
            <label>
              Preferences (e.g. beaches, shopping):
              <input
                type="text"
                name="preferences"
                value={filters.preferences}
                onChange={handleFilterChange}
              />
            </label>
            <br />
            <label>
              Language:
              <input
                type="text"
                name="language"
                value={filters.language}
                onChange={handleFilterChange}
              />
            </label>
            <br />
            <button type="submit">Apply Filters</button>
          </form>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          {itineraries.length > 0 ? (
            <ul>
              {itineraries.map((itinerary) => (
                <li key={itinerary._id}>
                  <strong>Activities:</strong> {itinerary.Activities.join(', ')} <br />
                  <strong>Price:</strong> {itinerary.Price} <br />
                  <strong>Dates:</strong> {itinerary.DatesTimes} <br />
                  <button onClick={() => toggleItineraryDetails(itinerary._id)}>
                    {expandedItineraries[itinerary._id] ? 'Hide Itinerary Details' : 'View Itinerary Details'}
                  </button>
                  <button onClick={() => handleBooking(itinerary)} disabled={itinerary.Booked}>
                    Book Ticket
                  </button>
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
