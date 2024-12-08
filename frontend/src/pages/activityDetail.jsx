import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaClock, FaDollarSign, FaLayerGroup, FaArrowLeft,FaUserCircle ,FaPercent } from 'react-icons/fa';
import defaultBackground from '../images/activity2.jpg'; // Replace with the actual path of the image
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import logo from '../images/image.png'; // Add your logo file pathimport axios from 'axios';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,FaSearch,
  FaStar, } from "react-icons/fa";
  import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';


const ActivityDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`http://localhost:8000/getActivityToShare/${encodeURIComponent(name)}`);
        if (!response.ok) {
          throw new Error('Activity not found');
        }
        const data = await response.json();
        setActivity(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [name]);

  const handleProfileRedirect = () => {
    const context = localStorage.getItem('context');
  
    if (context === 'tourist') {
      navigate('/tourist-profile');
    } else if (context === 'guest') {
      navigate('/Guest');
    }  else {
      console.error('Unknown context');
      navigate('/'); // Fallback to home
    }
  };
  if (loading) return <p style={styles.loading}>Loading activity details...</p>;
  if (errorMessage) return <p style={styles.error}>{errorMessage}</p>;
  if (!activity) return <p style={styles.noActivity}>No activity found.</p>;
  return (
    <div style={styles.container}>

    <header style={styles.header}>
    <img src={logo} alt="Logo" style={styles.logo} />
    <h2 style={styles.title2}>Activities</h2>
    <button
style={{
  ...styles.navigationButton,
  position: 'absolute',
  left: '1410px', // Moves the bookmark button 20px from the right edge
}}
onClick={() => navigate('/BookmarkedEvents')}
>
<FaBookmark style={{ fontSize: '18px', color: '#FFD700',marginBottom:'2px'}} />
</button>

    
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
        <div style={styles.item} onClick={() =>  handleProfileRedirect()}>
          <FaUserCircle style={styles.icon2} />
          <span className="label" style={styles.label}>
             Home Page
          </span>
        </div>
        <div   style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaUniversity style={styles.icon2} />
          <span className="label" style={styles.label}>
            Historical Sites
          </span>
        </div>
        <div  style={styles.item} onClick={() => navigate('/museums')}>
          <MuseumIcon style={styles.icon2} />
          <span className="label" style={styles.label}>
            Museums
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/products')}>
          <FaBox style={styles.icon2} />
          <span className="label" style={styles.label}>
            Products
          </span>
        </div>
        <div  style={styles.item} onClick={() => navigate('/itineraries')}>
          <FaMap style={styles.icon2} />
          <span className="label" style={styles.label}>
            Itineraries
          </span>
        </div>
        <div  style={styles.item} onClick={() => navigate('/activities')}>
          <FaRunning style={styles.icon2} />
          <span className="label" style={styles.label}>
            Activities
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-flights')}>
          <FaPlane style={styles.icon2} />
          <span className="label" style={styles.label}>
            Book Flights
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-hotels')}>
          <HotelIcon style={styles.icon2} />
          <span className="label" style={styles.label}>
            Book a Hotel
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-transportation')}>
          <FaBus style={styles.icon2} />
          <span className="label" style={styles.label}>
           Transportation
          </span>
        </div>
       
      </div>
    <div style={styles.container}>
      {/* Hero Section with Background */}
      <div style={styles.hero}>
        
        <h1 style={styles.heroTitle}>{activity.name}</h1>
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        <div style={styles.details}>
          <p style={styles.description}>{activity.description}</p>

          <div style={styles.detailItem}>
            <FaDollarSign style={styles.icon} />
            <span style={styles.detailLabel}>Price:</span>
            <span style={styles.detailValue}>${activity.price}</span>
          </div>
          <div style={styles.detailItem}>
            <FaClock style={styles.icon} />
            <span style={styles.detailLabel}>Duration:</span>
            <span style={styles.detailValue}>{activity.duration} hours</span>
          </div>
          <div style={styles.detailItem}>
            <FaLayerGroup style={styles.icon} />
            <span style={styles.detailLabel}>Category:</span>
            <span style={styles.detailValue}>{activity.Category}</span>
          </div>
          <div style={styles.detailItem}>
            <FaCalendarAlt style={styles.icon} />
            <span style={styles.detailLabel}>Date:</span>
            <span style={styles.detailValue}>{new Date(activity.date).toLocaleDateString()}</span>
          </div>
          <div style={styles.detailItem}>
            <FaMapMarkerAlt style={styles.icon} />
            <span style={styles.detailLabel}>Location:</span>
            <span style={styles.detailValue}>{activity.location}</span>
          </div>
          <div style={styles.detailItem}>
            <FaTag style={styles.icon} />
            <span style={styles.detailLabel}>Tags:</span>
            <span style={styles.detailValue}>{activity.tags ? activity.tags.join(', ') : 'No tags available'}</span>
          </div>
          <div style={styles.detailItem}>
            <FaPercent style={styles.icon}/> 
            <span style={styles.detailLabel}>Discounts:</span>
            <span style={styles.detailValue}>{activity.specialDiscounts}</span>
            </div>
          <div style={styles.detailItem}>
         <FaUserCircle style={styles.icon}/> 
         <span style={styles.detailLabel}>Advertiser:</span>
         <span style={styles.detailValue}>{activity.Advertiser}</span>
          </div>
         {/* Comment Section */}
         <div style={{ marginTop: '20px' }}>
            <h5 style={{ fontSize: '14px', marginBottom: '10px' }}>Comments:</h5>
            {activity.comments.length > 0 ? (
              <CommentSlider comments={activity.comments} />
            ) : (
              <p>No comments yet</p>
            )}
          </div>
          
        </div>
      </div>
    </div>
    </div>

  );
};
// Slider Component for Comments
const CommentSlider = ({ comments }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {comments.map((comment, index) => (
        <div
          key={index}
          style={{
            padding: '10px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p>
            <strong>{comment.Username}:</strong> {comment.comment}
          </p>
          <span style={{ fontSize: '12px', color: '#888' }}>
            {new Date(comment.commentedAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </Slider>
  );
};


const styles = {
 
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
  iconContainerHover: {
    backgroundColor: '#084B24', // Background on hover
  },
  item: {
 
    padding: '10px 0',
    
  },
  icon2: {
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
  labelVisible: {
    opacity: 1, // Fully visible when expanded
  },
  button: {
    backgroundColor: '#0F5132',
    color: 'white',
    border: 'none',
    padding: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '10px',
  },
  
  title2: {
    fontSize: '24px',
    color: 'white',
    textAlign: 'center',
    marginRight:'670px'
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
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '60px',
    width: '70px',
    borderRadius: '10px',
    marginRight:'10px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  },
  hero: {
    position: 'relative',
    backgroundImage: `url(${defaultBackground})`, // Default background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    padding: '40px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: '20px',

    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  backButton: {
    position: 'absolute',
    left: '20px',
    top: '20px',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'white',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  description: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '20px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
    flex: '1',
  },
  detailValue: {
    color: '#555',
    flex: '2',
  },
  icon: {
    fontSize: '20px',
    color: '#0F5132',
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
  noActivity: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#888',
  },
};

export default ActivityDetail;
