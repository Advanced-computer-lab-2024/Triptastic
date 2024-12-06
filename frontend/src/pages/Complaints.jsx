import React, { useState, useEffect } from 'react';
import './Complaints.css'; // Import the CSS file
import {FaUserShield} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {FaTag,FaUser,FaBox, FaExclamationCircle, FaHeart, FaFileAlt,FaTrashAlt ,FaThList,FaPlus,FaEdit ,FaFlag} from 'react-icons/fa';
import image from '../images/image.png';

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
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
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
        setReplyText(''); // Clear the reply text
        setActiveComplaintId(null); // Close the reply form
        fetchData(); // Refresh the complaints data
      } else {
        const result = await response.json();
        alert(`Failed to submit reply: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };
  
  const updateComplaintStatus = async () => {
    // e.preventDefault();
    setUpdateStatusLoading(true);
    setUpdateStatusError('');
    setUpdateStatusMessage('');
  
    try {
      const response = await fetch(`http://localhost:8000/updateComplaintStatus/${selectedComplaintId}`, {
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

  const handleViewDetails = async (id) => {
    if(selectedComplaintId !=id){
    setSelectedComplaintId(id);
    }else{
      setSelectedComplaintId(null);
    }
  };
  const handleUpdateStatus = async () => {
    updateComplaintStatus().then(() => {fetchData();});
  };
  
  return (
    <div className="complaints-container">
    {/* Header */}
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={image} alt="Logo" style={styles.logo} />
      </div>
      <h1 style={styles.title2}>Complaints Management</h1>
    </header>

     {/* Sidebar */}
 <div
        style={styles.sidebar}
        onMouseEnter={(e) => {
          e.currentTarget.style.width = '200px';
          Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
            (label) => (label.style.opacity = '1')
          );
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.width = '60px';
          Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
            (label) => (label.style.opacity = '0')
          );
        }}
      >

<div style={styles.item} onClick={() => navigate('/adminPage')}>
          <FaUser style={styles.icon} />
          <span className="label" style={styles.label}>
           Admin Profile
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/manage')}>
          <FaUserShield style={styles.icon} />
          <span className="label" style={styles.label}>
          Admin Panel
          </span>
        </div>
        
        <div style={styles.item} onClick={() => navigate('/Complaints')}>
          <FaExclamationCircle style={styles.icon} />
          <span className="label" style={styles.label}>
           Complaints
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/docs')}>
          <FaFileAlt style={styles.icon} />
          <span className="label" style={styles.label}>
            Documents
          </span>
        </div>


        <div style={styles.item} onClick={() => navigate('/adminReport')}>
          <FaBox  style={styles.icon} />
          <span className="label" style={styles.label}>
            Sales Report
          </span>   
        </div>
        <div style={styles.item} onClick={() => navigate('/DeletionRequest')}>
          <FaTrashAlt  style={styles.icon} />
          <span className="label" style={styles.label}>
            Deletion Requests
          </span>   
        </div>

        <div style={styles.item} onClick={() => navigate('/EditProducts')}>
          <FaEdit   style={styles.icon} />
          <span className="label" style={styles.label}>
            Edit Products
          </span>   
        </div>

        <div style={styles.item} onClick={() => navigate('/flagged')}>
          <FaFlag   style={styles.icon} />
          <span className="label" style={styles.label}>
            Flag Events
          </span>   
        </div>
      </div>


      <h2 className="page-heading"></h2>
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
      {/* Header */}
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

      {/* Buttons */}
      <div className="complaint-actions">
        <button
          className="reply-button"
          onClick={() => handleReplyClick(complaint._id)}
        >
          Reply
        </button>
        <button
          className="details-button"
          onClick={() => handleViewDetails(complaint._id)}
        >
          View Details
        </button>
      </div>

{/* View Details Section */}
{selectedComplaintId === complaint._id && (
  <div className="complaint-details">
    <h4 className="details-title">Complaint Details</h4>
    <div className="details-body">
      <p><strong>Username:</strong> {complaint.username}</p>
      <p><strong>Body:</strong> {complaint.body}</p>
    </div>
    <div className="details-status">
      <label className="status-label"><strong>Status:</strong></label>
      <select
        value={complaintStatus}
        onChange={(e) => setComplaintStatus(e.target.value)}
        className="status-dropdown"
        required
      >
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
      </select>
      <button
        className="update-status-button"
        onClick={() => handleUpdateStatus()}
      >
        Update Status
      </button>
    </div>
  </div>
)}

      {/* Reply Section */}
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
  <div className="replies-section-horizontal">
    <h4 className="replies-title">Replies</h4>
    <div className="replies-container">
      {complaint.replies.map((reply, index) => (
        <div key={index} className="reply-card">
          <p><strong>Replier:</strong> {reply.replier || 'N/A'}</p>
          <p><strong>Date:</strong> {new Date(reply.date).toLocaleDateString()}</p>
          <p className="reply-content">{reply.content}</p>
        </div>
      ))}
    </div>
  </div>
)}

          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {

  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
      
  header: {
    height:'60px',
    position: 'fixed', // Make the header fixed
    top: '0', // Stick to the top of the viewport
    left: '0',
    width: '100%', // Make it span the full width of the viewport
    backgroundColor: '#0F5132', // Green background
    color: 'white', // White text
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth
    zIndex: '1000', // Ensure it appears above other content
  },
  logoContainer: {
    marginBottom: '10px', // Space between the logo and the title
  },
  logo: {
    height: '60px',
    width: '70px',
    borderRadius: '10px',
  
  },
  title2: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute', // Position the title independently
    top: '50%', // Center vertically
    left: '50%', // Center horizontally
    transform: 'translate(-50%, -50%)', // Adjust for element's size
    margin: '0',
  },
  profileIcon: {
    fontSize: '40px',
    color: 'white',
    cursor: 'pointer',
  },
