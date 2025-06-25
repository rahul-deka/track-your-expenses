import React from 'react';
import {
  Typography,
  Grid,
} from '@mui/material';
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
  CartesianGrid,
} from 'recharts';

export default function DashboardCharts({ categoryTotals, monthlyData, dailyExpenseTrendData, COLORS }) {
  return (
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
  );
}