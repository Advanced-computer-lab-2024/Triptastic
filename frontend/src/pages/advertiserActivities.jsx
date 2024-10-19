import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import MapPicker from './MapPicker';

const AdvertiserActivity = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    price: '',
    Category: '',
    tags: '',
    rating:0,
    specialDiscounts: '',
    bookingOpen: false,
    location:'',
    name: '',
    Advertiser: '', // This will be set in handleCreate and handleUpdate
  });

  const [activities, setActivities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [viewData, setViewData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('http://localhost:8000/viewAllPrefTag');
        if (!response.ok) throw new Error('Failed to fetch tags');
  
        const tags = await response.json();
        console.log("Fetched Tags:", tags); // Log the fetched tags to see their structure
  
        setAvailableTags(tags.map(tag => ({ value: tag.PrefTagName, label: tag.PrefTagName }))); // Adjust according to your data structure
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
  
    fetchTags();
  }, []);// Runs once when the component mounts

  const handleTagsChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: selectedOptions.map(option => option.value), // Store the values of the selected options
    }));
  };


  const handleLocationSelect = (address) => {
    setFormData((prevData) => ({
        ...prevData,
        location: address, // Update to string
    }));
    console.log("Updated formData:", formData); // Log the formData here
};
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('Username'); 
    console.log(username)
   // Add Advertiser field
   const activityData = { 
    ...formData, 
    Advertiser: username,
    location: formData.location  // Rename to match the backend
  };
  console.log('Activity Data:', JSON.stringify(activityData));
    try {
      console.log('Activity Data:', JSON.stringify(activityData));
      const response = await fetch('http://localhost:8000/createActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData), // Use updated activityData
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
  const handleUpdateClick = (e, activity) => {
    e.preventDefault();
    setIsUpdating(true); // Set update mode to true
    setFormData(activity); // Pre-fill the form with the data of the activity to update
    setSuccessMessage(`Editing activity "${activity.name}"`);
};

const handleUpdate = async (e) => {
  e.preventDefault();
  const username = localStorage.getItem('Username'); // Get username from local storage
  const { name } = formData; // Extract the name from formData

  // Construct the activityData object to send to the server
  const activityData = { 
      Category: formData.Category,
      date: formData.date,
      time: formData.time,
      location: formData.location, // Ensure this matches your backend
      price: formData.price,
      tags: formData.tags,
      
      specialDiscounts: formData.specialDiscounts,
      bookingOpen: formData.bookingOpen,
      
  };

  try {
      // Use username instead of Advertiser
      const response = await fetch(`http://localhost:8000/updateActivity?Advertiser=${username}&name=${name}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(activityData) // Use updated activityData
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
              Category: '',
              tags: '',
             
              specialDiscounts: '',
              bookingOpen: false,
              location: '',
              name: '',
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


  const handleGetActivity = async (e, Advertiser,name) => {
    e.preventDefault();
    console.log(`Fetching activity for Advertiser: ${Advertiser}, name: ${name}`);
    try {
      const response = await fetch(`http://localhost:8000/viewActivitydetails?Advertiser=${Advertiser}&name=${name}`, {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(result);
        setSuccessMessage(`Activity "${result.name}" retrieved successfully!`);
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
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/deleteActivity?Advertiser=${advertiser}&name=${name}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage(`Activity "${name}" deleted successfully!`);
        setIsCreated(false);
        setViewData(null);
        setActivities((prevActivities) =>
          prevActivities.filter((Act) => Act.name !== name)
        );
        setFormData({
          date: '',
          time: '',
          price: '',
          Category: '',
          tags: '',
         
          specialDiscounts: '',
          bookingOpen: false,
          location: '',
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
            <input type="text" name="Category" value={formData.Category} onChange={handleInputChange} />
          </div>
           <div>
            <label>Tags</label>
            <Select
                isMulti
                name="tags"
                options={availableTags}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleTagsChange}
                value={availableTags.filter(tag => formData.tags.includes(tag.value))} // Set the value based on the selected tags
            />
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
          {/* Location picker */}
        <div>
          <label><strong>Location:</strong></label>
          <MapPicker onLocationSelect={handleLocationSelect} />
        </div>

          {/* Removed Advertiser input field */}
        </div>
        
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
              <button onClick={(e) => handleGetActivity(e, activity.Advertiser,activity.name)}>View</button>
              <button onClick={(e) => handleDeleteActivity(e, activity.Advertiser, activity.name)}>Delete</button>
              <button onClick={(e) => handleUpdateClick(e,activity)}>update</button>
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
  <p><strong>Category:</strong> {viewData.Category}</p>
  
  {/* Displaying tags as a comma-separated string */}
  <p><strong>Tags:</strong> {viewData.tags.join(', ')}</p>
  
  <p><strong>Special Discounts:</strong> {viewData.specialDiscounts}</p>
  <p><strong>Booking Open:</strong> {viewData.bookingOpen ? 'Yes' : 'No'}</p>
  <p><strong>Advertiser:</strong> {viewData.Advertiser}</p>
  

  <p><strong>Location:</strong> {viewData.location || 'Not specified'}</p>
</div>
      )}
    </div>
  );
};

export default AdvertiserActivity;