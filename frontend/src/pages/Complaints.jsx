import React, { useState, useEffect } from 'react';
import './Complaints.css'; // Import the CSS file
import {FaArrowLeft} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [activeComplaintId, setActiveComplaintId] = useState(null);
  const [complaintIdToSearch, setComplaintIdToSearch] = useState('');
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [complaintError, setComplaintError] = useState('');
  const [complaintIdToUpdate, setComplaintIdToUpdate] = useState('');
  const [complaintStatus, setComplaintStatus] = useState('pending');
  const [updateStatusMessage, setUpdateStatusMessage] = useState('');
  const [updateStatusError, setUpdateStatusError] = useState('');
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/getComplaints?sortOrder=${sortOrder}&filterStatus=${filterStatus}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const result = await response.json();
      setComplaints(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortOrder, filterStatus]);

  const handleReplyClick = (id) => {
    setActiveComplaintId(id);
  };

  const handleReplySubmit = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/replyToComplaint/${id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: replyText, replier: 'Admin' }),
        }
      );

      if (response.ok) {
        alert('Reply submitted successfully');
        setReplyText('');
        setActiveComplaintId(null);
        fetchData();
      } else {
        const result = await response.json();
        alert(`Failed to submit reply: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const updateComplaintStatus = async (e) => {
    e.preventDefault();
    setUpdateStatusLoading(true);
    setUpdateStatusError('');
    setUpdateStatusMessage('');
  
    try {
      const response = await fetch(`http://localhost:8000/updateComplaintStatus/${complaintIdToUpdate.trim()}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: complaintStatus }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setUpdateStatusMessage(data.message || 'Complaint status updated successfully.');
      } else {
        const errorData = await response.json();
        setUpdateStatusError(errorData.error || 'Failed to update complaint status.');
      }
    } catch (error) {
      setUpdateStatusError('An error occurred while updating the complaint status.');
      console.error(error);
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const fetchComplaintDetails = async (e) => {
    e.preventDefault();
    setComplaintLoading(true);
    setComplaintError('');
    setComplaintDetails(null);
  
    try {
      const response = await fetch(`http://localhost:8000/getComplaintDetails/${complaintIdToSearch.trim()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setComplaintDetails(data); // Store the fetched complaint details
      } else {
        const errorData = await response.json();
        setComplaintError(errorData.error || 'Complaint not found.');
      }
    } catch (error) {
      setComplaintError('An error occurred while fetching the complaint details.');
      console.error(error);
    } finally {
      setComplaintLoading(false);
    }
  };
  
  return (
    <div className="complaints-container">
        <FaArrowLeft 
    onClick={() => navigate('/adminPage')}
    style={{
      cursor: 'pointer', 
      fontSize: '24px', 
      color: '#0F5132' // Match your theme
    }} 
  />
      <h2 className="page-heading">Complaints Management</h2>
 {/* View Complaint Details Section */}
 <div className="complaint-card">
        <h3 className="card-title">View Complaint Details</h3>
        <form onSubmit={fetchComplaintDetails} className="form">
          <div className="form-group">
            <label>Complaint ID:</label>
            <input
              type="text"
              value={complaintIdToSearch}
              onChange={(e) => setComplaintIdToSearch(e.target.value)}
              required
              placeholder="Enter Complaint ID"
            />
          </div>
          <button type="submit" className="primary-button" disabled={complaintLoading}>
            {complaintLoading ? "Searching..." : "Get Complaint Details"}
          </button>
        </form>
        {complaintError && <p className="error-text">{complaintError}</p>}
        {complaintDetails && (
          <div className="complaint-details">
            <p><strong>Title:</strong> {complaintDetails.title}</p>
            <p><strong>Body:</strong> {complaintDetails.body}</p>
            <p><strong>Date:</strong> {new Date(complaintDetails.date).toLocaleDateString()}</p>
            <p><strong>Username:</strong> {complaintDetails.username}</p>
            <p><strong>Status:</strong> {complaintDetails.status}</p>
          </div>
        )}
      </div>

       {/* Update Complaint Status Section */}
       <div className="complaint-card">
        <h3 className="card-title">Update Complaint Status</h3>
        <form onSubmit={updateComplaintStatus} className="form">
          <div className="form-group">
            <label>Complaint ID:</label>
            <input
              type="text"
              value={complaintIdToUpdate}
              onChange={(e) => setComplaintIdToUpdate(e.target.value)}
              required
              placeholder="Enter Complaint ID"
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select
              value={complaintStatus}
              onChange={(e) => setComplaintStatus(e.target.value)}
              required
            >
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <button
            type="submit"
            className="primary-button"
            disabled={updateStatusLoading}
          >
            {updateStatusLoading ? "Updating..." : "Update Status"}
          </button>
        </form>
        {updateStatusError && <p className="error-text">{updateStatusError}</p>}
        {updateStatusMessage && <p className="success-text">{updateStatusMessage}</p>}
      </div>
      
      {/* Dropdown for Sorting and Filtering */}
      <div className="dropdown-container">
        <select
          className="dropdown"
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'asc' || value === 'desc') {
              setSortOrder(value);
            } else {
              setFilterStatus(value);
            }
          }}
        >
          <option value="asc">Sort by Date Ascending</option>
          <option value="desc">Sort by Date Descending</option>
          <option value="pending">Show Pending</option>
          <option value="resolved">Show Resolved</option>
          <option value="all">Show All</option>
        </select>
      </div>

      <div className="complaints-list">
        {complaints.map((complaint) => (
          <div key={complaint._id} className="complaint-card">
            <div className="complaint-header">
              <h3 className="complaint-title">{complaint.title}</h3>
              <p className="complaint-date">
                <strong>Date:</strong> {new Date(complaint.date).toLocaleDateString()}
              </p>
              <p
                className={`complaint-status ${
                  complaint.status === 'resolved' ? 'status-resolved' : 'status-pending'
                }`}
              >
                <strong>Status:</strong> {complaint.status}
              </p>
            </div>

            <button
              className="reply-button"
              onClick={() => handleReplyClick(complaint._id)}
            >
              Reply
            </button>

            {activeComplaintId === complaint._id && (
              <div className="reply-form">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply here"
                  className="reply-textarea"
                />
                <button
                  onClick={() => handleReplySubmit(complaint._id)}
                  className="submit-reply-button"
                >
                  Submit Reply
                </button>
              </div>
            )}

            {complaint.replies && complaint.replies.length > 0 && (
              <div className="replies-section">
                <h4>Replies:</h4>
                <ul>
                  {complaint.replies.map((reply, index) => (
                    <li key={index} className="reply-item">
                      <p>
                        <strong>Reply:</strong> {reply.content}
                      </p>
                      <p>
                        <strong>Date:</strong>{' '}
                        {new Date(reply.date).toLocaleDateString()}
                      </p>
                      {reply.replier && (
                        <p>
                          <strong>Replier:</strong> {reply.replier}
                        </p>
                      )}
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
