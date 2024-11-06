import React, { useState,useEffect } from 'react';
import './Complaints.css'; // Import the CSS file
const Complaints=()=>{
const [complaints,setComplaints]=useState([]);
const [sortOrder, setSortOrder] = useState('asc');
const [filterStatus, setFilterStatus] = useState('all');
const [replyText, setReplyText] = useState('');
const [activeComplaintId, setActiveComplaintId] = useState(null);
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
  const handleReplyClick = (id) => {
    setActiveComplaintId(id);
  };

  const handleReplySubmit = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/replyToComplaint/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyText, replier: 'Admin' }),
      });

      if (response.ok) {
        alert('Reply submitted successfully');
        setReplyText('');
        setActiveComplaintId(null);
        fetchData(); // Refresh complaints list after reply
      } else {
        const result = await response.json();
        alert(`Failed to submit reply: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
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
            <button className="reply-button" onClick={() => handleReplyClick(complaint._id)}>Reply</button>

            {activeComplaintId === complaint._id && (
              <div className="reply-form">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply here"
                />
                <button onClick={() => handleReplySubmit(complaint._id)}>Submit Reply</button>
              </div>
              
            )}
            {/* Display replies */}
            {complaint.replies && complaint.replies.length > 0 && (
              <div className="replies-section">
                <h4>Replies:</h4>
                <ul>
                  {complaint.replies.map((reply, index) => (
                    <li key={index}>
                      <p><strong>Reply:</strong> {reply.content}</p>
                      <p><strong>Date:</strong> {new Date(reply.date).toLocaleDateString()}</p>
                      {reply.replier && <p><strong>Replier:</strong> {reply.replier}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Complaints;