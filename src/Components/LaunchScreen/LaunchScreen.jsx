import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LaunchScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }}>
      <h1>Welcome to Expense Tracker</h1>
      <p>Loading...</p>
    </div>
  );
}

export default LaunchScreen;