//header
    heading: {
fontSize: '24px',
fontWeight: 'bold',
marginBottom: '20px',
color: '#0F5132', // Green theme
textAlign: 'center',
},
form: {
display: 'flex',
flexDirection: 'column',
gap: '15px',
maxWidth: '700px',
margin: '0 auto',
backgroundColor: '#f9f9f9',
padding: '20px',
borderRadius: '10px',
boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
},
formGroup: {
display: 'flex',
flexDirection: 'column',
gap: '5px',
},
item: {
padding: '10px 0',
},
label: {
fontSize: '16px',
fontWeight: 'bold',
color: '#555',
},
input: {
padding: '10px',
border: '1px solid #ccc',
borderRadius: '5px',
fontSize: '14px',
},
button: {
padding: '12px',
fontSize: '16px',
fontWeight: 'bold',
backgroundColor: '#0F5132',
color: '#fff',
border: 'none',
borderRadius: '5px',
cursor: 'pointer',
transition: 'background-color 0.3s ease',
},
buttonHover: {
backgroundColor: '#155724', // Darker green on hover
},
icon: {
  fontSize: '24px',
  marginLeft: '15px', // Move icons slightly to the right
  color: '#fff', // Icons are always white
},
//header
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: '10px',
  },
  productList: {
    listStyleType: 'none',
    padding: 0,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  productName: {
    fontSize: '20px',
    color: '#4CAF50',
  },
  productImage: {
    width: '100%',
    maxWidth: '400px',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
  },
  imagePreview: {
    maxWidth: '100%',
    borderRadius: '10px',
    marginTop: '10px',
  },
  addButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
    //sidebar
    sidebar: {
      position: 'fixed',
      top: '60px',
      left: 0,
      height: '100vh',
      width: '50px', // Default width when collapsed
      backgroundColor: 'rgba(15, 81, 50, 0.85)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start', // Ensure alignment starts from the left
      padding: '10px 0',
      overflowX: 'hidden',
      transition: 'width 0.3s ease',
      zIndex: 1000,
    },
    item: {
      padding: '10px 0',
    },
    sidebarExpanded: {
      width: '200px', // Width when expanded
    },

    label: {
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#fff',
      opacity: 0, // Initially hidden
      whiteSpace: 'nowrap', // Prevent label text from wrapping
      transition: 'opacity 0.3s ease',
    },
    //
}

export default Complaints;
