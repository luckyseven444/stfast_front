'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';

const ProductIndex = () => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    purchase_price: '',
    sell_price: '',
    opening_stock: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = (page = 1) => {
    axios.get(`/api/products?page=${page}`)
      .then(res => {
        setProducts(res.data.data);
        setMeta(res.data.meta || null);
        setLinks(Array.isArray(res.data.links) ? res.data.links : []);
      })
      .catch(err => console.error('Fetch Error:', err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/products', form);
      setShowModal(false);
      setForm({ name: '', purchase_price: '', sell_price: '', opening_stock: '' });
      fetchProducts(page);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[Object.keys(err.response?.data?.errors)[0]]?.[0] ||
        'Submission failed'
      );
    }
  };

  const handlePageChange = (url) => {
    if (!url) return;
    const pageParam = new URL(url).searchParams.get('page');
    if (pageParam) setPage(parseInt(pageParam));
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product List</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add +
        </button>
      </div>

      {/* Product Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Purchase Price</th>
            <th className="border px-4 py-2">Sell Price</th>
            <th className="border px-4 py-2">Opening Stock</th>
            <th className="border px-4 py-2">Current Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.purchase_price}</td>
              <td className="border px-4 py-2">{product.sell_price}</td>
              <td className="border px-4 py-2">{product.opening_stock}</td>
              <td className="border px-4 py-2">{product.current_stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {meta && links?.length > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          {links.map((link, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(link.url)}
              disabled={!link.url}
              className={`px-3 py-1 rounded border text-sm ${
                link.active
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-200'
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">Add Product</h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full border p-2"
              />
              <input
                name="purchase_price"
                value={form.purchase_price}
                onChange={handleChange}
                placeholder="Purchase Price"
                required
                type="number"
                className="w-full border p-2"
              />
              <input
                name="sell_price"
                value={form.sell_price}
                onChange={handleChange}
                placeholder="Sell Price"
                required
                type="number"
                className="w-full border p-2"
              />
              <input
                name="opening_stock"
                value={form.opening_stock}
                onChange={handleChange}
                placeholder="Opening Stock"
                required
                type="number"
                className="w-full border p-2"
              />
              <button
                type="submit"
                className="bg-green-600 text-white w-full p-2 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductIndex;
