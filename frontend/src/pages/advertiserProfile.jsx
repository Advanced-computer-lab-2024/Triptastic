import React, { useState } from 'react';

const AdvertiserProfile = () => {
  const [advertiserInfo, setAdvertiserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAdvertiserInfo = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username'); // Get the username from local storage

    if (Username) {
      try {
        const response = await fetch('http://localhost:8000/getAdvertiser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
           // 'Authorization': `Bearer ${localStorage.getItem()}` // Include the token if you're using authentication
          },
        });
       

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Data:', data);
          if (data) {
            setAdvertiserInfo(data); // Set the fetched information
            setErrorMessage('');
          } else {
            setErrorMessage('No advertiser information found.');
          }
        } else {
          throw new Error('Failed to fetch advertiser information');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching advertiser information');
        console.error(error);
      }
    } else {
      setErrorMessage('No advertiser information found.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Advertiser Profile</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {loading ? (
        <p>Loading advertiser information...</p>
      ) : (
        advertiserInfo ? (
          <div>
            <p><strong>Username:</strong> {advertiserInfo.Username}</p>
            <p><strong>Email:</strong> {advertiserInfo.Email}</p>
            <p><strong>website_Link:</strong> {advertiserInfo.website_Link}</p>
            <p><strong>Hotline:</strong> {advertiserInfo.Hotline}</p>
            <p><strong>Company_Profile:</strong> {advertiserInfo.Company_Profile}</p>
            {/* Don't display the password for security reasons */}
          </div>
        ) : (
          <p>No advertiser information found.</p>
        )
      )}
      <button onClick={fetchAdvertiserInfo}>View My Information</button>
    </div>
  );
};

export default AdvertiserProfile;