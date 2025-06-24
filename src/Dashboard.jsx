import React, { useRef, useEffect, useState } from 'react';
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
  ResponsiveContainer
} from 'recharts';

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

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb', '#ffbb28', '#00C49F'];

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

  return (
    <div>
      <h2>Welcome, {currentUser.email}</h2>
      <button onClick={logout}>Logout</button>

      <h3>{editId ? 'Edit Transaction' : 'Add Transaction'}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            value="income"
            checked={type === 'income'}
            onChange={(e) => setType(e.target.value)}
          /> Income
        </label>
        <label>
          <input
            type="radio"
            value="expense"
            checked={type === 'expense'}
            onChange={(e) => setType(e.target.value)}
          /> Expense
        </label>
        <br />

        <input
          ref={amountRef}
          type="number"
          placeholder="Amount"
          required
        />
        <br />

        <label>Category:</label><br />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <br />

        <label>Date:</label><br />
        <input ref={dateRef} type="date" /><br />

        <textarea ref={noteRef} placeholder="Note (optional)" /><br />

        <button type="submit">{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" onClick={() => setEditId(null)}>Cancel Edit</button>}
      </form>

      <h3>Filter by Date</h3>
      <label>Start Date: </label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <label style={{ marginLeft: '1rem' }}>End Date: </label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <h3>Summary</h3>
      <p>Total Income: ₹{totalIncome}</p>
      <p>Total Expense: ₹{totalExpense}</p>
      <p>Balance: ₹{balance}</p>

      <h3>Expense Breakdown (Pie Chart)</h3>

      {categoryTotals.length === 0 ? (
        <p>No expense data for the selected range.</p>
      ) : (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
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
        </div>
      )}

      <h3>Filtered Transactions</h3>
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            [{exp.type}] {exp.category}: ₹{exp.amount} — {exp.note ? exp.note + ' — ' : ''}
            {new Date(exp.date.seconds * 1000).toLocaleDateString()}
            <button onClick={() => handleEdit(exp)}>Edit</button>
            <button onClick={() => handleDelete(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}