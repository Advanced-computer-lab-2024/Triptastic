import React, { useState, useEffect } from 'react';

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

  const [tourGuideInfo, setTourGuideInfo] = useState(null);
  const [itineraries, setItineraries] = useState([]);
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
    const savedPhoto = localStorage.getItem('photo');
    if (savedPhoto) {
      setPhoto(savedPhoto);
    }
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
  }

  
};
  return (
  
    
      <div>
        <h2>Tour Guide Profile</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
                <button onClick={handleEditToggle}>{isEditing ? 'Cancel Edit' : 'Edit Data'}</button>
              </div>
              </div>
            )}
    
            {isEditing && (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                {photo && <img src={photo} alt="photo" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />}
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
    
            {itineraries.length > 0 ? (
              itineraries.map((itinerary) => (
                <div key={itinerary._id}>
                  <h4>Locations: {itinerary.Locations.join(', ')}</h4>
                  <p>Dates: {itinerary.DatesTimes}</p>
                  <button onClick={() => handleViewItinerary(itinerary)}>View Details</button>
                  <button onClick={() => handleEditItinerary(itinerary)}>Edit Itinerary</button>
                  <button onClick={() => handleDeleteItinerary(itinerary._id)}>Delete Itinerary</button>
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

      </div>
      
   
     
  )         
}

export default TourGuideProfile;


