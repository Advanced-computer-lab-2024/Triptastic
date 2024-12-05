import React, { useState, useEffect } from 'react';
import {FaArrowLeft} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import image from '../images/image.png';
import {FaTag,FaUser,FaBox, FaExclamationCircle, FaHeart, FaFileAlt,FaTrashAlt ,FaThList,FaPlus,FaEdit ,FaFlag} from 'react-icons/fa';


const Docs = () => {
  const [activeSection, setActiveSection] = useState('');
  const [sellers, setSellers] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [viewingDocsId, setViewingDocsId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const resultsPerPage = 5; // Number of results per page
  
  // Determine the slice of results to display based on activeSection
  const results =
    activeSection === 'sellers'
      ? sellers
      : activeSection === 'tourGuides'
      ? tourGuides
      : advertisers;
  
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
  
  const nextPage = () => {
    if (currentPage < Math.ceil(results.length / resultsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
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

  const renderDocs = (docs) =>
    docs.map((doc, index) => (
      <img
        key={index}
        src={`http://localhost:8000/${doc.replace(/\\/g, '/')}`}
        alt={`Document ${index + 1}`}
        style={{
          width: '300px',
          height: '200px',
          margin: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc',
        }}
      />
    ));

  const Section = ({ title, items, itemType, refresh }) => (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ color: '#0F5132', marginBottom: '20px', fontSize: '1.5em', borderBottom: '2px solid #ddd', paddingBottom: '5px' }}>
        {title}
      </h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <li
            key={item._id}
            style={{
              background: '#f9f9f9',
              margin: '20px 0',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            <p><strong>Name:</strong> {item.Name || 'N/A'}</p>
            <p><strong>Username:</strong> {item.Username}</p>
            <p><strong>Email:</strong> {item.Email || 'N/A'}</p>
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => setViewingDocsId(viewingDocsId === item._id ? null : item._id)}
                style={{
                  backgroundColor: viewingDocsId === item._id ? '#0F5132' : '#0F5132',
                  color: '#fff',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                {viewingDocsId === item._id ? 'Hide Docs' : 'View Docs'}
              </button>
              <button
                onClick={() =>
                  handleAction(
                    `settleDocs${itemType}`,
                    item.Username,
                    'accepted',
                    refresh
                  )
                }
                style={{
                  backgroundColor: '#0F5132',
                  color: '#fff',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                Accept
              </button>
              <button
                onClick={() =>
                  handleAction(
                    `settleDocs${itemType}`,
                    item.Username,
                    'rejected',
                    refresh
                  )
                }
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Reject
              </button>
            </div>
            {viewingDocsId === item._id && (
              <div style={{ marginTop: '20px' }}>
                {renderDocs([item.Id, item.TaxationRegistryCard || item.Certificate])}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>

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


      <div style={{ marginTop: '80px' }}>
  {/* Navigation Buttons */}
  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
    <button
      onClick={() => setActiveSection('sellers')}
      style={{
        backgroundColor: activeSection === 'sellers' ? '#0F5132' : '#0F5132',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        margin: '0 10px',
        cursor: 'pointer',
      }}
    >
      View Sellers
    </button>
    <button
      onClick={() => setActiveSection('tourGuides')}
      style={{
        backgroundColor: activeSection === 'tourGuides' ? '#0F5132' : '#0F5132',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        margin: '0 10px',
        cursor: 'pointer',
      }}
    >
      View Tour Guides
    </button>
    <button
      onClick={() => setActiveSection('advertisers')}
      style={{
        backgroundColor: activeSection === 'advertisers' ? '#0F5132' : '#0F5132',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        margin: '0 10px',
        cursor: 'pointer',
      }}
    >
      View Advertisers
    </button>
  </div>

  {/* Error Message */}
  {errorMessage && <p style={{ color: '#dc3545', textAlign: 'center' }}>{errorMessage}</p>}

  {/* Sections */}
  {activeSection === 'sellers' && (
    <Section
      title="Pending Sellers"
      items={sellers}
      itemType="Seller"
      refresh={() => fetchData('getPendingSellers', setSellers, 'Failed to fetch sellers')}
    />
  )}
  {activeSection === 'tourGuides' && (
    <Section
      title="Pending Tour Guides"
      items={tourGuides}
      itemType="TourGuide"
      refresh={() => fetchData('getPendingTourGuides', setTourGuides, 'Failed to fetch tour guides')}
    />
  )}
  {activeSection === 'advertisers' && (
    <Section
      title="Pending Advertisers"
      items={advertisers}
      itemType="Advertiser"
      refresh={() => fetchData('getPendingAdvertisers', setAdvertisers, 'Failed to fetch advertisers')}
    />
  )}
</div>
</div>
  );
};

const styles = {
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
  paginationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
  paginationButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  pageIndicator: {
    fontSize: '16px',
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
    fontSize: '16px',
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
    marginTop: '80px', // Push content down to account for the header
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
fontSize: '16px',
fontWeight: 'bold',
backgroundColor: '#0F5132',
color: '#fff',
border: 'none',
borderRadius: '5px',
cursor: 'pointer',
transition: 'background-color 0.3s ease',
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
    //
};
export default Docs;
