import React, { useState, useEffect, useContext } from 'react';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaUserCircle,FaFilter,FaSyncAlt} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { FaShoppingCart,FaRegFileAlt, FaDollarSign, FaStar, FaComments, FaWarehouse, FaChartBar,FaBars} from 'react-icons/fa';
import { FaUsersCog, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel,
  FaClipboardList,FaSearch,FaArchive,FaUserShield } from "react-icons/fa";
  import activity from '../images/shopping.jpg'; 
  import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Number of products per page
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = Products.slice(indexOfFirstProduct, indexOfLastProduct);
    
     // Pagination Logic
     const totalPages = Math.ceil(Products.length / itemsPerPage);

 
     const handlePageChange = (page) => {
         if (page >= 1 && page <= totalPages) {
             setCurrentPage(page);
         }
     };
 
     const handleRefresh = () => {
         setRefresh(!refresh);
         setCurrentPage(1); // Reset to first page after refresh
     };

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

        <div style={styles.item} onClick={() => navigate('/admincontrol')}>
          <FaUsersCog   style={styles.iconn} />
          <span className="label" style={styles.label}>
           Admin Control
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


{/* Filter and Results Section */}
<div
    style={{
        padding: '20px',
        maxWidth: '800px', // Restrict the width of the section
        margin: '0 auto', // Center it horizontally
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        marginTop: '80px', // Adjust this value to move content below the header
    }}
>
    <h1
        style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#0F5132',
            textAlign: 'center',
            marginBottom: '20px',
        }}
    >
        <FaChartBar style={{ marginRight: '10px', color: '#0F5132' }} />
        {localStorage.getItem('Username')}'s Products Report
    </h1>

    {/* Filter Section */}
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            justifyContent: 'space-evenly',
            flexWrap: 'wrap',
            marginBottom: '20px',
        }}
    >
{/* Filter by Date */}
<div 
    style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: '10px' // Spacing between date input and button 
    }}
>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label
            htmlFor="dateInput"
            style={{
                fontWeight: 'bold',
                color: '#333',
            }}
        >
            Filter by Date:
        </label>
        <input
            id="dateInput"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
            }}
        />
    </div>

    {/* Filter Date Button */}
    <button
        style={{
            backgroundColor: filteredD ? '#d9534f' : '#0F5132',
            color: '#fff',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            height: '40px', // Match input height for alignment
        }}
        onClick={() => handleFilterD()}
    >
        {filteredD ? 'Clear Filter' : 'Filter'}
    </button>
</div>


        {/* Filter by Product */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label
                htmlFor="productDropdown"
                style={{
                    fontWeight: 'bold',
                    color: '#333',
                }}
            >
                Filter by Product:
            </label>
            <select
                id="productDropdown"
                value={filterP ? filterP._id : ''}
                onChange={handleFilterChange}
                style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                }}
            >
                <option value="">Select a product</option>
                {Products.map((product) => (
                    <option key={product._id} value={product._id}>
                        {product.productName}
                    </option>
                ))}
            </select>
        </div>
    </div>

    {/* Filter Results */}
    <div
        style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
        }}
    >
        {filteredP && (
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                <h3
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#0F5132',
                        marginBottom: '15px',
                    }}
                >
                    Selected Product
                </h3>
                <p style={{ marginBottom: '10px' }}>
                    <FaBox style={{ color: '#0F5132', marginRight: '8px' }} />
                    <strong>Product Name:</strong> {filterP.productName}
                </p>
                <p style={{ marginBottom: '10px' }}>
                    <FaDollarSign style={{ color: '#0F5132', marginRight: '8px' }} />
                    <strong>Price:</strong> ${filterP.price}
                </p>
                <p>
                    <FaChartBar style={{ color: '#0F5132', marginRight: '8px' }} />
                    <strong>Sales:</strong> {filterP.sales}
                </p>
            </div>
        )}

        {filteredD &&
            productQuantity.map((product, index) => (
                <div
                    key={index}
                    style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <h3
                        style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#0F5132',
                            marginBottom: '15px',
                        }}
                    >
                        Filtered Product
                    </h3>
                    <p style={{ marginBottom: '10px' }}>
                        <FaBox style={{ color: '#0F5132', marginRight: '8px' }} />
                        <strong>Product:</strong> {product.productName}
                    </p>
                    <p>
                        <FaShoppingCart style={{ color: '#0F5132', marginRight: '8px' }} />
                        <strong>Quantity Sold:</strong> {product.quantity}
                    </p>
                </div>
            ))}
    </div>


