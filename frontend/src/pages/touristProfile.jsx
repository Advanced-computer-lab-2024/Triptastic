import React, { useState, useRef, useEffect, useContext } from "react";
import Slider from "react-slick";
import { useLocation } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
import "./TouristProfile.css"; // Assuming you create a CSS file for styling
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { CurrencyContext } from "../pages/CurrencyContext";
import logo from "../images/image.png"; // Adjust the path based on your folder structure
import beach from "../images/beach.jpg";
import historic from "../images/historic.jpg";
import family from "../images/family.png";
import shopping from "../images/shopping.jpg";
import goldBadge from "../images/gold.png";
import silverBadge from "../images/silver.png";
import bronzeBadge from "../images/bronze.png";

import {
  FaLandmark,
  FaUniversity,
  FaBox,
  FaMap,
  FaRunning,
  FaBus,
  FaPlane,
  FaHotel,
  FaShoppingCart,
  FaClipboardList,
  FaStar,
  FaDollarSign,
  FaSearch,
} from "react-icons/fa";
import MuseumIcon from "@mui/icons-material/Museum";

import { FaBell, FaUserCircle } from "react-icons/fa";
import { MdNotificationImportant } from "react-icons/md";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import "intro.js/introjs.css"; // Import Intro.js styles
import introJs from "intro.js";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';




const TouristProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [upcomingItineraries, setUpcomingItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [touristInfo, setTouristInfo] = useState(null);
  const [complaints, setComplaints] = useState([]); // New state for complaints
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false); // Track update status
  const [Itineraries, setItineraries] = useState("");
  const [showingItineraries, setShowingItineraries] = useState(false);
  const [bookedItineraries, setBookedItineraries] = useState([]); // State for booked itineraries
  const [showingBookedItineraries, setShowingBookedItineraries] =
    useState(false); // State for showing booked itineraries
  const [showingBookedActivities, setShowingBookedActivities] = useState(false); // State for showing booked activities
  const [bookedActivities, setBookedActivities] = useState([]); // State for booked activities
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Initialize successMessage
  const [fetchedProduct, setFetchedProduct] = useState(null); //new
  const [ratingsI, setRatingsI] = useState({});
  const [commentsI, setCommentsI] = useState({});
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  const [requestSent, setRequestSent] = useState(false); // Track if request was successfully sent
  const [waiting, setWaiting] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [pastItineraries, setPastItineraries] = useState([]);
  const [showPastItineraries, setShowPastItineraries] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("fileComplaint");


  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showAddresses, setShowAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const targetRef = useRef(null); // Reference to target section
  const location = useLocation();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
    isPrimary: false,
  });
  const [updatedPreferences, setUpdatedPreferences] = useState({});
  const [preferences, setPreferences] = useState({
    historicAreas: false,
    beaches: false,
    familyFriendly: false,
    shopping: false,
    budget: "",
  });






  localStorage.setItem("context", "tourist");
  const { selectedCurrency, conversionRate, fetchConversionRate } =
    useContext(CurrencyContext);

  const [formData, setFormData] = useState({
    Username: "",
    points: "",
    badge: "",
    Email: "",
    Password: "",
    Nationality: "",
    DOB: "",
    Occupation: "",
    Wallet: "",
    title: "",
    body: "",
    date: "",
  });


 

  useEffect(() => {
    if (location.hash === "#target-section" && targetRef.current) {
      setTimeout(() => {
        targetRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 400); // Delay to ensure all rendering is done
    }
  }, [location]);





  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  }; 
  const togglePasswordModal = () => setShowPasswordModal(!showPasswordModal);
  const toggleComplaint = () => setShowComplaintModal((prev) => !prev);

  const [isPreferencesVisible, setIsPreferencesVisible] = useState(false);
  useEffect(() => {
    const preferencesSubmitted = localStorage.getItem('preferencesSubmitted');
    if (!preferencesSubmitted) {
      setIsPreferencesVisible(true); // Show preferences if not submitted
    }
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    fetchNotifications();
  }, []);
  useEffect(() => {
    fetchBookedItineraries();
    fetchBookedActivities(); // Fetch booked itineraries when the component mounts
    sendReminders();
    sendItineraryReminders();
  }, []); // Empty dependency array means this runs once after the first render



  const fetchNotifications = async () => {
    const username = localStorage.getItem("Username"); // Assuming username is stored in local storage
    if (!username) return;

    try {
      const response = await axios.get(
        `http://localhost:8000/getNotifications?username=${username}`
      );
      if (response.status === 200) {
        setNotifications(response.data.notifications);
        const unread = response.data.notifications.filter(
          (n) => !n.read
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  useEffect(() => {
    const checkIntroStatus = async () => {
      const Username = localStorage.getItem("Username");

      try {
        // Fetch the intro status from the backend
        const response = await fetch(
          `http://localhost:8000/getTouristIntroStatus?Username=${Username}`
        );
        const data = await response.json();

        if (response.ok && data.showIntro) {
          // Show the Intro.js tutorial
          startIntro();
        }
      } catch (error) {
        console.error("Failed to fetch intro status:", error);
      }
    };

    checkIntroStatus();
  }, []); // Add an empty dependency array to ensure it runs only on mount

  const startIntro = () => {
    // Check if the intro has already been shown
    introJs()
      .setOptions({
        steps: [
          {
            element: document.querySelector(".guest-header h1"),
            intro:
              "Welcome to our vacation planning platform! Let us show you around.",
          },
          {
            element: document.querySelector(".museums"),
            intro: "You can start exploring museums by clicking here.",

            position: "top",
          },
          {
            element: document.querySelector(".historical"),
            intro:
              "Interested in historical locations? This button will take you there.",
            position: "top",
          },
          {
            element: document.querySelector(".itineraries"),
            intro:
              "Looking for itineraries? Click here to find various vacation plans.",
            position: "top",
          },
          {
            element: document.querySelector(".activities"),
            intro: "Explore exciting activities by clicking here.",
            position: "top",
          },
          {
            element: document.querySelector(".flights"),
            intro: "Looking for flights? Click here to find options.",
            position: "top",
          },
          {
            element: document.querySelector(".hotels"),
            intro: "Find the best hotels at great prices here.",
            position: "top",
          },
          {
            element: document.querySelector(".transportation"),
            intro: "Need transportation? Explore your options here.",
            position: "top",
          },
          {
            element: document.querySelector(".products"),
            intro: "Shop for anything you need by clicking here.",
            position: "top",
          },
        ],
      })
      .oncomplete(() => {
        // Mark intro as completed
        localStorage.setItem("introShown", "true");
      })
      .onexit(() => {
        // Mark intro as completed even if user exits
        localStorage.setItem("introShown", "true");
      })
      .start();
  };

  // Mark notifications as read
  const markNotificationsAsRead = async () => {
    const username = localStorage.getItem("Username");
    if (!username) return;

    try {
      await axios.patch(
        `http://localhost:8000/markNotificationsRead?username=${username}`
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Handle click on the notification bell
  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    if (unreadCount > 0) markNotificationsAsRead();
  };
  const sendItineraryReminders = async () => {
    const username = localStorage.getItem("Username");
    if (!username) {
      alert("Username not found.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/sendItineraryReminders?username=${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        //alert('Reminders sent successfully.');
        console.log("Notifications:", data.notificationsSent);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error sending reminders.");
      }
    } catch (error) {
      console.error("Error sending reminders:", error);
      alert("Failed to send reminders.");
    }
  };
  const sendReminders = async () => {
    const username = localStorage.getItem("Username");
    if (!username) {
      alert("Username not found.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/sendActivityReminders?username=${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        //alert('Reminders sent successfully.');
        console.log("Notifications:", data.notificationsSent);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error sending reminders.");
      }
    } catch (error) {
      console.error("Error sending reminders:", error);
      alert("Failed to send reminders.");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleViewItineraries = () => {
    setShowingItineraries((prev) => !prev);
  };
  const toggleViewBookedActivites = () => {
    setShowingBookedActivities((prev) => !prev);
  };

  const handleViewBookedItineraries = () => {
    setShowingBookedItineraries((prev) => !prev);
  };

  const handleCurrencyChange = (event) => {
    fetchConversionRate(event.target.value);
  };
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);
    setPasswordChangeError("");
    setPasswordChangeMessage("");

    try {
      const username = localStorage.getItem("Username"); // Assuming the username is saved in localStorage
      const response = await axios.patch(
        "http://localhost:8000/changePasswordTourist",
        {
          Username: username,
          currentPassword: currentPassword,
          newPassword: newPassword,
        }
      );

      if (response.status === 200) {
        setPasswordChangeMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setPasswordChangeError("Failed to change password.");
      }
    } catch (error) {
      setPasswordChangeError(
        error.response?.data?.error || "An error occurred."
      );
    } finally {
      setChangingPassword(false);
    }
  };

 
  const handleCancelActivityBooking = async (id) => {
    const username = localStorage.getItem("Username");
    try {
      const response = await fetch(
        `http://localhost:8000/cancelBookedActivity/${id}?username=${username}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Activity booking cancelled successfully!");
        setErrorMessage("");
        fetchBookedActivities(); // Refresh booked activities after cancelling one
      } else {
        throw new Error("Failed to cancel activity booking");
      }
    } catch (error) {
      setErrorMessage("An error occurred while cancelling activity booking");
      console.error(error);
    }
  };
  const handleCancelItineraryBooking = async (id) => {
    const username = localStorage.getItem("Username");
    try {
      const response = await fetch(
        `http://localhost:8000/cancelBookedItinerary/${id}?username=${username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Itinerary booking cancelled successfully!");
        setErrorMessage("");
        fetchBookedItineraries(); // Refresh booked itineraries after cancelling one
      } else {
        throw new Error("Failed to cancel itinerary booking");
      }
    } catch (error) {
      setErrorMessage("An error occurred while cancelling itinerary booking");
      console.error(error);
    }
  };

  const fetchItineraries = async () => {
    try {
      const response = await fetch("http://localhost:8000/getAllItineraries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Itineraries:", data);
      } else {
        console.error(
          "Failed to fetch itineraries. Status:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);
  // New function to fetch complaints

  const fetchComplaints = async () => {
    setLoading(true);
    const Username = localStorage.getItem("Username");
    try {
      const response = await fetch(
        `http://localhost:8000/getComplaintsByTourist?username=${Username}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComplaints(data); // Set complaints state
        setErrorMessage("");
      } else {
        throw new Error("Failed to fetch complaints");
      }
    } catch (error) {
      setErrorMessage("");
      console.error(error);
    }
    setLoading(false);
  };
  const submitUpdatedPreferences = async () => {
    try {
      const username = localStorage.getItem("Username");
  
      const response = await fetch(
        `http://localhost:8000/setPreferences?username=${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPreferences),
        }
      );
  
      if (response.ok) {
        alert("Preferences updated successfully!");
        setPreferences(updatedPreferences);
        setErrorMessage("");
      } else {
        throw new Error("Failed to update preferences");
      }
    } catch (error) {
      setErrorMessage("Error updating preferences");
    }
  };
  
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setUpdatedPreferences((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const fetchTouristInfo = async () => {
    setLoading(true);
    const Username = localStorage.getItem("Username");

    if (Username) {
      try {
        const response = await fetch(
          `http://localhost:8000/getTourist?Username=${Username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data) {
            // Apply currency conversion to Wallet balance (adjust 'conversionRate' as needed)
            const conversionRate = 1.2;  // Update this conversion rate dynamically if needed
            data.Wallet = (data.Wallet * conversionRate).toFixed(2);

            // Set the tourist data and preferences
            setTouristInfo(data);
            setPreferences(data.preferences);  // Save preferences
            setUpdatedPreferences(data.preferences); // Save updated preferences

            // Pre-fill the form with current data
            setErrorMessage("");
          } else {
            setErrorMessage("No tourist information found.");
          }
        } else {
          throw new Error("Failed to fetch tourist information");
        }
      } catch (error) {
        setErrorMessage("An error occurred while fetching tourist information");
        console.error(error);
      }
    } else {
      setErrorMessage("No tourist information found.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTouristInfo();
    fetchComplaints(); // Fetch complaints when the component loads
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch("http://localhost:8000/updateTourist", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedTourist = await response.json();
        setTouristInfo(updatedTourist);
        setErrorMessage("");
        alert("Information updated successfully!");
      } else {
        throw new Error("Failed to update tourist information");
      }
    } catch (error) {
      setErrorMessage("An error occurred while updating tourist information");
      console.error(error);
    }
    setUpdating(false);
  };

  // Function to fetch a product by name
  const fetchProductByName = async (productName) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/getProductTourist?productName=${productName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const product = await response.json();

        // Check if the product exists and if it is archived
        if (!product || product.archived === true) {
          setErrorMessage("Product not found");
          setFetchedProduct(null); // Clear the fetched product state
        } else {
          setFetchedProduct(product); // Store the fetched product
          setErrorMessage(""); // Clear any previous error messages
        }
      } else {
        throw new Error("Failed to fetch product");
      }
    } catch (error) {
      setErrorMessage("An error occurred while fetching the product");
      console.error(error);
    }
    setLoading(false);
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();

    try {
      const username = localStorage.getItem("Username"); // Retrieve username from localStorage

      if (!username) {
        setErrorMessage(
          "Username not found in localStorage. Please log in again."
        );
        return; // Exit the function if username is not found
      }

      const complaintData = {
        title: formData.title,
        body: formData.body,
        date: formData.date,
      };

      // Construct the URL with the username as a query parameter
      const response = await fetch(
        `http://localhost:8000/fileComplaint?username=${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(complaintData), // Send form data
        }
      );

      if (response.ok) {
        alert("Complaint filed successfully!");
        setErrorMessage("");
        setFormData((prev) => ({
          ...prev,
          ...complaintData,
          title: "",
          body: "",
          date: "",
          Reply: "",
        }));
        fetchComplaints(); // Refresh complaints after filing a new one
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to file complaint");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };
  const fetchBookedActivities = async () => {
    setLoading(true);
    const username = localStorage.getItem("Username");

    if (!username) {
      setErrorMessage(
        "Username not found in localStorage. Please log in again."
      );
      setLoading(false);
      return; // Exit if username is not found
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/getBookedActivities?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in local storage
          },
        }
      );

      if (response.status === 200) {
        setBookedActivities(response.data);
      } else {
        setErrorMessage("Failed to retrieve booked activities");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchBookedItineraries = async () => {
    setLoading(true);
    const username = localStorage.getItem("Username");

    if (!username) {
      setErrorMessage(
        "Username not found in localStorage. Please log in again."
      );
      setLoading(false);
      return; // Exit if username is not found
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/getBookedItineraries?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in local storage
          },
        }
      );

      if (response.status === 200) {
        const bookedItineraries = response.data;

        // Filter past itineraries
        const pastItineraries = filterPastItineraries(bookedItineraries);
        setPastItineraries(pastItineraries);
        const upcomingItineraries =
          filterUpcmoingItineraries(bookedItineraries);
        setUpcomingItineraries(upcomingItineraries);
      } else {
        setErrorMessage("Failed to retrieve booked itineraries");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const filterUpcmoingItineraries = (itineraries) => {
    const today = new Date();
    return itineraries.filter(
      (itinerary) => new Date(itinerary.DatesTimes) > today
    );
  };
  // Filter past itineraries
  const filterPastItineraries = (itineraries) => {
    const today = new Date();
    return itineraries.filter(
      (itinerary) => new Date(itinerary.DatesTimes) < today
    );
  };
  const submitFeedbackItinerary = async (Itinerary) => {
    const username = localStorage.getItem("Username");

    console.log("Submitting feedback for itinerary:", Itinerary); // Log itinerary details

    // Check if the itinerary is in the past
    const itineraryEndDate = new Date(Itinerary.DatesTimes);
    const currentDate = new Date();

    console.log("Itinerary end date:", itineraryEndDate); // Log end date
    console.log("Current date:", currentDate); // Log current date

    if (itineraryEndDate > currentDate) {
      setErrorMessage("You cannot submit feedback for an upcoming itinerary.");
      setSuccessMessage("");
      return;
    }

    const rating = ratingsI[Itinerary._id];
    const comment = commentsI[Itinerary._id];

    console.log("Rating for itinerary:", rating); // Log rating
    console.log("Comment for itinerary:", comment); // Log comment

    if (!rating) {
      setErrorMessage("Please provide a rating.");
      return;
    }

    try {
      console.log(
        "Submitting to server with rating:",
        rating,
        "and comment:",
        comment
      );

      const response = await axios.post(
        `http://localhost:8000/submitFeedbackItinerary?username=${username}`,
        {
          itineraryId: Itinerary._id,
          rating,
          comment: comment || "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Server response:", response.data); // Log server response

      if (response.status === 200) {
        setSuccessMessage("Feedback submitted successfully!");
        setErrorMessage("");

        // Clear rating and comment
        setRatingsI((prev) => ({ ...prev, [Itinerary._id]: "" }));
        setCommentsI((prev) => ({ ...prev, [Itinerary._id]: "" }));
      }
    } catch (err) {
      console.error("Feedback submission error:", err); // Log error details
      setErrorMessage(
        err.response?.data?.message || "Failed to submit feedback"
      );
      setSuccessMessage("");
    }
  };
  const submitFeedback = async (Itinerary) => {
    const username = localStorage.getItem("Username");
    const tourGuideUsername = Itinerary.TourGuide; // This should be the tour guide's username, ensure it's valid

    console.log("Submitting tour guide feedback for itinerary:", Itinerary);

    const itineraryEndDate = new Date(Itinerary.DatesTimes);
    const currentDate = new Date();

    if (itineraryEndDate > currentDate) {
      setErrorMessage("You cannot submit feedback for an upcoming itinerary.");
      setSuccessMessage("");
      return;
    }

    const rating = ratings[Itinerary._id];
    const comment = comments[Itinerary._id];

    if (!rating) {
      setErrorMessage("Please provide a rating.");
      return;
    }

    try {
      console.log(
        "Submitting to server with rating:",
        rating,
        "and comment:",
        comment
      );
      const response = await axios.post(
        `http://localhost:8000/submitFeedback?username=${username}`,
        {
          itineraryId: Itinerary._id,
          tourGuideUsername: tourGuideUsername, // Pass the tour guide's username here
          rating,
          comment: comment || "", // If no comment, send an empty string
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token for auth
          },
        }
      );

      if (response.status === 200) {
        console.log("Server response:", response.data);
        setSuccessMessage("Feedback submitted successfully!");
        setErrorMessage("");

        setRatings((prev) => ({ ...prev, [Itinerary._id]: "" }));
        setComments((prev) => ({ ...prev, [Itinerary._id]: "" }));
      }
    } catch (err) {
      console.error("Feedback submission error:", err);
      setErrorMessage(
        err.response?.data?.message || "Failed to submit feedback"
      );
      setSuccessMessage("");
    }
  };

  const handleRatingChangeI = (itinerary, value) => {
    setRatingsI((prevRatings) => ({
      ...prevRatings,
      [itinerary._id]: value,
    }));
    console.log(`Updating rating for itinerary ID ${itinerary._id}: ${value}`);
  };

  const handleCommentChangeI = (itinerary, value) => {
    setCommentsI((prevComments) => ({
      ...prevComments,
      [itinerary._id]: value,
    }));
    console.log(`Updating comment for itinerary ID ${itinerary._id}: ${value}`);
  };

  const handleRatingChange = (itinerary, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [itinerary._id]: value, // Use the itinerary ID as the key for ratings
    }));

    console.log(`Updating rating for itinerary ${itinerary._id}: ${value}`);
  };

  const handleCommentChange = (itinerary, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [itinerary._id]: value, // Use the itinerary ID as the key for comments
    }));

    console.log(`Updating comment for itinerary ${itinerary._id}: ${value}`);
  };
  const submitPreferences = async () => {
    try {
      const username = localStorage.getItem("Username");
  
      if (!username) {
        throw new Error("Username not found in localStorage");
      }
  
      const response = await fetch(
        `http://localhost:8000/setPreferences?username=${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferences),
        }
      );
  
      if (response.ok) {
        setSuccessMessage("Preferences updated successfully!");
        setErrorMessage("");
        setIsPreferencesVisible(false); // Hide preferences section
  
        // Save a flag specific to the user in localStorage
        localStorage.setItem(`${username}_preferencesSubmitted`, "true");
      } else {
        throw new Error("Failed to update preferences");
      }
    } catch (error) {
      setErrorMessage("An error occurred while updating preferences");
      console.error(error);
    }
  };
  

  
  
  useEffect(() => {
    const username = localStorage.getItem("Username");
  
    if (username) {
      const preferencesSubmitted = localStorage.getItem(
        `${username}_preferencesSubmitted`
      );
  
      // Show preferences only if they haven't been submitted for this user
      setIsPreferencesVisible(!preferencesSubmitted);
    }
  }, []);
  

  const handleDeleteRequest = async () => {
    const Username = localStorage.getItem("Username");
    setWaiting(true);
    setRequestSent(false); // Reset request sent state when initiating new request
    try {
      const response = await fetch(
        `http://localhost:8000/requestAccountDeletionTourist?Username=${Username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setRequestSent(true); // Set to true when the request is successfully sent
        alert(
          "Your account deletion request has been submitted and is pending approval."
        );
      } else {
        setRequestSent(false); // Reset to allow another deletion request
        alert(data.msg); // Show the rejection message
      }
    } catch (error) {
      alert("Error deleting account");
    } finally {
      setWaiting(false); // Stop waiting regardless of outcome
    }

    // Show success message
    setSuccessMessage("Feedback submitted successfully!");

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };
  useEffect(() => {
    if (Itineraries && Itineraries._id) {
      // Update past itineraries with feedbackSubmitted flag
      setPastItineraries((prevPastItineraries) =>
        prevPastItineraries.map((item) =>
          item._id === Itineraries._id
            ? {
                ...item,
                feedbackSubmitted: true,
                rating: "",
                comment: "",
              }
            : item
        )
      );
    }
  }, [Itineraries]); // Only update when 'Itineraries' changes

  const SidebarMenu = () => {
    const navigate = useNavigate();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
 
  const fetchAddresses = async () => {
    const Username = localStorage.getItem("Username");
    try {
      const response = await fetch(
        `http://localhost:8000/getAddresses?username=${Username}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
        setErrorMessage("");
      } else {
        throw new Error("Failed to fetch addresses");
      }
    } catch (error) {
      setErrorMessage("An error occurred while fetching addresses");
      console.error(error);
    }
  };

  useEffect(() => {
     fetchAddresses();
  }, [showAddresses]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const Username = localStorage.getItem("Username");
    try {
      const response = await fetch(
        `http://localhost:8000/addAddress?username=${Username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAddress),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses);
        setShowAddressForm(false);
        setNewAddress({
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          phoneNumber: "",
          isPrimary: false,
        });
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add address");
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.error(error);
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const getBadgeIcon = (badgeLevel) => {
    switch (badgeLevel) {
      case 3:
        return goldBadge; // Imported gold badge image
      case 2:
        return silverBadge; // Imported silver badge image
      case 1:
        return bronzeBadge; // Imported bronze badge image
      default:
        return null; // Optional: Return null or a default badge
    }
  };
  


return (
  <div>
    {/* Header Section */}
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>
      <h1 style={styles.title}>Tourist Profile</h1>
      <div style={styles.headerIconsContainer}>
        {/* Notification Bell */}
        <div
          style={styles.notificationButton}
          onClick={handleNotificationClick}
        >
          <FaBell style={styles.notificationIcon} />
          {unreadCount > 0 && (
            <span style={styles.notificationBadge}>{unreadCount}</span>
          )}
        </div>

          {/* Profile Icon */}
          <ManageAccountsIcon
            alt="Profile Icon"
            style={styles.profileIcon}
            onClick={() => navigate("/touristSettings")}
          />
          <ManageAccountsIcon
    style={styles.profileIcon}
    title="Manage Account Settings"
    onClick={() => setShowDropdown((prev) => !prev)} // Toggle dropdown
  />
  
  {showDropdown && (
    <div style={styles.dropdownMenu}>
      <div
        style={styles.dropdownItem}
        onClick={() => {
          setShowDropdown(false); // Close dropdown
          toggleModal(); // Open Edit Profile modal
        }}
      >
        Edit Profile
      </div>
      <div
        style={styles.dropdownItem}
        onClick={() => {
          setShowDropdown(false); // Close dropdown
          togglePasswordModal(); // Open Change Password modal
        }}
      >
        Change Password
      </div>
      <div
        style={styles.dropdownItem}
        onClick={() => {
          setShowDropdown(false); // Close dropdown
          setShowComplaintModal(true); // Open File Complaint modal
        }}
      >
        File a Complaint
      </div>
      <div
        style={styles.dropdownItem}
        onClick={() => {
          setShowDropdown(false); // Close dropdown
          setShowAddressModal(true); // Open File Complaint modal
        }}
      >
        Add Address
      </div>
      <div
        style={styles.dropdownItem}
        onClick={() => {
          setShowDropdown(false); // Close dropdown
          navigate("/tourist-orders")

        }}
      >
        Past Orders
      </div>
      <div
        style={styles.dropdownItem}
        onClick={() => {
          setShowDropdown(false); // Close dropdown
          navigate("/AttendedActivitiesPage")
        }}
      >
        Review Activities
      </div>
    </div>
  )}
  {/* Modal */}
  {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalContentH2}>Edit Profile Information</h2>
            <HighlightOffOutlinedIcon
            style={styles.cancelIcon}
            onClick={() => setModalOpen(false)} // Close modal on click
          />
         <div style={styles.walletInfo}>
  <h3 style={styles.walletTitle}>Wallet Balance</h3>
  <div style={styles.walletDetails}>
    {/* Wallet */}
    <div style={styles.walletItem}>
      <p style={styles.walletAmount}>
        {(touristInfo.Wallet * conversionRate).toFixed(2)} {selectedCurrency}
      </p>
      <span style={styles.walletLabel}>Wallet</span>
    </div>

    {/* Points */}
    <div style={styles.walletItem}>
      <p style={styles.walletAmount}>{touristInfo.points}</p>
      <span style={styles.walletLabel}>Points</span>
    </div>

    {/* Badge */}
    <div style={styles.walletItem}>
        <img
          src={getBadgeIcon(touristInfo.badge)}
          alt={`Badge Level ${touristInfo.badge}`}
          style={styles.badgeImage}
        />
        <span style={styles.walletLabel}>Badge</span>
        <p style={styles.walletLabel}>{touristInfo.badge}</p>
      </div>
  </div>
</div>

            
            <form onSubmit={handleUpdate}>
              <div style={styles.formGroup}>
                <label style={styles.label2}>Email:</label>
                <input
                   type="email"
                   name="Email"
                   value={formData.Email}
                   onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
             
              <div style={styles.formGroup}>
                <label style={styles.label2}>Nationality:</label>
                <input
                   type="text"
                   name="Nationality"
                   value={formData.Nationality}
                   onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label2}>Date of Birth:</label>
                <input
                    type="text" // Display DOB as a string
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label2}>Occupation:</label>
                <input
                  type="text"
                  name="Occupation"
                  value={formData.Occupation}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label2}>Select Currency:</label>
                <select
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                >
                  <option value="EGP">Egyptian Pound (EGP)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  {/* Add more currency options as needed */}
                </select>
              </div>
             
             
                <button type="submit" style={styles.saveButton}>
                  Save Changes
                </button>
                
              
       

               
            </form>
          
            {Object.keys(preferences).length > 0 ? (
  <form style={styles.preferencesForm}>
    {/* Preferences Header */}
    <h3 style={styles.preferencesHeader}>Preferences</h3>

    {/* Preferences Checkboxes */}
    <div style={styles.preferencesGroup}>
      <label style={styles.preferenceItem}>
        <input
          type="checkbox"
          name="historicAreas"
          checked={updatedPreferences.historicAreas || false}
          onChange={handlePreferenceChange}
        />
        <span>Historic Areas</span>
      </label>
      <label style={styles.preferenceItem}>
        <input
          type="checkbox"
          name="beaches"
          checked={updatedPreferences.beaches || false}
          onChange={handlePreferenceChange}
        />
        <span>Beaches</span>
      </label>
      <label style={styles.preferenceItem}>
        <input
          type="checkbox"
          name="familyFriendly"
          checked={updatedPreferences.familyFriendly || false}
          onChange={handlePreferenceChange}
        />
        <span>Family-Friendly</span>
      </label>
      <label style={styles.preferenceItem}>
        <input
          type="checkbox"
          name="shopping"
          checked={updatedPreferences.shopping || false}
          onChange={handlePreferenceChange}
        />
        <span>Shopping</span>
      </label>
    </div>

    {/* Budget Selector */}
    <div style={styles.budgetSection}>
      <label style={styles.label2}>Select Budget:</label>
      <select
        name="budget"
        value={updatedPreferences.budget || ''}
        onChange={handlePreferenceChange}
        style={styles.budgetDropdown}
      >
        <option value="">Select Budget</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    {/* Submit Button */}
    <button
      type="button"
      onClick={submitUpdatedPreferences}
      style={styles.submitButton}
    >
      Submit Preferences
    </button>
  </form>
) : (
  <p>No preferences available.</p>
)}

            
            <div style={styles.buttonGroup}>
            <button  onClick={() => setShowDeleteModal(true)}  style={styles.deletebutton}>
          {waiting
            ? "Waiting to be deleted..."
            : requestSent
            ? "Request Sent"
            : "Delete Account?"}
        </button>
        </div>
            
          </div>
        </div>
      )}
      

                {/* Change Password Modal */}
{showPasswordModal && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <h2 style={styles.modalContentH2}>Change Password</h2>
      <HighlightOffOutlinedIcon
        onClick={() => setShowPasswordModal(false)}
        style={styles.cancelpasswordIcon}
      />
      <form onSubmit={handlePasswordChange} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label2}>Current Password:</label>
          <input
            type="password"
            placeholder="Enter Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label2}>New Password:</label>
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label2}>Confirm New Password:</label>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.buttonContainer}>
          <button
            type="submit"
            disabled={isChangingPassword}
            style={{
              ...styles.submitButton,
              opacity: isChangingPassword ? 0.7 : 1,
            }}
          >
            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>

      {passwordChangeMessage && (
        <p style={{ color: 'green', marginTop: '15px', textAlign: 'center' }}>
          {passwordChangeMessage}
        </p>
      )}
      {passwordChangeError && (
        <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>
          {passwordChangeError}
        </p>
      )}
    </div>
  </div>
)}

 {/* Delete Account Modal */}
 {showDeleteModal && (
  <div style={styles.modalOverlay2}>
    <div style={styles.modalContent2}>
      <h2 style={styles.modalTitle2}>Account Deletion</h2>
      <p style={styles.modalText2}>
        Are you sure you want to delete your account? This action cannot be undone.
      </p>
      <div style={styles.termsSection}>
        <h3 style={styles.termsTitle}>Terms and Conditions</h3>
        <p style={styles.termsText}>
          - All your data, including preferences, bookings, and wallet balance, will be permanently deleted.
          <br />
          - Deletion requests are subject to review and approval.
          <br />
          - After approval, account recovery is not possible.
        </p>
      </div>
      <div style={styles.modalButtons}>
        <button
          onClick={handleDeleteRequest}
          disabled={waiting || requestSent}
          style={styles.confirmButton}
        >
          {waiting
            ? "Processing..."
            : requestSent
            ? "Request Sent"
            : "Confirm Deletion"}
        </button>
        <button
          onClick={() => setShowDeleteModal(false)}
          style={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
{/* File Complaint Modal */}
{showComplaintModal && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <HighlightOffOutlinedIcon
        style={styles.cancelIcon3}
        onClick={() => setShowComplaintModal(false)} // Close modal
      />

      {/* Tabs for Switching Between Filing and Viewing Complaints */}
      <div style={styles.tabContainer}>
        <button
          style={
            activeTab === "fileComplaint"
              ? styles.activeTabButton
              : styles.tabButton
          }
          onClick={() => setActiveTab("fileComplaint")}
        >
          File a Complaint
        </button>
        <button
          style={
            activeTab === "viewComplaints"
              ? styles.activeTabButton
              : styles.tabButton
          }
          onClick={() => setActiveTab("viewComplaints")}
        >
          View Complaints
        </button>
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === "fileComplaint" && (
        <div style={styles.tabContent}>
          <h2 style={styles.modalTitle}>File a Complaint</h2>
          <form onSubmit={handleSubmitComplaint}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title:</label>
              <input
                type="text"
                name="title"
                placeholder="Complaint Title"
                value={formData.title}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description:</label>
              <textarea
                name="body"
                placeholder="Describe your issue..."
                value={formData.body}
                onChange={handleInputChange}
                required
                style={styles.textarea}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.submitButton}>
              Submit Complaint
            </button>
          </form>
        </div>
      )}

{activeTab === "viewComplaints" && (
        <div style={styles.tabContent}>
          <h2 style={styles.modalTitle}>Your Complaints</h2>
          {complaints.length === 0 ? (
            <p style={styles.emptyText}>No complaints filed yet.</p>
            
          ) : (
            
            <div style={styles.complaintsList}>
                <Slider {...sliderSettings}>
              {complaints.map((complaint) => (
                <div key={complaint._id} style={styles.complaintCard}>
                  <p style={styles.complaintText}>
                    <strong>Title:</strong> {complaint.title}
                  </p>
                  <p style={styles.complaintText}>
                    <strong>Status:</strong> {complaint.status}
                  </p>
                  <p style={styles.complaintText}>
                    <strong>Date:</strong>{" "}
                    {new Date(complaint.date).toLocaleDateString()}
                  </p>
                  {complaint.replies && complaint.replies.length > 0 ? (
                    <div style={styles.repliesSection}>
                      <h4 style={styles.repliesTitle}>Replies:</h4>
                      {complaint.replies.map((reply, index) => (
                         <div key={index} style={styles.replyCard}>
                         <p style={styles.complaintText}><strong>Reply:</strong> {reply.content}</p>
                         <p style={styles.complaintText}><strong>Date:</strong> {new Date(reply.date).toLocaleDateString()}</p>
                         {reply.replier && <p style={styles.complaintText}><strong>Replier:</strong> {reply.replier}</p>}
                       </div>
                      ))}
                   
                    </div>
                  ) : (

                    <p style={styles.noRepliesText}>
                      <em>No replies yet.</em>
                    </p>
                    
                    
                  )}
                </div>
              ))}
              </Slider>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}





{showAddressModal && (
  <div style={styles.modalOverlay}>
    <motion.div
      style={styles.modalContent}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Close Icon */}
      <HighlightOffOutlinedIcon
        style={styles.cancelIcon4}
        onClick={() => setShowAddressModal(false)} // Close modal
      />

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          style={
            activeTab === "viewAddresses"
              ? { ...styles.tabButton, ...styles.activeTab }
              : styles.tabButton
          }
          onClick={() => setActiveTab("viewAddresses")}
        >
          View Addresses
        </button>
        <button
          style={
            activeTab === "addAddress"
              ? { ...styles.tabButton, ...styles.activeTab }
              : styles.tabButton
          }
          onClick={() => setActiveTab("addAddress")}
        >
          Add Address
        </button>
      </div>

      {/* View Addresses Content */}
      {activeTab === "viewAddresses" && (
        <motion.div
          style={styles.tabContent}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 style={styles.modalTitle}>Your Addresses</h2>
          {addresses.length === 0 ? (
            <p style={styles.noAddressesText}>
              You haven't added any addresses yet.
            </p>
          ) : (
            <div style={styles.addressGrid}>
              {addresses.map((address, index) => (
                <motion.div
                  key={index}
                  style={styles.addressCard}
                  whileHover={{ scale: 1.05 }}
                >
                  <div style={styles.iconWrapper}>
                    <LocationOnIcon style={{ color: "#0F5123", fontSize: "24px" }} />
                  </div>
                  <p style={styles.addressLine}>
                    <strong>{address.addressLine1}</strong>
                  </p>
                  {address.addressLine2 && <p style={styles.complaintText}>{address.addressLine2}</p>}
                  <p style={styles.complaintText}>
                    {address.city}, {address.state && `${address.state},`} {address.country}
                  </p>
                  <p style={styles.complaintText}>Postal Code: {address.postalCode}</p>
                  <p style={styles.complaintText}>Phone: {address.phoneNumber}</p>
                  {address.isPrimary && (
                    <span style={styles.primaryBadge}>
                      <StarIcon style={{ fontSize: "16px", marginRight: "5px" }} />
                      Primary Address
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Add Address Content */}
      {activeTab === "addAddress" && (
        <motion.div
          style={styles.tabContent}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 style={styles.modalTitle}>Add New Address</h2>
          <form onSubmit={handleAddAddress} style={styles.container}>
            <input
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              name="addressLine1"
              value={newAddress.addressLine1}
              onChange={handleAddressInputChange}
              placeholder="Address Line 1"
              required
            />

            <input
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              name="addressLine2"
              value={newAddress.addressLine2}
              onChange={handleAddressInputChange}
              placeholder="Address Line 2"
            />

            <input
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              name="city"
              value={newAddress.city}
              onChange={handleAddressInputChange}
              placeholder="City"
              required
            />

            <input
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              name="state"
              value={newAddress.state}
              onChange={handleAddressInputChange}
              placeholder="State"
            />

            <input
              type="number"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              name="postalCode"
              value={newAddress.postalCode}
              onChange={handleAddressInputChange}
              placeholder="Postal Code"
            />

            <input
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              name="country"
              value={newAddress.country}
              onChange={handleAddressInputChange}
              placeholder="Country"
              required
            />

            <input
              type="number"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              name="phoneNumber"
              value={newAddress.phoneNumber}
              onChange={handleAddressInputChange}
              placeholder="Phone Number"
            />

            <div style={{ display: "flex", alignItems: "center" }}>
              <label style={{ marginRight: "10px" ,color:"black"}}>Is Primary</label>
              <input
                type="checkbox"
                name="isPrimary"
                checked={newAddress.isPrimary}
                onChange={handleAddressInputChange}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button type="submit" style={styles.addButton}>
                Submit Address
              </button>
             
            </div>
          </form>
        </motion.div>
      )}
    </motion.div>
  </div>
)}



   
          {/* Cart Icon */}
          <div style={styles.cartButton} onClick={() => navigate("/Cart")}>
            <FaShoppingCart style={styles.cartIcon} />
          </div>
          {/* Logout Icon */}
          <div style={styles.logoutButton} onClick={() => navigate("/Guest")}>
            <LogoutOutlinedIcon style={styles.logoutIcon} />
          </div>
        </div>
      </header>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div style={styles.notificationDropdown}>
          <h3 style={styles.dropdownHeader}>Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} style={styles.notificationItem}>
                <li
                  key={notification.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    padding: "10px",
                    borderBottom: "1px solid #f0f0f0",
                    fontSize: "10px",
                  }}
                >
                  <MdNotificationImportant
                    size={50}
                    style={{ marginRight: "10px", color: "#ff9800" }}
                  />
                  <p>{notification.message}</p>
                </li>
                <span style={styles.notificationDate}>
                  {new Date(notification.date).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p style={styles.noNotifications}>No notifications available</p>
          )}
        </div>
      )}

      {/* Main Content */}
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
        <div
          className="historical"
          style={styles.item}
          onClick={() => navigate("/historical-locations")}
        >
          <FaLandmark style={styles.iconn} />
          <span className="label" style={styles.label}>
            Historical Loc
          </span>
        </div>
        <div
          className="museums"
          style={styles.item}
          onClick={() => navigate("/museums")}
        >
          <MuseumIcon style={styles.iconn} />
          <span className="label" style={styles.label}>
            Museums
          </span>
        </div>
        <div
          className="products"
          style={styles.item}
          onClick={() => navigate("/products")}
        >
          <FaBox style={styles.iconn} />
          <span className="label" style={styles.label}>
            Products
          </span>
        </div>
        <div
          className="itineraries"
          style={styles.item}
          onClick={() => navigate("/itineraries")}
        >
          <FaMap style={styles.iconn} />
          <span className="label" style={styles.label}>
            Itineraries
          </span>
        </div>
        <div
          className="activities"
          style={styles.item}
          onClick={() => navigate("/activities")}
        >
          <FaRunning style={styles.iconn} />
          <span className="label" style={styles.label}>
            Activities
          </span>
        </div>
        <div
          className="flights"
          style={styles.item}
          onClick={() => navigate("/book-flights")}
        >
          <FaPlane style={styles.iconn} />
          <span className="label" style={styles.label}>
            Book Flights
          </span>
        </div>
        <div
          className="hotels"
          style={styles.item}
          onClick={() => navigate("/book-hotels")}
        >
          <FaHotel style={styles.iconn} />
          <span className="label" style={styles.label}>
            Book a Hotel
          </span>
        </div>
        <div
          className="transportation"
          style={styles.item}
          onClick={() => navigate("/book-transportation")}
        >
          <FaBus style={styles.iconn} />
          <span className="label" style={styles.label}>
            Transportation
          </span>
        </div>
        
       
      </div>

      <div>
        {isPreferencesVisible && (
          <div
            className="preferences-section"
            style={{ margin: "20px 0", textAlign: "center" }}
          >
            <h3
              style={{ fontSize: "18px", marginBottom: "20px", color: "#333" }}
            >
              Select Your Vacation Preferences
            </h3>
            <div
              className="carousel-container"
              style={styles.carouselContainerStyle}
            >
              {/* Historic Areas */}
              <div
                className="carousel-item"
                style={{
                  position: "relative",
                  width: "450px",
                  height: "290px",
                  border: "1px solid #ddd",
                  borderRadius: "15px",
                  flexShrink: 0,
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={historic}
                  alt="Historic Areas"
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                />
                <div
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "0",
                      marginRight: "10px",
                      color: "#0F5132",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Historic Areas
                    <input
                      type="checkbox"
                      name="historicAreas"
                      checked={preferences.historicAreas}
                      onChange={handlePreferenceChange}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Beaches */}
              <div
                className="carousel-item"
                style={{
                  position: "relative",
                  width: "450px",
                  height: "290px",
                  border: "1px solid #ddd",
                  borderRadius: "15px",
                  flexShrink: 0,
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={beach}
                  alt="Beaches"
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                />
                <div
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "0",
                      marginRight: "10px",
                      color: "#0F5132",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Beaches
                    <input
                      type="checkbox"
                      name="beaches"
                      checked={preferences.beaches}
                      onChange={handlePreferenceChange}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Family-Friendly */}
              <div
                className="carousel-item"
                style={{
                  position: "relative",
                  width: "450px",
                  height: "290px",
                  border: "1px solid #ddd",
                  borderRadius: "15px",
                  flexShrink: 0,
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={family}
                  alt="Family-Friendly"
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                />
                <div
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "0",
                      marginRight: "10px",
                      color: "#0F5132",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Family-Friendly
                    <input
                      type="checkbox"
                      name="familyFriendly"
                      checked={preferences.familyFriendly}
                      onChange={handlePreferenceChange}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Shopping */}
              <div
                className="carousel-item"
                style={{
                  position: "relative",
                  width: "450px",
                  height: "290px",
                  border: "1px solid #ddd",
                  borderRadius: "15px",
                  flexShrink: 0,
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={shopping}
                  alt="Shopping"
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                />
                <div
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "0",
                      marginRight: "10px",
                      color: "#0F5132",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Shopping
                    <input
                      type="checkbox"
                      name="shopping"
                      checked={preferences.shopping}
                      onChange={handlePreferenceChange}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Budget Selection */}
            <div
              className="budget-selection"
              style={{ marginTop: "30px", textAlign: "center" }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  marginRight: "10px",
                  fontSize: "16px",
                }}
              >
                Budget:
              </label>
              <select
                name="budget"
                value={preferences.budget}
                onChange={handlePreferenceChange}
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <option value="">Select</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button
                onClick={submitPreferences}
                style={{
                  marginTop: "30px",
                  padding: "12px 20px",
                  backgroundColor: "#0F5132",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Save Preferences
              </button>
              {successMessage && (
                <p style={{ color: "#0F5132" }}>{successMessage}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Section */}
      <div
        className="dashboard-section"
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          marginTop: "40px",
        }}
      >
        <div>
          <h3 style={styles.cardTitle}>Your Upcoming Booked Itineraries</h3>
          {upcomingItineraries.length > 0 ? (
            upcomingItineraries.map((itinerary) => (
              <div key={itinerary._id} style={styles.itineraryCard}>
                <h4>Activities Included: {itinerary.Activities.join(", ")}</h4>
                <p>Locations: {itinerary.Locations.join(", ")}</p>
                <p>
                  Price: {(itinerary.price * conversionRate).toFixed(2)}{" "}
                  {selectedCurrency}
                </p>
                <p>Tour Guide: {itinerary.TourGuide}</p>
                <p>Date: {itinerary.DatesTimes}</p>

                <button
                  onClick={() => handleCancelItineraryBooking(itinerary._id)}
                  style={styles.cancelButton}
                >
                  Cancel Booking (2 days before)
                </button>
              </div>
            ))
          ) : (
            <p style={styles.emptyMessage}>
              You have no booked upcoming itineraries.
            </p>
          )}
        </div>
        <button
          onClick={() => setShowPastItineraries(!showPastItineraries)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#0F5132",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {showPastItineraries
            ? "Hide Past Itineraries"
            : "Show Past Itineraries"}
        </button>

        {showPastItineraries && (
          <div
            className="card"
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#f9f9f9",
              borderRadius: "5px",
            }}
          >
            <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
              Past Itineraries
            </h3>
            {pastItineraries.length > 0 ? (
              pastItineraries.map((itinerary) => (
                <div
                  key={itinerary._id}
                  style={{
                    marginBottom: "10px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                  }}
                >
                  <h4>
                    Activities Included: {itinerary.Activities.join(", ")}
                  </h4>
                  <p>Locations: {itinerary.Locations.join(", ")}</p>
                  <p>
                    Price: {(itinerary.price * conversionRate).toFixed(2)}{" "}
                    {selectedCurrency}
                  </p>
                  <p>Tour Guide: {itinerary.TourGuide}</p>
                  <p>Date: {itinerary.DatesTimes}</p>

                  {!itinerary.feedbackSubmitted && (
                    <div style={styles.feedbackSection}>
                      <h4>Leave Feedback on Itinerary</h4>
                      <input
                        type="number"
                        placeholder="Rating"
                        value={ratingsI[itinerary._id] || ""} // Ensure correct binding
                        onChange={(e) =>
                          handleRatingChangeI(itinerary, e.target.value)
                        }
                        style={styles.input}
                        min="1"
                        max="5"
                      />
                      <input
                        type="text"
                        placeholder="Comment"
                        value={commentsI[itinerary._id] || ""} // Ensure correct binding
                        onChange={(e) =>
                          handleCommentChangeI(itinerary, e.target.value)
                        }
                        style={styles.input}
                      />
                      <button
                        onClick={() => submitFeedbackItinerary(itinerary)}
                        style={styles.button}
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}

                  <div style={styles.feedbackSection}>
                    <h4>Leave Feedback on Tour Guide</h4>
                    <input
                      type="number"
                      placeholder="Rating"
                      value={ratings[itinerary._id] || ""} // Ensure correct binding
                      onChange={(e) =>
                        handleRatingChange(itinerary, e.target.value)
                      }
                      style={styles.input}
                    />
                    <input
                      type="text"
                      placeholder="Comment"
                      value={comments[itinerary._id] || ""} // Ensure correct binding
                      onChange={(e) =>
                        handleCommentChange(itinerary, e.target.value)
                      }
                      style={styles.input}
                    />
                    <button
                      onClick={() => submitFeedback(itinerary)}
                      style={styles.button}
                    >
                      Submit Feedback
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={styles.emptyMessage}>You have no past itineraries</p>
            )}
          </div>
        )}

        <div className="card" style={styles.card}>
          <h3 style={styles.cardTitle}>Your Upcoming Booked Activities</h3>
          {bookedActivities.length > 0 ? (
            bookedActivities.map((Activity) => (
              <div key={Activity._id} style={styles.activityCard}>
                <h4>Activity Name: {Activity.name}</h4>
                <p>Category: {Activity.Category}</p>
                <p>
                  Price: {(Activity.price * conversionRate).toFixed(2)}{" "}
                  {selectedCurrency}
                </p>
                <p>Date: {Activity.date}</p>
                <p>Location: {Activity.Location}</p>
                <button
                  onClick={() => handleCancelActivityBooking(Activity._id)}
                  style={styles.cancelButton}
                >
                  Cancel Booking (2 days before)
                </button>
              </div>
            ))
          ) : (
            <p style={styles.emptyMessage}>
              You have no upcoming booked activities.
            </p>
          )}
        </div>

        {successMessage && <div style={styles.success}>{successMessage}</div>}
      </div>
    </div>
  );
};
const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
};
const styles = {
  preferencesForm: {
    marginTop: "20px",
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  preferencesHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "15px",
    textAlign: "center",
  },
  preferencesGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
    marginBottom: "15px",
  },
  preferenceItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "16px",
    color: "#333",
  },
  budgetSection: {
    marginTop: "10px",
    marginBottom: "15px",
    textAlign: "center",
  },
  budgetDropdown: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    width: "100%",
  },
  preferencesForm: {
    marginTop: "20px",
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  preferencesHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "15px",
    textAlign: "center",
  },
  preferencesGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
    marginBottom: "15px",
  },
  preferenceItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "16px",
    color: "#333",
  },
  budgetSection: {
    marginTop: "10px",
    marginBottom: "15px",
    textAlign: "center",
  },
  budgetDropdown: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    width: "100%",
  },
  submitButton: {
    display: "block",
    width: "70%",
    padding: "10px 15px",
    backgroundColor: "#0F5132",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  badgeImage: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    marginTop: "-15px",
  },
  walletInfo: {
    marginTop: "20px",
    backgroundColor: "#f7f7f7",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  walletTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  walletDetails: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    gap: "20px",
  },
  walletItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  walletAmount: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0F5132",
  },
  walletLabel: {
    marginTop: "5px",
    fontSize: "14px",
    color: "#666",
  },
  noAddressesText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
  },
  addressGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  addressCard: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ddd",
  },
  addressLine: {
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "5px",
    color: "#333",
  },
  primaryBadge: {
    display: "inline-block",
    marginTop: "10px",
    padding: "5px 10px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#28a745",
    borderRadius: "20px",
  },
  
  sliderItem: {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  tabButton: {
    padding: "10px 20px",
    background: "#f1f1f1",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#555",
  },
  activeTabButton: {
    padding: "10px 20px",
    background: "#0F5132",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    marginBottom: "15px",
  },

  textarea: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    resize: "vertical",
  },

  complaintsList: {
    padding: "10px",
    margin: "0 auto",
    width: "100%", // Ensure full width for slider
    height:"100%"
  },
  
 
  repliesSection: {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "10px",
    border: "1px solid #ddd",
    width: "100%",
  },
  
  
  repliesTitle: {
    fontSize:"16px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#0F5132",
  },
  replyCard: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.5",
  },
  
  
  noRepliesText: {
    fontStyle: "italic",
    color: "#666",
    fontSize: "13px",
  },
  tabButton: {
    padding: "8px 16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f1f1f1",
    color: "#333",
    cursor: "pointer",
    fontWeight: "bold",
  },
  activeTabButton: {
    padding: "8px 16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#0F5132",
    color: "white",
    fontWeight: "bold",
  },
  complaintCard: {
    backgroundColor: '#ffffff', // Clean white background for better readability
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '15px',
    border: '1px solid #eee',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Light shadow for depth
    fontSize: '14px', // Slightly smaller text for compactness
    lineHeight: '1.6',
    color: '#333',
    height:"100%"
  },
  complaintText: {
    fontSize: '15px',
    color: '#555',
    marginBottom: '8px',
  },
 
  emptyText: {
    fontSize: '14px',
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
  },

  
 

  
  statusIndicator: (status) => ({
    padding: '5px 10px',
    borderRadius: '10px',
    color: '#fff',
    backgroundColor: status === 'resolved' ? '#0F5132' : '#FFC107',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
  }),
  
    modalOverlay2: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      animation: 'fadeIn 0.3s ease-in-out',
      zIndex: 1000,
    },
    modalContent2: {
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      width: '40%',
      maxWidth: '500px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      animation: 'slideDown 0.3s ease-in-out',
    },
  

  
 
  modalTitle2: {
    fontSize: "22px",
    textAlign: "center",
    color: "#333",
  },
  modalText2: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.5",
  },
  termsSection: {
    backgroundColor: "#f7f7f7",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "15px",
  },
  termsTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
  termsText: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.5",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
  confirmButton: {
    backgroundColor: "#dc3545", // Red color
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  cancelButton: {
    backgroundColor: "#6c757d", // Gray color
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  saveButton: {
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deletebutton: {
    
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
 
label2: {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#333", // Visible contrast color
  marginBottom: "5px", // Space between label and input
  marginTop: "15px", // Space between label and input

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
    padding: '5px 8px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '50%',
    maxWidth: '600px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalContentH2: {
    fontSize: '22px',
    textAlign: 'center',
    color: '#333',
  },
  modalContentLabel: {
    fontWeight: 'bold',
    display: 'flex', alignItems: 'center', gap: '0px',
    color: '#555',
  },
  modalContentInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  },
  modalContentTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    resize: 'vertical',
  },
  modalContentButton: {
    padding: '10px 20px',
    border: 'none',
    background: '#0F5132',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  passwordSection: {
    borderTop: '1px solid #ddd',
    marginTop: '20px',
    paddingTop: '15px',
  },
  cancelIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '500px', // Adjust placement
    top: '100px', // Adjust placement
  },
  cancelIcon4: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '500px', // Adjust placement
    top: '150px', // Adjust placement
  },
  cancelIcon3: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '500px', // Adjust placement
    top: '250px', // Adjust placement
  },
  cancelpasswordIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '490px', // Adjust placement
    top: '200px', // Adjust placement
  },
  manageAccountContainer: {
    position: "relative",
    display: "inline-block",
  },
  dropdownMenu: {
    position: "absolute",
    top: "40px",
    right: "0",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    minWidth: "150px",
    overflow: "hidden",
  },
  dropdownItem: {
    padding: "10px 15px",
    fontSize: "14px",
    color: "#333",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  dropdownItemHover: {
    backgroundColor: "#f5f5f5",
  },
  carouselContainerStyle: {
    display: "flex",
    overflowX: "scroll",
    padding: "10px",
    gap: "10px",
    backgroundColor: "#f4f4f4",
    borderRadius: "10px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    width: "100%",
  },
  iconButton: {
    padding: "10px",
    backgroundColor: "#0F5132",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  searchIcon: {
    fontSize: "16px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#0F5132",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  cancelButton: {
    padding: "10px 15px",
    backgroundColor: "#DC3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  },
  itineraryCard: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  activityCard: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  feedbackSection: {
    marginTop: "10px",
    borderTop: "1px solid #ddd",
    paddingTop: "10px",
  },
  emptyMessage: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
  },
  error: {
    color: "#DC3545",
    marginTop: "10px",
  },
  success: {
    color: "#0F5132",
    marginTop: "10px",
  },
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
  headerIconsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px", // Spacing between the icons
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  carouselContainerStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    overflowX: "auto",
    gap: "20px",
    padding: "20px",
  },
  item: {
    padding: "10px 0",
  },
  iconn: {
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

  carouselItemStyle: {
    position: "relative",
    width: "450px",
    height: "290px",
    border: "1px solid #ddd",
    borderRadius: "15px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  logo: {
    height: "60px",
    width: "70px",
    borderRadius: "10px",
  },

  notificationButton: {
    position: "relative",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationIcon: {
    fontSize: "24px",
    color: "white",
  },
  notificationBadge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    padding: "5px",
    fontSize: "12px",
  },
  profileIcon: {
    fontSize: "30px",
    color: "white",
    cursor: "pointer",
  },
  notificationDropdown: {
    backgroundColor: "#fff",

    position: "absolute",
    top: "40px",
    right: "0px",

    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    width: "320px",
    maxHeight: "400px",
    overflowY: "auto", // Enable vertical scrolling
    overflowX: "hidden",
    zIndex: 1000,
  },
  dropdownHeader: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
  },
  logoutIcon: {
    cursor: "pointer",
  },
  notificationItem: {
    padding: "10px",

    borderBottom: "1px solid #ddd",
    padding: "20px",
    textAlign: "center",
    color: "#888",
    fontSize: "5px",
  },
  notificationDate: {
    fontSize: "12px",
    color: "#666",
  },
  noNotifications: {
    padding: "10px",
    color: "#666",
    textAlign: "center",
  },
  actionButtons: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: "10px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
    margin: 0,
    marginLeft: "60px",
  },

  addButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#0F5132",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  sidebar: {
    position: "fixed",
    top: "60px",
    left: 0,
    height: "100vh",
    width: "50px", // Default width when collapsed
    backgroundColor: "rgba(15, 81, 50, 0.85)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // Ensure alignment starts from the left
    padding: "10px 0",
    overflowX: "hidden",
    transition: "width 0.3s ease",
    zIndex: 1000,
  },
  sidebarExpanded: {
    width: "200px", // Width when expanded
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // Align items to the left
    padding: "10px",
    width: "100%", // Take full width of the sidebar
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  iconContainerHover: {
    backgroundColor: "#084B24", // Background on hover
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
  labelVisible: {
    opacity: 1, // Fully visible when expanded
  },
  cartButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    color: "#fff",
    cursor: "pointer",

    transition: "background-color 0.3s ease",
  },
  cartButtonHover: {
    backgroundColor: "#e6e6e6", // Change background on hover
  },
  cartIcon: {
    fontSize: "25px",
  },
  cartLabel: {
    fontSize: "16px",
    fontWeight: "bold",
  },
};
export default TouristProfile;
