import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell,FaPlus,FaChartBar,FaBox  } from 'react-icons/fa'; // Importing bell icon
import { FaUserCircle} from 'react-icons/fa';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import { FaTag, FaInfoCircle, FaDollarSign, FaStar, FaImage ,FaSearch} from "react-icons/fa";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Inventory2Icon from '@mui/icons-material/Inventory2';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
    Email:''
  });
  const [requests, setRequests] = useState([]);
  const [createCategoryName, setCreateCategoryName] = useState('');
  const [searchCategoryName, setSearchCategoryName] = useState('');
  const [categorySearchResult, setCategorySearchResult] = useState(null);
  const [usernameToDelete, setUsernameToDelete] = useState('');
  const [userType, setUserType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [deleteCategoryName, setDeleteCategoryName] = useState('');
  const [prefTagName, setPrefTagName] = useState('');
  const [createPrefTagMessage, setCreatePrefTagMessage] = useState('');
  const [prefTag, setPrefTag] = useState(null);
  const [error, setError] = useState('');
  const [newPrefTagName, setNewPrefTagName] = useState('');
  const [message, setMessage] = useState('');
  const [Itineraries,setItineraries]= useState('');
  const [touristItineraries,setTouristItineraries]= useState('');
  const [Activities,setActivities]= useState('');
  const [showingItineraries,setShowingItineraries]=useState(false);
  const [showingTouristItineraries,setShowingTouristItineraries]=useState(false);
  const [showingActivities,setShowingActivities]=useState(false);
  const [productNameToSearch, setProductNameToSearch] = useState('');
  const [productSearchResult, setProductSearchResult] = useState(null);
  const [productNameToArchive, setProductNameToArchive] = useState(''); // New state variable
  const [showNotifications, setShowNotifications] = useState(false); // Toggle notification dropdown
  const [statistics, setStatistics] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [showStats, setShowStats] = useState(false); // State to toggle visibility
  const [notifications, setNotifications] = useState([]); // Initialize as an empty array
  


  const [complaintIdToSearch, setComplaintIdToSearch] = useState('');
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [complaintError, setComplaintError] = useState('');
  const [complaintIdToUpdate, setComplaintIdToUpdate] = useState('');
  const [complaintStatus, setComplaintStatus] = useState('pending');
  const [updateStatusMessage, setUpdateStatusMessage] = useState('');
  const [updateStatusError, setUpdateStatusError] = useState('');
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null); 

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };
  const [productFormData, setProductFormData] = useState({
    productName: '',
    description: '',
    price: '',
    rating: '',
    seller: '',
    review: '',
    stock: '',
    image: ''
  });

  const [tourismGovData, setTourismGovData] = useState({
    Username: '',
    Password: ''
  });
  const [updateCategoryData, setUpdateCategoryData] = useState({
    currentName: '',
    newName: ''
  });

  const navigate = useNavigate();

  const handleViewItineraries=()=>{
    setShowingItineraries( prev=>!prev);
  }
  const handleViewActivities=()=>{
    setShowingActivities( prev=>!prev);
  }
  const handleViewTouristItineraries=()=>{
    setShowingTouristItineraries( prev=>!prev);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  useEffect(() => {
    getItineraries();
    getTouristItineraries();
    getActivities();
    checkoutOfStock();
    fetchNotifications();
    fetchStatistics();

  }, []);
  const addNotification = (message) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id: Date.now(), message },
    ]);
  };
 
  const fetchNotifications = async () => {
    const Username = localStorage.getItem('Username');

    try {
      const response = await fetch(`http://localhost:8000/getNotificationsForAdmin?Username=${Username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications); // Assuming the response contains a "notifications" array
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
 

  
    
  
  const handleNotificationClick = async () => {
    const Username = localStorage.getItem('Username');
  
    setShowNotifications((prev) => !prev);
  
    if (!showNotifications) {
      try {
        const response = await fetch(`http://localhost:8000/getNotificationsForAdmin?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          if (!data.notifications || data.notifications.length === 0) {
            console.log('No new notifications found.');
            return;
          }
          // Filter and append unique notifications
          const uniqueNotifications = data.notifications.filter(
            (newNotification) =>
              !notifications.some((existingNotification) =>
                existingNotification.message === newNotification.message
              )
          );
  
          setNotifications((prev) => [...prev, ...uniqueNotifications]);
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };
  const checkoutOfStock = async () => {
    const Username = localStorage.getItem('Username');

    try {
      const response = await fetch(`http://localhost:8000/checkAndNotifyOutOfStockAdmin?Username=${Username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Validate and merge notifications
        const newNotifications = data.notifications.filter(
          (notification) =>
            !notifications.some((n) => n.message === notification.message)
        );
  
        if (newNotifications.length > 0) {
          setNotifications((prev) => [...(prev || []), ...newNotifications]);
          console.log('New notifications added:', newNotifications);
        } else {
          console.log('No new notifications to add');
        }
      } else {
        console.error('Failed to check out-of-stock products');
      }
    } catch (error) {
      console.error('Error occurred while checking out-of-stock:', error);
    }
  };
  
  
  
  const handleFlagActivity= async(id)=>{
    try{
      const response = await fetch(`http://localhost:8000/flagActivity/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.msg); 
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
      }
    }
    catch (error) {
      console.log(error);
    }
  }


  

  
  
  const handleFlagItinerary= async(id)=>{
    try{
      const response = await fetch(`http://localhost:8000/flagItinerary/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.msg); 
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
      }
    }
    catch (error) {
      console.log(error);
    }
  }
  const handleFlagTouristItinerary= async(id)=>{
    try{
      const response = await fetch(`http://localhost:8000/flagTouristItinerary/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.msg); 
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
      }
    }
    catch (error) {
      console.log(error);
    }
  }
const getItineraries= async ()=>{
  try{
    const response = await fetch(`http://localhost:8000/getAllItineraries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      setItineraries(data);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const getTouristItineraries= async ()=>{
  try{
    const response = await fetch(`http://localhost:8000/getAllTouristItineraries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      setTouristItineraries(data);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const getActivities= async ()=>{
  try{
    const response = await fetch(`http://localhost:8000/getAllActivities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      setActivities(data);
    }
  }
  catch (error) {
    console.error(error);
  }
}
  const [changePasswordData, setChangePasswordData] = useState({
    Username: '',
    currentPassword: '',
    newPassword: ''
  });

  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');


const [createAdminSuccess, setCreateAdminSuccess] = useState('');
const [createAdminError, setCreateAdminError] = useState('');

const createAdmin = async (e) => {
  e.preventDefault(); // Prevent the default form submission
  const { Username, Password, Email } = formData;

  setLoading(true);
  setCreateAdminSuccess(''); // Clear previous success message
  setCreateAdminError(''); // Clear previous error message

  try {
    const response = await fetch('http://localhost:8000/createAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Username, Password, Email }),
    });

    if (response.ok) {
      const data = await response.json();
      setCreateAdminSuccess(`Admin "${data.Username}" created successfully!`);
      setFormData({ Username: '', Password: '', Email: '' }); // Reset the form
    } else {
      const errorData = await response.json();
      setCreateAdminError(errorData.error || 'Failed to create admin.');
    }
  } catch (error) {
    setCreateAdminError('An error occurred while creating the admin.');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const [deleteUserError, setDeleteUserError] = useState('');
const [deleteUserSuccess, setDeleteUserSuccess] = useState('');

const handleDeleteUser = async () => {
  setDeleteUserError('');
  setDeleteUserSuccess('');

  if (!usernameToDelete) {
    setDeleteUserError('Please enter a username to delete.');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8000/delete${userType}?Username=${usernameToDelete}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setDeleteUserSuccess(data.msg || 'User deleted successfully.');
      setUsernameToDelete('');
      setUserType('');
    } else {
      const errorData = await response.json();
      setDeleteUserError(errorData.error || `Failed to delete ${userType}.`);
    }
  } catch (error) {
    setDeleteUserError(`An error occurred while deleting the ${userType}.`);
    console.error(error);
  }
};


  const toggleModal = (content = null) => {
    setModalOpen((prev) => !prev);
    setModalContent(content);
  
    // Reset the messages when the modal is closed
    if (!modalOpen) {
      setCreateAdminSuccess('');
      setCreateAdminError('');
    }
  };
  
  
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
const handleAddProduct = () => {
  
  const seller = formData.Username || ''; // Fallback to empty string if undefined
  setProductFormData((prevData) => ({
    ...prevData,
    seller: seller // Assign the seller here
  }));
  setAddingProduct(true);
};

  const handleProductSubmit = async (e) => {
    const Username = localStorage.getItem('Username'); // Assuming the Username is stored in local storage

    e.preventDefault();
    handleAddProduct();
    const formData = new FormData();
    for (const key in productFormData) {
      formData.append(key, productFormData[key]);
    }
  
    try {
      const response = await fetch(`http://localhost:8000/createProduct?Username=${Username}`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        alert('Product added successfully!');
        setProductFormData({
          productName: '',
          description: '',
          price: '',
          rating: '',
          seller: formData.Username,
          review: '',
          stock: '',
          image: null // Reset image after submission
        });
        setAddingProduct(false);
      } else {
        const errorData = await response.json(); // Get error data from response
        throw new Error(`Failed to create product: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      setErrorMessage(`An error occurred while creating the product: ${error.message}`);
      console.error(error);
    }
  };



  // For getProductByName
  const [getProductErrorMessage, setGetProductErrorMessage] = useState('');
  const [getProductSuccessMessage, setGetProductSuccessMessage] = useState('');
  
  // For archiveProduct
  const [archiveProductErrorMessage, setArchiveProductErrorMessage] = useState('');
  const [archiveProductSuccessMessage, setArchiveProductSuccessMessage] = useState('');
  
  // For unarchiveProduct
  const [unarchiveProductErrorMessage, setUnarchiveProductErrorMessage] = useState('');
  const [unarchiveProductSuccessMessage, setUnarchiveProductSuccessMessage] = useState('');
  
  // Shared state

  const getProductByName = async (e) => {
    e.preventDefault();
    console.log("Search function triggered");
  
    setLoading(true);
    setGetProductErrorMessage(''); // Unique error message for `getProductByName`
    setGetProductSuccessMessage(''); // Unique success message for `getProductByName`
    setProductSearchResult(null);
  
    try {
      const response = await fetch(`http://localhost:8000/getProduct?productName=${productNameToSearch}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const product = await response.json();
        console.log(productSearchResult);
        setProductSearchResult(product);
        setProductNameToArchive(product.productName); // Store product name for archiving
        setGetProductSuccessMessage(`Product "${product.productName}" found successfully!`);
      } else {
        const errorData = await response.json();
        setGetProductErrorMessage(errorData.error || 'Product not found.');
      }
    } catch (error) {
      setGetProductErrorMessage('An error occurred while searching for the product.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const archiveProduct = async () => {
    if (!productNameToArchive) {
      setArchiveProductErrorMessage('No product selected to archive.'); // Unique error message for `archiveProduct`
      return;
    }
  
    setLoading(true);
    setArchiveProductErrorMessage(''); // Reset error message for `archiveProduct`
    setArchiveProductSuccessMessage(''); // Reset success message for `archiveProduct`
  
    try {
      const response = await fetch(`http://localhost:8000/archiveProduct/${productNameToArchive}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        setArchiveProductSuccessMessage(`Product "${productNameToArchive}" archived successfully.`);
  
        // Update the productSearchResult state to reflect the new archived status
        setProductSearchResult((prevProduct) => ({
          ...prevProduct,
          archived: result.product.archived, // Ensure this matches the response structure
        }));
      } else {
        const errorData = await response.json();
        setArchiveProductErrorMessage(errorData.error || 'Failed to archive product.');
      }
    } catch (error) {
      setArchiveProductErrorMessage('An error occurred while archiving the product.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const unarchiveProduct = async () => {
    if (!productNameToArchive) {
      setUnarchiveProductErrorMessage('No product selected to unarchive.'); // Unique error message for `unarchiveProduct`
      return;
    }
  
    setLoading(true);
    setUnarchiveProductErrorMessage(''); // Reset error message for `unarchiveProduct`
    setUnarchiveProductSuccessMessage(''); // Reset success message for `unarchiveProduct`
  
    try {
      const response = await fetch(`http://localhost:8000/unarchiveProduct/${productNameToArchive}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        setUnarchiveProductSuccessMessage(`Product "${productNameToArchive}" unarchived successfully.`);
  
        // Update the productSearchResult state to reflect the new archived status
        setProductSearchResult((prevProduct) => ({
          ...prevProduct,
          archived: result.product.archived, // Ensure this matches the response structure
        }));
      } else {
        const errorData = await response.json();
        setUnarchiveProductErrorMessage(errorData.error || 'Failed to unarchive product.');
      }
    } catch (error) {
      setUnarchiveProductErrorMessage('An error occurred while unarchiving the product.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
const [addTourismGovError, setAddTourismGovError] = useState('');
const [addTourismGovSuccess, setAddTourismGovSuccess] = useState('');

const addTourismGov = async (e) => {
  e.preventDefault();
  const { Username, Password } = tourismGovData;

  // Clear previous messages
  setAddTourismGovError('');
  setAddTourismGovSuccess('');

  try {
    const response = await fetch('http://localhost:8000/addTourismGov', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Username, Password }),
    });

    if (response.ok) {
      const data = await response.json();
      setAddTourismGovSuccess('Tourism Governor added successfully!');
      setTourismGovData({ Username: '', Password: '' });
    } else {
      const errorData = await response.json();
      setAddTourismGovError(errorData.error || 'Failed to add Tourism Governor.');
    }
  } catch (error) {
    setAddTourismGovError('An error occurred while adding the Tourism Governor.');
    console.error(error);
  }
};


  const handleTourismGovChange = (e) => {
    const { name, value } = e.target;
    setTourismGovData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
 
  const fetchStatistics = async () => {
    setStatsLoading(true);
    setStatsError("");
    setStatistics(null); // Clear previous data

    try {
      const response = await fetch("http://localhost:8000/getUserStatistics");
      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }
      const data = await response.json();
      setStatistics(data); // Set statistics data
      setShowStats(true); // Show statistics after fetching
    } catch (error) {
      setStatsError("An error occurred while fetching statistics.");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleHideStatistics = () => {
    setShowStats(false); // Hide statistics
    setStatistics(null); // Clear statistics data
  };
  
    useEffect(() => {
      const fetchRequests = async () => {
        try {
          const response = await fetch('http://localhost:8000/getPendingDeletionRequests');
          const data = await response.json();
          setRequests(data);
        } catch (error) {
          console.error('Error fetching requests:', error);
        }
      };
  
      fetchRequests();
    }, []);
  
    const handleAccept = async (id) => {
      try {
        const response = await fetch('http://localhost:8000/acceptDeletionRequest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: id }),
        });
        const result = await response.json();
        alert(result.message);
        setRequests(requests.filter(request => request._id !== id));
      } catch (error) {
        console.error('Error accepting request:', error);
      }
    };
  
    const handleReject = async (id) => {
      try {
        const response = await fetch('http://localhost:8000/rejectDeletionRequest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: id }),
        });
        const result = await response.json();
        alert(result.message);
        setRequests(requests.filter(request => request._id !== id));
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    };
  


    const styles = {
      container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#0F5132',
        borderRadius: '12px',
        boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        paddingTop: '100px', // Avoid overlap with the header
      },
      heading: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#0F5132", // Green theme
        marginBottom: "20px",
        textAlign: "center",
      },
      noRequestsMessage: {
        fontSize: "16px",
        color: "#555",
        textAlign: "center",
        marginTop: "20px",
      },
      requestsList: {
        listStyleType: "none",
        padding: 0,
        margin: 0,
      },
      requestItem: {
        backgroundColor: "#f9f9f9",
        padding: "20px",
        marginBottom: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      requestDetails: {
        flex: 1,
      },
      detail: {
        fontSize: "16px",
        margin: "5px 0",
        color: "#333",
      },
      buttonsContainer: {
        display: "flex",
        gap: "10px",
      },
      acceptButton: {
        padding: "10px 20px",
        backgroundColor: "#0F5132",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      },
      rejectButton: {
        padding: "10px 20px",
        backgroundColor: "#C82333", // Red theme for reject
        color: "#fff",
        fontSize: "14px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
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
        color: 'white',
      },
      profileIcon: {
        fontSize: '40px',
        color: 'white',
        cursor: 'pointer',
      },
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
  error: {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
  },
  success: {
    color: 'green',
    fontSize: '14px',
    textAlign: 'center',
  },
//statsitics 
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    textAlign: 'left', // Change from 'center' to 'left'
    color: '#0F5132',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
  },
  loadingText: {
    textAlign: 'center',
    color: '#555',
  },
  statisticsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    alignItems: 'flex-start',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },

  tableContainer: {
    flex: '2',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tableHeading: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#0F5132',
    marginBottom: '10px',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  tableHeader: {
    backgroundColor: '#0F5132',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    color: '#333',
  },
  noDataText: {
    fontSize: '14px',
    color: '#555',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#FFD700', // Bright gold color for emphasis
  },
  statCard: {
    backgroundColor: '#0F5132', // A sleek green card background
    color: '#fff', // White text for contrast
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  statTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#FFF', // Golden color for the title
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#FFF', // White text for the value
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Space between the icon and text
  },
  statisticsIcon: {
    color: "black", // Black color for the icon
    fontSize: "24px", // Size of the icon
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
    color: "#0F5132", // Green theme for text
  },
  openModalButton: {
    margin: '10px',
    padding: '10px 20px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
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
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '50%',
    maxWidth: '600px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    maxHeight: '80vh', // Limit modal height
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', // Ensure no overflow outside modal container
  },
  modalBody: {
    flex: 1,
    overflowY: 'auto', // Make modal scrollable
    paddingRight: '10px', // Add space for scroll bar
  },
  cancelIcon: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    color: '#dc3545',
    cursor: 'pointer',
  },
 
  modalContentH2: {
    fontSize: '24px',
    textAlign: 'center',
    color: '#333',
    marginBottom: '15px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
  },
  submitButton: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  iconContainer: {
    display: 'flex', // Enable flexbox
    alignItems: 'center', // Vertically align items
    justifyContent: 'space-between', // Even spacing between icons
    gap: '20px', // Space between each icon
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
  },
  deleteButton:{
    backgroundColor: loading ? '#ccc' : '#dc3545', // Red for delete

  },
  container: {
    maxWidth: '1300px',
    margin: '20px auto',
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0F5132',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px', // Reduced gap between elements
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '3px', // Reduced margin between groups
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '4px', // Less space below labels
    color: '#555',
  },
  input: {
    padding: '2px', // Reduced padding for inputs
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#0F5132',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0C3E27',
  },
  errorMessage: {
    marginTop: '10px',
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
  },
  successMessage: {
    marginTop: '10px',
    color: 'green',
    fontSize: '14px',
    textAlign: 'center',
  },
  section: {
    flex: '1 1 30%', // Responsive sections
    minWidth: '250px', // Ensure minimum width
    maxWidth: '300px', // Prevent overly large sections
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#0F5132',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  content: {
    marginTop: '10px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },

  text: {
    fontSize: '14px',
    margin: '5px 0',
    color: '#555',
  },
  flagButton: {
    padding: '8px',
    fontSize: '14px',
    color: '#fff',
    backgroundColor: '#d9534f',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
    container2: {
    display: 'flex',
    gap: '20px', // Space between sections
    justifyContent: 'space-around',
    padding: '20px',
    flexWrap: 'wrap', // Wrap if screen size is too small
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#0F5132',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  icon: {
    marginRight: '5px',
    color: '#0F5132',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  textarea: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    minHeight: '80px',
  },
  fileUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  uploadLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#0F5132',
    fontWeight: 'bold',
  },
  fileInput: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '5px',
  },
  imagePreview: {
    maxWidth: '100%',
    borderRadius: '10px',
    marginTop: '10px',
  },
  submitButton: {
    backgroundColor: '#0F5132',
    color: '#fff',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  success: {
    color: 'green',
    marginTop: '10px',
  },
  };
 
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePasswordLoading(true);
    setChangePasswordSuccess('');
    setChangePasswordError('');
  
    try {
      const response = await fetch('http://localhost:8000/changePasswordAdmin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changePasswordData),
      });
  
      if (response.ok) {
        const data = await response.json();
        setChangePasswordSuccess(data.message);
        setChangePasswordData({
          Username: '',
          Email: '', // Reset Email field after successful change
          currentPassword: '',
          newPassword: '',
        });
      } else {
        const errorData = await response.json();
        setChangePasswordError(errorData.error || 'Failed to change password.');
      }
    } catch (error) {
      setChangePasswordError('An error occurred while changing the password.');
      console.error(error);
    } finally {
      setChangePasswordLoading(false);
    }
  };
  
  return (
  <div>
    <h1>--</h1>
    <header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <h1 style={styles.title}>Admin Profile</h1>
  <div style={styles.headerIconsContainer}>
    {/* Notification Bell */}
    <div
      style={styles.notificationButton}
      onClick={handleNotificationClick}
    >
    </div>
    <div style={styles.iconContainer}>
  {/* Products Icon */}
  <FaBox
    size={22}
    style={styles.profileIcon}
    onClick={() => navigate('/products')} // Navigate to Products page
  />

  {/* Edit Profile Icon */}
  <ManageAccountsIcon
    style={styles.profileIcon}s
    title="Edit Profile"
    onClick={toggleModal} // Open modal on click
  />

  {/* Admin Settings Icon */}
  <FaUserCircle
    alt="Profile Icon"
    style={styles.profileIcon}
    onClick={() => navigate('/adminsettings')}
  />
</div>

    
  </div>
</header>
      <div className="sidebar">
        <ul>
        <li onClick={() => navigate('/PromoCodeForm')}>Promo Codes</li>
        <li onClick={() => navigate('/Complaints')}>Complaints</li>
        <li onClick={() => navigate('/preftags')}>Preference Tags</li>
        <li onClick={() => navigate('/docs')}>Docs</li>
        <li onClick={() => navigate('/category')}>Categories</li>

  
      
        
        <div style={{ position: 'relative', textAlign: 'right', padding: '10px' }}>
      {/* Notification Bell Icon */}
      <FaBell
        size={24}
        style={{ cursor: 'pointer' }}
        onClick={handleNotificationClick}
      />

      {/* Notification Count */}
      {notifications && notifications.length > 0 && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 10,
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {notifications.length}
        </span>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '10px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            width: '300px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 10,
          }}
        >
          <ul style={{ listStyle: 'none', padding: '10px', margin: 0 }}>
            {notifications && notifications.map((notification) => (
              <li
                key={notification.id}
                style={{
                  borderBottom: '1px solid #ddd',
                  padding: '10px 0',
                  fontSize: '14px',
                }}
              >
                <p style={{ margin: 0, fontWeight: 'bold' }}>{notification.message}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'gray' }}>
                  {new Date(notification.date).toLocaleDateString()}{' '}
                  {new Date(notification.date).toLocaleTimeString()}
                </p>
              </li>
            ))}
          </ul>
          {!notifications || notifications.length === 0 && (
            <p style={{ padding: '10px', textAlign: 'center' }}>
              No notifications
            </p>
          )}
        </div>
      )}
    </div>
        </ul>
      </div>

      <div style={styles.headerContainer}>
  
      <h2 style={styles.heading}>Users Statistics</h2>
      <FaChartBar style={styles.statisticsIcon} />
    </div>
{statsError && <p style={styles.error}>{statsError}</p>}
{statistics ? (
 <div style={styles.statisticsContainer}>
 <div style={styles.statCard}>
   <p style={styles.statTitle}>Total Users</p>
   <p style={styles.statValue}>{statistics.totalUsers}</p>
 </div>
 <div style={styles.tableContainer}>
   <h3 style={styles.tableHeading}>New Users per Month</h3>
   {statistics.monthlyUsers && Object.keys(statistics.monthlyUsers).length > 0 ? (
     <table style={styles.table}>
       <thead>
         <tr>
           <th style={styles.tableHeader}>Month</th>
           <th style={styles.tableHeader}>New Users</th>
         </tr>
       </thead>
       <tbody>
         {Object.entries(statistics.monthlyUsers).map(([month, count]) => (
           <tr key={month}>
             <td style={styles.tableCell}>{month}</td>
             <td style={styles.tableCell}>{count}</td>
           </tr>
         ))}
       </tbody>
     </table>
   ) : (
     <p style={styles.noDataText}>No new users recorded this month.</p>
   )}
 </div>
</div>

) : (
  <p style={styles.loadingText}>Fetching statistics...</p>
)}


  
{/* Modal for Admin Settings */}
{modalOpen && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <h2 style={styles.modalContentH2}>Admin Control</h2>
      <HighlightOffOutlinedIcon
        onClick={toggleModal}
        style={styles.cancelIcon} // Apply cancel icon style
      />

      <div style={styles.modalBody}>
        {/* Create Admin Form */}
        <form style={styles.form} onSubmit={createAdmin}>
          <h3 style={styles.modalContentH2}>Create Admin</h3>
          {/* Username Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              name="Username"
              value={formData.Username}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  Username: e.target.value,
                }))
              }
              style={styles.input}
              required
            />
          </div>

          {/* Email Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  Email: e.target.value,
                }))
              }
              style={styles.input}
              required
            />
          </div>

          {/* Password Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  Password: e.target.value,
                }))
              }
              style={styles.input}
              required
            />
          </div>

          {/* Display Success or Error Message */}
          {createAdminSuccess && (
            <p style={{ color: 'green', textAlign: 'center' }}>
              {createAdminSuccess}
            </p>
          )}
          {createAdminError && (
            <p style={{ color: 'red', textAlign: 'center' }}>
              {createAdminError}
            </p>
          )}

          {/* Create Admin Button */}
          <button type="submit" style={styles.submitButton}>
            Create Admin
          </button>
        </form>

        <hr style={{ margin: '20px 0' }} />

        {/* Delete User Form */}
        <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleDeleteUser(); }}>
          <h3 style={styles.modalContentH2}>Delete User</h3>
          {/* Username Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Username to Delete:</label>
            <input
              type="text"
              value={usernameToDelete}
              onChange={(e) => setUsernameToDelete(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* User Type Dropdown */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Select User Type:</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              style={styles.input}
              required
            >
              <option value="">Select Type</option>
              <option value="Admin">Admin</option>
              <option value="TourismGov">Tourism Governor</option>
              <option value="Tourist">Tourist</option>
              <option value="Advertiser">Advertiser</option>
              <option value="Seller">Seller</option>
              <option value="TourGuide">Tour Guide</option>
            </select>
          </div>
  {/* Display Success or Error Message */}
  {deleteUserSuccess && (
    <p style={{ color: 'green', textAlign: 'center' }}>
      {deleteUserSuccess}
    </p>
  )}
  {deleteUserError && (
    <p style={{ color: 'red', textAlign: 'center' }}>
      {deleteUserError}
    </p>
  )}
          {/* Delete User Button */}
          <button type="submit" style={styles.deleteButton}>
            Delete User
          </button>
        </form>

                {/* Add Tourism Governor Form */}
                <form style={styles.form} onSubmit={addTourismGov}>
          <h3 style={styles.modalContentH2}>Add Tourism Governor</h3>
          {/* Username Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              name="Username"
              value={tourismGovData.Username}
              onChange={handleTourismGovChange}
              style={styles.input}
              required
            />
          </div>

          {/* Password Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              name="Password"
              value={tourismGovData.Password}
              onChange={handleTourismGovChange}
              style={styles.input}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" style={styles.submitButton}>
            Add Tourism Governor
          </button>

     {/* Display Success or Error Message */}
  {addTourismGovSuccess && (
    <p style={{ color: 'green', textAlign: 'center' }}>
      {addTourismGovSuccess}
    </p>
  )}
  {addTourismGovError && (
    <p style={{ color: 'red', textAlign: 'center' }}>
      {addTourismGovError}
    </p>
  )}
          </form>
      </div>
    </div>
  </div>
)}