{/* Product List */}
{!filteredP && !filteredD && (
    <>


{/* Pagination */}
<div style={productStyles.paginationContainer}>
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    style={{
      ...productStyles.paginationButton,
      ...(currentPage === 1 ? productStyles.paginationButtonDisabled : {}),
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#155724')}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = currentPage === 1 ? '#ccc' : '#0F5132')}
  >
    Previous
  </button>
  <p style={productStyles.paginationInfo}>
    Page {currentPage} of {Math.ceil(Products.length / itemsPerPage)}
  </p>
  <button
    onClick={() =>
      setCurrentPage((prev) =>
        Math.min(prev + 1, Math.ceil(Products.length / itemsPerPage))
      )
    }
    disabled={currentPage === Math.ceil(Products.length / itemsPerPage)}
    style={{
      ...productStyles.paginationButton,
      ...(currentPage === Math.ceil(Products.length / itemsPerPage) ? productStyles.paginationButtonDisabled : {}),
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#155724')}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = currentPage === Math.ceil(Products.length / itemsPerPage) ? '#ccc' : '#0F5132')}
  >
    Next
  </button>
</div>


        {isLoading ? (
            <p style={productStyles.loadingSpinner}>Loading...</p>
        ) : Products.length > 0 ? (
            <div style={productStyles.cardsContainer}>
                {currentProducts.map((product) => (
                    <div
                        key={product._id}
                        style={{
                            ...productStyles.card,
                            ...(hoveredProductId === product._id
                                ? productStyles.cardHover
                                : {}),
                        }}
                        onMouseEnter={() => setHoveredProductId(product._id)}
                        onMouseLeave={() => setHoveredProductId(null)}
                    >
                        <div style={productStyles.cardContent}>
                            <p style={productStyles.cardDetail}>
                                <FaBox style={productStyles.icon} /> 
                                <strong>Product:</strong> {product.productName}
                            </p>
                            <p style={productStyles.cardDetail}>
                                <FaDollarSign style={productStyles.icon} /> 
                                <strong>Price:</strong> ${product.price}
                            </p>
                            <p style={productStyles.cardDetail}>
                                <FaChartBar style={productStyles.icon} /> 
                                <strong>Sales:</strong> {product.sales}
                            </p>
                            <p style={productStyles.cardDetail}>
                                <FaShoppingCart style={productStyles.icon} /> 
                                <strong>Times Purchased:</strong> {product.sales === 0 
                                    ? 0 
                                    : (product.sales / product.price).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p style={productStyles.noProducts}>No products found.</p>
        )}
    </>
)}

</div>
</div>

);
}

const productStyles = {
  cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', // Keeps the card positions the same
      gap: '20px',
      marginTop: '20px',
  },
  paginationContainer: {
    marginTop: '-25px', // Raise the buttons up
    marginBottom: '20px', // Add space below the buttons to prevent collision
    display: 'flex',
    justifyContent: 'center', // Center the buttons
    alignItems: 'center', // Align vertically
    gap: '8px', // Space between buttons and text
  },
  paginationButton: {
    padding: '5px 10px', // Smaller button size
    fontSize: '14px', // Smaller text
    backgroundColor: '#0F5132', // Button background
    color: 'white', // Button text color
    border: 'none', // Removes default border
    borderRadius: '3px', // Slightly rounded corners
    cursor: 'pointer', // Pointer cursor on hover
    transition: 'background-color 0.3s', // Smooth hover effect
  },
  paginationButtonDisabled: {
    backgroundColor: '#ccc', // Disabled button background
    color: '#666', // Disabled text color
    cursor: 'not-allowed', // Disabled cursor
  },
  paginationInfo: {
    fontSize: '14px', // Smaller text size
    fontWeight: 'bold', // Bold text
    color: '#0F5132', // Text color matching theme
  },
  card: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardHover: {
      transform: 'scale(1.03)',
      boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
  },
  cardContent: {
      fontSize: '14px',
      color: '#333',
      lineHeight: '1.6',
  },
  cardDetail: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333',
  },
  icon: {
      marginRight: '8px',
      color: '#0F5132',
      fontSize: '18px',
  },
  paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '20px',
  },
  paginationButton: {
      backgroundColor: '#0F5132',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      cursor: 'pointer',
      fontWeight: 'bold',
      margin: '0 5px',
      transition: 'background-color 0.3s ease',
  },
  paginationButtonDisabled: {
      backgroundColor: '#aaa',
      cursor: 'not-allowed',
  },
  loadingSpinner: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#888',
  },
  noProducts: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#888',
      marginTop: '20px',
  },
};


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
  justifyContent: 'flex-end', // Aligns the entire section to the leftmost
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

  cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      marginTop: '90px',
  },
  card: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
  },
  cardTitle: { fontSize: '18px', fontWeight: 'bold', color: '#0F5132' },
  cardDetails: { fontSize: '16px', color: '#555' },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
},
paginationButton: {
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    margin: '0 5px',
    transition: 'background-color 0.3s ease',
},
paginationButtonDisabled: {
    backgroundColor: '#aaa',
    cursor: 'not-allowed',
},


};

export default AdminReport;