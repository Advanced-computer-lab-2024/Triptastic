import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ItineraryDetail = () => {
  const { id } = useParams(); // Get the itinerary ID from the URL parameters
  console.log("ID:", id); // Log the ID to ensure it's not undefined
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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
      {itinerary.PreferenceTag && <p><strong>Preference Tag:</strong> {itinerary.PreferenceTag}</p>}
      <p><strong>Flag Inappropriate:</strong> {itinerary.FlagInappropriate ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default ItineraryDetail;
