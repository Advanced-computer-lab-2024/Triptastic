import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

const TourismGov = () => {
  
  const navigate = useNavigate(); // Create a navigate function

  const handleCreateHistoricalLocation = () => {
    navigate('/gov-historical'); // Navigate to the historical locations page
  };

  const handleCreateMuseum = () => {
    navigate('/gov-museum'); // Navigate to the museums page
  };

  const handleMyLocations = () => {
    navigate('/my-locations'); 
  };

  const handleMyMuseums = () => {
    navigate('/my-museums'); // Added this line for navigation
  }; // Correctly closing the function here

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const handleChangePassword = async () => {
    const Username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/changePasswordTourismGov`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username, currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setErrorMessage('');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setErrorMessage(data.error);
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setSuccessMessage('');
    }
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
      <button onClick={handleMyLocations}>
        View My Historical Locations
      </button>
      <button onClick={handleMyMuseums}>
        View My Museums
      </button>
           {/* Change Password Section */}
           <h2>Change Password</h2>
      <div>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleChangePassword}>Change Password</button>
      </div>

      {/* Display success or error messages */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default TourismGov;
