import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import { AuthProvider } from './AuthContext.jsx';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { displayAsciiArt } from './components/asciiArt.jsx';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

displayAsciiArt();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);