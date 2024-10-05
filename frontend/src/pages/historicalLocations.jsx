import React, { useState } from 'react';

const HistoricalLocations = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [viewPlaces, setViewPlaces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState(''); // State for selected tag type

  // Fetch historical places from the backend (without filter)
  const handleViewAllHistoricalPlaces = async () => {
    setLoading(true);
    setErrorMessage(''); // Reset error message
    try {
      const response = await fetch('http://localhost:8000/viewAllHistoricalPlacesTourist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'No historical locations found with the specified tag type.');
        return;
      }

      let data = await response.json();
      console.log("All Historical Places Response:", data); // Log the response data

      // Ensure data is always an array (even if it's a single object)
      if (!Array.isArray(data)) {
        data = [data];
      }

      setHistoricalPlaces(data);
    } catch (error) {
      console.error('Error fetching historical places:', error);
      setErrorMessage("No historical locations found with the specified tag type.");
    } finally {
      setLoading(false);
      setViewPlaces(true);
    }
  };

  // Generic filter function
  const handleFilter = async () => {
    setLoading(true);
    setErrorMessage(''); // Reset error message
    try {
      const response = await fetch(`http://localhost:8000/filterHistoricalLocationsByTagsTourist?Types=${selectedTag}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'No historical locations found with the specified tag type.');
        return;
      }

      let data = await response.json();
      console.log(`Filter ${selectedTag} Response:`, data); // Log the response data

      // Ensure data is always an array (even if it's a single object)
      if (!Array.isArray(data)) {
        data = [data];
      }

      setHistoricalPlaces(data);
    } 
    catch (error) {
      console.error('Error filtering historical locations:', error);
      setErrorMessage("No historical locations found with the specified tag type.");
    } 
    finally {
      setLoading(false);
    }
  };

  const renderHistoricalPlaces = () => {
    return historicalPlaces.length > 0 ? (
      historicalPlaces.map(place => <li key={place._id}>{place.Name}</li>)
    ) : (
      <li>No historical places found.</li>
    );
  };

  return (
    <div>
      <h1>Historical Locations</h1>
      <button onClick={handleViewAllHistoricalPlaces}>View All Historical Locations</button>

      {viewPlaces && (
        <>
          <button onClick={() => setFilterVisible(!filterVisible)}>Filter Historical Locations</button>

          {filterVisible && (
            <div>
              <label>Filter by Tag:</label>
              <select onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag}>
                <option value="" disabled>Select a tag</option>
                <option value="Monuments">Monuments</option>
                <option value="Religious Sites">Religious Sites</option>
                <option value="Palaces/Castles">Castles/Palaces</option>
              </select>
              <button onClick={handleFilter} disabled={!selectedTag}>Apply Filter</button>
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
              <ul>
                {renderHistoricalPlaces()}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default HistoricalLocations;
