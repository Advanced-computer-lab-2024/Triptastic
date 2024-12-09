import { CurrencyContext } from "../pages/CurrencyContext";
import React, { useState, useEffect, useContext } from "react";
import {
  FaLandmark,
  FaUniversity,
  FaBox,
  FaMap,
  FaRunning,
  FaBus,
  FaPlane,
  FaGlobe,
  FaClipboardList,
  FaStar,
  FaUserCircle,
  FaWifi,
  FaCoffee,
  FaCar,
  FaCalendarAlt,
  FaSearch,

} from "react-icons/fa";
import MuseumIcon from '@mui/icons-material/Museum';
import HotelIcon from '@mui/icons-material/Hotel';

import logo from "../images/image.png"; // Adjust the path as necessary
import hotel from "../images/hotel5.jpg"; // Adjust the path as necessary

import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip"; // Updated import
const BookHotels = () => {
  const navigate = useNavigate();
  const [hotelDetails, setHotelDetails] = useState({
    cityCode: "",
    checkInDate: "",
    checkOutDate: "",
  });
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [bookedHotels, setBookedHotels] = useState([]);

  useEffect(() => {
    const fetchToken = async () => {
      const API_KEY = process.env.REACT_APP_API_KEY;
      const API_SECRET = process.env.REACT_APP_API_SECRET;

      try {
        const res = await fetch(
          "https://test.api.amadeus.com/v1/security/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "client_credentials",
              client_id: API_KEY,
              client_secret: API_SECRET,
            }),
          }
        );

        const data = await res.json();
        if (data.access_token) {
          setToken(data.access_token);
        } else {
          throw new Error("Failed to obtain access token");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchToken();
  }, []);

  const { selectedCurrency, conversionRate, fetchConversionRate } =
    useContext(CurrencyContext);
    const handleCurrencyChange = (event) => {
      fetchConversionRate(event.target.value); // Update conversion rate for all products
    };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHotelDetails({
      ...hotelDetails,
      [name]: value,
    });
  };
  const handleProfileRedirect = () => {
    const context = localStorage.getItem('context');

    if (context === 'tourist') {
      navigate('/tourist-profile');
    } 
    else if (context === 'guest') {
        navigate('/Guest');
    } else {
      console.error('Unknown context');
      navigate('/'); // Fallback to home
    }
  };

  const fetchHotelIds = async () => {
    const API_URL =
      "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city";
    const { cityCode } = hotelDetails;

    try {
      const res = await fetch(`${API_URL}?cityCode=${cityCode}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch hotel IDs");

      const data = await res.json();
      return data.data.slice(0, 20).map((hotel) => hotel.hotelId);
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const fetchHotelOffers = async (hotelIds) => {
    const { checkInDate, checkOutDate } = hotelDetails;
    const hotelIdsString = hotelIds.join(",");
    const url = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIdsString}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=1`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error from Amadeus API:", errorData);
        throw new Error(errorData.message || "Failed to fetch hotel offers");
      }

      const data = await res.json();
      setHotels(data.data);
      setBookedHotels(new Array(data.data.length).fill(false));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError("Authorization token is not available.");
      setLoading(false);
      return;
    }

    const hotelIds = await fetchHotelIds();
    if (hotelIds.length > 0) {
      await fetchHotelOffers(hotelIds);
    } else {
      setError("No hotels found for the specified city.");
      setLoading(false);
    }
  };

  const handleBooking = (index) => {
    if (localStorage.getItem("context") === "guest") {
      alert("Please login to book a hotel.");
      return;
    }
    const updatedBookings = [...bookedHotels];
    updatedBookings[index] = true;
    setBookedHotels(updatedBookings);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust this number based on how many items you want per page
  const totalPages = Math.ceil(hotels.length / itemsPerPage);
  const currentHotels = hotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      scrollToTop();
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      scrollToTop();
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const styles = {
    paginationButton: {
      padding: "10px 20px",
      margin: "10px",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      cursor: "pointer",
    },
    paginationButtonActive: {
      backgroundColor: "#0F5132",
      color: "#fff",
    },
    paginationButtonDisabled: {
      backgroundColor: "#ddd",
      color: "#999",
      cursor: "not-allowed",
    },
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      maxWidth: "500px", // Smaller width for the form container
      margin: "150px auto", // Center form horizontally and give space from the top
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif",
      color: "#333",
      height: "auto", // Ensures that the container height adjusts based on the content
    },
    searchField: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "50px",
      backgroundColor: "transparent",
    },
    header: {
      height: "60px",
      position: "fixed", // Make the header fixed
      top: "0", // Stick to the top of the viewport
      left: "0",
      width: "100%", // Make it span the full width of the viewport
      backgroundColor: "#0F5132", // Green background
      color: "white", // White text
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add shadow for depth
      zIndex: "1000", // Ensure it appears above other content
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
      fontWeight: "bold",
      color: "white",
    },
    profileIcon: {
      fontSize: "40px",
      color: "white",
      cursor: "pointer",
    },
    currencySelector: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px", // Space between the globe icon and the dropdown
    },
    currencyIcon: {
      fontSize: "18px", // Globe icon size
      color: "#fff", // White color for the globe icon
    },
    currencyDropdown: {
      border: "1px solid #ddd",
      borderRadius: "5px",
      padding: "3px 5px",
      fontSize: "12px", // Smaller font size for the dropdown
      cursor: "pointer",
    },
    sidebar: {
      position: "fixed",
      top: "60px",
      left: 0,
      height: "100vh",
      width: "60px",
      backgroundColor: "rgba(15, 81, 50, 0.85)",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "10px 0",
      overflowY: "auto",
      transition: "width 0.3s ease",
      zIndex: 1000,
      boxSizing: "border-box", // Include padding in width/height calculation
    },
    iconn: {
      fontSize: "18px",
      color: "#333",
    },
    searchButton: {
      backgroundColor: "transparent",
      color: "white",
      border: "none",
      borderRadius: "50px",
      padding: "10px 20px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
    },
    sidebarExpanded: {
      width: "200px",
    },
    iconContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "10px",
      width: "100%",
      color: "#fff",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    icon: {
      fontSize: "24px",
      marginLeft: "15px", // Move icons slightly to the right
      color: "#fff", // Icons are always white
    },
    label: {
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#fff",
      opacity: 0, // Initially hidden
      whiteSpace: "nowrap", // Prevent label text from wrapping
      transition: "opacity 0.3s ease",
    },

    item: {
      padding: "10px 0",
    },
    container2: {
      marginTop: "60px",
      fontFamily: "Arial, sans-serif",
    },
    background: {
      position: "relative",
      backgroundImage: `url(${hotel})`, // Replace with your image path
      height: "400px", // Keeps the container size the same
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
    },
    searchFormHeading: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "white",
      marginBottom: "15px",
      textAlign: "center",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
    },
    searchForm: {
      display: "flex",
      gap: "10px",
      backgroundColor: "rgba(255, 255, 255, 0.5)", // Transparent background
      padding: "15px",
      borderRadius: "50px", // Circular corners
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    input: {
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      fontSize: "14px",
      width: "200px",
      color: "#333",
    },
    searchFormContainer: {
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  return (
    <div>
      <div style={styles.container2}>
        {/* Background Section */}
        <div style={styles.background}>
          <h1 style={styles.searchFormHeading}>
            Latest reviews. Lowest prices.
          </h1>
          <div style={styles.searchFormContainer}>
            <form onSubmit={handleSubmit} style={styles.searchForm}>
              <div style={styles.searchField}>
                <select
                  name="cityCode"
                  value={hotelDetails.cityCode}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                >
                  <option value="">Select a City Code</option>
                  {/* Add City Codes here */}
                  <option value="NYC">New York (NYC)</option>
                  <option value="LAX">Los Angeles (LAX)</option>
                  <option value="LHR">London Heathrow (LHR)</option>
                  <option value="DXB">Dubai (DXB)</option>
                  <option value="SYD">Sydney (SYD)</option>
                  <option value="CDG">Paris Charles de Gaulle (CDG)</option>
                  <option value="FRA">Frankfurt (FRA)</option>
                  <option value="AMS">Amsterdam (AMS)</option>
                  <option value="HKG">Hong Kong (HKG)</option>
                  <option value="SIN">Singapore (SIN)</option>
                </select>
              </div>

              <div style={styles.searchField}>
                <FaCalendarAlt style={styles.iconn} />
                <input
                  type="date"
                  name="checkInDate"
                  value={hotelDetails.checkInDate}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
                              </div>
                              <div style={styles.searchField}>

               <FaCalendarAlt style={styles.iconn} />
                <input
                  type="date"
                  name="checkOutDate"
                  value={hotelDetails.checkOutDate}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
                              </div>

              {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={styles.searchButton}
            >
              {loading ? "Searching..." : "Find Hotels"}
              <FaSearch />
            </button>
            </form>
          </div>
        </div>
      </div>

      <div>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Logo" style={styles.logo} />
          </div>
          <h1 style={styles.title}>Book Hotels</h1>
          <div>

            




        {/* Currency Selector */}
<div style={styles.currencySelector}>
  <FaGlobe style={styles.currencyIcon} />
  <select
    value={selectedCurrency}
    onChange={handleCurrencyChange}
    style={styles.currencyDropdown}
  >
    <option value="USD">USD</option>
    <option value="EUR">EUR</option>
    <option value="GBP">GBP</option>
    <option value="EGP">EGP</option>
    {/* Add other currencies */}
  </select>
</div>

          </div>
        </header>
        {/* Sidebar */}
        <div
          style={styles.sidebar}
          onMouseEnter={(e) => {
            e.currentTarget.style.width = "200px";
            Array.from(e.currentTarget.querySelectorAll(".label")).forEach(
              (label) => (label.style.opacity = "1")
            );
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.width = "60px";
            Array.from(e.currentTarget.querySelectorAll(".label")).forEach(
              (label) => (label.style.opacity = "0")
            );
          }}
        >
          <div style={styles.item} onClick={() => handleProfileRedirect()}>
          <FaUserCircle style={styles.icon} />
          <span className="label" style={styles.label}>
             Home Page
          </span>
        </div>
          <div
            style={styles.item}
            onClick={() => navigate("/historical-locations")}
          >
            <FaUniversity style={styles.icon} />
            <span className="label" style={styles.label}>
              Historical Sites
            </span>
          </div>
          <div style={styles.item} onClick={() => navigate("/museums")}>
            <MuseumIcon style={styles.icon} />
            <span className="label" style={styles.label}>
              Museums
            </span>
          </div>
          <div style={styles.item} onClick={() => navigate("/products")}>
            <FaBox style={styles.icon} />
            <span className="label" style={styles.label}>
              Products
            </span>
          </div>
          <div style={styles.item} onClick={() => navigate("/itineraries")}>
            <FaMap style={styles.icon} />
            <span className="label" style={styles.label}>
              Itineraries
            </span>
          </div>
          <div style={styles.item} onClick={() => navigate("/activities")}>
            <FaRunning style={styles.icon} />
            <span className="label" style={styles.label}>
              Activities
            </span>
          </div>
          <div style={styles.item} onClick={() => navigate("/book-flights")}>
            <FaPlane style={styles.icon} />
            <span className="label" style={styles.label}>
              Book Flights
            </span>
          </div>
          <div style={styles.item} onClick={() => navigate("/book-hotels")}>
            <HotelIcon style={styles.icon} />
            <span className="label" style={styles.label}>
              Book a Hotel
            </span>
          </div>
          <div
            style={styles.item}
            onClick={() => navigate("/book-transportation")}
          >
            <FaBus style={styles.icon} />
            <span className="label" style={styles.label}>
              Transportation
            </span>
          </div>
        
        </div>

        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
          {error && (
            <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
              Error: {error}
            </p>
          )}

          {hotels.length > 0 && (
            <div style={{ maxWidth: "800px", margin: "20px auto" }}>
              <h2
                style={{
                  textAlign: "center",
                  color: "#333",
                  marginBottom: "20px",
                }}
              >
                Available Offers
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "20px",
                }}
              >
                {currentHotels.map((hotel, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "20px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 12px rgba(0, 0, 0, 0.15)";
                      e.currentTarget.style.borderColor = "#0F5132";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 6px rgba(0, 0, 0, 0.1)";
                      e.currentTarget.style.borderColor = "#ddd";
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "10px",
                          color: "#333",
                        }}
                      >
                        {hotel.hotel.name}
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#555",
                          marginBottom: "8px",
                        }}
                      >
                        <strong>Hotel ID:</strong> {hotel.hotel.hotelId}
                      </p>
                      <div
                        style={{
                          marginTop: "10px",
                          fontSize: "14px",
                          color: "#555",
                        }}
                      >
                        <strong>Amenities:</strong>{" "}
                        {hotel.hotel.amenities
                          ? hotel.hotel.amenities.join(", ")
                          : "Standard"}
                      </div>
                      <p
  style={{
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0F5132",
    marginTop: "10px",
  }}
>
  {hotel.offers && hotel.offers[0]?.price?.total
    ? `Price: $${(hotel.offers[0].price.total * conversionRate).toFixed(2)}`
    : "Price: Contact for details"}
</p>


                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "10px",
                        }}
                      >
                        <FaWifi
                          title="Free Wi-Fi"
                          style={{ color: "#0F5132", fontSize: "20px" }}
                        />
                        <FaCoffee
                          title="Breakfast Included"
                          style={{ color: "#FFD700", fontSize: "20px" }}
                        />
                        <FaCar
                          title="Parking Available"
                          style={{ color: "#007bff", fontSize: "20px" }}
                        />
                      </div>
                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <FaStar style={{ color: "#FFD700" }} />
                        <span style={{ fontSize: "14px", color: "#555" }}>
                          {hotel.hotel.userRating
                            ? `${hotel.hotel.userRating} / 5`
                            : "No ratings available"}
                        </span>
                      </div>
                    </div>
                    {bookedHotels[index] ? (
                      <p
                        style={{
                          color: "#0F5132",
                          fontWeight: "bold",
                          fontSize: "16px",
                          textAlign: "center",
                          marginTop: "10px",
                        }}
                      >
                        Booked!
                      </p>
                    ) : (
                      <button
                        onClick={() => handleBooking(index)}
                        style={{
                          marginTop: "10px",
                          backgroundColor: "#0F5132",
                          color: "#fff",
                          padding: "10px 16px",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          alignSelf: "center",
                        }}
                      >
                        Book
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                  onClick={() => {
                    handlePreviousPage();
                    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
                  }}
                  disabled={currentPage === 1}
                  style={{
                    padding: "10px 20px",
                    marginRight: "10px",
                    backgroundColor: currentPage === 1 ? "#ddd" : "#0F5132",
                    color: currentPage === 1 ? "#999" : "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>
                <span style={{ fontSize: "16px", margin: "0 10px" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => {
                    handleNextPage();
                    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
                  }}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "10px 20px",
                    marginLeft: "10px",
                    backgroundColor:
                      currentPage === totalPages ? "#ddd" : "#0F5132",
                    color: currentPage === totalPages ? "#999" : "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookHotels;
