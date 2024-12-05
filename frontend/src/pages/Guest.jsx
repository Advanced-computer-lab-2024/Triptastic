import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import introJs from "intro.js";
import "intro.js/introjs.css"; // Import Intro.js styles
import museumImage from "../images/museum.jpg";
import itineraryImage from "../images/it.png";
import historicalImage from "../images/historical.jpg";
import activityImage from "../images/activity.jpg";
import flightImage from "../images/flight.jpg";
import hotelImage from "../images/hotel.jpg";
import transportationImage from "../images/transportation.webp";
import productImage from "../images/product.jpg";
import logo from "../images/image.png";
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, FaDollarSign,FaSearch} from "react-icons/fa";
import { FaBell,FaUserCircle} from 'react-icons/fa';
import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';
import { FaGlobe } from 'react-icons/fa';


const Guest = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  localStorage.setItem("context", "guest");

  // Start the intro tour automatically when the page loads
  useEffect(() => {
    introJs()
      .setOptions({
        steps: [
          {
            element: document.querySelector(".guest-header h1"),
            intro: "Welcome to our vacation planning platform! Let us show you around.",
          },
          {
            element: document.querySelector(".museums"),
            intro: "You can start exploring museums by clicking here.",
          },
          {
            element: document.querySelector(".historical"),
            intro: "Interested in historical locations? This button will take you there.",
          },
          {
            element: document.querySelector(".itineraries"),
            intro: "Looking for itineraries? Click here to find various vacation plans.",
          },
          {
            element: document.querySelector(".activities"),
            intro: "Explore exciting activities by clicking here.",
          },
          {
            element: document.querySelector(".flights"),
            intro: "Looking for flights ? by clicking here.",
          },
          {
            element: document.querySelector(".hotels"),
            intro: "Best Hotels with cheapest prices by clicking here.",
          },
          {
            element: document.querySelector(".transportation"),
            intro: "Want to go anywhere by clicking here.",
          },
          {
            element: document.querySelector(".products"),
            intro: "You can by anything you wish for  by clicking here.",
          },
        ],
      })
      .start();
  }, []); // Empty array ensures the effect runs once when the component is mounted

  return (
    <div>


<header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <h1 style={styles.title}>Welcome Guest!</h1>
  <div style={styles.headerIconsContainer}>
   

    {/* Sign In Button */}
    <button style={styles.signInButton} onClick={() => navigate('/tourist-register')}>
      Sign In
    </button>
  </div>
</header>

{/* Main Content */}
<div className="tourist-profile-container" >
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
        <div   style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaUniversity style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Loc
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
      </div>



      <div style={styles.grid}>
  {/* Museums Section */}
  <div
    className="museums"
    style={styles.card}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
    }}
    onClick={() => navigate("/museums")}
  >
    <img
      src={museumImage}
      alt="Museums"
      style={styles.image}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
    <h2 style={styles.cardTitle}>Museums</h2>
  </div>

  {/* Historical Locations Section */}
  <div
    className="historical"
    style={styles.card}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
    }}
    onClick={() => navigate("/historical-locations")}
  >
    <img
      src={historicalImage}
      alt="Historical Locations"
      style={styles.image}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
    <h2 style={styles.cardTitle}>Historical Locations</h2>
  </div>

  {/* Itineraries Section */}
  <div
    className="itineraries"
    style={styles.card}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
    }}
    onClick={() => navigate("/itineraries")}
  >
    <img
      src={itineraryImage}
      alt="Itineraries"
      style={styles.image}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
    <h2 style={styles.cardTitle}>Itineraries</h2>
  </div>

  {/* Activities Section */}
  <div
    className="activities"
    style={styles.card}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
    }}
    onClick={() => navigate("/activities")}
  >
    <img
      src={activityImage}
      alt="Activities"
      style={styles.image}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
    <h2 style={styles.cardTitle}>Activities</h2>
  </div>

  {/* Flights Section */}
  <div
    className="flights"
    style={styles.card}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
    }}
    onClick={() => navigate("/book-flights")}
  >
    <img
      src={flightImage}
      alt="Flights"
      style={styles.image}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
    <h2 style={styles.cardTitle}>Flights</h2>
  </div>

  {/* Hotels Section */}
  <div
    className="hotels"
    style={styles.card}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
    }}
    onClick={() => navigate("/book-hotels")}
  >
    <img
      src={hotelImage}
      alt="Hotels"
      style={styles.image}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
    <h2 style={styles.cardTitle}>Hotels</h2>
  </div>

  {/* Transportation Section */}
  <div
    className="transportation"
    style={styles.card}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
    }}
    onClick={() => navigate("/book-transportation")}
  >
    <img
      src={transportationImage}
      alt="Transportation"
      style={styles.image}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
    <h2 style={styles.cardTitle}>Transportation</h2>
  </div>

  {/* Products Section */}
  <div
    className="products"
    style={styles.card}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
    }}
    onClick={() => navigate("/products")}
  >
    <img
      src={productImage}
      alt="Products"
      style={styles.image}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
    <h2 style={styles.cardTitle}>Products</h2>
  </div>
</div>

    </div>
  );
};

const styles = {
  container: {
    marginTop:'60px',
    fontFamily: "Montserrat, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    padding: "20px",
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
  headerIconsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px', // Spacing between the icons
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '60px',
    width: '70px',
    borderRadius: '10px',
  },
 

  icon: {
    fontSize: '16px',
    color: '#000',
  },
  currency: {
    fontWeight: 'bold',
  },
  signInButton: {
    backgroundColor: 'white', // Black button
    color: 'black',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  signInButtonHover: {
    backgroundColor: '#333', // Darker black on hover
  },
  
  notificationButton: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: '24px',
    color: 'white',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '5px',
    fontSize: '12px',
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
    marginRight:'50px'
  },
  description: {
    marginTop:'40px',

    fontSize: "16px",
    marginBottom: "20px",
    color: "#333",
  },
  grid: {
    marginTop:'10px',
    display: "grid",
    gridTemplateColumns: 'repeat(3, auto)', // Exactly 3 cards per row
  justifyContent: 'center', // Center the grid
    gap: "20px",
  },
  card: {
    width: '400px', // Fixed width for the card
    maxWidth: '600px', // Ensure the card doesn't grow beyond 300px
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  cardHover: {
    transform: "scale(1.05)", // Slightly enlarge on hover
    boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)", // Stronger shadow on hover
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#0F5132",
    padding: "10px 0",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    transition: "transform 0.3s ease", // Smooth animation for image
  },
  imageHover: {
    transform: "scale(1.05)", // Slightly zoom image on hover
  },
  registerLink: {
    color: "#0F5132",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
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
};


export default Guest;
