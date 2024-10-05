import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const TourismGov = () => {
  const navigate = useNavigate(); // Create a navigate function

  const handleCreateHistoricalLocation = () => {
    navigate('/gov-historical'); // Navigate to the historical locations page
  };

  const handleCreateMuseum = () => {
    navigate('/gov-museum'); // Navigate to the museums page
  };

  return (
    <div>
      <h1>Tourism Governor Profile</h1>
      <button onClick={handleCreateHistoricalLocation}>
        Create Historical Location
      </button>
      <button onClick={handleCreateMuseum}>
        Create Museum
      </button>
    </div>
  );
};

export default TourismGov;
