


import React, { useState } from 'react';

const AdvertiserActivity = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    price: '',
    category: '',
    tags: '',
    specialDiscounts: '',
    bookingOpen: false,
    activityLocation: { lat: null, lng: null }, // Change location to activityLocation
    name: '',
    Advertiser: '',
  });

  const [activities, setActivities] = useState([]); 
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [viewData, setViewData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreated, setIsCreated] = useState(false); // Define isCreated

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    console.log("Create button clicked");
    try {
      const response = await fetch('http://localhost:8000/createActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log("Request sent to server");

      if (response.ok) {
        const newActivity = await response.json();
        console.log(newActivity);
        setSuccessMessage(`Activity "${newActivity.name}" created successfully!`);
        setIsCreated(true);
        setViewData(newActivity);
        setActivities((prevActivities) => [...prevActivities, newActivity]);
      } else {
        throw new Error('Failed to create activity');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the activity.');
      console.error(error);
    }
  };

  const handleUpdateClick = (e, Activity) => {
    e.preventDefault();
    setIsUpdating(true); // Set update mode to true
    setFormData(Activity); // Pre-fill the form with the data of the location to update
    setSuccessMessage(`Editing Activity "${Activity.Name}"`);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/updateActivity` , {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(`Activity "${result.name}" updated successfully!`);
        setViewData(result);
        setActivities((prevActivities) =>
            prevActivities.map((Act) =>
          Act.name === result.name ? result : Act
          )
        );
        setIsUpdating(false);
        setFormData({
                      date: '',
                      time: '',
                      price: '',
                      category: '',
                      tags: '',
                      specialDiscounts: '',
                      bookingOpen: false,
                      location: { lat: null, lng: null },
                      name: '',
                      Advertiser: '',
                    });
        
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to update Activity.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the Activity');
      console.error(error);
    }
  };

  const handleGetActivity = async (e, Advertiser) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/getActivities?Advertiser=${Advertiser}`, {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(result);
        setSuccessMessage(`Activity "${result.Name}" retrieved successfully!`);
        setViewData(result);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to retrieve Activity.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while retrieving the Activity.');
      console.error(error);
    }
  };

  const handleDeleteActivity = async (e, advertiser, name) => {
    e.preventDefault(); // Use 'e' here to prevent default behavior
    try {
      const response = await fetch(`http://localhost:8000/deleteActivity?Advertiser=${advertiser}&name=${name}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setSuccessMessage(`Activity "${name}" deleted successfully!`);
        setIsCreated(false);
        setViewData(null);
        setActivities((prevActivities) =>
          prevActivities.filter((Act) => Act.name !== name) // Remove activity from the list
        );
        setFormData({
          date: '',
          time: '',
          price: '',
          category: '',
          tags: '',
          specialDiscounts: '',
          bookingOpen: false,
          location: { lat: null, lng: null },
          name: '',
          Advertiser: '',
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to delete activity.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting.');
      console.error(error);
    }
  };
  
  // Other functions (handleUpdate, handleGetActivity, handleDeleteActivity) ...

  return (
    <div>
      <h1>Activity form</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={isUpdating ? handleUpdate : handleCreate}>
      <div>
         {/* Input fields for creating/updating activity */}
        <div>
          <label><strong>Name:</strong></label>
           <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
         </div>
         <div>
           <label><strong>Date:</strong></label>
           <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
         </div>
         <div>
           <label><strong>Time:</strong></label>
           <input type="time" name="time" value={formData.time} onChange={handleInputChange} />
         </div>
         <div>
           <label><strong>Price:</strong></label>
        <input type="number" name="price" value={formData.price} onChange={handleInputChange} />
         </div>
         <div>
           <label><strong>Category:</strong></label>
           <input type="text" name="category" value={formData.category} onChange={handleInputChange} />
         </div>
         <div>
           <label><strong>Tags:</strong></label>
           <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} />
         </div>
         <div>
           <label><strong>Special Discounts:</strong></label>
           <input
            type="text"
            name="specialDiscounts"
            value={formData.specialDiscounts}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label><strong>Booking Open:</strong></label>
          <input
            type="checkbox"
            name="bookingOpen"
            checked={formData.bookingOpen}
            onChange={(e) =>
              setFormData((prevData) => ({ ...prevData, bookingOpen: e.target.checked }))
            }
          />
        </div>
        <div>
          <label><strong>Advertiser:</strong></label>
          <input
            type="text"
            name="Advertiser"
            value={formData.Advertiser}
            onChange={handleInputChange}
          />
        </div>

        {/* Google Maps integration
        <label>Location:</label>
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={{ height: '400px', width: '100%' }}
            center={{ lat: formData.location.lat || 0, lng: formData.location.lng || 0 }}
            zoom={10}
            onClick={(e) => handleLocationChange({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
          >
            {formData.location.lat && formData.location.lng && (
              <Marker position={{ lat: formData.location.lat, lng: formData.location.lng }} />
            )}
          </GoogleMap>
        </LoadScript> */}
       

      
      </div>
        
        {/* Input fields for creating/updating activity */}
        {/* Google Maps part */}
        <button type="submit">
          {isUpdating ? 'Update Activity' : 'Create Activity'}
        </button>
      </form>

      <div>
        <h2>All activities</h2>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.name}>
              <h3>{activity.name}</h3>
              <button onClick={(e) => handleGetActivity(e, activity.Advertiser)}>View</button>
              <button onClick={(e) => handleDeleteActivity(e, activity.Advertiser, activity.name)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No Activities available.</p>
        )}
      </div>

      {viewData && (
        <div>
          <h2>View Activity</h2>
          <p><strong>Name:</strong> {viewData.name}</p>
          <p><strong>Date:</strong> {viewData.date}</p>
          <p><strong>Time:</strong> {viewData.time}</p>
          <p><strong>Price:</strong> {viewData.price}</p>
          <p><strong>Category:</strong> {viewData.category}</p>
          <p><strong>Tags:</strong> {viewData.tags}</p>
          <p><strong>Special Discounts:</strong> {viewData.specialDiscounts}</p>
          <p><strong>Booking Open:</strong> {viewData.bookingOpen ? 'Yes' : 'No'}</p>
          <p><strong>Advertiser:</strong> {viewData.Advertiser}</p>
        </div>
      )}
    </div>
  );
};

export default AdvertiserActivity;


