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
  Box
} from '@mui/material';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();

  const { signup } = useAuth();
  const navigate = useNavigate();

  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
    const user = userCredential.user;

    setUserId(user.uid);
    setUserEmail(user.email);
    setOpenNameDialog(true);
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
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        padding: 2
      }}
    >
      <Box
        sx={{
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>Sign Up</Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <TextField inputRef={emailRef} label="Email" type="email" required fullWidth />
          <TextField inputRef={passwordRef} label="Password" type="password" required fullWidth />
          <Button type="submit" variant="contained" color="primary">Sign Up</Button>
        </form>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Name Dialog */}
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