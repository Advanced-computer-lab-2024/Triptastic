import React, { useState, useEffect} from 'react';
import image from '../images/image.png';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { FaBell,FaSearch,FaUserCircle, FaBox, FaLandmark, FaUniversity, FaMap, FaRunning, FaPlane, FaHotel, FaClipboardList, FaStar, FaBus } from 'react-icons/fa';
import { MdNotificationImportant } from 'react-icons/md';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import FeedbackIcon from '@mui/icons-material/Feedback';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CommentIcon from '@mui/icons-material/Comment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function TourGuideProfile() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordChangeMessage('');
    setPasswordChangeError('');
  
    const Username = localStorage.getItem('Username');
  
    try {
      const response = await fetch('http://localhost:8000/changePasswordTourGuide', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username,
          currentPassword,
          newPassword,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setPasswordChangeMessage(data.message);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const errorData = await response.json();
        setPasswordChangeError(errorData.error || 'Error changing password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordChangeError('Error changing password');
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const [itineraryReports, setItineraryReports] = useState({});
  const [tourGuideInfo, setTourGuideInfo] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]); // Filtered itineraries
  const [selectedMonth, setSelectedMonth] = useState(""); // Selected month
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isIVisible, setIsIVisible] = useState(false);
  const [isTIVisible, setIsTIVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [requestSent, setRequestSent] = useState(false); // Track if request was successfully sent
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: '',
    photo:''
  });
  const [touristItineraryData, setTouristItineraryData] = useState({
    Activities: '',
    Locations: '',
    startDate:'',
    endDate:'',
    Tags:'',
  });
  const [touristItineraries,setTouristItineraries]=useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null); 
  const [selectedTouristItinerary, setSelectedTouristItinerary] = useState(null); 
  const [itineraryData, setItineraryData] = useState({
    Activities: '',
    Locations: '',
    Timeline: '',
    DurationOfActivity: '',
    Language: '',
    Price: 0,
    DatesTimes: '',
    Accesibility: '',
    pickUpDropOff: '',
    bookingOpen: false,
  });
  
  const [isCreatingItinerary, setIsCreatingItinerary] = useState(false);
  const [isEditingItinerary, setIsEditingItinerary] = useState(false); // New state for editing itinerary
  const [isCreatingTouristItinerary, setIsCreatingTouristItinerary] = useState(false);
  const [isEditingTouristItinerary, setIsEditingTouristItinerary] = useState(false);

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  }; 
  const togglePasswordModal = () => setShowPasswordModal(!showPasswordModal);
  useEffect(() => {
    fetchTourGuideData();
    fetchItineraries();
    setLoading(false);
    fetchTouristItineraries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setFormData((prevData) => ({ ...prevData, photo: file }));
    }
  };
  const fetchTourGuideData = async () => {
    const Username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/getTourGuide?Username=${Username}`);
      if (response.ok) {
        const data = await response.json();
        setTourGuideInfo(data); // Ensure all fields are preserved
        setFormData(data);
        if (data.photo) setPhoto(data.photo);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch tour guide information');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching tour guide information');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const Username = localStorage.getItem('Username');
  
    if (!Username) {
      alert('Username is not available. Please log in again.');
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('Username', Username);
  
    if (formData.Email) formDataToSend.append('Email', formData.Email);
    if (formData.mobileNumber) formDataToSend.append('mobileNumber', formData.mobileNumber);
    if (formData.yearsOfExperience) formDataToSend.append('yearsOfExperience', formData.yearsOfExperience);
    if (formData.previousWork) formDataToSend.append('previousWork', formData.previousWork);
    if (formData.photo instanceof File) {
      formDataToSend.append('photo', formData.photo); // Append the photo only if it's a file
    }
  
    try {
      const response = await fetch(`http://localhost:8000/updateTourGuide/${Username}`, {
        method: 'PATCH',
        body: formDataToSend,
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Profile updated successfully!');
        await fetchTourGuideData(); // Refresh the data after the update
      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        alert(`Error updating profile: ${errorData.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    }
  };
  
  
  const fetchItineraries = async () => {
    const Username = localStorage.getItem('Username');

    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getMyItineraries?Username=${Username}`);
        if (response.ok) {
          const data = await response.json();
          setItineraries(data);
          setFilteredItineraries(data); 
        } else {
          throw new Error('Failed to fetch itineraries');
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    }
  };
  const fetchTouristItineraries = async () => {
    const Username = localStorage.getItem('Username');

    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getMyTouristItineraries?Username=${Username}`);
        if (response.ok) {
          const data = await response.json();
          setTouristItineraries(data);
        } else {
          throw new Error('Failed to fetch itineraries');
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    }
  };

  const handleMonthFilter = async (month) => {
    setSelectedMonth(month);
  
    const Username = localStorage.getItem("Username");
  
    if (!Username) {
      console.error("No logged-in username found.");
      return;
    }
  
    if (!month) {
      // Reset to show all itineraries for this tour guide
      setFilteredItineraries(itineraries);
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:8000/filterItinerariesByMonth?Username=${Username}&month=${month}`
      );
      if (response.ok) {
        const data = await response.json();
        setFilteredItineraries(data); // Update with filtered itineraries
      } else {
        setFilteredItineraries([]); // Clear if no results or error
        const errorData = await response.json();
        console.error("Error fetching filtered itineraries:", errorData);
      }
    } catch (error) {
      console.error("An error occurred while filtering itineraries:", error);
      setFilteredItineraries([]);
    }
  };
  

  const toggleProfileDetails = () => {
    setIsVisible((prevState) => !prevState);
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleItineraryChange = (e) => {
    const { name, value } = e.target;
    setItineraryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleTouristItineraryChange = (e) => {
    const { name, value } = e.target;
    setTouristItineraryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleItinerarySubmit = async (e) => {
    e.preventDefault();
    const Username = localStorage.getItem('Username');

    const activitiesArray = itineraryData.Activities.split(',').map((activity) => activity.trim());
    const locationsArray = itineraryData.Locations.split(',').map((location) => location.trim());

    const updatedItineraryData = {
      ...itineraryData,
      Activities: activitiesArray,
      Locations: locationsArray,
      TourGuide: Username,
    };

    try {
      const response = await fetch('http://localhost:8000/addItinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItineraryData),
      });

      if (response.ok) {
        await fetchItineraries();
        setErrorMessage('');
        setIsCreatingItinerary(false);
        setItineraryData({
          Activities: '',
          Locations: '',
          Timeline: '',
          DurationOfActivity: '',
          Language: '',
          Price: 0,
          DatesTimes: '',
          Accesibility: '',
          pickUpDropOff: '',
          bookingOpen: false,

        });
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
        console.error('Error response:', errorData);
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the itinerary');
      console.error('Error occurred while adding the itinerary:', error);
    }
  };
  const handleTouristItinerarySubmit = async (e) => {
    e.preventDefault();
    const Username = localStorage.getItem('Username');

    const tagsArray = touristItineraryData.Tags.split(',').map((tag) => tag.trim());
    const locationsArray = touristItineraryData.Locations.split(',').map((location) => location.trim());
    const activitiesArray = touristItineraryData.Activities.split(',').map((activity) => activity.trim());

    const updatedTouristItineraryData = {
      ...touristItineraryData,
      Tags: tagsArray,
      Locations: locationsArray,
      Activities: activitiesArray,
      tourGuide: Username,
    };

    try {
      const response = await fetch('http://localhost:8000/addTouristItinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTouristItineraryData),
      });

      if (response.ok) {
        await fetchTouristItineraries();
        setErrorMessage('');
        setIsCreatingTouristItinerary(false);
        setTouristItineraryData({
          Activities: '',
          Locations: '',
          startDate:'',
          endDate:'',
          Tags:'',
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
        console.error('Error response:', errorData);
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the itinerary');
      console.error('Error occurred while adding the itinerary:', error);
    }
  };

  const handleViewItinerary = (itinerary) => {
    setSelectedItinerary(itinerary);
    setIsEditingItinerary(false); // Reset editing state
    setIsIVisible((prevState) => !prevState);
  };
  const handleViewTouristItinerary = (tourisItinerary) => {
    setSelectedTouristItinerary(tourisItinerary);
    setIsEditingTouristItinerary(false); // Reset editing state
    setIsTIVisible((prevState) => !prevState);
  };

  const handleEditItinerary = (itinerary) => {
    setItineraryData({
      Activities: itinerary.Activities.join(', '),
      Locations: itinerary.Locations.join(', '),
      Timeline: itinerary.Timeline,
      DurationOfActivity: itinerary.DurationOfActivity,
      Language: itinerary.Language,
      Price: itinerary.Price,
      DatesTimes: itinerary.DatesTimes,
      Accesibility: itinerary.Accesibility,
      pickUpDropOff: itinerary.pickUpDropOff,
      bookingOpen: itinerary.bookingOpen,

    });
    setSelectedItinerary(itinerary);
    setIsEditingItinerary(true); // Set editing state to true
  };
  const handleEditTouristItinerary = (touristItinerary) => {
    setTouristItineraryData({
      Activities: touristItinerary.Activities.join(', '),
      Locations: touristItinerary.Locations.join(', '),
      startDate: touristItinerary.startDate,
      endDate: touristItinerary.endDate,
      Tags: touristItinerary.Tags.join(', '),
    });
    setSelectedTouristItinerary(touristItinerary);
    setIsEditingTouristItinerary(true); // Set editing state to true
  };
  const handleDeleteItinerary = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/deleteItinerary/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchItineraries();
        setSelectedItinerary(null);
        
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the itinerary');
      console.error('Error occurred while deleting the itinerary:', error);
    }
  };
  const handleDeleteTouristItinerary = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/deletetouristItinerary/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchTouristItineraries();
        setSelectedTouristItinerary(null);
        
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the itinerary');
      console.error('Error occurred while deleting the itinerary:', error);
    }
  };
  const handleUpdateItinerary = async (e) => {
    e.preventDefault();

    const activitiesArray = itineraryData.Activities.split(',').map((activity) => activity.trim());
    const locationsArray = itineraryData.Locations.split(',').map((location) => location.trim());

    const updatedItineraryData = {
      ...itineraryData,
      Activities: activitiesArray,
      Locations: locationsArray,
    };

    try {
      const response = await fetch(`http://localhost:8000/updateItinerary/${selectedItinerary._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItineraryData),
      });

      if (response.ok) {
        await fetchItineraries();
        setIsEditingItinerary(false);
        setSelectedItinerary(null);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the itinerary');
      console.error('Error occurred while updating the itinerary:', error);
    }
  };
  const handleUpdateTouristItinerary = async (e) => {
    e.preventDefault();

    const activitiesArray = touristItineraryData.Activities.split(',').map((activity) => activity.trim());
    const locationsArray = touristItineraryData.Locations.split(',').map((location) => location.trim());
    const tagsArray = touristItineraryData.Tags.split(',').map((tag) => tag.trim());
    const updatedTouristItineraryData = {
      ...touristItineraryData,
      Activities: activitiesArray,
      Locations: locationsArray,
      Tags: tagsArray
    };

    try {
      const response = await fetch(`http://localhost:8000/updatetouristItinerary/${selectedTouristItinerary._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTouristItineraryData),
      });

      if (response.ok) {
        await fetchTouristItineraries();
        setIsEditingTouristItinerary(false);
        setSelectedTouristItinerary(null);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the itinerary');
      console.error('Error occurred while updating the itinerary:', error);
    }
  };
  const deactivateItinerary = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/deactivateItinrary/${id}`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        await fetchItineraries();
        setSelectedItinerary(null);
       
        
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while deactivating the itinerary');
      console.error('Error occurred while deactivating the itinerary:', error);
    }
  };
  const activateItinerary = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/activateItinrary/${id}`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        await fetchItineraries();
        setSelectedItinerary(null);
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error: ${response.status} - ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while activating the itinerary');
      console.error('Error occurred while activating the itinerary:', error);
    }
  };
  const handleDeleteRequest = async () => {
    const Username = localStorage.getItem('Username');
    setWaiting(true);
    setRequestSent(false); // Reset request sent state when initiating new request
    try {
        const response = await fetch(`http://localhost:8000/requestAccountDeletionTourG?Username=${Username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            }
            
        });
        const data = await response.json();
        if (response.ok) {
          setRequestSent(true); // Set to true when the request is successfully sent
          alert('Your account deletion request has been submitted and is pending approval.');
        } else {
          setRequestSent(false); // Reset to allow another deletion request
          alert(data.msg); // Show the rejection message
         }
 
        
    } catch (error) {
        alert('Error deleting account');
    }
    finally {
      setWaiting(false); // Stop waiting regardless of outcome
  };

};
const navigate = useNavigate();
const handleViewReport = async (itineraryId) => {
  const tourGuideUsername = localStorage.getItem('Username');

  // If the report is already visible, toggle it off
  if (itineraryReports[itineraryId]?.visible) {
    setItineraryReports((prevReports) => ({
      ...prevReports,
      [itineraryId]: {
        ...prevReports[itineraryId],
        visible: false,
      },
    }));
    return;
  }

  // Otherwise, fetch the report or toggle it on
  try {
    const response = await fetch(
      `http://localhost:8000/getTouristReportForItinerary/${itineraryId}?tourGuideUsername=${tourGuideUsername}`
    );

    if (response.ok) {
      const data = await response.json();
      setItineraryReports((prevReports) => ({
        ...prevReports,
        [itineraryId]: {
          ...data.report, // Add the report data
          visible: true,  // Set visibility to true
        },
      }));
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message || 'Failed to fetch report');
    }
  } catch (error) {
    console.error('An error occurred while fetching the report:', error);
    setErrorMessage('An error occurred while fetching the report');
  }
};


  return (
    <div style={styles.container}>
    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    {/* Header */}
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={image} alt="Logo" style={styles.logo} />
      </div>
      <h1 style={styles.title}>Tour Guide Profile</h1>

      <AssessmentIcon
        alt="View Report"
        style={{ cursor: 'pointer', color: 'white', marginRight: '-490px' }}
        onClick={() => navigate('/guideReport')}
      />

      <LockResetIcon
        alt="Profile Icon"
        style={{ cursor: 'pointer', color: 'white', marginRight: '-490px' }}
        onClick={togglePasswordModal}
      />

      {/* Profile Icon */}
      <ManageAccountsIcon
        style={styles.profileIcon}
        title="Edit Profile"
        onClick={toggleModal} // Open modal on click
      />
    </header>
      {/* Sidebar */}
   <div className="sidebar"style={styles.sidebar}>
      
      <ul>
      <li 
  onClick={() => navigate('/my-itineraries')} 
  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', paddingLeft: '10px' }}
>
  <FaMap style={{ marginRight: '8px' }} />
  View My Itineraries
</li>

      </ul> 
    </div>

    {/* Edit Profile Modal */}
    {modalOpen && (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <h2 style={styles.modalContentH2}>Edit Profile</h2>
          <HighlightOffOutlinedIcon
            style={styles.cancelIcon}
            onClick={() => setModalOpen(false)} // Close modal on click
          />
          {loading ? (
            <p>Loading profile...</p>
          ) : (
            <form style={styles.profileForm} onSubmit={handleSubmit}>
              <div style={styles.photoSection}>
                {photo && (
                  <img
                    src={`http://localhost:8000/${photo.replace(/\\/g, '/')}`}
                    alt="Tour Guide"
                    style={styles.profilePhoto}
                  />
                )}
                <label style={styles.photoLabel}>
                  Update Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    style={styles.fileInput}
                  />
                </label>
                <h3>{formData.Username}</h3>
              </div>

              <div style={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label>Previous Work</label>
                <textarea
                  name="previousWork"
                  value={formData.previousWork}
                  onChange={handleChange}
                  style={styles.textarea}
                />
              </div>
              <div style={styles.buttonContainer}>
                <button type="submit" style={styles.submitButton}>
                  Save Changes
                </button>
                <button
                  type="button"
                  style={styles.deleteButton}
                  onClick={handleDeleteRequest} // Trigger the delete account action
                  disabled={waiting || requestSent}
                >
                  {waiting
                    ? 'Processing...'
                    : requestSent
                    ? 'Request Sent'
                    : 'Delete Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )}

    {/* Change Password Modal */}
    {showPasswordModal && (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <h2 style={styles.modalContentH2}>Change Password</h2>
          <HighlightOffOutlinedIcon
            onClick={() => setShowPasswordModal(false)}
            style={styles.cancelpasswordIcon}
          />
          <form onSubmit={handlePasswordChange}>
            <input
              type="password"
              placeholder="Enter Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={styles.modalContentInput}
            />
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={styles.modalContentInput}
            />

            <div style={styles.buttonContainer}>
              <button
                type="submit"
                disabled={isChangingPassword}
                style={styles.submitButton}
              >
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
          {passwordChangeMessage && (
            <p style={{ color: 'green', marginTop: '10px' }}>
              {passwordChangeMessage}
            </p>
          )}
          {passwordChangeError && (
            <p style={{ color: 'red', marginTop: '10px' }}>
              {passwordChangeError}
            </p>
          )}
        </div>
      </div>
    )}



<div style={styles.mainContainer}>
  {/* Filter Section */}
  <div style={styles.filterContainer}>
    <h3 style={styles.filterTitle}>
      <DisplaySettingsIcon style={styles.filterIcon} /> Filter Itineraries
    </h3>
    <select
      onChange={(e) => handleMonthFilter(e.target.value)}
      value={selectedMonth}
      style={styles.filterDropdown}
    >
      <option value="">All Months</option>
      {Array.from({ length: 12 }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {new Date(0, i).toLocaleString("default", { month: "long" })}
        </option>
      ))}
    </select>
  </div>
  {/* Itinerary Reports Section */}
  <div style={styles.reportsSection}>
    <h3 style={styles.sectionTitle}>
      <span style={styles.titleText}>Itinerary Reports</span>
      <AssessmentIcon style={styles.flagIcon} />
    </h3>
    <div style={styles.gridContainer}>
      {filteredItineraries.length > 0 ? (
        filteredItineraries.map((itinerary) => (
          <div key={itinerary._id} style={styles.box}>
            <h4 style={styles.listText}>
              Locations: {itinerary.Locations.join(", ")}
            </h4>
            <p style={styles.listText}>Dates: {itinerary.DatesTimes}</p>
            <p style={styles.listText}>Timeline: {itinerary.Timeline}</p>
            <button
              style={styles.button}
              onClick={() => handleViewReport(itinerary._id)}
            >
              {itineraryReports[itinerary._id]?.visible
                ? "Hide Report"
                : "View Report"}
            </button>

            {/* Report Table */}
            {itineraryReports[itinerary._id]?.visible && (
              <div style={styles.reportSection}>
              <table style={styles.table}>
                <thead style={styles.tableHead}>
                  <tr>
                    <th style={styles.tableHeadCell}>Tourist</th>
                    <th style={styles.tableHeadCell}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {itineraryReports[itinerary._id].tourists.map((tourist, index) => (
                    <tr
                      key={index}
                      style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt} // Alternating row colors
                    >
                      <td style={styles.tableCell}>{tourist.Username}</td>
                      <td style={styles.tableCell}>{tourist.Email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        ))
      ) : (
        <p style={styles.noData}>No itineraries found.</p>
      )}
    </div>
  </div>
</div>

{/* Flagged Itineraries */}
{tourGuideInfo?.flaggedItineraries?.length > 0 ? (
  <div style={styles.section}>
 <h3 style={styles.sectionTitle}>
    <span style={styles.titleText}>Flagged Itineraries</span>
    <AssistantPhotoIcon style={styles.flagIcon} />
  </h3>    <ul style={styles.list}>
      {Array.from(
        new Set(tourGuideInfo.flaggedItineraries.map((itinerary) => itinerary._id))
      ).map((uniqueId) => {
        const itinerary = tourGuideInfo.flaggedItineraries.find(
          (item) => item._id === uniqueId
        );
        return (
          <li key={itinerary._id} style={styles.listItem}>
          <p style={styles.listText}>
            <strong><LocationOnIcon/>Locations:</strong> {itinerary.Locations.join(', ')}
          </p>
          <p style={styles.listText}>
            <strong><CalendarMonthIcon/>Dates:</strong> {itinerary.DatesTimes}
          </p>
        </li>
        );
      })}
    </ul>
  </div>
) : (
  <p>No flagged itineraries.</p>
)}


    {/* Feedback */}
    <div style={styles.section}>
    <h3 style={styles.sectionTitle}>
    <span style={styles.titleText}>Feedback</span>
    <FeedbackIcon style={styles.flagIcon} />
  </h3>
      {tourGuideInfo?.feedback?.length > 0 ? (
        <ul style={styles.feedbackList}>
          {tourGuideInfo.feedback.map((feedback, index) => (
            <li key={index} style={styles.feedbackItem}>
              <p style={styles.listText}>
                <strong><CalendarMonthIcon/>Date:</strong> {feedback.date}
              </p>
              <p style={styles.listText}>
                <strong><FaUserCircle/>{feedback.touristUsername}:</strong> {feedback.rating}/5
              </p>
              <p style={styles.listText}>
                <strong><CommentIcon/>Comment:</strong> {feedback.comment}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No feedback available.</p>
      )}
    </div>

</div>
    );
  }

const styles = {
  container: {
    top:'-90px',
     margin: '90px auto',
    maxWidth: '1200px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    position: 'fixed',
    height: '60px',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#0F5132',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    zIndex: 1000,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '60px',
    width: '70px',
    borderRadius: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
    marginLeft:'90px'
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
  },
  sidebar  :{
    marginTop: '20px',
  display: 'flex',       // Enables flexbox layout
  justifyContent: 'center', // Horizontally centers the content
  alignItems: 'center',  // Vertically centers the content
  textAlign: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '50%',
    maxWidth: '600px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalContentH2: {
    fontSize: '22px',
    textAlign: 'center',
    color: '#333',
  },
  modalContentLabel: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'flex', alignItems: 'center', gap: '5px',
    color: '#555',
  },
  modalContentInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  },
  modalContentTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    resize: 'vertical',
  },
  modalContentButton: {
    padding: '10px 20px',
    border: 'none',
    background: '#0F5132',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  passwordSection: {
    borderTop: '1px solid #ddd',
    marginTop: '20px',
    paddingTop: '15px',
  },
  cancelIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '500px', // Adjust placement
    top: '100px', // Adjust placement
  },
  cancelpasswordIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '490px', // Adjust placement
    top: '290px', // Adjust placement
  },
  profileForm: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
 photoSection : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  profilePhoto: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  photoLabel: {
    cursor: 'pointer',
    color: '#0F5132',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  fileInput: {
    display: 'none',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  disabledInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f0f0f0',
    cursor: 'not-allowed',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    resize: 'vertical',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'left', // Center align the buttons
    gap: '5px', // Add spacing between the buttons
    //marginTop: '20px',
  },
  submitButton: {
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Red color
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  mainContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    marginTop: "20px",
  },
  filterContainer: {
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "200px",
    marginTop:'70px'
  },
  filterTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0F5132",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  filterIcon: {
    fontSize: "20px",
    color: "#0F5132",
  },
  filterDropdown: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginTop: "10px",
  },
  reportsSection: {
    flex: "3",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#0F5132",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  titleText: {
    fontWeight: "bold",
  },
  flagIcon: {
    fontSize: "18px",
    color: "#0F5132",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px 0",
  },
  box: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  listText: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "10px",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#0F5132",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize:"15px",
    alignSelf: "flex-start",
  },
  reportSection: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f7fdf8", // Lighter green background
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Arial', sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
    fontSize: "14px", // Smaller font for simplicity
    color: "#333", // Neutral text color
  },
  tableHead: {
    backgroundColor: "#0F5132",
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
  },
  tableHeadCell: {
    padding: "12px 10px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  tableRow: {
    backgroundColor: "#fff", // Alternate white rows
    textAlign: "left",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #e0e0e0", // Subtle border
    fontSize: "13px", // Smaller font for cells
  },
  tableRowAlt: {
    backgroundColor: "#f9f9f9", // Light alternate row color
  },
  reportTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0F5132",
    marginBottom: "10px",
  },
  noData: {
    color: "#999",
    textAlign: "center",
  },
  section: {
    textAlign: 'center', // Center aligns the entire section
    color: '#0F5132', // Sets the shade of green for all text
    padding: '20px',
    backgroundColor: '#f9f9f9', // Optional: Add a subtle background if needed
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: Add shadow for better appearance
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Centers both text and icon
    gap: '10px', // Adds spacing between the text and icon
    marginBottom: '20px',
  },
  titleText: {
    color: '#0F5132', // Green shade for the title
  },
  flagIcon: {
    fontSize: '28px',
    color: '#0F5132', // Green shade for the icon
  },
  listText: {
    textAlign: 'left', // Aligns the list items to the left

    fontSize: '18px', // Smaller font size for the flagged itineraries
    margin: '5px 0', // Reduced margin for compact layout
  },
  list: {
    fontSize: '18px',

    listStyleType: 'none',
    padding: 0,
    textAlign: 'left', // Aligns the list items to the left
  },
  listItem: {
    fontSize: '18px',

    backgroundColor: '#e8f5e9',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow
    color: '#0F5132', // Green shade for list items
  },
  feedbackList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    textAlign: 'left', // Aligns the list items to the left

  },
  feedbackItem: {
    padding: '15px',
    fontSize: '18px',
    backgroundColor: '#e8f5e9',
    borderRadius: '5px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
}
export default TourGuideProfile;


