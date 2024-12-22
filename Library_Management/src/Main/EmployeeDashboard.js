import React, { useEffect, useState } from 'react';
import './EmployeeDashboard.css'; // Ensure to import your CSS file
import LoanCards from './LoanCards'; // Import the LoanCards component

function EmployeeDashboard() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ ten_sach: '', mo_ta: '', tac_gia: '', nam_xuat_ban: '' });
  const [editBook, setEditBook] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [user, setUser ] = useState(null); // State to hold user information
  const [activeTab, setActiveTab] = useState('books'); // State to manage active tab

  useEffect(() => {
    fetchBooks();
    const loggedInUser  = JSON.parse(localStorage.getItem('user')); // Retrieve user info from local storage
    setUser (loggedInUser ); // Set user state
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      if (data.success) {
        setBooks(data.books);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
      const data = await response.json();
      if (data.success) {
        alert('Book added successfully!');
        setNewBook({ ten_sach: '', mo_ta: '', tac_gia: '', nam_xuat_ban: '' });
        setShowAddForm(false);
        fetchBooks(); // Refresh the book list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleEditBook = (id) => {
    const bookToEdit = books.find(book => book.id === id);
    setEditBook(bookToEdit);
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/books/${editBook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editBook),
      });
      const data = await response.json();
      if (data.success) {
        alert('Book updated successfully!');
        setEditBook(null);
        fetchBooks(); // Refresh the book list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        alert('Book deleted successfully!');
        fetchBooks(); // Refresh the book list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="employee-dashboard">
      <h1 style={{ color: 'white' }}>Employee Dashboard</h1>
      {user && (
        <div style={{ color: 'white' }}>
          <p>Welcome, {user.username}!</p> {/* Display user information */}
          <p>Email: {user.email}</p> {/* Display additional user information */}
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button onClick={() => setActiveTab('books')}>Books</button>
        <button onClick={() => setActiveTab('loanCards')}>Loan Cards</button>
      </div>

      {/* Conditional Rendering of Tabs */}
      {activeTab === 'books' && (
        <div>
          <button onClick ={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : ' Add New Book'}
          </button>

          {showAddForm && (
            <form onSubmit={handleAddBook}>
              <input
                type="text"
                placeholder="Tên sách"
                value={newBook.ten_sach}
                onChange={(e) => setNewBook({ ...newBook, ten_sach: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Mô tả"
                value={newBook.mo_ta}
                onChange={(e) => setNewBook({ ...newBook, mo_ta: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Tác giả"
                value={newBook.tac_gia}
                onChange={(e) => setNewBook({ ...newBook, tac_gia: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Năm xuất bản"
                value={newBook.nam_xuat_ban}
                onChange={(e) => setNewBook({ ...newBook, nam_xuat_ban: e.target.value })}
                required
              />
              <button type="submit">Add Book</button>
            </form>
          )}

          {editBook && (
            <form onSubmit={handleUpdateBook}>
              <input
                type="text"
                placeholder="Tên sách"
                value={editBook.ten_sach}
                onChange={(e) => setEditBook({ ...editBook, ten_sach: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Mô tả"
                value={editBook.mo_ta}
                onChange={(e) => setEditBook({ ...editBook, mo_ta: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Tác giả"
                value={editBook.tac_gia}
                onChange={(e) => setEditBook({ ...editBook, tac_gia: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Năm xuất bản"
                value={editBook.nam_xuat_ban}
                onChange={(e) => setEditBook({ ...editBook, nam_xuat_ban: e.target.value })}
                required
              />
              <button type="submit">Update Book</button>
            </form>
          )}

          <ul>
            {books.map(book => (
              <li key={book.id}>
                {book.ten_sach} - {book.tac_gia}
                <button onClick={() => handleEditBook(book.id)}>Edit</button>
                <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'loanCards' && (
        <LoanCards user={user} />
      )}
    </div>
  );
}

export default EmployeeDashboard;