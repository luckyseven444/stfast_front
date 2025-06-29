'use client';
import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const SaleForm = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: '',
    quantity: '',
    unit_price: '',
    discount: '',
    vat_rate: '',
    paid: ''
  });

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data.data));
  }, []);
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/sales', form);
      alert('Sale recorded!');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 max-w-md w-full bg-white rounded shadow space-y-4">
        <select
          name="product_id"
          value={form.product_id}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Quantity"
        />
        <input
          type="number"
          name="unit_price"
          value={form.unit_price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Unit Price"
        />
        <input
          type="number"
          name="discount"
          value={form.discount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Discount"
        />
        <input
          type="number"
          name="vat_rate"
          value={form.vat_rate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="VAT Rate (%)"
        />
        <input
          type="number"
          name="paid"
          value={form.paid}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Paid Amount"
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Record Sale
        </button>
      </form>
    </div>

  );
};

export default SaleForm;