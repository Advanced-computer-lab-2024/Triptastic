import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const HistoricalDetail = () => {
  const { Name } = useParams(); // Get the historical name from the URL parameters
  console.log("Historical Name:", Name); // Log the name to see if it's undefined
  const [historical, setHistorical] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchHistorical = async () => {
      try {
        const response = await fetch(`http://localhost:8000/gethistoricalDetails/${encodeURIComponent(Name)}`);
        if (!response.ok) {
          throw new Error('Historical location not found');
        }
        const data = await response.json();
        setHistorical(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorical();
  }, [Name]);

  if (loading) return <p>Loading historical details...</p>;
  if (errorMessage) return <p style={{ color: 'red' }}>{errorMessage}</p>;
  if (!historical) return <p>No historical location found.</p>;

  return (
    <div>
      <h1>{historical.Name}</h1>
      <p>{historical.Description}</p>
      <p>Location: {historical.Location}</p>
      <p>Opening Hours: {historical.OpeningHours}</p>
      <p>Tourism Governor: {historical.TourismGovernor}</p>
      <div>
        <h3>Ticket Prices:</h3>
        <p>Foreigner: ${historical.TicketPrices?.Foreigner}</p>
        <p>Native: ${historical.TicketPrices?.Native}</p>
        <p>Student: ${historical.TicketPrices?.Student}</p>
      </div>
      <div>
        <h3>Tags:</h3>
        <p>Type: {historical.Tags?.Types || 'N/A'}</p>
        <p>Historical Period: {historical.Tags?.HistoricalPeriod || 'N/A'}</p>
      </div>
      {historical.image && <img src={historical.image} alt={`${historical.Name}`} />}
    </div>
  );
};

export default HistoricalDetail;
