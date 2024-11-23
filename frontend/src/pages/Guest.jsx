import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import introJs from 'intro.js';
import 'intro.js/introjs.css'; // Import Intro.js styles

const Guest = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Start the intro tour automatically when the page loads
  useEffect(() => {
    introJs()
      .setOptions({
        steps: [
          {
            element: document.querySelector('.guest-page h1'),
            intro: 'Welcome to our vacation planning platform! Let us show you around.',
          },
          {
            element: document.querySelector('.guest-page button:nth-child(1)'),
            intro: 'You can start exploring museums by clicking here.',
          },
          {
            element: document.querySelector('.guest-page button:nth-child(2)'),
            intro: 'Interested in historical locations? This button will take you there.',
          },
          {
            element: document.querySelector('.guest-page button:nth-child(3)'),
            intro: 'Looking for itineraries? Click here to find various vacation plans.',
          },
          {
            element: document.querySelector('.guest-page button:nth-child(4)'),
            intro: 'Explore exciting activities by clicking here.',
          },
        ],
      })
      .start();
  }, []); // Empty array ensures the effect runs once when the component is mounted

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
        <button onClick={() => navigate("/itineraries")}>Go to Itineraries</button>
        <button onClick={() => navigate("/activities")}>Go to Activities</button>
      </div>
    </div>
  );
};

export default Guest;
