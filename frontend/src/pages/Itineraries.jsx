import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { CurrencyContext } from '../pages/CurrencyContext';
import { FaUserCircle,FaCalendar,FaDollarSign ,FaMapMarkerAlt,FaClock,FaLanguage,FaWheelchair,FaShuttleVan} from 'react-icons/fa';
import logo from '../images/image_green_background.png';

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
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h2 style={styles.title}>Itineraries</h2>
          <FaUserCircle style={styles.profileIcon} onClick={handleProfileRedirect} />
        </header>
  
        {loading ? (
          <p style={styles.loading}>Loading itineraries...</p>
        ) : (
          <>
            {/* Sorting Section */}
            <div style={styles.section}>
              <h3>Sort Itineraries</h3>
              <button style={styles.button} onClick={handleSortAscending}>
                Sort by Price (Ascending)
              </button>
              <button style={styles.button} onClick={handleSortDescending}>
                Sort by Price (Descending)
              </button>
            </div>
  
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
                <label style={styles.label}>
                  Min Budget:
                  <input
                    type="number"
                    name="minBudget"
                    value={filters.minBudget}
                    onChange={handleFilterChange}
                    style={styles.input}
                  />
                </label>
                <label style={styles.label}>
                  Max Budget:
                  <input
                    type="number"
                    name="maxBudget"
                    value={filters.maxBudget}
                    onChange={handleFilterChange}
                    style={styles.input}
                  />
                </label>
                <label style={styles.label}>
                  Date:
                  <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    style={styles.input}
                  />
                </label>
                <label style={styles.label}>
                  Preferences (e.g. beaches, shopping):
                  <input
                    type="text"
                    name="preferences"
                    value={filters.preferences}
                    onChange={handleFilterChange}
                    style={styles.input}
                  />
                </label>
                <label style={styles.label}>
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
    );
  };
  
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    header: {
      display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    backgroundColor: '#4CAF50',
    padding: '10px 20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    logo: {
      height: '70px',
    width: '80px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
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
    label: {
      marginBottom: '10px',
    },
    input: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      width: '100%',
    },
    button: {
      backgroundColor: '#4CAF50',
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
  };

export default Itineraries;
