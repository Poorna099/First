import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [product, setProduct] = useState({
    product_name: '',
    description: '',
    category: '',
    scheduled_start_date: '',
    free_delivery: false,
    delivery_amount: '',
    price: '',
    discount: '',
    image_url: null,
    product_url: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, image_url: e.target.files[0] });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    // Append all fields to formData
    formData.append("product_name", product.product_name);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("scheduled_start_date", product.scheduled_start_date);
    formData.append("free_delivery", product.free_delivery);
    const deliveryAmount = product.delivery_amount ? product.delivery_amount : '0';
    formData.append("delivery_amount", deliveryAmount);
    formData.append("price", product.price);
    formData.append("discount", product.discount);
    if (product.image_url) {
      formData.append("image_url", product.image_url);
    } else {
      console.error("No image file selected.");
      alert("Please select an image file.");
      return;
    }
    formData.append("product_url", product.product_url);
  
    try {
      const response = await axios.post('http://localhost:3001/api/add-product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("Server response:", response.data);
      alert('Product added successfully!');
     
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
      alert('Failed to add product.');
    }
  };




  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="product_name" placeholder="Product Name" value={product.product_name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" value={product.category} onChange={handleChange} />
        <input type="datetime-local" name="scheduled_start_date" value={product.scheduled_start_date} onChange={handleChange} required />
        
        <label>
          Free Delivery
          <input type="checkbox" name="free_delivery" checked={product.free_delivery} onChange={handleChange} />
        </label>
        <input type="number" name="delivery_amount" placeholder="Delivery Amount" value={product.delivery_amount} onChange={handleChange} disabled={product.free_delivery} />
        <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required step="0.01" />
        <input type="number" name="discount" placeholder="Discount (%)" value={product.discount} onChange={handleChange} />
        <input type="file" name="image_url" accept="image/*" onChange={handleFileChange} required />
        <input type="text" name="product_url" placeholder="Product URL" value={product.product_url} onChange={handleChange} required />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
