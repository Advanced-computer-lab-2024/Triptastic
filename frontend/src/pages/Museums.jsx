import React, { useState, useEffect } from 'react'; 
import museumHistoryImage from '../images/museumhistory.jpg'; // Adjust the path as needed
import { FaShareAlt } from "react-icons/fa";

const Museums = () => {
  const [museums, setMuseums] = useState([]);
  const [historicalPeriods, setHistoricalPeriods] = useState([]); 
  const [selectedPeriod, setSelectedPeriod] = useState(''); 
  const [viewMuseums, setViewMuseums] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [shareableLink, setShareableLink] = useState('');
  const [copySuccess, setCopySuccess] = useState({});
  const [email, setEmail] = useState('');
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [museumToShare, setMuseumToShare] = useState(null);
  

  // Fetch museums from the backend
  const handleViewAllMuseums = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/viewAllMuseumsTourist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMuseums(data); 
    } catch (error) {
      console.error('Error fetching museums:', error);
    } finally {
      setLoading(false);
      setViewMuseums(true); 
    }
  };

  // Fetch unique historical periods from the backend
  const fetchHistoricalPeriods = async () => {
    try {
      const response = await fetch('http://localhost:8000/getUniqueHistoricalPeriods', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setHistoricalPeriods(data); 
    } catch (error) {
      console.error('Error fetching historical periods:', error);
    }
  };

  // Handle filtering museums by historical period
  const handleFilterMuseums = async () => {
    if (!selectedPeriod) return; 

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/filterMuseumsByTagsTourist?Tags=${selectedPeriod}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMuseums(data); 
    } catch (error) {
      console.error('Error filtering museums:', error);
    } finally {
      setLoading(false);
    }
  };

  // New function to search for museums
  const handleSearchMuseums = async () => {
    if (!searchTerm) return; // Do nothing if search term is empty

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/searchMuseums?name=${searchTerm}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMuseums(data); // Update museums based on the search results
    } catch (error) {
      console.error('Error searching museums:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch historical periods when the component mounts
  useEffect(() => {
    fetchHistoricalPeriods();
  }, []);
  const handleShare = async (museumName, shareMethod) => {
    try {
      const response = await fetch(`http://localhost:8000/shareMuseum/${encodeURIComponent(museumName)}`, {
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
          setCopySuccess((prev) => ({ ...prev, [museumName]: 'Link copied to clipboard!' })); // Set success message for the specific museum
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

  const handleShareMode = (museum) => {
    setMuseumToShare(museum);
    setIsEmailMode(!isEmailMode);
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Museums</h1>
      <button onClick={handleViewAllMuseums} style={styles.button}>
        View All Museums
      </button>

      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search museums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button onClick={handleSearchMuseums} disabled={!searchTerm} style={styles.button}>
          Search
        </button>
      </div>

      {viewMuseums && (
        <>
          <button
            onClick={() => setFilterVisible((prev) => !prev)}
            style={{ ...styles.button, marginBottom: '20px' }}
          >
            Filter Museums
          </button>

          {filterVisible && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <label htmlFor="period-select" style={{ marginRight: '10px' }}>
                Filter by Historical Period:
              </label>
              <select
                id="period-select"
                onChange={(e) => setSelectedPeriod(e.target.value)}
                value={selectedPeriod}
                style={styles.dropdown}
              >
                <option value="" disabled>
                  Select a historical period
                </option>
                {historicalPeriods.map((period) => (
                  <option key={period.name} value={period.name}>
                    {period.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleFilterMuseums}
                disabled={!selectedPeriod}
                style={styles.button}
              >
                Apply Filter
              </button>
            </div>
          )}
        </>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Loading...</p>
      ) : (
        <div style={styles.cardContainer}>
          {museums.map((museum) => (
            <div key={museum._id} style={styles.card}>
              <img
                src={museum.Name === 'National Museum of History' ? museumHistoryImage : museum.mainImage}
                alt={museum.Name}
                style={styles.image}
              />
              <div style={styles.details}>
                <h2 style={styles.museumName}>{museum.Name}</h2>
                <p style={styles.description}>{museum.Description}</p>

                <div style={{ position: 'relative', display: 'inline-block' }}>
  <button
    onClick={() => handleShareMode(museum)}
    style={styles.shareButton}
  >
    <FaShareAlt />
  </button>
                  <button
                    onClick={() => handleShareMode(museum)}
                    style={styles.shareButton}
                  >
                    <i className="fas fa-share-alt"></i>
                  </button>

                 {/* Dropdown */}
                {isEmailMode &&
                  museumToShare &&
                  museumToShare._id === museum._id && (
                    <div style={styles.shareDropdown}>
                      <button
                        onClick={() => handleShare(museum.Name, 'copy')}
                        style={styles.shareOption}
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => setIsEmailMode(false)}
                        style={styles.shareOption}
                      >
                        Share via Email
                      </button>

                      {/* Email Input Field */}
                      {museumToShare && museumToShare._id === museum._id && (
                        <div style={{ marginTop: '10px' }}>
                          <input
                            type="email"
                            placeholder="Enter recipient's email"
                            value={email}
                            onChange={handleEmailInputChange}
                            style={styles.emailInput}
                          />
                          <button
                            onClick={() => handleShare(museum.Name, 'email')}
                            style={{ ...styles.button, marginTop: '10px' }}
                          >
                            Send Email
                          </button>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
  
};
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
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
      maxWidth: '350px', // Adjust the width
      backgroundColor: '#fff',
      marginBottom: '20px',
    },
    image: {
      width: '100%', // Make the image take the full width of the card
      height: '200px', // Adjust the height for better visibility
      objectFit: 'cover', // Ensure the image scales correctly
    },
    details: {
      padding: '20px',
      textAlign: 'center', // Center-align the text
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
      top: '40px',
      left: '0',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: '1000',
      padding: '10px',
    },
    shareOption: {
      display: 'block',
      width: '100%',
      padding: '10px',
      textAlign: 'center',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      color: '#0F5132',
      textDecoration: 'none',
    },
    };
    
  
  



export default Museums;
