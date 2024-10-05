import React, { useState, useEffect } from 'react'; 

const Museums = () => {
  const [museums, setMuseums] = useState([]);
  const [historicalPeriods, setHistoricalPeriods] = useState([]); // State for historical periods
  const [selectedPeriod, setSelectedPeriod] = useState(''); // State for selected period
  const [viewMuseums, setViewMuseums] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false); // State to control dropdown visibility

  // Fetch museums from the backend
  const handleViewAllMuseums = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/viewAllMuseumsTourist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMuseums(data); // Save the museums in the state
    } catch (error) {
      console.error('Error fetching museums:', error);
    } finally {
      setLoading(false);
      setViewMuseums(true); // Show the museums when loaded
    }
  };

  // Fetch unique historical periods from the backend
  const fetchHistoricalPeriods = async () => {
    try {
      const response = await fetch('http://localhost:8000/getUniqueHistoricalPeriods', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setHistoricalPeriods(data); // Save the historical periods in the state
    } catch (error) {
      console.error('Error fetching historical periods:', error);
    }
  };

  // Handle filtering museums by historical period
  const handleFilterMuseums = async () => {
    if (!selectedPeriod) return; // If no period is selected, do nothing

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/filterMuseumsByTagsTourist?Tags=${selectedPeriod}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMuseums(data); // Update museums based on the selected period
    } catch (error) {
      console.error('Error filtering museums:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch historical periods when the component mounts
  useEffect(() => {
    fetchHistoricalPeriods();
  }, []);

  return (
    <div>
      <h1>Museums</h1>
      <button onClick={handleViewAllMuseums}>View All Museums</button>

      {viewMuseums && (
        <>
          <button onClick={() => setFilterVisible(!filterVisible)}>Filter Museums</button>

          {filterVisible && (
            <div>
              <label htmlFor="period-select">Filter by Historical Period:</label>
              <select
                id="period-select"
                onChange={(e) => setSelectedPeriod(e.target.value)}
                value={selectedPeriod}
              >
                <option value="" disabled>Select a historical period</option>
                {historicalPeriods.map((period) => (
                  <option key={period.name} value={period.name}>{period.name}</option> // Assuming each period has a `name` property
                ))}
              </select>
              <button onClick={handleFilterMuseums} disabled={!selectedPeriod}>Apply Filter</button>
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {museums.map((museum) => (
                <li key={museum._id}>{museum.Name}</li> // Assuming each museum has a `Name` property
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Museums;
