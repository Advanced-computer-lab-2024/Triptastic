import React, { useState,useRef , useEffect} from 'react';
import { FaBars, FaTimes,FaHome, FaUser, FaMapMarkerAlt } from "react-icons/fa"; // For menu icons
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, } from "react-icons/fa";
import { FaPercentage, FaCalendarAlt, FaTag ,FaUserCircle} from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import IosShareIcon from '@mui/icons-material/IosShare';

import { FaBell ,FaCalendar,FaDollarSign ,FaClock,FaTags,FaPercent} from 'react-icons/fa'; // Import icons
import { FaSearch,
  } from "react-icons/fa";
  import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import Pyramids from '../images/pyramids.jpg';
import buck from '../images/buckingham.jpg';
import china from '../images/china.jpeg';
import temple from '../images/historic.jpg';
import neuch from '../images/neuch.jpeg';
import eiffel from '../images/eiffel.jpeg';
import ben from '../images/ben.jpeg';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { FiCopy } from 'react-icons/fi'; // Import a copy icon


import historicallocation from '../images/historical.jpg';
const HistoricalLocations = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [viewPlaces, setViewPlaces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [copySuccess, setCopySuccess] = useState({});
  const [shareableLink, setShareableLink] = useState('');
  const [email, setEmail] = useState('');
  const [HistToShare, setHistToShare] = useState(null);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [historicalPeriods, setHistoricalPeriods] = useState('');
  const shareDropdownRef = useRef(null);

  const tagOptions = [
    'Monuments',
    'Religious Sites', 
    'Palaces/Castles'
  ];
  const navigate = useNavigate();

  const handleProfileRedirect = () => {
    const context = localStorage.getItem('context');
  
    if (context === 'tourist') {
      navigate('/tourist-profile');
    } else if (context === 'guest') {
      navigate('/Guest');
    }  else {
      console.error('Unknown context');
      navigate('/'); // Fallback to home
    }
  }; 
   const handleViewAllHistoricalPlaces = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('http://localhost:8000/viewAllHistoricalPlacesTourist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'No historical locations found.');
        return;
      }

      let data = await response.json();
      console.log("All Historical Places Response:", data);
      if (!Array.isArray(data)) {
        data = [data];
      }

      setHistoricalPlaces(data);
    } catch (error) {
      console.error('Error fetching historical places:', error);
      setErrorMessage("No historical locations found.");
    } finally {
      setLoading(false);
      setViewPlaces(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareDropdownRef.current &&
        !shareDropdownRef.current.contains(event.target)
      ) {
        setHistToShare(null);
        setIsEmailMode(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    handleViewAllHistoricalPlaces();

  }, []);
  // Filter historical places by tag
  const handleFilter = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`http://localhost:8000/filterHistoricalLocationsByTagsTourist?Types=${selectedTag}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'No historical locations found with the specified tag type.');
        return;
      }

      let data = await response.json();
      console.log(`Filter ${selectedTag} Response:`, data);
      if (!Array.isArray(data)) {
        data = [data];
      }

      setHistoricalPlaces(data);
    } 
    catch (error) {
      console.error('Error filtering historical locations:', error);
      setErrorMessage("No historical locations found with the specified tag type.");
    } 
    finally {
      setLoading(false);
    }
  };

  // Search historical places by name or tag
  const handleSearch = async (query) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`http://localhost:8000/searchHistoricalLocations?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'No historical locations found.');
        return;
      }
  
      let data = await response.json();
      console.log("Search Response:", data);
      if (!Array.isArray(data)) {
        data = [data];
      }
  
      setHistoricalPlaces(data);
    } catch (error) {
      console.error('Error searching historical places:', error);
      setErrorMessage('No historical locations found.');
    } finally {
      setLoading(false);
    }
  };
  
  const onSearchSubmit = () => {
    if (searchTerm) {
      setSearchQuery(searchTerm); // Update the search query state
      const query = new URLSearchParams();
      query.append('name', searchTerm);
      handleSearch(query.toString()); // Pass the query directly to the search function
    } else if (selectedPeriod) {
      setSelectedTag(selectedPeriod); // Update the tag state
      handleFilter(); // Call filter if a period is selected
    }
  };
  
  const renderHistoricalPlaces = () => {
    return historicalPlaces.length > 0 ? (
      historicalPlaces.map(place => <li key={place._id}>{place.Name}</li>)
    ) : (
      <li>No historical places found.</li>
    );
  };
  const handleShare = async (historicallocation, shareMethod) => {
    try {
      // Format the request URL to match the backend route
      const response = await fetch(`http://localhost:8000/shareHistorical/${encodeURIComponent(historicallocation.Name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: shareMethod === 'email' ? email : '' // Only include email if method is 'email'
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setShareableLink(data.link); // Set the link to state
        if (shareMethod === 'copy') {
          await navigator.clipboard.writeText(data.link); // Copy link to clipboard
          alert('Link copied to clipboard!'); //
        } else if (shareMethod === 'email') {
          alert('Link sent to the specified email!');
          setEmail(''); // Clear email input field after sending the email
        }
      } else {
        console.error('Failed to generate shareable link');
      }
    } catch (error) {
      console.error('Error generating shareable link:', error);
    }
  };
  
  
  const handleEmailInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleShareMode = (historicallocation) => {
    setHistToShare(historicallocation);
    setIsEmailMode(!isEmailMode);
  };
  return (
    <div>
      {/* Sidebar Section */}
      <div
        style={styles.sidebar}
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
        <div style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaUniversity style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Sites
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/museums')}>
          <MuseumIcon style={styles.icon} />
          <span className="label" style={styles.label}>
            Museums
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/products')}>
          <FaBox style={styles.icon} />
          <span className="label" style={styles.label}>
            Products
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/itineraries')}>
          <FaMap style={styles.icon} />
          <span className="label" style={styles.label}>
            Itineraries
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/activities')}>
          <FaRunning style={styles.icon} />
          <span className="label" style={styles.label}>
            Activities
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-flights')}>
          <FaPlane style={styles.icon} />
          <span className="label" style={styles.label}>
            Book Flights
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-hotels')}>
          <HotelIcon style={styles.icon} />
          <span className="label" style={styles.label}>
            Book a Hotel
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-transportation')}>
          <FaBus style={styles.icon} />
          <span className="label" style={styles.label}>
            Transportation
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/tourist-orders')}>
          <FaClipboardList style={styles.icon} />
          <span className="label" style={styles.label}>
            Past Orders
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/AttendedActivitiesPage')}>
          <FaStar style={styles.icon} />
          <span className="label" style={styles.label}>
            Review Activities
          </span>
        </div>
      </div>

      {/* Main Content Section */}
      <div style={styles.container2}>
        {/* Background Section with search and filter */}
        <div style={styles.background}>
          {/* Search Section */}
          <div style={styles.searchSection}>
            <input
              type="text"
              placeholder="Search historical places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchForm1}
            />


            <button
              onClick={onSearchSubmit}
              disabled={!searchTerm && !selectedPeriod}
              style={styles.searchButton}
            >
              <FaSearch style={styles.searchIcon} />
            </button>

            {viewPlaces && (
  <>
   <div style={{ position: 'relative', textAlign: 'center' }}>
  <button
    onClick={() => setFilterVisible(!filterVisible)}
    style={{
      padding: '8px 16px',
      fontSize: '1rem',
      color: '#333',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '4px',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.3s, box-shadow 0.3s',
    }}
    onMouseOver={(e) => {
      e.target.style.backgroundColor = '#f1f1f1';
      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    }}
    onMouseOut={(e) => {
      e.target.style.backgroundColor = '#fff';
      e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }}
  >
    Filter Historical Locations
  </button>

  {filterVisible && (
    <div
      style={{
        position: 'absolute',
        top: '50px', // Space below the button
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: '280px',
        zIndex: 10,
      }}
    >
      <label
        htmlFor="tag-select"
        style={{
          display: 'block',
          marginBottom: '10px',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        Filter by Tag:
      </label>
      <select
        id="tag-select"
        onChange={(e) => {
          setSelectedPeriod(e.target.value); // Sync with period selection
          setSelectedTag(e.target.value);
        }}
        value={selectedTag}
        style={{
          padding: '8px',
          fontSize: '1rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
          marginBottom: '10px',
          width: '100%',
        }}
      >
        <option value="" disabled>
          Select a tag
        </option>
        <option value="Monuments">Monuments</option>
        <option value="Religious Sites">Religious Sites</option>
        <option value="Palaces/Castles">Castles/Palaces</option>
      </select>
      <button
        onClick={handleFilter}
        disabled={!selectedTag}
        style={{
          padding: '8px 16px',
          fontSize: '1rem',
          color: '#333',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: selectedTag ? 'pointer' : 'not-allowed',
          opacity: selectedTag ? '1' : '0.6',
          width: '100%',
        }}
      >
        Apply Filter
      </button>
    </div>
  )}
</div>


  </>
)}

          </div>
        </div>

        {/* Header Section */}
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Logo" style={styles.logo} />
          </div>
          <h1 style={{ fontSize: '24px', marginTop: '20px' }}>Historical Places</h1>
          <FaUserCircle
            alt="Profile Icon"
            style={styles.profileIcon}
            onClick={handleProfileRedirect}
          />
        </header>
      </div>


      {loading ? (
  <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Loading...</p>
) : (
  <div style={styles.cardContainer}>
    {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
    {historicalPlaces.map((historicallocation) => (
      <div key={historicallocation._id} style={styles.card}>
        <img
          src={
            historicallocation.Name === "The Great Pyramid of Giza"
              ? Pyramids
              : historicallocation.Name === "The Great Wall of China"
              ? china
              : historicallocation.Name === "Neuschwanstein Castle"
              ? neuch
              : historicallocation.Name === "eiffel tower"
              ? eiffel
              : historicallocation.Name === "luxor temple"
              ? temple
              : historicallocation.Name === "big ben"
              ? ben
              : historicallocation.Name === "buckingham palace"
              ? buck
              : historicallocation.mainImage || historicallocation // Fallback to a default image
          }
          alt={historicallocation.Name}
          style={styles.image}
        />
        <div style={styles.details}>
  <h2 style={styles.locationName}>{historicallocation.Name}</h2>
  <p style={styles.description}>{historicallocation.Description}</p>

  <div
    onClick={(e) => {
      // Prevent the event from bubbling up to the parent, ensuring the dropdown stays open when clicking inside
      e.stopPropagation();
    }}
    style={{ position: 'relative', display: 'inline-block' }}
  >
    <button
      onClick={() => handleShareMode(historicallocation)}
      style={styles.shareButton}
    >
      <IosShareIcon />
    </button>
    <button
      onClick={() => handleShareMode(historicallocation)}
      style={styles.shareOption}
    >
      <i className="fas fa-share-alt" style={styles.shareOptionIcon}></i>
    </button>

    {/* Dropdown */}
    {isEmailMode && HistToShare && HistToShare._id === historicallocation._id && (
      <div
        style={styles.shareDropdown}
        onClick={(e) => e.stopPropagation()} // Ensure clicking inside dropdown doesn't close it
      >
        <button
          onClick={() => handleShare(historicallocation, 'copy')}
          style={styles.shareOption}
        >
          <FiCopy style={styles.shareOptionIcon} /> Copy Link
        </button>
        {/* <button
          onClick={() => setIsEmailMode(false)}
          style={styles.shareOption}
        >
          {/* <MailOutlineIcon style={styles.shareOptionIcon} /> Share via Email */}
       {/* </button> */}

        {/* Email Input Field */}
        {isEmailMode && HistToShare._id === historicallocation._id && (
  <div style={{ marginTop: '10px' }}>
    <input
      type="email"
      placeholder="Enter recipient's email"
      value={email}
      onChange={handleEmailInputChange}
      style={styles.emailInput}
    />
    <button
      onClick={() => handleShare(historicallocation, 'email')}
      style={{ ...styles.button, marginTop: '10px' }}
    >
      Send Email
    </button>
  </div>
)}


        {/* Copy Success Message */}
        {copySuccess[historicallocation._id] && (
          <p style={styles.successMessage}>{copySuccess[historicallocation._id]}</p>
        )}
      </div>
    )}
  </div>
</div>

      </div>
    ))}
  </div>
)

}
</div>
  );};


const styles = {
  container2: {
    marginTop:'60px',
    fontFamily: 'Arial, sans-serif',
  },
  background: {
    position: 'relative',
    backgroundImage:  `url(${historicallocation})`, // Replace with your image path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '400px', // Adjust height as needed
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  },
  searchSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px', // Add spacing between elements
    marginTop: '20px',
  },
  searchForm: {
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '50px', // Make the input rounded
    border: '1px solid #ccc',
    outline: 'none',
    width: '500px', // Adjust width
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add a soft shadow
  },
  searchForm1: {
    padding: '12px 20px',
    fontSize: '16px',
    height:'50px',
    borderRadius: '50px', // Make the input rounded
    border: '1px solid #ccc',
    outline: 'none',
    width: '500px', // Adjust width
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add a soft shadow
  },
  searchSelect: {
    padding: '12px 20px',
    fontSize: '14px',
    borderRadius: '50px', // Make the dropdown rounded
    border: '1px solid #ccc',
    outline: 'none',
    backgroundColor: '#fff', // Ensure consistent background
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add a soft shadow
    width:'250px'
  },
  searchButton: {
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '50px', // Make the button rounded
    border: 'none',
    backgroundColor: 'transparent', // Set a vibrant green color
    color: '#fff', // White text color
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: '25px', // Adjust icon size
  },
  
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
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
  sidebar: {
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
  item: {
 
    padding: '10px 0',
    
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
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '60px',
    width: '70px',
    borderRadius: '10px',
  },
  profileIcon:{
    fontSize: '40px',
    cursor: 'pointer',

  },
  title: {
    textAlign: 'center',
    fontSize: '2.5rem',
    marginBottom: '20px',
  },
  button: {
    color:'#0F5132',
    padding: '10px 20px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  buttonsearch: {
    marginTop:'90px',
    color:'#0F5132',
    padding: '10px 20px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '16px',
    width: '300px',
    marginRight: '10px',

    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  dropdown: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'space-between',
  },
  

  emailInput: {
    padding: '10px',
    width: '100%',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },

  
    card: {
      display: 'flex',
      flexDirection: 'column', // Change to column for better layout
      alignItems: 'center',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: "350px", // Adjust the width
      padding: "10px", // Reduce padding for a shorter container
      height: "450px",
      backgroundColor: '#fff',
      marginBottom: '20px',
    },
    image: {
      width: '100%', // Make the image take the full width of the card
      height: '380px', // Adjust the height for better visibility
      objectFit: 'full', // Ensure the image scales correctly
    },
    details: {
      position: "relative", // Ensure the dropdown is positioned relative to this container
      padding: "20px",
      textAlign: "center",
    },
    museumName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: '0 0 10px',
    },
    description: {
      fontSize: '1rem',
      color: '#555',
      marginBottom: '20px',
    },
  
    shareButton: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '1.5rem',
      color: 'black',
      cursor: 'pointer',
      marginTop: '10px',
    },
    shareDropdown: {
      position: "absolute", // Position relative to parent
      top: "-230px", // Distance from the button (adjust as needed)
      left: "25%", // Center align with the button
      transform: "translateX(-50%)", // Center alignment adjustment
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      zIndex: "1000",
      padding: "10px",
      width: "200px", // Fixed width
    },
    
    
    shareOption: {
      display: "flex",
      alignItems: "center", // Align icon and text vertically
      justifyContent: "flex-start", // Align icon and text to the left
      width: "100%",
      padding: "10px",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      color: "black", // Icon and text color
      textDecoration: "none",
    },
    shareOptionIcon: {
      marginRight: "8px", // Space between the icon and text
      fontSize: "1.0rem", // Ensure both icons are the same size
    },
    };
    
  
export default HistoricalLocations;
