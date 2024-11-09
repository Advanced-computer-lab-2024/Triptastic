import React, { useState } from 'react';

const HistoricalLocations = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [viewPlaces, setViewPlaces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [copySuccess, setCopySuccess] = useState({});
  const [shareableLink, setShareableLink] = useState('');
  const [email, setEmail] = useState('');
  const [HistToShare, setHistToShare] = useState(null);
  const [isEmailMode, setIsEmailMode] = useState(false);
  // Fetch historical places without filter
  const handleViewAllHistoricalPlaces = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('http://localhost:8000/viewAllHistoricalPlacesTourist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'No historical locations found.');
        return;
      }

      let data = await response.json();
      console.log("All Historical Places Response:", data);
      if (!Array.isArray(data)) {
        data = [data];
      }

      setHistoricalPlaces(data);
    } catch (error) {
      console.error('Error fetching historical places:', error);
      setErrorMessage("No historical locations found.");
    } finally {
      setLoading(false);
      setViewPlaces(true);
    }
  };

  // Filter historical places by tag
  const handleFilter = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`http://localhost:8000/filterHistoricalLocationsByTagsTourist?Types=${selectedTag}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'No historical locations found with the specified tag type.');
        return;
      }

      let data = await response.json();
      console.log(`Filter ${selectedTag} Response:`, data);
      if (!Array.isArray(data)) {
        data = [data];
      }

      setHistoricalPlaces(data);
    } 
    catch (error) {
      console.error('Error filtering historical locations:', error);
      setErrorMessage("No historical locations found with the specified tag type.");
    } 
    finally {
      setLoading(false);
    }
  };

  // Search historical places by name or tag
  const handleSearch = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const query = new URLSearchParams();
      if (searchQuery) query.append('name', searchQuery);
      if (selectedTag) query.append('tag', selectedTag);

      const response = await fetch(`http://localhost:8000/searchHistoricalLocations?${query.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'No historical locations found.');
        return;
      }

      let data = await response.json();
      console.log("Search Response:", data);
      if (!Array.isArray(data)) {
        data = [data];
      }

      setHistoricalPlaces(data);
    } catch (error) {
      console.error('Error searching historical places:', error);
      setErrorMessage('No historical locations found.');
    } finally {
      setLoading(false);
    }
  };

  const renderHistoricalPlaces = () => {
    return historicalPlaces.length > 0 ? (
      historicalPlaces.map(place => <li key={place._id}>{place.Name}</li>)
    ) : (
      <li>No historical places found.</li>
    );
  };
  const handleShare = async (historicallocation, shareMethod) => {
    try {
      // Format the request URL to match the backend route
     
      const response = await fetch(`http://localhost:8000/shareHistorical/${encodeURIComponent(historicallocation.Name)}`, {
        method: 'POST', // Use POST to match the backend's expectations
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: shareMethod === 'email' ? email : '' // Only include email if method is 'email'
        })
      });
      const data = await response.json();
  
      if (response.ok) {
        setShareableLink(data.link);  // Set the link to state
        if (shareMethod === 'copy') {
          await navigator.clipboard.writeText(data.link);  // Copy link to clipboard
          setCopySuccess((prev) => ({ ...prev, [historicallocation._id]: 'Link copied to clipboard!' }));
        } else if (shareMethod === 'email') {
          alert('Link sent to the specified email!');
        }
      } else {
        console.error('Failed to generate shareable link');
      }
    } catch (error) {
      console.error('Error generating shareable link:', error);
    }
  };
  
  const handleEmailInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleShareMode = (historicallocation) => {
    setHistToShare(historicallocation);
    setIsEmailMode(!isEmailMode);
  };
  return (
    <div>
      <h1>Historical Locations</h1>
      <button onClick={handleViewAllHistoricalPlaces}>View All Historical Locations</button>
  
      {viewPlaces && (
        <>
          <button onClick={() => setFilterVisible(!filterVisible)}>Filter Historical Locations</button>
  
          {filterVisible && (
            <div>
              <label>Filter by Tag:</label>
              <select onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag}>
                <option value="" disabled>Select a tag</option>
                <option value="Monuments">Monuments</option>
                <option value="Religious Sites">Religious Sites</option>
                <option value="Palaces/Castles">Castles/Palaces</option>
              </select>
              <button onClick={handleFilter} disabled={!selectedTag}>Apply Filter</button>
            </div>
          )}
  
          <div>
            <label>Search by Name or Tag:</label>
            <input
              type="text"
              placeholder="Enter name or tag"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch} disabled={!searchQuery && !selectedTag}>Search</button>
          </div>
  
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
              <ul>
                {historicalPlaces.map((historicallocation) => (
                  <li key={historicallocation._id}>
                    {historicallocation.Name}
                    <button onClick={() => handleShare(historicallocation, 'copy')}>Copy Link</button>
          <button onClick={() => handleShareMode(historicallocation)}>Share via Email</button>

          {isEmailMode && HistToShare && HistToShare._id === historicallocation._id && (
            <div>
              <input
                type="email"
                placeholder="Enter recipient's email"
                value={email}
                onChange={handleEmailInputChange}
              />
              <button onClick={() => handleShare(historicallocation, 'email')}>Send Email</button>
            </div>
          )}

          {copySuccess[historicallocation._id] && <p>{copySuccess[historicallocation._id]}</p>}
     
                    
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default HistoricalLocations;
