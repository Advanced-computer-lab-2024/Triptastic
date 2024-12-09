import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { CurrencyContext } from '../pages/CurrencyContext';
import { FaUserCircle,FaCalendar,FaDollarSign ,FaMapMarkerAlt,FaClock,FaLanguage,FaWheelchair,FaShuttleVan} from 'react-icons/fa';
import { FaBell,FaGlobe, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, } from "react-icons/fa";
import logo from '../images/image.png';
import itineraries from '../images/it.png';
import IosShareIcon from '@mui/icons-material/IosShare';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { FiCopy } from 'react-icons/fi'; // Import a copy icon
import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';

import { Tooltip as ReactTooltip } from 'react-tooltip';



const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [notificationRequested, setNotificationRequested] = useState({});
  const [shareableLink, setShareableLink] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState({});
  const [filters, setFilters] = useState({
    minBudget: '',
    maxBudget: '',
    date: '',
    preferences: '',
    language: '',
  });
  const [email, setEmail] = useState('');
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [itineraryToShare, setItineraryToShare] = useState(null);
  const [copySuccess, setCopySuccess] = useState({});
  // State to track the visibility of itinerary details
  const [expandedItineraries, setExpandedItineraries] = useState({});
  const navigate = useNavigate();
  const handleCurrencyChange = (event) => {
    fetchConversionRate(event.target.value);
  };
  const fetchASCItineraries = async () => {
    try {
      const response = await fetch(`http://localhost:8000/sortItinPASC`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const filteredItineraries = data.filter(itinerary => !itinerary.FlagInappropriate && itinerary.active);
        setItineraries(filteredItineraries);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch itineraries');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching itineraries');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortAscending = () => {
    fetchASCItineraries();
  };

  const handleSortDescending = async () => {
    try {
      const response = await fetch(`http://localhost:8000/sortItinPDSC`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const filteredItineraries = data.filter(itinerary => !itinerary.FlagInappropriate && itinerary.active);
        setItineraries(filteredItineraries);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch itineraries');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching itineraries');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchFilteredItineraries = async () => {
    const { minBudget, maxBudget, date, preferences, language } = filters;
  
    console.log('Current filters:', { minBudget, maxBudget, date, preferences, language });
  
    // Validate the date input (if provided)
    if (date) {
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
  
      if (inputDate <= today) {
        setErrorMessage("Cannot select a past date.");
        console.log('Date validation failed: input date is in the past');
        return; // Do not proceed if the date is in the past
      }
    }
  
    let query = `http://localhost:8000/filterItineraries?`;
  
    if (minBudget) query += `minBudget=${minBudget}&`;
    if (maxBudget) query += `maxBudget=${maxBudget}&`;
    if (date) query += `date=${date}&`;
    if (preferences) query += `preferences=${preferences}&`;
    if (language) query += `language=${language}&`;
  
    console.log('Generated query:', query);
  
    try {
      const response = await fetch(query, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
  
        const filteredItineraries = data.filter(itinerary => {
          return !itinerary.FlagInappropriate && itinerary.active;
        });
  
        console.log('Filtered itineraries:', filteredItineraries);
  
        setItineraries(filteredItineraries); 
        setErrorMessage('');
      } else {
        
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'No itineraries found matching the criteria');
        console.log('Error from API:', errorData);
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching itineraries');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
      console.log('Fetch process completed.');
    }
  };
  
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleItineraryDetails = (id) => {
    setExpandedItineraries((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the boolean value for the given itinerary ID
    }));
  };

  // const handleBooking = async (itinerary) => {
  //   const username = localStorage.getItem('Username'); // Assuming you store the username in local storage
  //   try {
  //     const response = await fetch('http://localhost:8000/bookItinerary', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         itineraryId: itinerary._id, // Use the itinerary ID
  //         Username: username,
  //       }),
  //     });
  
  //     if (response.ok) {
  //       const result = await response.json();
  //       alert(result.message); // Show success message
  //       fetchASCItineraries(); // Refresh the itineraries to reflect the booking
  //     } else {
  //       const error = await response.json();
  //       alert(error.error || 'An error occurred while booking the itinerary'); // Show error message
  //     }
  //   } catch (error) {
  //     console.error('Error booking itinerary:', error);
  //     alert('An error occurred while booking the itinerary');
  //   }
  // };
  

  const handleBooking = async (itinerary) => {
    const username = localStorage.getItem('Username'); // Assuming you store the username in local storage
    if(localStorage.getItem('context') === 'guest') {
      alert('Please login to book an itinerary');
      return;
    }
    try {
     
      const response = await axios.post('http://localhost:8000/bookItinerary', {
        itineraryId: itinerary._id, // Use the itinerary ID
        Username: username,
      });

      if (response.data.Price) {
        // Navigate to the payment page with price as the query parameter
        navigate(`/payment?amount=${response.data.Price}`,{ state: { from: '/itineraries' } });
        setErrorMessage(''); // Clear any previous error messages
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error booking itinerary:', error);
      alert(error.response?.data?.error || 'An error occurred while booking the itinerary');
    }
  };

  useEffect(() => {
    fetchASCItineraries(); // Default to ascending sort
  }, []);
  
  const handleShare = async (itineraryId,shareMethod) => {
    try {
      // Make a request to the backend with the itinerary ID
      const response = await fetch(`http://localhost:8000/shareItinerary/${encodeURIComponent(itineraryId)}`, {
        method: 'POST', // Use POST to match the backend's expectations
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
          setCopySuccess((prev) => ({ ...prev, [itineraryId]: 'Link copied to clipboard!' }));
        } else if (shareMethod === 'email') {
          alert('Link sent to the specified email!');
        }
      } else {
        console.error('Failed to generate shareable link');
      }
    } catch (error) {
      console.error("Error generating shareable link:", error);
    }
    };
  
    const handleEmailInputChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleShareMode = (itinerary) => {
      setItineraryToShare(itinerary);
      setIsEmailMode(!isEmailMode);
      setShowEmailInput(true);

    };
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
    const handleNotificationRequest = async (itineraryId) => {
      try {
        const response = await fetch('http://localhost:8000/requestNotificationItinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: localStorage.getItem('Username'),
            itineraryId,
          }),
        });
    
        if (response.ok) {
          alert('You will be notified when bookings open!');
          setNotificationRequested((prev) => ({ ...prev, [itineraryId]: true })); // Mark as requested
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to request notification.');
        }
      } catch (error) {
        console.error('Error requesting notification:', error);
        alert('An error occurred. Please try again.');
      }
    };
    
    return (
      <div>
  <div style={styles.container2}>
    {/* Background Section */}
    <div style={styles.background}>
      <h1 style={styles.title2}>Discover Your Journey</h1>
     {/* Sorting Section */}
     <div style={styles.section}>
   
              <button style={styles.buttonSort} onClick={handleSortAscending}>
                Sort by <FaDollarSign/> (Ascending)
              </button>
              <button style={styles.buttonSort} onClick={handleSortDescending}>
                Sort by <FaDollarSign/> (Descending)
              </button>
            </div>

            {/* Filter Section */}
    <div style={styles.filterContainer}>
      <form
        style={styles.filterForm}
        onSubmit={(e) => {
          e.preventDefault();
          fetchFilteredItineraries();
        }}
      >
        <label style={styles.filterLabel}>
          Min Budget:
          <input
            type="number"
            name="minBudget"
            value={filters.minBudget}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
        </label>
        <label style={styles.filterLabel}>
          Max Budget:
          <input
            type="number"
            name="maxBudget"
            value={filters.maxBudget}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
        </label>
        <label style={styles.filterLabel}>
          Date:
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
        </label>
        <label style={styles.filterLabel}>
          Preferences:
          <input
            type="text"
            name="preferences"
            placeholder='(e.g. beaches, shopping):'
            value={filters.preferences}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
        </label>
        <label style={styles.filterLabel}>
                  Language:
                  <input
                    type="text"
                    name="language"
                    value={filters.language}
                    onChange={handleFilterChange}
                    style={styles.filterInput}
                  />
                </label>
        <button style={styles.filterButton} type="submit">
          Apply Filters
        </button>
      </form>
    </div>

    </div>

   

  </div>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h2 style={styles.title}>Itineraries</h2>
          <div>


        {/* Currency Selector */}
        <div style={styles.currencySelector}>
  <FaGlobe style={styles.currencyIcon} />
  <select
    value={selectedCurrency}
    onChange={handleCurrencyChange}
    style={styles.currencyDropdown}
  >
    <option value="USD">USD</option>
    <option value="EUR">EUR</option>
    <option value="GBP">GBP</option>
    <option value="EGP">EGP</option>
    {/* Add other currencies */}
  </select>
</div>
          </div>
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
          e.currentTarget.style.width = '60px';
          Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
            (label) => (label.style.opacity = '0')
          );
        }}
      >
        <div style={styles.item} onClick={() => handleProfileRedirect()}>
          <FaUserCircle style={styles.icon} />
          <span className="label" style={styles.label}>
             Home Page
          </span>
        </div>
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
       
      </div>
        {loading ? (
          <p style={styles.loading}>Loading itineraries...</p>
        ) : (
          <>
                        {errorMessage && <p style={styles.error}>{errorMessage}</p>}

  {/* Itineraries List */}
{itineraries.length > 0 ? (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
    }}
  >
    {itineraries.map((itinerary, index) => (
      <div
        key={index}
        style={{
          position: 'relative',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.2s ease',
          overflow: 'visible',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.borderColor = '#0F5132';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.borderColor = '#ddd';
        }}
      >
        {/* Share Button */}
        <button
          onClick={() => handleShareMode(itinerary)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            color: '#0F5132',
          }}
        >
          <IosShareIcon />
        </button>
       

  {/* Share Dropdown */}
{isEmailMode && itineraryToShare && itineraryToShare._id === itinerary._id && (
  <div style={styles.shareDropdown}>
    {/* Copy Link Option */}
    <button
       onClick={() => handleShare(itinerary._id, 'copy')}
      style={styles.shareOption}
    >
      <FiCopy style={styles.shareOptionIcon} /> Copy Link
    </button>
   
    {/* Share via Email Option */}
    <button
      onClick={() => {
        setIsEmailMode(false); // First action
      }}
      style={styles.shareOption}
    >
      <MailOutlineIcon style={styles.shareOptionIcon} /> Share via Email
    </button>

    {/* Email Input Field */}
    {showEmailInput && itineraryToShare && itineraryToShare._id === itinerary._id && (
      <div style={{ marginTop: '10px' }}>
        <input
          type="email"
          placeholder="Enter recipient's email"
          value={email}
          onChange={handleEmailInputChange}
          style={styles.emailInput}
        />
        <button
          onClick={() => handleShare(itinerary._id, 'email')}
          style={{ ...styles.button, marginTop: '10px' }}
        >
          Send Email
        </button>
      </div>
    )}
  </div>
)}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
            {itinerary.Activities.join(', ')}
          </h3>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
            <strong><FaMapMarkerAlt /> Locations:</strong> {itinerary.Locations.join(', ')}
          </p>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
            <strong><FaCalendar /> Date:</strong>{' '}
            {new Date(itinerary.DatesTimes).toLocaleDateString()}
          </p>
          <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
            <strong><FaDollarSign /> Price:</strong> {(itinerary.Price * conversionRate).toFixed(2)}{' '}
            {selectedCurrency}
          </p>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
            <strong><FaUserCircle />Tour Guide:</strong> {itinerary.TourGuide}
          </p>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
  <strong>Booking Open:</strong> {itinerary.bookingOpen ? 'Yes' : 'No'}
  {!itinerary.bookingOpen && (
    <>
      <FaBell
        style={{ cursor: 'pointer', marginLeft: '10px', color: '#FFD700' }}
        onClick={() => handleNotificationRequest(itinerary._id)}
        data-tooltip-id="booking-bookings-tooltip"
      />
      <ReactTooltip id="booking-bookings-tooltip" content="Booking closed. Click to be notified." />
    </>
  )}
</p>

          
        </div>
        <a
  href="#"
  onClick={() => navigate(`/itineraries/${encodeURIComponent(itinerary._id)}`)}
  style={styles.activityDetailsLink}
>
  {expandedActivities[itinerary._id] ? 'Hide Activity Details' : 'View Activity Details'}
</a>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <button
            style={{
              backgroundColor: '#0F5132',
              color: '#fff',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            onClick={() => handleBooking(itinerary)}
            disabled={itinerary.Booked}
          >
            Book
          </button>
         
        </div>
      </div>
    ))}
  </div>
) : (
  <p style={styles.noData}>No itineraries found.</p>
)}

  
  
            
          </>
        )}
      </div>
      </div>
    );
  };
  
  const styles = {
    shareButton: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '1.5rem',
      color: 'black',
      cursor: 'pointer',
      padding:'0px',
      
    
    },
    shareDropdown: {
      position: 'absolute',
      top: '60px',
      right: '10px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      width: '200px',
    },
    
    shareOption: {
      display: 'flex',
      alignItems: 'center', // Align icon and text vertically
      justifyContent: 'flex-start', // Align icon and text to the left
      width: '100%',
      padding: '10px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      color: 'black', // Icon and text color
      textDecoration: 'none',
    },
    shareOptionIcon: {
      marginRight: '8px', // Space between the icon and text
      fontSize: '1rem', // Ensure both icons are the same size
    },
    emailInput: {
      padding: '8px',
      fontSize: '12px',
      width: '100%',
      border: '1px solid #ddd',
      borderRadius: '5px',
    },




   
   
    button: {
      backgroundColor: '#0F5132',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 15px',
      cursor: 'pointer',
      fontSize: '12px',
    },

 

    
    filterContainer: {
      position: 'absolute',
      bottom: '20px', // Place at the bottom of the image
      left: '50%', // Center horizontally
      transform: 'translateX(-50%)', // Center alignment adjustment
      display: 'flex',
      flexDirection: 'row', // Align items horizontally
      gap: '15px', // Space between filters
      backgroundColor: 'transparent', // Add a subtle background
      padding: '20px',
      borderRadius: '10px',
    },
    filterForm: {
      display: 'flex',
      flexDirection: 'row', // Align fields horizontally
      gap: '10px',
    },
    filterLabel: {
      display: 'flex',
      flexDirection: 'column',
      fontSize: '16px',
      color: '#333',
    },
    filterInput: {
      padding: '8px',
      fontSize: '14px',
      borderRadius: '35px',
      border: '1px solid #ddd',
    },
    filterButton: {
      padding: '5px 15px',
      fontSize: '14px',
      backgroundColor: '#0F5132',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
    },
    item: {
 
      padding: '10px 0',
      
    },
  
    activityDetailsLink: {
      display: 'inline-block',
      color: '#0F5132', // Blue color for hyperlink
      textDecoration: 'underline', // Underline for hyperlink
      cursor: 'pointer', // Pointer cursor
      fontSize: '14px', // Adjust font size as needed
      marginTop: '10px', // Add spacing above the link
    },

    container2: {
      marginTop:'60px',
      fontFamily: 'Arial, sans-serif',
    },
    background: {
      position: 'relative',
      backgroundImage:  `url(${itineraries})`, // Replace with your image path
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '400px', // Adjust height as needed
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
    },
    title2: {
      fontSize: '2.0rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '20px',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
    },
    currencySelector: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px", // Space between the globe icon and the dropdown
    },
    currencyIcon: {
      fontSize: "18px", // Globe icon size
      color: "#fff", // White color for the globe icon
    },
    currencyDropdown: {
      border: "1px solid #ddd",
      borderRadius: "5px",
      padding: "3px 5px",
      fontSize: "12px", // Smaller font size for the dropdown
      cursor: "pointer",
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    logo: {
      height: '60px',
      width: '70px',
      borderRadius: '10px',
      marginRight:'10px',
    },
    title: {
      fontSize: '24px',
      color: 'white',
      fontWeight: 'bold',
      marginRight:'50px'
    },
    profileIcon: {
      fontSize: '40px',
      color: 'white',
      cursor: 'pointer',
    },
    section: {
      margin: '20px 0',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    flabel: {
      marginBottom: '2px',
    },
    input: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      width: '100%',
    },
    buttonSort:{
      color:'#0F5132',
      fontSize: '18px',

      marginTop:'40px',
      background:'transparent'
    },
   
    list: {
      listStyleType: 'none',
      padding: 0,
    },
    listItem: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '10px',
      marginBottom: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    details: {
      marginTop: '10px',
      paddingLeft: '20px',
    },
    emailInputContainer: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px',
    },
    loading: {
      textAlign: 'center',
      color: '#4CAF50',
    },
    noData: {
      textAlign: 'center',
      color: '#999',
    },
    success: {
      color: '#4CAF50',
      marginTop: '10px',
    },
    error: {
      color: 'red',
      textAlign: 'center',
      marginTop: '10px',
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
    bellIcon: {
      fontSize: '20px',
      color: '#0F5132',
      cursor: 'pointer',
      marginLeft: '10px',
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
    
  };

export default Itineraries;
