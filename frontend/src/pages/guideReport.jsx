import React, { useState, useEffect, useContext } from 'react';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaUserCircle,FaShoppingCart,FaRegFileAlt, FaDollarSign, FaStar, FaComments, FaWarehouse, FaChartBar,FaBars} from 'react-icons/fa';
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel,
  FaClipboardList } from "react-icons/fa";
  import { FaHeart } from 'react-icons/fa';
  import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const GuideReport = () => {
const [Itineraries, setItineraries] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [totalSales, setTotalSales] = useState(0);
const [refresh, setRefresh] = useState(false);
const [mostSold, setMostSold] = useState();
const [leastSold, setLeastSold] = useState();
const [date, setDate] = useState('');
const [filteredD,setFilteredD]=useState(false);
const navigate = useNavigate(); // Initialize useNavigate for navigation

const handleProfileRedirect = () => {
  const context = localStorage.getItem('context');

  if (context === 'tourist') {
    navigate('/tourist-profile');
  } else if (context === 'seller') {
    navigate('/seller-profile');
  } else if (context === 'admin') {
    navigate('/adminPage');
   } else if (context === 'tourGuide') {
      navigate('/tour-guide-profile');
  } else if (context === 'guest') {
    navigate('/Guest');
} else {
    console.error('Unknown context');
    navigate('/'); // Fallback to home
  }
};
const fetchItineraries = async () => {
    const Username = localStorage.getItem('Username');
    setIsLoading(true);
    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getMyItineraries?Username=${Username}`);
        if (response.ok) {
          const data = await response.json();
          setItineraries(data);
            setIsLoading(false);
        } else {
          throw new Error('Failed to fetch itineraries');
        }
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
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
        findMostSold(Itineraries);
        findLeastSold(Itineraries);
    }else{
        fetchItineraries();
        setFilteredD(false);
        findMostSold(Itineraries);
        findLeastSold(Itineraries);
    }
    };

  useEffect(() => {
    fetchItineraries()
    calculateTotalSales(Itineraries);
    findMostSold(Itineraries);
    findLeastSold(Itineraries);
  }, [refresh]);
  return (
    <div>
  <header style={styles.header}>
    <div style={styles.logoContainer}>
      <img src={logo} alt="Logo" style={styles.logo} />
    </div>
    <h1 style={styles.title}>Guide Report</h1>
    <div style={styles.headerIcons}>
      {/* Profile Icon */}
      <FaUserCircle
        alt="Profile Icon"
        style={styles.profileIcon}
        onClick={handleProfileRedirect} // Navigate to profile
      />
    </div>
  </header>
<div>



</div>
  <div>
  <div>



</div>
    <h1>{localStorage.getItem('Username')}'s sales report</h1>
    <button onClick={() => setRefresh(!refresh)}>Refresh</button>
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      style={{ marginLeft: '10px' }}
    />
    <button onClick={() => handleFilter()}>
      {filteredD ? 'Clear filter' : 'Filter'}
    </button>
    {!filteredD && (<h2>Total profit from sales: {totalSales}</h2>)}
    {!filteredD && (<h3>Most sold itinerary</h3>)}
    {!filteredD && !isLoading && mostSold && (
      <div>
        <p>Locations: {mostSold.Locations.join(', ')}</p>
        <p>Price: {mostSold.Price}</p>
        <p>Sales: {mostSold.sales}</p>
        <p>
          Times booked: {mostSold.sales === 0 ? 0 : mostSold.sales / mostSold.Price}
        </p>
      </div>
    )}
   {!filteredD && ( <h3>Least sold itinerary</h3>)}
    {!filteredD && !isLoading && leastSold && (
      <div>
        <p>Locations: {leastSold.Locations.join(', ')}</p>
        <p>Price: {leastSold.Price}</p>
        <p>Sales: {leastSold.sales}</p>
        <p>
          Times booked: {leastSold.sales === 0 ? 0 : leastSold.sales / leastSold.Price}
        </p>
      </div>
    )}
  </div>
  <div>
    <h3>All itineraries</h3>
    {isLoading && <p>Loading...</p>}
    {!isLoading && Itineraries.length > 0 ? (
      Itineraries.map((Itinerary) => (
        <div key={Itinerary._id}>
          <p>Locations: {Itinerary.Locations.join(', ')}</p>
          <p>Price: {Itinerary.Price}</p>
          <p>Sales: {Itinerary.sales}</p>
          <p>
            Times booked: {Itinerary.sales === 0 ? 0 : Itinerary.sales / Itinerary.Price}
          </p>
        </div>
      ))
    ) : (
      <p>No itineraries found.</p>
    )}
  </div>
</div>
  )
  };
  const styles = {
    container: {
      //marginTop:'400px',
      maxWidth: '1200px',
      marginBottom:'20px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    filterGroup: {
      marginTop:'50px',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      justifyContent: 'center',
     // marginBottom: '20px',
    },
    filterInput: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
    },
    productCard: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
      padding: '15px',
      gap: '15px',
    },
    productInfo: {
      flex: '1',
    },
    productActions: {
      display: 'flex',
      gap: '10px',
    },
    actionButton: {
      fontSize:'30px',
      padding: '10px 15px',
      backgroundColor: 'white',
      color: '#0F5132',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginLeft:"650px"
  
    },
   
    icons: {
      fontSize: '25px', // Adjust size for the heart icon
      color: 'red', // White icon color to contrast with the red background
      backgroundColor:'white',
      //marginLeft:"340px"
    },
   
    
    cartIcon: {
      fontSize: '20px', // Adjust size
      color: 'white',
      cursor: 'pointer',
    },
    
    wishlistButton: {
      backgroundColor: '#0F5132',
      color: '#fff',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    header: {
      height:'60px',
    position: 'fixed', // Make the header fixed
    top: '0', // Stick to the top of the viewport
    left: '0',
    width: '100%', // Make it span the full width of the viewport
    backgroundColor: '#0F5132',
    color: 'white', // White text
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 10px',
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
    headerIcons: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    profileIcon: {
      fontSize: '30px',
      color: 'white',
      cursor: 'pointer',
      borderRadius: '20px',
     // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    wishlistIcon: {
      fontSize: '24px',
      cursor: 'pointer',
      padding: '10px',
      //borderRadius: '30%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s ease',
    },
    wishlistHeartIcon: {
      fontSize: '25px',
      color: 'white', // Red color for the heart icon
      cursor: 'pointer'
    },
    cartButton: {
      fontSize: '24px',
      cursor: 'pointer',
      borderRadius: '20%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s ease',
    },
    cartIcon: {
      fontSize: '25px', // Adjust size
      color: 'white', // Green text
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      margin: 0,
    },
  
   
    filterForm: {
      margin: '20px 0',
    },
    filterButton: {
      marginTop: '10px',
      padding: '10px 20px',
      backgroundColor: '#0F5132',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    productList: {
      fontSize:'11px',
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
      fontSize: '25px',
      color: '#0F5132',
      marginTop:'60px'
  
    },
    productImage: {
      width: '100%',
      maxWidth: '300px',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '10px',
    },
    addButton: {
      marginTop: '10px',
      padding: '5px 10px',
      backgroundColor: '#0F5132',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
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
  };
export default GuideReport;