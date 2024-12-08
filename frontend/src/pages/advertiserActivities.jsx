import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import MapPicker from './MapPicker';
import Modal from "react-modal";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaBell,FaUserCircle} from 'react-icons/fa';
import { FaLandmark, FaEdit,FaMapMarkerAlt,FaCalendar,FaEye,FaTrash,FaPlus, FaTag, FaCheck, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
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
  const [showDeletePopup, setShowDeletePopup] = useState(null);

  const [activities, setActivities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [viewData, setViewData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen
  ] = useState(false);

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
    if (e) e.preventDefault(); // Only call preventDefault if e is defined
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

    return (
      <div style={styles.container}>
      <div className="advertiser-profile">
        {/* Header Section */}
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Logo" style={styles.logo} />
          </div>
          <h1 style={styles.title}>Activities</h1>
          <button style={styles.createButton} onClick={() => setIsCreateModalOpen(true)}>
  <FaPlus style={styles.createIcon} /> Add Activity
</button>
         
        </header>
    
        {/* Sidebar */}
        <div
          style={styles.sidebar}
          onMouseEnter={(e) => {
            e.currentTarget.style.width = '200px';
            Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
              (label) => (label.style.opacity = '1')
            );
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.width = '50px';
            Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
              (label) => (label.style.opacity = '0')
            );
          }}
        >
            <div className="profile" style={styles.item} onClick={() => navigate('/advertiser-profile')}>
            <FaUserCircle style={styles.iconn} />
            <span className="label" style={styles.label}>
              Profile
            </span>
          </div>
          <div className="activities" style={styles.item} onClick={() => navigate('/advertiser-Activities')}>
            <FaRunning style={styles.iconn} />
            <span className="label" style={styles.label}>
              My Activities
            </span>
          </div>
          <div className="transportation" style={styles.item} onClick={() => navigate('/createTransportation')}>
            <FaBus style={styles.iconn} />
            <span className="label" style={styles.label}>
              Transportation
            </span>
          </div>
        </div>
    
        {isCreateModalOpen && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>Create Activity</h2>
        <HighlightOffOutlinedIcon
          onClick={() => {setIsCreateModalOpen(false);resetFormData(); }}
          style={styles.cancelIcon}
        />
      </div>
      <form style={styles.form} onSubmit={handleCreate}>
        <div style={styles.inputGroup}>
            <BadgeOutlinedIcon style={styles.inputIcon} /> 
            <span style={styles.inputLabel}>Name:</span>
          <input
            type="text"
            name="name"
            placeholder="Enter activity name"
            value={formData.name}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
        
            <FaCalendar style={styles.inputIcon} />
            <span style={styles.inputLabel}>Date:</span>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
        
            <FaDollarSign style={styles.inputIcon} /> 
            <span style={styles.inputLabel}>Price:</span>
          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
            <FaClipboardList style={styles.inputIcon} />
            <span style={styles.inputLabel}>Category:</span>

          <input
            type="text"
            name="Category"
            placeholder="Enter a Category"
            value={formData.Category}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
            <FaTag style={styles.inputIcon} />
            <span style={styles.inputLabel}>Tags:</span>

          <Select
            isMulti
            name="tags"
            options={availableTags}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleTagsChange}
            value={availableTags.filter((tag) =>
              formData.tags.includes(tag.value)
            )}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "14px",
                padding: "5px",
                width:'400px'
              }),
            }}
          />
        </div>
        <div style={styles.inputGroup}>
          
            <FaClipboardList style={styles.inputIcon} /> 
            <span style={styles.inputLabel}>Special Discounts:</span>

          <input
            type="text"
            name="specialDiscounts"
            placeholder="Enter a discount"

            value={formData.specialDiscounts}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.checkboxGroup}>
          <FaCheck style={styles.inputIcon} />
          <input
            type="checkbox"
            name="bookingOpen"
            checked={formData.bookingOpen}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                bookingOpen: e.target.checked,
              }))
            }
            style={styles.checkbox}
          />
          <span style={styles.checkboxLabel}>Booking Open</span>
        </div>
        <div style={styles.inputGroup}>
            <FaMapMarkerAlt style={styles.inputIcon} /> 
            <span style={styles.inputLabel}>Locations:</span>

          <div style={styles.mapPickerContainer}>
            <MapPicker
              onLocationSelect={handleLocationSelect}
              style={styles.mapPicker}
            />
          </div>
        </div>
        <button type="submit" style={styles.submitButton}>
          Add Activity
        </button>
      </form>
    </div>
  </div>
)}

