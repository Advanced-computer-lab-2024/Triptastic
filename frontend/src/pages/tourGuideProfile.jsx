import React, { useState, useEffect} from 'react';
import image from '../images/image.png';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { FaBell,FaSearch,FaUserCircle, FaBox, FaLandmark, FaUniversity,  FaSync,
  FaFilter,
  FaDollarSign,
  FaMapMarkedAlt,
  FaCalendarDay,
  FaChartLine,FaClipboardList,FaMap, FaRunning, FaPlane, FaHotel, FaStar, FaBus } from 'react-icons/fa';
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

const [isLoading, setIsLoading] = useState(false);
const [totalSales, setTotalSales] = useState(0);
const [refresh, setRefresh] = useState(false);
const [mostSold, setMostSold] = useState();
const [leastSold, setLeastSold] = useState();
const [date, setDate] = useState('');
const [filteredD, setFilteredD] = useState(false);
const [filterI, setFilterI] = useState(null);
const [dates, setDates] = useState([]);
const [count, setCount] = useState(0);
const [filteredI, setFilteredI] = useState(false);
const [showDropdown, setShowDropdown] = useState(false);
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
  const filterByItinerary = async (itineraryId) => {
    try{
      const response = await fetch(`http://localhost:8000/filterByItinerary?itineraryId=${itineraryId}`);
      if (response.ok) {
        const data = await response.json();
        setDates(data);
        setCount(data.length);
      }
      else {
        console.error('Failed to fetch data');
      }
    }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
  const fetchFilteredItineraries = async (date) => {
      const Username = localStorage.getItem('Username');
      setIsLoading(true);
      try{
      const response = await fetch(`http://localhost:8000/getFilteredItineraries?Username=${Username}&date=${date}`);
      if (response.ok) {
          const data = await response.json();
          setItineraries(data);
          setIsLoading(false);
      } else {
          console.error('Failed to fetch itineraries');
      }
      } catch (error) {
          console.error('Error fetching itineraries:', error);
      }
  };
    const calculateTotalSales = (itineraries) => {
      const total = itineraries.reduce((sum, itinerary) => sum + itinerary.sales, 0);
      setTotalSales(total);
    };
    const findMostSold = (itineraries) => {
      if (itineraries.length > 0) {
        const mostSoldItinerary = itineraries.reduce((max, itinerary) => (itinerary.sales > max.sales ? itinerary : max), itineraries[0]);
        setMostSold(mostSoldItinerary);
      }
    };
  
    const findLeastSold = (itineraries) => {
      if (itineraries.length > 0) {
        const leastSoldItinerary = itineraries.reduce((min, itinerary) => (itinerary.sales < min.sales ? itinerary : min), itineraries[0]);
        setLeastSold(leastSoldItinerary);
      }
    };
    const handleFilterD = () => {
      if(!filteredD){
          fetchFilteredItineraries(date);
          setFilteredD(true);
          findMostSold(itineraries);
          findLeastSold(itineraries);
      }else{
          fetchItineraries();
          setFilteredD(false);
          findMostSold(itineraries);
          findLeastSold(itineraries);
      }
      };
  
      useEffect(() => {
        fetchItineraries();
        fetchTourGuideData()
      }, []); // Only run once on mount
      
    const handleFilterChange = (itineraryId) => {
      const selectedItinerary = itineraries.find(itinerary => itinerary._id === itineraryId);
      if (selectedItinerary) {
        filterByItinerary(selectedItinerary._id); // Call the filter function for the selected itinerary
        setFilteredI(true); // Mark that itineraries are filtered
        setFilterI(selectedItinerary); // Save the selected itinerary
      } else {
        setFilteredI(false); // Reset if no itinerary is selected
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
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  }; 
  const togglePasswordModal = () => setShowPasswordModal(!showPasswordModal);
  useEffect(() => {
    calculateTotalSales(itineraries);
    findMostSold(itineraries);
    findLeastSold(itineraries);
  }, [itineraries]); // Re-run when itineraries change
  

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
  useEffect(() => {
    if (!selectedMonth) {
      setFilteredItineraries(itineraries); // Show all if no month selected
    } else {
      const filtered = itineraries.filter((itinerary) => {
        const month = new Date(itinerary.DatesTimes).getMonth() + 1;
        return month === Number(selectedMonth);
      });
      setFilteredItineraries(filtered);
    }
  }, [selectedMonth, itineraries]);
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
  setSelectedMonth(month); // Update the dropdown value

  const Username = localStorage.getItem("Username");

  if (!Username) {
    console.error("No logged-in username found.");
    return;
  }

  if (!month) {
    // Reset to show all itineraries
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
      console.error("Failed to fetch filtered itineraries");
      const errorData = await response.json();
      console.error(errorData.message || "Error fetching filtered data");
      setFilteredItineraries([]); // Clear if no results or error
    }
  } catch (error) {
    console.error("An error occurred while filtering itineraries:", error);
    setFilteredItineraries([]); // Clear in case of error
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
      <div style={styles.manageAccountContainer}>
  <ManageAccountsIcon
    style={styles.profileIcon}
    title="Manage Account Settings"
    onClick={() => setShowDropdown((prev) => !prev)} // Toggle dropdown
  />
  {showDropdown && (
    <div style={styles.dropdownMenu}>
      <div
        style={styles.dropdownItem}
        onClick={() => {
          setShowDropdown(false); // Close dropdown
          toggleModal(); // Open Edit Profile modal
        }}
      >
        Edit Profile
      </div>
      <div
        style={styles.dropdownItem}
        onClick={() => {
          setShowDropdown(false); // Close dropdown
          togglePasswordModal(); // Open Change Password modal
        }}
      >
        Change Password
      </div>
    </div>
  )}
</div>
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
        <div  class="itineraries" style={styles.item} onClick={() => navigate('/my-itineraries')}>
          <FaMap style={styles.icon} />
          <span className="label" style={styles.label}>
            My Itineraries
          </span>
        </div>
        <div  class="report" style={styles.item} onClick={() => navigate('/guideReport')}>
          <FaStar style={styles.icon} />
          <span className="label" style={styles.label}>
            Reviews
          </span>
        </div>
      
      
     
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
                    {itineraryReports[itinerary._id].tourists.map(
                      (tourist, index) => (
                        <tr
                          key={index}
                          style={
                            index % 2 === 0
                              ? styles.tableRow
                              : styles.tableRowAlt
                          } // Alternating row colors
                        >
                          <td style={styles.tableCell}>{tourist.Username}</td>
                          <td style={styles.tableCell}>{tourist.Email}</td>
                        </tr>
                      )
                    )}
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

  {/* Filter Section */}
  <div style={styles.filterContainer}>
    <h3 style={styles.filterTitle}>
      <DisplaySettingsIcon style={styles.filterIcon} /> Filter Reports
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
</div>

<div style={styles.filtersWrapper}>
  {/* Date Filter */}
  <div style={styles.dateFilter}>
    <FaCalendarDay style={styles.iconn} />
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      style={styles.dateInput}
    />
  </div>


  {/* Apply/Reset Filter by Date */}
  <button style={styles.filterButton} onClick={handleFilterD}>
    <FaFilter style={styles.iconf} /> {filteredD ? "Clear Filter" : "Filter"}
  </button>

  {/* Itinerary Filter */}
  <div style={styles.itineraryFilter}>
    <label htmlFor="itineraryDropdown" style={styles.filterLabel}>
      <DisplaySettingsIcon style={styles.iconn} /> Filter by Itinerary:
    </label>
    <select
      id="itineraryDropdown"
      value={filterI ? filterI._id : ""}
      onChange={(e) => handleFilterChange(e.target.value)}
      style={styles.dropdown}
    >
      <option value="">Select an itinerary</option>
      {itineraries.map((itinerary) => (
        <option key={itinerary._id} value={itinerary._id}>
          {itinerary.Locations.join(", ")}
        </option>
      ))}
    </select>
  </div>
</div>


{/* Statistics Section */}
<div style={styles.reportSection}>
  {!filteredI && !filteredD && (
    <>
      <h3 style={styles.sectionTitlee}>
       Total Profit from Sales: ${totalSales}
      </h3>
      {mostSold && (
        <div style={styles.itineraryCard}>
          <h4 style={styles.cardTitle}>
            <FaChartLine style={styles.iconn} /> Most Sold Itinerary
          </h4>
          <p><strong>Locations:</strong> {mostSold.Locations.join(", ")}</p>
          <p><strong>Price:</strong> ${mostSold.Price}</p>
          <p><strong>Sales:</strong> ${mostSold.sales}</p>
        </div>
      )}
      {leastSold && (
        <div style={styles.itineraryCard}>
          <h4 style={styles.cardTitle}>
            <FaChartLine style={styles.iconn} /> Least Sold Itinerary
          </h4>
          <p><strong>Locations:</strong> {leastSold.Locations.join(", ")}</p>
          <p><strong>Price:</strong> ${leastSold.Price}</p>
          <p><strong>Sales:</strong> ${leastSold.sales}</p>
        </div>
      )}
    </>
  )}
</div>


{/* Reports Section */}
<div style={styles.reportSection}>
  {/* Filtered by Date */}
  {filteredD && (
    <div style={styles.filteredSection}>
      <h3 style={styles.sectionTitle}>
        <FaCalendarDay style={styles.iconn} /> Filtered by Date: {date}
      </h3>
      {itineraries.map((itinerary) => (
        <div key={itinerary._id} style={styles.itineraryCard}>
          <p><strong>Locations:</strong> {itinerary.Locations.join(", ")}</p>
          <p><strong>Price:</strong> ${itinerary.Price}</p>
          <p><strong>Sales:</strong> ${itinerary.sales}</p>
        </div>
      ))}
    </div>
  )}


  {/* Filtered by Itinerary */}
  {filteredI && filterI && (
    <div style={styles.filteredSection}>
      <h3 style={styles.sectionTitle}>
        <FaClipboardList style={styles.iconn} /> Selected Itinerary
      </h3>
      <p><strong>Locations:</strong> {filterI.Locations.join(", ")}</p>
      <p><strong>Price:</strong> ${filterI.Price}</p>
      <p><strong>Sales:</strong> ${filterI.sales}</p>
      <p><strong>Bookings:</strong> {count}</p>
      <ul>
        {dates.map((date, index) => (
          <li key={index}>{date}</li>
        ))}
      </ul>
      <p><strong>Cancellations:</strong> {count - filterI.sales / filterI.Price}</p>
    </div>
  )}


  {/* All Itineraries */}
  {!filteredI && !filteredD && (
    <div style={styles.itineraryList}>
      <h3 style={styles.sectionTitle}>
        <FaMapMarkedAlt style={styles.iconn} /> All Itineraries
      </h3>
      {itineraries.length > 0 ? (
        itineraries.map((itinerary) => (
          <div key={itinerary._id} style={styles.itineraryCard}>
            <p><strong>Locations:</strong> {itinerary.Locations.join(", ")}</p>
            <p><strong>Price:</strong> ${itinerary.Price}</p>
            <p><strong>Sales:</strong> ${itinerary.sales}</p>
          </div>
        ))
      ) : (
        <p>No itineraries found.</p>
      )}
    </div>
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
    marginLeft:'50px'
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
  },
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
  sidebarExpanded: {
    width: '200px', // Width when expanded
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the left
    padding: '10px',
    width: '100%', // Take full width of the sidebar
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  iconContainerHover: {
    backgroundColor: '#084B24', // Background on hover
  },
  icon: {
    fontSize: '24px',
    marginLeft: '15px', // Move icons slightly to the right
    color: '#fff', // Icons are always white
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
  labelVisible: {
    opacity: 1, // Fully visible when expanded
  },
  manageAccountContainer: {
    position: "relative",
    display: "inline-block",
  },
  dropdownMenu: {
    position: "absolute",
    top: "40px",
    right: "0",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    minWidth: "150px",
    overflow: "hidden",
  },
  dropdownItem: {
    padding: "10px 15px",
    fontSize: "14px",
    color: "#333",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  dropdownItemHover: {
    backgroundColor: "#f5f5f5",
  },
  item: {
 
    padding: '10px 0',
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
  filterInput: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  statisticsSection: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f7fdf8',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
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
    justifyContent: "space-between", // Space between the two sections
    alignItems: "flex-start", // Align at the top
    gap: "20px", // Add some space between them
    color:'#0F5132',
    fontSize:'14px'
  },
  
  filterContainer: {
    backgroundColor: "#white",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "200px",
    marginTop:'70px'
  },
  filtersWrapper: {
    display: "flex",
    justifyContent: "flex-end", // Align the entire section to the right
    alignItems: "center", // Vertically align items
    gap: "10px", // Maintain smaller gaps between elements
    padding: "10px 20px", // Add padding for a cleaner layout
    backgroundColor: "#fff", // White background for visibility
    borderRadius: "10px", // Rounded corners for a polished look
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
    maxWidth: "600px", // Limit width for better layout
    margin: "20px auto", // Center horizontally in its container
  },
  
  dateFilter: {
    display: "flex",
    alignItems: "center", // Align the input and icon
    gap: "10px", // Ensure the icon and input are close
  },
  
  dateInput: {
    padding: "6px 10px", // Adjust padding for better sizing
    borderRadius: "5px", // Rounded corners
    border: "1px solid #ccc", // Light border for better contrast
    fontSize: "14px", // Standardize font size
  },
  
  filterButton: {
    backgroundColor: "#0F5132", // Green button
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
    display: "flex",
    alignItems: "center", // Align the icon and text
    gap: "5px",
  },
  
  itineraryFilter: {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Ensure close proximity between label and dropdown
  },
  
  filterLabel: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#0F5132",
  },
  
  dropdown: {
    padding: "6px 10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  
  
  reportsSection: {
    flex: "3",
  },
  sectionTitle: {
    fontSize: "25px",
    color: "#0F5132",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  sectionTitlee: {
    fontSize: "23px", // Increased font size for better visibility
    color: "#0F5132", // Green color for the text
    textAlign: "center", // Center the text horizontally
    display: "flex", // Use flexbox for alignment
    alignItems: "center", // Center the content vertically
    justifyContent: "center", // Center the content horizontally
  },
  
  titleText: {
    color: '#0F5132', // Green shade for the title
  },

  flagIcon: {
    fontSize: "20px",
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
    marginTop: "20px",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#0F5132",
    marginBottom: "10px",
  },
  sectionIcon: {
    fontSize: "20px",
    color: "#0F5132",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
    position: "relative",
  },
  itineraryInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  listText: {
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  noData: {
    fontSize: "14px",
    color: "#777",
    textAlign: "center",
  },
  feedbackList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  feedbackItem: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  feedbackUser: {
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  feedbackDate: {
    fontSize: "12px",
    color: "#777",
    textAlign: "right",
    marginTop: "5px",
  },
  filterMainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    margin: "20px 0",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  
  filterSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    width: "100%",
  },
  iconn: {
    fontSize: "14px",
    color: "#0F5132",
  },
  iconf: {
    fontSize: "14px",
    color: "white",
  },
  filteredSection: {
    marginTop: "15px",
    backgroundColor: "#f7fdf8",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    fontSize: "13px",
    color: "#333",
  },
  statisticsSection: {
    marginTop: "15px",
    padding: "12px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#0F5132",
    marginBottom: "8px",
  },
  itineraryCard: {
    marginTop: "12px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "13px",
  },

  sectionTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "bold",
    color: "#0F5132",
    gap: "5px",
    marginBottom: "10px",
  },
  reportSection: {
    marginTop: "15px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Arial', sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    fontSize: "13px",
    color: "#333",
  },
  tableHead: {
    backgroundColor: "#0F5132",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "left",
  },
  tableHeadCell: {
    padding: "10px",
    border: "1px solid #ccc",
    fontSize: "13px",
  },
  tableRow: {
    backgroundColor: "#fff",
    textAlign: "left",
  },
  tableCell: {
    padding: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "13px",
  },
  tableRowAlt: {
    backgroundColor: "#f9f9f9",
  },
  
}
export default TourGuideProfile;


