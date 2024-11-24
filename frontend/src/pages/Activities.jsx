import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import { CurrencyContext } from '../pages/CurrencyContext';
import { FaBell, FaUserCircle ,FaCalendar,FaDollarSign ,FaMapMarkerAlt,FaClock,FaTags,FaPercent} from 'react-icons/fa'; // Import icons
import logo from '../images/image_green_background.png'; // Add your logo file pathimport axios from 'axios';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Activities = () => {
  const { selectedCurrency, conversionRate ,fetchConversionRate} = useContext(CurrencyContext);
  const [activities, setActivities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedActivities, setExpandedActivities] = useState({});
  const [commentData, setCommentData] = useState({ Username: '', comment: '' });
  const [ratingData, setRatingData] = useState({ rating: '' }); // New state for rating
  const [responseMsg, setResponseMsg] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState({});
  const [activityToShare, setActivityToShare] = useState(null);
  const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('Username') || '');
  const navigate = useNavigate();


  const [notificationRequested, setNotificationRequested] = useState({});
  // Sorting states
  const [priceSort, setPriceSort] = useState('PASC'); // 'PASC' or 'PDSC'
  const [ratingSort, setRatingSort] = useState('RASC'); // 'RASC' or 'RDSC'

  // Filter states
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [filterRating, setFilterRating] = useState('');

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name'); // 'name', 'category', 'tag'

  // Fetch activities with sorting
  const fetchSortedActivities = async (priceSortParam, ratingSortParam) => {
    try {
      const response = await fetch(`http://localhost:8000/sortAct${priceSortParam}${ratingSortParam}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const filteredActivities = data.filter(activity => !activity.FlagInappropriate);
        setActivities(filteredActivities);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch activities');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching activities');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (event) => {
    fetchConversionRate(event.target.value);
  };
  // Fetch activities with filters
  const fetchFilteredActivities = async () => {
    try {
      const filterParams = new URLSearchParams();
      if (filterCategory) filterParams.append('Category', filterCategory);
      if (filterDate) filterParams.append('date', filterDate);
      if (minBudget) filterParams.append('minBudget', minBudget);
      if (maxBudget) filterParams.append('maxBudget', maxBudget);
      if (filterRating) filterParams.append('rating', filterRating);

      const response = await fetch(`http://localhost:8000/filterActivities?${filterParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const filteredActivities = data.filter(activity => !activity.FlagInappropriate);
        setActivities(filteredActivities);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch activities');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching activities');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch activities with search
  // const fetchSearchedActivities = async () => {
  //   try {
  //     const searchParams = new URLSearchParams();
  //     searchParams.append(searchType, searchQuery);

  //     const response = await fetch(`http://localhost:8000/searchActivities?${searchParams.toString()}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       const filteredActivities = data.filter(activity => !activity.FlagInappropriate);
  //       setActivities(filteredActivities);
  //       setErrorMessage('');
  //     } else {
  //       throw new Error('Failed to fetch activities');
  //     }
  //     setErrorMessage('An error occurred while fetching activities');
  //     //console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBookmarkedActivities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/getBookmarkedEvents', {
        params: { Username: username },
      });
      setBookmarkedActivities(response.data.bookmarkedEvents);
    } catch (error) {
      console.error('Error fetching bookmarked activities:', error);
    }
  };

  const handleBookmark = async (activityId) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/bookmarkEvent',
        { eventId: activityId },
        { params: { Username: username } }
      );
      alert('Activity bookmarked successfully!');
      fetchBookmarkedActivities(); // Refresh the bookmarked activities
    } catch (error) {
      console.error('Error bookmarking activity:', error);
    }
  };

  const handleRemoveBookmark = async (activityId) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/removeBookmark',
        { eventId: activityId },
        { params: { Username: username } }
      );
      alert('Bookmark removed successfully!');
      fetchBookmarkedActivities(); // Refresh the bookmarked activities
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const fetchSearchedActivities = async () => {
    setLoading(true); // Show loading indicator
    try {
      const searchParams = new URLSearchParams();
  
      // Based on selected searchType, append the correct query parameter
      if (searchType === 'name') {
        searchParams.append('name', searchQuery);
      } else if (searchType === 'Category') {
        searchParams.append('category', searchQuery);
      } else if (searchType === 'tags') {
        searchParams.append('tag', searchQuery);
      }
  
      const response = await fetch(`http://localhost:8000/searchActivities?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Only show activities that aren't flagged as inappropriate
        const filteredActivities = data.filter(activity => !activity.FlagInappropriate);
  
        // If no activities match the criteria, set an appropriate message
        if (filteredActivities.length === 0) {
          setErrorMessage('No activities found satisfying your criteria.');
          setActivities([]); // Ensure the activities list is empty
        } else {
          setActivities(filteredActivities); // Set the activities that match the criteria
          setErrorMessage(''); // Clear error message if activities are found
        }
      } else if (response.status === 404) {
        // Handle 404 Not Found error for specific messages
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'No activities found matching your criteria.');
        setActivities([]); // Ensure the activities list is empty
      } else {
        throw new Error('Failed to fetch activities');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching activities');
      console.error(error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };
  
  
  
  const handleSort = (priceSortParam, ratingSortParam) => {
    setPriceSort(priceSortParam);
    setRatingSort(ratingSortParam);
    setLoading(true);
    fetchSortedActivities(priceSortParam, ratingSortParam);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchFilteredActivities();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchSearchedActivities();
  };

  const toggleActivityDetails = (id) => {
    setExpandedActivities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    fetchSortedActivities('PASC', 'RASC'); // Default sort: Price Asc, Rating Asc
    fetchBookmarkedActivities();
  }, []);
 
  const handleShare = async (activity, shareMethod) => {
    try {
      const response = await fetch(`http://localhost:8000/shareActivity/${encodeURIComponent(activity.name)}`, {
        method: 'POST', // Use POST to match the backend's expectations
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: shareMethod === 'email' ? email : '' // Only include email if method is 'email'
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setShareableLink(data.link);
  
        if (shareMethod === 'copy') {
          await navigator.clipboard.writeText(data.link);
          setCopySuccess((prev) => ({ ...prev, [activity._id]: 'Link copied to clipboard!' }));
        } else if (shareMethod === 'email') {
          alert('Link sent to the specified email!');
        }
      } else {
        console.error('Failed to generate shareable link');
      }
    } catch (error) {
      console.error('Error generating shareable link:', error);
    }
  };
  
  const handleEmailInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleShareMode = (activity) => {
    setActivityToShare(activity);
    setIsEmailMode(!isEmailMode);
  };

