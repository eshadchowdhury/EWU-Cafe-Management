import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Restaurants.css';

export default function SearchRestaurants() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(useLocation().search).get('q') || '';

  useEffect(() => {
    if (query) {
      fetch(`https://apex.oracle.com/pls/apex/sakib_62/restaurent/find/${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data.items || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <img src="https://i.gifer.com/ZJFD.gif" alt="Loading..." width="80" />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="card-container">
      <h2 style={{ margin: '24px 0', textAlign: 'center' }}>
        Search Results for "{query}"
      </h2>
      {results.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888' }}>No restaurants found.</div>
      ) : (
        results.map((restaurant) => (
          <div className="card" key={restaurant.restaurant_id}>
            <div className="card-body">
              {restaurant.image_url && (
                <img
                  src={restaurant.image_url}
                  alt={restaurant.name}
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
                <div className="card-title">{restaurant.name}</div>
                <div className="card-info-row">
                  <span className="card-info-label">Cuisine:</span>
                  <span className="card-info-value">{restaurant.cuisine_type}</span>
                </div>
                <div className="card-info-row">
                  <span className="card-info-label">Rating:</span>
                  <span className="card-info-value">⭐ {restaurant.rating}</span>
                </div>
                <div className="card-info-row">
                  <span className="card-info-label">Capacity:</span>
                  <span className="card-info-value">{restaurant.capacity}</span>
                </div>
                <div className="card-info-row">
                  <span className="card-info-label">Hours:</span>
                  <span className="card-info-value">{restaurant.opening_hours}</span>
                </div>
                <div className="card-subtle-info">
                  <div><strong>Address:</strong> {restaurant.address}</div>
                </div>
              </div>
              <Link to={`/restaurant/${restaurant.restaurant_id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}