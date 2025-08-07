import React, { useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Alert, Divider, IconButton } from '@mui/material';
import { Google, ArrowBack } from '@mui/icons-material';
import { validateEmail } from './utils/emailValidation';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      
      // Validate email using Abstract API
      const emailValidation = await validateEmail(emailRef.current.value);
      if (!emailValidation.isValid) {
        setError(emailValidation.error);
        return;
      }
      
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch (error) {
      setError('Failed to log in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to log in with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
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
        <Box display="flex" alignItems="center" mb={2} position="relative">
          <IconButton 
            component={Link} 
            to="/" 
            sx={{ position: 'absolute', left: 0 }}
            disabled={loading}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h2" sx={{ width: '100%', textAlign: 'center' }}>
            Login
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField 
            inputRef={emailRef} 
            label="Email" 
            type="email" 
            required 
            fullWidth 
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField 
            inputRef={passwordRef} 
            label="Password" 
            type="password" 
            required 
            fullWidth 
            sx={{ mb: 2 }}
            disabled={loading}
          />
          
          <Box textAlign="center" sx={{ mb: 3 }}>
            <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#1976d2', fontSize: '0.875rem' }}>
              Forgot Password?
            </Link>
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          fullWidth
          startIcon={<Google />}
          sx={{ mb: 2, py: 1.5 }}
          disabled={loading}
        >
          Continue with Google
        </Button>

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