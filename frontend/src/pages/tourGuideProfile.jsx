import React, { useState, useEffect} from 'react';
import image from '../images/image.png';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { FaBell,FaSearch, FaBox, FaLandmark, FaUniversity, FaMap, FaRunning, FaPlane, FaHotel, FaClipboardList, FaStar, FaBus } from 'react-icons/fa';
import { MdNotificationImportant } from 'react-icons/md';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import AssessmentIcon from '@mui/icons-material/Assessment';

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
              </div>
              <div style={styles.formGroup}>
                <label>Username</label>
                <input
                  type="text"
                  name="Username"
                  value={formData.Username}
                  disabled
                  style={styles.disabledInput}
                />
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

    {/* Flagged Itineraries */}
    {tourGuideInfo?.flaggedItineraries?.length > 0 ? (
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Flagged Itineraries</h3>
        <ul style={styles.list}>
          {tourGuideInfo.flaggedItineraries.map((itinerary) => (
            <li key={itinerary._id} style={styles.listItem}>
              <p>
                <strong>Locations:</strong> {itinerary.Locations.join(', ')}
              </p>
              <p>
                <strong>Dates:</strong> {itinerary.DatesTimes}
              </p>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <p>No flagged itineraries.</p>
    )}

    {/* Feedback */}
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>Feedback</h3>
      {tourGuideInfo?.feedback?.length > 0 ? (
        <ul style={styles.feedbackList}>
          {tourGuideInfo.feedback.map((feedback, index) => (
            <li key={index} style={styles.feedbackItem}>
              <p>
                <strong>Date:</strong> {feedback.date}
              </p>
              <p>
                <strong>{feedback.touristUsername}:</strong> {feedback.rating}/5
              </p>
              <p>
                <strong>Comment:</strong> {feedback.comment}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No feedback available.</p>
      )}
    </div>

    {/* Itineraries Section */}
<h3>Itineraries</h3>
<button onClick={() => setIsCreatingItinerary((prev) => !prev)}>
  {isCreatingItinerary ? 'Cancel Creating Itinerary' : 'Create Itinerary'}
</button>

{/* Create Itinerary Form */}
{isCreatingItinerary && (
  <form onSubmit={handleItinerarySubmit}>
    <div>
      <label>Activities:</label>
      <input
        type="text"
        name="Activities"
        value={itineraryData.Activities}
        onChange={handleItineraryChange}
        required
      />
    </div>
    <div>
      <label>Locations:</label>
      <input
        type="text"
        name="Locations"
        value={itineraryData.Locations}
        onChange={handleItineraryChange}
        required
      />
    </div>
    <div>
      <label>Timeline:</label>
      <input
        type="text"
        name="Timeline"
        value={itineraryData.Timeline}
        onChange={handleItineraryChange}
        required
      />
    </div>
    <div>
      <label>Duration Of Activity:</label>
      <input
        type="text"
        name="DurationOfActivity"
        value={itineraryData.DurationOfActivity}
        onChange={handleItineraryChange}
        required
      />
    </div>
    <div>
      <label>Language:</label>
      <input
        type="text"
        name="Language"
        value={itineraryData.Language}
        onChange={handleItineraryChange}
        required
      />
    </div>
    <div>
      <label>Price:</label>
      <input
        type="number"
        name="Price"
        value={itineraryData.Price}
        onChange={handleItineraryChange}
        required
      />
    </div>
    <div>
      <label>Dates/Times 'YYYY-MM-DD':</label>
      <input
        type="text"
        name="DatesTimes"
        value={itineraryData.DatesTimes}
        onChange={handleItineraryChange}
        required
      />
    </div>
    <div>
      <label>Accessibility:</label>
      <input
        type="text"
        name="Accesibility"
        value={itineraryData.Accesibility}
        onChange={handleItineraryChange}
        required
      />
    </div>
    <div>
      <label>Pick Up/Drop Off:</label>
      <input
        type="text"
        name="pickUpDropOff"
        value={itineraryData.pickUpDropOff}
        onChange={handleItineraryChange}
        required
      />
    </div>
    <button type="submit">Add Itinerary</button>
  </form>
)}

{/* Filter Itineraries */}
<div>
  <h3>Filter Itineraries by Month</h3>
  <select
    onChange={(e) => handleMonthFilter(e.target.value)}
    value={selectedMonth}
  >
    <option value="">All Months</option>
    {Array.from({ length: 12 }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {new Date(0, i).toLocaleString("default", { month: "long" })}
      </option>
    ))}
  </select>
</div>

{/* Itineraries List */}
{filteredItineraries.length > 0 ? (
  filteredItineraries.map((itinerary) => (
    <div key={itinerary._id} style={styles.listItem}>
      <h4>Locations: {itinerary.Locations.join(", ")}</h4>
      <p>Dates: {itinerary.DatesTimes}</p>
      <p>Timeline: {itinerary.Timeline}</p>
      <button onClick={() => handleViewItinerary(itinerary)}>
        {selectedItinerary === itinerary && isIVisible ? "Hide Details" : "View Details"}
      </button>
      <button onClick={() => handleViewReport(itinerary._id)}>
        {itineraryReports[itinerary._id]?.visible ? "Hide Report" : "View Report"}
      </button>

      {/* Itinerary Details */}
      {selectedItinerary === itinerary && isIVisible && (
        <div style={styles.section}>
          <p><strong>Activities:</strong> {itinerary.Activities.join(', ')}</p>
          <p><strong>Timeline:</strong> {itinerary.Timeline}</p>
          <p><strong>Duration of Activity:</strong> {itinerary.DurationOfActivity}</p>
          <p><strong>Language:</strong> {itinerary.Language}</p>
          <p><strong>Price:</strong> ${itinerary.Price}</p>
          <p><strong>Accessibility:</strong> {itinerary.Accesibility}</p>
          <p><strong>Pick Up/Drop Off:</strong> {itinerary.pickUpDropOff}</p>
          <p><strong>Booked:</strong> {itinerary.Booked ? "Yes" : "No"}</p>
          <p><strong>Tour Guide:</strong> {itinerary.TourGuide}</p>
          <p><strong>Active:</strong> {itinerary.active ? "Yes" : "No"}</p>
          <div>
            <button onClick={() => handleEditItinerary(itinerary)}>Edit</button>
            <button onClick={() => handleDeleteItinerary(itinerary._id)}>Delete</button>
          </div>
        </div>
      )}

      {/* Report Details */}
      {itineraryReports[itinerary._id]?.visible && (
        <div className="report-section">
          <h4>Report</h4>
          <p><strong>Total Tourists:</strong> {itineraryReports[itinerary._id].totalTourists}</p>
          {itineraryReports[itinerary._id].tourists.length > 0 ? (
            <ul>
              {itineraryReports[itinerary._id].tourists.map((tourist, index) => (
                <li key={index}>{tourist.Username} - {tourist.Email}</li>
              ))}
            </ul>
          ) : (
            <p>No tourists booked this itinerary yet.</p>
          )}
        </div>
      )}

      {/* Edit Itinerary Form */}
      {selectedItinerary === itinerary && isEditingItinerary && (
        <form onSubmit={handleUpdateItinerary} style={styles.section}>
          <div>
            <label>Activities:</label>
            <input
              type="text"
              name="Activities"
              value={itineraryData.Activities}
              onChange={handleItineraryChange}
              required
            />
          </div>
          <div>
            <label>Locations:</label>
            <input
              type="text"
              name="Locations"
              value={itineraryData.Locations}
              onChange={handleItineraryChange}
              required
            />
          </div>
          <div>
            <label>Timeline:</label>
            <input
              type="text"
              name="Timeline"
              value={itineraryData.Timeline}
              onChange={handleItineraryChange}
              required
            />
          </div>
          <div>
            <label>Duration Of Activity:</label>
            <input
              type="text"
              name="DurationOfActivity"
              value={itineraryData.DurationOfActivity}
              onChange={handleItineraryChange}
              required
            />
          </div>
          <div>
            <label>Language:</label>
            <input
              type="text"
              name="Language"
              value={itineraryData.Language}
              onChange={handleItineraryChange}
              required
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="Price"
              value={itineraryData.Price}
              onChange={handleItineraryChange}
              required
            />
          </div>
          <div>
            <label>Dates/Times 'YYYY-MM-DD':</label>
            <input
              type="text"
              name="DatesTimes"
              value={itineraryData.DatesTimes}
              onChange={handleItineraryChange}
              required
            />
          </div>
          <div>
            <label>Accessibility:</label>
            <input
              type="text"
              name="Accesibility"
              value={itineraryData.Accesibility}
              onChange={handleItineraryChange}
              required
            />
          </div>
          <div>
            <label>Pick Up/Drop Off:</label>
            <input
              type="text"
              name="pickUpDropOff"
              value={itineraryData.pickUpDropOff}
              onChange={handleItineraryChange}
              required
            />
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditingItinerary(false)}>Cancel</button>
        </form>
      )}
    </div>
  ))
) : (
  <p>No itineraries found.</p>
)}
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
  photoSection: {
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
  section: {
    top:'-50px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  },
  feedbackList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  feedbackItem: {
    padding: '15px',
    backgroundColor: '#e8f5e9',
    borderRadius: '5px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
}
export default TourGuideProfile;


