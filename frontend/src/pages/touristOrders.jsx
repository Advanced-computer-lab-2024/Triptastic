import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';

import axios from "axios";
import { CurrencyContext } from "../pages/CurrencyContext";
import logo from "../images/image.png";
import { FaShippingFast, FaBoxOpen, FaDollarSign, FaUserCircle,FaHome} from "react-icons/fa";
import SentimentVeryDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentVeryDissatisfiedOutlined";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import SentimentNeutralOutlinedIcon from "@mui/icons-material/SentimentNeutralOutlined";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import SentimentVerySatisfiedOutlinedIcon from "@mui/icons-material/SentimentVerySatisfiedOutlined";
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,FaStar,FaSearch, FaTrash, FaCartPlus} from "react-icons/fa";import './TouristProfile.css'; // Assuming you create a CSS file for styling
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import beach from '../images/beach.jpg';
import historic from '../images/historic.jpg';
import family from '../images/family.png';
import shopping from '../images/shopping.jpg';
import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';


const TouristOrders = () => {
  const { selectedCurrency, conversionRate, fetchConversionRate } =
    useContext(CurrencyContext);

  const [orders, setOrders] = useState([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [productName, setProductName] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const touristUsername = localStorage.getItem("Username");
    if (!touristUsername) {
      console.error("No tourist username found");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/getTouristOrders?tourist=${touristUsername}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

 
  const submitReview = async (productName) => {
    if (!review.trim()) {
      alert("Review cannot be empty!");
      return;
    }

    try {
      const response = await axios.patch(
        "http://localhost:8000/addReviewToProduct",
        {
          productName,
          review,
          rating,
        }
      );
      if (response) {
        alert("Review submitted!");
        setReview('');
        setRating(0);
        setShowModal(false); // Close modal after submitting review
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  const cancelOrder = async (orderNumber) => {
    // Ask the user for confirmation
    const isConfirmed = window.confirm("Are you sure you want to cancel this order?");
  
    // If the user confirmed, proceed with the cancellation
    if (isConfirmed) {
      const touristUsername = localStorage.getItem("Username");
      if (!touristUsername) {
        console.error("No tourist username found");
        return;
      }
  
      try {
        const response = await axios.patch(
          `http://localhost:8000/cancelOrder`,
          {
            orderNumber,
            username: touristUsername,
          }
        );
  
        if (response.data) {
          alert("Order successfully canceled!");
          window.location.reload(); // Refresh the page after the alert
        } else {
          alert("Failed to cancel order.");
        }
      } catch (error) {
        console.error("Error canceling order:", error);
      }
    } else {
      console.log("Order cancellation was canceled by the user.");
    }
  };
  

  const renderSmileyRating = () => {
    const smileys = [
      <SentimentVeryDissatisfiedOutlinedIcon />,
      <SentimentDissatisfiedOutlinedIcon />,
      <SentimentNeutralOutlinedIcon />,
      <SentimentSatisfiedOutlinedIcon />,
      <SentimentVerySatisfiedOutlinedIcon />,
    ];

    return (
      <div style={styles.smileyContainer}>
        {smileys.map((Smiley, index) => (
          <div
            key={index}
            onClick={() => setRating(index + 1)}
            style={{
              ...styles.smiley,
              color: rating === index + 1 ? "#0F5132" : "#ddd",
            }}
          >
            {Smiley}
          </div>
        ))}
        <div style={styles.ratingDisplay}>
          <span style={styles.ratingLabel}>Rating:</span>
          <span style={styles.ratingValue}>{rating}/5</span>
        </div>
      </div>
    );
  };
  const handleReviewClick = (product) => {
    setProductName(product);
    setShowModal(true); // Show modal when user clicks 'Leave a Review'
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title}>My Orders</h1>
        <FaUserCircle
          style={styles.profileIcon}
          onClick={() => navigate("/tourist-profile")}
        />
      </header>
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






      <div style={styles.content}>
      {orders.length === 0 ? (
        <p style={styles.noOrders}>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.orderNumber} style={styles.orderCard}>
            <h3 style={styles.orderTitle}>
              Order #{order.orderNumber} <FaBoxOpen style={styles.icon} />
            </h3>
            <p style={styles.orderInfo}>
              <FaShippingFast style={styles.icon} /> Status: {order.status}
            </p>
            <p style={styles.orderInfo}>
              <FaDollarSign style={styles.icon} /> Total Price: {selectedCurrency}{" "}
              {(order.totalPrice * conversionRate).toFixed(2)}
            </p>
            <p style={styles.orderInfo}>
              <FaHome style={styles.icon} /> Shipping Address: {order.shippingAddress}
            </p>
            <div style={styles.productsContainer}>
              <h4 style={styles.productsTitle}>Products in this Order</h4>
              {order.products.map((product) => (
                <div key={product} style={styles.productItem}>
                  <p>{product}</p>
                  <button
                    onClick={() => handleReviewClick(product)}
                    style={styles.reviewButton}
                  >
                    Leave a Review
                  </button>
                </div>
              ))}
            </div>
            <div style={styles.buttonContainer}>
              <button
                onClick={() => cancelOrder(order.orderNumber)}
                style={styles.cancelButton}
              >
                Cancel Order
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal for submitting review */}
      {showModal && (
        <div style={styles.modalContainer}>
          <div style={styles.modalContent}>
            <h3 style={styles.reviewTitle}>
              Submit Review for <span style={styles.productName}>{productName}</span>
            </h3>
            <textarea
              style={styles.reviewInput}
              placeholder="Write your review here"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <div style={styles.ratingContainer}>
              {renderSmileyRating()}
            </div>
            <div style={styles.buttonContainer}>
              <button
                onClick={() => submitReview(productName)}
                style={styles.submitButton}
                disabled={!review.trim()} // Disable button if review is empty
              >
                Submit Review
              </button>
              <button
                onClick={() => setShowModal(false)} // Close modal on cancel
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>

  );
  
};

const styles = {
  modalContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  reviewTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  reviewInput: {
    width: '100%',
    height: '100px',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginBottom: '10px',
  },
  submitButton: {
    backgroundColor: '#0F5132',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '5px',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '5px',
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginTop:'60px'
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
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: "60px",
    width: "70px",
    borderRadius: "10px",
  },

  profileIcon: {
    fontSize: "30px",
    color: "white",
    cursor: "pointer",
  },
  content: {
    marginTop: "20px",
  },
  noOrders: {
    textAlign: "center",
    color: "#666",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  orderTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#0F5132",
  },
  orderInfo: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "8px",
  },
  productsContainer: {
    marginTop: "10px",
  },
  productsTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0F5132",
  },
  productItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    padding: "10px 15px",
    backgroundColor: "#f9f9f9", // Light background for contrast
    borderRadius: "5px", // Rounded corners for a polished look
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    fontSize: "14px", // Slightly larger and readable font size
    color: "#333", // Neutral color for text
    fontWeight: "500", // Slightly bolder font for emphasis
  },
  reviewButton: {
    backgroundColor: "#0F5132",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: "14px",
  },
 
  
  reviewContainer: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "20px auto",
  },

  productName: {
    fontSize: "16px",
    color: "#333",
    fontWeight: "500",
  },
  
  ratingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "15px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end", // Align buttons to the right
    alignItems: "center",
  },
 
  iconGroup: {
    display: 'flex',
    gap: '15px',
  },
  iconContainerHover: {
    backgroundColor: '#084B24', // Background on hover
  },
  title: {
    fontSize: '24px',
    color: 'white',
  },
  icon: {
    fontSize: '24px',
    color: 'white',
    cursor: 'pointer',
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
 
  item: {
    padding: '10px 0',
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
    alignItems: 'flex-start',
    padding: '10px 0',
    overflowX: 'hidden',
    transition: 'width 0.3s ease',
    zIndex: 1000,
  },
  sidebarExpanded: {
    width: '200px', // Width when expanded
  },
  submitButtonHover: {
    backgroundColor: "#084B24",
  },
  smileyContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "10px",
  },
  smiley: {
    fontSize: "24px",
    cursor: "pointer",
  },
  ratingDisplay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // Align text to the left
    gap: "5px", // Spacing between "Rating:" and value
    marginTop: "10px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333", // Neutral color for text
  },
  ratingLabel: {
    color: "#0F5132", // Green for "Rating:" label
    fontWeight: "bold",
    fontSize: "14px",
  },
  ratingValue: {
    color: "#084B24", // Slightly darker green for the value
    fontWeight: "500",
    fontSize: "14px",
  },
 
};

export default TouristOrders;
