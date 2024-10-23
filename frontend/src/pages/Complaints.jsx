import React, { useState,useEffect } from 'react';
const Complaints=()=>{
const [Complaints,setComplaints]=useState([]);
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

    return(

<div>
    <div>
    <button onClick={handleSortAsc}>Sort by date ascending</button>
    <button onClick={handleSortDesc}>Sort by date descending</button>
    <button onClick={handleFilterPending}>Show pending</button>
    <button onClick={handleFilterResolved}>Show resolved</button>
    <button onClick={handleShowAll}>Show all</button>
    </div>
    <div>
    {Complaints.map(complaint => (
        <div key={complaint._id}>
            <p>title:{ complaint.title}</p>
          <p>Date: {complaint.date}</p>
          <p>Status: {complaint.status}</p>
        </div>
      ))}
    </div>
</div>
    )
}
export default Complaints;