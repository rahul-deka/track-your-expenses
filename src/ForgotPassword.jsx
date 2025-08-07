import React, { useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { TextField, Button, Alert, Typography, Box, Paper } from '@mui/material';
import { validateEmailForReset } from './utils/emailValidation';

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      
      // Validate email format
      const emailValidation = await validateEmailForReset(emailRef.current.value);
      if (!emailValidation.isValid) {
        setError(emailValidation.error);
        return;
      }
      
      // Try to send password reset email
      await resetPassword(emailRef.current.value);
      setMessage('If an account with this email exists, you will receive password reset instructions in your inbox.');
    } catch (error) {
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/user-not-found') {
        setError('No account is associated with this email address');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many reset attempts. Please try again later.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
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
          margin: 2
        }}
      >
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Password Reset
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField 
            inputRef={emailRef} 
            label="Email" 
            type="email" 
            required 
            fullWidth 
            sx={{ mb: 3 }}
            disabled={loading}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </Button>
        </Box>

        <Box textAlign="center">
          <Typography variant="body2">
            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
              Back to Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}