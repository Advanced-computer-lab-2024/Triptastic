import React, { useState, useEffect } from 'react';

const EditProducts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [myProducts, setMyProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    const [editProductData, setEditProductData] = useState({

        productName: '',
        description: '',
        price: '',
        stock: '',
        rating: ''
      });

      const handleInputChange2 = (e) => {
        const { name, value } = e.target;
        setEditProductData((prevData) => ({
          ...prevData,
          [name]: value
        }));
      };
      const handleSaveProduct = async (productId) => {
        // Save the updated product data to the server...
        // After saving, update the sellerProducts state and reset editProductId
        try {
          const response = await fetch(`http://localhost:8000/updateProduct?productId=${productId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(editProductData),
          });
      
          if (response.ok) {
            const updatedProduct = await response.json();
            setMyProducts((prevProducts) =>
              prevProducts.map((product) =>
                product._id === productId ? updatedProduct : product
              )
            );
            setEditProductId(null);
          } else {
            console.error('Failed to update product');
          }
        } catch (error) {
          console.error('Error updating product:', error);
        }
      };
      const handleProductEdit = (productId) => {
        const product = myProducts.find((product) => product._id === productId);
        setEditProductId(productId);
        setEditProductData({
          productName: product.productName,
          description: product.description,
          price: product.price,
          stock: product.stock,
          rating: product.rating
        });
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
      useEffect(() => {
        fetchMyProducts();
    
      }, []);

  return (
<div style={styles.card}>
  <h1 style={styles.cardTitle}>My Products</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {myProducts.length === 0 && !loading ? (
        <p>No products found.</p>
      ) : (
        <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Product Name</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Stock</th>
            <th style={styles.th}>Rating</th>
            <th style={styles.th}></th> {/* Add a column for buttons */}
          </tr>
        </thead>
        <tbody>
          {myProducts.map((product) => (
            <tr key={product._id} style={styles.tr}>
              <td style={styles.td}>
                  {editProductId === product._id ? (
                    <input
                      type="text"
                      name="productName"
                      value={editProductData.productName}
                      onChange={handleInputChange2}
                    />
                  ) : (
                    product.productName
                  )}
                </td>
                <td style={styles.td}>
                  {editProductId === product._id ? (
                    <input
                      type="text"
                      name="description"
                      value={editProductData.description}
                      onChange={handleInputChange2}
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td style={styles.td}>
                  {editProductId === product._id ? (
                    <input
                      type="number"
                      name="price"
                      value={editProductData.price}
                      onChange={handleInputChange2}
                    />
                  ) : (
                    `$${product.price}`
                  )}
                </td>
                <td style={styles.td}>
                  {editProductId === product._id ? (
                    <input
                      type="number"
                      name="stock"
                      value={editProductData.stock}
                      onChange={handleInputChange2}
                    />
                  ) : (
                    product.stock
                  )}
                </td>
                <td style={styles.td}>
                  {editProductId === product._id ? (
                    <input
                      type="number"
                      name="rating"
                      value={editProductData.rating}
                      onChange={handleInputChange2}
                    />
                  ) : (
                    product.rating
                  )}
                </td>
                <td style={styles.td}>
                  {editProductId === product._id ? (
                    <button
                      style={styles.button}
                      onClick={() => handleSaveProduct(product._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      style={styles.button}
                      onClick={() => handleProductEdit(product._id)}
                    >
                      Edit
                    </button>
                  )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
  </div>
  );
};

const styles = {

    card: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
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
      error: {
        color: 'red',
        textAlign: 'center',
      },

};

export default EditProducts;
