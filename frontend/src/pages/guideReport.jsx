import React, { useState, useEffect } from 'react';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import {FaMap,FaStar,FaBox,
  FaUserCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';

const GuideReport = () => {
  const [tourGuideInfo, setTourGuideInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch Tour Guide Data
  const fetchTourGuideData = async () => {
    const Username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/getTourGuide?Username=${Username}`);
      if (response.ok) {
        const data = await response.json();
        setTourGuideInfo(data);
      } else {
        console.error('Failed to fetch tour guide data');
      }
    } catch (error) {
      console.error('Error fetching tour guide data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTourGuideData();
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>
        <h2 style={styles.title}>
          {localStorage.getItem("Username")}'s Reviews
        </h2>
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
        <div  class="itineraries" style={styles.item} onClick={() => navigate('/my-itineraries')}>
          <FaMap style={styles.icon} />
          <span className="label" style={styles.label}>
            My Itineraries
          </span>
        </div>
        <div  class="report" style={styles.item} onClick={() => navigate('/guideReport')}>
          <FaStar style={styles.icon} />
          <span className="label" style={styles.label}>
            Reviews
          </span>
        </div>
        <div  class="profile"style={styles.item} onClick={() => navigate('/tour-guide-profile')}>
          <FaUserCircle style={styles.icon} />
          <span className="label" style={styles.label}>
            Profile
          </span>
        </div>
      
      
     
      </div>
      {/* Flagged Itineraries Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <span style={styles.titleText}>Flagged Itineraries</span>
          <AssistantPhotoIcon style={styles.sectionIcon} />
        </h3>
        {tourGuideInfo?.flaggedItineraries?.length > 0 ? (
          <ul style={styles.list}>
            {tourGuideInfo.flaggedItineraries.map((itinerary, index) => (
              <li key={index} style={styles.listItem}>
                <div style={styles.itineraryInfo}>
                  <p style={styles.listText}>
                    <LocationOnIcon style={styles.iconn} />
                    <strong>Locations:</strong> {itinerary.Locations.join(', ')}
                  </p>
                  <p style={styles.listText}>
                    <CalendarMonthIcon style={styles.iconn} />
                    <strong>Dates:</strong> {itinerary.DatesTimes}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noData}>No flagged itineraries.</p>
        )}
      </div>

      {/* Feedback Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <span style={styles.titleText}>Feedback</span>
          <FeedbackIcon style={styles.sectionIcon} />
        </h3>
        {tourGuideInfo?.feedback?.length > 0 ? (
          <ul style={styles.feedbackList}>
            {tourGuideInfo.feedback.map((feedback, index) => (
              <li key={index} style={styles.feedbackItem}>
                <h4 style={styles.feedbackUser}>
                  <FaUserCircle style={styles.iconn} />
                  {feedback.touristUsername}
                </h4>
                <p style={styles.listText}>
                  <strong>Rating:</strong> {feedback.rating}/5
                </p>
                <p style={styles.listText}>
                  <strong>Comment:</strong> {feedback.comment}
                </p>
                <p style={styles.feedbackDate}>
                  <CalendarMonthIcon style={styles.iconn} /> {feedback.date}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noData}>No feedback available.</p>
        )}
      </div>
    </div>
  );
};

export default GuideReport;





















const styles = {
  container: {
    top:'-90px',
     margin: '90px auto',
    maxWidth: '1200px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    position: 'fixed',
    height: '60px',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#0F5132',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    zIndex: 1000,
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
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
    marginRight:'600px'
  },
  profileIcon: {
    fontSize: '30px',
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
  fileInput: {
    display: 'none',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  disabledInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f0f0f0',
    cursor: 'not-allowed',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    resize: 'vertical',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'left', // Center align the buttons
    gap: '5px', // Add spacing between the buttons
    //marginTop: '20px',
  },
  submitButton: {
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Red color
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  mainContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    marginTop: "20px",
  },
  filterContainer: {
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "200px",
    marginTop:'70px'
  },
  filterTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0F5132",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  filterIcon: {
    fontSize: "20px",
    color: "#0F5132",
  },
  filterDropdown: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginTop: "10px",
  },
  reportsSection: {
    flex: "3",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#0F5132",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  titleText: {
    color: '#0F5132', // Green shade for the title
  },

  flagIcon: {
    fontSize: "18px",
    color: "#0F5132",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px 0",
  },
  box: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  listText: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "10px",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#0F5132",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize:"15px",
    alignSelf: "flex-start",
  },
  reportSection: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f7fdf8", // Lighter green background
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Arial', sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
    fontSize: "14px", // Smaller font for simplicity
    color: "#333", // Neutral text color
  },
  tableHead: {
    backgroundColor: "#0F5132",
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
  },
  tableHeadCell: {
    padding: "12px 10px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  tableRow: {
    backgroundColor: "#fff", // Alternate white rows
    textAlign: "left",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #e0e0e0", // Subtle border
    fontSize: "13px", // Smaller font for cells
  },
  tableRowAlt: {
    backgroundColor: "#f9f9f9", // Light alternate row color
  },
  reportTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0F5132",
    marginBottom: "10px",
  },
  noData: {
    color: "#999",
    textAlign: "center",
  },
  section: {
    marginTop: "20px",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#0F5132",
    marginBottom: "10px",
  },
  sectionIcon: {
    fontSize: "20px",
    color: "#0F5132",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
    position: "relative",
  },
  itineraryInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  listText: {
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  iconn: {
    fontSize: "16px",
  },
  noData: {
    fontSize: "14px",
    color: "#777",
    textAlign: "center",
  },
  feedbackList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  feedbackItem: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  feedbackUser: {
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  feedbackDate: {
    fontSize: "12px",
    color: "#777",
    textAlign: "right",
    marginTop: "5px",
  },
  
}