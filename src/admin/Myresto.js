import React, { useEffect, useState } from 'react';
import './Myresto.css';

export default function Myresto({ restaurant }) {
  const [cafeInfo, setCafeInfo] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (restaurant && restaurant.restaurant_id) {
      // Fetch cafe information
      fetch(`https://oracleapex.com/ords/cse302/singlecafe/getcafe/${restaurant.restaurant_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.items && data.items.length > 0) {
            setCafeInfo(data.items[0]);
          }
        })
        .catch(() => alert('Failed to fetch cafe information.'));

      // Fetch dishes
      fetch(`https://oracleapex.com/ords/cse302/getitems/get/${restaurant.restaurant_id}`)
        .then(res => res.json())
        .then(data => {
          setDishes(data.items.map(item => ({
            id: item.item_id,
            name: item.item_name,
            category: item.category,
            price: item.price,
            img_url: item.img_url,
            is_available: item.is_available,
            created_at: item.created_at
          })) || []);
          setLoading(false);
          console.log('Fetched dishes:', data);
        })
        .catch(() => setLoading(false));
    }
  }, [restaurant]);

  const handleDelete = async (dish_id) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;
    setDeletingId(dish_id);
    try {
      await fetch(`https://oracleapex.com/ords/cse302/getitems/delete/${dish_id}`, {
        method: 'DELETE'
      });
      setDishes(dishes.filter(d => d.id !== dish_id));
    } catch {
      alert('Failed to delete dish.');
    }
    setDeletingId(null);
  };

  if (!restaurant) return null;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', background: '#f9fafb', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 24 }}>
      {cafeInfo ? (
        <>
          <img
            src={cafeInfo.img_url}
            alt="Cafe"
            style={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              display: 'block',
              margin: '0 auto 16px'
            }}
          />
          <h2 style={{ textAlign: 'center', marginBottom: 18 }}>{cafeInfo.cafe_name}</h2>
          <div><strong>Location:</strong> {cafeInfo.location}</div>
          <div><strong>Contact:</strong> {cafeInfo.contact_phone}</div>
          <div><strong>Opening Time:</strong> {new Date(cafeInfo.opening_time).toLocaleTimeString()}</div>
          <div><strong>Closing Time:</strong> {new Date(cafeInfo.closing_time).toLocaleTimeString()}</div>
          <div><strong>Active:</strong> {cafeInfo.is_active ? 'Yes' : 'No'}</div>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: '#888' }}>Loading cafe information...</div>
      )}
      <hr style={{ margin: '24px 0' }} />
      <h3 style={{ textAlign: 'center', marginBottom: 18 }}>Dishes</h3>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#888' }}>Loading dishes...</div>
      ) : dishes.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888' }}>No dishes found for this restaurant.</div>
      ) : (
        <div className="myresto-card-grid">
          {dishes.map(dish => (
            <div className="myresto-card" key={dish.id}>
              <div className="myresto-card-header">
                <span className="myresto-dish-name">{dish.name}</span>
                <button
                  onClick={() => handleDelete(dish.id)}
                  disabled={deletingId === dish.id}
                  className="myresto-delete-btn"
                >
                  {deletingId === dish.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              <div className="myresto-card-body">
                <img 
                  src={dish.img_url} 
                  alt={dish.name} 
                  style={{ 
                    width: 150, 
                    height: 150, 
                    objectFit: 'cover', 
                    borderRadius: 8, 
                    marginBottom: 8 
                  }} 
                />
                <div><strong>Name:</strong> {dish.name}</div>
                <div><strong>Price:</strong> ${dish.price}</div>
                <div><strong>Category:</strong> {dish.category}</div>
                <div><strong>Available:</strong> {dish.is_available ? 'Yes' : 'No'}</div>
                <div><strong>Created At:</strong> {new Date(dish.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
