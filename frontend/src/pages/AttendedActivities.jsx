import React, { useState, useEffect } from 'react';

const AttendedActivitiesPage = () => {
  const [attendedActivities, setAttendedActivities] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('Username') || '');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAttendedActivities();
  }, []);

  const fetchAttendedActivities = async () => {
    const username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/getAttendedActivities?username=${username}`);
      const data = await response.json();
      if (response.ok) {
        setAttendedActivities(data);
      } else {
        setErrorMessage(data.message || 'Failed to fetch attended activities');
      }
    } catch (error) {
      console.error('Error fetching attended activities:', error);
      setErrorMessage('An error occurred while fetching attended activities');
    }
  };

  const handleRateActivity = async (activityName) => {
    try {
      const response = await fetch(`http://localhost:8000/rateActivity?Username=${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: activityName, rating: parseInt(rating, 10) }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Rating submitted successfully');
        setRating('');
        fetchAttendedActivities(); // Refresh activities to see the new rating
      } else {
        setErrorMessage(data.error || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setErrorMessage('Failed to submit rating');
    }
  };
 
  const handleCommentOnActivity = async (activityName) => {
    try {
      const response = await fetch(`http://localhost:8000/commentOnActivity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: activityName, Username: username, comment }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Comment submitted successfully');
        setComment('');
        fetchAttendedActivities(); // Refresh activities to see the new comment
      } else {
        setErrorMessage(data.error || 'Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setErrorMessage('Failed to submit comment');
    }
  };
 


  return (
    <div>
      <h3>Attended Activities</h3>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {attendedActivities.length === 0 ? (
        <p>No attended activities found.</p>
      ) : (
        attendedActivities.map((activity) => (
          <div key={activity._id} className="activity-card">
            <h4>{activity.name}</h4>
            <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {activity.location}</p>
            <p><strong>Category:</strong> {activity.Category}</p>
            <div>
              <label>
                <strong>Rate this activity (1-5):</strong>
              </label>
              <input
                type="number"
                value={selectedActivity === activity.name ? rating : ''}
                onChange={(e) => {
                  setSelectedActivity(activity.name);
                  setRating(e.target.value);
                }}
                min="1"
                max="5"
              />
              <button onClick={() => handleRateActivity(activity.name)}>Submit Rating</button>
            </div>
            <div>
              <label>
                <strong>Comment:</strong>
              </label>
              <textarea
                value={selectedActivity === activity.name ? comment : ''}
                onChange={(e) => {
                  setSelectedActivity(activity.name);
                  setComment(e.target.value);
                }}
              />
              <button onClick={() => handleCommentOnActivity(activity.name)}>Submit Comment</button>
            </div>
            <div>
              <h5>Comments:</h5>
              {activity.comments && activity.comments.length > 0 ? (
                <ul>
                  {activity.comments.map((comm, index) => (
                    <li key={index}>
                      <p><strong>{comm.Username}:</strong> {comm.comment}</p>
                      <p><em>Date: {new Date(comm.commentedAt).toLocaleDateString()}</em></p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AttendedActivitiesPage;
