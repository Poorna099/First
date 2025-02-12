
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import ViewStaff from "./pages/ViewStaff";
import ViewUsers from "./pages/ViewUsers";
import ViewVendors from "./pages/ViewVendors";
import AddProduct from "./pages/AddProduct"


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
         
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/viewstaff" element={<ViewStaff/>} />
          <Route path="/viewusers" element={<ViewUsers/>} />
          <Route path="/viewvendors" element={<ViewVendors/>} />
          <Route path="/addproduct" element={<AddProduct/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
