import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import introJs from "intro.js";
import "intro.js/introjs.css"; // Import Intro.js styles
import museumImage from "../images/museum.jpg";
import itineraryImage from "../images/itinerary.jpg";
import historicalImage from "../images/historical.jpg";
import activityImage from "../images/activity.jpg";
import logo from "../images/image.png";

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
        ],
      })
      .start();
  }, []); // Empty array ensures the effect runs once when the component is mounted

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>Welcome, Guest!</h1>
      </header>

      <p style={styles.description}>
        You are currently browsing as a guest. Explore our services without an account. If you wish to register, please{" "}
        <span
          style={styles.registerLink}
          onClick={() => navigate("/tourist-register")}
        >
          go to the registration page.
        </span>
      </p>

      <div style={styles.grid}>
        {/* Museums Section */}
        <div className="museums" style={styles.card} onClick={() => navigate("/museums")}>
          <img src={museumImage} alt="Museums" style={styles.image} />
          <h2 style={styles.cardTitle}>Museums</h2>
        </div>

        {/* Historical Locations Section */}
        <div className="historical" style={styles.card} onClick={() => navigate("/historical-locations")}>
          <img src={historicalImage} alt="Historical Locations" style={styles.image} />
          <h2 style={styles.cardTitle}>Historical Locations</h2>
        </div>

        {/* Itineraries Section */}
        <div className="itineraries" style={styles.card} onClick={() => navigate("/itineraries")}>
          <img src={itineraryImage} alt="Itineraries" style={styles.image} />
          <h2 style={styles.cardTitle}>Itineraries</h2>
        </div>

        {/* Activities Section */}
        <div className="activities" style={styles.card} onClick={() => navigate("/activities")}>
          <img src={activityImage} alt="Activities" style={styles.image} />
          <h2 style={styles.cardTitle}>Activities</h2>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Montserrat, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    padding: "20px",
  },
  header: {
    backgroundColor: "#0F5132",
    color: "#fff",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    borderRadius: "8px",
    marginBottom: "30px",
  },
  logo: {
    height: '70px',
    width: '80px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginLeft:'550px'
  },
  description: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#333",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
  },
  description: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#333",
    lineHeight: "1.6",
  },
  registerLink: {
    color: "#0F5132",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Guest;