<div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          Add Product <Inventory2Icon style={styles.icon} />
        </h3>
        <form onSubmit={handleProductSubmit} style={styles.form}>
          {/* Product Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaTag style={styles.icon} /> Product Name:
            </label>
            <input
              type="text"
              name="productName"
              value={productFormData.productName}
              onChange={handleProductInputChange}
              required
              style={styles.input}
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaInfoCircle style={styles.icon} /> Description:
            </label>
            <textarea
              name="description"
              value={productFormData.description}
              onChange={handleProductInputChange}
              required
              style={styles.textarea}
              placeholder="Enter product description"
            />
          </div>

          {/* Price */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaDollarSign style={styles.icon} /> Price:
            </label>
            <input
              type="number"
              name="price"
              value={productFormData.price}
              onChange={handleProductInputChange}
              required
              style={styles.input}
              placeholder="Enter product price"
            />
          </div>

          {/* Stock */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaBox style={styles.icon} /> Stock:
            </label>
            <input
              type="number"
              name="stock"
              value={productFormData.stock}
              onChange={handleProductInputChange}
              required
              style={styles.input}
              placeholder="Enter product stock"
            />
          </div>

         {/* Image Upload */}
         <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaImage style={styles.icon} /> Image:
            </label>
            <div style={styles.fileUploadContainer}>
              <strong style={styles.uploadLabel}>
                Upload Product Image <AddPhotoAlternateIcon />
              </strong>
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={styles.fileInput}
              />
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Product Preview"
              style={styles.imagePreview}
            />
          )}
          
          {/* Submit Button */}
          <button type="submit" style={styles.submitButton}>
            Add Product
          </button>
        </form>

        {/* Success and Error Messages */}
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
      </div>
    </div>

   {/* Search Product Section */}
