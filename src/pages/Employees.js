import React, { useEffect, useState } from 'react';
import './Employees.css';
import { Link } from 'react-router-dom';

export default function Employees() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('https://oracleapex.com/ords/cse302/fooditem/food/get')
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching items:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="employees-loading">
        <img src="https://i.gifer.com/ZJFD.gif" alt="loading" width="80" />
        <div>Loading items…</div>
      </div>
    );
  }

  return (
    <div className="employees-wrapper">
      <h2 className="employees-title">Food Items</h2>
      <div className="employees-grid">
        {items.length === 0 && <div className="employees-empty">No items found.</div>}
        {items.map(item => (
          <div className="employee-card" key={item.food_id}>
            <div className="employee-avatar">
              <img
                src={`https://source.unsplash.com/150x150/?food,${encodeURIComponent(item.food_name)}`}
                alt={item.food_name}
                onError={e => (e.target.src = 'https://via.placeholder.com/150?text=No+Image')}
              />
            </div>
            <div className="employee-body">
              <div className="employee-name">{item.food_name}</div>
              <div className="employee-meta">
                <div><strong>ID:</strong> {item.food_id}</div>
                <div><strong>Category:</strong> {item.category}</div>
                <div><strong>Price:</strong> ₹{item.price !== undefined && item.price !== null ? Number(item.price).toFixed(2) : 'N/A'}</div>
              </div>
              <div className="employee-actions">
                <Link to={`/employee/${item.food_id}`} className="btn-small">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}