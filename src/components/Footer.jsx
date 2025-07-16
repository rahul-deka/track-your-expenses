import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100vw',
        maxWidth: '100%',
        overflowX: 'hidden',
        py: 2,
        px: 1,
        mt: 'auto',
        // backgroundColor: '#f5f5f5',
        textAlign: 'center',
        borderTop: '1px solid #e0e0e0',
        fontSize: '0.95rem',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Developed with ❤️ by <a href="https://rahul-deka.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Rahul Deka</a>.
      </Typography>
    </Box>
  );
}
