'use client';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';

const FinancialReport = () => {
  const [report, setReport] = useState(null);
  const [filters, setFilters] = useState({ from: '', to: '' });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchReport = () => {
    axios.get('/api/reports/financial', { params: filters })
      .then(res => setReport(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-4 max-w-xl">
      <h2 className="text-xl font-bold mb-4">Financial Report</h2>
      <div className="flex space-x-4 mb-4">
        <input type="date" name="from" onChange={handleChange} className="border p-2" />
        <input type="date" name="to" onChange={handleChange} className="border p-2" />
        <button onClick={fetchReport} className="bg-green-600 text-white p-2">Filter</button>
      </div>
      {report && (
        <div className="space-y-2 bg-white p-4 rounded shadow">
          <p><strong>Total Sales:</strong> {report.total_sales} TK</p>
          <p><strong>Total Expenses:</strong> {report.total_expenses} TK</p>
          <p><strong>Profit:</strong> {report.profit} TK</p>
        </div>
      )}
    </div>
  );
};

export default FinancialReport;