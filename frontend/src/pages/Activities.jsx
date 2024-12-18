import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import { CurrencyContext } from '../pages/CurrencyContext';
import { FaBell, FaUserCircle, FaCalendar, FaDollarSign, FaMapMarkerAlt, FaClock, FaTags, FaPercent } from 'react-icons/fa'; // Import icons
import {
  FaGlobe, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList, FaSearch,
  FaStar, Famuseum
} from "react-icons/fa";
import logo from '../images/image.png'; // Add your logo file pathimport axios from 'axios';
import axios from 'axios';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import IosShareIcon from '@mui/icons-material/IosShare';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { FiCopy } from 'react-icons/fi'; // Import a copy icon
import activity from '../images/dk3.jpg';
import HotelIcon from '@mui/icons-material/Hotel';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';

import { Tooltip as ReactTooltip } from 'react-tooltip';


import MuseumIcon from '@mui/icons-material/Museum';
import { FaTimes,FaSort,FaFilter } from 'react-icons/fa'; // Icons for transport types
const Activities = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);
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
  const [isBookmarked, setIsBookmarked] = useState(false); // State to toggle fill
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false); // Track if filters have been applied


  const handleBookmarkToggle = (activityId) => {

    // Check if the activity is already bookmarked
    const alreadyBookmarked = bookmarkedActivities.some((activity) => activity._id === activityId);

    if (alreadyBookmarked) {
      // If it's already bookmarked, remove it
      handleRemoveBookmark(activityId);
    } else {
      // If it's not bookmarked, add it
      handleBookmark(activityId);
    }
  };

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

  // const fetchFilteredActivities = async () => {

  //   setLoading(true);
  //   setErrorMessage(""); // Clear previous error messages
  //   try {
  //     // Prepare filter parameters
  //     const filterParams = new URLSearchParams();
  //     if (filterCategory) {
  //       filterParams.append("Category", filterCategory);
  //     }
  //     if (filterDate) {
  //       filterParams.append("date", filterDate);
  //     }
  //     if (minBudget) {
  //       filterParams.append("minBudget", minBudget);
  //     }
  //     if (maxBudget) {
  //       filterParams.append("maxBudget", maxBudget);
  //     }
  //     if (filterRating) {
  //       filterParams.append("rating", filterRating);
  //     }



  //     // Fetch activities from the server
  //     const response = await fetch(
  //       `http://localhost:8000/filterActivities?${filterParams.toString()}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();

  //       // Filter out inappropriate activities
  //       const filteredActivities = data.filter(
  //         (activity) => !activity.FlagInappropriate
  //       );
  //       console.log(
  //         filteredActivities
  //       );

  //       setActivities(filteredActivities);
  //       setErrorMessage("");
  //       setFiltersApplied(true); // Mark that filters have been applied
  //     } else {
  //       console.error(
  //         "Failed to fetch activities. HTTP Status:",
  //         response.status
  //       );
  //       setErrorMessage("Failed to fetch activities");
  //     }
  //   } catch (error) {
  //     console.error("Error occurred while fetching activities:", error);
  //     setErrorMessage("An error occurred while fetching activities");
  //   } finally {
  //     console.log("Fetch process completed.");
  //     setLoading(false);
  //   }
  // };

  const fetchFilteredActivities = async () => {
    setLoading(true);
    setErrorMessage(''); // Clear previous error messages

    try {
      // Fetch all upcoming activities first
      const response = await fetch('http://localhost:8000/viewAllUpcomingActivitiesTourist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json(); // Get all upcoming activities

        // Filter out inappropriate activities
        let filteredActivities = data.filter(activity => !activity.FlagInappropriate);

        // Apply additional filters if specified

        // Filter by category
        if (filterCategory) {
          filteredActivities = filteredActivities.filter(activity =>
            activity.Category.toLowerCase().includes(filterCategory.toLowerCase())
          );
        }

        // Filter by date (if provided)
        if (filterDate) {
          const filterDateObj = new Date(filterDate);
          filteredActivities = filteredActivities.filter(activity => {
            const activityDate = new Date(activity.date);
            return activityDate.toDateString() === filterDateObj.toDateString();
          });
        }

        // Filter by budget range (if provided)
        if (minBudget || maxBudget) {
          filteredActivities = filteredActivities.filter(activity => {
            const activityPrice = activity.price;
            const isWithinBudget = (!minBudget || activityPrice >= minBudget) &&
              (!maxBudget || activityPrice <= maxBudget);
            return isWithinBudget;
          });
        }

        // Filter by rating (if provided)
        if (filterRating) {
          filteredActivities = filteredActivities.filter(activity =>
            activity.rating >= filterRating
          );
        }

        // Update the UI with filtered activities
        setActivities(filteredActivities);
        setErrorMessage(''); // Clear any previous error messages
        setFiltersApplied(true); // Mark that filters have been applied
      } else {
        console.error('Failed to fetch activities. HTTP Status:', response.status);
        setErrorMessage('Failed to fetch upcoming activities');
        setActivities([]); // Ensure activities list is empty
      }
    } catch (error) {
      console.error('Error occurred while fetching activities:', error);
      setErrorMessage('An error occurred while fetching activities');
      setActivities([]); // Ensure activities list is empty
    } finally {
      console.log('Fetch process completed.');
      setLoading(false); // Hide loading state
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
    if (localStorage.getItem('context') === 'guest') {
      alert('Please login to bookmark activity');
      return;
    }
    try {
      // Check if the activity is already bookmarked
      if (bookmarkedActivities.some((activity) => activity._id === activityId)) {
        alert('You have already bookmarked this activity!');
        return; // Exit the function to prevent further execution
      }

      // Call the API to bookmark the activity
      const response = await axios.post(
        'http://localhost:8000/bookmarkEvent',
        { eventId: activityId },
        { params: { Username: username } }
      );

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
    setIsModalOpen(false); // Close modal after applying filters

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
          await navigator.clipboard.writeText(data.link); // Copy link to clipboard
          setCopySuccess((prev) => ({ ...prev, [activity._id]: 'Link copied to clipboard!' })); // Set success message for the specific museum
        } else if (shareMethod === 'email') {
          setEmail(''); // Reset the email state

          alert('Link sent to the specified email!');
        }
      } else {
        console.error('Failed to generate shareable link');
      }
    } catch (error) {
      console.error('Error generating shareable link:', error);
    }
  };
  const handleViewDetails = (activity) => {
    // Assuming you have a route like "/activity-details/:id"
    navigate(`/activity-details/${activity._id}`);
  };
  const handleEmailInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleShareMode = (activity) => {
    setActivityToShare(activity);
    setIsEmailMode(!isEmailMode);
    setShowEmailInput(true);

  };



  const bookActivity = async (activityName) => {
    const username = localStorage.getItem('Username');
    if (localStorage.getItem('context') === 'guest') {
      alert('Please login to book activity');
      return;
    }

    if (!username) {
      alert("Please log in first");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/bookActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: activityName, Username: username }), // Ensure 'Username' is correct
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }

      const data = await response.json();

      // Ensure 'data.price' exists before navigating
      if (data.price) {
        // Navigate to the payment page with price as the query parameter
        navigate(`/payment?amount=${data.price}`, { state: { from: '/activities' } });
        setErrorMessage(''); // Clear any previous error messages
      } else {
        throw new Error('Invalid response from server');
      }
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
          username: localStorage.getItem('Username'),
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
    } else {
      console.error('Unknown context');
      navigate('/'); // Fallback to home
    }
  };
  return (
    <div>
      <div style={styles.container2}>
        {/* Background Section */}
        <div style={styles.background}>
          <h1 style={styles.title}>Find Things to Do Anywhere</h1>
          {/* Search Section */}
          <div style={styles.searchSection}>
            <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, category, or tag"
                style={styles.searchInput}
              />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                style={styles.searchSelect}
              >
                <option value="name">Name</option>
                <option value="Category">Category</option>
                <option value="tags">Tag</option>
              </select>
              <button type="submit" style={styles.searchButton}>
                <FaSearch style={styles.searchIcon} />
              </button>
            </form>
          </div>

        </div>



      </div>

      <div style={styles.container}>
        <header style={styles.header}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h2 style={styles.title}>Activities</h2>


          <button
            style={{
              ...styles.navigationButton,
              position: 'absolute',
              left: '1440px', // Moves the bookmark button 20px from the right edge
            }}
            onClick={() => localStorage.getItem('context') === 'guest' ? alert("please login to access bookmarks") : navigate('/BookmarkedEvents')}
          >
            <FaBookmark style={{ fontSize: '20px', color: '#FFD700', marginBottom: '5px' }} />
          </button>


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

        {loading ? (
          <p style={styles.loading}>Loading activities...</p>
        ) : (
          <>

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
              <div style={styles.item} onClick={() => handleProfileRedirect()}>
                <FaUserCircle style={styles.icon} />
                <span className="label" style={styles.label}>
                  Home Page
                </span>
              </div>
              <div style={styles.item} onClick={() => navigate('/historical-locations')}>
                <FaUniversity style={styles.icon} />
                <span className="label" style={styles.label}>
                  Historical Sites
                </span>
              </div>
              <div style={styles.item} onClick={() => navigate('/museums')}>
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

            </div>

       {/* Button to Open Modal */}
<button
  onClick={() => setIsModalOpen(true)}
  style={{
    fontSize: '14px',
    padding: '10px 20px',
    borderRadius: '10px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }}
>
  <DisplaySettingsIcon /> Choose Filters
</button>

{/* Modal */}
{isModalOpen && (
  <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      {/* Modal Header */}
      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>
          <FaSort style={{ marginRight: '10px' }} /> Sorting & Filtering
        </h2>
        <button
          onClick={() => setIsModalOpen(false)}
          style={styles.closeButton}
        >
          <FaTimes />
        </button>
      </div>

      {/* Sorting Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Sort Activities</h3>
        <div style={styles.buttonGroup}>
          <button onClick={() => console.log('PASC & RASC')} style={styles.sortButton}>
            Price Ascending & Rating Ascending
          </button>
          <button onClick={() => console.log('PASC & RDSC')} style={styles.sortButton}>
            Price Ascending & Rating Descending
          </button>
          <button onClick={() => console.log('PDSC & RASC')} style={styles.sortButton}>
            Price Descending & Rating Ascending
          </button>
          <button onClick={() => console.log('PDSC & RDSC')} style={styles.sortButton}>
            Price Descending & Rating Descending
          </button>
        </div>
      </div>

      {/* Filter Form */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Filter Activities</h3>
        <form onSubmit={handleFilterSubmit} style={styles.filterForm}>
          <div style={styles.formGroup}>
            <label style={styles.labell}>
              Category:
              <input
                type="text"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                placeholder="e.g., Adventure"
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.labell}>
              Date:
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.labell}>
              Min Budget:
              <input
                type="number"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                placeholder="Minimum Price"
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.labell}>
              Max Budget:
              <input
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="Maximum Price"
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.labell}>
              Minimum Rating:
              <input
                type="number"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                placeholder="1-5"
                min="1"
                max="5"
                style={styles.input}
              />
            </label>
          </div>
          <button type="submit" style={styles.submitButton}>Apply Filters</button>
        </form>
      </div>
    </div>
  </div>
)}



            {/* Error Message */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {/* Activities List */}
            {activities.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      padding: '20px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease',
                      overflow: 'visible',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.15)';
                      e.currentTarget.style.borderColor = '#0F5132';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = '#ddd';
                    }}
                  >







                    <div>
                      {/* Share Button */}
                      <button
                        onClick={() => handleShareMode(activity)}
                        style={{
                          position: 'absolute', // Ensure it's at the top-right corner
                          top: '10px',
                          right: '10px',
                          background: 'none', // No background
                          border: 'none', // Remove border
                          cursor: 'pointer', // Change cursor to pointer
                          fontSize: '20px', // Size of the icon
                          color: '#0F5132', // Icon color
                        }}
                      >
                        <IosShareIcon />
                      </button>
                      <button
                        onClick={() => handleShareMode(activity)}
                        style={styles.shareOption}
                      >
                        <i className="fas fa-share-alt" style={styles.shareOptionIcon}></i>
                      </button>

                      {/* Share Dropdown */}
                      {isEmailMode && activityToShare && activityToShare._id === activity._id && (
                        <div style={styles.shareDropdown}>
                          <button
                            onClick={() => handleShare(activity, 'copy')}
                            style={styles.shareOption}
                          >
                            <FiCopy style={styles.shareOptionIcon} /> Copy Link
                          </button>
                          <button
                            onClick={() => setIsEmailMode(false)}
                            style={styles.shareOption}
                          >
                            <MailOutlineIcon style={styles.shareOptionIcon} /> Share via Email
                          </button>
                          {showEmailInput && activityToShare && activityToShare._id === activity._id && (
                            <div style={{ marginTop: '10px' }}>
                              <input
                                type="email"
                                placeholder="Enter recipient's email"
                                value={email}
                                onChange={handleEmailInputChange}
                                style={styles.emailInput}
                              />
                              <button
                                onClick={() => handleShare(activity, 'email')}
                                style={{ ...styles.button, marginTop: '10px' }}
                              >
                                Send Email
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                        {activity.name}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                        <strong><FaMapMarkerAlt />Location:</strong> {activity.location}
                      </p>
                      <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                        <strong><FaCalendar /> Date:</strong>{' '}
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                        <strong><FaDollarSign /> Price:</strong> {(activity.price * conversionRate).toFixed(2)}{' '}
                        {selectedCurrency}
                      </p>
                      <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                        <strong>Booking Open:</strong> {activity.bookingOpen ? 'Yes' : 'No'}
                        {!activity.bookingOpen && (
                              <>
                          <FaBell
                            style={styles.bellIcon}
                            onClick={() => handleNotificationRequest(activity._id)}
                                 data-tooltip-id="booking-bookings-tooltip"
                          />
                          <ReactTooltip id="booking-bookings-tooltip" content="Booking closed. Click to be notified." />
                          </>
                        )}
                      </p>

  

                    </div>
                    <a
                      href="#"
                      onClick={() => navigate(`/activities/${encodeURIComponent(activity.name)}`)}
                      style={styles.activityDetailsLink}
                    >
                      {expandedActivities[activity._id] ? 'Hide Activity Details' : 'View Activity Details'}
                    </a>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <button
                        onClick={() => bookActivity(activity.name)}
                        style={{
                          backgroundColor: '#0F5132',
                          color: '#fff',
                          padding: '10px 16px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          //flex: 1, // Adjust the button to take up space proportionally
                        }}
                      >
                        Book
                      </button>
                      {/* Bookmark Button */}
                      <button
                        onClick={() => handleBookmarkToggle(activity._id)} // Toggle bookmark for the current activity
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '24px',
                          marginRight: '70px', // Add space between the buttons
                        }}
                        title={bookmarkedActivities.some((item) => item._id === activity._id) ? 'Remove Bookmark' : 'Add Bookmark'}
                      >
                        {bookmarkedActivities.some((item) => item._id === activity._id) ? (
                          <FaBookmark style={{ color: '#FFD700' }} /> // Filled icon with color (yellow)
                        ) : (
                          <FaRegBookmark style={{ color: '#000' }} /> // Outline icon
                        )}
                      </button>

                      {/* Display Average Rating */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px' }}>
                        <span style={styles.stars}>
                          {'★'.repeat(Math.floor(activity.rating || 0)) + '☆'.repeat(5 - Math.floor(activity.rating || 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No activities found.</p>
            )}



          </>

        )}
      </div>
    </div>
  );
}

const styles = {
  container2: {
    marginTop: '60px',
    fontFamily: 'Arial, sans-serif',
  },
  background: {
    position: 'relative',
    backgroundImage: `url(${activity})`, // Replace with your image path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '400px', // Adjust height as needed
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  },
  searchSection: {
    display: 'flex',
    justifyContent: 'center', // Center the search section
    marginTop: '20px', // Add spacing above the search bar
  },

  searchForm: {
    display: 'flex',
    alignItems: 'center', // Align input, select, and button vertically
    gap: '10px', // Add spacing between elements
    width: '80%', // Adjust the width of the entire search form
    maxWidth: '1200px', // Ensure responsiveness
  },

  searchInput: {
    flex: 1, // Expand the input field to take available space
    padding: '12px 100px',
    fontSize: '13px',
    borderRadius: '30px',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    outline: 'none',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  },

  searchSelect: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '30px',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    outline: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },

  searchButton: {
    padding: '12px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    display: 'flex', // Align icon inside the button
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchIcon: {
    fontSize: '18px', // Adjust the size of the search icon
  },


  section: {
    margin: '20px auto',
    width: '80%',
    maxWidth: '1200px',
    textAlign: 'center',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  currencySelector: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px", // Space between the globe icon and the dropdown
    marginRight: "70px"
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

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
    fontSize: '12px'
  },
  activityDetailsLink: {
    display: 'inline-block',
    color: '#0F5132', // Blue color for hyperlink
    textDecoration: 'underline', // Underline for hyperlink
    cursor: 'pointer', // Pointer cursor
    fontSize: '14px', // Adjust font size as needed
    marginTop: '10px', // Add spacing above the link
  },
  shareButtonTopRight: {
    position: 'absolute', // Positions the button absolutely inside the container
    top: '20px', // Distance from the top
    right: '10px', // Distance from the right
    left: '1000px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    color: 'black',
    cursor: 'pointer',
  },

  navigationButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
  },
  header: {
    height: '60px',
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
    height: '60px',
    width: '70px',
    borderRadius: '10px',
    marginRight: '10px',
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    alignItems: 'center', // Ensure alignment across buttons
  },
  bookmarkButton: {

    backgroundColor: 'transparent', // Transparent background to match others
    border: 'none', // Remove default button border
    cursor: 'pointer', // Pointer cursor for interactivity
    padding: '0', // Remove default padding
    display: 'flex', // Flexbox for proper alignment
    alignItems: 'center', // Vertically align the icon
    justifyContent: 'center',
  },
  bookmarkIcon: {
    fontSize: '30px', // Match the size of other icons or adjust as needed
    color: '#FFD700', // Gold color for bookmark icon
  },
  item: {

    padding: '10px 0',

  },

  title: {
    fontSize: '24px',
    color: 'white',
    marginLeft: '40px'
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
    color: '#0F5132',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },

  details: {
    marginTop: '10px',
    paddingLeft: '20px',
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

  shareButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    color: 'black',
    cursor: 'pointer',
    padding: '0px',


  },
  shareDropdown: {
    position: 'absolute',
    top: '60px',
    right: '10px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    width: '200px',
  },

  shareOption: {
    display: 'flex',
    alignItems: 'center', // Align icon and text vertically
    justifyContent: 'flex-start', // Align icon and text to the left
    width: '100%',
    padding: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: 'black', // Icon and text color
    textDecoration: 'none',
  },
  shareOptionIcon: {
    marginRight: '8px', // Space between the icon and text
    fontSize: '1rem', // Ensure both icons are the same size
  },
  emailInput: {
    padding: '8px',
    fontSize: '14px',
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  button: {
    backgroundColor: '#0F5132',
    color: 'white',
    border: 'none',
    padding: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '10px',
  },

  topSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative', // To allow absolute positioning of share button
  },
  ratingContainer: {
    display: 'flex',
    flexDirection: 'row', // Align stars and label horizontally
    alignItems: 'center', // Center vertically with the share button
    marginBottom: '10px', // Add space between rating and share button
  },
  stars: {

    fontSize: '24px', // Adjust size for better visibility
    color: '#FFD700',
    marginRight: '8px', // Space between stars and the rating text
  },
  ratingLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
  },


  commentsSection: {
    marginTop: '13px',
  },
  commentsContainer: {
    maxHeight: '120px',
    overflowY: 'auto',
    border: '1px solid #eee',
    borderRadius: '4px',
    padding: '1px',
    backgroundColor: '#f9f9f9',
  },
  commentItem: {

    marginBottom: '10px',
  },
  commentDate: {
    fontSize: '12px',
    color: '#888',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    borderRadius: '100px',
    padding: '10px 14px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
    marginBottom: '20px',
    paddingBottom: '10px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    color: '#333',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#666',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0F5132',
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sortButton: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#0F5132',
    cursor: 'pointer',
    fontSize: '14px',
  },
  filterForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  labell: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
  },
  submitButton: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#0F5132',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center',
  },
};
export default Activities;
