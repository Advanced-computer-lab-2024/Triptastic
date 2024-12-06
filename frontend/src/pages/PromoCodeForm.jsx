import React, { useState, useEffect } from 'react';
import './promoCodeForm.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { FaPercentage, FaCalendarAlt, FaTag ,FaUserShield} from 'react-icons/fa';
import { MdDiscount } from 'react-icons/md';
import image from '../images/image.png';
import {FaUser,FaBox, FaExclamationCircle, FaHeart, FaFileAlt,FaTrashAlt ,FaThList,FaPlus,FaEdit ,FaFlag} from 'react-icons/fa';


const PromoCodeForm = () => {
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    isPercentage: false,
    expirationDate: '',
    maxUsage: 1,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [promoCodes, setPromoCodes] = useState([]); // State to store fetched promo codes
  const [loading, setLoading] = useState(false); // State to handle loading spinner
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleProfileRedirect = () => {
    const context = localStorage.getItem('context');

    if (context === 'admin') {
      navigate('/adminPage');
    } else {
      console.error('Unknown context');
      navigate('/'); // Fallback to home
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/createPromoCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setFormData({
          code: '',
          discount: '',
          isPercentage: false,
          expirationDate: '',
          maxUsage: 1,
        });
        fetchPromoCodes(); // Refresh promo codes after creation
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create promo code');
      }
    } catch (err) {
      setError('An error occurred while creating the promo code');
    }
  };

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/getPromoCodes'); // Adjust the endpoint as needed
      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data); // Update the promoCodes state with fetched data
      } else {
        setError('Failed to fetch promo codes');
      }
    } catch (err) {
      setError('An error occurred while fetching promo codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes(); // Fetch promo codes on component mount
  }, []);



  return (
    
    <div style={styles.container}>
      
    {/* Header */}
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={image} alt="Logo" style={styles.logo} />
      </div>
      <h1 style={styles.title2}>Promo Code Management</h1>
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
      </div>


      <h2 style={styles.heading}></h2>
    <div className="promo-container">
      



      {/* Create Promo Code Section */}
      <div className="promo-section">
        <h3 className="promo-subtitle"></h3>
        <form onSubmit={handleSubmit} className="promo-form">
          <div className="form-group">
            <label><FaTag /> Promo Code:</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="Enter promo code"
            />
          </div>
          <div className="form-group">
            <label><MdDiscount /> Discount:</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              required
              placeholder="Enter discount amount"
            />
          </div>
          <div className="form-group">
  <label>
    <FaPercentage /> Is Percentage?
    <input
      type="checkbox"
      className="percentage-checkbox"
      name="isPercentage"
      checked={formData.isPercentage}
      onChange={handleChange}
    />
  </label>
</div>  <div className="form-group">
            <label><FaCalendarAlt /> Expiration Date:</label>
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Maximum Usage:</label>
            <input
              type="number"
              name="maxUsage"
              value={formData.maxUsage}
              onChange={handleChange}
              required
              placeholder="Enter max usage"
            />
          </div>
          <button type="submit" className="btn-submit">
            Create Promo Code
          </button>
        </form>
{/* Alerts for Error and Success */}
{error && alert(error)}
{message && alert(message)}
      </div>

      {/* View Promo Codes Section */}
      <div className="promo-section">
        <h3 className="promo-subtitle">Available Promo Codes</h3>
        {loading ? (
          <p className="loading-message">Loading...</p>
        ) : promoCodes.length > 0 ? (
          <table className="promo-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Expiration Date</th>
                <th>Max Usage</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo, index) => (
                <tr key={index}>
                  <td>{promo.code}</td>
                  <td>{promo.discount}</td>
                  <td>{promo.isPercentage ? 'Percentage' : 'Flat'}</td>
                  <td>{new Date(promo.expirationDate).toLocaleDateString()}</td>
                  <td>{promo.maxUsage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">No promo codes available.</p>
        )}
      </div>
    </div>
    </div>
  );
};
const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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

export default PromoCodeForm;
