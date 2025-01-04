import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LaunchScreen from './Components/LaunchScreen/LaunchScreen';
import LoginScreen from './Components/LoginScreen/LoginScreen';
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LaunchScreen />} />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginScreen onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;