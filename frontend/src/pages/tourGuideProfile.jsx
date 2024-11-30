import React, { useState, useEffect} from 'react';
import image from '../images/image.png';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { FaBell,FaSearch, FaBox, FaLandmark, FaUniversity, FaMap, FaRunning, FaPlane, FaHotel, FaClipboardList, FaStar, FaBus } from 'react-icons/fa';
import { MdNotificationImportant } from 'react-icons/md';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
function TourGuideProfile() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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

  useEffect(() => {
    fetchTourGuideData();
    fetchItineraries();
    setLoading(false);
    fetchTouristItineraries();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoURL = URL.createObjectURL(file);
      setPhoto(photoURL); 
      setFormData((prevData) => ({
        ...prevData,
        photo: file,
      }));
    }
  };
  const fetchTourGuideData = async () => {
    const Username = localStorage.getItem('Username');

    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getTourGuide?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setTourGuideInfo(data);
            setFormData(data);
            setErrorMessage('');

            if (data.photo) {
              setPhoto(data.photo);
              localStorage.setItem('photo', data.photo); // Store photo URL in local storage
            }
          } else {
            setErrorMessage('No tour guide information found.');
          }
        } else {
          throw new Error('Failed to fetch tour guide information');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching tour guide information');
        console.error(error);
      }
    } else {
      setErrorMessage('No tour guide information found.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const Username = localStorage.getItem('Username');
  
    const formDataToSend = new FormData();
    formDataToSend.append('Username', Username);
  
    if (formData.Email) formDataToSend.append('Email', formData.Email);
    if (formData.mobileNumber) formDataToSend.append('mobileNumber', formData.mobileNumber);
    if (formData.yearsOfExperience) formDataToSend.append('yearsOfExperience', formData.yearsOfExperience);
    if (formData.previousWork) formDataToSend.append('previousWork', formData.previousWork);
    if (formData.photo) formDataToSend.append('photo', formData.photo);
    try {
      const response = await fetch(`http://localhost:8000/updateTourGuide/${Username}`, {
        method: 'PATCH',
        body: formDataToSend,
      });
  
      if (response.ok) {
        await fetchTourGuideData(); // Refresh the data after update
        setErrorMessage('');
        setIsEditing(false);
  
        // Update the photo in local storage if it was uploaded
        if (formData.photo) {
          const photoURL = URL.createObjectURL(formData.photo);
          setPhoto(photoURL);
          localStorage.setItem('photo', photoURL); // Update photo URL in local storage
        }
      } else {
        throw new Error('Failed to update tour guide information');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating tour guide information');
      console.error(error);
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
{/* Header */}
<header style={styles.header}>
<div style={styles.logoContainer}>
  <img src={image} alt="Logo" style={styles.logo} />
</div>
<h1 style={styles.title}>Tour Guide Profile</h1>


 <LockResetIcon
    alt="Profile Icon"
    style={{cursor: 'pointer', color: 'white', marginRight: '-490px' }}
    onClick={handleViewReport}
  />


{/* Profile Icon */}
<ManageAccountsIcon
  style={styles.profileIcon}
  title="Edit Profile"
  onClick={handleViewReport} // Open modal on click
/>
</header>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {tourGuideInfo?.flaggedItineraries.length > 0 ? (
          <div>
                <h3>Flagged Itineraries</h3>
                <ul>
                  {tourGuideInfo.flaggedItineraries.map((itinerary) => (
                    <li key={itinerary._id}>
                      <p><strong>Locations:</strong> {itinerary.Locations.join(', ')}</p>
                      <p><strong>Dates:</strong> {itinerary.DatesTimes}</p>
                    </li>
                  ))}
                </ul>
          </div>
              ) : (
                <p>No flagged itineraries.</p>
              )}
        {loading ? (
          <p>Loading tour guide information...</p>
        ) : (
          <>
          <button onClick={handleDeleteRequest} disabled={waiting || requestSent}>
              {waiting ? 'Waiting to be deleted...' : requestSent ? 'Request Sent' : 'Delete Account'}
            </button>
            
            <button onClick={toggleProfileDetails}>{isVisible ? 'Hide' : 'Show'} Profile Details</button>
            {isVisible && (
              <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {photo && <img src={`http://localhost:8000/${photo.replace(/\\/g, '/')}`} alt="Tour Guide Photo" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />}
                <p><strong>Username:</strong> {tourGuideInfo?.Username}</p> </div>
                <div>
                <p><strong>Email:</strong> {tourGuideInfo?.Email}</p> 
                <p><strong>Mobile Number:</strong> {tourGuideInfo?.mobileNumber}</p> 
               <p><strong>Years of Experience:</strong> {tourGuideInfo?.yearsOfExperience}</p> 
               <p><strong>Previous Work:</strong> {tourGuideInfo?.previousWork}</p> 
               
      <p>Feedback</p>
      {tourGuideInfo.feedback.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        tourGuideInfo.feedback.map((feedback, index) => (
          <div key={index}>
            <p><strong>{feedback.touristUsername}:</strong></p>
            <p>Rating: {feedback.rating}/5 and commented:</p>
            <p>{feedback.comment}</p>
          </div>
        ))
      )}
                <button onClick={handleEditToggle}>{isEditing ? 'Cancel Edit' : 'Edit Data'}</button>
              </div>
              </div>
            )}
    
            {isEditing && (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                {photo && <img src={`http://localhost:8000/${photo.replace(/\\/g, '/')}`} alt="photo" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />}
                  <label>Username:</label>
                  <p> {tourGuideInfo?.Username}</p> 
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Mobile Number:</label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Years of Experience:</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Previous Work:</label>
                  <input
                    type="text"
                    name="previousWork"
                    value={formData.previousWork}
                    onChange={handleChange}
                  />
                </div>
                <div>
              <label><strong>Photo:</strong></label>
              <input
                type="file"
                accept="image/*" // Accept any image type
                onChange={handleLogoChange}
              />
            </div>
                <button type="submit">Update Data</button>
              </form>
            )}
            
            
    
            <h3>Itineraries</h3>
            <button onClick={() => setIsCreatingItinerary((prev) => !prev)}>
              {isCreatingItinerary ? 'Cancel Creating Itinerary' : 'Create Itinerary'}
            </button>
    
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
    
{filteredItineraries.length > 0 ? (
  filteredItineraries.map((itinerary) => (
    <div key={itinerary._id}>
      <h4>Locations: {itinerary.Locations.join(", ")}</h4>
      <p>Dates: {itinerary.DatesTimes}</p>
      <button onClick={() => handleViewReport(itinerary._id)}>
        {itineraryReports[itinerary._id]?.visible ? "Hide Report" : "View Report"}
      </button>

      {/* Display the report for this itinerary if visible */}
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
    </div>
  ))
) : (
  <p>No itineraries found.</p>
)}

            {selectedItinerary && !isEditingItinerary && isIVisible &&(
              <div>
              <p><strong>Locations:</strong> {selectedItinerary.Locations.join(', ')}</p>
              <p><strong>Timeline:</strong> {selectedItinerary.Timeline}</p>
              <p><strong>Duration of Activity:</strong> {selectedItinerary.DurationOfActivity}</p>
              <p><strong>Language:</strong> {selectedItinerary.Language}</p>
              <p><strong>Accessibility:</strong> {selectedItinerary.Accesibility}</p>
              <p><strong>Pick Up/Drop Off:</strong> {selectedItinerary.pickUpDropOff}</p>
              <p><strong>Booked:</strong> {selectedItinerary.Booked ? 'Yes' : 'No'}</p>
              <p><strong>Tour Guide:</strong> {selectedItinerary.TourGuide}</p>
              <p><strong>Active:</strong> {selectedItinerary.active ? "Yes" : "No"}</p>
            </div>
            )}
            {selectedItinerary && isEditingItinerary && (
              <div>
                <h3>Edit Itinerary</h3>
                <form onSubmit={handleUpdateItinerary}>
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
                  <button type="submit">Update Itinerary</button>
                  <button type="button" onClick={() => setIsEditingItinerary(false)}>Cancel</button>
                </form>
              </div>
            )}
          </>
        )}
        <h3>Tourist itineraries</h3>
        <button onClick={() => setIsCreatingTouristItinerary((prev) => !prev)}>
          {isCreatingTouristItinerary ? 'Cancel Creating Tourist Itinerary' : 'Create Tourist Itinerary'}
        </button>
    
        {isCreatingTouristItinerary && (
          <form onSubmit={handleTouristItinerarySubmit}>
            <div>
              <label>Activities:</label>
              <input
                type="text"
                name="Activities"
                value={touristItineraryData.Activities}
                onChange={handleTouristItineraryChange}
                required
              />
            </div>
            <div>
              <label>Locations:</label>
              <input
                type="text"
                name="Locations"
                value={touristItineraryData.Locations}
                onChange={handleTouristItineraryChange}
                required
              />
            </div>
            <div>
              <label>start date:</label>
              <input
                type="text"
                name="startDate"
                value={touristItineraryData.startDate}
                onChange={handleTouristItineraryChange}
                required
              />
            </div>
            <div>
              <label>End date:</label>
              <input
                type="text"
                name="endDate"
                value={touristItineraryData.endDate}
                onChange={handleTouristItineraryChange}
                required
              />
            </div>
            <div>
              <label>Tags:</label>
              <input
                type="text"
                name="Tags"
                value={touristItineraryData.Language}
                onChange={handleTouristItineraryChange}
                required
              />
            </div>
            <button type="submit">Add Tourist Itinerary</button>
          </form>
        )}
        
    
        {touristItineraries.length > 0 ? (
          touristItineraries.map((touristItinerary) => (
            <div key={touristItinerary._id}>
              <h4>Locations: {touristItinerary.Locations.join(', ')}</h4>
              <p>Start date: {touristItinerary.startDate}</p>
              <button onClick={() => handleViewTouristItinerary(touristItinerary)}>View Details</button>
              <button onClick={() => handleEditTouristItinerary(touristItinerary)}>Edit Tourist Itinerary</button>
              <button onClick={() => handleDeleteTouristItinerary(touristItinerary._id)}>Delete Tourist Itinerary</button>
            </div>
          ))
        ) : (
          <p>No tourist itineraries found.</p>
        )}
        {selectedTouristItinerary && !isEditingTouristItinerary&& isTIVisible &&(
              <div>
              <p><strong>Activities:</strong> {selectedTouristItinerary.Activities.join(', ')}</p>
              <p><strong>Locations:</strong> {selectedTouristItinerary.Locations}</p>
              <p><strong>Start date:</strong> {selectedTouristItinerary.startDate}</p>
              <p><strong>End date:</strong> {selectedTouristItinerary.endDate}</p>
              <p><strong>Tags:</strong> {selectedTouristItinerary.Tags}</p>
              <p><strong>Tour Guide:</strong> {selectedTouristItinerary.tourGuide}</p>
            </div>
            )}
        {selectedTouristItinerary && isEditingTouristItinerary && (
          <div>
            <h3>Edit Tourist Itinerary</h3>
            <form onSubmit={handleUpdateTouristItinerary}>
              <div>
                <label>Activities:</label>
                <input
                  type="text"
                  name="Activities"
                  value={touristItineraryData.Activities}
                  onChange={handleTouristItineraryChange}
                  required
                />
              </div>
              <div>
                <label>Locations:</label>
                <input
                  type="text"
                  name="Locations"
                  value={touristItineraryData.Locations}
                  onChange={handleTouristItineraryChange}
                  required
                />
              </div>
              <div>
                <label>Start date:</label>
                <input
                  type="text"
                  name="startDate"
                  value={touristItineraryData.startDate}
                  onChange={handleTouristItineraryChange}
                  required
                />
              </div>
              <div>
                <label>End date:</label>
                <input
                  type="text"
                  name="endDate"
                  value={touristItineraryData.endDate}
                  onChange={handleTouristItineraryChange}
                  required
                />
              </div>
              <div>
                <label>Tags:</label>
                <input
                  type="text"
                  name="Tags"
                  value={touristItineraryData.Tags}
                  onChange={handleTouristItineraryChange}
                  required
                />
              </div>
              <button type="submit">Update Tourist Itinerary</button>
              <button type="button" onClick={() => setIsEditingTouristItinerary(false)}>Cancel</button>
            </form>
          </div>
        )}
        <div>
  <h3>Change Password</h3>
  <form onSubmit={handlePasswordChange}>
    <div>
      <label>Current Password:</label>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
    </div>
    <div>
      <label>New Password:</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
    </div>
    <button type="submit" disabled={isChangingPassword}>
      {isChangingPassword ? 'Changing Password...' : 'Change Password'}
    </button>
  </form>

  {passwordChangeMessage && <p style={{ color: 'green' }}>{passwordChangeMessage}</p>}
  {passwordChangeError && <p style={{ color: 'red' }}>{passwordChangeError}</p>}
</div>
<div>
  <button onClick={()=> navigate('/guideReport')} >View Report</button>
</div>

      </div>
      
   
     
  )         
}

const styles = {
  container: {
    marginTop:'150px',
    margin: '90px auto',
    maxWidth: '1000px',
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
    marginLeft:'90px'
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
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
    top: '280px', // Adjust placement
  }
}
export default TourGuideProfile;


