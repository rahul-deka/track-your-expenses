import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Expense Tracker 💸</h1>
      <p>Track your income & expenses easily.</p>
      <Link to="/login">
        <button style={{ margin: '10px' }}>Login</button>
      </Link>
      <Link to="/signup">
        <button style={{ margin: '10px' }}>Sign Up</button>
      </Link>
    </div>
  );
}