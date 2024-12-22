import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './Components/Auth';
import ProtectedRoute from './Components/ProtectedRoute';
import CustomerDashboard from './Main/CustomerDashboard';
import EmployeeDashboard from './Main/EmployeeDashboard';
import Unauthorized from './Components/Unauthorized';
import Orders from './Main/giohang';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route 
          path="/customer-dashboard" 
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employee-dashboard" 
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Auth />} />
        <Route path="/customer-dashboard/giohang" element={<Orders/>} />
      </Routes>
    </Router>
  );
}

export default App;