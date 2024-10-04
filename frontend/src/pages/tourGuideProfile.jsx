import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TourGuideProfile() {
  const [tourGuideInfo, setTourGuideInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    fetchTourGuideData();
  }, []); 

  const fetchTourGuideData = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username');
    console.log(Username);

    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getTourGuide?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setTourGuideInfo(data); // Set the fetched information
            setErrorMessage('');
          } else {
            setErrorMessage('No tour guide information found.');
          }
        } else {
          throw new Error('Failed to fetch tour guide information');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching tour guide information');
        console.error(error);
      }
    } else {
      setErrorMessage('No tour guide information found.');
    }
    setLoading(false);
  };

  const toggle = () => {
    setIsVisible((prevState) => !prevState);
  };

  return (
    <div>
      <h2>Tour Guide Profile</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {loading ? (
        <p>Loading tour guide information...</p>
      ) : (
        <>
          <button onClick={toggle}>
            {isVisible ? 'Hide' : 'Show'} Profile Details
          </button>
          {isVisible && tourGuideInfo && (
            <div>
              <p><strong>Username:</strong> {tourGuideInfo.Username}</p>
              <p><strong>Email:</strong> {tourGuideInfo.Email}</p>
              <p><strong>Mobile Number:</strong> {tourGuideInfo.mobileNumber}</p>
              <p><strong>Years of Experience:</strong> {tourGuideInfo.yearsOfExperience}</p>
              <p><strong>Previous Work:</strong> {tourGuideInfo.previousWork}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TourGuideProfile;


