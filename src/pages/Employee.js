import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Employees.css';

export default function Employee() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('https://oracleapex.com/ords/cse302/fooditem/food/get')
      .then(res => res.json())
      .then(data => {
        const found = (data.items || []).find(i => String(i.food_id) === String(id));
        setItem(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching item:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="employees-loading">
        <img src="https://i.gifer.com/ZJFD.gif" alt="loading" width="80" />
        <div>Loading item…</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ padding: 22 }}>
        <div>Item not found.</div>
        <Link to="/" style={{ marginTop: 12, display: 'inline-block' }} className="btn-small">Back</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
        <img
          src={`https://source.unsplash.com/320x160/?food,${encodeURIComponent(item.food_name)}`}
          alt={item.food_name}
          style={{ width: 320, height: 160, objectFit: 'cover', borderRadius: 8 }}
          onError={e => (e.target.src = 'https://via.placeholder.com/320x160?text=No+Image')}
        />
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>{item.food_name}</h2>
          <div style={{ marginTop: 8, color: '#555' }}>
            <div><strong>ID:</strong> {item.food_id}</div>
            <div><strong>Category:</strong> {item.category}</div>
            <div><strong>Price:</strong> ₹{Number(item.price).toFixed(2)}</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <Link to="/" className="btn-small">Back to list</Link>
          </div>
        </div>
      </div>
    </div>
  );
}