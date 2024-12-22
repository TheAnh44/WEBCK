const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'The12345@',
  port: 5432,
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM Tai_khoan WHERE tai_khoan = $1 AND mat_khau = $2',
      [username, password]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ success: true,
         message: 'Login successful',
          user: {
            username: user.tai_khoan,
            role: user.quyen
            } 
          });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password, name, address, phone, email } = req.body;
  try {
    // Check if username or email already exists
    const checkUser = await pool.query(
      'SELECT * FROM KHACHHANG WHERE tai_khoan = $1 OR email = $2',
      [username, email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    // If username and email are unique, proceed with registration
    await pool.query(
      'INSERT INTO KHACHHANG (ten, dia_chi, sdt, tai_khoan, mat_khau, email) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, address, phone, username, password, email]
    );
    res.json({ success: true, message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM SACH');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'An error occurred while fetching books' });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Sach');
    res.json({ success: true, books: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error while fetching books' });
  }
});
app.post('/api/books', async (req, res) => {
  const { ten_sach, mo_ta, tac_gia, nam_xuat_ban } = req.body;
  try {
    await pool.query(
      'INSERT INTO Sach (ten_sach, mo_ta, tac_gia, nam_xuat_ban) VALUES ($1, $2, $3, $4)',
      [ten_sach, mo_ta, tac_gia, nam_xuat_ban]
    );
    res.json({ success: true, message: 'Book added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error while adding book' });
  }
});

// Endpoint to delete a book by ID
app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Sach WHERE id = $1', [id]);
    if (result.rowCount > 0) {
      res.json({ success: true, message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Book not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error while deleting book' });
  }
});
// Add this code to your server.js file

// Endpoint to update a book by ID
app.put('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const { ten_sach, mo_ta, tac_gia, nam_xuat_ban } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Sach SET ten_sach = $1, mo_ta = $2, tac_gia = $3, nam_xuat_ban = $4 WHERE id = $5',
      [ten_sach, mo_ta, tac_gia, nam_xuat_ban, id]
    );

    if (result.rowCount > 0) {
      res.json({ success: true, message: 'Book updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Book not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error while updating book' });
  }
});
app.get('/api/themuon', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM TheMuon');
    res.json({ success: true, loanCards: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error while fetching loan cards' });
  }
});
app.put('/api/themuon/:id', async (req, res) => {
  const { id } = req.params; // Get the loan card ID from the URL parameters
  const { id_nhan_vien } = req.body; // Get the employee ID from the request body

  try {
    // Update the loan card with the provided employee ID
    const result = await pool.query(
      'UPDATE TheMuon SET id_nhan_vien = $1 WHERE id = $2 RETURNING *',
      [id_nhan_vien, id]
    );

    // Check if the loan card was found and updated
    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Loan card updated successfully', loanCard: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: 'Loan card not found' });
    }
  } catch (err) {
    console.error('Error updating loan card:', err);
    res.status(500).json({ success: false, message: 'Server error while updating loan card' });
  }
});
app.put('/api/confirm-return/:id', async (req, res) => {
  const { id } = req.params;
  const { ngay_tra_thuc_te } = req.body;

  try {
    const result = await pool.query('UPDATE TheMuon SET ngay_tra_thuc_te = $1 WHERE id = $2', [ngay_tra_thuc_te, id]);
    if (result.rowCount > 0) {
      res.json({ success: true, message: 'Ngày trả đã được cập nhật thành công.' });
    } else {
      res.json({ success: false, message: 'Thẻ mượn không tìm thấy.' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật ngày trả:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
});