import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TourGuideProfile() {
  const [tourGuideInfo, setTourGuideInfo] = useState(null);
  const [itineraries, setItineraries] = useState([]); // New state for itineraries
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: '',
  });

  // Function to fetch tour guide data from the server
  const fetchTourGuideData = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username');

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
            setFormData(data); // Initialize formData with fetched data
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

  // Function to fetch itineraries
  const fetchItineraries = async () => {
    const Username = localStorage.getItem('Username');
    
    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getMyItineraries?Username=${Username}`);
        if (response.ok) {
          const data = await response.json();
          setItineraries(data); // Set the fetched itineraries
        } else {
          throw new Error('Failed to fetch itineraries');
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchTourGuideData();
    fetchItineraries(); // Fetch itineraries when the component mounts
  }, []);

  // Toggle visibility of profile details
  const toggle = () => {
    setIsVisible((prevState) => !prevState);
  };

  // Toggle the edit form visibility
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for updating tour guide info
  const handleSubmit = async (e) => {
    e.preventDefault();
    const Username = localStorage.getItem('Username');

    try {
      const response = await fetch(`http://localhost:8000/updateTourGuide/${Username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Fetch updated tour guide data after successful update
        await fetchTourGuideData(); // Refetch data to update the state
        setErrorMessage('');
        setIsEditing(false); // Hide the form after successful update
        setIsVisible(true); // Show the profile details immediately after update
      } else {
        throw new Error('Failed to update tour guide information');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating tour guide information');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Tour Guide Profile</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {loading ? (
        <p>Loading tour guide information...</p>
      ) : (
        <>
          <button onClick={toggle}>{isVisible ? 'Hide' : 'Show'} Profile Details</button>
          {isVisible && (
            <div>
              <p><strong>Username:</strong> {tourGuideInfo?.Username}</p>
              <p><strong>Email:</strong> {tourGuideInfo?.Email}</p>
              <p><strong>Mobile Number:</strong> {tourGuideInfo?.mobileNumber}</p>
              <p><strong>Years of Experience:</strong> {tourGuideInfo?.yearsOfExperience}</p>
              <p><strong>Previous Work:</strong> {tourGuideInfo?.previousWork}</p>
            </div>
          )}
          <button onClick={handleEditToggle}>{isEditing ? 'Cancel' : 'Edit Data'}</button>
          {isEditing && (
            <form onSubmit={handleSubmit}>
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  name="Username"
                  value={formData.Username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Mobile Number:</label>
                <input
                  type="number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Years of Experience:</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Previous Work:</label>
                <input
                  type="text"
                  name="previousWork"
                  value={formData.previousWork}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Update Data</button>
            </form>
          )}

          {/* Section to display itineraries */}
          <h3>My Itineraries</h3>
          {itineraries.length > 0 ? (
            <ul>
              {itineraries.map((itinerary) => (
                <li key={itinerary._id}>
                  <strong>
                    {itinerary.Activities.length > 0 
                      ? itinerary.Activities.join(', ') 
                      : 'No Activities'}
                  </strong> - 
                  <span>
                    {itinerary.Locations.length > 0 
                      ? `Locations: ${itinerary.Locations.join(', ')}`
                      : 'No Locations'}
                  </span> - 
                  Price: ${itinerary.Price} - 
                  Date: {new Date(itinerary.DatesTimes).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No itineraries found.</p>
          )}
        </>
      )}
    </div>
  );
}

export default TourGuideProfile;
