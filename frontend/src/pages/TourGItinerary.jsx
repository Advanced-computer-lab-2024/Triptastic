import React, { useState, useEffect} from 'react';
import image from '../images/image.png';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { FaList,FaListAlt,FaHourglassHalf,FaBus,FaCheck, FaMapMarkerAlt, FaClock, FaLanguage, FaDollarSign, FaCalendarAlt, FaWheelchair, FaCar } from "react-icons/fa";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';

function TourGItinerary() {
    const [itineraries, setItineraries] = useState([]);
    const [filteredItineraries, setFilteredItineraries] = useState([]); // Filtered itineraries
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
  const [waiting, setWaiting] = useState(false);
const [modalOpen, setModalOpen] = useState(false);
const [touristItineraryData, setTouristItineraryData] = useState({
    Activities: '',
    Locations: '',
    startDate:'',
    endDate:'',
    Tags:'',
  });
  const Username = localStorage.getItem('Username');

  const [touristItineraries,setTouristItineraries]=useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null); 
  const [selectedTouristItinerary, setSelectedTouristItinerary] = useState(null); 
  const [itineraryData, setItineraryData] = useState({
    Activities: '',
    Locations: '',
    Timeline: '',
    DurationOfActivity: '',
    Language: '',
    Price: 0,
    DatesTimes: '',
    Accesibility: '',
    pickUpDropOff: '',
    bookingOpen: false,
  });
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: '',
    photo:''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isIVisible, setIsIVisible] = useState(false);
  const [isTIVisible, setIsTIVisible] = useState(false);
  const [isCreatingItinerary, setIsCreatingItinerary] = useState(false);
  const [isEditingItinerary, setIsEditingItinerary] = useState(false); // New state for editing itinerary
  const [isCreatingTouristItinerary, setIsCreatingTouristItinerary] = useState(false);
  const [isEditingTouristItinerary, setIsEditingTouristItinerary] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
   
    fetchItineraries();
    setLoading(false);
    fetchTouristItineraries();
  }, []);
  const fetchItineraries = async () => {
    const Username = localStorage.getItem('Username');

    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getMyItineraries?Username=${Username}`);
        if (response.ok) {
          const data = await response.json();
          setItineraries(data);
          setFilteredItineraries(data); 
        } else {
          throw new Error('Failed to fetch itineraries');
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    }
  };

  const fetchTouristItineraries = async () => {
    const Username = localStorage.getItem('Username');

    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getMyTouristItineraries?Username=${Username}`);
        if (response.ok) {
          const data = await response.json();
          setTouristItineraries(data);
        } else {
          throw new Error('Failed to fetch itineraries');
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    }
  };

  const handleItineraryChange = (e) => {
    const { name, value } = e.target;
    setItineraryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleTouristItineraryChange = (e) => {
    const { name, value } = e.target;
    setTouristItineraryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleItinerarySubmit = async (e) => {
    e.preventDefault();
    const Username = localStorage.getItem('Username');

    const activitiesArray = itineraryData.Activities.split(',').map((activity) => activity.trim());
    const locationsArray = itineraryData.Locations.split(',').map((location) => location.trim());

    const updatedItineraryData = {
      ...itineraryData,
      Activities: activitiesArray,
      Locations: locationsArray,
      TourGuide: Username,
    };

    try {
      const response = await fetch('http://localhost:8000/addItinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItineraryData),
      });
       
      if (response.ok) {
        await fetchItineraries();
        setErrorMessage('');
        setIsCreatingItinerary(false);
        setItineraryData({
          Activities: '',
          Locations: '',
          Timeline: '',
          DurationOfActivity: '',
          Language: '',
          Price: 0,
          DatesTimes: '',
          Accesibility: '',
          pickUpDropOff: '',
          bookingOpen: false,

        });
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
        console.error('Error response:', errorData);
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the itinerary');
      console.error('Error occurred while adding the itinerary:', error);
    }
  };
  const handleTouristItinerarySubmit = async (e) => {
    e.preventDefault();
    const Username = localStorage.getItem('Username');

    const tagsArray = touristItineraryData.Tags.split(',').map((tag) => tag.trim());
    const locationsArray = touristItineraryData.Locations.split(',').map((location) => location.trim());
    const activitiesArray = touristItineraryData.Activities.split(',').map((activity) => activity.trim());

    const updatedTouristItineraryData = {
      ...touristItineraryData,
      Tags: tagsArray,
      Locations: locationsArray,
      Activities: activitiesArray,
      tourGuide: Username,
    };

    try {
      const response = await fetch('http://localhost:8000/addTouristItinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTouristItineraryData),
      });

      if (response.ok) {
        await fetchTouristItineraries();
        setErrorMessage('');
        setIsCreatingTouristItinerary(false);
        setTouristItineraryData({
          Activities: '',
          Locations: '',
          startDate:'',
          endDate:'',
          Tags:'',
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
        console.error('Error response:', errorData);
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the itinerary');
      console.error('Error occurred while adding the itinerary:', error);
    }
  };

  const handleViewItinerary = (itinerary) => {
    setSelectedItinerary(itinerary);
    setIsEditingItinerary(false); // Reset editing state
    setIsIVisible((prevState) => !prevState);
  };
  const handleViewTouristItinerary = (tourisItinerary) => {
    setSelectedTouristItinerary(tourisItinerary);
    setIsEditingTouristItinerary(false); // Reset editing state
    setIsTIVisible((prevState) => !prevState);
  };

  const handleEditItinerary = (itinerary) => {
    setItineraryData({
      Activities: itinerary.Activities.join(', '),
      Locations: itinerary.Locations.join(', '),
      Timeline: itinerary.Timeline,
      DurationOfActivity: itinerary.DurationOfActivity,
      Language: itinerary.Language,
      Price: itinerary.Price,
      DatesTimes: itinerary.DatesTimes,
      Accesibility: itinerary.Accesibility,
      pickUpDropOff: itinerary.pickUpDropOff,
      bookingOpen: itinerary.bookingOpen,

    });
    setSelectedItinerary(itinerary);
    setIsEditingItinerary(true); // Set editing state to true
  };
  const handleEditTouristItinerary = (touristItinerary) => {
    setTouristItineraryData({
      Activities: touristItinerary.Activities.join(', '),
      Locations: touristItinerary.Locations.join(', '),
      startDate: touristItinerary.startDate,
      endDate: touristItinerary.endDate,
      Tags: touristItinerary.Tags.join(', '),
    });
    setSelectedTouristItinerary(touristItinerary);
    setIsEditingTouristItinerary(true); // Set editing state to true
  };
  const handleDeleteItinerary = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/deleteItinerary/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchItineraries();
        setSelectedItinerary(null);
        
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the itinerary');
      console.error('Error occurred while deleting the itinerary:', error);
    }
  };
  const handleDeleteTouristItinerary = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/deletetouristItinerary/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchTouristItineraries();
        setSelectedTouristItinerary(null);
        
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the itinerary');
      console.error('Error occurred while deleting the itinerary:', error);
    }
  };
  const handleUpdateItinerary = async (e) => {
    e.preventDefault();

    const activitiesArray = itineraryData.Activities.split(',').map((activity) => activity.trim());
    const locationsArray = itineraryData.Locations.split(',').map((location) => location.trim());

    const updatedItineraryData = {
      ...itineraryData,
      Activities: activitiesArray,
      Locations: locationsArray,
    };

    try {
      const response = await fetch(`http://localhost:8000/updateItinerary/${selectedItinerary._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItineraryData),
      });

      if (response.ok) {
        await fetchItineraries();
        setIsEditingItinerary(false);
        setSelectedItinerary(null);
        setModalOpen(false); // Close the modal
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the itinerary');
      console.error('Error occurred while updating the itinerary:', error);
    }
  };
  
  const handleUpdateTouristItinerary = async (e) => {
    e.preventDefault();

    const activitiesArray = touristItineraryData.Activities.split(',').map((activity) => activity.trim());
    const locationsArray = touristItineraryData.Locations.split(',').map((location) => location.trim());
    const tagsArray = touristItineraryData.Tags.split(',').map((tag) => tag.trim());
    const updatedTouristItineraryData = {
      ...touristItineraryData,
      Activities: activitiesArray,
      Locations: locationsArray,
      Tags: tagsArray
    };

    try {
      const response = await fetch(`http://localhost:8000/updatetouristItinerary/${selectedTouristItinerary._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTouristItineraryData),
      });

      if (response.ok) {
        await fetchTouristItineraries();
        setIsEditingTouristItinerary(false);
        setSelectedTouristItinerary(null);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the itinerary');
      console.error('Error occurred while updating the itinerary:', error);
    }
  };
  const deactivateItinerary = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/deactivateItinrary/${id}`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        await fetchItineraries();
        setSelectedItinerary(null);
       
        
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while deactivating the itinerary');
      console.error('Error occurred while deactivating the itinerary:', error);
    }
  };
  const activateItinerary = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/activateItinrary/${id}`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        await fetchItineraries();
        setSelectedItinerary(null);
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while activating the itinerary');
      console.error('Error occurred while activating the itinerary:', error);
    }
  };

  return (
    <div style={styles.container}>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
  
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={image} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title}>My Itineraries</h1>
        <FaUserCircle
          style={styles.profileIcon}
          title="Edit Profile"
          onClick={() => navigate("/tour-guide-profile")}
        />
      </header>
  
