import React, { useRef, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  Box, Button, Container, Typography, Paper, TextField, Fab, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, FormControlLabel, FormLabel,
  Radio, RadioGroup, InputLabel, Select, MenuItem, Grid, IconButton, Menu,
  useMediaQuery
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAuth } from './AuthContext';
import { db } from './backend/firebaseConfig';
import {
  collection, addDoc, query, orderBy, onSnapshot,
  doc, deleteDoc, updateDoc, where, getDoc
} from 'firebase/firestore';

import DashboardCards from './components/DashboardCards';
import DashboardCharts from './components/DashboardCharts';
import FilteredTransactions from './components/FilteredTransactions';
import Footer from './components/Footer';
import { FileDownload } from '@mui/icons-material';
import { exportTransactionsToCSV } from './utils/exportCSV';

import {
  CurrencyRupee, AttachMoney, MoneyOff, AccountBalanceWallet, Fastfood, LocalTaxi, CardGiftcard,
  VolunteerActivism, Movie, ShoppingCart, Receipt, LocalHospital, Category
} from '@mui/icons-material';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const amountRef = useRef();
  const noteRef = useRef();
  const dateRef = useRef();

  const [userName, setUserName] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [chartStartDate, setChartStartDate] = useState('');
  const [chartEndDate, setChartEndDate] = useState('');
  const [txStartDate, setTxStartDate] = useState('');
  const [txEndDate, setTxEndDate] = useState('');
  const [txFilterAnchor, setTxFilterAnchor] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuExpId, setMenuExpId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const allCategories = [
    'Food', 'Transport', 'Salary', 'Pocket Money',
    'Lending', 'Entertainment', 'Shopping',
    'Bills', 'Healthcare', 'Other'
  ];

  const incomeCategories = ['Salary', 'Pocket Money', 'Other'];

  const categories = type === 'income' ? incomeCategories : allCategories;

  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1',
    '#a4de6c', '#d0ed57', '#ffc0cb', '#ffbb28', '#00C49F'
  ];

  const categoryIcons = {
    Food: <Fastfood />, Transport: <LocalTaxi />, Salary: <CurrencyRupee />,
    'Pocket Money': <CardGiftcard />, Lending: <VolunteerActivism />, Entertainment: <Movie />,
    Shopping: <ShoppingCart />, Bills: <Receipt />, Healthcare: <LocalHospital />, Other: <Category />
  };

  const handleMenuOpen = (e, expId) => {
    setAnchorEl(e.currentTarget);
    setMenuExpId(expId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuExpId(null);
  };

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
      setShowEditSuccess(true);
    } else {
      await addDoc(expenseRef, data);
      setShowAddSuccess(true);
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

    if (chartStartDate) q = query(q, where('date', '>=', new Date(chartStartDate)));
    if (chartEndDate) {
      const nextDay = new Date(chartEndDate);
      nextDay.setDate(nextDay.getDate() + 1);
      q = query(q, where('date', '<', nextDay));
    }

    const unsub = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsub;
  }, [currentUser, chartStartDate, chartEndDate]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'expenses', id));
    setShowDeleteSuccess(true);
  };

  const handleEdit = (expId) => {
    setEditId(expId);
    setOpenForm(true);
  };
  // Populate form fields when editing
  useEffect(() => {
    if (openForm && editId) {
      const exp = expenses.find(e => e.id === editId);
      if (!exp) return;
      setType(exp.type);
      setCategory(exp.category);
      // Wait for type/category state to update, then set refs
      setTimeout(() => {
        if (amountRef.current) amountRef.current.value = exp.amount;
        if (noteRef.current) noteRef.current.value = exp.note;
        if (dateRef.current) {
          const date = new Date(exp.date.seconds * 1000);
          dateRef.current.value = date.toISOString().split('T')[0];
        }
      }, 0);
    }
    // If not editing, clear fields
    if (openForm && !editId) {
      if (amountRef.current) amountRef.current.value = '';
      if (noteRef.current) noteRef.current.value = '';
      setType('expense');
      setCategory('Food');
      if (dateRef.current) dateRef.current.value = '';
    }
  }, [openForm, editId, expenses]);

  const filteredExpenses = expenses.filter((e) => {
    const date = new Date(e.date.seconds * 1000);
    if (filterType === 'date') {
      const inStart = !txStartDate || date >= new Date(txStartDate);
      const inEnd = !txEndDate || date <= new Date(txEndDate);
      return inStart && inEnd;
    } else if (filterType === 'category') {
      return selectedCategory ? e.category === selectedCategory : true;
    }
    return true;
  });

  const totalIncome = expenses.filter((e) => e.type === 'income').reduce((acc, e) => acc + e.amount, 0);
  const totalExpense = expenses.filter((e) => e.type === 'expense').reduce((acc, e) => acc + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const categoryTotals = categories.map(cat => {
    const total = expenses.filter(e => e.category === cat && e.type === 'expense')
      .reduce((acc, e) => acc + e.amount, 0);
    return { name: cat, value: total };
  }).filter(item => item.value > 0);

  const formatYearMonth = (date) => {
    const d = new Date(date.seconds * 1000);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const monthlyMap = {};
  expenses.forEach((e) => {
    const key = formatYearMonth(e.date);
    if (!monthlyMap[key]) monthlyMap[key] = { month: key, income: 0, expense: 0 };
    if (e.type === 'income') monthlyMap[key].income += e.amount;
    else if (e.type === 'expense') monthlyMap[key].expense += e.amount;
  });
  const monthlyData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));

  const formatDateKey = (date) => {
    const d = new Date(date.seconds * 1000);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const dailyMap = {};
  expenses.filter(e => e.type === 'expense').forEach((e) => {
    const key = formatDateKey(e.date);
    if (!dailyMap[key]) dailyMap[key] = { date: key, expense: 0 };
    dailyMap[key].expense += e.amount;
  });
  const dailyExpenseTrendData = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

  useEffect(() => {
    const fetchUserName = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      }
    };
    fetchUserName();
  }, [currentUser]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ my: 4, flex: 1 }}>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" mb={4} gap={2}>
        <Typography variant="h5">
          Welcome, {userName || currentUser.email}
        </Typography>
        <Button variant="outlined" color="error" onClick={logout}>Logout</Button>
      </Box>

      <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
        <Box sx={{ flex: 1 }}>
          <DashboardCards totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <DashboardCharts categoryTotals={categoryTotals} monthlyData={monthlyData} dailyExpenseTrendData={dailyExpenseTrendData} COLORS={COLORS} />
        </Box>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6">Recent Transactions</Typography>
        <Box display="flex" flexWrap="wrap" alignItems="center" gap={1}>
          <IconButton color="primary" onClick={() => exportTransactionsToCSV(filteredExpenses)} title="Export as CSV">
            <FileDownload />
          </IconButton>
          {filterType === 'date' && (
            <>
              <TextField type="date" size="small" value={txStartDate} onChange={(e) => setTxStartDate(e.target.value)} />
              <TextField type="date" size="small" value={txEndDate} onChange={(e) => setTxEndDate(e.target.value)} />
            </>
          )}

          {filterType === 'category' && (
            <FormControl size="small">
              <InputLabel>Category</InputLabel>
              <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} label="Category">
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <IconButton onClick={(e) => setTxFilterAnchor(e.currentTarget)}>
            <FilterListIcon />
          </IconButton>

          <Menu anchorEl={txFilterAnchor} open={Boolean(txFilterAnchor)} onClose={() => setTxFilterAnchor(null)}>
            <MenuItem onClick={() => { setFilterType('date'); setTxFilterAnchor(null); }}>Date</MenuItem>
            <MenuItem onClick={() => { setFilterType('category'); setTxFilterAnchor(null); }}>Category</MenuItem>
          </Menu>
        </Box>
      </Box>

      <FilteredTransactions
        expenses={filteredExpenses}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleMenuOpen={handleMenuOpen}
        handleMenuClose={handleMenuClose}
        anchorEl={anchorEl}
        menuExpId={menuExpId}
        categoryIcons={categoryIcons}
      />

      <Fab color="primary" aria-label="add" onClick={() => setOpenForm(true)} sx={{ position: 'fixed', bottom: 32, right: 32 }}>
        <AddIcon />
      </Fab>

      <Dialog open={openForm} onClose={() => { setOpenForm(false); setEditId(null); }}>
        <DialogTitle>
          {editId
            ? 'Edit Transaction'
            : type === 'income'
              ? 'Add Income'
              : type === 'expense'
                ? 'Add Expense'
                : 'Add Transaction'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, width: { xs: '100%', sm: 400 } }}>
            <FormControl component="fieldset" required sx={{ mb: 2 }}>
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup row value={type} onChange={(e) => {
                setType(e.target.value);
                setCategory(''); // Reset category when type changes
              }}>
                <FormControlLabel value="income" control={<Radio />} label="Income" />
                <FormControlLabel value="expense" control={<Radio />} label="Expense" />
              </RadioGroup>
            </FormControl>
            <TextField inputRef={amountRef} label="Amount" type="number" required />
            <FormControl fullWidth required disabled={!type}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField inputRef={dateRef} label="Date" type="date" InputLabelProps={{ shrink: true }} />
            <TextField inputRef={noteRef} label="Note (optional)" multiline rows={2} />
            <DialogActions>
              <Button onClick={() => { setOpenForm(false); setEditId(null); }}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={!type || !category}>
                {editId
                  ? 'Update'
                  : type === 'income'
                    ? 'Add Income'
                    : type === 'expense'
                      ? 'Add Expense'
                      : 'Add'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
      </Container>
      <Footer />
      <Snackbar open={showEditSuccess} autoHideDuration={2500} onClose={() => setShowEditSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert onClose={() => setShowEditSuccess(false)} severity="success" sx={{ width: '100%' }} elevation={6} variant="filled">
          Transaction successfully edited!
        </MuiAlert>
      </Snackbar>
      <Snackbar open={showAddSuccess} autoHideDuration={2500} onClose={() => setShowAddSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert onClose={() => setShowAddSuccess(false)} severity="success" sx={{ width: '100%' }} elevation={6} variant="filled">
          Transaction successfully added!
        </MuiAlert>
      </Snackbar>
      <Snackbar open={showDeleteSuccess} autoHideDuration={2500} onClose={() => setShowDeleteSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert onClose={() => setShowDeleteSuccess(false)} severity="success" sx={{ width: '100%' }} elevation={6} variant="filled">
          Transaction successfully deleted!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}