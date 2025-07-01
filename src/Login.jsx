import React, { useRef } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(emailRef.current.value, passwordRef.current.value);
    navigate('/');
  };

  return (
    <Box
      sx={{
        height: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
          boxShadow: 3,
          margin: 2
        }}
      >
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Login
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField 
            inputRef={emailRef} 
            label="Email" 
            type="email" 
            required 
            fullWidth 
            sx={{ mb: 2 }}
          />
          <TextField 
            inputRef={passwordRef} 
            label="Password" 
            type="password" 
            required 
            fullWidth 
            sx={{ mb: 3 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ mb: 2, py: 1.5 }}
          >
            Login
          </Button>
        </Box>

        <Box textAlign="center">
          <Typography variant="body2">
            New here?{' '}
            <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}