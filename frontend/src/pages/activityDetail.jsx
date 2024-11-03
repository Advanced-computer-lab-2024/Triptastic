import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ActivityDetail = () => {
  const { name } = useParams(); // Get the activity name from the URL parameters
  console.log("Activity Name:", name); // Log the name to see if it's undefined
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`http://localhost:8000/getActivityToShare/${encodeURIComponent(name)}`);
        if (!response.ok) {
          throw new Error('Activity not found');
        }
        const data = await response.json();
        setActivity(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [name]); // Change dependency to name

  if (loading) return <p>Loading activity details...</p>;
  if (errorMessage) return <p style={{ color: 'red' }}>{errorMessage}</p>;
  if (!activity) return <p>No activity found.</p>;

  return (
    <div>
      <h1>{activity.name}</h1>
      <p>{activity.description}</p>
      <p>Price: ${activity.price}</p>
      <p>Duration: {activity.duration} hours</p>
      <p>Category: {activity.Category}</p>
      <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
      <p>Location: {activity.location}</p>
      <p>Tags: {activity.tags ? activity.tags.join(', ') : 'No tags available'}</p>
      {/* Add any other details you want to display */}
    </div>
  );
};

export default ActivityDetail;
