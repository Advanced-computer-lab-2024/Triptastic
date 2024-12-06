import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import {  FaClock, FaUserTie, FaTag, FaTicketAlt, FaArrowLeft } from 'react-icons/fa';
import romanImage from '../images/roman.jpg';
import museumHistoryImage from '../images/museumhistory.jpg';
import museummImage from '../images/museumm.jpg';
import buckinghamImage from '../images/buckingham.jpg';
import fasImage from '../images/fas.jpg';
import pyramidsImage from '../images/pyramids.jpg';
import { FaBars, FaTimes,FaHome, FaUser, FaMapMarkerAlt } from "react-icons/fa"; // For menu icons
import {FaUserCircle, FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, } from "react-icons/fa";
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';


const MuseumDetail = () => {
  const { Name } = useParams();
  const navigate = useNavigate(); // Initialize navigate for navigation
  const [museum, setMuseum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMuseum = async () => {
      try {
        const response = await fetch(`http://localhost:8000/getMuseumDetails/${encodeURIComponent(Name)}`);
        if (!response.ok) {
          throw new Error('Museum not found');
        }
        const data = await response.json();
        console.log(data);

        setMuseum(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMuseum();
  }, [Name]);

  if (loading) return <p style={styles.loading}>Loading museum details...</p>;
  if (errorMessage) return <p style={styles.error}>{errorMessage}</p>;
  if (!museum) return <p style={styles.noMuseum}>No museum found.</p>;

  return (
<div style={styles.container}>

      {/* Header Section */}
    <header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <h1 style={{fontSize:'24px',margintop:'20px',marginRight:'700px'}}>Museums</h1>  


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

      


      <div style={styles.imageContainer}>
        {museum.image && (
          <img
            src={
              museum.Name === "Roman Museum"
                ? romanImage
                : museum.Name === "National Museum of History"
                ? museumHistoryImage
                : museum.Name === "museum"
                ? museummImage
                : museum.Name === "buckingham palace"
                ? buckinghamImage
                : museum.Name === "fas"
                ? fasImage
                : museum.Name === "pyramids"
                ? pyramidsImage
                : museum.mainImage || "defaultFallbackImage.jpg"
            }
            alt={museum.Name}
            style={styles.image}
          />
        )}
      </div>

      <div style={styles.content}>
        <p style={styles.description}>{museum.Description}</p>

        <div style={styles.details}>
          <div style={styles.detailItem}>
            <FaMapMarkerAlt style={styles.icon2} />
            <span style={styles.detailLabel}>Location:</span>
            <span style={styles.detailValue}>{museum.Location}</span>
          </div>
          <div style={styles.detailItem}>
            <FaClock style={styles.icon2} />
            <span style={styles.detailLabel}>Opening Hours:</span>
            <span style={styles.detailValue}>{museum.OpeningHours}</span>
          </div>
          <div style={styles.detailItem}>
            <FaUserTie style={styles.icon2} />
            <span style={styles.detailLabel}>Tourism Governor:</span>
            <span style={styles.detailValue}>{museum.TourismGovernor}</span>
          </div>
        </div>

        {/* Divider Line */}
        <hr style={styles.divider} />

        <div style={styles.ticketPrices}>
          <h3 style={styles.sectionTitle}>
            <FaTicketAlt style={styles.sectionIcon} /> Ticket Prices
          </h3>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Foreigner:</span>
            <span style={styles.detailValue}>${museum.TicketPrices?.Foreigner}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Native:</span>
            <span style={styles.detailValue}>${museum.TicketPrices?.Native}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Student:</span>
            <span style={styles.detailValue}>${museum.TicketPrices?.Student}</span>
          </div>
        </div>

        {/* Divider Line */}
        <hr style={styles.divider} />

        <div style={styles.tags}>
          <h3 style={styles.sectionTitle}>
            <FaTag style={styles.sectionIcon} /> Tags
          </h3>
          <p style={styles.detail}>
            <span style={styles.detailLabel}>Historical Period:</span> {museum.Tags?.HistoricalPeriod || 'N/A'}
          </p>
        </div>
      </div>
    </div>


  );
};

const styles = {
  container2: {
    marginTop:'60px',
    fontFamily: 'Arial, sans-serif',
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
  item: {
 
    padding: '10px 0',
    
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
 
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '60px',
    width: '70px',
    borderRadius: '10px',
  },
  profileIcon:{
    fontSize: '40px',
    cursor: 'pointer',

  },
 
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '750px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    marginTop:'50px',
  },
  
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '0',
    textAlign: 'center',
    flexGrow: 1, // Ensures the title stays centered
  },
  imageContainer: {
    width: '100%',
    textAlign: 'center',
    marginBottom: '15px',
  },
  image: {
    width: '70%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  },
  content: {
    textAlign: 'left',
    width: '100%',
  },
  description: {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.4',
    marginBottom: '15px',
  },
  details: {
    marginBottom: '15px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  detailValue: {
    color: '#333',
  },
  icon2: {
    fontSize: '18px',
    color: '#0F5132',
  },
  ticketPrices: {
    marginBottom: '15px',
  },
  tags: {
    marginBottom: '15px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0F5132',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  
  divider: {
    border: 'none',
    borderTop: '1px solid #ddd',
    margin: '20px 0',
  },
  loading: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#555',
    marginTop: '15px',
  },
  error: {
    textAlign: 'center',
    fontSize: '16px',
    color: 'red',
    marginTop: '15px',
  },
  noMuseum: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#888',
    marginTop: '15px',
  },
};

export default MuseumDetail;
