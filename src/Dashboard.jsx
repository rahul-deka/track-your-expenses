import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from './backend/firebaseConfig';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const amountRef = useRef();
  const categoryRef = useRef();
  const [expenses, setExpenses] = useState([]);

  // Add new expense
  const handleAdd = async e => {
    e.preventDefault();
    const expenseRef = collection(db, 'users', currentUser.uid, 'expenses');
    await addDoc(expenseRef, {
      amount: parseFloat(amountRef.current.value),
      category: categoryRef.current.value,
      date: new Date(),
      type: 'expense',
    });
    amountRef.current.value = '';
    categoryRef.current.value = '';
  };

  // Listen for expenses
  useEffect(() => {
    const q = query(
      collection(db, 'users', currentUser.uid, 'expenses'),
      orderBy('date', 'desc')
    );
    const unsub = onSnapshot(q, snapshot => {
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, [currentUser]);

  return (
    <div>
      <h2>Welcome {currentUser.email}</h2>
      <button onClick={logout}>Logout</button>

      <h3>Add Expense</h3>
      <form onSubmit={handleAdd}>
        <input ref={amountRef} type="number" placeholder="Amount" required />
        <input ref={categoryRef} placeholder="Category" required />
        <button type="submit">Add</button>
      </form>

      <h3>Your Expenses</h3>
      <ul>
        {expenses.map(exp => (
          <li key={exp.id}>
            {exp.category}: ₹{exp.amount} ({new Date(exp.date.seconds * 1000).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}