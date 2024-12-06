import React, { useState, useEffect, useContext } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { CurrencyContext } from '../pages/CurrencyContext';
import logo from '../images/image.png'; // Replace with your logo path
import { FaUserCircle,FaShoppingCart,FaRegFileAlt, FaDollarSign, FaStar, FaComments, FaWarehouse, FaChartBar,FaBars} from 'react-icons/fa';
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel,
  FaClipboardList,FaSearch } from "react-icons/fa";
  
  import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
const Products = () => {
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [minPrice, setMinPrice] = useState(''); // State for minimum price
  const [maxPrice, setMaxPrice] = useState(''); // State for maximum price
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [fetchedProduct, setFetchedProduct] = useState(null);//new
  const [errorMessage, setErrorMessage] = useState('');
  const [originalProducts, setOriginalProducts] = useState([]); // To store the original products fetched

  const username = localStorage.getItem('Username'); // Retrieve username from local storage
  const [formData, setFormData] = useState({
    Username: '',
    points:'',
    badge:'',
    Email: '',
    Password: '',
    Nationality: '',
    DOB: '',
    Occupation: '',
    Wallet: '',
    title: '', 
    body: '',  
    date: ''  
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const fetchProductsByRating = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/sortProductsByRatingTourist'); // Fetch sorted products
      if (!response.ok) {
        throw new Error('Failed to fetch sorted products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };const fetchProducts = async (minPrice = '', maxPrice = '') => {  
    setLoading(true);
    setError('');
    try {
      let url = 'http://localhost:8000/viewProductsTourist'; // Default URL to fetch all products
      
      // If price filters are applied, modify the URL
      if (minPrice || maxPrice) {
        url = `http://localhost:8000/filterProductsByPriceRange?minPrice=${minPrice}&maxPrice=${maxPrice}`;
      }
  
      const response = await fetch(url); // Fetch either all or filtered products based on the URL
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
  
      const data = await response.json();
      setProducts(data); // Set all fetched products
      setOriginalProducts(data); // Store original products for search functionality
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSearchProduct = (productName) => {
    const lowercasedProductName = productName.toLowerCase(); // Case-insensitive search
  
    // Filter the products based on the search query
    const filteredProducts = originalProducts.filter(product => 
      product.productName.toLowerCase().includes(lowercasedProductName)
    );
  
    if (filteredProducts.length > 0) {
      setProducts(filteredProducts); // Set the filtered products to display
      setErrorMessage(''); // Clear any previous error messages
    } else {
      setProducts([]); // Clear the products if no match
      setErrorMessage('No product found with that name.');
    }
  };
  
  const handleProfileRedirect = () => {
    const context = localStorage.getItem('context');

    if (context === 'tourist') {
      navigate('/tourist-profile');
    } else if (context === 'seller') {
      navigate('/seller-profile');
    } else if (context === 'admin') {
      navigate('/adminPage');
     } else if (context === 'guest') {
        navigate('/Guest');
    } else {
      console.error('Unknown context');
      navigate('/'); // Fallback to home
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch(`http://localhost:8000/addProductToCart?Username=${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: product.productName,
          quantity: 1, // Default quantity, can be changed
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(`${product.productName} added to cart successfully!`);
        setCart([...cart, { ...product, quantity: 1 }]); // Update cart state if needed
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const response = await fetch(`http://localhost:8000/addProductToWishlist`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, productId: product._id }),
      });

      if (response.ok) {
        alert(`${product.productName} added to wishlist successfully!`);
        setWishlist((prev) => [...prev, product._id]); // Update wishlist state
      } else {
        throw new Error('Failed to add product to wishlist');
      }
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      alert('Failed to add product to wishlist');
    }
  };
  const handleViewWishlist = () => {
    navigate('/Wishlist'); // Navigate to Wishlist page
  };
   
 
  
  const handleFilterSubmit = (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    fetchProducts(minPrice, maxPrice); // Fetch products based on the entered price range
  };

  // Initial fetches on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      
      <header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <h1 style={styles.title}>Products</h1>
  <div style={styles.headerIcons}>
    {/* Profile Icon */}
    <FaUserCircle
      alt="Profile Icon"
      style={styles.profileIcon}
      onClick={handleProfileRedirect} // Navigate to profile
    />
    {/* Wishlist Icon */}
    <div style={styles.wishlistIcon} onClick={() => navigate('/wishlist')}>
      <FaHeart style={styles.wishlistHeartIcon} />
    </div>
    {/* Cart Icon */}
    <div style={styles.cartButton} onClick={() => navigate('/Cart')}>
      <FaShoppingCart style={styles.cartIcon} />
    </div>
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
        <div style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaLandmark style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Sites
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/museums')}>
          <FaUniversity style={styles.icon} />
          <span className="label" style={styles.label}>
            Museums
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/products')}>
          <FaBox style={styles.icon} />
          <span className="label" style={styles.label}>
            Products
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/itineraries')}>
          <FaMap style={styles.icon} />
          <span className="label" style={styles.label}>
            Itineraries
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/activities')}>
          <FaRunning style={styles.icon} />
          <span className="label" style={styles.label}>
            Activities
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-flights')}>
          <FaPlane style={styles.icon} />
          <span className="label" style={styles.label}>
            Book Flights
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-hotels')}>
          <FaHotel style={styles.icon} />
          <span className="label" style={styles.label}>
            Book a Hotel
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-transportation')}>
          <FaBus style={styles.icon} />
          <span className="label" style={styles.label}>
           Transportation
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/tourist-orders')}>
          <FaClipboardList style={styles.icon} />
          <span className="label" style={styles.label}>
            Past Orders
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/AttendedActivitiesPage')}>
          <FaStar style={styles.icon} />
          <span className="label" style={styles.label}>
            Review Activities
          </span>
        </div>
      </div>


      <div className="card" style={styles.card}>
      <h3 style={{ 
  fontSize: '18px', 
  fontWeight: 'bold', 
  marginTop: '20px',  // Adds space above the element
  color: '#333' 
}}>

</h3>
<div style={styles.container}>
  <h3 style={styles.cardTitle}>Looking for a certain product?</h3>

  <div style={styles.flexContainer}>
    {/* Search Section */}
    <div style={styles.searchContainer}>
      <div style={styles.inputContainer}>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          placeholder="Enter product name"
          style={styles.input}
        />
        <button onClick={() => handleSearchProduct(formData.productName)} style={styles.iconButton}>
          <FaSearch />
        </button>
      </div>
    </div>

    {/* Filter Section */}
    <form onSubmit={handleFilterSubmit} style={styles.filterForm}>
      <div style={styles.filterGroup}>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min Price"
          style={styles.filterInput}
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
          style={styles.filterInput}
        />
        <button type="submit" style={styles.filterButton}>
          Filter
        </button>
      </div>
    </form>
  </div>

  {/* Product Details */}
  {fetchedProduct && (
    <div style={styles.productDetails}>
      <h4 style={styles.sectionTitle}>Product Details</h4>
      <p><strong>Name:</strong> {fetchedProduct.productName}</p>
      <p><strong>Description:</strong> {fetchedProduct.description}</p>
      <p><strong>Price:</strong> {(fetchedProduct.price * conversionRate).toFixed(2)} {selectedCurrency}</p>
      <p><strong>Stock:</strong> {fetchedProduct.stock}</p>
    </div>
  )}

 </div>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
 <ul style={styles.productList}>
  {products.map((product) => (
    <li key={product.productName} style={styles.productCard}>
      {product.image && (
        <img
          src={`http://localhost:8000/${product.image.replace(/\\/g, '/')}`}
          alt={product.productName}
          style={styles.productImage}
        />
      )}
      <div style={styles.productInfo}>
        <h2 style={styles.productName}>{product.productName}</h2>
        <p><strong><FaRegFileAlt /> Description
     </strong> {product.description}</p>
        <p><strong><FaDollarSign /> Price:</strong> {selectedCurrency}{' '}
          {(product.price * conversionRate).toFixed(2)}
        </p>
        <p><strong><FaStar /> Rating:</strong> {product.rating}</p>
        <p><strong><FaComments /> Review:</strong> {product.review}</p>
        <p><strong><FaWarehouse /> Stock:</strong> {product.stock}</p>
        <p><strong><FaChartBar /> Sales:</strong> {product.sales}</p>
        <div style={styles.productActions}>
          <button onClick={() => handleAddToCart(product)} style={styles.actionButton}>
          <FaShoppingCart/>
          </button>
          <button
  onClick={() => handleAddToWishlist(product)}
  style={styles.icons}
 >
  <FaHeart style={styles.icons} />

 </button>

        </div>
      </div>
    </li>
  ))}
 </ul>

      )}
    </div>
    </div>

  );
};

//styles
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
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensures vertical alignment
    gap: '20px',
    flexWrap: 'wrap',
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
    color: '#fff',
    opacity:1,
     // Icons are always white
  },
  item: {
 
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
  labelVisible: {
    opacity: 1, // Fully visible when expanded
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: 0, // Reset margin to ensure alignment
  },
};

export default Products;