<div style={styles.card}>
  <h3 style={styles.cardTitle}>
    Search Product by Name <FaSearch style={styles.icon} />
  </h3>
  <form onSubmit={getProductByName} style={styles.form}>
    <div style={styles.formGroup}>
      <label style={styles.label}>
        <FaTag style={styles.icon} /> Product Name:
      </label>
      <input
        type="text"
        value={productNameToSearch}
        onChange={(e) => setProductNameToSearch(e.target.value)}
        required
        style={styles.input}
        placeholder="Enter Product Name"
      />
    </div>
    <button type="submit" style={styles.searchButton} disabled={loading}>
      <FaSearch style={{ marginRight: '5px' }} />
      Search Product
    </button>
  </form>

  {/* Error and Success Messages for Search */}
  {getProductErrorMessage && <p style={styles.error}>{getProductErrorMessage}</p>}


  {/* Product Search Result */}
  {productSearchResult && (
    <div style={styles.searchResult}>
      <h4 style={styles.resultTitle}>Product Details</h4>
      <p>
        <strong>Name:</strong> {productSearchResult.productName}
      </p>
      <p>
        <strong>Description:</strong> {productSearchResult.description}
      </p>
      <p>
        <strong>Price:</strong> ${productSearchResult.price}
      </p>
      <p>
        <strong>Rating:</strong> {productSearchResult.rating}
      </p>
      <p>
        <strong>Seller:</strong> {productSearchResult.seller}
      </p>
      <p>
        <strong>Archived:</strong>{' '}
        {productSearchResult.archived !== undefined
          ? productSearchResult.archived.toString()
          : 'N/A'}
      </p>
      <div style={styles.buttonGroup}>
        <button
          onClick={archiveProduct}
          disabled={loading}
          style={styles.archiveButton}
        >
          Archive Product
        </button>
        <button
          onClick={unarchiveProduct}
          disabled={loading || !productSearchResult.archived}
          style={styles.unarchiveButton}
        >
          Unarchive Product
        </button>
      </div>
    </div>
  )}

  {/* Error and Success Messages for Archive */}
  {archiveProductErrorMessage && <p style={styles.error}>{archiveProductErrorMessage}</p>}
  {archiveProductSuccessMessage && <p style={styles.success}>{archiveProductSuccessMessage}</p>}

  {/* Error and Success Messages for Unarchive */}
  {unarchiveProductErrorMessage && <p style={styles.error}>{unarchiveProductErrorMessage}</p>}
  {unarchiveProductSuccessMessage && <p style={styles.success}>{unarchiveProductSuccessMessage}</p>}
