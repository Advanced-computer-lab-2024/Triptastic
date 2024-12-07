import React, { useState } from 'react';
import { FaTag, FaThList,FaPercent,FaPlus } from 'react-icons/fa';
import PrefTags from './preftags'; // Import your Preference Tags component
import Category from './category'; // Import your Category component
import image from '../images/image.png';
import PromoCodeForm from './PromoCodeForm'; // Adjust the path based on your file structure
import AddProduct from './AddProduct'; // Import AddProduct

const ManagementPage = () => {
  const [activeTab, setActiveTab] = useState('preftags');

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={image} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title}>Management Page</h1>
      </header>

      {/* Tabs */}
      <div style={styles.tabs}>
      <button
          style={activeTab === 'preftags' ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab('preftags')}
        >
          <FaTag style={styles.icon} /> Preference Tags
        </button>
        
        <button
          style={activeTab === 'categories' ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab('categories')}
        >
          <FaThList style={styles.icon} /> Categories
        </button>
      <button
  style={activeTab === 'promoCode' ? styles.activeTab : styles.inactiveTab}
  onClick={() => setActiveTab('promoCode')}
>
  <FaPercent style={{ marginRight: '8px' }} />
  Promo Codes
</button>

<button
          style={activeTab === 'addProduct' ? styles.activeTab : styles.inactiveTab}
          onClick={() => setActiveTab('addProduct')}
        >
          <FaPlus style={styles.tabIcon} /> Add Product
        </button>


      </div>

      {/* Content */}
      <div style={styles.content}>
      {activeTab === 'addProduct' && <AddProduct />} {/* AddProduct Content */}
      {activeTab === 'promoCode' && <PromoCodeForm />}
        {activeTab === 'preftags' && <PrefTags />}
        {activeTab === 'categories' && <Category />}
      </div>
    </div>
  );
};


const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '80px',
  },
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
    padding: '10px 20px',
  },
  logoContainer: {
    marginBottom: '10px',
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
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    marginTop: '80px', // To give space from header
  },
  activeTab: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '0 10px',
    display: 'flex',
    alignItems: 'center',
  },
  inactiveTab: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#ccc',
    color: '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '0 10px',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '8px',
  },
  content: {
    marginTop: '20px',
  },
};

export default ManagementPage;
