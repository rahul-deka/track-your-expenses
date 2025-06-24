import React, { useRef, useEffect, useState } from 'react';
import { AttachMoney, MoneyOff, AccountBalanceWallet } from '@mui/icons-material';
import { useAuth } from './AuthContext';
import { db } from './backend/firebaseConfig';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  where
} from 'firebase/firestore';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Paper,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  const amountRef = useRef();
  const noteRef = useRef();
  const dateRef = useRef();

  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [openForm, setOpenForm] = useState(false);

  const categories = [
    'Food',
    'Transport',
    'Salary',
    'Pocket Money',
    'Lending',
    'Entertainment',
    'Shopping',
    'Bills',
    'Healthcare',
    'Other'
  ];

  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1',
    '#a4de6c', '#d0ed57', '#ffc0cb', '#ffbb28', '#00C49F'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pickedDate = dateRef.current.value ? new Date(dateRef.current.value) : new Date();
    const data = {
      amount: parseFloat(amountRef.current.value),
      category,
      note: noteRef.current.value || '',
      date: pickedDate,
      type
    };
    const expenseRef = collection(db, 'users', currentUser.uid, 'expenses');

    if (editId) {
      const docRef = doc(db, 'users', currentUser.uid, 'expenses', editId);
      await updateDoc(docRef, data);
      setEditId(null);
    } else {
      await addDoc(expenseRef, data);
    }

    amountRef.current.value = '';
    noteRef.current.value = '';
    dateRef.current.value = '';
    setType('expense');
    setCategory('Food');
    setOpenForm(false);
  };

  useEffect(() => {
    const expenseRef = collection(db, 'users', currentUser.uid, 'expenses');

    let q = query(expenseRef, orderBy('date', 'desc'));

    if (startDate) {
      q = query(q, where('date', '>=', new Date(startDate)));
    }

    if (endDate) {
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      q = query(q, where('date', '<', nextDay));
    }

    const unsub = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsub;
  }, [currentUser, startDate, endDate]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'expenses', id));
  };

  const handleEdit = (exp) => {
    amountRef.current.value = exp.amount;
    noteRef.current.value = exp.note;
    setType(exp.type);
    setCategory(exp.category);
    const date = new Date(exp.date.seconds * 1000);
    const yyyyMMdd = date.toISOString().split('T')[0];
    dateRef.current.value = yyyyMMdd;
    setEditId(exp.id);
    setOpenForm(true);
  };

  const totalIncome = expenses
    .filter((exp) => exp.type === 'income')
    .reduce((acc, exp) => acc + exp.amount, 0);

  const totalExpense = expenses
    .filter((exp) => exp.type === 'expense')
    .reduce((acc, exp) => acc + exp.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryTotals = categories.map((cat) => {
    const total = expenses
      .filter((e) => e.category === cat && e.type === 'expense')
      .reduce((acc, e) => acc + e.amount, 0);
    return { name: cat, value: total };
  }).filter(item => item.value > 0);

  function formatYearMonth(date) {
    const d = new Date(date.seconds ? date.seconds * 1000 : date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  const monthGroups = {};
  expenses.forEach(exp => {
    const key = formatYearMonth(exp.date);
    if (!monthGroups[key]) {
      monthGroups[key] = { month: key, income: 0, expense: 0 };
    }
    if (exp.type === 'income') {
      monthGroups[key].income += exp.amount;
    } else if (exp.type === 'expense') {
      monthGroups[key].expense += exp.amount;
    }
  });
  const monthlyData = Object.values(monthGroups).sort((a, b) => a.month.localeCompare(b.month));

  function formatDateKey(date) {
    const d = new Date(date.seconds ? date.seconds * 1000 : date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  const dailyExpenseTrendGroups = {};
  expenses
    .filter(exp => exp.type === 'expense')
    .forEach(exp => {
      const key = formatDateKey(exp.date);
      if (!dailyExpenseTrendGroups[key]) {
        dailyExpenseTrendGroups[key] = { date: key, expense: 0 };
      }
      dailyExpenseTrendGroups[key].expense += exp.amount;
    });

  const dailyExpenseTrendData = Object.values(dailyExpenseTrendGroups).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Welcome, {currentUser.email}</Typography>
        <Button variant="outlined" color="error" onClick={logout}>Logout</Button>
      </Box>

      <Grid container spacing={3} mb={4} justifyContent="center">
        <Grid item xs={12} md={4}>
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
        </Grid>
        <Grid item xs={12} md={4}>
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
        </Grid>
        <Grid item xs={12} md={4}>
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
        </Grid>
      </Grid>

      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} md={4} style={{ height: 400 }}>
          <Typography variant="h6" gutterBottom>Expense Breakdown (Pie Chart)</Typography>
          {categoryTotals.length === 0 ? (
            <Typography>No expense data for the selected range.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="value"
                  data={categoryTotals}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Grid>

        <Grid item xs={12} md={4} style={{ height: 400 }}>
          <Typography variant="h6" gutterBottom>Income vs Expense (Monthly Bar Chart)</Typography>
          {monthlyData.length === 0 ? (
            <Typography>No data for the selected range.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#82ca9d" name="Income" />
                <Bar dataKey="expense" fill="#8884d8" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Grid>
        <Grid item xs={12} md={4} style={{ height: 400 }}>
          <Typography variant="h6" gutterBottom>Daily Expense Trend (Line Chart)</Typography>
          {dailyExpenseTrendData.length === 0 ? (
            <Typography>No expense data for the selected range.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyExpenseTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="expense" stroke="#ff7300" name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Filter by Date</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', maxWidth: 400 }}>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Filtered Transactions</Typography>
        <Divider sx={{ mb: 2 }} />
        {expenses.map((exp) => (
          <Box key={exp.id} mb={1}>
            <Typography>
              [{exp.type}] {exp.category}: ₹{exp.amount} — {exp.note && `${exp.note} — `}
              {new Date(exp.date.seconds * 1000).toLocaleDateString()}
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Button size="small" variant="outlined" onClick={() => handleEdit(exp)}>Edit</Button>
              <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(exp.id)}>Delete</Button>
            </Stack>
          </Box>
        ))}
      </Paper>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpenForm(true)}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
        }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>{editId ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, width: 400 }}
          >
            <FormControl>
              <FormLabel>Type</FormLabel>
              <RadioGroup
                row
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <FormControlLabel value="income" control={<Radio />} label="Income" />
                <FormControlLabel value="expense" control={<Radio />} label="Expense" />
              </RadioGroup>
            </FormControl>

            <TextField
              inputRef={amountRef}
              label="Amount"
              type="number"
              required
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              inputRef={dateRef}
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              inputRef={noteRef}
              label="Note (optional)"
              multiline
              rows={2}
            />

            <DialogActions>
              <Button onClick={() => { setOpenForm(false); setEditId(null); }}>Cancel</Button>
              <Button type="submit" variant="contained">{editId ? 'Update' : 'Add'}</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}