</div>


<div style={styles.container2}>
  {/* Itineraries Section */}
  <div style={styles.section}>
    <button style={styles.button} onClick={handleViewItineraries}>
      {showingItineraries ? 'Hide Itineraries' : 'Show Itineraries'}
    </button>
    {showingItineraries && (
      <div style={styles.content}>
        {Itineraries.length > 0 ? (
          Itineraries.map((itinerary) => (
            <div key={itinerary._id} style={styles.card}>
              <h4 style={styles.title}>Locations:</h4>
              <p style={styles.text}>{itinerary.Locations.join(', ')}</p>
              <p style={styles.text}>Dates: {itinerary.DatesTimes}</p>
              <button style={styles.flagButton} onClick={() => handleFlagItinerary(itinerary._id)}>
                Flag Itinerary
              </button>
            </div>
          ))
        ) : (
          <p style={styles.text}>No itineraries found.</p>
        )}
      </div>
    )}
  </div>

  {/* Activities Section */}
  <div style={styles.section}>
    <button style={styles.button} onClick={handleViewActivities}>
      {showingActivities ? 'Hide Activities' : 'Show Activities'}
    </button>
    {showingActivities && (
      <div style={styles.content}>
        {Activities.length > 0 ? (
          Activities.map((activity) => (
            <div key={activity._id} style={styles.card}>
              <h4 style={styles.title}>Name:</h4>
              <p style={styles.text}>{activity.Name}</p>
              <p style={styles.text}>Category: {activity.Category}</p>
              <button style={styles.flagButton} onClick={() => handleFlagActivity(activity._id)}>
                Flag Activity
              </button>
            </div>
          ))
        ) : (
          <p style={styles.text}>No activities found.</p>
        )}
      </div>
    )}
  </div>

  {/* Tourist Itineraries Section */}
  <div style={styles.section}>
    <button style={styles.button} onClick={handleViewTouristItineraries}>
      {showingTouristItineraries ? 'Hide Tourist Itineraries' : 'Show Tourist Itineraries'}
    </button>
    {showingTouristItineraries && (
      <div style={styles.content}>
        {touristItineraries.length > 0 ? (
          touristItineraries.map((touristItinerary) => (
            <div key={touristItinerary._id} style={styles.card}>
              <h4 style={styles.title}>Activities:</h4>
              <p style={styles.text}>{touristItinerary.Activities.join(', ')}</p>
              <p style={styles.text}>Locations: {touristItinerary.Locations.join(', ')}</p>
              <button
                style={styles.flagButton}
                onClick={() => handleFlagTouristItinerary(touristItinerary._id)}
              >
                Flag Tourist Itinerary
              </button>
            </div>
          ))
        ) : (
          <p style={styles.text}>No tourist itineraries found.</p>
        )}
      </div>
    )}
  </div>
</div>

      <h2 style={styles.heading}>Pending Account Deletion Requests</h2>
{requests.length === 0 ? (
  <p style={styles.noRequestsMessage}>No pending requests.</p>
) : (
  <ul style={styles.requestsList}>
    {requests.map((request) => (
      <li key={request._id} style={styles.requestItem}>
        <div style={styles.requestDetails}>
          <p style={styles.detail}>
            <strong>Username:</strong> {request.Username}
          </p>
          <p style={styles.detail}>
            <strong>Request Date:</strong> {new Date(request.requestDate).toLocaleDateString()}
          </p>
          <p style={styles.detail}>
            <strong>Status:</strong> {request.status}
          </p>
        </div>
        <div style={styles.buttonsContainer}>
          <button
            onClick={() => handleAccept(request._id)}
            style={styles.acceptButton}
          >
            Accept
          </button>
          <button
            onClick={() => handleReject(request._id)}
            style={styles.rejectButton}
          >
            Reject
          </button>
        </div>
      </li>
    ))}
  </ul>
)}

     
    </div>
  );
};

export default AdminPage;
