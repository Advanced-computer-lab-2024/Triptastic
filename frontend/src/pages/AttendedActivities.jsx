import React, { useState, useEffect } from "react";
import logo from "../images/image.png";
import { FaUserCircle, FaList,FaCalendarDay, FaMapMarkerAlt, FaStar, FaComments, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AttendedActivitiesPage = () => {
  const [attendedActivities, setAttendedActivities] = useState([]);
  const [username] = useState(localStorage.getItem("Username") || "");
  const [rating, setRating] = useState("");
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
    try {
      const response = await fetch(
        `http://localhost:8000/rateActivity?Username=${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: activityName, rating: parseInt(rating, 10) }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Rating submitted successfully");
        setRating("");
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

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title}>My Attended Activities</h1>
        <FaUserCircle
          style={styles.profileIcon}
          onClick={() => navigate("/tourist-profile")}
        />
      </header>

      {/* Main Content */}
      <div style={styles.content}>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}

        {attendedActivities.length === 0 ? (
          <p>No attended activities found.</p>
        ) : (
          attendedActivities.map((activity) => (
            <div key={activity._id} style={styles.activityCard}>
              <h4 style={styles.activityTitle}>
                {activity.name} <FaEdit style={styles.icon} />
              </h4>
              <p>
                <FaCalendarDay style={styles.icon} />{" "}
                <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
              </p>
              <p>
                <FaMapMarkerAlt style={styles.icon} />{" "}
                <strong>Location:</strong> {activity.location}
              </p>
              <p>
                <FaList style={styles.icon} />{" "}
                <strong>Category:</strong> {activity.Category}
              </p>
              <p>
                <FaStar style={styles.icon} />{" "}
                <strong>Average Rating:</strong>{" "}
                {activity.ratings && activity.ratings.length > 0
                  ? (
                      activity.ratings.reduce((sum, r) => sum + r.rating, 0) /
                      activity.ratings.length
                    ).toFixed(1)
                  : "No ratings yet"}
              </p>

              {/* Rating Section */}
              <div style={styles.rateSection}>
                <label>
                  <strong>Rate this activity (1-5):</strong>
                </label>
                <input
                  type="number"
                  value={selectedActivity === activity.name ? rating : ""}
                  onChange={(e) => {
                    setSelectedActivity(activity.name);
                    setRating(e.target.value);
                  }}
                  min="1"
                  max="5"
                  style={styles.input}
                />
                <button
                  onClick={() => handleRateActivity(activity.name)}
                  style={styles.button}
                >
                  Submit Rating
                </button>
              </div>

              {/* Comment Section */}
              <div style={styles.commentSection}>
                <label>
                  <strong>Comment:</strong>
                </label>
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

              {/* Comments */}
              <div>
                <h5 style={styles.commentsTitle}>
                  <FaComments style={styles.icon} /> Comments:
                </h5>
                {activity.comments && activity.comments.length > 0 ? (
                  <ul style={styles.commentList}>
                    {activity.comments.map((comm, index) => (
                      <li key={index}>
                        <p>
                          <strong>{comm.Username}:</strong> {comm.comment}
                        </p>
                        <p>
                          <em>Date: {new Date(comm.commentedAt).toLocaleDateString()}</em>
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments yet.</p>
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
    margin: 0,
    fontWeight: 'bold',
    marginLeft:'30px'
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
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
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  icon: {
    marginLeft: "5px",
    fontSize: "14px",
    color: "#0F5132",
  },
  rateSection: {
    marginTop: "10px",
  },
  commentSection: {
    marginTop: "10px",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    marginRight: "10px",
    fontSize:"10px"
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
    fontSize:'13px'
  },
  commentsTitle: {
    marginTop: "10px",
  },
  commentList: {
    listStyleType: "none",
    padding: "0",
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
