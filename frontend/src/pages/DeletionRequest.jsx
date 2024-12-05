import React, { useEffect, useState } from 'react';
import {FaTag,FaUser,FaBox, FaExclamationCircle, FaHeart, FaFileAlt,FaTrashAlt ,FaThList,FaPlus,FaEdit ,FaFlag} from 'react-icons/fa';
import image from '../images/image.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation


const DeletionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 4;
  const indexOfLastRequest = currentPage * resultsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - resultsPerPage;
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const filteredRequests = requests.filter((request) =>
    request.Username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:8000/getPendingDeletionRequests');
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    if (window.confirm('Are you sure you want to accept this request?')) {
      try {
        const response = await fetch('http://localhost:8000/acceptDeletionRequest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: id }),
        });
        const result = await response.json();
        alert(result.message);
        setRequests(requests.filter((request) => request._id !== id));
      } catch (error) {
        console.error('Error accepting request:', error);
      }
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch('http://localhost:8000/rejectDeletionRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id }),
      });
      const result = await response.json();
      alert(result.message);
      setRequests(requests.filter((request) => request._id !== id));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '80px auto', // Adjust margin for header
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      
    },
    heading: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#0F5132',
      textAlign: 'center',
      marginBottom: '20px',
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
      margin: '20px 0',
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
    searchInput: {
      width: '100%',
      padding: '10px',
      marginBottom: '20px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    requestsList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
    },
    requestItem: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    detail: {
      fontSize: '16px',
      color: '#333',
      marginBottom: '5px',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
    },
    acceptButton: {
      padding: '10px 15px',
      backgroundColor: '#0F5132',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    rejectButton: {
      padding: '10px 15px',
      backgroundColor: '#FF4D4D',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    container: {
      maxWidth: '800px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#f4f4f4',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginTop: '80px', 
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

  return (
    <div style={styles.container}>
          {/* Header */}
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={image} alt="Logo" style={styles.logo} />
      </div>
      <h1 style={styles.title2}>Accounts Deletion Requests</h1>
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
    


      {/* Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by username..."
        style={styles.searchInput}
      />

      {/* Pagination */}
      <div style={styles.paginationContainer}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={styles.paginationButton}
        >
          Previous
        </button>
        <p style={{ margin: '0 10px', fontSize: '16px' }}>
          Page {currentPage} of {Math.ceil(filteredRequests.length / resultsPerPage)}
        </p>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(filteredRequests.length / resultsPerPage))
            )
          }
          disabled={currentPage === Math.ceil(filteredRequests.length / resultsPerPage)}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <p style={styles.noRequestsMessage}>No pending requests.</p>
      ) : (
        <ul style={styles.requestsList}>
          {currentRequests.map((request) => (
            <li key={request._id} style={styles.requestItem}>
              <p style={styles.detail}>
                <strong>Username:</strong> {request.Username}
              </p>
              <p style={styles.detail}>
                <strong>Request Date:</strong> {new Date(request.requestDate).toLocaleDateString()}
              </p>
              <p style={styles.detail}>
                <strong>Status:</strong> {request.status}
              </p>
              <div style={styles.buttonsContainer}>
                <button
                  onClick={() => handleAccept(request._id)}
                  style={styles.acceptButton}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  style={styles.rejectButton}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeletionRequests;
