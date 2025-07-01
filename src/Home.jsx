import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Box, Typography, Button } from '@mui/material';

export default function Home() {
  const { currentUser } = useAuth();

  if (currentUser) return <Navigate to="/dashboard" />;

  return (
    <Box
      sx={{
        Height: '90vh',
        px: 3,
        py: 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h2" fontWeight="bold" gutterBottom>
        Expense Tracker
      </Typography>

      <Typography variant="h6" color="text.secondary" maxWidth="600px" sx={{ mb: 5 }}>
        Gain clarity over your finances. Track your income, monitor expenses, and stay in control —
        all in one place.
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/login"
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          component={Link}
          to="/signup"
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}