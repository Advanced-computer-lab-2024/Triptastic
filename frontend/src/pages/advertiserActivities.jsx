import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import MapPicker from './MapPicker';
import Modal from "react-modal";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaBell,FaUserCircle} from 'react-icons/fa';
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, FaDollarSign,FaSearch} from "react-icons/fa";
  import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';



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
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState({});
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [activityDetails, setActivityDetails] = useState({});

  const navigate = useNavigate();


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
const handleLocationSelect2 = (address) => {
  setFormData((prevData) => ({
    ...prevData,
    location: address, // Use `location` consistently
  }));
  console.log("Selected Location Address:", address);
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
    location: formData.location,
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
        alert(`Activity "${newActivity.name}" created successfully!`);
        setIsCreated(true);
        setViewData(newActivity);
        setActivities((prevActivities) => [...prevActivities, newActivity]);
        setFormData({
          date: '',
          time: '',
          price: '',
          Category: '',
          tags: '',
          rating:0,
          specialDiscounts: '',
          bookingOpen: false,
          location: '',
          name: '',
      });
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
    setIsModalOpen(true);
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
      rating:formData.rating,
      specialDiscounts: formData.specialDiscounts,
      bookingOpen: formData.bookingOpen,
      location: formData.location,
      
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
          alert(`Activity "${result.name}" updated successfully!`);
          setIsModalOpen(false);
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
              rating:0,
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
        alert(`Activity "${name}" deleted successfully!`);
        setIsCreated(false);
        setViewData(null);
        setActivities((prevActivities) =>
          prevActivities.filter((Act) => Act.name !== name)
        );
      
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to delete activity.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting.');
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const username = localStorage.getItem('Username');
        const response = await fetch(`http://localhost:8000/getActivity?Advertiser=${username}`);
        if (!response.ok) throw new Error('Failed to fetch activities');
  
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setErrorMessage('Failed to load activities.');
      }
    };
  
    fetchActivities();
  }, []);

  const toggleViewDetails = (id) => {
    setActivityDetails((prevDetails) => ({
        ...prevDetails,
        [id]: {
            visible: !prevDetails[id]?.visible, // Toggle visibility
        },
    }));
};

  
  
  
   // Handle closing the modal
   const closeModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };
  const resetFormData = () => {
    setFormData({
      date: "",
      time: "",
      price: "",
      Category: "",
      tags: [],
      rating: 0,
      specialDiscounts: "",
      bookingOpen: false,
      location: "",
      name: "",
    });
  };
  
    // Modal Styles
    const modalStyles = {
      content: {
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      },
      cancelIcon: {
        color: '#0F5132', // Set the color of the icon
        fontSize: '30px', // Adjust the size as needed
        cursor: 'pointer', // Ensure it acts as a button
        position: 'absolute', // Position it correctly in the modal
        right: '500px', // Adjust placement
        top: '100px', // Adjust placement
      },
      header: {
        height:'60px',
        position: 'fixed', // Make the header fixed
        top: '0', // Stick to the top of the viewport
        left: '0',
        width: '100%', // Make it span the full width of the viewport
        backgroundColor: '#0F5132', // Green background
        color: 'white', // White text
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth
        zIndex: '1000', // Ensure it appears above other content
      },
      headerIconsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px', // Spacing between the icons
      },
      leftContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px', // Adjust spacing between icons
      },
      logoContainer: {
        display: 'flex',
        alignItems: 'center',
      },
      logo: {
        height: '60px',
        width: '70px',
        borderRadius: '10px',
      },
      
     
      profileIcon: {
        fontSize: '30px',
        color: 'white',
        cursor: 'pointer',
      },
      title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        margin: 0,
        marginLeft:'60px'
      },
    };
    return (
      <div className="advertiser-profile">

         {/* Header Section */}
    <header style={modalStyles.header}>
    <div style={modalStyles.logoContainer}>
      <img src={logo} alt="Logo" style={modalStyles.logo} />
    </div>
    <h1 style={modalStyles.title}>Advertiser Profile</h1>
    <div style={modalStyles.leftContainer}>
            <FaUserCircle
              alt="Profile Icon"
              style={modalStyles.profileIcon}
              onClick={() => navigate('/advertiser-profile')}          />
       
         
            
          </div>
  </header>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
       
        <form
        
          onSubmit={handleCreate}
          style={{
            maxWidth: "500px", // Reduce the width
            margin: "0 auto", // Center the form horizontally            margin: "0 auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
                  <h1 style={{fontSize:"25px", textAlign: "center" ,marginTop:"20px"}}> Activity Form</h1>

          <div style={{ display: "grid", gap: "15px" }}>
            <div>
   
              <input
                type="text"
                name="name"
                placeholder='Name'
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: "40%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}              />
            </div>
            <div>
            
              <input
                type="date"
                name="date"
                placeholder='Date'
                value={formData.date}
                onChange={handleInputChange}
                style={{ width: "40%",
                  padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
            </div>
            <div>
              <input
                type="time"
                name="time"
                placeholder='Time'
                value={formData.time}
                onChange={handleInputChange}
                style={{ width: "40%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
            </div>
            <div>
              <input
                type="number"
                name="price"
                placeholder='Price'
                value={formData.price}
                onChange={handleInputChange}
                style={{ width: "40%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
            </div>
            <div>
              <input
                type="text"
                name="Category"
                placeholder='Category'
                value={formData.Category}
                onChange={handleInputChange}
                style={{ width: "40%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ position: "relative" }}>

  <Select
    isMulti
    name="tags"
    placeholder='Tags'
    options={availableTags}
    className="basic-multi-select"
    classNamePrefix="select"
    onChange={handleTagsChange}
    value={availableTags.filter((tag) => formData.tags.includes(tag.value))}
    styles={{
      control: (base) => ({
        ...base,
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "14px",
        padding: "5px",
        boxShadow: "none",
        width: "30%",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 9999, // Prevents being hidden by other elements
        position: "absolute", // Ensures proper alignment
        top: 0, // Reset any offsets
      }),
      menuPortal: (base) => ({
        ...base,
        zIndex: 9999, // Make sure it's above other elements
      }),
    }}
  />
</div>

            <div>
              <input
                type="text"
                placeholder='Special Discounts'
                name="specialDiscounts"
                value={formData.specialDiscounts}
                onChange={handleInputChange}
                style={{ width: "40%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
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
              style={{ width: "50%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}

            />
          </div>   
            {/* Location picker */}
        <div>
          
          <label><strong>Location:</strong></label>
          
          <div style={{ width: "50%", height: "300px", marginTop: "10px", borderRadius: "10px", overflow: "hidden" }}>
  <MapPicker
  onLocationSelect={handleLocationSelect2}    style={{
      width: "100%",
      height: "100%", // Ensure the map fills the container
    }}
  />
</div>

        </div>

          {/* Removed Advertiser input field */}
        </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "20px",
              backgroundColor: "#0F5132",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Create Activity
          </button>
        </form>
  
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ textAlign: "center" }}>All Activities</h2>
          {activities.length > 0 ? (
          <div style={{ display: "grid", gap: "10px" }}>
            {activities.map((activity) => (
              <div
                key={activity._id}
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                }}
              >
                <h3>{activity.name}</h3>

<button
  onClick={() => toggleViewDetails(activity._id)}
  style={{
    marginBottom: '10px',
    padding: '5px 10px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }}
>
  {activityDetails[activity._id]?.visible ? 'Hide Details' : 'View Details'}
</button>

{activityDetails[activity._id]?.visible && (
  <div>
    <p><strong>Date:</strong> {activity.date}</p>
    <p><strong>Time:</strong> {activity.time}</p>
    <p><strong>Price:</strong> {activity.price}</p>
    <p><strong>Category:</strong> {activity.Category}</p>
    <p><strong>Tags:</strong> {activity.tags.join(', ')}</p>
    <p>
      <strong>Location:</strong>{' '}
      {activity.location || 'Not specified'}
    </p>
    <p><strong>Booking Open:</strong> {activity.bookingOpen ? 'Yes' : 'No'}</p>
  </div>
)}
              
        
                  <button
  onClick={(e) => handleUpdateClick(e, activity)}
  style={{
    padding: "5px 10px",
    backgroundColor: "#0F5132",

    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  }}
>
  Edit Activity
</button>
 {/* Delete Icon */}
 <HighlightOffOutlinedIcon
        onClick={(e) => handleDeleteActivity(e, activity.Advertiser, activity.name)}
        style={{
          color: "#0F5132",
          fontSize: "30px",
          cursor: "pointer",
          position: "absolute",
          right: "15px", // Position relative to the modal
          top: "15px", // Position relative to the modal
        }}
      />  

                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>No Activities available.</p>
          )}
        </div>
  
         {/* Activity Details Modal */}
      {/* Modal for Editing */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            maxWidth: "500px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          },
        }}
        ariaHideApp={false}
      >
        <h2 style={{ textAlign: "center" }}>Edit Activity</h2>
        
        <HighlightOffOutlinedIcon
    onClick={() => {
      setIsModalOpen(false);
      resetFormData();
    }}
    style={{
      color: "#0F5132",
      fontSize: "30px",
      cursor: "pointer",
      position: "absolute",
      right: "15px", // Position relative to the modal
      top: "15px", // Position relative to the modal
    }}
  />
        <form onSubmit={handleUpdate}>
          <div style={{ display: "grid", gap: "15px" }}>
            <div>
              <label><strong>Name:</strong></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div>
              <label><strong>Date:</strong></label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div>
              <label><strong>Time:</strong></label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div>
              <label><strong>Price:</strong></label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div>
              <label><strong>Category:</strong></label>
              <input
                type="text"
                name="Category"
                value={formData.Category}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
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
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
            />
        </div>
            <div>
              <label><strong>Special Discounts:</strong></label>
              <input
                type="text"
                name="specialDiscounts"
                value={formData.specialDiscounts}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div>
            <label><strong>Rating:</strong></label>
            <input
              type="Number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
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
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>   
            {/* Location picker */}
        <div>
          <label><strong>Location:</strong></label>
          <MapPicker onLocationSelect={handleLocationSelect} />
          
        </div>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "20px",
              backgroundColor: "#0F5132",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Update Activity
          </button>
        </form>
      </Modal>
      </div>
      </div>

    );
  

 
  
};

export default AdvertiserActivity;