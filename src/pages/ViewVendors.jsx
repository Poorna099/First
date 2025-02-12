import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewVendors.css';

const ViewVendors = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    userId: '',
    name: '',
    email: '',
    password:'companypass',
    role: 'Vendors',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/Vendors');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/add-staff', newStaff);
      alert('Vendor added successfully!');
      setIsModalOpen(false);
      setUsers([...users, newStaff]); 
      setNewStaff({ userId: '', name: '', email: '', password:'companypass', role: 'Vendor' });
    } catch (error) {
      console.error('Error adding Vendor:', error);
      alert('Failed to add Vendor.');
    }
  };

  return (
    <div>
      <h2>Vendors List</h2>
      

      <table border="1" style={{width:'70%',marginLeft:'10%'}}>
        <thead>
          <tr>
            <th>Vendors ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No Vendors found</td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={() => setIsModalOpen(true)} style={{width:'20%', marginTop:'5%'}}>Add Vendors</button>

      {/* Modal for Adding Vendor */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2 >Add Vendor</h2>
            <form onSubmit={handleSubmit}>
              <label>Vendor ID:</label>
              <input type="text" name="userId" value={newStaff.userId} onChange={handleChange} required />

              <label>Name:</label>
              <input type="text" name="name" value={newStaff.name} onChange={handleChange} required />

              <label>Email:</label>
              <input type="email" name="email" value={newStaff.email} onChange={handleChange} required />

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewVendors;

