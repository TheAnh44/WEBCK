import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="unauthorized">
      <h1>Unauthorized Access</h1>
      <p>Sorry, you don't have permission to view this page.</p>
      <p>Please log in with an account that has the necessary permissions.</p>
      <Link to="/login">Go to Login Page</Link>
    </div>
  );
}

export default Unauthorized;