const bookActivity = async (activityName) => {
  const username = localStorage.getItem('Username');
  try {
    const response = await fetch('http://localhost:8000/bookActivity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: activityName, Username: username }), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Booking failed');
    }

    const data = await response.json();
    setErrorMessage(''); // Clear any previous error messages
    alert(data.message); // Show success message
  } catch (error) {
    setErrorMessage(error.message);
    console.error(error);
  }
};
const handleNotificationRequest = async (activityId) => {
  try {
    const response = await fetch('http://localhost:8000/requestNotification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: localStorage.getItem('Username'),
        activityId,
      }),
    });

    if (response.ok) {
      alert('You will be notified when bookings open!');
      setNotificationRequested((prev) => ({ ...prev, [activityId]: true })); // Mark as requested
    } else {
      const errorData = await response.json();
      alert(errorData.message || 'Failed to request notification.');
    }
  } catch (error) {
    console.error('Error requesting notification:', error);
    alert('An error occurred. Please try again.');
  }
};
const handleProfileRedirect = () => {
  const context = localStorage.getItem('context');

  if (context === 'tourist') {
    navigate('/tourist-profile');
  } else if (context === 'guest') {
    navigate('/Guest');
  }  else {
    console.error('Unknown context');
    navigate('/'); // Fallback to home
  }
};
return (
  <div style={styles.container}>
    <header style={styles.header}>
      <img src={logo} alt="Logo" style={styles.logo} />
      <h2 style={styles.title}>Activities</h2>
      <FaUserCircle style={styles.profileIcon} onClick={handleProfileRedirect} />
    </header>

    {loading ? (
      <p style={styles.loading}>Loading activities...</p>
    ) : (
      <>
        {/* Sorting Buttons */}
        <div style={styles.section}>
          <h3>Sort Activities</h3>
          <div style={styles.buttonGroup}>
            <button onClick={() => handleSort('PASC', 'RASC')}>Price Asc & Rating Asc</button>
            <button onClick={() => handleSort('PASC', 'RDSC')}>Price Asc & Rating Desc</button>
            <button onClick={() => handleSort('PDSC', 'RASC')}>Price Desc & Rating Asc</button>
            <button onClick={() => handleSort('PDSC', 'RDSC')}>Price Desc & Rating Desc</button>
          </div>
        </div>

        {/* Filter Form */}
        <div style={styles.section}>
          <h3>Filter Activities</h3>
          <form onSubmit={handleFilterSubmit} style={styles.filterForm}>
            <label>
              Category:
              <input
                type="text"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                placeholder="e.g., Adventure"
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </label>
            <label>
              Min Budget:
              <input
                type="number"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                placeholder="Minimum Price"
              />
            </label>
            <label>
              Max Budget:
              <input
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="Maximum Price"
              />
            </label>
            <label>
              Minimum Rating:
              <input
                type="number"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                placeholder="Rating (e.g., 4)"
                min="1"
                max="5"
              />
            </label>
            <button type="submit">Apply Filters</button>
          </form>
        </div>

        {/* Search Form */}
        <div style={styles.section}>
          <h3>Search Activities</h3>
          <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
            <label>
              Search Query:
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, category, or tag"
              />
            </label>
            <label>
              Search By:
              <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                <option value="name">Name</option>
                <option value="Category">Category</option>
                <option value="tags">Tag</option>
              </select>
            </label>
            <button type="submit">Search</button>
          </form>
        </div>

        {/* Error Message */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        {/* Activities List */}
        {activities.length > 0 ? (
          <div>
            {activities.map((activity) => (
              <div key={activity._id} style={styles.activityCard}>
                <h4>{activity.name}</h4>
                <p>
                  <strong><FaDollarSign /> Price:</strong> {(activity.price * conversionRate).toFixed(2)}{' '}
                  {selectedCurrency}
                </p>
                <p>
                  <strong><FaCalendar /> Date:</strong>{' '}
                  {new Date(activity.date).toLocaleDateString()}
                </p>
                <p>
                  <strong><FaMapMarkerAlt /> Location:</strong> {activity.location}
                </p>
                <p>
                  <strong>Booking Open:</strong> {activity.bookingOpen ? 'Yes' : 'No'}
                  {!activity.bookingOpen && (
                    <FaBell
                      style={styles.bellIcon}
                      onClick={() => handleNotificationRequest(activity._id)}
                    />
                  )}
                </p>
                <div style={styles.buttonGroup}>
                  <button onClick={() => bookActivity(activity.name)}>Book Ticket</button>
                  <button onClick={() => handleBookmark(activity._id)}>Bookmark</button>
                  <button onClick={() => handleShare(activity, 'copy')}>Copy Link</button>
                  <button onClick={() => handleShareMode(activity)}>Share via Email</button>
                </div>
                {isEmailMode && activityToShare && activityToShare._id === activity._id && (
                  <div style={styles.emailForm}>
                    <input
                      type="email"
                      placeholder="Enter recipient's email"
                      value={email}
                      onChange={handleEmailInputChange}
                    />
                    <button onClick={() => handleShare(activity, 'email')}>Send Email</button>
                  </div>
                )}
                {copySuccess[activity._id] && <p>{copySuccess[activity._id]}</p>}
                <button onClick={() => toggleActivityDetails(activity._id)}>
                  {expandedActivities[activity._id] ? 'Hide Activity Details' : 'View Activity Details'}
                </button>
                {expandedActivities[activity._id] && (
                  <div style={styles.details}>
                    <p><strong>Category:</strong> {activity.Category}</p>
                    <p><strong><FaClock /> Time:</strong> {activity.time}</p>
                    <p><strong><FaTags /> Tags:</strong> {activity.tags.join(', ')}</p>
                    <p><strong><FaPercent /> Discounts:</strong> {activity.specialDiscounts}</p>
                    <p><strong><FaUserCircle /> Advertiser:</strong> {activity.Advertiser}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No activities found.</p>
        )}
      </>
    )}
  </div>
);
}

const styles = {
container: {
  maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
},
header: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  backgroundColor: '#4CAF50',
  padding: '10px 20px',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
},
logoContainer: {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
},
logo: {
  height: '70px',
  width: '80px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
},
profileIcon: {
  fontSize: '40px',
  color: 'white',
  cursor: 'pointer',
  borderRadius: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
},
title: {
  fontSize: '24px',
  color: 'white',
},

section: {
  margin: '20px 0',
},
list: {
  listStyleType: 'none',
  padding: 0,
},
listItem: {
  backgroundColor: '#fff',
  padding: '15px',
  borderRadius: '10px',
  marginBottom: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
},
bellIcon: {
  fontSize: '20px',
  color: '#4CAF50',
  cursor: 'pointer',
  marginLeft: '10px',
},
activityCard: {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '15px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
},
buttonGroup: {
  display: 'flex',
  gap: '10px',
  marginTop: '10px',
},
emailForm: {
  marginTop: '10px',
},
details: {
  marginTop: '10px',
  paddingLeft: '20px',
},
};
export default Activities;
