import React, { useState, useEffect } from 'react';
import { FaUsersCog, FaBox,FaEdit,FaUserShield, FaUser, FaExclamationCircle, FaHeart, FaFileAlt, FaTrashAlt, FaThList, FaPlus, FaFlag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import image from '../images/image.png';

const Flaged = () => {
  const [Itineraries, setItineraries] = useState([]);
  const [touristItineraries, setTouristItineraries] = useState([]);
  const [Activities, setActivities] = useState([]);
  const [flagTouristItineraryMessage, setFlagTouristItineraryMessage] = useState('');
  const [flagItineraryMessage, setFlagItineraryMessage] = useState('');
  const [flagMessage, setFlagMessage] = useState('');
  const [activeSection, setActiveSection] = useState('itineraries');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 3; // Adjust as needed
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const fetchData = async () => {
    try {
      const [itineraryRes, touristRes, activitiesRes] = await Promise.all([
        fetch('http://localhost:8000/getAllItineraries'),
        fetch('http://localhost:8000/getAllTouristItineraries'),
        fetch('http://localhost:8000/getAllActivities'),
      ]);

      if (itineraryRes.ok && touristRes.ok && activitiesRes.ok) {
        setItineraries(await itineraryRes.json());
        setTouristItineraries(await touristRes.json());
        setActivities(await activitiesRes.json());
      } else {
        console.error('Failed to fetch data.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleFlag = async (id, type, currentFlagState) => {
    const endpoint = currentFlagState
      ? `http://localhost:8000/removeFlag/${type}/${id}`
      : `http://localhost:8000/flag${type}/${id}`;
  
    try {
      const response = await fetch(endpoint, { method: 'PATCH', headers: { 'Content-Type': 'application/json' } });
      const result = await response.json();
  
      if (response.ok) {
        alert(`${currentFlagState ? 'Unflagged' : 'Flagged'} successfully`);
        console.log('Backend response:', result);
        fetchData(); // Refresh the list
      } else {
        console.error('Backend error response:', result);
        alert(`Failed to ${currentFlagState ? 'unflag' : 'flag'}. ${result.error || ''}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);
  
const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
};

  const handleUnflagItinerary = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/removeFlag/itinerary/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Itinerary unflagged successfully');
        getItineraries(); // Refresh the itineraries list
      } else {
        alert('Failed to unflag the itinerary');
      }
    } catch (error) {
      alert('An error occurred while unflagging the itinerary');
    }
  };

  const handleUnflagTouristItinerary = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/removeFlag/touristItinerary/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Tourist itinerary unflagged successfully');
        getTouristItineraries(); // Refresh the tourist itineraries list
      } else {
        alert('Failed to unflag the tourist itinerary');
      }
    } catch (error) {
      alert('An error occurred while unflagging the tourist itinerary');
    }
  };

  const handleUnflagActivity = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/removeFlag/activity/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Activity unflagged successfully');
        getActivities(); // Refresh the activities list
      } else {
        alert('Failed to unflag the activity');
      }
    } catch (error) {
      alert('An error occurred while unflagging the activity');
    }
  };


  const handleFlagTouristItinerary = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/flagTouristItinerary/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFlagTouristItineraryMessage(data.msg);

      } else {
        const errorData = await response.json();
        setFlagTouristItineraryMessage(errorData.error || 'Failed to flag the tourist itinerary.');
      }
    } catch (error) {
      setFlagTouristItineraryMessage('An error occurred while flagging the tourist itinerary.');
    }
  };


  const handleFlagActivity = async (id) => {
    setFlagMessage('');
    try {
      const response = await fetch(`http://localhost:8000/flagActivity/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFlagMessage(data.msg); // Assuming the API response contains the desired message

      } else {
        const errorData = await response.json();
        setFlagMessage(errorData.error || 'Failed to flag activity.');
      }
    } catch (error) {
      setFlagMessage('An error occurred while flagging the activity.');
    }
  };

  const handleFlagItinerary = async (id) => {
    setFlagItineraryMessage('');
    try {
      const response = await fetch(`http://localhost:8000/flagItinerary/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFlagItineraryMessage(data.msg);
      } else {
        const errorData = await response.json();
        setFlagItineraryMessage(errorData.error || 'Failed to flag itinerary.');
      }
    } catch (error) {
      setFlagItineraryMessage('An error occurred while flagging the itinerary.');
    }
  };

  const getItineraries = async () => {
    try {
      const response = await fetch('http://localhost:8000/getAllItineraries');
      if (response.ok) {
        const data = await response.json();
        setItineraries(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTouristItineraries = async () => {
    try {
      const response = await fetch('http://localhost:8000/getAllTouristItineraries');
      if (response.ok) {
        const data = await response.json();
        setTouristItineraries(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getActivities = async () => {
    try {
      const response = await fetch('http://localhost:8000/getAllActivities');
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getItineraries();
    getTouristItineraries();
    getActivities();
  }, []);


  return (
    <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={image} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title2}>Flag Events</h1>
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

<div style={styles.item} onClick={() => navigate('/adminPage')}>
          <FaUser style={styles.icon} />
          <span className="label" style={styles.label}>
           Admin Profile
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/manage')}>
          <FaUserShield style={styles.icon} />
          <span className="label" style={styles.label}>
          Admin Panel
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/admincontrol')}>
          <FaUsersCog   style={styles.icon} />
          <span className="label" style={styles.label}>
           Admin Control
          </span>   
        </div>
        
        <div style={styles.item} onClick={() => navigate('/Complaints')}>
          <FaExclamationCircle style={styles.icon} />
          <span className="label" style={styles.label}>
           Complaints
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/docs')}>
          <FaFileAlt style={styles.icon} />
          <span className="label" style={styles.label}>
            Documents
          </span>
        </div>


        <div style={styles.item} onClick={() => navigate('/adminReport')}>
          <FaBox  style={styles.icon} />
          <span className="label" style={styles.label}>
            Sales Report
          </span>   
        </div>
        <div style={styles.item} onClick={() => navigate('/DeletionRequest')}>
          <FaTrashAlt  style={styles.icon} />
          <span className="label" style={styles.label}>
            Deletion Requests
          </span>   
        </div>

        <div style={styles.item} onClick={() => navigate('/EditProducts')}>
          <FaEdit   style={styles.icon} />
          <span className="label" style={styles.label}>
            Edit Products
          </span>   
        </div>

        <div style={styles.item} onClick={() => navigate('/flagged')}>
          <FaFlag   style={styles.icon} />
          <span className="label" style={styles.label}>
            Flag Events
          </span>   
        </div>
        <div style={styles.item} onClick={() => navigate('/products_admin')}>
          <FaBox  style={styles.icon} />
          <span className="label" style={styles.label}>
            View Products
          </span>   
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button
          style={activeSection === 'itineraries' ? styles.activeButton : styles.button}
          onClick={() => {
            setActiveSection('itineraries');
            setCurrentPage(1); // Reset page
          }}
        >
          Itineraries
        </button>
        <button
          style={activeSection === 'tourist' ? styles.activeButton : styles.button}
          onClick={() => {
            setActiveSection('tourist');
            setCurrentPage(1); // Reset page
          }}
        >
          Tourist Itineraries
        </button>
        <button
          style={activeSection === 'activities' ? styles.activeButton : styles.button}
          onClick={() => {
            setActiveSection('activities');
            setCurrentPage(1); // Reset page
          }}
        >
          Activities
        </button>
      </div>

      {activeSection === 'itineraries' && (
        <div style={styles.section}>
          
          <div style={styles.paginationContainer}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={styles.paginationButton}
            >
              Previous
            </button>
            <p style={styles.paginationInfo}>
    Page {currentPage} of {Math.ceil(Itineraries.length / itemsPerPage)}
  </p>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(Itineraries.length / itemsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(Itineraries.length / itemsPerPage)}
              style={styles.paginationButton}
            >
              Next
            </button>
          </div>
          <h2 style={styles.heading}>Itineraries</h2>
          {getPaginatedData(Itineraries).map((itinerary) => (
            <div key={itinerary._id} style={styles.card}>
              <h4>Locations:</h4>
              <p>{itinerary.Locations.join(', ')}</p>
              <p>Dates: {itinerary.DatesTimes}</p>
              <FaFlag
                style={{
                  ...styles.flagIcon,
                  color: itinerary.FlagInappropriate ? '#d9534f' : '#28a745',
                }}
                onClick={() => toggleFlag(itinerary._id, 'Itinerary', itinerary.FlagInappropriate)}
              />
            </div>
          ))}
        </div>
      )}

      {activeSection === 'tourist' && (
        <div style={styles.section}>
          <div style={styles.paginationContainer}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={styles.paginationButton}
            >
              Previous
            </button>
            <p style={{ margin: '0 10px', fontSize: '16px' }}>
              Page {currentPage} of {Math.ceil(touristItineraries.length / itemsPerPage)}
            </p>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(touristItineraries.length / itemsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(touristItineraries.length / itemsPerPage)}
              style={styles.paginationButton}
            >
              Next
            </button>
          </div>
          <h2 style={styles.heading}>Tourist Itineraries</h2>
          {getPaginatedData(touristItineraries).map((itinerary) => (
            <div key={itinerary._id} style={styles.card}>
              <h4>Activities:</h4>
              <p>{itinerary.Activities.join(', ')}</p>
              <p>Locations: {itinerary.Locations.join(', ')}</p>
              <FaFlag
                style={{
                  ...styles.flagIcon,
                  color: itinerary.FlagInappropriate ? '#d9534f' : '#28a745',
                }}
                onClick={() =>
                  toggleFlag(itinerary._id, 'TouristItinerary', itinerary.FlagInappropriate)
                }
              />
            </div>
          ))}
        </div>
      )}

      {activeSection === 'activities' && (
        <div style={styles.section}>
          <div style={styles.paginationContainer}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={styles.paginationButton}
            >
              Previous
            </button>
            <p style={{ margin: '0 10px', fontSize: '16px' }}>
              Page {currentPage} of {Math.ceil(Activities.length / itemsPerPage)}
            </p>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(Activities.length / itemsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(Activities.length / itemsPerPage)}
              style={styles.paginationButton}
            >
              Next
            </button>
          </div>
          <h2 style={styles.heading}>Activities</h2>
          {getPaginatedData(Activities).map((activity) => (
            <div key={activity._id} style={styles.card}>
              <h4>Name:</h4>
              <p>{activity.Name}</p>
              <p>Category: {activity.Category}</p>
              <FaFlag
                style={{
                  ...styles.flagIcon,
                  color: activity.FlagInappropriate ? '#d9534f' : '#28a745',
                }}
                onClick={() => toggleFlag(activity._id, 'Activity', activity.FlagInappropriate)}
              />
            </div>
          ))}
        </div>
      )}
  </div>
  );
};


const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    marginTop: '90px', // Push content down to account for the 

  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-15px', // Adjust positioning
    gap: '10px', // Space between elements
  },
  paginationButton: {
    padding: '5px 10px',
    fontSize: '14px',
    backgroundColor: '#0F5132',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  activePaginationButton: {
    backgroundColor: '#007BFF',
    border: '1px solid black', // Black border
  },
  
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#0F5132',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  activeButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: '1px solid #007BFF',
    backgroundColor: '#0F5132',
    border: '1px solid black', // Black border    cursor: 'pointer',
    fontSize: '16px',
  },
  section: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  
  heading: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  //     width: '90%', // Optional: Set a smaller width for the card
  // maxWidth: '300px', // Optional: Cap the maximum width
   margin: '0 auto 8px', // Center-align the card and adjust bottom spacing
    cursor: 'pointer', // Pointer cursor on hover
  },
  cardHover: {
    transform: 'scale(1.05)', // Slightly increase size
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add depth on hover
  },
  flagButton: {
    padding: '10px 15px',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  message: {
    marginTop: '10px',
    color: '#28a745',
    fontSize: '14px',
  },
  //header
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
  marginBottom: '10px', // Space between the logo and the title
},
logo: {
  height: '60px',
  width: '70px',
  borderRadius: '10px',
},
title2: {
  fontSize: '24px',
  fontWeight: 'bold',
  color: 'white',
  position: 'absolute', // Position the title independently
  top: '50%', // Center vertically
  left: '50%', // Center horizontally
  transform: 'translate(-50%, -50%)', // Adjust for element's size
  margin: '0',
},
          //sidebar
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
          flagIcon: {
            fontSize: '20px', // Adjust size as needed
            color: '#d9534f', // Red color for the icon
            cursor: 'pointer', // Pointer cursor on hover
            transition: 'color 0.3s ease', // Smooth hover effect
          },
          item: {
            padding: '10px 0',
          },
          sidebarExpanded: {
            width: '200px', // Width when expanded
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
          icon: {
            fontSize: '24px',
            marginLeft: '15px', // Move icons slightly to the right
            color: '#fff', // Icons are always white
          },
          paginationInfo: {
            fontSize: '14px', // Match button font size
            fontWeight: 'bold', // Bold text
            color: '#0F5132', // Consistent green color
            textAlign: 'center',
          },
};

export default Flaged;
