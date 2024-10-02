import React, { useState } from 'react';

const SellerProfile = () => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSellerInfo = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username');
    console.log(Username); // Get the username from local storage

    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getSeller?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSellerInfo(data); // Set the fetched information
            setErrorMessage('');
          } else {
            setErrorMessage('No seller information found.');
          }
        } else {
          throw new Error('Failed to fetch seller information');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching seller information');
        console.error(error);
      }
    } else {
      setErrorMessage('No seller information found.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Seller Profile</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {loading ? (
        <p>Loading seller information...</p>
      ) : (
        sellerInfo ? (
          <div>
            <p><strong>Username:</strong> {sellerInfo.Username}</p>
            <p><strong>Email:</strong> {sellerInfo.Email}</p>
            {/* Don't display the password for security reasons */}
          </div>
        ) : (
          <p>No seller information found.</p>
        )
      )}
      <button onClick={fetchSellerInfo}>View My Information</button>
    </div>
  );
};

export default SellerProfile;

