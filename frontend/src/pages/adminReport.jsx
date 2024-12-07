import React, { useState, useEffect, useContext } from 'react';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaUserCircle,FaFilter,FaSyncAlt} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { FaShoppingCart,FaRegFileAlt, FaDollarSign, FaStar, FaComments, FaWarehouse, FaChartBar,FaBars} from 'react-icons/fa';
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel,
  FaClipboardList,FaSearch,FaArchive,FaUserShield } from "react-icons/fa";
  import activity from '../images/shopping.jpg'; 
  import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import { FaTag, FaInfoCircle } from "react-icons/fa";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Inventory2Icon from '@mui/icons-material/Inventory2';
  import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
  import { FaUser,FaExclamationCircle, FaFileAlt,FaTrashAlt ,FaThList,FaPlus,FaEdit ,FaFlag} from 'react-icons/fa';

const AdminReport = () => {
    const [Products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalSales, setTotalSales] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [mostSold, setMostSold] = useState();
    const [leastSold, setLeastSold] = useState();
    const [DatesQuant, setDatesQuant] = useState([]);
    const [filteredD,setFilteredD]=useState(false);
    const [filterP, setFilterP] = useState(null); //product chosen in drop down menu
    const [date, setDate] = useState(''); // dates of the chosen product
    const [count,setCount]=useState(0);// count of the chosen product
    const [filteredP, setFilteredP] = useState(false); //is it filtered by product
    const [productQuantity, setProductQuantity] = useState([]);
    const [itinProfits, setItinProfits] = useState(0);
    const [actProfits, setActProfits] = useState(0);
    const [hoveredProductId, setHoveredProductId] = useState(null);

    const navigate = useNavigate(); // Initialize useNavigate for navigation

      const fetchProducts= async () => {
        const Username = localStorage.getItem('Username');
        setIsLoading(true);
        if (Username) {
          try {
            const response = await fetch(`http://localhost:8000/viewMyProducts?seller=${Username}`);
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

      const filterByProduct = async (name) => { //returns object {date, quantity}
        try{
          const response = await fetch(`http://localhost:8000/filterByProduct?productName=${name}`);
          if (response.ok) {
            const data = await response.json();
            setDatesQuant(data);
            //fucntion to add all the quantities
            let sum=0;
            data.forEach(element => {
                sum+=element.quantity;
            });
            setCount(sum);
          }
          else {
            console.error('Failed to fetch data');
          }
        }
          catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        const fetchFilteredProducts = async (date) => {// returns object of {product, quantity}
          const Username = localStorage.getItem('Username');
            setIsLoading(true);
            try{
            const response = await fetch(`http://localhost:8000/getFilteredP?Username=${Username}&date=${date}`);
            if (response.ok) {
                const data = await response.json();
                setProductQuantity(data);
                setIsLoading(false);
            } else {
                console.error('Failed to fetch products');
            }
            } catch (error) {
                console.error('Error fetching products:', error);
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

          const handleFilterD = () => {
            if(!filteredD){
                fetchFilteredProducts(date);
                setFilteredD(true);
                findMostSold(productQuantity);
                findLeastSold(productQuantity);
            }else{
                fetchProducts();
                setFilteredD(false);
                findMostSold(Products);
                findLeastSold(Products);
            }
            };

            useEffect(() => {
                fetchProducts()
                calculateTotalSales(Products);
                findMostSold(Products);
                findLeastSold(Products);
                fetchItinProfits();
                fetchActProfits();
              }, [refresh]);
              
            const handleFilterChange = (event) => {
                const selectedProduct = Products.find(product => product._id === event.target.value);
                if (selectedProduct) {
                  filterByProduct(selectedProduct.productName);
                  setFilteredP(true);
                  setFilterP(selectedProduct);
                }
                else {
                  setFilteredP(false);
                }
              };
return (
    <div>
        {/* Header Section */}
        <header style={styles.header}>
            <div style={styles.logoContainer}>
                <img src={logo} alt="Logo" style={styles.logo} />
            </div>
            <h1 style={styles.title}>Admin Report</h1>
            <div style={styles.headerIcons}>
                <FaUserCircle
                    alt="Profile Icon"
                    style={styles.profileIcon}
                    onClick={() =>  navigate('/adminPage')}
                />
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
          <FaUser style={styles.iconn} />
          <span className="label" style={styles.label}>
           Admin Profile
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/manage')}>
          <FaUserShield style={styles.iconn} />
          <span className="label" style={styles.label}>
          Admin Panel
          </span>
        </div>
        
        <div style={styles.item} onClick={() => navigate('/Complaints')}>
          <FaExclamationCircle style={styles.iconn} />
          <span className="label" style={styles.label}>
           Complaints
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/docs')}>
          <FaFileAlt style={styles.iconn} />
          <span className="label" style={styles.label}>
            Documents
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/adminReport')}>
          <FaBox  style={styles.iconn} />
          <span className="label" style={styles.label}>
            Sales Report
          </span>   
        </div>
        <div style={styles.item} onClick={() => navigate('/DeletionRequest')}>
          <FaTrashAlt  style={styles.iconn} />
          <span className="label" style={styles.label}>
            Deletion Requests
          </span>   
        </div>

        <div style={styles.item} onClick={() => navigate('/EditProducts')}>
          <FaEdit   style={styles.iconn} />
          <span className="label" style={styles.label}>
            Edit Products
          </span>   
        </div>

        <div style={styles.item} onClick={() => navigate('/flagged')}>
          <FaFlag   style={styles.iconn} />
          <span className="label" style={styles.label}>
            Flag Events
          </span>   
        </div>
        <div style={styles.item} onClick={() => navigate('/products_admin')}>
          <FaBox  style={styles.iconn} />
          <span className="label" style={styles.label}>
            View Products
          </span>   
        </div>
      </div>


{/* Main Content Section */}
<div style={styles.content}>
    <h1 style={styles.pageTitle}>{localStorage.getItem('Username')}'s Sales Report</h1>

    {/* Action Row */}
  {/* Action Row */}
    <div style={styles.actionRow}>
    <FaSyncAlt 
                style={styles.icon} 
                onClick={() => setRefresh(!refresh)} 
                title="Refresh" 
            />
        <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.dateInput}
        />
            <FaFilter 
                style={styles.icon} 
                onClick={() => handleFilterD()} 
                title={filteredD ? 'Clear Filter' : 'Filter'} 
            />
    </div>


    {/* Product Filter Section */}
    <div style={styles.filterSection}>
        <label htmlFor="productDropdown" style={styles.filterLabel}>Filter by Product:</label>
        <select
            id="productDropdown"
            value={filterP ? filterP._id : ''}
            onChange={handleFilterChange}
            style={styles.filterSelect}
        >
            <option value="">Select a product</option>
            {Products.map((product) => (
                <option key={product._id} value={product._id}>
                    {product.productName}
                </option>
            ))}
        </select>
    </div>

{/* Filtered Product Details */}
{filteredP && (
    <div style={styles.filteredProductCard}>
        <h3 style={styles.filteredProductTitle}>Selected Product</h3>
        <div style={styles.filteredProductContent}>
            <p><strong>Product Name:</strong> {filterP.productName}</p>
            <p><strong>Price:</strong> ${filterP.price}</p>
            <p><strong>Sales:</strong> {filterP.sales}</p>
        </div>

        {/* Render purchase dates */}
        <ul style={styles.dateList}>
            {DatesQuant.map((dateQuant, index) => (
                <li key={index} style={styles.dateListItem}>
                    <p><strong>Date:</strong> {new Date(dateQuant.createdAt).toLocaleDateString()}</p>
                </li>
            ))}
        </ul>
    </div>
)}

{/* Filtered Date Results */}
{filteredD && (
    <div style={styles.filteredProductCard}>
        <h3 style={styles.filteredProductTitle}>Filtered Products</h3>
        <ul style={styles.dateList}>
        {productQuantity.map((product, index) => (
                 <li key={index}>
               <h2>Product: {product}</h2>
                          </li>
               ))}
                 </ul>
    </div>
)}


{/* Product List */}
 {/* Product List */}
 {!filteredP && !filteredD && (
                <>
                    <h2>All Products</h2>
                    {isLoading ? (
                        <p style={styles.loadingSpinner}>Loading...</p>
                    ) : Products.length > 0 ? (
                        <div style={styles.productGrid}>
                            {Products.map((Product) => (
                                <div
                                    key={Product._id}
                                    style={{
                                        ...styles.productCard,
                                        ...(hoveredProductId === Product._id
                                            ? styles.productCardHover
                                            : {}),
                                    }}
                                    onMouseEnter={() => setHoveredProductId(Product._id)}
                                    onMouseLeave={() => setHoveredProductId(null)}
                                >
                                    <h3
                                        style={{
                                            ...styles.productName,
                                            ...(hoveredProductId === Product._id
                                                ? styles.productNameHover
                                                : {}),
                                        }}
                                    >
                                        {Product.productName}
                                    </h3>
                                    <p style={styles.productDetails}>Price: ${Product.price}</p>
                                    <p style={styles.productDetails}>Sales: {Product.sales}</p>
                                    <p style={styles.productDetails}>
                                        Times Purchased:{' '}
                                        {Product.sales === 0
                                            ? 0
                                            : Math.round(Product.sales / Product.price)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.noProducts}>No products found.</p>
                    )}
                </>
            )}


        </div>
    </div>
);
}

const styles = {
  header: {
      height: '60px',
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      backgroundColor: '#0F5132',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: '1000',
  }, item: {
 
    padding: '10px 0',
    
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
      margin: 0,
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
  },
  content: {
      marginTop: '80px',
      padding: '20px',
  },
  profitSection: {
      marginBottom: '20px',
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
  },
  filterSection: {
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
  },
  filterLabel: {
      fontSize: '16px',
  },
  filterSelect: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
  },
  filteredProductDetails: {
      marginTop: '20px',
      backgroundColor: '#fff',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  dateList: {
      listStyleType: 'none',
      padding: 0,
  },
  loadingContainer: {
      textAlign: 'center',
      padding: '20px',
  },
  loadingSpinner: {
      fontSize: '18px',
      color: '#555',
  },
  productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '20px',
  },
  productCard: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
  },
  productName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#0F5132',
  },
  profitSummary: {
    backgroundColor: '#f1f5f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginBottom: '20px',
},
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
cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
},
productDetailsContainer: {
    textAlign: 'left',
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
content: {
  marginTop: '80px', // Pushes content below the fixed header
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
},
icon: {
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'color 0.3s ease',
  marginTop: '10px', // Nudges the icon downward slightly
},
iconn: {
  fontSize: '24px',
  marginLeft: '15px', // Move icons slightly to the right
  color: '#fff',
  opacity:1,
   // Icons are always white
},
pageTitle: {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
  marginBottom: '20px',
},
actionRow: {
  display: 'flex',
  gap: '10px',
  justifyContent: 'center',
  marginBottom: '20px',
},
refreshButtonContainer: {
  flex: '1', // Pushes the refresh button to the leftmost
  textAlign: 'left',
},
refreshButton: {
  backgroundColor: '#0F5132',
  color: '#fff',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease',
},
dateInput: {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ddd',
},
filterButton: {
  backgroundColor: '#0F5132',
  color: '#fff',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease',
},
filterSection: {
  display: 'flex',
  justifyContent: 'flex-start', // Aligns the entire section to the leftmost
  alignItems: 'center',
  gap: '10px', // Adds spacing between the label and dropdown
  marginTop: '20px',
},
filterLabel: {
  fontSize: '16px',
  fontWeight: 'bold',
},
filterSelect: {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  minWidth: '200px', // Consistent dropdown width
},
    productGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', // Responsive grid
        gap: '20px',
        marginTop: '20px',
    },
    productCard: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effect
    },
    productCardHover: {
        transform: 'translateY(-10px)', // Moves the card upward slightly
        boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)', // Stronger shadow on hover
    },
    productName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#0F5132',
        transition: 'color 0.3s ease', // Smooth color transition
    },
    productNameHover: {
        color: '#084B24', // Darker green on hover
    },
    productDetails: {
        fontSize: '16px',
        color: '#555',
    },
    noProducts: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#888',
        marginTop: '20px',
    },
    loadingSpinner: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#888',
    },
        filteredProductCard: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        maxWidth: '600px', // Limits the width for better readability
        margin: '20px auto', // Centers the card on the page
    },
    filteredProductTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#0F5132', // Professional green shade
        marginBottom: '15px',
    },
    filteredProductContent: {
        marginBottom: '20px',
        lineHeight: '1.6',
        fontSize: '16px',
        color: '#333',
    },
    dateList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    dateListItem: {
        backgroundColor: '#f9f9f9',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for list items
        fontSize: '16px',
        lineHeight: '1.4',
        color: '#555',
    }, sidebar: {
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

};

export default AdminReport;