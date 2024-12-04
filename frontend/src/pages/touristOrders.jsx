import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CurrencyContext } from "../pages/CurrencyContext";
import logo from "../images/image.png";
import { FaShippingFast, FaBoxOpen, FaDollarSign, FaUserCircle,FaHome} from "react-icons/fa";
import SentimentVeryDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentVeryDissatisfiedOutlined";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import SentimentNeutralOutlinedIcon from "@mui/icons-material/SentimentNeutralOutlined";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import SentimentVerySatisfiedOutlinedIcon from "@mui/icons-material/SentimentVerySatisfiedOutlined";
import { useNavigate } from "react-router-dom";

const TouristOrders = () => {
  const { selectedCurrency, conversionRate, fetchConversionRate } =
    useContext(CurrencyContext);

  const [orders, setOrders] = useState([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [productName, setProductName] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
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
      }
      setReview("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  const cancelOrder = async (orderNumber) => {
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
</div>      </div>
    );
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
                      onClick={() => setProductName(product)}
                      style={styles.reviewButton}
                    >
                      Leave a Review
                    </button>
                  </div>
                ))}
              </div>
  
              {/* Cancel Order Button */}
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
  
        {productName && (
          <div style={styles.reviewContainer}>
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
              >
                Submit Review
              </button>
            </div>
          </div>
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
  reviewTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#0F5132",
    marginBottom: "10px",
  },
  productName: {
    fontSize: "16px",
    color: "#333",
    fontWeight: "500",
  },
  reviewInput: {
    width: "100%",
    height: "40px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    padding: "10px",
    fontSize: "14px",
    color: "#333",
    marginBottom: "15px",
    resize: "none",
    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
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
  submitButton: {
    backgroundColor: "#0F5132",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s",
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
  icon: {
    marginRight: "5px",
    color: "#0F5132",
  },
};

export default TouristOrders;
