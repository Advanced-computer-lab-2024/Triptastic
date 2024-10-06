import React, { useEffect, useState } from 'react';

const MyMuseums = () => {
  const [museums, setMuseums] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch museums on component mount
  useEffect(() => {
    const fetchMyMuseums = async () => {
      const tourismGovernor = localStorage.getItem('Username'); // Get Tourism Governor from local storage

      try {
        const response = await fetch(`http://localhost:8000/viewMyMuseums?TourismGovernor=${tourismGovernor}`);
        
        if (response.ok) {
          const data = await response.json();
          setMuseums(data);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Failed to fetch museums.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching museums.');
        console.error(error);
      }
    };

    fetchMyMuseums();
  }, []);

  return (
    <div>
      <h1>My Museums</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {museums.length === 0 ? (
        <p>No museums found.</p>
      ) : (
        <ul>
          {museums.map((museum) => (
            <li key={museum.Name}>
              <strong>{museum.Name}</strong>: {museum.Description} ({museum.Location})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyMuseums;