{/* Create Itinerary Section */}
<div style={styles.formSection}>
  <h2 style={styles.sectionTitle}>Create Itinerary</h2>
  <form onSubmit={handleItinerarySubmit} style={styles.form}>
    <div style={styles.inputGroup}>
      <FaList style={styles.inputIcon} />
      <span style={styles.inputLabel}>Activities:</span>
      <input
        type="text"
        name="Activities"
        placeholder="Enter activities"
        value={itineraryData.Activities}
        onChange={handleItineraryChange}
        style={styles.input}
        required
      />
    </div>
    <div style={styles.inputGroup}>
      <FaMapMarkerAlt style={styles.inputIcon} />
      <span style={styles.inputLabel}>Locations:</span>
      <input
        type="text"
        name="Locations"
        placeholder="Enter locations"
        value={itineraryData.Locations}
        onChange={handleItineraryChange}
        style={styles.input}
        required
      />
    </div>
    <div style={styles.inputGroup}>
      <FaClock style={styles.inputIcon} />
      <span style={styles.inputLabel}>Timeline:</span>
      <input
        type="text"
        name="Timeline"
        placeholder="Enter timeline"
        value={itineraryData.Timeline}
        onChange={handleItineraryChange}
        style={styles.input}
        required
      />
    </div>
    <div style={styles.inputGroup}>
      <FaHourglassHalf style={styles.inputIcon} />
      <span style={styles.inputLabel}>Duration:</span>
      <input
        type="text"
        name="DurationOfActivity"
        placeholder="Enter duration"
        value={itineraryData.DurationOfActivity}
        onChange={handleItineraryChange}
        style={styles.input}
        required
      />
    </div>
    <div style={styles.inputGroup}>
      <FaLanguage style={styles.inputIcon} />
      <span style={styles.inputLabel}>Language:</span>
      <input
        type="text"
        name="Language"
        placeholder="Enter language"
        value={itineraryData.Language}
        onChange={handleItineraryChange}
        style={styles.input}
        required
      />
    </div>
    <div style={styles.inputGroup}>
      <FaDollarSign style={styles.inputIcon} />
      <span style={styles.inputLabel}>Price:</span>
      <input
        type="number"
        name="Price"
        placeholder="Enter price"
        value={itineraryData.Price}
        onChange={handleItineraryChange}
        style={styles.input}
        required
      />
    </div>
    <div style={styles.inputGroup}>
      <FaCalendarAlt style={styles.inputIcon} />
      <span style={styles.inputLabel}>Dates/Times:</span>
      <input
        type="text"
        name="DatesTimes"
        placeholder="Enter dates/times(YYYY-MM-DD)"
        value={itineraryData.DatesTimes}
        onChange={handleItineraryChange}
        style={styles.input}
        required
      />
    </div>
    <div style={styles.inputGroup}>
      <FaWheelchair style={styles.inputIcon} />
      <span style={styles.inputLabel}>Accessibility:</span>
      <input
        type="text"
        name="Accesibility"
        placeholder="Enter accessibility options"
        value={itineraryData.Accesibility}
        onChange={handleItineraryChange}
        style={styles.input}
        required
      />
    </div>
    <div style={styles.inputGroup}>
      <FaCar style={styles.inputIcon} />
      <span style={styles.inputLabel}>Pick Up/Drop Off:</span>
      <input
        type="text"
        name="pickUpDropOff"
        placeholder="Enter pick up/drop off details"
        value={itineraryData.pickUpDropOff}
        onChange={handleItineraryChange}
        style={styles.input}
        required
      />
    </div>
    <div style={styles.checkboxGroup}>
      <input
        type="checkbox"
        name="bookingOpen"
        checked={itineraryData.bookingOpen}
        onChange={(e) =>
          setItineraryData((prev) => ({
            ...prev,
            bookingOpen: e.target.checked,
          }))
        }
        style={styles.checkbox}
      />
      <label style={styles.checkboxLabel}>Booking Open</label>
    </div>
    <button type="submit" style={styles.submitButton}>
      Add Itinerary
    </button>
  </form>
