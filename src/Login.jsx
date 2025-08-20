import React, { useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Alert, Divider, IconButton } from '@mui/material';
import { Google, ArrowBack, Savings as PiggyBankIcon } from '@mui/icons-material';
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
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 400,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.10)',
          mx: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box sx={{ width: 32, height: 32, bgcolor: '#059669', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PiggyBankIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.25rem', color: '#111827', ml: 1 }}>
              Hisap
            </Typography>
          </Box>
          <Typography sx={{ color: '#6b7280', fontFamily: 'Inter, sans-serif', fontSize: '1rem', textAlign: 'center' }}>
            Welcome back! Sign in to your account
          </Typography>
        </Box>
        <IconButton 
          component={Link} 
          to="/" 
          sx={{ position: 'absolute', left: 16, top: 16, bgcolor: '#f3f4f6', color: '#059669', '&:hover': { bgcolor: '#e5e7eb' } }}
          disabled={loading}
        >
          <ArrowBack />
        </IconButton>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField 
            inputRef={emailRef} 
            label="Email" 
            type="email" 
            required 
            fullWidth 
            sx={{ 
              mb: 2, 
              borderRadius: 2, 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2, 
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#059669',
                },
              },
              '& label.Mui-focused': {
                color: '#059669',
              },
            }}
            disabled={loading}
          />
          <TextField 
            inputRef={passwordRef} 
            label="Password" 
            type="password" 
            required 
            fullWidth 
            sx={{ 
              mb: 2, 
              borderRadius: 2, 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2, 
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#059669',
                },
              },
              '& label.Mui-focused': {
                color: '#059669',
              },
            }}
            disabled={loading}
          />
          <Box textAlign="right" sx={{ mb: 3 }}>
            <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#059669', fontSize: '0.95rem', fontWeight: 500 }}>
              Forgot Password?
            </Link>
          </Box>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            sx={{ mb: 2, py: 1.5, bgcolor: '#059669', color: 'white', fontWeight: 600, borderRadius: 2, fontSize: '1.1rem', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#047857', boxShadow: 'none' } }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
        <Divider sx={{ my: 2, color: '#d1d5db' }}>OR</Divider>
        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          fullWidth
          startIcon={<Google />}
          sx={{ mb: 2, py: 1.5, borderRadius: 2, color: '#059669', borderColor: '#a7f3d0', fontWeight: 600, background: '#ecfdf5', '&:hover': { bgcolor: '#d1fae5', borderColor: '#059669' } }}
          disabled={loading}
        >
          Continue with Google
        </Button>
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
            New here?{' '}
            <Link to="/signup" style={{ textDecoration: 'none', color: '#059669', fontWeight: 600 }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}