import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedActivities, setExpandedActivities] = useState({});
  const [commentData, setCommentData] = useState({ Username: '', comment: '' });
  const [responseMsg, setResponseMsg] = useState('');

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
        setActivities(data);
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
        setActivities(data);
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
  const fetchSearchedActivities = async () => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append(searchType, searchQuery);

      const response = await fetch(`http://localhost:8000/searchActivities?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch activities');
      }
      setErrorMessage('An error occurred while fetching activities');
      //console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleCommentSubmit = async (e, activity) => {
    const Username = localStorage.getItem('Username'); 
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/commentOnActivity?Username=${Username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: activity.name,
          //Username: Username,
          comment: commentData.comment,
        }),
      });
  
      console.log('Status:', response.status); // Log the status code
      const data = await response.json();
      console.log('Response Data:', data); // Log the response data
  
      if (response.ok) {
        setResponseMsg(data.msg);
        setCommentData({ comment: '' });
      } else {
        console.error('Error message:', data.error); // Log the error from the backend
        throw new Error('Failed to submit comment');
      }
    } catch (error) {
      setResponseMsg('Failed to submit comment');
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
  }, []);

  return (
    <div>
      <h2>Activities</h2>

      {loading ? (
        <p>Loading activities...</p>
      ) : (
        <>
          {/* Sorting Buttons */}
          <div>
            <h3>Sort Activities</h3>
            <button onClick={() => handleSort('PASC', 'RASC')}>Price Asc & Rating Asc</button>
            <button onClick={() => handleSort('PASC', 'RDSC')}>Price Asc & Rating Desc</button>
            <button onClick={() => handleSort('PDSC', 'RASC')}>Price Desc & Rating Asc</button>
            <button onClick={() => handleSort('PDSC', 'RDSC')}>Price Desc & Rating Desc</button>
          </div>

          {/* Filter Form */}
          <div>
            <h3>Filter Activities</h3>
            <form onSubmit={handleFilterSubmit}>
              <div>
                <label>
                  Category:
                  <input
                    type="text"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    placeholder="e.g., Adventure"
                  />
                </label>
              </div>
              <div>
                <label>
                  Date:
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Min Budget:
                  <input
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    placeholder="Minimum Price"
                  />
                </label>
              </div>
              <div>
                <label>
                  Max Budget:
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="Maximum Price"
                  />
                </label>
              </div>
              <div>
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
              </div>
              <button type="submit">Apply Filters</button>
            </form>
          </div>

          {/* Search Form */}
          <div>
            <h3>Search Activities</h3>
            <form onSubmit={handleSearchSubmit}>
              <div>
                <label>
                  Search Query:
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, category, or tag"
                  />
                </label>
              </div>
              <div>
                <label>
                  Search By:
                  <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="Category">Category</option>
                    <option value="tags">Tag</option>
                  </select>
                </label>
              </div>
              <button type="submit">Search</button>
            </form>
          </div>

          {/* Error Message */}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          {/* Activities List */}
          {activities.length > 0 ? (
            <ul>
              {activities.map((activity) => (
                <li key={activity._id}>
                  <strong>Name:</strong> {activity.name} <br />
                  <strong>Price:</strong> ${activity.price} <br />
                  <strong>Rating:</strong> {activity.rating} <br />
                  {/* Button to toggle activity details */}
                  <button onClick={() => toggleActivityDetails(activity._id)}>
                    {expandedActivities[activity._id] ? 'Hide Activity Details' : 'View Activity Details'}
                  </button>
                  {/* Show details if expanded */}
                  {expandedActivities[activity._id] && (
                    <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
                      <p><strong>Category:</strong> {activity.Category}</p>
                      <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {activity.time}</p>
                      <p><strong>Location:</strong> {activity.location}</p>
                      <p><strong>Tags:</strong> {activity.tags.join(', ')}</p>
                      <p><strong>Special Discounts:</strong> {activity.specialDiscounts}</p>
                      <p><strong>Booking Open:</strong> {activity.bookingOpen ? 'Yes' : 'No'}</p>
                      <p><strong>Advertiser:</strong> {activity.Advertiser}</p>
                       {/* Comments section */}
                      <div>
                        <h4>Comments</h4>
                        <ul>
                          {activity.comments.map((comment, index) => (
                            <li key={index}><strong>{comment.Username}:</strong> {comment.comment}</li>
                          ))}
                        </ul>

                        {/* Comment form */}
                        <form onSubmit={(e) => handleCommentSubmit(e, activity)}>
                          <textarea
                            value={commentData.comment}
                            onChange={(e) => setCommentData({ comment: e.target.value })}
                            placeholder="Leave a comment"
                            required
                          />
                          <button type="submit">Submit Comment</button>
                        </form>
                        {responseMsg && <p>{responseMsg}</p>}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No activities found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Activities;
