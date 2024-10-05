// pages/Guest.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Guest = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="guest-page">
      <h1>Welcome, Guest!</h1>
      <p>
        You are currently browsing as a guest. Explore our services without an account.
      </p>    
      <p>
        If you wish to register for an account, please go to the registration page.
      </p>
      
      <div>
        <button onClick={() => navigate('/museums')}>Go to Museums</button>
        <button onClick={() => navigate('/historical-locations')}>Go to Historical Places</button>
      </div>
    </div>
  );
};

export default Guest;
