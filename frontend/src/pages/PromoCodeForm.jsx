import React, { useState, useEffect } from 'react';
import './promoCodeForm.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import profile from '../images/profile.jpg'; // Replace with your profile icon path
import { FaPercentage, FaCalendarAlt, FaTag } from 'react-icons/fa';
import { MdDiscount } from 'react-icons/md';
import logo from '../images/image_green_background.png'; // Replace with your logo path


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
    <div className="promo-container">
      
      <header style={styles.header}>
  <div style={styles.logoContainer}>
    <img
      src={logo}
      alt="Logo"
      style={{
        height: '70px',
        width: '70px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        objectFit: 'cover',
      }}
    />
  </div>
  <h1 style={styles.title}>Promo Codes</h1>
  <img
    src={profile}
    alt="Profile Icon"
    style={styles.profileIcon}
    onClick={handleProfileRedirect}
  />
</header>


      {/* Create Promo Code Section */}
      <div className="promo-section">
        <h3 className="promo-subtitle">Create Promo Code</h3>
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
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
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
  );
};
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  profileIcon: {
    height: '50px',
    width: '50px',
    borderRadius: '50%',
    cursor: 'pointer',
    borderRadius: '30px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: '10px',
  },
  wishlistButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  cartIcon: {
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    
  },
  filterForm: {
    margin: '20px 0',
  },
  filterButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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
  addButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default PromoCodeForm;
