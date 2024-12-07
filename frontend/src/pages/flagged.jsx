import React, { useState, useEffect } from 'react';

const Flaged = () => {
  const [Itineraries, setItineraries] = useState([]);
  const [touristItineraries, setTouristItineraries] = useState([]);
  const [Activities, setActivities] = useState([]);
  const [flagTouristItineraryMessage, setFlagTouristItineraryMessage] = useState('');
  const [flagItineraryMessage, setFlagItineraryMessage] = useState('');
  const [flagMessage, setFlagMessage] = useState('');
  const [activeSection, setActiveSection] = useState('itineraries');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
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
        setFlagTouristItineraryMessage(`Successfully flagged tourist itinerary: ${data.msg}`);
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
        setFlagMessage('Activity flagged successfully!');
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
        setFlagItineraryMessage('Itinerary flagged successfully!');
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
      <p style={{ margin: '0 10px', fontSize: '16px' }}>
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
            <button style={styles.flagButton} onClick={() => handleFlagItinerary(itinerary._id)}>
              Flag Itinerary
            </button>
          </div>
        ))}
        {flagItineraryMessage && <p style={styles.message}>{flagItineraryMessage}</p>}
      </div>
    )}

    {activeSection === 'tourist' && (
      <div style={styles.section}>
        {/* Pagination Above Cards */}
<div style={styles.paginationContainer}>
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    style={styles.paginationButton}
  >
    Previous
  </button>
  <p style={{ margin: '0 10px', fontSize: '16px' }}>
    Page {currentPage} of{' '}
    {Math.ceil(
      activeSection === 'itineraries'
        ? Itineraries.length / itemsPerPage
        : activeSection === 'tourist'
        ? touristItineraries.length / itemsPerPage
        : Activities.length / itemsPerPage
    )}
  </p>
  <button
    onClick={() =>
      setCurrentPage((prev) =>
        Math.min(
          prev + 1,
          Math.ceil(
            activeSection === 'itineraries'
              ? Itineraries.length / itemsPerPage
              : activeSection === 'tourist'
              ? touristItineraries.length / itemsPerPage
              : Activities.length / itemsPerPage
          )
        )
      )
    }
    disabled={
      currentPage ===
      Math.ceil(
        activeSection === 'itineraries'
          ? Itineraries.length / itemsPerPage
          : activeSection === 'tourist'
          ? touristItineraries.length / itemsPerPage
          : Activities.length / itemsPerPage
      )
    }
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
            <button
              style={styles.flagButton}
              onClick={() => handleFlagTouristItinerary(itinerary._id)}
            >
              Flag Tourist Itinerary
            </button>
          </div>
        ))}
        {flagTouristItineraryMessage && <p style={styles.message}>{flagTouristItineraryMessage}</p>}
      </div>
    )}

    {activeSection === 'activities' && (
      <div style={styles.section}>
        {/* Pagination Above Cards */}
<div style={styles.paginationContainer}>
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    style={styles.paginationButton}
  >
    Previous
  </button>
  <p style={{ margin: '0 10px', fontSize: '16px' }}>
    Page {currentPage} of{' '}
    {Math.ceil(
      activeSection === 'itineraries'
        ? Itineraries.length / itemsPerPage
        : activeSection === 'tourist'
        ? touristItineraries.length / itemsPerPage
        : Activities.length / itemsPerPage
    )}
  </p>
  <button
    onClick={() =>
      setCurrentPage((prev) =>
        Math.min(
          prev + 1,
          Math.ceil(
            activeSection === 'itineraries'
              ? Itineraries.length / itemsPerPage
              : activeSection === 'tourist'
              ? touristItineraries.length / itemsPerPage
              : Activities.length / itemsPerPage
          )
        )
      )
    }
    disabled={
      currentPage ===
      Math.ceil(
        activeSection === 'itineraries'
          ? Itineraries.length / itemsPerPage
          : activeSection === 'tourist'
          ? touristItineraries.length / itemsPerPage
          : Activities.length / itemsPerPage
      )
    }
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
            <button style={styles.flagButton} onClick={() => handleFlagActivity(activity._id)}>
              Flag Activity
            </button>
          </div>
        ))}
        {flagMessage && <p style={styles.message}>{flagMessage}</p>}
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
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  paginationButton: {
    padding: '10px 20px',
    margin: '0 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#0F5132',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  activePaginationButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
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
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  activeButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: '1px solid #007BFF',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
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

};

export default Flaged;
