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
  logo: {
    height: "70px",
    width: "80px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginRight:'650px'
  },
  description: {
    marginTop:'40px',

    fontSize: "16px",
    marginBottom: "20px",
    color: "#333",
  },
  grid: {
    marginTop:'30px',
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", // 4 items per row
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
};


export default Guest;
