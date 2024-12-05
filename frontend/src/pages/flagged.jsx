
import React, { useState,useEffect } from 'react';


const Flaged = ({ statistics }) => {
    const [showingItineraries,setShowingItineraries]=useState(false);
    const [Itineraries,setItineraries]= useState('');
    const [touristItineraries,setTouristItineraries]= useState('');
    const [Activities,setActivities]= useState('');
    const [showingTouristItineraries,setShowingTouristItineraries]=useState(false);
    const [flagTouristItineraryMessage, setFlagTouristItineraryMessage] = useState('');
    const [flagItineraryMessage, setFlagItineraryMessage] = useState(''); // State for flagging messages
    const [showingActivities,setShowingActivities]=useState(false);

    const handleViewItineraries=()=>{
        setShowingItineraries( prev=>!prev);
      }
      const handleViewActivities=()=>{
        setShowingActivities( prev=>!prev);
      }
    
      const handleViewTouristItineraries=()=>{
        setShowingTouristItineraries( prev=>!prev);
      }

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
            console.log(data.msg);
            // Display success message
            setFlagTouristItineraryMessage(`Successfully flagged tourist itinerary: ${data.msg}`);
          } else {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            // Display error message
            setFlagTouristItineraryMessage(
              errorData.error || 'Failed to flag the tourist itinerary.'
            );
          }
        } catch (error) {
          console.error('Error:', error);
          // Display generic error message
          setFlagTouristItineraryMessage('An error occurred while flagging the tourist itinerary.');
        }
      };
      const getItineraries= async ()=>{
        try{
          const response = await fetch(`http://localhost:8000/getAllItineraries`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setItineraries(data);
          }
        }
        catch (error) {
          console.error(error);
        }
      }
      const getTouristItineraries= async ()=>{
        try{
          const response = await fetch(`http://localhost:8000/getAllTouristItineraries`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setTouristItineraries(data);
          }
        }
        catch (error) {
          console.error(error);
        }
      }
      const getActivities= async ()=>{
        try{
          const response = await fetch(`http://localhost:8000/getAllActivities`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setActivities(data);
          }
        }
        catch (error) {
          console.error(error);
        }
      }    
 
  
      const [flagMessage, setFlagMessage] = useState(''); // State to store flagging messages

      const handleFlagActivity = async (id) => {
        setFlagMessage(''); // Reset the message state
      
        try {
          const response = await fetch(`http://localhost:8000/flagActivity/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (response.ok) {
            const data = await response.json();
            setFlagMessage('Activity flagged successfully!'); // Success message
            console.log(data.msg);
          } else {
            const errorData = await response.json();
            setFlagMessage(errorData.error || 'Failed to flag activity.'); // Error message from server
            console.error('Error:', errorData.error);
          }
        } catch (error) {
          setFlagMessage('An error occurred while flagging the activity.'); // Catch unexpected errors
          console.error(error);
        }
      };
      
    
  const handleFlagItinerary = async (id) => {
    setFlagItineraryMessage(''); // Reset the message
  
    try {
      const response = await fetch(`http://localhost:8000/flagItinerary/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setFlagItineraryMessage('Itinerary flagged successfully!'); // Success message
        console.log(data.msg);
      } else {
        const errorData = await response.json();
        setFlagItineraryMessage(errorData.error || 'Failed to flag itinerary.'); // Error message from server
        console.error('Error:', errorData.error);
      }
    } catch (error) {
      setFlagItineraryMessage('An error occurred while flagging the itinerary.'); // Catch unexpected errors
      console.error(error);
    }
  };
  
  useEffect(() => {
    getItineraries();
    getTouristItineraries();
    getActivities();

  }, []);

  return (

    <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '40px',
    marginTop: '50px', // This pushes it lower
  }}
>
      {/* Itineraries Section */}
  <div style={{ ...styles.section, flex: '1 1 calc(30% - 20px)' }}>
  <button style={styles.button} onClick={handleViewItineraries}>
    {showingItineraries ? 'Hide Itineraries' : 'Show Itineraries'}
  </button>

  {/* Modal for Itineraries */}
  {showingItineraries && (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Itineraries</h2>
        <button onClick={() => setShowingItineraries(false)} style={styles.modalCloseButton}>
          Close
        </button>

        <div style={styles.modalBody}>
          {Itineraries.length > 0 ? (
            Itineraries.map((itinerary) => (
              <div key={itinerary._id} style={styles.card}>
                <h4 style={styles.title}>Locations:</h4>
                <p style={styles.text}>{itinerary.Locations.join(', ')}</p>
                <p style={styles.text}>Dates: {itinerary.DatesTimes}</p>
                <button
                  style={styles.flagButton}
                  onClick={() => handleFlagItinerary(itinerary._id)}
                >
                  Flag Itinerary
                </button>
              </div>
            ))
          ) : (
            <p style={styles.text}>No itineraries found.</p>
          )}
        </div>
        {flagItineraryMessage && (
          <p
            style={{
              color: flagItineraryMessage.includes('successfully') ? 'green' : 'red',
              textAlign: 'center',
              marginTop: '10px',
            }}
          >
            {flagItineraryMessage}
          </p>
        )}
      </div>
    </div>
  )}
</div>

