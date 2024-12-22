import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar-container">
      <Header />
      <div className="sidebar">
        <ul>
          <li><Link to="/customer-dashboard">Home</Link></li>
          <li><Link to="/customer-dashboard/profile">Profile</Link></li>
          <li><Link to="/customer-dashboard/giohang">Orders</Link></li>
          <li><Link to="/customer-dashboard/support">Support</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;