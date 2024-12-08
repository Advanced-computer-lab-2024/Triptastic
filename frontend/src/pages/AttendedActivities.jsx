import React, { useState, useEffect } from "react";
import logo from "../images/image.png";
import {
  FaUserCircle,
  FaList,
  FaCalendarDay,
  FaMapMarkerAlt,
  FaComments,
  FaStar
} from "react-icons/fa";
import MuseumIcon from '@mui/icons-material/Museum';

import {
  SentimentVeryDissatisfiedOutlined,
  SentimentDissatisfiedOutlined,
  SentimentNeutralOutlined,
  SentimentSatisfiedOutlined,
  SentimentVerySatisfiedOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
   FaDollarSign,FaSearch} from "react-icons/fa";
import { MdNotificationImportant } from 'react-icons/md';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import "intro.js/introjs.css"; // Import Intro.js styles
import introJs from "intro.js";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const AttendedActivitiesPage = () => {
  const [attendedActivities, setAttendedActivities] = useState([]);
  const [username] = useState(localStorage.getItem("Username") || "");
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendedActivities();
  }, []);

  const fetchAttendedActivities = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/getAttendedActivities?Username=${username}`
      );
      const data = await response.json();
      if (response.ok) {
        setAttendedActivities(data);
      } else {
        setErrorMessage(data.message || "Failed to fetch attended activities");
      }
    } catch (error) {
      console.error("Error fetching attended activities:", error);
      setErrorMessage("An error occurred while fetching attended activities");
    }
  };

  const handleRateActivity = async (activityName) => {
    if (!rating) {
      setErrorMessage("Please select a rating before submitting.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/rateActivity?Username=${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: activityName, rating }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Rating submitted successfully");
        setRating(null);
        fetchAttendedActivities(); // Refresh activities to see the new rating
      } else {
        setErrorMessage(data.error || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setErrorMessage("Failed to submit rating");
    }
  };

  const handleCommentOnActivity = async (activityName) => {
    try {
      const response = await fetch(`http://localhost:8000/commentOnActivity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: activityName, Username: username, comment }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Comment submitted successfully");
        setComment("");
        fetchAttendedActivities(); // Refresh activities to see the new comment
      } else {
        setErrorMessage(data.error || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setErrorMessage("Failed to submit comment");
    }
  };

  const SmileyRating = ({ onRate }) => (
    <div style={styles.smileyContainer}>
      {[1, 2, 3, 4, 5].map((rate) => (
        <div
          key={rate}
          style={rate === rating ? styles.selectedSmiley : styles.smiley}
          onClick={() => {
            setRating(rate);
            onRate(rate);
          }}
        >
          {rate === 1 && <SentimentVeryDissatisfiedOutlined />}
          {rate === 2 && <SentimentDissatisfiedOutlined />}
          {rate === 3 && <SentimentNeutralOutlined />}
          {rate === 4 && <SentimentSatisfiedOutlined />}
          {rate === 5 && <SentimentVerySatisfiedOutlined />}
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title}>My Attended Activities</h1>
        <div>

        </div>
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
        <div style={styles.item} onClick={() => navigate('/tourist-profile')}>
          <FaUserCircle style={styles.iconn} />
          <span className="label" style={styles.label}>
             Home Page
          </span>
        </div>
        <div className="historical" style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaLandmark style={styles.iconn} />
          <span className="label" style={styles.label}>
            Historical Loc
          </span>
        </div>
        <div className="museums" style={styles.item} onClick={() => navigate('/museums')}>
          <MuseumIcon style={styles.iconn} />
          <span className="label" style={styles.label}>
            Museums
          </span>
        </div>
        <div className="products" style={styles.item} onClick={() => navigate('/products')}>
          <FaBox style={styles.iconn} />
          <span className="label" style={styles.label}>
            Products
          </span>
        </div>
        <div className="itineraries" style={styles.item} onClick={() => navigate('/itineraries')}>
          <FaMap style={styles.iconn} />
          <span className="label" style={styles.label}>
            Itineraries
          </span>
        </div>
        <div className="activities" style={styles.item} onClick={() => navigate('/activities')}>
          <FaRunning style={styles.iconn} />
          <span className="label" style={styles.label}>
            Activities
          </span>
        </div>
        <div className="flights" style={styles.item} onClick={() => navigate('/book-flights')}>
          <FaPlane style={styles.iconn} />
          <span className="label" style={styles.label}>
            Book Flights
          </span>
        </div>
        <div className="hotels" style={styles.item} onClick={() => navigate('/book-hotels')}>
          <FaHotel style={styles.iconn} />
          <span className="label" style={styles.label}>
            Book a Hotel
          </span>
        </div>
        <div className="transportation" style={styles.item} onClick={() => navigate('/book-transportation')}>
          <FaBus style={styles.iconn} />
          <span className="label" style={styles.label}>
           Transportation
          </span>
        </div>
       
      </div>
      <div style={styles.content}>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}

        {attendedActivities.length === 0 ? (
          <p>No attended activities found.</p>
        ) : (
          attendedActivities.map((activity) => (
            <div key={activity._id} style={styles.activityCard}>
              <h4 style={styles.activityTitle}>{activity.name}</h4>
              <div style={styles.detailsContainer}>
  <div style={styles.detailItem}>
    <FaCalendarDay style={styles.icon} />
    <span style={styles.detailText}>
      <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
    </span>
  </div>
  <div style={styles.detailItem}>
    <FaMapMarkerAlt style={styles.icon} />
    <span style={styles.detailText}>
      <strong>Location:</strong> {activity.location}
    </span>
  </div>
  <div style={styles.detailItem}>
    <FaList style={styles.icon} />
    <span style={styles.detailText}>
      <strong>Category:</strong> {activity.Category}
    </span>
  </div>
  <div style={styles.detailItem}>
    <FaStar style={styles.icon} />
    <span style={styles.detailText}>
      <strong>Average Rating:</strong>{" "}
      {activity.ratings && activity.ratings.length > 0
        ? (
            activity.ratings.reduce((sum, r) => sum + r.rating, 0) /
            activity.ratings.length
          ).toFixed(1)
        : "No ratings yet"}
    </span>
  </div>
</div>
              <div>
                <h5>Rate this activity(1-5):</h5>
                <SmileyRating onRate={(rating) => setRating(rating)} />
                <button
                  onClick={() => handleRateActivity(activity.name)}
                  style={styles.button}
                >
                  Submit Rating
                </button>
              </div>

              <div style={styles.commentSection}>
              <h5>Leave a comment:</h5>
                <textarea
                  value={selectedActivity === activity.name ? comment : ""}
                  onChange={(e) => {
                    setSelectedActivity(activity.name);
                    setComment(e.target.value);
                  }}
                  style={styles.textarea}
                />
                <button
                  onClick={() => handleCommentOnActivity(activity.name)}
                  style={styles.button}
                >
                  Submit Comment
                </button>
              </div>

              <div style={styles.commentsSection}>
  <h5 style={styles.commentsTitle}>
    <FaComments style={styles.icon} /> Comments
  </h5>
  {activity.comments && activity.comments.length > 0 ? (
    <ul style={styles.commentList}>
      {activity.comments.map((comm, index) => (
        <li key={index} style={styles.commentItem}>
          <div style={styles.commentHeader}>
          <span style={styles.commentUser}>
              <FaUserCircle style={styles.userIcon} /> <strong>{comm.Username}</strong>
            </span>
            <span style={styles.commentDate}>
              {new Date(comm.commentedAt).toLocaleDateString()}
            </span>
          </div>
          <p style={styles.commentText}>{comm.comment}</p>
        </li>
      ))}
    </ul>
  ) : (
    <p style={styles.noCommentsText}>No comments yet.</p>
  )}
</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    position: "fixed",
    height: "60px",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#0F5132",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    zIndex: 1000,
  },
  item: {
 
    padding: '10px 0',
    
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: "60px",
    width: "70px",
    borderRadius: "10px",
  },
  title: {
    fontSize: "24px",
    margin: 0,
    fontWeight: "bold",
    marginLeft: "30px",
  },
  profileIcon: {
    fontSize: "30px",
    color: "white",
    cursor: "pointer",
  },
  content: {
    marginTop: "80px",
  },
  activityCard: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  activityTitle: {
    fontSize: "22px", // Slightly larger font size for prominence
    fontWeight: "bold",
    marginBottom: "12px", // Slightly increased spacing
    color: "#0F5132", // Green shade for consistency
    textAlign: "left", // Align text to the left
    borderBottom: "2px solid #0F5132", // Add an underline for emphasis
    paddingBottom: "5px", // Add spacing below the text
    display: "inline-block", // Ensure underline fits the text length
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px", // Space between each detail item
    marginTop: "10px",
    marginBottom: "15px",
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Space between the icon and the text
  },
  detailText: {
    fontSize: "18px", // Smaller font for details
    color: "#333", // Neutral color for text
    lineHeight: "1.5",
  },
  icon: {
    fontSize: "18px", // Smaller icon size for a cleaner look
    color: "#0F5132", // Green color for icons
  },
  rateSection: {
    marginTop: "10px",
  },
  commentSection: {
    marginTop: "10px",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "#0F5132",
    color: "white",
    padding: "8px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
  },
  smileyContainer: {
    display: "flex",
    gap: "8px",
    cursor: "pointer",
  },
  smiley: {
    fontSize: "24px",
    color: "#ccc",
  },
  selectedSmiley: {
    fontSize: "24px",
    color: "#0F5132",
  },
  commentsSection: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  commentsTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0F5132",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  commentList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
  },
  commentItem: {
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  commentHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
    alignItems: "center",
  },
  commentUser: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
  },
  userIcon: {
    fontSize: "16px",
    color: "#0F5132",
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
  iconn: {
    fontSize: '24px',
    color: 'white',
    cursor: 'pointer',
    marginLeft:'15px'
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
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
    marginRight:'40px'

  },

  commentDate: {
    fontSize: "12px",
    color: "#777",
  },
  commentText: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.5",
    margin: "0",
  },
  noCommentsText: {
    fontSize: "14px",
    color: "#777",
    textAlign: "center",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  success: {
    color: "green",
    fontWeight: "bold",
  },
};

export default AttendedActivitiesPage;
