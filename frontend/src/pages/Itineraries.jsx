import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { CurrencyContext } from '../pages/CurrencyContext';
import { FaUserCircle,FaCalendar,FaDollarSign ,FaMapMarkerAlt,FaClock,FaLanguage,FaWheelchair,FaShuttleVan} from 'react-icons/fa';
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, } from "react-icons/fa";
import logo from '../images/image.png';
import itineraries from '../images/it.png';


const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [shareableLink, setShareableLink] = useState('');
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
    let query = `http://localhost:8000/filterItineraries?`;
    
    if (minBudget) query += `minBudget=${minBudget}&`;
    if (maxBudget) query += `maxBudget=${maxBudget}&`;
    if (date) query += `date=${date}&`;
    if (preferences) query += `preferences=${preferences}&`;
    if (language) query += `language=${language}&`;

    try {
      const response = await fetch(query, {
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
        throw new Error('No itineraries found matching the criteria');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching itineraries');
      console.error(error);
    } finally {
      setLoading(false);
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
    try {
      const response = await axios.post('http://localhost:8000/bookItinerary', {
        itineraryId: itinerary._id, // Use the itinerary ID
        Username: username,
      });

      if (response.status === 200) {
        const result = response.data;
         alert(result.message);
        fetchASCItineraries(); // Refresh the itineraries to reflect the booking
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

    </div>

   

  </div>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h2 style={styles.title}>Itineraries</h2>
          <FaUserCircle style={styles.profileIcon} onClick={handleProfileRedirect} />
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
        <div style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaLandmark style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Loc
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/museums')}>
          <FaUniversity style={styles.icon} />
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
          <FaHotel style={styles.icon} />
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
        {loading ? (
          <p style={styles.loading}>Loading itineraries...</p>
        ) : (
          <>
            
  
            {/* Filter Section */}
            <div style={styles.section}>
              <h3>Filter Itineraries</h3>
              <form
                style={styles.form}
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchFilteredItineraries();
                }}
              >
                <label style={styles.flabel}>
                  Min Budget:
                  <input
                    type="number"
                    name="minBudget"
                    value={filters.minBudget}
                    onChange={handleFilterChange}
                    style={styles.input}
                  />
                </label>
                <label style={styles.flabel}>
                  Max Budget:
                  <input
                    type="number"
                    name="maxBudget"
                    value={filters.maxBudget}
                    onChange={handleFilterChange}
                    style={styles.input}
                  />
                </label>
                <label style={styles.flabel}>
                  Date:
                  <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    style={styles.input}
                  />
                </label>
                <label style={styles.flabel}>
                  Preferences (e.g. beaches, shopping):
                  <input
                    type="text"
                    name="preferences"
                    value={filters.preferences}
                    onChange={handleFilterChange}
                    style={styles.input}
                  />
                </label>
                <label style={styles.flabel}>
                  Language:
                  <input
                    type="text"
                    name="language"
                    value={filters.language}
                    onChange={handleFilterChange}
                    style={styles.input}
                  />
                </label>
                <button style={styles.button} type="submit">
                  Apply Filters
                </button>
              </form>
            </div>
  
            {errorMessage && <p style={styles.error}>{errorMessage}</p>}
  
            {/* Itineraries List */}
            {itineraries.length > 0 ? (
              <ul style={styles.list}>
                {itineraries.map((itinerary) => (
                  <li key={itinerary._id} style={styles.listItem}>
                    <strong>Activities:</strong> {itinerary.Activities.join(', ')} <br />
                    <strong><FaDollarSign /></strong> {selectedCurrency} {(itinerary.Price * conversionRate).toFixed(2)} <br />
                    <strong><FaCalendar /></strong> {itinerary.DatesTimes} <br />
                    <strong><FaMapMarkerAlt /></strong> {itinerary.Locations.join(', ')}<br />
                    <strong><FaUserCircle/></strong> {itinerary.TourGuide}<br/>
                    <button
                      style={styles.button}
                      onClick={() => toggleItineraryDetails(itinerary._id)}
                    >
                      {expandedItineraries[itinerary._id] ? 'Hide Itinerary Details' : 'View Itinerary Details'}
                    </button>
                    <button
                      style={styles.button}
                      onClick={() => handleBooking(itinerary)}
                      disabled={itinerary.Booked}
                    >
                      Book Ticket
                    </button>
                    {expandedItineraries[itinerary._id] && (
                      <div style={styles.details}>
                        <p>
                          <strong><FaClock/>: </strong> {itinerary.DurationOfActivity}
                        </p>
                        <p>
                          <strong><FaLanguage/>:</strong> {itinerary.Language}
                        </p>
                        <p>
                          <strong><FaWheelchair/>:</strong> {itinerary.Accesibility}
                        </p>
                        <p>
                          <strong><FaShuttleVan/>:</strong> {itinerary.pickUpDropOff}
                        </p>
                        <p>
                          <strong>Booked:</strong> {itinerary.Booked ? 'Yes' : 'No'}
                        </p>
                        
                      </div>
                    )}
                    {/* Share button and success message */}
                    <button style={styles.button} onClick={() => handleShare(itinerary._id, 'copy')}>
                      Copy Link
                    </button>
                    <button style={styles.button} onClick={() => handleShareMode(itinerary)}>
                      Share via Email
                    </button>
                    {isEmailMode && itineraryToShare && itineraryToShare._id === itinerary._id && (
                      <div style={styles.emailInputContainer}>
                        <input
                          style={styles.input}
                          type="email"
                          placeholder="Enter recipient's email"
                          value={email}
                          onChange={handleEmailInputChange}
                        />
                        <button style={styles.button} onClick={() => handleShare(itinerary._id, 'email')}>
                          Send Email
                        </button>
                      </div>
                    )}
                    {copySuccess[itinerary._id] && <p style={styles.success}>{copySuccess[itinerary._id]}</p>}
                  </li>
                ))}
              </ul>
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
    container2: {
      marginTop:'90px',
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
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    header: {
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
      height: '70px',
      width: '80px',
      borderRadius: '10px',
      marginRight:'10px',
    },
    title: {
      fontSize: '24px',
      color: 'white',
      fontWeight: 'bold',
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
    button: {
      backgroundColor: '#0F5132',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      marginTop: '10px',
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
      top: '90px',
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
    
  };

export default Itineraries;
