import React, { useState, useEffect, useContext } from 'react';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaUserCircle,FaShoppingCart,FaRegFileAlt, FaDollarSign, FaStar, FaComments, FaWarehouse, FaChartBar,FaBars} from 'react-icons/fa';
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel,
  FaClipboardList } from "react-icons/fa";
  import { FaHeart } from 'react-icons/fa';
  import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const AdvertiserReport = () => {
const [Activities, setActivities] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [totalSales, setTotalSales] = useState(0);
const [refresh, setRefresh] = useState(false);
const [mostSold, setMostSold] = useState();
const [leastSold, setLeastSold] = useState();
const [date, setDate] = useState('');
const [filteredD,setFilteredD]=useState(false);
const [filterA, setFilterA] = useState(null); //activity chosen in drop down menu
const [dates, setDates] = useState([]); // dates of the chosen activity
const [count,setCount]=useState(0);// count of the chosen activity
const [filteredA, setFilteredA] = useState(false); //is it filtered by activity
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
const fetchActivities = async () => {
    try {
      const username = localStorage.getItem('Username');
      const response = await fetch(`http://localhost:8000/getActivity?Advertiser=${username}`);
      if (!response.ok) throw new Error('Failed to fetch activities');

      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
     
    }
  };
const fetchFilteredActivities = async (date) => {
    const Username = localStorage.getItem('Username');
    setIsLoading(true);
    try{
    const response = await fetch(`http://localhost:8000/getFilteredActivities?Username=${Username}&date=${date}`);
    if (response.ok) {
        const data = await response.json();
        setActivities(data);
        setIsLoading(false);
    } else {
        console.error('Failed to fetch activites');
    }
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
};
const filterByActivity = async (activityId) => {
    try{
      const response = await fetch(`http://localhost:8000/filterByActivity?activityId=${activityId}`);
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
const calculateTotalSales = (activities) => {
        const total = activities.reduce((sum, activity) => sum + activity.sales, 0);
        setTotalSales(total);
      };
const findMostSold = (activities) => {
        if (activities.length > 0) {
          const mostSoldActivity = activities.reduce((max, activity) => (activity.sales > max.sales ? activity : max), activities[0]);
          setMostSold(mostSoldActivity);
        }
      };
const findLeastSold = (activities) => {
        if (activities.length > 0) {
          const leastSoldActivity = activities.reduce((min, activity) => (activity.sales < min.sales ? activity : min), activities[0]);
          setLeastSold(leastSoldActivity);
        }
      };
const handleFilterD = () => {
        if(!filteredD){
            fetchFilteredActivities(date);
            setFilteredD(true);
            findMostSold(Activities);
            findLeastSold(Activities);
        }else{
            fetchActivities();
            setFilteredD(false);
            findMostSold(Activities);
            findLeastSold(Activities);
        }
        };
useEffect(() => {
    fetchActivities()
            calculateTotalSales(Activities);
            findMostSold(Activities);
            findLeastSold(Activities);
          }, [refresh]);
const handleFilterChange = (event) => {
            const selectedActivity = Activities.find(activity => activity._id === event.target.value);
            if (selectedActivity) {
              filterByActivity(selectedActivity._id);
              setFilteredA(true);
              setFilterA(selectedActivity);
            }
            else {
              setFilteredA(false);
            }
          };
    return(
        <div>
        <header style={styles.header}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Logo" style={styles.logo} />
          </div>
          <h1 style={styles.title}>Advertiser Report</h1>
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
          <button onClick={() => handleFilterD()}>
            {filteredD ? 'Clear filter' : 'Filter'}
          </button>
          <div>
              <label htmlFor="activityDropdown">Filter by Activity:</label>
              <select
                id="activityDropdown"
                value={filterA ? filterA._id : ''}
                onChange={handleFilterChange}
                style={{ marginLeft: '10px' }}
              >
                <option value="">Select an activity</option>
                {Activities.map((activity) => (
                  <option key={activity._id} value={activity._id}>
                    {activity.name}
                  </option>
                ))}
              </select>
            </div>
          {!filteredA && !filteredD && (<h2>Total profit from sales: {totalSales}</h2>)}
          {!filteredA && !filteredD && (<h3>Most sold activity</h3>)}
          {!filteredA && !filteredD && !isLoading && mostSold && (
            <div>
              <p>Name: {mostSold.name}</p>
              <p>Price: {mostSold.price}</p>
              <p>Sales: {mostSold.sales}</p>
              <p>
                Times booked: {mostSold.sales === 0 ? 0 : mostSold.sales / mostSold.price}
              </p>
            </div>
          )}
         {!filteredA && !filteredD && ( <h3>Least sold activity</h3>)}
          {!filteredA && !filteredD && !isLoading && leastSold && (
            <div>
              <p>Name: {leastSold.name}</p>
              <p>Price: {leastSold.price}</p>
              <p>Sales: {leastSold.sales}</p>
              <p>
                Times booked: {leastSold.sales === 0 ? 0 : leastSold.sales / leastSold.price}
              </p>
            </div>
          )}
        </div>
        <div>
        {filteredA && (
          <div>
            <h2>Selected activity</h2>
            <p>Location:{filterA.name}</p>
            <p>Price: {filterA.price}</p>
            <p>Sales: {filterA.sales}</p>
            <p>Times booked: {count}</p>
            <ul>
            {dates.map((date,index) => (
               <li key={index}>{date}</li>
            ))}
            </ul>
            <p>Times cancelled:{count-(filterA.sales/filterA.price)}</p>
            </div>
          )}
        </div>
        <div>
         { !filteredA && (<h3>All activities</h3>)}
          {isLoading && <p>Loading...</p>}
          {!filteredA && !isLoading && Activities.length > 0 ? (
            Activities.map((Activity) => (
              <div key={Activity._id}>
                <p>Name: {Activity.name}</p>
                <p>Price: {Activity.price}</p>
                <p>Sales: {Activity.sales}</p>
                <p>
                  Times booked: {Activity.sales === 0 ? 0 : Activity.sales / Activity.price}
                </p>
              </div>
            ))
          ) :!filteredA && (
            <p>No activities found.</p>
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
export default AdvertiserReport;