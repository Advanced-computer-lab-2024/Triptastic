import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TourGuideProfile() {
    const [itineraries, setItineraries] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getMyItineraries = async () => {
        const Username = localStorage.getItem('Username');
        // Retrieve the username from local storage
        console.log('Fetched username:', Username);
        if (!Username) {
            setError('Username not found. Please log in again.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/getMyItineraries?Username=${Username}`);
            if (!response.ok) {
                throw new Error('Failed to fetch itineraries');
            }
            const data = await response.json();
            console.log('Fetched itineraries:', data);
            setItineraries(data);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Tour Guide Profile</h2>
            <button onClick={getMyItineraries}>View My Created Itineraries</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {itineraries.length > 0 && (
                <div>
                    <h3>My Itineraries</h3>
                    <ul>
                        {itineraries.map((itinerary) => (
                            <li key={itinerary._id}>
                                <strong>
                                    {itinerary.Activities.length > 0 
                                        ? itinerary.Activities.join(', ') 
                                        : 'No Activities'}
                                </strong> - 
                                <span>
                                    {itinerary.Locations.length > 0 
                                        ? `Locations: ${itinerary.Locations.join(', ')}`
                                        : 'No Locations'}
                                </span> - 
                                Price: ${itinerary.Price} - 
                                Date: {new Date(itinerary.DatesTimes).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default TourGuideProfile;
