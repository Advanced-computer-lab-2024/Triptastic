import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaTag, FaUser, FaBox, FaExclamationCircle, FaHeart, FaFileAlt, FaTrashAlt, FaThList, FaPlus, FaEdit, FaFlag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import image from '../images/image.png';

const Docs = () => {
  const [activeSection, setActiveSection] = useState('sellers'); // Default view is 'sellers'
  const [sellers, setSellers] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [viewingDocsId, setViewingDocsId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Pagination States
  const [currentSellerPage, setCurrentSellerPage] = useState(1);
  const [currentTourGuidePage, setCurrentTourGuidePage] = useState(1);
  const [currentAdvertiserPage, setCurrentAdvertiserPage] = useState(1);
  const resultsPerPage = 4;

  // Sliced Data for Pagination
  const sellersToDisplay = sellers.slice(
    (currentSellerPage - 1) * resultsPerPage,
    currentSellerPage * resultsPerPage
  );
  const tourGuidesToDisplay = tourGuides.slice(
    (currentTourGuidePage - 1) * resultsPerPage,
    currentTourGuidePage * resultsPerPage
  );
  const advertisersToDisplay = advertisers.slice(
    (currentAdvertiserPage - 1) * resultsPerPage,
    currentAdvertiserPage * resultsPerPage
  );

  const navigate = useNavigate();

  const fetchData = async (endpoint, setter, errorMsg) => {
    try {
      const response = await fetch(`http://localhost:8000/${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setter(data);
        setErrorMessage('');
      } else {
        throw new Error(errorMsg);
      }
    } catch (error) {
      setErrorMessage(errorMsg);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData('getPendingSellers', setSellers, 'Failed to fetch sellers');
    fetchData('getPendingTourGuides', setTourGuides, 'Failed to fetch tour guides');
    fetchData('getPendingAdvertisers', setAdvertisers, 'Failed to fetch advertisers');
  }, []);

  const handleAction = async (endpoint, username, action, refresh) => {
    try {
      // Confirmation dialog for "rejected" actions
      if (action === 'rejected') {
        const isConfirmed = window.confirm(`Are you sure you want to reject ${username}?`);
        if (!isConfirmed) {
          return; // Exit if the user cancels
        }
      }
  
      const response = await fetch(`http://localhost:8000/${endpoint}?Username=${username}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docsApproved: action }),
      });
  
      if (response.ok) {
        alert(`${username} ${action === 'accepted' ? 'approved' : 'rejected'}`);
        refresh();
      } else {
        throw new Error('Action failed');
      }
    } catch (error) {
      console.error(`Error ${action === 'accepted' ? 'accepting' : 'rejecting'} ${username}:`, error);
    }
  };
  
  const renderPagination = (currentPage, setCurrentPage, totalItems) => (
    <div style={styles.paginationContainer}>
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        style={styles.paginationButton}
      >
        Previous
      </button>
      <p style={{ margin: '0 10px', fontSize: '16px' }}>
        Page {currentPage} of {Math.ceil(totalItems / resultsPerPage)}
      </p>
      <button
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalItems / resultsPerPage)))
        }
        disabled={currentPage === Math.ceil(totalItems / resultsPerPage)}
        style={styles.paginationButton}
      >
        Next
      </button>
    </div>
  );

  const Section = ({ title, items, itemType, refresh, currentPage, setCurrentPage, totalItems }) => (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={styles.sectionHeading}>{title}</h2>
      {renderPagination(currentPage, setCurrentPage, totalItems)}
      <ul style={styles.cardGrid}>
        {items.map((item) => (
          <li key={item._id} style={styles.card}>
            <h3 style={styles.cardTitle}>{item.Name || 'N/A'}</h3>
            <p style={styles.cardText}><strong>Username:</strong> {item.Username}</p>
            <p style={styles.cardText}><strong>Email:</strong> {item.Email || 'N/A'}</p>
            <div style={styles.buttonsContainer}>
              {/* Toggle button for viewing documents */}
              <button
                onClick={() => setViewingDocsId(viewingDocsId === item._id ? null : item._id)}
                style={styles.button}
              >
                {viewingDocsId === item._id ? 'Hide Docs' : 'View Docs'}
              </button>
              {/* Accept button */}
              <button
                onClick={() =>
                  handleAction(`settleDocs${itemType}`, item.Username, 'accepted', refresh)
                }
                style={styles.button}
              >
                Accept
              </button>
              {/* Reject button */}
              <button
                onClick={() =>
                  handleAction(`settleDocs${itemType}`, item.Username, 'rejected', refresh)
                }
                style={{ ...styles.button, backgroundColor: '#dc3545' }}
              >
                Reject
              </button>
            </div>
  
            {/* Render documents when "View Docs" is toggled */}
            {viewingDocsId === item._id && (
              <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {[item.Id, item.TaxationRegistryCard, item.Certificate]
                  .filter(Boolean) // Filter out undefined or null values
                  .map((doc, index) => (
                    <img
                      key={index}
                      src={`http://localhost:8000/${doc.replace(/\\/g, '/')}`}
                      alt={`Document ${index + 1} for ${item.Username}`}
                      style={{
                        maxWidth: '200px',
                        maxHeight: '150px',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        objectFit: 'cover',
                      }}
                    />
                  ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={image} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title2}>Document Approval Dashboard</h1>
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

        <div style={styles.item} onClick={() => navigate('/PromoCodeForm')}>
          <FaTag style={styles.icon} />
          <span className="label" style={styles.label}>
            Promo Codes
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/Complaints')}>
          <FaExclamationCircle style={styles.icon} />
          <span className="label" style={styles.label}>
           Complaints
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/preftags')}>
          <FaHeart style={styles.icon} />
          <span className="label" style={styles.label}>
           Preference Tags
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/docs')}>
          <FaFileAlt style={styles.icon} />
          <span className="label" style={styles.label}>
            Documents
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/category')}>
          <FaThList style={styles.icon} />
          <span className="label" style={styles.label}>
           Categories
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
        <div style={styles.item} onClick={() => navigate('/AddProduct')}>
          <FaPlus  style={styles.icon} />
          <span className="label" style={styles.label}>
            Add Product
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
      </div>
    


      {/* Navigation Buttons */}
      <div style={{ marginTop: '80px', textAlign: 'center' }}>
        <button
          onClick={() => setActiveSection('sellers')}
          style={styles.button2}
        >
          View Sellers
        </button>
        <button
          onClick={() => setActiveSection('tourGuides')}
          style={styles.button2}
        >
          View Tour Guides
        </button>
        <button
          onClick={() => setActiveSection('advertisers')}
          style={styles.button2}
        >
          View Advertisers
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      {/* Sections */}
      {activeSection === 'sellers' && (
        <Section
          title="Pending Sellers"
          items={sellersToDisplay}
          itemType="Seller"
          refresh={() => fetchData('getPendingSellers', setSellers, 'Failed to fetch sellers')}
          currentPage={currentSellerPage}
          setCurrentPage={setCurrentSellerPage}
          totalItems={sellers.length}
        />
      )}
      {activeSection === 'tourGuides' && (
        <Section
          title="Pending Tour Guides"
          items={tourGuidesToDisplay}
          itemType="TourGuide"
          refresh={() => fetchData('getPendingTourGuides', setTourGuides, 'Failed to fetch tour guides')}
          currentPage={currentTourGuidePage}
          setCurrentPage={setCurrentTourGuidePage}
          totalItems={tourGuides.length}
        />
      )}
      {activeSection === 'advertisers' && (
        <Section
          title="Pending Advertisers"
          items={advertisersToDisplay}
          itemType="Advertiser"
          refresh={() => fetchData('getPendingAdvertisers', setAdvertisers, 'Failed to fetch advertisers')}
          currentPage={currentAdvertiserPage}
          setCurrentPage={setCurrentAdvertiserPage}
          totalItems={advertisers.length}
        />
      )}
    </div>
  );
};

const styles = {
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  paginationButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#0F5132',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#0F5132',
  },
  cardText: {
    fontSize: '14px',
    color: '#555',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0F5132',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  cardHeading: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
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
    color: '#555',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#0F5132',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  message: {
    fontSize: '14px',
    marginTop: '10px',
    color: '#0F5132',
  },
  resultTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  resultContent: {
    fontSize: '14px',
    color: '#333',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
  },
  success: {
    color: 'green',
    fontSize: '14px',
    marginTop: '10px',
  },
  button: {
    padding: '12px',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    
  },
  result: {
    marginTop: '15px',
    backgroundColor: '#f1f1f1',
    padding: '15px',
    borderRadius: '5px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#555',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#555',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#0F5132',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    textAlign: 'center',
    
    
  },
  buttonHover: {
    backgroundColor: '#0C3E27',
  },
  success: {
    color: 'green',
    fontSize: '14px',
    marginTop: '10px',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
    textAlign: 'center',
  },
  section: {
    marginBottom: '30px',
  },
  sectionHeading: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
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
    gap: '15px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  //
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '90px', // Push content down to account for the header
    
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
  profileIcon: {
    fontSize: '40px',
    color: 'white',
    cursor: 'pointer',
  },
//header
    heading: {
fontSize: '24px',
fontWeight: 'bold',
marginBottom: '20px',
color: '#0F5132', // Green theme
textAlign: 'center',
},
form: {
display: 'flex',
flexDirection: 'column',
gap: '15px',
maxWidth: '700px',
margin: '0 auto',
backgroundColor: '#f9f9f9',
padding: '20px',
borderRadius: '10px',
boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
},
formGroup: {
display: 'flex',
flexDirection: 'column',
gap: '5px',
},
item: {
padding: '10px 0',
},
label: {
fontSize: '16px',
fontWeight: 'bold',
color: '#555',
},
input: {
padding: '10px',
border: '1px solid #ccc',
borderRadius: '5px',
fontSize: '14px',
},
button: {
padding: '12px',
fontSize: '12px',
fontWeight: 'bold',
backgroundColor: '#0F5132',
color: '#fff',
border: 'none',
borderRadius: '5px',
cursor: 'pointer',
transition: 'background-color 0.3s ease',

},
button2: {
  padding: '12px',
  fontSize: '16px',
  backgroundColor: '#0F5132',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  margin: '10px 10px', // Add horizontal and vertical spacing
  position: 'relative', // Allow relative positioning
  top: '-50px', // Move the button up
},

buttonHover: {
backgroundColor: '#155724', // Darker green on hover
},
icon: {
  fontSize: '24px',
  marginLeft: '15px', // Move icons slightly to the right
  color: '#fff', // Icons are always white
},
//header
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: '10px',
  },
  productList: {
    listStyleType: 'none',
    padding: 0,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  productName: {
    fontSize: '20px',
    color: '#4CAF50',
  },
  productImage: {
    width: '100%',
    maxWidth: '400px',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
  },
  imagePreview: {
    maxWidth: '100%',
    borderRadius: '10px',
    marginTop: '10px',
  },
  addButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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
    
};
export default Docs;
