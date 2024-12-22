import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';


function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? 'login' : 'register';
      const body = isLogin
        ? { username, password }
        : { username, password, name, address, phone, email };

      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.user.role === 0) {
            navigate('/customer-dashboard');
          } else if (data.user.role === 1) {
            navigate('/employee-dashboard');
          }
        } else {
          alert('Registration successful. Please log in.');
          setIsLogin(true);
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  }, [isLogin, username, password, name, address, phone, email, navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Reset form fields when toggling
    setUsername('');
    setPassword('');
    setEmail('');
    setName('');
    setAddress('');
    setPhone('');
  };

  return (
    <div className="auth-container">
      <div className={`forms-container ${isLogin ? '' : 'fade'}`}>
        <form onSubmit={handleSubmit} className={isLogin ? 'login-form' : 'register-form'}>
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </>
          )}
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
      </div>
      <button className="toggle-btn" onClick={toggleForm}>
        {isLogin ? 'Need to create an account?' : 'Already have an account?'}
      </button>
    </div>
  );
}

export default Auth;