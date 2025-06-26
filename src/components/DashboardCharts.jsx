import React, { useState } from 'react';
import {
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis,
  LineChart, Line, CartesianGrid,
} from 'recharts';

export default function DashboardCharts({ categoryTotals, monthlyData, dailyExpenseTrendData, COLORS }) {
  const [selectedChart, setSelectedChart] = useState('pie'); // default: pie

  return (
    <Box sx={{ mb: 4 }}>
      {/* Dropdown Selector */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Visual Insights</Typography>
        <FormControl size="small">
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={selectedChart}
            label="Chart Type"
            onChange={(e) => setSelectedChart(e.target.value)}
          >
            <MenuItem value="pie">Expense Breakdown</MenuItem>
            <MenuItem value="bar">Income vs Expense</MenuItem>
            <MenuItem value="line">Daily Expense Trend</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Charts */}
      <Box height={400}>
        {selectedChart === 'pie' && (
          categoryTotals.length === 0 ? (
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
          )
        )}

        {selectedChart === 'bar' && (
          monthlyData.length === 0 ? (
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
          )
        )}

        {selectedChart === 'line' && (
          dailyExpenseTrendData.length === 0 ? (
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
          )
        )}
      </Box>
    </Box>
  );
}