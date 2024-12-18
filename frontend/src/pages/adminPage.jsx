import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaUsersCog, FaBell,FaChartBar,FaBox ,FaUserShield,FaArrowUp, FaArrowDown,  } from 'react-icons/fa'; // Importing bell icon
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { FaUser,FaExclamationCircle, FaFileAlt,FaTrashAlt ,FaThList,FaPlus,FaEdit ,FaFlag} from 'react-icons/fa';
import UserStatistics from './chart';
import { FaChartLine, FaDollarSign, FaShoppingCart, FaWarehouse } from "react-icons/fa";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";



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
  const [myProducts, setMyProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
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
  const [editProductId, setEditProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({
    productName: '',
    description: '',
    price: '',
    stock: '',
    rating: ''
  });
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      // Proceed with logout, navigate to '/Guest'
      navigate('/Guest');
    } else {
      // Do nothing if the user cancels the logout
      console.log("Logout cancelled");
    }
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


  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setEditProductData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
    checkoutOfStock();
    fetchNotifications();
    fetchStatistics();
    fetchMyProducts();

  }, []);

  const fetchProducts= async () => {
    const Username = localStorage.getItem('Username');
    setIsLoading(true);
    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/viewAllProducts`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setIsLoading(false);
        } else {
          throw new Error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  };

  const [Products, setProducts] = useState([]);
// Fetch data on mount
useEffect(() => {
  fetchProducts();
  fetchItinProfits();
  fetchActProfits();
}, []);

// Recalculate when products are updated
useEffect(() => {
  calculateTotalSales(Products);
  findMostSold(Products);
  findLeastSold(Products);
}, [Products]);

  const addNotification = (message) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id: Date.now(), message },
    ]);
  };

 const fetchMyProducts=async()=>{
    const Username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/getMyProducts?Username=${Username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMyProducts(data);
      }else{
        console.error('Failed to fetch my products');
      } 
    } catch (error) {
      console.error('Error fetching my products:', error);
    }
  }
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
 
  const [itinProfits, setItinProfits] = useState(0);
  const [actProfits, setActProfits] = useState(0);
  const [filteredP, setFilteredP] = useState(false); //is it filtered by product
  const [filteredD,setFilteredD]=useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [leastSold, setLeastSold] = useState();
  const [mostSold, setMostSold] = useState();

  const findMostSold = (x) => {
    const products = x.map((item) => {
        return item.product ? item.product : item;
      });
    if (products.length > 0) {
      const mostSoldProduct = products.reduce((max, product) => (product.sales > max.sales ? product : max), products[0]);
      setMostSold(mostSoldProduct);
    }
  };
  const findLeastSold = (x) => {
    const products = x.map((item) => {
        return item.product ? item.product : item;
      });
    if (products.length > 0) {
      const leastSoldPRoduct = products.reduce((min, product) => (product.sales < min.sales ? product : min), products[0]);
      setLeastSold(leastSoldPRoduct);
    }
  };
  const fetchItinProfits= async () => {
    const Username = localStorage.getItem('Username');
    setIsLoading(true);
    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/itinProfits`);
        if (response.ok) {
          const data = await response.json();
          const x= data*0.1
          setItinProfits(x);
          setIsLoading(false);
        } else {
          throw new Error('Failed to fetch itinerary profits');
        }
      } catch (error) {
        console.error('Error fetching itinerary profits:', error);
      }
    }
  };

  
  const fetchActProfits= async () => {
    const Username = localStorage.getItem('Username');
    setIsLoading(true);
    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/actProfits`);
        if (response.ok) {
          const data = await response.json();
          let x= data*0.1
          setActProfits(x);
          setIsLoading(false);
        } else {
          throw new Error('Failed to fetch activities profits');
        }
      } catch (error) {
        console.error('Error fetching activities profits:', error);
      }
    }
  };
  
  const calculateTotalSales = (x) => {
    const products = x.map((item) => {
        return item.product ? item.product : item;
      });
    const total = products.reduce((sum, product) => sum + product.sales, 0);
    let b= total*0.1
    setTotalSales(b);
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
  

  const [changePasswordData, setChangePasswordData] = useState({
    Username: '',
    currentPassword: '',
    newPassword: ''
  });

  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');


  const userStatsStyles = {
    userStatsContainer: {
      margin: '20px auto',
      padding: '20px',
      maxWidth: '900px', // Matches the profits container width
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    userStatsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '20px',
      borderBottom: '2px solid #0F5132',
      paddingBottom: '10px',
    },
    userStatsTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#0F5132',
      margin: '0',
      textTransform: 'uppercase',
    },
    icon: {
      fontSize: '24px',
      color: '#0F5132',
    },
    statsContent: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '20px',
    },
    statsBox: {
      flex: '0 0 100px', // Smaller width for total users box
      padding: '10px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      border: '1px solid #0F5132',
    },
    statsBoxTitle: {
      fontSize: '12px', // Smaller font for title
      fontWeight: 'bold',
      color: '#0F5132',
      marginBottom: '5px',
    },
    statsBoxValue: {
      fontSize: '24px', // Smaller size for value
      fontWeight: 'bold',
      color: '#0F5132',
    },
    chartBox: {
      flex: '1', // Make the chart take up the majority of the space
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      border: '1px solid #0F5132',
      height: '400px', // Increased height for the chart
      width: '100%', // Full width inside the container
    },
    errorText: {
      color: 'red',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    loadingText: {
      color: '#0F5132',
      fontStyle: 'italic',
      marginTop: '20px',
    },
  };
  
  
  const adminStyles = {
    profitSummaryContainer: {
      margin: '20px auto',
      maxWidth: '900px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    profitSummaryHeader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', // Vertically aligns title and amount
      marginBottom: '20px',
      borderBottom: '2px solid #0F5132', // Green bottom border
      paddingBottom: '10px', // Spacing between text and border
      alignItems: 'center', // Ensures vertical alignment
      gap: '20px', // Adds space between the title and value
    },
    
    
    summaryTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#0F5132',
      marginBottom: '15px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    summaryAmount: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#0F5132',
      marginBottom: '20px',
    },
    cardContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: '20px',
    },
    profitCard: {
      flex: '1 1 calc(50% - 20px)',
      padding: '15px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      border: '1px solid #0F5132',
    },
    profitTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#0F5132',
      marginBottom: '10px',
      borderBottom: '2px solid #0F5132',
      paddingBottom: '5px',
    },
    profitAmount: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#0F5132',
      marginBottom: '10px',
    },
    productDetails: {
      textAlign: 'left',
      marginTop: '10px',
    },
    productInfo: {
      fontSize: '14px',
      color: '#333',
      marginBottom: '5px',
    },
    noData: {
      fontSize: '14px',
      color: '#888',
    },
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
  



    
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const togglePasswordModal = () => setShowPasswordModal(!showPasswordModal);
  const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);

  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
    const handlePasswordChange = async (e) => {
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
    
 
    const styles = {
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
  cancelpasswordIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '50px', // Adjust placement
    top: '25px', // Adjust placement
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
  container2: {
    maxWidth: '1200px',
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
  card2: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
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
  },card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  th: {
    textAlign: 'left',
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '10px',
    border: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
  tr: {
    backgroundColor: '#fff',
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
  sidebarExpanded: {
    width: '200px', // Width when expanded
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
  //

profitAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0F5132',
    marginTop: '10px',
},
resultCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    textAlign: 'center',
},
productDetail: {
    fontSize: '16px',
    margin: '5px 0',
    color: '#555',
},
noData: {
    fontSize: '16px',
    color: '#888',
    marginTop: '10px',
},
profitSummaryContainer: {
  display: 'flex',
  gap: '20px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  marginBottom: '20px',
},
profitCard: {
  flex: '1',
  minWidth: '250px',
  backgroundColor: '#f9f9f9',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
},
profitTitle: {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '10px',
},
profitAmount: {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#0F5132',
},
//
userStatsContainer: {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '1600px',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
},
headerContainer: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
},
heading: {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 10px',
},
statisticsIcon: {
  fontSize: '24px',
  color: '#007BFF',
},
errorText: {
  color: 'red',
  fontWeight: 'bold',
  marginBottom: '20px',
},
contentRow: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
},
totalUsersBox: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  width: '150px',
  height: '200px',
  top: '-20px', // Raise the box slightly
  flex: '0 0 200px', // Fixed size for the box
  position: 'relative', // Enable positioning
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
},

totalUsersTitle: {
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '10px',
},
totalUsersValue: {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#0F5132',
},
chartContainer: {
  flex: '1',
  padding: '10px',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
},
loadingText: {
  color: '#0F5132',
  fontStyle: 'italic',
  marginTop: '20px',
},
//////

  profitSummary: {
    textAlign: 'center',
    marginBottom: '20px',
    padding: '15px', // Reduced padding    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    height: '150px', // Set a fixed height (adjust as needed)
    minHeight: '90px', // Optional: Ensure a minimum height
    maxHeight: '90px', // Optional: Restrict maximum height
  },
  summaryTitle: {
    fontSize: '20px', // Reduced font size
    fontWeight: 'bold',
    marginBottom: '8px', // Reduced margin
  },
  summaryAmount: {
    fontSize: '24px', // Reduced font size
    fontWeight: 'bold',
    color: '#0F5132',
  },
  profitSummaryContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '15px', // Reduced gap
    marginBottom: '20px', // Reduced margin
  },
  profitCard: {
    flex: '1 1 calc(30% - 10px)',  // Adjusted width for smaller cards
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '15px', // Reduced padding
    textAlign: 'left',
    transition: 'transform 0.2s',
  },
  profitCardHover: {
    transform: 'scale(1.02)',
  },
  profitTitle: {
    fontSize: '20px', // Reduced font siz
    fontWeight: 'bold',
    marginBottom: '10px',
    borderBottom: '2px solid #0F5132',
    paddingBottom: '8px',
    color: '#333',
  },
  productDetails: {
    fontSize: '14px',
    lineHeight: '1.4',
  },
  productInfo: {
    marginBottom: '10px',
    color: '#555',
  },
  noData: {
    fontStyle: 'italic',
    color: '#888',
  },
  ///
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
      {/* Notification Bell Icon */}
<FaBell
  size={24}
  style={{ cursor: 'pointer', color: 'white' }}
  onClick={handleNotificationClick}
/>


      {/* Notification Count */}
      {notifications && notifications.length > 0 && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 110,
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

        {/* settings  Dropdown */}
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
          togglePasswordModal(); // Open Change Password modal
        }}
      >
        Change Password
      </div>
    </div>
  )}

          {/* Logout Icon */}
          <LogoutOutlinedIcon
      onClick={handleLogout}
    />

</div>


  </div>

</header>



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

        <div style={styles.item} onClick={() => navigate('/admincontrol')}>
          <FaUsersCog   style={styles.icon} />
          <span className="label" style={styles.label}>
           Admin Control
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
        <div style={styles.item} onClick={() => navigate('/products_admin')}>
          <FaBox  style={styles.icon} />
          <span className="label" style={styles.label}>
            View Products
          </span>   
        </div>
      </div>

      <div style={userStatsStyles.userStatsContainer}>
  <div style={userStatsStyles.userStatsHeader}>
    <h2 style={userStatsStyles.userStatsTitle}>
      Users Statistics
    </h2>
    <FaChartBar style={userStatsStyles.icon} />
  </div>

  {statsError && <p style={userStatsStyles.errorText}>{statsError}</p>}
  {statistics ? (
    <div style={userStatsStyles.statsContent}>
      {/* Total Users Box */}
      <div style={userStatsStyles.statsBox}>
        <p style={userStatsStyles.statsBoxTitle}>Total Users</p>
        <p style={userStatsStyles.statsBoxValue}>{statistics.totalUsers}</p>
      </div>

      {/* Larger Chart */}
      <div style={userStatsStyles.chartBox}>
        <UserStatistics statistics={statistics} />
      </div>
    </div>
  ) : (
    <p style={userStatsStyles.loadingText}>Fetching statistics...</p>
  )}
</div>



    
<div style={adminStyles.profitSummaryContainer}>
  {/* Total Profit */}
  <div style={adminStyles.profitSummaryHeader}>
    <h2 style={adminStyles.summaryTitle}>
      Total Profit from Sales

    </h2>
    <span style={adminStyles.summaryAmount}>${totalSales}</span>
  </div>




  {/* Profits and Product Details */}
  <div style={adminStyles.cardContainer}>
    {/* Total Itinerary Profits */}
    <div style={adminStyles.profitCard}>
      <h3 style={adminStyles.profitTitle}>Total Itinerary Profits</h3>
      <p style={adminStyles.profitAmount}>${itinProfits}</p>
    </div>
    {/* Total Activities Profits */}
    <div style={adminStyles.profitCard}>
      <h3 style={adminStyles.profitTitle}>Total Activities Profits</h3>
      <p style={adminStyles.profitAmount}>${actProfits}</p>
    </div>
{/* Most Sold Product */}
<div style={adminStyles.profitCard}>
  <h3 style={adminStyles.profitTitle}>
    Most Sold Product
    <FaChartLine style={{ marginLeft: "8px", color: "#28a745", fontSize: "16px" }} />
  </h3>
  {!isLoading && mostSold ? (
    <div style={adminStyles.productDetails}>
      <p style={adminStyles.productInfo}>
        <FaBox style={{ marginRight: "8px", color: "#0F5132" }} />
        <strong>Product:</strong> {mostSold.productName}
      </p>
      <p style={adminStyles.productInfo}>
        <FaDollarSign style={{ marginRight: "8px", color: "#0F5132" }} />
        <strong>Price:</strong> ${mostSold.price}
      </p>
      <p style={adminStyles.productInfo}>
        <FaChartBar style={{ marginRight: "8px", color: "#0F5132" }} />
        <strong>Sales:</strong> {mostSold.sales}
      </p>
      <p style={adminStyles.productInfo}>
        <FaShoppingCart style={{ marginRight: "8px", color: "#0F5132" }} />
        <strong>Times Purchased:</strong>{" "}
        {mostSold.sales === 0 ? 0 : (mostSold.sales / mostSold.price).toFixed(2)}
      </p>
      <p style={adminStyles.productInfo}>
        <FaChartBar style={{ marginRight: "8px", color: "#28a745" }} />
        <strong>Stock Trend:</strong> Stock moving up 🚀
      </p>
    </div>
  ) : (
    <p style={adminStyles.noData}>No data available</p>
  )}
</div>

{/* Least Sold Product */}
<div style={adminStyles.profitCard}>
  <h3 style={adminStyles.profitTitle}>
    Least Sold Product
    <FaChartLine style={{ marginLeft: "8px", color: "#dc3545", fontSize: "16px" }} />
  </h3>
  {!isLoading && leastSold ? (
    <div style={adminStyles.productDetails}>
      <p style={adminStyles.productInfo}>
        <FaBox style={{ marginRight: "8px", color: "#0F5132" }} />
        <strong>Product:</strong> {leastSold.productName}
      </p>
      <p style={adminStyles.productInfo}>
        <FaDollarSign style={{ marginRight: "8px", color: "#0F5132" }} />
        <strong>Price:</strong> ${leastSold.price}
      </p>
      <p style={adminStyles.productInfo}>
        <FaChartBar style={{ marginRight: "8px", color: "#0F5132" }} />
        <strong>Sales:</strong> {leastSold.sales}
      </p>
      <p style={adminStyles.productInfo}>
        <FaShoppingCart style={{ marginRight: "8px", color: "#0F5132" }} />
        <strong>Times Purchased:</strong>{" "}
        {leastSold.sales === 0 ? 0 : (leastSold.sales / leastSold.price).toFixed(2)}
      </p>
      <p style={adminStyles.productInfo}>
        <FaWarehouse style={{ marginRight: "8px", color: "#dc3545" }} />
        <strong>Stock Trend:</strong> Stock moving down 📉
      </p>
    </div>
  ) : (
    <p style={adminStyles.noData}>No data available</p>
  )}
</div>
</div>
</div>
 


      {/* Password Modal */}
{showPasswordModal && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <h2 style={styles.modalContentH2}>Change Password</h2>

      {/* Close Icon */}
      <HighlightOffOutlinedIcon
        onClick={togglePasswordModal}
        style={styles.cancelpasswordIcon}
      />

      {/* Success and Error Messages */}
      {changePasswordSuccess && (
        <p style={{ color: 'green', marginBottom: '15px' }}>
          {changePasswordSuccess}
        </p>
      )}
      {changePasswordError && (
        <p style={{ color: 'red', marginBottom: '15px' }}>
          {changePasswordError}
        </p>
      )}

      {/* Change Password Form */}
      <form onSubmit={handlePasswordChange} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            value={changePasswordData.Username}
            onChange={(e) =>
              setChangePasswordData((prevData) => ({
                ...prevData,
                Username: e.target.value,
              }))
            }
            style={styles.modalContentInput}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={changePasswordData.Email}
            onChange={(e) =>
              setChangePasswordData((prevData) => ({
                ...prevData,
                Email: e.target.value,
              }))
            }
            style={styles.modalContentInput}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Current Password</label>
          <input
            type="password"
            placeholder="Enter Current Password"
            value={changePasswordData.currentPassword}
            onChange={(e) =>
              setChangePasswordData((prevData) => ({
                ...prevData,
                currentPassword: e.target.value,
              }))
            }
            style={styles.modalContentInput}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>New Password</label>
          <input
            type="password"
            placeholder="Enter New Password"
            value={changePasswordData.newPassword}
            onChange={(e) =>
              setChangePasswordData((prevData) => ({
                ...prevData,
                newPassword: e.target.value,
              }))
            }
            style={styles.modalContentInput}
            required
          />
        </div>

        {/* Submit Button */}
        <div style={styles.modalButtonsContainer}>
          <button
            type="submit"
            style={{
              ...styles.modalContentButton,
              backgroundColor: '#0F5132',
            }}
            disabled={changePasswordLoading}
          >
            {changePasswordLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
  );
};

export default AdminPage;
