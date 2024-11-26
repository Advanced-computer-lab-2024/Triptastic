import React, { useState, useEffect, useContext } from 'react';
import './TouristProfile.css'; // Assuming you create a CSS file for styling
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, } from "react-icons/fa";
import { FaBell,FaUserCircle} from 'react-icons/fa';

const TouristProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const [touristInfo, setTouristInfo] = useState(null);
  const [complaints, setComplaints] = useState([]); // New state for complaints
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false); // Track update status
  const [Itineraries,setItineraries]= useState('');
  const [showingItineraries,setShowingItineraries]=useState(false);
  const [bookedItineraries, setBookedItineraries] = useState([]);// State for booked itineraries
  const [showingBookedItineraries, setShowingBookedItineraries]= useState(false); // State for showing booked itineraries
  const [showingBookedActivities, setShowingBookedActivities]= useState(false); // State for showing booked activities
  const [bookedActivities, setBookedActivities]= useState([]); // State for booked activities
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // Initialize successMessage
  const [fetchedProduct, setFetchedProduct] = useState(null);//new
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [ratingsI, setRatingsI] = useState({});
  const [commentsI, setCommentsI] = useState({});
  const [requestSent, setRequestSent] = useState(false); // Track if request was successfully sent
  const [waiting, setWaiting] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  localStorage.setItem('context', 'tourist');
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);

  const [formData, setFormData] = useState({
    Username: '',
    points:'',
    badge:'',
    Email: '',
    Password: '',
    Nationality: '',
    DOB: '',
    Occupation: '',
    Wallet: '',
    title: '', 
    body: '',  
    date: ''  
  });
  const [preferences, setPreferences] = useState({
    historicAreas: false,
    beaches: false,
    familyFriendly: false,
    shopping: false,
    budget: ''
  });
  const navigate = useNavigate();
  useEffect(() => {
    fetchItineraries();
    fetchNotifications();

      }, []);
      useEffect(() => {
        fetchBookedItineraries();
        fetchBookedActivities(); // Fetch booked itineraries when the component mounts
      }, []); // Empty dependency array means this runs once after the first render
      
      const fetchNotifications = async () => {
        const username = localStorage.getItem('Username'); // Assuming username is stored in local storage
        if (!username) return;
    
        try {
          const response = await axios.get(
            `http://localhost:8000/getNotifications?username=${username}`
          );
          if (response.status === 200) {
            setNotifications(response.data.notifications);
            const unread = response.data.notifications.filter((n) => !n.read).length;
            setUnreadCount(unread);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
    
      // Mark notifications as read
      const markNotificationsAsRead = async () => {
        const username = localStorage.getItem('Username');
        if (!username) return;
    
        try {
          await axios.patch(
            `http://localhost:8000/markNotificationsRead?username=${username}`
          );
          setUnreadCount(0);
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      };
    
      // Handle click on the notification bell
      const handleNotificationClick = () => {
        setShowNotifications((prev) => !prev);
        if (unreadCount > 0) markNotificationsAsRead();
      };
    
      
      const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };


  const handleViewItineraries=()=>{
    setShowingItineraries( prev=>!prev);
  }
  const toggleViewBookedActivites = () => {
    setShowingBookedActivities((prev) => !prev);
  }
  const handleRatingChangeI = (itineraryId, value) => {
    setRatingsI((prevRatings) => ({
      ...prevRatings,
      [itineraryId]: value,
    }));
  };

  const handleCommentChangeI = (itineraryId, value) => {
    setCommentsI((prevComments) => ({
      ...prevComments,
      [itineraryId]: value,
    }));
  };

  const handleViewBookedItineraries = () => {
    setShowingBookedItineraries(prev => !prev);
  };

  const handleRatingChange = (itineraryId, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [itineraryId]: value,
    }));
  };

  const handleCommentChange = (itineraryId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [itineraryId]: value,
    }));
  };
  const handleCurrencyChange = (event) => {
    fetchConversionRate(event.target.value);
  };
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('New passwords do not match.');
      return;
    }
  
    setChangingPassword(true);
    setPasswordChangeError('');
    setPasswordChangeMessage('');
  
    try {
      const username = localStorage.getItem('Username'); // Assuming the username is saved in localStorage
      const response = await axios.patch('http://localhost:8000/changePasswordTourist', {
        Username: username,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
  
      if (response.status === 200) {
        setPasswordChangeMessage('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordChangeError('Failed to change password.');
      }
    } catch (error) {
      setPasswordChangeError(error.response?.data?.error || 'An error occurred.');
    } finally {
      setChangingPassword(false);
    }
  };
  
  const fetchTouristInfo = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username');
    
    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getTourist?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            // Apply currency conversion to Wallet balance
            data.Wallet = (data.Wallet * conversionRate).toFixed(2);
            setTouristInfo(data);
            setFormData(data); // Pre-fill the form with current data
            setErrorMessage('');
          } else {
            setErrorMessage('No tourist information found.');
          }
        } else {
          throw new Error('Failed to fetch tourist information');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching tourist information');
        console.error(error);
      }
    } else {
      setErrorMessage('No tourist information found.');
    }
    setLoading(false);
  };
  const handleCancelActivityBooking = async (id) => {
    const username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/cancelBookedActivity/${id}?username=${username}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Activity booking cancelled successfully!');
        setErrorMessage('');
        fetchBookedActivities(); // Refresh booked activities after cancelling one
      } else {
        throw new Error('Failed to cancel activity booking');
      }
    } catch (error) {
      setErrorMessage('An error occurred while cancelling activity booking');
      console.error(error);
    }
  };
  const handleCancelItineraryBooking = async (id) => { 
    const username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/cancelBookedItinerary/${id}?username=${username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Itinerary booking cancelled successfully!');
        setErrorMessage('');
        fetchBookedItineraries(); // Refresh booked itineraries after cancelling one
      } else {
        throw new Error('Failed to cancel itinerary booking');
      }
    } catch (error) {
      setErrorMessage('An error occurred while cancelling itinerary booking');
      console.error(error);
    }
  };
  const fetchItineraries= async ()=>{
    try{
      const response = await fetch(`http://localhost:8000/getAllItineraries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setItineraries(data);
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  // New function to fetch complaints
  const fetchComplaints = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/getComplaintsByTourist?username=${Username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data); // Set complaints state
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch complaints');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching complaints');
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTouristInfo();
    fetchComplaints(); // Fetch complaints when the component loads
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };



  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch('http://localhost:8000/updateTourist', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedTourist = await response.json();
        setTouristInfo(updatedTourist);
        setErrorMessage('');
        alert('Information updated successfully!');
      } else {
        throw new Error('Failed to update tourist information');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating tourist information');
      console.error(error);
    }
    setUpdating(false);
  };

  // Function to fetch a product by name
  const fetchProductByName = async (productName) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/getProductTourist?productName=${productName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const product = await response.json();
  
        // Check if the product exists and if it is archived
        if (!product || product.archived === true) {
          setErrorMessage('Product not found');
          setFetchedProduct(null); // Clear the fetched product state
        } else {
          setFetchedProduct(product); // Store the fetched product
          setErrorMessage(''); // Clear any previous error messages
        }
      } else {
        throw new Error('Failed to fetch product');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching the product');
      console.error(error);
    }
    setLoading(false);
  };
  
  const handleFetchProduct = () => {
    const productName = formData.productName; // Assuming there's an input for productName
    fetchProductByName(productName);
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();

    try {
      const username = localStorage.getItem('Username'); // Retrieve username from localStorage

      if (!username) {
        setErrorMessage('Username not found in localStorage. Please log in again.');
        return; // Exit the function if username is not found
      }

      const complaintData = {
        title: formData.title,
        body: formData.body,
        date: formData.date,
      };

      // Construct the URL with the username as a query parameter
      const response = await fetch(`http://localhost:8000/fileComplaint?username=${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData), // Send form data
      });

      if (response.ok) {
        alert('Complaint filed successfully!');
        setErrorMessage('');
        setFormData((prev) => ({ ...prev, ...complaintData, title: '', body: '', date: '' ,Reply:''}));
        fetchComplaints(); // Refresh complaints after filing a new one
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to file complaint');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };
  const fetchBookedActivities = async () => {
    setLoading(true);
    const username = localStorage.getItem('Username');

    if (!username) {
      setErrorMessage('Username not found in localStorage. Please log in again.');
      setLoading(false);
      return; // Exit if username is not found
    }

    try {
      const response = await axios.get(`http://localhost:8000/getBookedActivities?username=${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in local storage
        },
      });

      if (response.status === 200) {
        setBookedActivities(response.data); 
      } else {
        setErrorMessage('Failed to retrieve booked activities');
      }
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }; 
  const fetchBookedItineraries = async () => {
    setLoading(true);
    const username = localStorage.getItem('Username');

    if (!username) {
      setErrorMessage('Username not found in localStorage. Please log in again.');
      setLoading(false);
      return; // Exit if username is not found
    }

    try {
      const response = await axios.get(`http://localhost:8000/getBookedItineraries?username=${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in local storage
        },
      });

      if (response.status === 200) {
        setBookedItineraries(response.data); // Store booked itineraries in state
      } else {
        setErrorMessage('Failed to retrieve booked itineraries');
      }
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }; 
  const submitFeedbackItinerary = async (Itinerary) => {
    const username = localStorage.getItem('Username'); // Get the username from local storage
  
    console.log("Submitting feedback for itinerary:", Itinerary);
  
    try {
      const response = await axios.post(`http://localhost:8000/submitFeedbackItinerary?username=${username}`, {
        Itinerary: Itinerary, // Send the itinerary ID
        rating: ratingsI[Itinerary], // Ensure you are using the correct ID to get the rating
        comment: commentsI[Itinerary], // Ensure you are using the correct ID to get the comment
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include authorization if needed
        },
      });
  
      if (response.status === 200) {
        setSuccessMessage('Feedback submitted successfully!');
        setErrorMessage('');
      }
    } catch (err) {
      console.log(Itinerary);

      setErrorMessage(err.response?.data?.message || 'Failed to submit feedback');
      setSuccessMessage('');
    }
  };
  
  const submitFeedback = async (Itinerary) => {
    const tourGuideUsername = Itinerary.TourGuide;
    const username = localStorage.getItem('Username');

    console.log("Submitting feedback for itinerary:", Itinerary);


    try {
      const response = await axios.post(`http://localhost:8000/submitFeedback?username=${username}`, {
        Itinerary: Itinerary,
        rating: ratings[Itinerary],
        comment: comments[Itinerary],
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Feedback submitted successfully!');
        setErrorMessage('');
      }
    } catch (err) {
     
      setErrorMessage(err.response?.data?.message || 'Failed to submit feedback');
      setSuccessMessage('');
    }
  };
  const submitPreferences = async () => {
    try {
      const username = localStorage.getItem('Username');

      const response = await fetch(`http://localhost:8000/setPreferences?username=${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences)
      });

      if (response.ok) {
        setSuccessMessage('Preferences updated successfully!');
        setErrorMessage('');
      } else {
        throw new Error('Failed to update preferences');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating preferences');
    }
  };
  const handlePreferenceChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleDeleteRequest = async () => {
    const Username = localStorage.getItem('Username');
    setWaiting(true);
    setRequestSent(false); // Reset request sent state when initiating new request
    try {
        const response = await fetch(`http://localhost:8000/requestAccountDeletionTourist?Username=${Username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            }
            
        });
        const data = await response.json();
        if (response.ok) {
          setRequestSent(true); // Set to true when the request is successfully sent
          alert('Your account deletion request has been submitted and is pending approval.');
        } else {
          setRequestSent(false); // Reset to allow another deletion request
          alert(data.msg); // Show the rejection message
         }
 
        
    } catch (error) {
        alert('Error deleting account');
    }
    finally {
      setWaiting(false); // Stop waiting regardless of outcome
  }


  
  const SidebarMenu = () => {
    const navigate = useNavigate();
    
  
  
  };



  


};
return (
  <div>
    {/* Header Section */}
    <header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <h1 style={styles.title}>Tourist Profile</h1>
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
  <FaUserCircle
    alt="Profile Icon"
    style={styles.profileIcon}
    onClick={() => navigate('/touristSettings')} // Navigate to profile
  />
  <div style={styles.cartButton} onClick={() => navigate('/Cart')}>
    <FaShoppingCart style={styles.cartIcon} />
    <span style={styles.cartLabel}></span>
  </div>
</header>
{/* Notification Dropdown */}
{showNotifications && (
        <div style={styles.notificationDropdown}>
          <h3 style={styles.dropdownHeader}>Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} style={styles.notificationItem}>
                <p>{notification.message}</p>
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
    <div className="tourist-profile-container" style={{ marginTop: '120px' }}>
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
        <div style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaLandmark style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Loc
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/museums')}>
          <FaUniversity style={styles.icon} />
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
        <div style={styles.item} onClick={() => navigate('/itineraries')}>
          <FaMap style={styles.icon} />
          <span className="label" style={styles.label}>
            Itineraries
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/activities')}>
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
          <FaHotel style={styles.icon} />
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

      {/* Preferences Section */}
      <div className="preferences-section">
        <h3>Select Your Vacation Preferences</h3>
        <div className="preferences-form">
          <label>
            <input
              type="checkbox"
              name="historicAreas"
              checked={preferences.historicAreas}
              onChange={handlePreferenceChange}
            />
            Historic Areas
          </label>
          <label>
            <input
              type="checkbox"
              name="beaches"
              checked={preferences.beaches}
              onChange={handlePreferenceChange}
            />
            Beaches
          </label>
          <label>
            <input
              type="checkbox"
              name="familyFriendly"
              checked={preferences.familyFriendly}
              onChange={handlePreferenceChange}
            />
            Family-Friendly
          </label>
          <label>
            <input
              type="checkbox"
              name="shopping"
              checked={preferences.shopping}
              onChange={handlePreferenceChange}
            />
            Shopping
          </label>
          <label>
            Budget:
            <select name="budget" value={preferences.budget} onChange={handlePreferenceChange}>
              <option value="">Select</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <button onClick={submitPreferences}>Save Preferences</button>
        </div>
      </div>

      {successMessage && <p style={{ color: '#0F5132' }}>{successMessage}</p>}
      {/* Fetch Product by Name */}
<div>
<h3>Fetch Product by Name</h3>
<input
  type="text"
  name="productName"
  value={formData.productName}
  onChange={handleInputChange}
/>
<button onClick={handleFetchProduct}>Fetch Product</button>

{fetchedProduct && (
  <div>
    <h4>Product Details</h4>
    <p><strong>Name:</strong> {fetchedProduct.productName}</p>
    <p><strong>Description:</strong> {fetchedProduct.description}</p>
    <p>
      <strong>Price:</strong> {(fetchedProduct.price * conversionRate).toFixed(2)} {selectedCurrency}
    </p>
    <p><strong>Stock:</strong> {fetchedProduct.stock}</p>
  </div>
)}
</div>

    <div>
      <button onClick={handleViewItineraries}> {showingItineraries ? 'Hide itineraries' : 'Show itineraries'}</button>
      { showingItineraries && (
          <div>
          {Itineraries.length > 0 ? ( // Use 'itineraries' state variable for mapping
            Itineraries.map((itinerary) => (
              <div key={itinerary._id}>
                <h4>Activities: {itinerary.Activities.join(', ')}</h4>
                <p>Locations: {itinerary.Locations.join(', ')}</p>
              </div>
            ))
          ) : (
            <p>No itineraries found.</p>
          )}
        </div>
      )}
    </div>
    

    

 

    <div>
    <button onClick={handleViewBookedItineraries}> {showingBookedItineraries ? 'Hide booked itineraries' : 'Show booked itineraries'}</button>
    {showingBookedItineraries && (
      <div>
        {bookedItineraries.length > 0 ? (
          bookedItineraries.map((Itinerary) => (
            <div key={Itinerary._id}>
              <h4>Booked Activities: {Itinerary.Activities.join(', ')}</h4>
              <p>Locations: {Itinerary.Locations.join(', ')}</p>
              <p>Price: {(Itinerary.price * conversionRate).toFixed(2)} {selectedCurrency}</p> 
              <p>TourGuide: {Itinerary.TourGuide}</p>
              <p>Date:{Itinerary.DatesTimes}</p>
<h4>Feedback on Itinerary</h4>

<input 
  type="number" 
  placeholder="Rating" 
  onChange={(e) => handleRatingChangeI(Itinerary, e.target.value)} // Update the rating state
/>

<input 
  type="text" 
  placeholder="Comment" 
  onChange={(e) => handleCommentChangeI(Itinerary, e.target.value)} // Update the comment state
/>

<button onClick={() => submitFeedbackItinerary(Itinerary)}>Submit Feedback</button>
<h4>Feedback on Tour Guide:</h4>

               <input 
                type="number" 
                placeholder="Rating" 
                onChange={(e) => handleRatingChange(Itinerary, e.target.value)}
                />
              <input 
                type="text" 
                placeholder="Comment" 
                onChange={(e) => handleCommentChange(Itinerary, e.target.value)}
                />
              <button onClick={() => submitFeedback(Itinerary)}>Submit Feedback</button>
              <button onClick={()=>handleCancelItineraryBooking(Itinerary._id)}>Cancel Booking( 2 days before )</button>
            </div>
            
          ))
        ) : (
          <p>No booked itineraries found.</p>
        )}
      </div>
    )}
    </div>
    <div>
      <button onClick={toggleViewBookedActivites}>{showingBookedActivities ? 'Hide booked activites' : 'Show booked activites'}</button>
      {showingBookedActivities && (
      <div>
        {bookedActivities.length > 0 ? (
          bookedActivities.map((Activity) => (
            <div key={Activity._id}>
              <h4>Name: {Activity.name}</h4>
              <p>Cateogry: {Activity.Category}</p>
              <p>Price: {(Activity.price * conversionRate).toFixed(2)} {selectedCurrency}</p> {/* Convert price here */}
              <p>Date: {Activity.date}</p>
              <p>Location:{Activity.Location}</p>                 
              <button onClick={()=>handleCancelActivityBooking(Activity._id)}>Cancel Booking( 2 days before )</button>
            </div>
          ))
        ) : (
          <p>No booked activites found.</p>
        )}
      </div>
    )}
    </div>
    {errorMessage && <div className="error">{errorMessage}</div>}
    {successMessage && <div className="success">{successMessage}</div>}
 
    </div>
  </div>
);

};
const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
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
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '70px',
    width: '80px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
  },
  notificationButton: {
    position: 'relative',
    cursor: 'pointer',
  },
  notificationIcon: {
    fontSize: '24px',
    color: 'white',
   // marginLeft:'100px'
  },
  notificationBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '5px',
    fontSize: '12px',
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
  },
  notificationDropdown: {
    position: 'absolute',
    top: '60px',
    right: '20px',
    width: '300px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  dropdownHeader: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    fontWeight: 'bold',
  },
  notificationItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  notificationDate: {
    fontSize: '12px',
    color: '#666',
  },
  noNotifications: {
    padding: '10px',
    color: '#666',
    textAlign: 'center',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: '10px',
  
  },
 title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
    marginLeft:'400px'
  },

  
  addButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  
  sidebar: {
    position: 'fixed',
    top: '90px',
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
  cartButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff', // White background for the button
    color: '#0F5132', // Green text
    borderRadius: '8px',
    padding: '5px 5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)', // Subtle shadow for the button
  },
  cartButtonHover: {
    backgroundColor: '#e6e6e6', // Lighter background on hover
  },
  cartIcon: {
    fontSize: '25px',
    },
  cartLabel: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
};
export default TouristProfile;