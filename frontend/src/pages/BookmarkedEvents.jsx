import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, FaDollarSign,FaSearch, FaTrash, FaCartPlus} from "react-icons/fa";import './TouristProfile.css'; // Assuming you create a CSS file for styling
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CurrencyContext } from '../pages/CurrencyContext';
import beach from '../images/beach.jpg';
import historic from '../images/historic.jpg';
import family from '../images/family.png';
import shopping from '../images/shopping.jpg';
import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { FaBell,FaUserCircle} from 'react-icons/fa';
import logo from '../images/image.png'; // Add your logo file pathimport axios from 'axios';

const BookmarkedEvents = () => {
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarkedEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getBookmarkedEvents', {
          params: { Username: localStorage.getItem('Username') },
        });
        setBookmarkedEvents(response.data.bookmarkedEvents);
      } catch (error) {
        console.error('Error fetching bookmarked events:', error);
      }
    };

    fetchBookmarkedEvents();
  }, []);

  const handleRemoveBookmark = async (eventId) => {
    try {
      await axios.post(
        'http://localhost:8000/removeBookmark',
        { eventId },
        { params: { Username: localStorage.getItem('Username') } }
      );

      // Update the UI by removing the unbookmarked event
      setBookmarkedEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      console.error('Error removing bookmark:', error);
      alert('Failed to remove bookmark. Please try again.');
    }
  };

  const handleProfileRedirect = () => {
    const context = localStorage.getItem('context');

    if (context === 'tourist') {
      navigate('/tourist-profile');
    } else if (context === 'guest') {
      navigate('/Guest');
    } else {
      console.error('Unknown context');
      navigate('/'); // Fallback to home
    }
  };

  return (
    <div style={styles.container}>
          <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>Bookmarked Activities</h1>
        <div style={styles.iconGroup}>
          <ShoppingCartOutlinedIcon
            style={styles.icon}
            onClick={() => navigate('/Cart')}
            title="Cart"
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
        <div   style={styles.item} onClick={() => navigate('/tourist-profile')}>
          <FaUserCircle style={styles.icon} />
          <span className="label" style={styles.label}>
            Home Page
          </span>
        </div>
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
      </div>
      
      {/* Bookmarked Events */}
      <div style={styles.content}>
      
        {bookmarkedEvents.length > 0 ? (
          bookmarkedEvents.map((event) => (
            <div key={event._id} style={styles.eventCard}>
              <h3 style={styles.eventTitle}>{event.name}</h3>
              <p style={styles.eventDescription}>{event.description}</p>
              <p style={styles.eventDetails}>
                <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
              </p>
              <p style={styles.eventDetails}>
                <strong>Location:</strong> {event.location}
              </p>
              {/* Remove Bookmark Button */}
              <button
                style={styles.removeBookmarkButton}
                onClick={() => handleRemoveBookmark(event._id)}
              >
                Remove Bookmark
              </button>
            </div>
          ))
        ) : (
          <p style={styles.noEvents}>You have no bookmarked events.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  iconGroup: {
    display: 'flex',
    gap: '15px',
  },
  iconContainerHover: {
    backgroundColor: '#084B24', // Background on hover
  },
  icon: {
    fontSize: '24px',
    color: 'white',
    marginLeft: '15px', // Move icons slightly to the right
    cursor: 'pointer',
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
 
  item: {
    padding: '10px 0',
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
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    box: '0 4px 8px rgba(0, 0, 0, 0.2)',
    marginTop: '60px', // Adds space below the fixed header
  },
 
  logo: {
    height: '50px',
    width: '50px',
  },
  profileIcon: {
    fontSize: '40px',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute', // Make it position-relative to the container
    left: '50%', // Position the title to the center horizontally
    transform: 'translateX(-50%)', // Offset it back by 50% of its width to center
    margin: 0,
    top: '50%', // Optional: if vertical centering within the container is required
    transform: 'translate(-50%, -50%)', // Combine horizontal and vertical centering
  },
  content: {
    marginTop: '20px',
  },
  pageTitle: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  eventTitle: {
    fontSize: '22px',
    marginBottom: '10px',
    color: '#0F5132',
  },
  eventDescription: {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#555',
  },
  eventDetails: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  },
  removeBookmarkButton: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#FF4D4D', // Red color for removing
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  noEvents: {
    fontSize: '18px',
    color: '#777',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default BookmarkedEvents;











 