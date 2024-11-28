import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ItineraryDetail = () => {
  const { id } = useParams(); // Get the itinerary ID from the URL parameters
  console.log("ID:", id); // Log the ID to ensure it's not undefined
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [newFeedback, setNewFeedback] = useState({ rating: '', comment: '' });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch(`http://localhost:8000/getItinerary/${encodeURIComponent(id)}`);
        if (!response.ok) {
          throw new Error('Itinerary not found');
        }
        const data = await response.json();
        setItinerary(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]); // Change dependency to id

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback(prevFeedback => ({
      ...prevFeedback,
      [name]: value
    }));
  };

  const submitFeedback = async () => {
    if (!newFeedback.rating) {
      setErrorMessage("Rating is required.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/submitFeedback/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeedback),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      setFeedbackSubmitted(true);
      setNewFeedback({ rating: '', comment: '' }); // Reset feedback form
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (loading) return <p>Loading itinerary details...</p>;
  if (errorMessage) return <p style={{ color: 'red' }}>{errorMessage}</p>;
  if (!itinerary) return <p>No itinerary found.</p>;

  return (
    <div>
      <h1>Itinerary Details</h1>
      <p><strong>Activities:</strong> {itinerary.Activities.join(', ')}</p>
      <p><strong>Locations:</strong> {itinerary.Locations.join(', ')}</p>
      <p><strong>Timeline:</strong> {itinerary.Timeline}</p>
      <p><strong>Duration of Activity:</strong> {itinerary.DurationOfActivity}</p>
      <p><strong>Language:</strong> {itinerary.Language}</p>
      <p><strong>Price:</strong> ${itinerary.Price}</p>
      <p><strong>Dates & Times:</strong> {new Date(itinerary.DatesTimes).toLocaleString()}</p>
      <p><strong>Accessibility:</strong> {itinerary.Accesibility}</p>
      <p><strong>Pick Up/Drop Off:</strong> {itinerary.pickUpDropOff}</p>
      <p><strong>Booked:</strong> {itinerary.Booked ? 'Yes' : 'No'}</p>
      <p><strong>Tour Guide:</strong> {itinerary.TourGuide}</p>
      <p><strong>Feedback:</strong> {itinerary.feedback.length > 0 ? 
        itinerary.feedback.map((f, idx) => (
          <div key={idx}>
            <p><strong>{f.touristUsername}</strong> rated {f.rating}/5</p>
            {f.comment && <p>{f.comment}</p>}
          </div>
        )) : <p>No feedback yet.</p>}
      </p>

      {/* Feedback Form */}
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <h3>Leave Your Feedback</h3>
        <div>
          <label>
            Rating:
            <select name="rating" value={newFeedback.rating} onChange={handleFeedbackChange} required>
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>{star}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Comment:
            <textarea
              name="comment"
              value={newFeedback.comment}
              onChange={handleFeedbackChange}
              placeholder="Leave a comment (optional)"
              rows="4"
              style={{ width: '100%' }}
            />
          </label>
        </div>
        <button onClick={submitFeedback} style={{ marginTop: '10px' }}>
          Submit Feedback
        </button>
        {feedbackSubmitted && <p style={{ color: 'green' }}>Feedback submitted successfully!</p>}
      </div>

      {itinerary.PreferenceTag && <p><strong>Preference Tag:</strong> {itinerary.PreferenceTag}</p>}
      <p><strong>Flag Inappropriate:</strong> {itinerary.FlagInappropriate ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default ItineraryDetail;
