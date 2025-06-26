import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { AttachMoney, MoneyOff, AccountBalanceWallet } from '@mui/icons-material';

export default function DashboardCards({ totalIncome, totalExpense, balance }) {
  return (
    <Box display="flex" flexDirection="column" gap={3} mb={4}>
      {/* Income Card */}
      <Paper
        sx={{
          p: 3,
          bgcolor: '#e8f5e9',
          borderLeft: '8px solid #4caf50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        elevation={3}
      >
        <Box>
          <Typography variant="h6" gutterBottom>Income</Typography>
          <Typography variant="h5" fontWeight="bold">₹{totalIncome}</Typography>
        </Box>
        <AttachMoney sx={{ fontSize: 40, color: '#4caf50' }} />
      </Paper>

      {/* Expense Card */}
      <Paper
        sx={{
          p: 3,
          bgcolor: '#ffebee',
          borderLeft: '8px solid #f44336',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        elevation={3}
      >
        <Box>
          <Typography variant="h6" gutterBottom>Expense</Typography>
          <Typography variant="h5" fontWeight="bold">₹{totalExpense}</Typography>
        </Box>
        <MoneyOff sx={{ fontSize: 40, color: '#f44336' }} />
      </Paper>

      {/* Balance Card */}
      <Paper
        sx={{
          p: 3,
          bgcolor: '#ffffff',
          borderLeft: '8px solid #1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        elevation={3}
      >
        <Box>
          <Typography variant="h6" gutterBottom>Balance</Typography>
          <Typography variant="h5" fontWeight="bold">₹{balance}</Typography>
        </Box>
        <AccountBalanceWallet sx={{ fontSize: 40, color: '#1976d2' }} />
      </Paper>
    </Box>
  );
}