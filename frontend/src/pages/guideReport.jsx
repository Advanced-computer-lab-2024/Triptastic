import React, { useState, useEffect, useContext } from 'react';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import {
  FaUserCircle,
  FaSync,
  FaFilter,
  FaDollarSign,
  FaMapMarkedAlt,
  FaCalendarDay,
  FaChartLine,FaClipboardList
} from "react-icons/fa";
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';

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
const [filterI, setFilterI] = useState(null); //itinerary chosen in drop down menu
const [dates, setDates] = useState([]); // dates of the chosen itinerary
const [count,setCount]=useState(0);// count of the chosen itinerary
const [filteredI, setFilteredI] = useState(false); //is it filtered by itinerary
const navigate = useNavigate(); // Initialize useNavigate for navigation

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
  const handleFilterChange = (event) => {
    const selectedItinerary = Itineraries.find(itinerary => itinerary._id === event.target.value);
    if (selectedItinerary) {
      filterByItinerary(selectedItinerary._id);
      setFilteredI(true);
      setFilterI(selectedItinerary);
    }
    else {
      setFilteredI(false);
    }
  };
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>
        <h2 style={styles.title}>{localStorage.getItem("Username")}'s Sales Report</h2>
        <FaUserCircle
          style={styles.profileIcon}
          onClick={() => navigate("/tour-guide-profile")}
        />
      </header>

      {/* Filters */}
      <div style={styles.filterContainer}>
        <button style={styles.refreshButton} onClick={() => setRefresh(!refresh)}>
          <FaSync /> Refresh
        </button>
        <div style={styles.dateFilter}>
          <FaCalendarDay style={styles.icon} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.dateInput}
          />
        </div>
        <button style={styles.filterButton} onClick={handleFilterD}>
          <FaFilter /> {filteredD ? "Clear Filter" : "Filter"}
        </button>
      </div>

      <div style={styles.filterContainer}>
        <label htmlFor="itineraryDropdown" style={styles.filterLabel}>
          <DisplaySettingsIcon style={styles.icon} /> Filter by Itinerary:
        </label>
        <select
          id="itineraryDropdown"
          value={filterI ? filterI._id : ""}
          onChange={handleFilterChange}
          style={styles.dropdown}
        >
          <option value="">Select an itinerary</option>
          {Itineraries.map((itinerary) => (
            <option key={itinerary._id} value={itinerary._id}>
              {itinerary.Locations.join(", ")}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.reportSection}>
        {!filteredI && !filteredD && (
          <>
            <h3 style={styles.sectionTitle}>
              <FaDollarSign style={styles.icon} /> Total Profit from Sales: ${totalSales}
            </h3>
            {mostSold && (
              <div style={styles.itineraryCard}>
                <h4 style={styles.cardTitle}>
                  <FaChartLine style={styles.icon} /> Most Sold Itinerary
                </h4>
                <p><strong>Locations:</strong> {mostSold.Locations.join(", ")}</p>
                <p><strong>Price:</strong> ${mostSold.Price}</p>
                <p><strong>Sales:</strong> ${mostSold.sales}</p>
              </div>
            )}
            {leastSold && (
              <div style={styles.itineraryCard}>
                <h4 style={styles.cardTitle}>
                  <FaChartLine style={styles.icon} /> Least Sold Itinerary
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
              <FaCalendarDay style={styles.icon} /> Filtered by Date: {date}
            </h3>
            {Itineraries.map((itinerary) => (
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
              <FaClipboardList style={styles.icon} /> Selected Itinerary
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
              <FaMapMarkedAlt style={styles.icon} /> All Itineraries
            </h3>
            {Itineraries.length > 0 ? (
              Itineraries.map((itinerary) => (
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
    filterContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "80px",
      padding: "10px 0",
    },
    refreshButton: {
      backgroundColor: "#0F5132",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      cursor: "pointer",
      fontSize:'13px'
    },
    dateFilter: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    dateInput: {
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ddd",
    },
    filterButton: {
      backgroundColor: "#0F5132",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      cursor: "pointer",
      fontSize:'13px'

    },
    reportSection: {
      marginTop: "20px",
    },
    filteredSection: {
      marginBottom: "20px",
    },
    sectionTitle: {
      fontSize: "18px",
      color: "#0F5132",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "10px",
    },
    itineraryList: {
      marginTop: "20px",
      fontSize: "16px",

    },
    itineraryCard: {
      backgroundColor: "#fff",
      padding: "15px",
      borderRadius: "5px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      marginBottom: "15px",
    },
    dropdown: {
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ddd",
    },
    icon: {
      fontSize: "18px",
      color: "#0F5132",
    },
  };
export default GuideReport;