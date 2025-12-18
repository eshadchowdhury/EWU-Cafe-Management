import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Restaurants.css';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

 
  useEffect(() => {
    setLoading(true);
    const apiUrl = 'https://oracleapex.com/ords/cse302/singlecafe/get';

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('cafes api:', data);
        const cafes = data.items || [];
        setRestaurants(cafes);
        setErrorMessage(null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cafes:', error);
        setRestaurants([]);
        setErrorMessage(error.message || 'Failed to load cafes');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <img src="https://i.gifer.com/ZJFD.gif" alt="Loading..." width="80" />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{margin: '12px 24px', color: '#222'}}>Home</h1>
      {/* removed sort UI — API does not support rating sort */}
      <div className="card-container">
        {restaurants.map((restaurant) => (
          <div className="card" key={restaurant.cafe_id}>
            <div className="card-body">
              {/* Cafe Image */}
              {restaurant.img_url && (
                <img
                  src={restaurant.img_url}
                  alt={restaurant.cafe_name}
                  style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/320x160?text=No+Image'; }}
                />
              )}
              <div>
                <div className="card-title">{restaurant.cafe_name}</div>
                <div className="card-info-row">
                  <span className="card-info-label">Contact:</span>
                  <span className="card-info-value">{restaurant.contact_phone || '—'}</span>
                </div>
                <div className="card-info-row">
                  <span className="card-info-label">Opens:</span>
                  <span className="card-info-value">{restaurant.opening_time ? new Date(restaurant.opening_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '—'}</span>
                </div>
                <div className="card-info-row">
                  <span className="card-info-label">Closes:</span>
                  <span className="card-info-value">{restaurant.closing_time ? new Date(restaurant.closing_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '—'}</span>
                </div>
                {/* Subtle info box for location only */}
                <div className="card-subtle-info">
                  <div><strong>Location:</strong> {restaurant.location || '—'}</div>
                </div>
              </div>
              <Link to={`/restaurant/${restaurant.cafe_id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
