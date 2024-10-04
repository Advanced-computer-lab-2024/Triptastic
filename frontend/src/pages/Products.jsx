
import React, { useEffect, useState } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/viewProducts'); // Adjust URL based on your backend setup
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
 
  return (
  <div>
  <h1>Products Page</h1>
  {products.length === 0 ? (
    <p>No products available.</p>
  ) : (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {products.map((product) => (
        <li key={product.productName} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h2>{product.productName}</h2> {/* Display product name */}
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Rating:</strong> {product.rating}</p>
          <p><strong>Seller:</strong> {product.seller}</p>
          <p><strong>Review:</strong> {product.review}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          {product.image && <img src={product.image} alt={product.productName} style={{ width: '100px', height: 'auto' }} />} {/* Display product image */}
        </li>
      ))}
    </ul>
  )}
</div>
  )
};

export default Products;
