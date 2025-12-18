import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateDish from './CreateDish';
import Myresto from './Myresto';

export default function AdminDash() {
  const [view, setView] = useState('dish');
  const [accessCode, setAccessCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [cafeId, setCafeId] = useState(null);
  const navigate = useNavigate();

  const handleAccessCodeSubmit = async () => {
    try {
      const response = await fetch(`https://oracleapex.com/ords/cse302/verify/code/${accessCode}`);
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setCafeId(data.items[0].cafe_id);
          setIsAuthorized(true);
        } else {
          alert('Invalid access code. Please try again.');
        }
      } else {
        alert('Failed to verify access code. Please try again later.');
      }
    } catch (error) {
      alert('An error occurred while verifying the access code.');
    }
  };

  if (!isAuthorized) {
    return (
      <div style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
        <h2>Enter Cafe Access Code</h2>
        <input
          type="text"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          placeholder="Access Code"
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        />
        <button onClick={handleAccessCodeSubmit} style={{ padding: '10px 20px' }}>
          Submit
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '32px 0 16px 0' }}>Admin Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
        <button
          className={`btn btn-outline-primary${view === 'dish' ? ' active' : ''}`}
          onClick={() => setView('dish')}
        >
          Create Dish
        </button>
        <button
          className={`btn btn-outline-info${view === 'myresto' ? ' active' : ''}`}
          onClick={() => setView('myresto')}
        >
          My Restaurant
        </button>
        <button
          className="btn btn-outline-success"
          onClick={() => navigate('/gotorder', { state: { cafeId } })}
        >
          View Orders
        </button>
      </div>
      {view === 'dish' && <CreateDish restaurantId={cafeId} />}
      {view === 'myresto' && <Myresto restaurant={{ restaurant_id: cafeId, name: 'Sample Restaurant', cuisine_type: 'Italian', rating: 4.5, capacity: 50, opening_hours: '9 AM - 9 PM', address: '123 Main St', email: 'sample@example.com' }} />}
    </div>
  );
}
