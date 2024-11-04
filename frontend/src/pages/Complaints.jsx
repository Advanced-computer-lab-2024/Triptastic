import React, { useState,useEffect } from 'react';
import './Complaints.css'; // Import the CSS file
const Complaints=()=>{
const [complaints,setComplaints]=useState([]);
const [sortOrder, setSortOrder] = useState('asc');
const [filterStatus, setFilterStatus] = useState('all');
const fetchData= async ()=>{
        try {
            const response = await fetch(`http://localhost:8000/getComplaints?sortOrder=${sortOrder}&filterStatus=${filterStatus}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            const result = await response.json();
            setComplaints(result);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
useEffect(() => {
    fetchData();
  }, []);
const handleSortAsc = () => {
    setSortOrder('asc');
    fetchData();
  };

const handleSortDesc = () => {
    setSortOrder('desc');
    fetchData();
  };

const handleFilterPending = () => {
    setFilterStatus('pending');
    fetchData();
  };

const handleFilterResolved = () => {
    setFilterStatus('resolved');
    fetchData();
  };

const handleShowAll = () => {
    setFilterStatus('all');
    fetchData();
  };
  const handleReply = (id) => {
    // Add logic to handle replying or changing status
    alert(`Replying to complaint ID: ${id}`);
  };

  return (
    <div className="complaints-container">
      <div className="button-group">
        <button onClick={handleSortAsc}>Sort by Date Ascending</button>
        <button onClick={handleSortDesc}>Sort by Date Descending</button>
        <button onClick={handleFilterPending}>Show Pending</button>
        <button onClick={handleFilterResolved}>Show Resolved</button>
        <button onClick={handleShowAll}>Show All</button>
      </div>
      <div className="complaints-list">
        {complaints.map((complaint) => (
          <div key={complaint._id} className="complaint-item">
            <h3 className="complaint-title">{complaint.title}</h3>
            <p className="complaint-date">Date: {new Date(complaint.date).toLocaleDateString()}</p>
            <p className={`complaint-status ${complaint.status}`}>Status: {complaint.status}</p>
            <button className="reply-button" onClick={() => handleReply(complaint._id)}>Reply / Change Status</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Complaints;