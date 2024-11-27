import React, { useState, useEffect, useContext } from 'react';
const GuideReport = () => {
const [Itineraries, setItineraries] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [totalSales, setTotalSales] = useState(0);
const [refresh, setRefresh] = useState(false);
const [mostSold, setMostSold] = useState();
const [leastSold, setLeastSold] = useState();
const [date, setDate] = useState('');
const [filtered,setFiltered]=useState(false);

const fetchItineraries = async () => {
    const Username = localStorage.getItem('Username');
    setIsLoading(true);
    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getMyItineraries?Username=${Username}`);
        if (response.ok) {
          const data = await response.json();
          setItineraries(data);
            setIsLoading(false);
        } else {
          throw new Error('Failed to fetch itineraries');
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    }
  };
  const calculateTotalSales = (itineraries) => {
    const total = itineraries.reduce((sum, itinerary) => sum + itinerary.sales, 0);
    setTotalSales(total);
  };
  const findMostSold = (itineraries) => {
    if (itineraries.length > 0) {
      const mostSoldItinerary = itineraries.reduce((max, itinerary) => (itinerary.sales > max.sales ? itinerary : max), itineraries[0]);
      setMostSold(mostSoldItinerary);
    }
  };

  const findLeastSold = (itineraries) => {
    if (itineraries.length > 0) {
      const leastSoldItinerary = itineraries.reduce((min, itinerary) => (itinerary.sales < min.sales ? itinerary : min), itineraries[0]);
      setLeastSold(leastSoldItinerary);
    }
  };
  useEffect(() => {
    fetchItineraries()
    calculateTotalSales(Itineraries);
    findMostSold(Itineraries);
    findLeastSold(Itineraries);
  }, [refresh,filtered]);
  return (
 <div>
    <div>
      <h1>{localStorage.getItem('Username')}'s sales report</h1>
        <button onClick={() => setRefresh(!refresh)}>Refresh</button>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
        <button onClick={() => setFiltered(!filtered)}>{filtered? "Clear filter":"Filter"}</button>
        <h2>Total profit from sales: {totalSales}</h2>
        <h3>Most sold itinerary</h3>
        {!isLoading && mostSold && (
          <div>
            <p>Locations: {mostSold.Locations.join(', ')}</p>
            <p>Price: {mostSold.Price}</p>
            <p>Sales: {mostSold.sales}</p>
            <p>Times booked:{mostSold.sales==0? 0:mostSold.sales/mostSold.Price} </p>
          </div>
        )}
        <h3>Least sold itinerary</h3>
        {!isLoading && leastSold && (
          <div>
            <p>Locations: {leastSold.Locations.join(', ')}</p>
            <p>Price: {leastSold.Price}</p>
            <p>Sales: {leastSold.sales}</p>
            <p>Times booked:{leastSold.sales==0? 0:leastSold.sales/leastSold.Price} </p>
          </div>
        )} 
    </div>
    <div>
        <h3>All itineraries</h3>
         {isLoading && <p>Loading...</p>}
        {!isLoading && Itineraries.length > 0 ? (
          Itineraries.map((Itinerary) => (
            <div key={Itinerary._id}>
              <p>Locations: {Itinerary.Locations.join(', ')}</p>
              <p>Price: {Itinerary.Price}</p>
              <p>Sales: {Itinerary.sales}</p>
              <p>Times booked:{Itinerary.sales==0? 0:Itinerary.sales/Itinerary.Price} </p>
            </div>
          ))
        ) : (
          <p>No itineraries found.</p>
        )}

    </div>
</div>
  );
}
export default GuideReport;