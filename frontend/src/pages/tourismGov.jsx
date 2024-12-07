import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import logo from '../images/image.png';

import { FaBell, FaUserCircle ,FaCalendar,FaDollarSign ,FaMapMarkerAlt,FaClock,FaTags,FaPercent} from 'react-icons/fa'; // Import icons
import { FaLandmark, FaPlus, FaEdit,FaEye,FaTrash, FaUniversity, FaBox,FaTag, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,FaSearch,
  FaStar, } from "react-icons/fa";
  import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';
import { FaImage } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';


import LockResetIcon from '@mui/icons-material/LockReset';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

const MyLocations = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen
  ] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // State for selecting a location for viewing/editing
  const [viewOnly, setViewOnly] = useState(false); // State to control view vs. edit mode
  const [showDeletePopup, setShowDeletePopup] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); // State to handle updating mode



  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Location: '',
    OpeningHours: '',
    TicketPrices: {
      Foreigner: '',
      Student: '',
      Native: ''
    },
    Tags: {
      Types: ''
    },
    image: ''
  });

const toggleViewDetails = (locationName) => {
  if (selectedLocation === locationName) {
    setSelectedLocation(null); // Hide details if already selected
  } else {
    setSelectedLocation(locationName); // Show details for the selected location
  }
};

  const resetFormData = () => {
    setFormData({
      Name: '',
      Description: '',
      Location: '',
      OpeningHours: '',
      TicketPrices: {
        Foreigner: '',
        Student: '',
        Native: ''
      },
      Tags: {
        Types: ''
      },
      image: ''
    });
  };
  // Navigation handlers
  const handleCreateHistoricalLocation = () => navigate('/gov-historical');
  const handleCreateMuseum = () => navigate('/gov-museum');
  const handleMyLocations = () => navigate('/tourism-gov');
  const handleMyMuseums = () => navigate('/my-museums');
  // Fetch locations on component mount
  useEffect(() => {
    const fetchMyLocations = async () => {
      const tourismGovernor = localStorage.getItem('Username'); // Get Tourism Governor from local storage

      try {
        const response = await fetch(`http://localhost:8000/viewMyLocations?TourismGovernor=${tourismGovernor}`);

        if (response.ok) {
          const data = await response.json();
          setLocations(data);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Failed to fetch locations.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching locations.');
        console.error(error);
      }
    };

    fetchMyLocations();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdateClick = (e, location) => {
    e.preventDefault();
    setIsUpdating(true); // Set update mode to true
    setFormData(location); // Pre-fill the form with the data of the location to update
    setIsModalOpen2(true);
    //setSuccessMessage(`Editing location "${location.Name}"`); // Fixed backticks
  };  

  const handleTagsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      Tags: {
        ...prevData.Tags,
        [name]: value
      }
    }));
  };

  const handleTicketPricesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      TicketPrices: {
        ...prevData.TicketPrices,
        [name]: value
      }
    }));
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Retrieve TourismGovernor from local storage
    const TourismGovernor = localStorage.getItem('Username');

    // Ensure that TourismGovernor exists before proceeding
    if (!TourismGovernor) {
      setErrorMessage('Tourism Governor is not logged in or available.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/createhistoricalLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add TourismGovernor to the form data
        body: JSON.stringify({ ...formData, TourismGovernor })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Location "${result.Name}" created successfully!`);
        setLocations((prevLocations) => [...prevLocations, result]); // Add new location to the list

        // Reset form after successful creation
        setFormData({
          Name: '',
          Description: '',
          Location: '',
          OpeningHours: '',
          TicketPrices: {
            Foreigner: '',
            Student: '',
            Native: ''
          },
          Tags: {
            Types: ''
          },
          image: ''
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create historical location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the historical location.');
      console.error(error);
    }
  };
   // Change Password handler
   const handleChangePassword = async () => {
    const Username = localStorage.getItem('Username');

    try {
      console.log("Username:", Username); // Log username when the component mounts

      const response = await fetch(`http://localhost:8000/changePasswordTourismGov`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username, currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setErrorMessage('');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setErrorMessage(data.error);
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleView = async (name) => {
    setViewOnly(true); // Set view mode
    try {
      const response = await fetch(`http://localhost:8000/gethistoricalLocation?Name=${name}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedLocation(data);
        setFormData({
          Name: data.Name,
          Description: data.Description,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          TicketPrices: data.TicketPrices,
          Tags: data.Tags
        });
      } else {
        setErrorMessage('Failed to fetch location details for viewing.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching location details.');
    }
  };

  const handleEdit = async (name) => {
    setViewOnly(false); // Set edit mode
    try {
      const response = await fetch(`http://localhost:8000/gethistoricalLocation?Name=${name}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedLocation(data);
        setFormData({
          Name: data.Name,
          Description: data.Description,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          TicketPrices: data.TicketPrices,
          Tags: data.Tags
        });
      } else {
        setErrorMessage('Failed to fetch location details for editing.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching location details.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/updatehistoricalLocation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedLocation = await response.json();
        setLocations((prevLocations) =>
          prevLocations.map((location) =>
            location.Name === updatedLocation.Name ? updatedLocation : location
          )
        );
        setSelectedLocation(null); // Clear form after update
        alert(`Location  updated successfully!`);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to update location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the location.');
    }
  };

  const handleDelete = async (name) => {
    try {
      const response = await fetch(`http://localhost:8000/deletehistoricalLocation?Name=${name}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLocations((prevLocations) => prevLocations.filter((location) => location.Name !== name));
      } else {
        setErrorMessage('Failed to delete the location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the location.');
    }
  };

  
  return (
    <div style={styles.container}>
       {/* Sidebar */}
       <div
        style={styles.sidebar2}
        onMouseEnter={(e) => {
          e.currentTarget.style.width = '200px';
          Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
            (label) => (label.style.opacity = '1')
          );
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.width = '60px';
          Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
            (label) => (label.style.opacity = '0')
          );
        }}
      >
        <div   style={styles.item}    onClick={handleMyLocations} >
          <FaUniversity style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Sites
          </span>
        </div>
        <div  style={styles.item}  onClick={handleMyMuseums}>
          <MuseumIcon style={styles.icon} />
          <span className="label" style={styles.label}>
            Museums
          </span>
        </div>
       
      </div>

     {/* Header */}
<header style={styles.header}>
  <img src={logo} alt="Logo" style={styles.logo} />
  <h1 style={styles.title}>Tourism Governor Profile</h1>

  <div style={styles.headerIcons}>
    <button style={styles.createButton} onClick={() => setIsCreateModalOpen(true)} data-tooltip-id="create-location-tooltip"
  data-tooltip-content="Create Historical Location"  >
      <FaPlus style={styles.createIcon} /> 
      
    </button>
    <ReactTooltip id="create-location-tooltip" />
    <LockResetIcon
      style={styles.lockIcon}
      onClick={() => setIsModalOpen(true)}
    />
    <LogoutOutlinedIcon
      style={styles.logoutIcon}
      onClick={() => navigate('/Guest')}
    />
  </div>
</header>






{isCreateModalOpen && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <div style={styles.modalHeader}>
        <h2 style={styles.sectionTitle}>Create Historical Location</h2>
        <HighlightOffOutlinedIcon
          onClick={() => {
            setIsCreateModalOpen(false);
            resetFormData(); // Reset form data when modal is closed
          }}
          style={styles.cancelIcon}
        />
      </div>
      <form style={styles.form} onSubmit={handleCreate}>
        {/* Name */}
        <div style={styles.inputGroup}>
          <BadgeOutlinedIcon style={styles.inputIcon} />
          <span style={styles.inputLabel}>Name:</span>
          <input
            type="text"
            name="Name"
            placeholder="Enter location name"
            value={formData.Name}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>

        {/* Description */}
        <div style={styles.inputGroup}>
          <FaClipboardList style={styles.inputIcon} />
          <span style={styles.inputLabel}>Description:</span>
          <textarea
            name="Description"
            placeholder="Enter a description"
            value={formData.Description}
            onChange={handleInputChange}
            style={{ ...styles.input, height: '80px' }}
          />
        </div>

        {/* Location */}
        <div style={styles.inputGroup}>
          <FaMapMarkerAlt style={styles.inputIcon} />
          <span style={styles.inputLabel}>Location:</span>
          <input
            type="text"
            name="Location"
            placeholder="Enter location"
            value={formData.Location}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        {/* Opening Hours */}
        <div style={styles.inputGroup}>
          <FaClock style={styles.inputIcon} />
          <span style={styles.inputLabel}>Opening Hours:</span>
          <input
            type="text"
            name="OpeningHours"
            placeholder="e.g., 9:00 AM - 5:00 PM"
            value={formData.OpeningHours}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        {/* Ticket Prices */}
          <label style={styles.sectionTitle}>Ticket Prices:</label>
          <div style={styles.ticketPricesGroup}>
            {['Foreigner', 'Student', 'Native'].map((category) => (
              <div key={category} style={styles.inputLabel}>
                <label>{category}:</label>
                <input
                  type="number"
                  name={category}
                  value={formData.TicketPrices[category]}
                  onChange={handleTicketPricesChange}
                  style={styles.input}
                />
              </div>
            ))}
          </div>

        <div>
          <label>Tags (Type):</label>
          <select
            name="Types"
            value={formData.Tags.Types}
            onChange={handleTagsChange}
            required
          >
            <option value="">Select a type</option>
            <option value="Monuments">Monuments</option>
            <option value="Religious Sites">Religious Sites</option>
            <option value="Palaces">Palaces</option>
            <option value="Castles">Castles</option>
          </select>
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
          />
        </div>

        

        {/* Submit Button */}
        <button type="submit" style={styles.submitButton}>
          Create Location
        </button>
      </form>
    </div>
  </div>
)}


     

       {/* Change Password Modal */}
    {isModalOpen && (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <HighlightOffOutlinedIcon
            style={styles.cancelpasswordIcon}
            onClick={() => setIsModalOpen(false)}
          />
          <h2 style={styles.modalContentH2}>Change Password</h2>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={styles.modalContentInput}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.modalContentInput}
          />
          <button
            onClick={handleChangePassword}
            style={styles.modalContentButton}
          >
            Change Password
          </button>

          
        </div>
      </div>
    )}
 
      <div>
        {/* Historical Locations List */}
<ul style={styles.activityList}>
  <h2 style={styles.sectionTitle}>Your Historical Locations</h2>

  {locations.map((location) => (
    <li key={location.Name} style={styles.activityItem}>
      <div style={styles.activityInfo}>
        <p style={styles.activityText2}>
          <strong>{location.Name}</strong>
        </p>
        <p style={styles.activityText}>
          <FaMapMarkerAlt style={styles.detailsIcon} /> Location: {location.Location}
        </p>
        <p style={styles.activityText}>
          <FaClock style={styles.detailsIcon} /> Opening Hours: {location.OpeningHours}
        </p>
       
        
        <button
          style={{ ...styles.button, ...styles.viewButton }}
          onClick={() => toggleViewDetails(location.Name)}
        >
          <FaEye style={styles.detailsIcon} />
          {selectedLocation === location.Name ? ' Hide Details' : ' View Details'}
        </button>
        {selectedLocation === location.Name && (
          <div style={styles.detailSection}>
            <p style={styles.detailText}>
              <strong>Description:</strong> {location.Description}
            </p>
            <p style={styles.detailText}>
              <strong>Image:</strong> <img src={location.image} alt={location.Name} style={styles.locationImage} />
            </p>
            <p style={styles.detailText}>
          <strong>Ticket Prices:</strong>
          <ul style={styles.ticketPricesList}>
            <li>Foreigner: ${location.TicketPrices.Foreigner}</li>
            <li>Student: ${location.TicketPrices.Student}</li>
            <li>Native: ${location.TicketPrices.Native}</li>
          </ul>
        </p>
          </div>
        )}
      </div>
      <div style={styles.actionButtons}>
        <button
          style={{ ...styles.button, ...styles.editButton }}
          onClick={(e) => handleUpdateClick(e, location)}


        >
          <FaEdit /> Edit
        </button>
        <button
          style={{ ...styles.button, ...styles.deleteButton }}
          onClick={() => setShowDeletePopup(location.Name)} // Show confirmation popup
        >
          <FaTrash /> Delete
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
        Are you sure you want to delete this location?
      </p>
      <div style={styles.popupButtons}>
        <button
          style={styles.confirmButton}
          onClick={() => {
            handleDelete(showDeletePopup);
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

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
   
{/* Modal for Editing Historical Locations */}
{isModalOpen2 && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <h2 style={styles.sectionTitle}>Edit Historical Location</h2>
      <HighlightOffOutlinedIcon
        onClick={() => {
          setIsModalOpen2(false);
          resetFormData();
        }}
        style={styles.cancel2Icon} // Apply cancel icon style
      />
      <form  style={styles.form} onSubmit={handleUpdate}>
        <div style={styles.inputGroup}>
          <BadgeOutlinedIcon style={styles.inputIcon} />
          <span style={styles.inputLabel}>Name:</span>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            style={styles.input}
            disabled // Name should not be editable
          />
        </div>
        <div style={styles.inputGroup}>
          <FaClipboardList style={styles.inputIcon} />
          <span style={styles.inputLabel}>Description:</span>
          <textarea
            name="Description"
            value={formData.Description}
            onChange={handleInputChange}
            style={styles.textarea}
          />
        </div>
        <div style={styles.inputGroup}>
          <FaMapMarkerAlt style={styles.inputIcon} />
          <span style={styles.inputLabel}>Location:</span>
          <input
            type="text"
            name="Location"
            value={formData.Location}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <FaClock style={styles.inputIcon} />
          <span style={styles.inputLabel}>Opening Hours:</span>
          <input
            type="text"
            name="OpeningHours"
            value={formData.OpeningHours}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <FaDollarSign style={styles.inputIcon} />
          <span style={styles.inputLabel}>Ticket Prices:</span>
          <div style={styles.ticketPricesGroup}>
            <div>
              <label><b>Foreigner:</b></label>
              <input
                type="number"
                name="Foreigner"
                value={formData.TicketPrices.Foreigner}
                onChange={handleTicketPricesChange}
                style={styles.ticketInput}
              />
            </div>
            <div>
              <label><b>Student:</b></label>
              <input
                type="number"
                name="Student"
                value={formData.TicketPrices.Student}
                onChange={handleTicketPricesChange}
                style={styles.ticketInput}
              />
            </div>
            <div>
              <label><b>Native:</b></label>
              <input
                type="number"
                name="Native"
                value={formData.TicketPrices.Native}
                onChange={handleTicketPricesChange}
                style={styles.ticketInput}
              />
            </div>
          </div>
        </div>
        <div style={styles.inputGroup}>
          <FaTag style={styles.inputIcon} />
          <span style={styles.inputLabel}>Tags (Type):</span>
          <select
            name="Types"
            value={formData.Tags.Types}
            onChange={handleTagsChange}
            style={styles.select}
          >
            <option value="">Select a type</option>
            <option value="Monuments">Monuments</option>
            <option value="Religious Sites">Religious Sites</option>
            <option value="Palaces">Palaces</option>
            <option value="Castles">Castles</option>
          </select>
        </div>
        <div style={styles.inputGroup}>
          <FaImage style={styles.inputIcon} />
          <span style={styles.inputLabel}>Image URL:</span>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>
          Update Historical Location
        </button>
      </form>
    </div>
  </div>
)}


     
    </div>
      
       
    </div>
  );
  
};

const styles = {
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



  headerIcons: {
    display: "flex",
    alignItems: "center",
    gap: "15px", // Space between icons and button
  },


  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "500px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
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
    width:'800px'
  },
  detailText: {
    fontSize: '14px',
    color: '#333',
    margin: '5px 0',
  },
  ticketPricesList: {
    listStyleType: 'none',
    paddingLeft: '10px',
  },
  actionButtons: {
    marginLeft:'-800px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  button: {
    padding: '8px 12px',
    fontSize: '10px',
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
    top: '100px', // Adjust placement
  },
  cancel2Icon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '500px', // Adjust placement
    top: '90px', // Adjust placement
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
    marginBottom:'8px',
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
  activityText2: {
    fontWeight: 'bold',

    margin: 0,
    fontSize: '17px',
    color: '#grey',
    display: 'flex',
    alignItems: 'center',
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
 
  detailText: {
    fontSize: '14px',
    color: '#333',
    margin: '5px 0',
  },
  sidebar2: {
    position: 'fixed',
    top: '60px',
    left: 0,
    height: '100vh',
    width: '50px', // Default width when collapsed
    backgroundColor: 'rgba(15, 81, 50, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Ensure alignment starts from the left
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
    justifyContent: 'flex-start', // Align items to the left
    padding: '10px',
    width: '100%', // Take full width of the sidebar
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  iconContainerHover: {
    backgroundColor: '#084B24', // Background on hover
  },
  icon: {
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
  container: {
    margin: '90px auto',
    maxWidth: '1000px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    position: 'fixed',
    height: '60px',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#0F5132',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    zIndex: 1000,
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
  title: {
    fontSize: '24px',
    margin: 0,
    fontWeight: 'bold',
    marginLeft:'20px'
  },
  profileIcon: {
    fontSize: '40px',
    color: '#fff',
    cursor: 'pointer',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
  },
  logoutIcon: {
    cursor: 'pointer',
    color: 'white',
  },
  buttonHover: {
    backgroundColor: '#084B24',
  },
  passwordSection: {
    marginTop: '30px',
  },
  subTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  sidebar  :{
    marginTop: '20px',
  display: 'flex',       // Enables flexbox layout
  justifyContent: 'center', // Horizontally centers the content
  alignItems: 'center',  // Vertically centers the content
  textAlign: 'center',
  },
  sidebarList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#0F5132",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
  sidebarItemHover: {
    backgroundColor: "#084B24", // Darker green on hover
  },
  sidebarIcon: {
    marginRight: "10px",
    fontSize: "18px",
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
  }, modalContentInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  },cancelpasswordIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '490px', // Adjust placement
    top: '280px', // Adjust placement
  },modalContentButton: {
    padding: '10px 20px',
    border: 'none',
    background: '#0F5132',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  lockIcon: {
    fontSize: '30px',
    color: '#fff',
    cursor: 'pointer',
    marginRight:'20',
    marginTop:'3'

  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  successMessage: {
    color: '#0F5132',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  errorMessage: {
    color: '#dc3545',
    fontWeight: 'bold',
    marginTop: '10px',
  },
};

  


export default MyLocations;
