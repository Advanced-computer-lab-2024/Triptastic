
import React, { useState,useEffect } from 'react';
const Docs=()=>{
const [showingSellers, setShowingSellers] = useState(false);
const [sellers, setSellers] = useState([]);
const [errorMessage, setErrorMessage] = useState('');
const [showingTourGuides, setShowingTourGuides] = useState(false);
const [tourGuides, setTourGuides] = useState([]);
const [showingAdvertisers, setShowingAdvertisers] = useState(false);
const [advertisers, setAdvertisers] = useState([]);
const [viewingDocsSellerId, setViewingDocsSellerId] = useState(null);
const [viewingDocsTourGuideId, setViewingDocsTourGuideId] = useState(null);
const [viewingDocsAdvertiserId, setViewingDocsAdvertiserId] = useState(null);
const fetchSellers = async () => {
    try {
      const response = await fetch(`http://localhost:8000/getPendingSellers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSellers(data);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch sellers');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching sellers');
      console.error(error);
    } 
  };
const fetchTourGuides = async () => {
    try {
      const response = await fetch(`http://localhost:8000/getPendingTourGuides`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTourGuides(data);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch tour guides');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching tour guides');
      console.error(error);
    } 
  };
const fetchAdvertisers = async () => {
    try {
      const response = await fetch(`http://localhost:8000/getPendingAdvertisers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdvertisers(data);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch advertisers');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching advertisers');
      console.error(error);
    } 
  };
  useEffect(() => {
    fetchSellers();
    fetchTourGuides();
    fetchAdvertisers();
  }, []);
const handleToggleViewSellers = () => {
    setShowingSellers(!showingSellers);
    setShowingTourGuides(false);
    setShowingAdvertisers(false);
    };
const handleToggleViewTourGuides = () => {
    setShowingTourGuides(!showingTourGuides);
    setShowingSellers(false);
    setShowingAdvertisers(false);
    };
const handleToggleViewAdvertisers = () => {
    setShowingAdvertisers(!showingAdvertisers);
    setShowingSellers(false);
    setShowingTourGuides(false);
    };
const handleViewSellerDocs = (sellerId) => {
      setViewingDocsSellerId((prevId) => (prevId === sellerId ? null : sellerId));
    };
const handleViewTourGuideDocs = (tourGuideId) => {
      setViewingDocsTourGuideId((prevId) => (prevId === tourGuideId ? null : tourGuideId));
    };
const handleViewAdvertiserDocs = (advertiserId) => {
      setViewingDocsAdvertiserId((prevId) => (prevId === advertiserId ? null : advertiserId));
    };
    return(
     <div>
       <div>
        <button onClick={handleToggleViewSellers}>View Sellers</button>
        <button onClick={handleToggleViewTourGuides}>View Tour Guides</button>
        <button onClick={handleToggleViewAdvertisers}>View Advertisers</button>
        </div>
        <div>
        {showingSellers && (
          <div>
            <h2>Sellers</h2>
            <ul>
              {sellers.map((seller) => (
                <li key={seller._id}>
                  <p><strong>Name:{seller.Name}</strong></p>
                  <p><strong>Description:{seller.Description}</strong></p>
                  <p><strong>Username:{seller.Username}</strong></p>
                  <button onClick={()=>handleViewSellerDocs(seller._id)}>View Docs</button>
                  {viewingDocsSellerId === seller._id && (
                    <div>
                      <img src={`http://localhost:8000/${seller.Id.replace(/\\/g, '/')}`} alt={seller.Id} style={{ width: '400px', height: '300px' }}/>
                      <img src={`http://localhost:8000/${seller.TaxationRegistryCard.replace(/\\/g, '/')}`} alt={seller.TaxationRegistryCard} style={{ width: '400px', height: '300px' }}/>                   
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
        <div>
        {showingTourGuides && (
          <div>
            <h2>Tour guides</h2>
            <ul>
              {tourGuides.map((tourGuide) => (
                <li key={tourGuide._id}>
                  <p><strong>Username:{tourGuide.Username}</strong></p>
                  <p><strong>Email:{tourGuide.Email}</strong></p>
                  <button onClick={()=>handleViewTourGuideDocs(tourGuide._id)}>View Docs</button>
                  {viewingDocsTourGuideId === tourGuide._id && (
                    <div>
                      <img src={`http://localhost:8000/${tourGuide.Id.replace(/\\/g, '/')}`} alt={tourGuide.Id} style={{ width: '400px', height: '300px' }}/>
                      <img src={`http://localhost:8000/${tourGuide.Certificate.replace(/\\/g, '/')}`} alt={tourGuide.Certificate} style={{ width: '400px', height: '300px' }}/>                   
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
        <div>
        {showingAdvertisers && (
          <div>
            <h2>Advertisers</h2>
            <ul>
              {advertisers.map((advertiser) => (
                <li key={advertiser._id}>
                  <p><strong>Username:{advertiser.Username}</strong></p>
                  <p><strong>Email:{advertiser.Email}</strong></p>
                  <button onClick={()=>handleViewAdvertiserDocs(advertiser._id)}>View Docs</button>
                  {viewingDocsAdvertiserId === advertiser._id && (
                    <div>
                      <img src={`http://localhost:8000/${advertiser.Id.replace(/\\/g, '/')}`} alt={advertiser.Id} style={{ width: '400px', height: '300px' }}/>
                      <img src={`http://localhost:8000/${advertiser.TaxationRegistryCard.replace(/\\/g, '/')}`} alt={advertiser.TaxationRegistryCard} style={{ width: '400px', height: '300px' }}/>                   
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
     </div>
     
    
    )
        
}
export default Docs;