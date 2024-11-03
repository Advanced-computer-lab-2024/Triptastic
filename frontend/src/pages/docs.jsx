
import React, { useState,useEffect } from 'react';
const Docs=()=>{
const [showingSellers, setShowingSellers] = useState(false);
const [sellers, setSellers] = useState([]);
const [errorMessage, setErrorMessage] = useState('');
const [showingTourGuides, setShowingTourGuides] = useState(false);
const [tourGuides, setTourGuides] = useState([]);
const [showingAdvertisers, setShowingAdvertisers] = useState(false);
const [advertisers, setAdvertisers] = useState([]);
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
    return(
     <div>
        <button onClick={handleToggleViewSellers}>View Sellers</button>
        <button onClick={handleToggleViewTourGuides}>View Tour Guides</button>
        <button onClick={handleToggleViewAdvertisers}>View Advertisers</button>
     </div>
    )
        
}
export default Docs;