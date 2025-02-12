import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; 
import './Dashboard.css';

const Dashboard = () => {
  const [role, setRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/role', { withCredentials: true }); 
        setRole(response.data.role); 
      } catch (error) {
        console.error('Error fetching role data:', error);
      }
    };


    // Fetch Products
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/products', { withCredentials: true });
        console.log('Fetched Products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchRole();
    fetchProducts();
  }, []);

    

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleImageClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };


  const handleNavigation = (path) => {
    navigate(path); 
    setIsMenuOpen(false); 
  };


const renderMenuOptions = () => {
  if (role === 'Admin') {
    return (
      <ul>
        <li onClick={() => handleNavigation('/ViewVendors')}>View Vendors</li>
        <li onClick={() => handleNavigation('/ViewStaff')}>View Staff</li>
        <li onClick={() => handleNavigation('/ViewUsers')}>View Users</li>
        <li onClick={() => handleNavigation('/AddProduct')}>Add Product</li>
      </ul>
    );
  } else if (role === 'Vendor' || role === 'Staff') {
    return (
      <ul>
        <li onClick={() => handleNavigation('/AddProduct')}>Add Product</li>
      </ul>
    );
  }
  return null;
};


  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
        {['Admin', 'Staff', 'Vendor'].includes(role) && (
            <span className="menu-icon" onClick={toggleMenu}>☰</span>
          )}
          {isMenuOpen && (
            <div className="menu-dropdown">
              {renderMenuOptions()}
            </div>
          )}
        </div>
        <div className="navbar-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
             <FaSearch onClick={handleSearch} className="search-icon"/>
          </div>
        </div>
      </nav>
      


      <div className="product-list">
        {products.map((product) => (
          <div key={product.product_id} className="product-card" onClick={() => handleImageClick(product)}>
            <img 
              src={product.image_url ? `http://localhost:3001${product.image_url}` : '/default-image.png'} 
              alt={product.product_name} 
              className="product-image" 
            />
            <h3>{product.product_name}</h3>
            <p>Price: {product.price}</p>
          </div>
        ))}
      </div>
      {selectedProduct && (
  <div className="modal-overlay" onClick={handleCloseModal}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <span className="close-button" onClick={handleCloseModal}>&times;</span>
      <img 
        src={selectedProduct.image_url ? `http://localhost:3001${selectedProduct.image_url}` : '/default-image.png'} 
        alt={selectedProduct.product_name} 
        className="product-image" 
      />
      <h2>{selectedProduct.product_name}</h2>
      <p><strong>Description:</strong> {selectedProduct.description}</p>
      <p><strong>Scheduled Start Date:</strong> {selectedProduct.scheduled_start_date}</p>
      <p><strong>Expiry Date:</strong> {selectedProduct.expiry_date}</p>
      <p><strong>Price:</strong> {selectedProduct.price}</p>
      <p><strong>Discount:</strong> {selectedProduct.discount}%</p>
      <p><strong>Delivery Amount:</strong> {selectedProduct.delivery_amount ? `$${selectedProduct.delivery_amount}` : 'Free'}</p>
    </div>
  </div>
)}
    </div>


  );
};

export default Dashboard;