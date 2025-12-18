import React, { useState } from 'react';

export default function CreateRestaurent() {
  const [name, setName] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://apex.oracle.com/pls/apex/sakib_62/restaurents/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          cuisine_type: cuisineType,
          capacity: parseInt(capacity, 10),
          opening_hours: openingHours,
          address,
          email,
        }),
      });

      if (response.ok) {
        setSuccess('Restaurant created successfully!');
        setName('');
        setCuisineType('');
        setCapacity('');
        setOpeningHours('');
        setAddress('');
        setEmail('');
      } else {
        setError('Failed to create restaurant.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Create Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Cuisine Type:</label>
          <input
            type="text"
            className="form-control"
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Capacity:</label>
          <input
            type="number"
            className="form-control"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Opening Hours:</label>
          <input
            type="text"
            className="form-control"
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Address:</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Restaurant'}
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}
      </form>
    </div>
  );
}