{/* Activities List */}
<ul
  style={{
    listStyle: 'none',
    padding: '0',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1000px',
  }}
>
  <h2
    style={{
      fontSize: '20px',
      fontWeight: '700',
      color: '#0F5132',
      textAlign: 'center',
      letterSpacing: '1px',
      borderBottom: '2px solid #0F5132',
      paddingBottom: '10px',
      marginBottom: '20px',
      textTransform: "uppercase", 

    }}
  >
    Your Activities
  </h2>

  {activities.map((activity) => (
    <li
      key={activity.id}
      style={{
        position: 'relative',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '15px',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#0F5132';
        e.currentTarget.style.transform = 'scale(1.03)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#ddd';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Delete Button */}
      <button
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '6px 12px',
            borderRadius: '5px',
            backgroundColor: '#d9534f',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.3s ease',
        }}
        onClick={() => setShowDeletePopup(activity._id)}
      >
        <FaTrash /> Delete
      </button>

      <div style={{ marginBottom: '10px' }}>
        <p
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0F5132',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '5px',
          }}
        >
          <FaMapMarkerAlt style={{ fontSize: '16px', color: '#0F5132' }} />
          {activity.name}
        </p>
        <p
          style={{
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '5px',
            color: '#333',
          }}
        >
          <FaMapMarkerAlt style={{ fontSize: '14px', color: '#0F5132' }} />
          <strong>Location:</strong> {activity.location}
        </p>
        <p
          style={{
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '5px',
            color: '#333',
          }}
        >
          <FaCalendar style={{ fontSize: '14px', color: '#0F5132' }} />
          <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
        </p>
        {activityDetails[activity._id]?.visible && (
          <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
            <p style={{ fontSize: '14px', marginBottom: '5px' }}>
              <strong>Time:</strong> {activity.time}
            </p>
            <p style={{ fontSize: '14px', marginBottom: '5px' }}>
              <strong>Price:</strong> ${activity.price}
            </p>
            <p style={{ fontSize: '14px', marginBottom: '5px' }}>
              <strong>Category:</strong> {activity.Category}
            </p>
            <p style={{ fontSize: '14px', marginBottom: '5px' }}>
              <strong>Tags:</strong> {activity.tags.join(', ')}
            </p>
            <p style={{ fontSize: '14px' }}>
              <strong>Booking Open:</strong>{' '}
              {activity.bookingOpen ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      </div>

      {/* Buttons Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          style={{
            padding: '6px 12px',
            borderRadius: '5px',
            backgroundColor: 'transparent',
            color: '#0F5132',
            border: '1px solid #0F5132',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onClick={() => toggleViewDetails(activity._id)}
        >
          <FaEye style={{ fontSize: '14px' }} />{' '}
          {activityDetails[activity._id]?.visible ? 'Hide Details' : 'View Details'}
        </button>
        <button
          style={{
            padding: '6px 12px',
            borderRadius: '5px',
            backgroundColor: '#0F312',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0d4b2a')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0F312')}
          onClick={(e) => handleUpdateClick(e, activity)}
        >
          <FaEdit style={{ fontSize: '14px', color: '#fff' }} /> Edit
        </button>
      </div>
    </li>
  ))}
</ul>


{/* Confirmation Popup */}
{showDeletePopup && (
  <div style={styles.popupOverlay}>
    <div style={styles.popup}>
      <p style={styles.popupText}>
        Are you sure you want to delete this activity?
      </p>
      <div style={styles.popupButtons}>
        <button
          style={styles.confirmButton}
          onClick={() => {
            const activityToDelete = activities.find(
              (act) => act._id === showDeletePopup
            );
            handleDeleteActivity(
              null, // Pass null because there's no event object in this case
              activityToDelete.Advertiser,
              activityToDelete.name
            );
            setShowDeletePopup(null); // Close the popup
          }}
        >
          Yes
        </button>
        <button
          style={styles.cancelButton}
          onClick={() => setShowDeletePopup(null)} // Close popup without deleting
        >
          No
        </button>
      </div>
    </div>
  </div>
)}

           {/* Modal for Editing */}
           {isModalOpen && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <h2 style={styles.modalTitle}>Edit Activity</h2>
      <HighlightOffOutlinedIcon 
          onClick={() => {
            setIsModalOpen(false);
            resetFormData();}}
          style={styles.cancel2Icon} // Apply cancel icon style
        />
      <form onSubmit={handleUpdate}>
      <div style={styles.inputGroup}>
            <BadgeOutlinedIcon style={styles.inputIcon} /> 
            <span style={styles.inputLabel}>Name:</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={styles.input2}
          />
        </div>
        <div style={styles.inputGroup}>
        
            <FaCalendar style={styles.inputIcon} />
            <span style={styles.inputLabel}>Date:</span>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            style={styles.input2}
          />
        </div>
        <div style={styles.inputGroup}>
        
            <FaDollarSign style={styles.inputIcon} /> 
            <span style={styles.inputLabel}>Price:</span>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            style={styles.input2}
          />
        </div>
        <div style={styles.inputGroup}>
            <FaClipboardList style={styles.inputIcon} />
            <span style={styles.inputLabel}>Category:</span>

          <input
            type="text"
            name="Category"
            value={formData.Category}
            onChange={handleInputChange}
            style={styles.input2}
          />
        </div>
        <div style={styles.inputGroup}>
            <FaTag style={styles.inputIcon} />
            <span style={styles.inputLabel}>Tags:</span>

          <Select
            isMulti
            name="tags"
            options={availableTags}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleTagsChange}
            value={availableTags.filter((tag) =>
              formData.tags.includes(tag.value)
            )}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "14px",
                padding: "5px",
                width:'400px'
              }),
            }}
          />
        </div>
        <div style={styles.inputGroup}>
          
            <FaClipboardList style={styles.inputIcon} /> 
            <span style={styles.inputLabel}>Special Discounts:</span>

          <input
            type="text"
            name="specialDiscounts"

            value={formData.specialDiscounts}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.checkboxGroup}>
          <FaCheck style={styles.inputIcon} />
          <input
            type="checkbox"
            name="bookingOpen"
            checked={formData.bookingOpen}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                bookingOpen: e.target.checked,
              }))
            }
            style={styles.checkbox}
          />
          <span style={styles.checkboxLabel}>Booking Open</span>
        </div>
        <div style={styles.inputGroup}>
            <FaMapMarkerAlt style={styles.inputIcon} /> 
            <span style={styles.inputLabel}>Locations:</span>

          <div style={styles.mapPickerContainer}>
            <MapPicker
              onLocationSelect={handleLocationSelect}
              style={styles.mapPicker}
            />
          </div>
        </div>
        <button type="submit" style={styles.submitButton}>
          Update Activity
        </button>
      </form>
    </div>
  </div>
)}

        </div>
      </div>
    );
    
  

 
  
};

