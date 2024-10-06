import React, { useEffect, useState } from 'react';

const MyLocations = () => {
  const [locations, setLocations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch locations on component mount
  useEffect(() => {
    fetchMyLocations();
  }, []);

  const fetchMyLocations = async () => {
    const tourismGovernor = localStorage.getItem('Username'); // Get Tourism Governor from local storage

    try {
      const response = await fetch(`http://localhost:8000/viewMyLocations?TourismGovernor=${tourismGovernor}`);

      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to fetch locations.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching locations.');
      console.error(error);
    }
  };

  // Function to refresh the locations
  const refreshLocations = () => {
    fetchMyLocations(); // Call the fetch function to refresh locations
  };

  return (
    <div>
      <h1>My Historical Locations</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {locations.length === 0 ? (
        <p>No historical locations found.</p>
      ) : (
        <ul>
          {locations.map((location) => (
            <li key={location.Name}>
              <strong>{location.Name}</strong>: {location.Description} ({location.Location})
            </li>
          ))}
        </ul>
      )}
      {/* Button to refresh locations */}
      <button onClick={refreshLocations}>Refresh Locations</button>
    </div>
  );
};

export default MyLocations;
