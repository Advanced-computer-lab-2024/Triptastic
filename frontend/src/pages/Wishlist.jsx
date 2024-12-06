import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/image.png'; // Replace with your logo path
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, FaDollarSign,FaSearch, FaTrash, FaCartPlus} from "react-icons/fa";import './TouristProfile.css'; // Assuming you create a CSS file for styling
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';
import beach from '../images/beach.jpg';
import historic from '../images/historic.jpg';
import family from '../images/family.png';
import shopping from '../images/shopping.jpg';

import { FaBell,FaUserCircle} from 'react-icons/fa';
import { MdNotificationImportant } from 'react-icons/md';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import "intro.js/introjs.css"; // Import Intro.js styles
import introJs from "intro.js";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';
const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const username = localStorage.getItem('Username'); // Retrieve username from local storage
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/getWishlist?Username=${username}`);
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      const data = await response.json();
      setWishlist(data.wishlist || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    const userConfirmed = window.confirm("Are you sure you want to remove this product from your wishlist?");
    
    if (!userConfirmed) {
      // If the user cancels, exit the function
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8000/removeProductFromWishlist`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, productId }),
      });
  
      if (response.ok) {
        alert('Product removed from wishlist successfully!');
        setWishlist((prev) => prev.filter((item) => item._id !== productId));
      } else {
        throw new Error('Failed to remove product from wishlist');
      }
    } catch (error) {
      alert('Failed to remove product from wishlist');
    }
  };
  

  const handleAddToCartFromWishlist = async (productName, productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/addToCartAndRemoveFromWishlist?Username=${username}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productName, quantity: 1 }),
        }
      );

      if (response.ok) {
        alert('Product added to cart and removed from wishlist successfully!');
        setWishlist((prev) => prev.filter((item) => item._id !== productId));
      } else {
        throw new Error('Failed to add product to cart and remove from wishlist');
      }
    } catch (error) {
      alert('Failed to add product to cart');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return <div style={styles.loading}>Loading wishlist...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>My Wishlist</h1>
        <div style={styles.iconGroup}>
          <FaShoppingCart
            style={styles.icon}
            onClick={() => navigate('/Cart')}
            title="Cart"
          />
          <FaUserCircle
            style={styles.icon}
            onClick={() => navigate('/tourist-profile')}
            title="Profile"
          />
        </div>
      </header>
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
        <div   style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaUniversity style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Sites
          </span>
        </div>
        <div  style={styles.item} onClick={() => navigate('/museums')}>
          <MuseumIcon style={styles.icon} />
          <span className="label" style={styles.label}>
            Museums
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/products')}>
          <FaBox style={styles.icon} />
          <span className="label" style={styles.label}>
            Products
          </span>
        </div>
        <div  style={styles.item} onClick={() => navigate('/itineraries')}>
          <FaMap style={styles.icon} />
          <span className="label" style={styles.label}>
            Itineraries
          </span>
        </div>
        <div  style={styles.item} onClick={() => navigate('/activities')}>
          <FaRunning style={styles.icon} />
          <span className="label" style={styles.label}>
            Activities
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-flights')}>
          <FaPlane style={styles.icon} />
          <span className="label" style={styles.label}>
            Book Flights
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-hotels')}>
          <HotelIcon style={styles.icon} />
          <span className="label" style={styles.label}>
            Book a Hotel
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-transportation')}>
          <FaBus style={styles.icon} />
          <span className="label" style={styles.label}>
           Transportation
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/tourist-orders')}>
          <FaClipboardList style={styles.icon} />
          <span className="label" style={styles.label}>
            Past Orders
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/AttendedActivitiesPage')}>
          <FaStar style={styles.icon} />
          <span className="label" style={styles.label}>
            Review Activities
          </span>
        </div>
      </div>
      <div style={styles.wishlistContent}>
        {wishlist.length === 0 ? (
          <p style={styles.emptyMessage}>Your wishlist is empty.</p>
        ) : (
          <ul style={styles.wishlistList}>
            {wishlist.map((product) => (
              <li key={product._id} style={styles.wishlistItem}>
                
                <h2 style={styles.productName}>{product.productName}</h2>
                <p>
                  <strong>Description:</strong> {product.description}
                </p>
                <p>
                  <strong>Price:</strong> ${product.price}
                </p>
                <div style={styles.actionButtons}>
                  <button
                    style={styles.addToCartButton}
                    onClick={() =>
                      handleAddToCartFromWishlist(product.productName, product._id)
                    }
                  >
                    <FaCartPlus style={styles.buttonIcon} /> Add to Cart
                  </button>
                  <button
                    style={styles.removeButton}
                    onClick={() => handleRemoveFromWishlist(product._id)}
                  >
                    <FaTrash style={styles.buttonIcon} /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {

  container: {
    width: '900px',
    margin: 'auto',
    padding: '20px', 
    background: '#f8f9fa',
    border: '10px',
    box: '0 4px 8px rgba(0, 0, 0, 0.2)',
    marginTop: '60px', // Adds space below the fixed header
  },
  
  logo: {
    height: '50px',
    width: '50px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
  },
  iconGroup: {
    display: 'flex',
    gap: '15px',
  },
  icon: {
    fontSize: '24px',
    color: 'white',
    cursor: 'pointer',
  },
  wishlistContent: {
      padding: '0', // Ensure no padding
      margin: '0', // Ensure no margin
    marginTop: '0',
    
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
  wishlistList: {
    listStyleType: 'none',
    padding: 0,
    margin: '0', // Reset margin

  },
  sidebar: {
    position: 'fixed',
    top: '60px',
    left: 0,
    height: '100vh',
    width: '50px', // Default width when collapsed
    backgroundColor: 'rgba(15, 81, 50, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px 0',
    overflowX: 'hidden',
    transition: 'width 0.3s ease',
    zIndex: 1000,
  },
  sidebarExpanded: {
    width: '200px', // Width when expanded
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px',
    width: '100%', // Full width of the sidebar
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  iconContainerHover: {
    backgroundColor: '#084B24', // Background on hover
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
    padding: '10px 30px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth
    zIndex: '1000', // Ensure it appears above other content
    
  },
  headerIconsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px', // Spacing between the icons
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
  wishlistItem: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px', // Adjust spacing between items if necessary
    borderBottom: '1px solid #ddd', // Optional: separator between items
    paddingBottom: '10px', // Add spacing within the item
    fontSize: '14px', // Smaller text size
    lineHeight: '1.4', // Adjust line height for better readability
  },
  
  productName: {
    fontSize: '18px',
    color: '#0F5132',
    marginBottom: '10px',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  addToCartButton: {
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '5px 10px', // Reduced padding for a smaller button
    fontSize: '14px', // Smaller font size
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '5px 10px', // Reduced padding for a smaller button
    fontSize: '14px', // Smaller font size
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: '5px',
  },
  
  item: {
    padding: '10px 0',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    color: 'red',
  },
};

export default Wishlist;
