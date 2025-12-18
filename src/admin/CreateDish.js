import React, { useState } from 'react';

export default function CreateDish({ restaurantId }) {
  const [form, setForm] = useState({
    cafe_id: restaurantId || '',
    item_name: '',
    category: '',
    price: '',
    img_url: '',
    is_available: true // true for 1, false for 0
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const payload = {
        cafe_id: parseInt(form.cafe_id),
        item_name: form.item_name,
        category: form.category,
        price: parseFloat(form.price),
        img_url: form.img_url,
        is_available: form.is_available ? 1 : 0
      };

      console.log('Payload being sent:', payload);

      const res = await fetch('https://oracleapex.com/ords/cse302/getitems/upload_items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess('Dish created successfully!');
        setForm({
          cafe_id: restaurantId || '',
          item_name: '',
          category: '',
          price: '',
          img_url: '',
          is_available: true
        });
      } else {
        setError('Failed to create dish.');
        console.error('Failed to create dish. Response status:', res.status);
      }
    } catch (err) {
      setError('Failed to create dish.');
      console.error('Error occurred while creating dish:', err);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Create Dish</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Cafe ID</label>
          <input
            name="cafe_id"
            type="number"
            className="form-control"
            value={form.cafe_id}
            disabled
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Item Name</label>
          <input name="item_name" className="form-control" value={form.item_name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input name="category" className="form-control" value={form.category} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input name="price" type="number" step="0.01" min="0" className="form-control" value={form.price} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input name="img_url" className="form-control" value={form.img_url} onChange={handleChange} required />
        </div>
        <div className="mb-3 form-check">
          <input
            name="is_available"
            type="checkbox"
            className="form-check-input"
            checked={form.is_available}
            onChange={handleChange}
          />
          <label className="form-check-label">Available</label>
        </div>
        <button type="submit" className="btn btn-primary w-100">Create Dish</button>
        {success && <div className="alert alert-success mt-3">{success}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}