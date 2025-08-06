import React, { useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './backend/firebaseConfig';
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
      const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
      const user = userCredential.user;

      setUserId(user.uid);
      setUserEmail(user.email);
      setOpenNameDialog(true);
    } catch (error) {
      setError('Failed to create account: ' + error.message);
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
      setError('Failed to sign up with Google: ' + error.message);
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
            Sign Up
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Button
          onClick={handleGoogleSignup}
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
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
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
          <Button onClick={handleNameSubmit} variant="contained">Continue</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}