const styles={
  
   itinerariesSection: {
    marginTop: "20px",
  },
  list: {
    padding: 0,
    listStyle: "none",
  },
  listItem: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  container: {
    maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontSize:'14px',
        marginTop:'50px'
  },
  sidebar: {
    position: 'fixed',
    top: '60px',
    left: 0,
    height: '100vh',
    width: '50px', // Default width when collapsed
    backgroundColor: 'rgba(15, 81, 50, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px 0',
    overflowX: 'hidden',
    transition: 'width 0.3s ease',
    zIndex: 1000,
  },
  sidebarExpanded: {
    width: '200px', // Width when expanded
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px',
    width: '100%', // Full width of the sidebar
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  iconContainerHover: {
    backgroundColor: '#084B24', // Background on hover
  },
  iconn: {
    fontSize: '24px',
    marginLeft: '15px', // Move icons slightly to the right
    color: '#fff', // Icons are always white
  },
  label: {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0, // Initially hidden
    whiteSpace: 'nowrap', // Prevent label text from wrapping
    transition: 'opacity 0.3s ease',
  },
  labelVisible: {
    opacity: 1, // Fully visible when expanded
  },
  item: {
    padding: '10px 0',
  },
  icon: {
    fontSize: "16px",
  },
  header: {
    height: '60px',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    backgroundColor: '#0F5132',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: '1000',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
    marginLeft: '60px',
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
  leftContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
  },

  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "500px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#0F5132",
    marginBottom: "15px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  inputIcon: {
    fontSize: "16px",
    color: "#0F5132",
  },
  inputLabel: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
    width: "120px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  input2: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    marginBottom:'30px'
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    margin: 0,
  },
  checkboxLabel: {
    fontSize: "14px",
    color: "#333",
  },
  submitButton: {
    padding: "5px 10px",
    backgroundColor: "#0F5132",
    color: "white",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    position: "relative", // Allows adjustment using top
    top: "-5px", // Moves the button up
    left: "50%", // Moves the button to the center horizontally
    transform: "translateX(-50%)", // Ensures it's perfectly centered
    display: "inline-block", // Ensures proper alignment
    textAlign: "center",
    marginTop:'20px'
  },
  mapPickerContainer: {
    width: "100%",
    height: "200px",
    marginTop: "10px",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid #ccc",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0F5132", // Matches the theme
    marginBottom: "15px",
    textAlign: "center", // Center-align the title
    borderBottom: "2px solid #0F5132", // Adds a subtle underline
    paddingBottom: "10px", // Adds spacing below the text
    letterSpacing: "1px", // Slightly spaced-out letters for readability
    textTransform: "uppercase", // Capitalizes all letters for emphasis
  },
  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: '20px 0',
  },
  activityItem: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
  },
  activityInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
 
  activityText: {
    fontWeight: 'bold',

    margin: 0,
    fontSize: '14px',
    color: '#grey',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  detailsIcon: {
    fontSize: '16px',
    color: '#0F5132',
  },
  detailSection: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  detailText: {
    fontSize: '14px',
    color: '#333',
    margin: '5px 0',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  button: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    justifyContent: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  viewButton: {
    padding: "5px 10px", // Smaller padding
    borderRadius: "5px", // Smaller border radius
    cursor: "pointer",
    fontSize: "14px", // Smaller font size
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: '#fff',
    color: '#0F5132',
    marginRight:'800px'
  },
  editButton: {
    padding: "4px 10px",
    backgroundColor: "#0F5132",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  deleteButton: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    border: "1px solid #dc3545", // Red border
    borderRadius: "5px",
    padding: "5px 10px",
    backgroundColor: "#dc3545", // Red background
    color: "white", // White text
    cursor: "pointer",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },
  mapPickerContainer: {
    width: '50%',
    height: '50px',
    marginTop: '10px',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  mapPicker: {
    width: '50%',
    height: '60%',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '50%',
    maxWidth: '600px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalContentH2: {
    fontSize: '22px',
    textAlign: 'center',
    color: '#333',
  },
  modalContentLabel: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'flex', alignItems: 'center', gap: '5px',
    color: '#555',
  },
  modalContentInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  },
  modalContentTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    resize: 'vertical',
  },
  modalCloseIcon: {
    color: "#0F5132",
    fontSize: "30px",
    cursor: "pointer",
    position: "absolute",
    right: "15px",
    top: "15px",
  },
  modalContentButton: {
    padding: '10px 20px',
    border: 'none',
    background: '#0F5132',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
 
  cancelIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '500px', // Adjust placement
    top: '110px', // Adjust placement
  },
  cancel2Icon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '500px', // Adjust placement
    top: '130px', // Adjust placement
  },
  createButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#0F5132",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    top:'-10px'
  },
  
  createButtonHover: {
    backgroundColor: "#084B24", // Darker green on hover
  },
  
  createIcon: {
    fontSize: "20px",
  },
  inputRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#0F5132",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  
  popup: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "300px",
  },
  
  popupText: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#333",
  },
  
  popupButtons: {
    display: "flex",
    justifyContent: "space-around",
    gap: "10px",
    fontSize: "14px",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
 
}

export default AdvertiserActivity;