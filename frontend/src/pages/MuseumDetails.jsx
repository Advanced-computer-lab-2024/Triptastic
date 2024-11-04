import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MuseumDetail = () => {
  const { Name } = useParams(); // Get the museum name from the URL parameters
  console.log("Museum Name:", Name); // Log the name to see if it's undefined
  const [museum, setMuseum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMuseum = async () => {
      try {
        const response = await fetch(`http://localhost:8000/getMuseumDetails/${encodeURIComponent(Name)}`);
        if (!response.ok) {
          throw new Error('Museum not found');
        }
        const data = await response.json();
        setMuseum(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMuseum();
  }, [Name]);

  if (loading) return <p>Loading museum details...</p>;
  if (errorMessage) return <p style={{ color: 'red' }}>{errorMessage}</p>;
  if (!museum) return <p>No museum found.</p>;

  return (
    <div>
      <h1>{museum.Name}</h1>
      <p>{museum.Description}</p>
      <p>Location: {museum.Location}</p>
      <p>Opening Hours: {museum.OpeningHours}</p>
      <p>Tourism Governor: {museum.TourismGovernor}</p>
      <div>
        <h3>Ticket Prices:</h3>
        <p>Foreigner: ${museum.TicketPrices?.Foreigner}</p>
        <p>Native: ${museum.TicketPrices?.Native}</p>
        <p>Student: ${museum.TicketPrices?.Student}</p>
      </div>
      <div>
        <h3>Tags:</h3>
        <p>Historical Period: {museum.Tags?.HistoricalPeriod || 'N/A'}</p>
      </div>
      {museum.image && <img src={museum.image} alt={`${museum.Name}`} />}
    </div>
  );
};

export default MuseumDetail;
