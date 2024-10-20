import React, { useState, useEffect } from 'react'; 

const Museums = () => {
  const [museums, setMuseums] = useState([]);
  const [historicalPeriods, setHistoricalPeriods] = useState([]); 
  const [selectedPeriod, setSelectedPeriod] = useState(''); 
  const [viewMuseums, setViewMuseums] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [shareableLink, setShareableLink] = useState('');
  const [copySuccess, setCopySuccess] = useState({});

  // Fetch museums from the backend
  const handleViewAllMuseums = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/viewAllMuseumsTourist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMuseums(data); 
    } catch (error) {
      console.error('Error fetching museums:', error);
    } finally {
      setLoading(false);
      setViewMuseums(true); 
    }
  };

  // Fetch unique historical periods from the backend
  const fetchHistoricalPeriods = async () => {
    try {
      const response = await fetch('http://localhost:8000/getUniqueHistoricalPeriods', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setHistoricalPeriods(data); 
    } catch (error) {
      console.error('Error fetching historical periods:', error);
    }
  };

  // Handle filtering museums by historical period
  const handleFilterMuseums = async () => {
    if (!selectedPeriod) return; 

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/filterMuseumsByTagsTourist?Tags=${selectedPeriod}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMuseums(data); 
    } catch (error) {
      console.error('Error filtering museums:', error);
    } finally {
      setLoading(false);
    }
  };

  // New function to search for museums
  const handleSearchMuseums = async () => {
    if (!searchTerm) return; // Do nothing if search term is empty

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/searchMuseums?name=${searchTerm}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMuseums(data); // Update museums based on the search results
    } catch (error) {
      console.error('Error searching museums:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch historical periods when the component mounts
  useEffect(() => {
    fetchHistoricalPeriods();
  }, []);
  const handleShare = async (museumName) => {
    try {
      const response = await fetch(`http://localhost:8000/shareMuseum/${museumName}`);
      const data = await response.json();

      if (response.ok) {
        await navigator.clipboard.writeText(data.link); // Copy link to clipboard
        setCopySuccess((prev) => ({ ...prev, [museumName]: 'Link copied to clipboard!' })); // Set success message for the specific museum
      } else {
        console.error("Failed to generate shareable link");
      }
    } catch (error) {
      console.error("Error generating shareable link:", error);
    }
  };
  return (
    <div>
      <h1>Museums</h1>
      <button onClick={handleViewAllMuseums}>View All Museums</button>

      <input
        type="text"
        placeholder="Search museums..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearchMuseums} disabled={!searchTerm}>Search</button>

      {viewMuseums && (
        <>
          <button onClick={() => setFilterVisible(!filterVisible)}>Filter Museums</button>

          {filterVisible && (
            <div>
              <label htmlFor="period-select">Filter by Historical Period:</label>
              <select
                id="period-select"
                onChange={(e) => setSelectedPeriod(e.target.value)}
                value={selectedPeriod}
              >
                <option value="" disabled>Select a historical period</option>
                {historicalPeriods.map((period) => (
                  <option key={period.name} value={period.name}>{period.name}</option>
                ))}
              </select>
              <button onClick={handleFilterMuseums} disabled={!selectedPeriod}>Apply Filter</button>
            </div>
          )}

{loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
            {museums.map((museum) => (
              <li key={museum._id}>
                {museum.Name}
                <button onClick={() => handleShare(museum.Name)}>Share</button>
                {/* Display success message for this specific museum */}
                {copySuccess[museum.Name] && <span style={{ color: 'green', marginLeft: '10px' }}>{copySuccess[museum.Name]}</span>}
              </li>
            ))}
          </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Museums;
