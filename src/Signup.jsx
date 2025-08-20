import React, { useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './backend/firebaseConfig';
import { validateEmail } from './utils/emailValidation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import { Google, ArrowBack } from '@mui/icons-material';
import { Savings as PiggyBankIcon } from '@mui/icons-material';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();

  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState('');
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
      
      const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
      const user = userCredential.user;

      setUserId(user.uid);
      setUserEmail(user.email);
      setOpenNameDialog(true);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email address already exists.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setError('Email/password accounts are not enabled. Please contact support.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError('');
      setLoading(true);
      const result = await loginWithGoogle();
      const user = result.user;

      setUserId(user.uid);
      setUserEmail(user.email);
      setOpenNameDialog(true);
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email using a different sign-in method.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('Sign-up was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups and try again.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-up was cancelled. Please try again.');
      } else {
        setError('Failed to sign up with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = async () => {
    const name = nameRef.current.value.trim();
    if (!name) {
      alert('Name is required.');
      return;
    }

    await setDoc(doc(db, 'users', userId), {
      name,
      email: userEmail
    });

    setOpenNameDialog(false);
    navigate('/');
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
            Create your account to get started
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
              mb: 3, 
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
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            sx={{ mb: 2, py: 1.5, bgcolor: '#059669', color: 'white', fontWeight: 600, borderRadius: 2, fontSize: '1.1rem', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#047857', boxShadow: 'none' } }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </Box>
        <Divider sx={{ my: 2, color: '#d1d5db' }}>OR</Divider>
        <Button
          onClick={handleGoogleSignup}
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
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#059669', fontWeight: 600 }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
      <Dialog open={openNameDialog} onClose={() => {}}>
        <DialogTitle>Welcome! Tell us your name</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={nameRef}
            label="Your Name"
            autoFocus
            fullWidth
            required
            variant="outlined"
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNameSubmit} variant="contained" sx={{ bgcolor: '#059669', color: 'white', fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#047857' } }}>Continue</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}