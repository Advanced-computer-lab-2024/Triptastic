import React, { useState } from 'react';

const AdvertiserProfile = () => {


  const [advertiserInfo, setAdvertiserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedAdvertiserInfo, setUpdatedAdvertiserInfo] = useState({});

  const fetchAdvertiserInfo = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username'); // Get the username from local storage

    if (Username) {
      try {
     
        const response = await fetch(`http://localhost:8000/getAdvertiser?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
       

        if (response.ok) {
          const data = await response.json();
         
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAdvertiserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };
  const handleProfileUpdate = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username'); // Get the username from local storage

    try {
      const response = await fetch(`http://localhost:8000/updateAdvertiser/${Username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAdvertiserInfo),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setAdvertiserInfo(updatedData); // Update the UI with new information
        setErrorMessage('');
        setIsEditing(false); // Switch back to view mode
      } else {
        throw new Error('Failed to update advertiser profile');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating your profile.');
      console.error(error);
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
            {!isEditing ? (
              <>
                <p><strong>Username:</strong> {advertiserInfo.Username}</p>
                <p><strong>Email:</strong> {advertiserInfo.Email}</p>
                <p><strong>Website Link:</strong> {advertiserInfo.website_Link}</p>
                <p><strong>Hotline:</strong> {advertiserInfo.Hotline}</p>
                <p><strong>Company Profile:</strong> {advertiserInfo.Company_Profile}</p>
                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
              </>
            ) : (
              <div>
                <label>
                  <strong>Email:</strong>
                  <input
                    type="email"
                    name="Email"
                    value={updatedAdvertiserInfo.Email || advertiserInfo.Email}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  <strong>Website Link:</strong>
                  <input
                    type="text"
                    name="website_Link"
                    value={updatedAdvertiserInfo.website_Link || advertiserInfo.website_Link}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  <strong>Hotline:</strong>
                  <input
                    type="text"
                    name="Hotline"
                    value={updatedAdvertiserInfo.Hotline || advertiserInfo.Hotline}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  <strong>Company Profile:</strong>
                  <textarea
                    name="Company_Profile"
                    value={updatedAdvertiserInfo.Company_Profile || advertiserInfo.Company_Profile}
                    onChange={handleInputChange}
                  />
                </label>

                <button onClick={handleProfileUpdate}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            )}
          </div>
        ) : (
          <p>No profile information to display.</p>
        )
      )}

      {/* Button to manually fetch the advertiser's info */}
      <button onClick={fetchAdvertiserInfo}>View My Information</button>
    </div>
  );
};

export default AdvertiserProfile;