</div>
  
 {/* Itineraries List Section */}
<div style={styles.itinerariesSection}>
  <h2 style={styles.sectionTitle}>Your Itineraries</h2>
  {filteredItineraries.length > 0 ? (
    <ul style={styles.list}>
      {filteredItineraries.map((itinerary) => (
        <li key={itinerary._id} style={styles.listItem}>
          <div style={styles.itineraryInfo}>
            <p style={styles.listText}>
              <FaMapMarkerAlt style={styles.icon} />
              <strong>Locations:</strong> {itinerary.Locations.join(", ")}
            </p>
            <p style={styles.listText}>
              <EventOutlinedIcon style={styles.icon} />
              <strong>Dates:</strong> {itinerary.DatesTimes}
            </p>
            <p style={styles.listText}>
              <CheckCircleOutlineOutlinedIcon style={styles.icon} />
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: itinerary.active ? "#0F5132" : "#dc3545",
                  fontWeight: "bold",
                }}
              >
                {itinerary.active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
          <div style={styles.actions}>
            <button
              style={styles.viewButton}
              onClick={() => handleViewItinerary(itinerary)}
            >
              <InfoOutlinedIcon style={styles.icon} />
              {selectedItinerary === itinerary && isIVisible
                ? "Hide Details"
                : "View Details"}
            </button>
            <button
              style={styles.editButton}
              onClick={() => {
                setItineraryData({
                  Activities: itinerary.Activities.join(", "),
                  Locations: itinerary.Locations.join(", "),
                  Timeline: itinerary.Timeline,
                  DurationOfActivity: itinerary.DurationOfActivity,
                  Language: itinerary.Language,
                  Price: itinerary.Price,
                  DatesTimes: itinerary.DatesTimes,
                  Accesibility: itinerary.Accesibility,
                  pickUpDropOff: itinerary.pickUpDropOff,
                  bookingOpen: itinerary.bookingOpen,
                });
                setSelectedItinerary(itinerary);
                setModalOpen(true);
              }}
            >
              <BorderColorOutlinedIcon style={styles.icon} />
              Edit
            </button>
            <button
              style={{
                ...styles.toggleButton,
                backgroundColor: itinerary.active ? "#dc3545" : "#0F5132",
              }}
              onClick={() =>
                itinerary.active
                  ? deactivateItinerary(itinerary._id)
                  : activateItinerary(itinerary._id)
              }
            >
              {itinerary.active ? "Deactivate" : "Activate"}
            </button>
            <HighlightOffOutlinedIcon
              style={styles.deleteIcon}
              onClick={() => handleDeleteItinerary(itinerary._id)}
              titleAccess="Delete Itinerary"
            />
          </div>

          {selectedItinerary === itinerary && isIVisible && (
  <div style={styles.detailsContainer}>
    <ul style={styles.detailsList}>
      <li style={styles.detailsItem}>
        <FaListAlt style={styles.detailsIcon} />
        <span><strong>Activities:</strong> {itinerary.Activities.join(", ")}</span>
      </li>
      <li style={styles.detailsItem}>
        <FaClock style={styles.detailsIcon} />
        <span><strong>Timeline:</strong> {itinerary.Timeline}</span>
      </li>
      <li style={styles.detailsItem}>
        <FaHourglassHalf style={styles.detailsIcon} />
        <span><strong>Duration:</strong> {itinerary.DurationOfActivity}</span>
      </li>
      <li style={styles.detailsItem}>
        <FaLanguage style={styles.detailsIcon} />
        <span><strong>Language:</strong> {itinerary.Language}</span>
      </li>
      <li style={styles.detailsItem}>
        <FaDollarSign style={styles.detailsIcon} />
        <span><strong>Price:</strong> ${itinerary.Price}</span>
      </li>
      <li style={styles.detailsItem}>
        <FaWheelchair style={styles.detailsIcon} />
        <span><strong>Accessibility:</strong> {itinerary.Accesibility}</span>
      </li>
      <li style={styles.detailsItem}>
        <FaBus style={styles.detailsIcon} />
        <span><strong>Pick Up/Drop Off:</strong> {itinerary.pickUpDropOff}</span>
      </li>
      <li style={styles.detailsItem}>
        <FaCheck style={styles.detailsIcon} />
        <span>
          <strong>Booking Open:</strong> {itinerary.bookingOpen ? "Yes" : "No"}
        </span>
      </li>
    </ul>
  </div>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p style={styles.noData}>No itineraries found.</p>
  )}
</div>
  
      {/* Edit Itinerary Modal */}
      {modalOpen && (
        <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
          >
            <h2 style={styles.modalContentH2}>Edit Itinerary</h2>
            <HighlightOffOutlinedIcon
          onClick={() => setModalOpen(false)}
          style={styles.cancelIcon} // Apply cancel icon style
        />
            <form onSubmit={handleUpdateItinerary}>
              {[
                { name: "Activities", type: "text", label: "Activities" },
                { name: "Locations", type: "text", label: "Locations" },
                { name: "Timeline", type: "text", label: "Timeline" },
                {
                  name: "DurationOfActivity",
                  type: "text",
                  label: "Duration Of Activity",
                },
                { name: "Language", type: "text", label: "Language" },
                { name: "Price", type: "number", label: "Price" },
                { name: "DatesTimes", type: "text", label: "Dates/Times" },
                { name: "Accesibility", type: "text", label: "Accessibility" },
                {
                  name: "pickUpDropOff",
                  type: "text",
                  label: "Pick Up/Drop Off",
                },
              ].map((field) => (
                <div key={field.name} style={styles.formGroup}>
                  <label style={styles.modalContentLabel}>{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={itineraryData[field.name]}
                    onChange={handleItineraryChange}
                    style={styles.modalContentInput}
                    required
                  />
                </div>
              ))}
              <label style={styles.modalContentLabel}>
                Booking Open
                <input
                  type="checkbox"
                  name="bookingOpen"
                  checked={itineraryData.bookingOpen}
                  onChange={(e) =>
                    setItineraryData((prev) => ({
                      ...prev,
                      bookingOpen: e.target.checked,
                    }))
                  }
                />
              </label>
              <div style={styles.buttonContainer}>
                <button type="submit" style={styles.modalContentButton}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
}

const styles = {
  container: {
    top:'-90px',
     margin: '90px auto',
    maxWidth: '1200px',
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
    fontWeight: 'bold',
    margin: 0,
    marginRight:'20px'
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
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
 
  formSection: {
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#eef9f0",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
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
    padding: "10px 20px",
    backgroundColor: "#0F5132",
    color: "white",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  buttonIcon: {
    fontSize: "16px",
  },
  itinerariesSection: {
    marginTop: "20px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    position: "relative", // Enable positioning for child elements
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#fff", // Clean background for visibility
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Subtle shadow
    display: "flex",
    flexDirection: "column",
  },
  deleteIcon: {
    position: "absolute", // Position in the top-right
    top: "5px", // Adjust as needed
    right: "5px", // Adjust as needed
    fontSize: "25px", // Moderate size
    color: "#dc3545",
    cursor: "pointer",
    transition: "transform 0.2s",
    ":hover": {
      transform: "scale(1.2)", // Slightly enlarge on hover
    },
  },
  itineraryInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  listText: {
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-start",
  },
  icon: {
    fontSize: "18px",
    color: "grey",
  },
  viewButton: {
    padding: "5px 10px", // Smaller padding
    backgroundColor: "#0F5132",
    color: "white",
    borderRadius: "5px", // Smaller border radius
    cursor: "pointer",
    fontSize: "14px", // Smaller font size
    display: "flex",
    alignItems: "center",
    gap: "5px",
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
  toggleButton: {
    padding: "5px 10px",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
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
  detailsContainer: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  detailsList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  detailsItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px", // Smaller text size
    color: "#333",
    marginBottom: "8px",
  },
  detailsIcon: {
    fontSize: "16px", // Icon size
    color: "#0F5132", // Consistent green color for icons
  },
  noData: {
    textAlign: "center",
    color: "#555",
    marginTop: "20px",
  },
  
}
export default TourGItinerary;