{/* Activities Section */}
<div style={{ ...styles.section, flex: '1 1 calc(30% - 20px)' }}>
  <button style={styles.button} onClick={handleViewActivities}>
    {showingActivities ? 'Hide Activities' : 'Show Activities'}
  </button>

  {/* Modal for Activities */}
  {showingActivities && (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Activities</h2>
        <button onClick={() => setShowingActivities(false)} style={styles.modalCloseButton}>
          Close
        </button>

        <div style={styles.modalBody}>
          {Activities.length > 0 ? (
            Activities.map((activity) => (
              <div key={activity._id} style={styles.card}>
                <h4 style={styles.title}>Name:</h4>
                <p style={styles.text}>{activity.Name}</p>
                <p style={styles.text}>Category: {activity.Category}</p>
                <button
                  style={styles.flagButton}
                  onClick={() => handleFlagActivity(activity._id)}
                >
                  Flag Activity
                </button>
              </div>
            ))
          ) : (
            <p style={styles.text}>No activities found.</p>
          )}
        </div>
        {flagMessage && (
          <p
            style={{
              color: flagMessage.includes('successfully') ? 'green' : 'red',
              textAlign: 'center',
              marginTop: '15px',
            }}
          >
            {flagMessage}
          </p>
        )}
      </div>
    </div>
  )}
</div>

{/* Tourist Itineraries Section */}
<div style={{ ...styles.section, flex: '1 1 calc(30% - 20px)' }}>
  <button style={styles.button} onClick={handleViewTouristItineraries}>
    {showingTouristItineraries ? 'Hide Tourist Itineraries' : 'Show Tourist Itineraries'}
  </button>

  {/* Modal for Tourist Itineraries */}
  {showingTouristItineraries && (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Tourist Itineraries</h2>
        <button
          onClick={() => setShowingTouristItineraries(false)}
          style={styles.modalCloseButton}
        >
          Close
        </button>

        <div style={styles.modalBody}>
          {touristItineraries.length > 0 ? (
            touristItineraries.map((touristItinerary) => (
              <div key={touristItinerary._id} style={styles.card}>
                <h4 style={styles.title}>Activities:</h4>
                <p style={styles.text}>{touristItinerary.Activities.join(', ')}</p>
                <p style={styles.text}>Locations: {touristItinerary.Locations.join(', ')}</p>
                <button
                  style={styles.flagButton}
                  onClick={() => handleFlagTouristItinerary(touristItinerary._id)}
                >
                  Flag Tourist Itinerary
                </button>
              </div>
            ))
          ) : (
            <p style={styles.text}>No tourist itineraries found.</p>
          )}
        </div>
        {flagTouristItineraryMessage && (
          <p
            style={{
              color: flagTouristItineraryMessage.includes('Successfully') ? 'green' : 'red',
            }}
          >
            {flagTouristItineraryMessage}
          </p>
        )}
      </div>
    </div>
  )}
</div>
</div>


  );
};

const styles = {
  error: {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
  },
  success: {
    color: 'green',
    fontSize: '14px',
    textAlign: 'center',
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
    color: "#0F5132", // Green theme for text
  },
  openModalButton: {
    margin: '10px',
    padding: '10px 20px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
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
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '50%',
    maxWidth: '600px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    maxHeight: '80vh', // Limit modal height
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', // Ensure no overflow outside modal container
  },
  modalBody: {
    flex: 1,
    overflowY: 'auto', // Make modal scrollable
    paddingRight: '10px', // Add space for scroll bar
  },
  cancelIcon: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    color: '#dc3545',
    cursor: 'pointer',
  },
  cancelpasswordIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '50px', // Adjust placement
    top: '25px', // Adjust placement
  },
 
  modalContentH2: {
    fontSize: '24px',
    textAlign: 'center',
    color: '#333',
    marginBottom: '15px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
  },
  submitButton: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  iconContainer: {
    display: 'flex', // Enable flexbox
    alignItems: 'center', // Vertically align items
    justifyContent: 'space-between', // Even spacing between icons
    gap: '20px', // Space between each icon
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
  },
  container2: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0F5132',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px', // Reduced gap between elements
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '3px', // Reduced margin between groups
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '4px', // Less space below labels
    color: '#555',
  },
  input: {
    padding: '2px', // Reduced padding for inputs
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#0F5132',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0C3E27',
  },
  errorMessage: {
    marginTop: '10px',
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
  },
  successMessage: {
    marginTop: '10px',
    color: 'green',
    fontSize: '14px',
    textAlign: 'center',
  },
  section: {
    flex: '1 1 30%', // Responsive sections
    minWidth: '250px', // Ensure minimum width
    maxWidth: '300px', // Prevent overly large sections
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#0F5132',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  content: {
    marginTop: '10px',
  },

  text: {
    fontSize: '14px',
    margin: '5px 0',
    color: '#555',
  },
  flagButton: {
    padding: '8px',
    fontSize: '14px',
    color: '#fff',
    backgroundColor: '#d9534f',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  card2: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#0F5132',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  th: {
    textAlign: 'left',
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '10px',
    border: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
  tr: {
    backgroundColor: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  icon: {
    marginRight: '5px',
    color: '#0F5132',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  textarea: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    minHeight: '80px',
  },
  fileUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  uploadLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#0F5132',
    fontWeight: 'bold',
  },
  fileInput: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '5px',
  },
  imagePreview: {
    maxWidth: '100%',
    borderRadius: '10px',
    marginTop: '10px',
  },
  submitButton: {
    backgroundColor: '#0F5132',
    color: '#fff',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  success: {
    color: 'green',
    marginTop: '10px',
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
  sidebarExpanded: {
    width: '200px', // Width when expanded
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
};

export default Flaged;
