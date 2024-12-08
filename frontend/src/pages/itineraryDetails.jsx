import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaClock,
  FaDollarSign,
  FaArrowLeft,
  FaGlobe,
  FaUser,
  FaWalking,
} from 'react-icons/fa';
import { CiHeart } from "react-icons/ci";

import Slider from 'react-slick';
import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';

import { FaUserCircle,FaCalendar ,FaLanguage,FaWheelchair,FaShuttleVan} from 'react-icons/fa';
import { FaBell,FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, } from "react-icons/fa";
import logo from '../images/image.png';
import defaultBackground from '../images/itin.webp'; // Replace with your image path
import {
  SentimentVeryDissatisfiedOutlined,
  SentimentDissatisfiedOutlined,
  SentimentNeutralOutlined,
  SentimentSatisfiedOutlined,
  SentimentVerySatisfiedOutlined,
} from '@mui/icons-material';

const ItineraryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [rating, setRating] = useState(null); // Smiley rating
  const [newFeedback, setNewFeedback] = useState({ comment: '' });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch(`http://localhost:8000/getItinerary/${encodeURIComponent(id)}`);
        if (!response.ok) {
          throw new Error('Itinerary not found');
        }
        const data = await response.json();
        setItinerary(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

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


  const submitFeedback = async () => {
    if (!rating) {
      setErrorMessage('Rating is required.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/submitFeedback/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newFeedback, rating }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      setFeedbackSubmitted(true);
      setNewFeedback({ comment: '' });
      setRating(null); // Reset rating
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (loading) return <p style={styles.loading}>Loading itinerary details...</p>;
  if (errorMessage) return <p style={styles.error}>{errorMessage}</p>;
  if (!itinerary) return <p style={styles.noItinerary}>No itinerary found.</p>;

  return (
    <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h2 style={styles.title2}>Itineraries</h2>
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
        
        <div style={styles.item} onClick={() => handleProfileRedirect()}>
          <FaUserCircle style={styles.icon} />
          <span className="label" style={styles.label}>
             Home Page
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaUniversity style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Sites
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/museums')}>
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
        <div style={styles.item} onClick={() => navigate('/itineraries')}>
          <FaMap style={styles.icon} />
          <span className="label" style={styles.label}>
            Itineraries
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/activities')}>
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

    <div style={styles.container}>
      {/* Hero Section with Background */}
      <div style={styles.hero}>
       
        <h1 style={styles.heroTitle}>{itinerary.Activities}</h1>
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        <div style={styles.details}>
          <div style={styles.detailItem}>
            <FaWalking style={styles.icon2} />
            <span style={styles.detailLabel}>Activities:</span>
            <span style={styles.detailValue}>{itinerary.Activities.join(', ')}</span>
          </div>
          <div style={styles.detailItem}>
            <FaMapMarkerAlt style={styles.icon2} />
            <span style={styles.detailLabel}>Locations:</span>
            <span style={styles.detailValue}>{itinerary.Locations.join(', ')}</span>
          </div>
          <div style={styles.detailItem}>
            <FaClock style={styles.icon2} />
            <span style={styles.detailLabel}>Duration:</span>
            <span style={styles.detailValue}>{itinerary.DurationOfActivity}</span>
          </div>
          <div style={styles.detailItem}>
            <FaCalendarAlt style={styles.icon2} />
            <span style={styles.detailLabel}>Date & Time:</span>
            <span style={styles.detailValue}>{new Date(itinerary.DatesTimes).toLocaleString()}</span>
          </div>
          
          <div style={styles.detailItem}>
            <FaDollarSign style={styles.icon2} />
            <span style={styles.detailLabel}>Price:</span>
            <span style={styles.detailValue}>${itinerary.Price}</span>
          </div>
          <div style={styles.detailItem}>
            <FaGlobe style={styles.icon2} />
            <span style={styles.detailLabel}>Language:</span>
            <span style={styles.detailValue}>{itinerary.Language}</span>
          </div>
          <div style={styles.detailItem}>
            <FaUser style={styles.icon2} />
            <span style={styles.detailLabel}>Tour Guide:</span>
            <span style={styles.detailValue}>{itinerary.TourGuide}</span>
          </div>
   
        <div style={styles.detailItem}>
         <FaWheelchair style={styles.icon2}/>
          <span style={styles.detailLabel}>Accesibility:</span>
          <span style={styles.detailValue}>{itinerary.Accesibility}</span>
          </div>
          <div style={styles.detailItem}>
             <FaShuttleVan style={styles.icon2}/>
             <span style={styles.detailLabel}>pickUpDropOff:</span>

             <span style={styles.detailValue}>{itinerary.pickUpDropOff}</span>
             </div>
             <div style={styles.detailItem}>
            <CiHeart style={styles.icon2} />
            <span style={styles.detailLabel}>Prefrence tag:</span>
            <span style={styles.detailValue}>{itinerary.PreferenceTag}</span>
          </div>
          <div style={styles.detailItem}>
              <strong>Booked:</strong> {itinerary.Booked ? 'Yes' : 'No'}
          </div>
                        
        
         </div>
{/* Feedback Section */}
<div style={{ marginTop: '20px' }}>
  <h5 style={{ fontSize: '14px', marginBottom: '10px' }}>Feedback:</h5>
  {itinerary.feedback.length > 0 ? (
    <Slider {...sliderSettings}>
      {itinerary.feedback.map((f, idx) => (
        <div key={idx} style={styles.sliderItem}>
          <p>
            <strong>{f.touristUsername}:</strong>
          </p>
          {/* Display Rating in Stars */}
          <div style={styles.ratingContainer}>
            <span style={styles.stars}>
              {'★'.repeat(Math.floor(f.rating)) + '☆'.repeat(5 - Math.floor(f.rating))}
            </span>
            <span style={styles.ratingText}>{f.rating}/5</span>
          </div>
          {f.comment && <p>{f.comment}</p>}
        </div>
      ))}
    </Slider>
  ) : (
    <p>No feedback yet.</p>
  )}

       

          {/* Feedback Form
          <div style={styles.feedbackForm}>
            <h4>Leave Your Feedback</h4>
            <div style={styles.smileyContainer}>
              {[1, 2, 3, 4, 5].map((rate) => (
                <div
                  key={rate}
                  style={rate === rating ? styles.selectedSmiley : styles.smiley}
                  onClick={() => setRating(rate)}
                >
                  {rate === 1 && <SentimentVeryDissatisfiedOutlined />}
                  {rate === 2 && <SentimentDissatisfiedOutlined />}
                  {rate === 3 && <SentimentNeutralOutlined />}
                  {rate === 4 && <SentimentSatisfiedOutlined />}
                  {rate === 5 && <SentimentVerySatisfiedOutlined />}
                </div>
              ))}
            </div>
            <textarea
              name="comment"
              value={newFeedback.comment}
              onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
              placeholder="Leave a comment (optional)"
              rows="4"
              style={styles.textarea}
            />
            <button onClick={submitFeedback} style={styles.button}>
              Submit Feedback
            </button>
            {feedbackSubmitted && <p style={styles.success}>Feedback submitted successfully!</p>}
          </div> */}
        </div>
      </div>
    </div>
    </div>

  );
};
const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
};

const styles = {
  sliderItem: {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
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
  title: {
    fontSize: '24px',
    color: 'white',
    fontWeight: 'bold',
  },
  profileIcon: {
    fontSize: '40px',
    color: 'white',
    cursor: 'pointer',
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
    alignItems: 'flex-start', // Ensure alignment starts from the left
    padding: '10px 0',
    overflowX: 'hidden',
    transition: 'width 0.3s ease',
    zIndex: 1000,
  },
  sidebarExpanded: {
    width: '200px', // Width when expanded
  },
  bellIcon: {
    fontSize: '20px',
    color: '#0F5132',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the left
    padding: '10px',
    width: '100%', // Take full width of the sidebar
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  iconContainerHover: {
    backgroundColor: '#084B24', // Background on hover
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
  labelVisible: {
    opacity: 1, // Fully visible when expanded
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
    paddingTop: '80px',
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
    
  title2: {
    fontSize: '24px',
    color: 'white',
    textAlign: 'center',
    marginRight:'670px'
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
  icon2: {
    fontSize: '20px',
    color: '#0F5132',
  },
  item: {
 
    padding: '10px 0',
    
  },
  feedbackSection: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '20px',
    marginBottom: '10px',
    color: '#0F5132',
  },
  smileyContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: '20px 0',
  },
  smiley: {
    fontSize: '30px',
    cursor: 'pointer',
    color: '#ccc',
  },
  selectedSmiley: {
    fontSize: '30px',
    cursor: 'pointer',
    color: '#0F5132',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  success: {
    color: 'green',
    marginTop: '10px',
  },
};

export default ItineraryDetail;
