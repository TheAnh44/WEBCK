import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './CustomerDashboard.css';
import { Outlet } from'react-router-dom';

function CustomerDashboard() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div className="customer-dashboard">
      <Sidebar />
      <div className="main-content">
        <Outlet/>
        <h1>Customer Dashboard</h1>
        <div className="table-box">
          <h2>Book List</h2>
          <div className="book-table-container">
            <table className="book-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Author</th>
                  <th>Publication Year</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.ten_sach}</td>
                    <td>{book.mo_ta}</td>
                    <td>{book.tac_gia}</td>
                    <td>{book.nam_xuat_ban}</td>
                    <td>{book.trang_thai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;