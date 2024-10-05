import React, { useState, useEffect } from 'react';
const Activites =()=>{
  const [activities, setActivities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedActivities, setExpandedActivities] = useState({});
  const [showUpcomingActivities, setShowUpcomingActivities] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch upcoming activities
  const fetchUpcomingActivities = async () => {
    try {
      const response = await fetch('/api/viewAllUpcomingActivitiesTourist'); // Assuming this is your API route
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await response.json();
      setActivities(data);
      setError(null); // Clear previous error, if any
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchPascRasc= async()=>{
    try{
        const response = await fetch(`http://localhost:8000/sortActPASCRASC`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        if(response.ok){
            const data= await response.json();
            setActivities(data);
            setErrorMessage('')
        }
        else {
            throw new Error('Failed to fetch activities');
          }
    }catch(error){
            setErrorMessage('An error occurred while fetching activities');
            console.error(error);
          } finally {
            setLoading(false);
          }
    }
const handlePascRasc=()=>{
    fetchPascRasc();
}
const handlePascRdsc= async()=>{
    try{
        const response = await fetch(`http://localhost:8000/sortActPASCRDSC`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        if(response.ok){
            const data= await response.json();
            setActivities(data);
            setErrorMessage('')
        }
        else {
            throw new Error('Failed to fetch activities');
          }
    }catch(error){
            setErrorMessage('An error occurred while fetching activities');
            console.error(error);
          } finally {
            setLoading(false);
          }
}
const handlePdscRasc= async()=>{
    try{
        const response = await fetch(`http://localhost:8000/sortActPDSCRASC`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        if(response.ok){
            const data= await response.json();
            setActivities(data);
            setErrorMessage('')
        }
        else {
            throw new Error('Failed to fetch activities');
          }
    }catch(error){
            setErrorMessage('An error occurred while fetching activities');
            console.error(error);
          } finally {
            setLoading(false);
          }
}
const handlePdscRdsc= async()=>{
    try{
        const response = await fetch(`http://localhost:8000/sortActPDSCRDSC`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        if(response.ok){
            const data= await response.json();
            setActivities(data);
            setErrorMessage('')
        }
        else {
            throw new Error('Failed to fetch activities');
          }
    }catch(error){
            setErrorMessage('An error occurred while fetching activities');
            console.error(error);
          } finally {
            setLoading(false);
          }
}
const toggleActivityDetails=(id)=>{
    setExpandedActivities((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
}
useEffect(() => {
    fetchPascRasc(); // Default to ascending sort
  }, []);

  const handleViewUpcomingActivities = () => {
    if (!showUpcomingActivities) {
      fetchUpcomingActivities();
    }
    setShowUpcomingActivities(!showUpcomingActivities);
  };


return(
  
  

<div>

      {/* View All Upcoming Activities button */}
      <div>
        <h3>Upcoming Activities</h3>
        <button onClick={handleViewUpcomingActivities}>
          {showUpcomingActivities ? 'Hide Upcoming Activities' : 'View All Upcoming Activities'}
        </button>

        {/* Conditionally display upcoming activities */}
        {showUpcomingActivities && (
          <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {activities.length > 0 ? (
              <ul>
                {activities.map((activity, index) => (
                  <li key={index}>
                    <h3>{activity.name}</h3>
                    <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                    <p>Price: {activity.price}</p>
                    <p>Rating: {activity.rating}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming activities found</p>
            )}
          </div>
        )}
      </div>
<h2>Activities</h2>

{loading ? (
        <p>Loading activities...</p>
      ) : (
        <>
          <button onClick={handlePascRasc}>Sort by Price asc and rating asc</button>
          <button onClick={handlePascRdsc}>Sort by Price asc and rating dsc</button>
          <button onClick={handlePdscRasc}>Sort by Price dsc and rating asc</button>
          <button onClick={handlePdscRdsc}>Sort by Price dsc and rating dsc</button>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          {activities.length > 0 ? (
            <ul>
              {activities.map((activity) => (
                <li key={activity._id}>
                  <strong>Name:</strong> {activity.name} <br />
                  <strong>Price:</strong> {activity.price} <br />
                  <strong>Rating:</strong> {activity.rating} <br />
                  {/* Button to toggle activity details */}
                  <button onClick={() => toggleActivityDetails(activity._id)}>
                    {expandedActivities[activity._id] ? 'Hide activity Details' : 'View activity Details'}
                  </button>
                  {/* Show details if expanded */}
                  {expandedActivities[activity._id] && (
                    <div>
                      <p><strong>Category:</strong> {activity.Category}</p>
                      <p><strong>Date:</strong> {activity.date}</p>
                      <p><strong>Time:</strong> {activity.time}</p>
                      <p><strong>Location:</strong> {activity.location}</p>
                      <p><strong>Tags:</strong> {activity.tags.join(', ')}</p>
                      <p><strong>Special discounts:</strong> {activity.specialDiscounts}</p>
                      <p><strong>Booking open:</strong> {activity.bookingOpen? 'Yes' : 'No'}</p>
                      <p><strong>Advertiser:</strong> {activity.Advertiser}</p>
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
)
  }
    

export default Activites;