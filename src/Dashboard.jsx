import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from './backend/firebaseConfig';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  const amountRef = useRef();
  const noteRef = useRef();
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  const [expenses, setExpenses] = useState([]);

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

  const handleAdd = async (e) => {
    e.preventDefault();

    const expenseRef = collection(db, 'users', currentUser.uid, 'expenses');
    await addDoc(expenseRef, {
      amount: parseFloat(amountRef.current.value),
      category,
      note: noteRef.current.value || '',
      date: new Date(),
      type,
    });

    amountRef.current.value = '';
    noteRef.current.value = '';
    setType('expense');
    setCategory('Food');
  };

  useEffect(() => {
    const q = query(
      collection(db, 'users', currentUser.uid, 'expenses'),
      orderBy('date', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsub;
  }, [currentUser]);

  const totalIncome = expenses
    .filter((exp) => exp.type === 'income')
    .reduce((acc, exp) => acc + exp.amount, 0);

  const totalExpense = expenses
    .filter((exp) => exp.type === 'expense')
    .reduce((acc, exp) => acc + exp.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div>
      <h2>Welcome, {currentUser.email}</h2>
      <button onClick={logout}>Logout</button>

      <h3>Add Transaction</h3>
      <form onSubmit={handleAdd}>

        <label>
          <input
            type="radio"
            value="income"
            checked={type === 'income'}
            onChange={(e) => setType(e.target.value)}
          />
          Income
        </label>

        <label>
          <input
            type="radio"
            value="expense"
            checked={type === 'expense'}
            onChange={(e) => setType(e.target.value)}
          />
          Expense
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

        <textarea
          ref={noteRef}
          placeholder="Note (optional)"
        ></textarea>

        <br />
        <button type="submit">Add</button>
      </form>

      <h3>Summary</h3>
      <p>Total Income: ₹{totalIncome}</p>
      <p>Total Expense: ₹{totalExpense}</p>
      <p>Balance: ₹{balance}</p>

      <h3>All Transactions</h3>
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            [{exp.type}] {exp.category}: ₹{exp.amount}
            — {exp.note ? exp.note + ' — ' : ''}
            {new Date(exp.date.seconds * 1000).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}