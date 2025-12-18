import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './RestaurantDetails.css';
import './Restaurants.css';

export default function RestaurantDetails() {
  const { id } = useParams();

  // Always call hooks at the top level
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dishes, setDishes] = useState([]);
  const [dishesLoading, setDishesLoading] = useState(true);

  // Fetch restaurant details
  useEffect(() => {
    fetch(`https://oracleapex.com/ords/cse302/getitems/get/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && (data.restaurant_id || data.id)) {
          setRestaurant(data);
        } else if (data && data.items && data.items.length > 0) {
          setRestaurant(data.items[0]);
        } else {
          setRestaurant(null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Fetch dishes for the restaurant
  useEffect(() => {
    // Use cafe items API to load menu items for this restaurant/cafe
    const apiUrl = `https://oracleapex.com/ords/cse302/getitems/get/${id}`;
    console.log('Fetching cafe items from:', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const items = data.items || [];
        // Map items to the existing dish shape used by the UI
        const mapped = items.map(it => ({
          dish_id: it.item_id,
          name: it.item_name,
          image_url: it.img_url,
          price: it.price,
          category: it.category,
          availability: it.is_available == null ? 'Y' : (Number(it.is_available) === 1 ? 'Y' : 'N'),
          rating: it.rating || null
        }));
        setDishes(mapped);
        setDishesLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cafe items:', err);
        setDishes([]);
        setDishesLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <img src="https://i.gifer.com/1LBN.gif" alt="Loading..." width="80" />
        <div>Loading...</div>
      </div>
    );
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <div className="restaurant-details">
      <div className="banner">
        <img
          src={restaurant.image_url || 'https://via.placeholder.com/600x300?text=No+Image'}
          alt={restaurant.name}
          style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }}
        />
        <h1>{restaurant.name}</h1>
      </div>
      <p><strong>Cuisine:</strong> {restaurant.cuisine_type}</p>
      <p><strong>Address:</strong> {restaurant.address}</p>
      <p><strong>Rating:</strong> ⭐ {restaurant.rating}</p>
      <p><strong>Capacity:</strong> {restaurant.capacity}</p>
      <p><strong>Opening Hours:</strong> {restaurant.opening_hours}</p>

      <h2 className='text-center'>Menu</h2>
      {dishesLoading ? (
        <div>Loading dishes...</div>
      ) : dishes.length === 0 ? (
        <div>No dishes found for this restaurant.</div>
      ) : (
        <div className="card-container">
          {dishes.map((dish) => (
            <div className="card" key={dish.dish_id}>
              <div className="card-body">
                {dish.image_url && (
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    style={{
                      width: '100%',
                      height: '140px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '10px'
                    }}
                    onError={e => { e.target.src = 'https://via.placeholder.com/320x140?text=No+Image'; }}
                  />
                )}
                <h5 className="card-title">{dish.name}</h5>
                <p className="card-text"><strong>Price:</strong> ${dish.price}</p>
                <p className="card-text"><strong>Category:</strong> {dish.category}</p>
                <p className="card-text"><strong>Available:</strong> {dish.availability === 'Y' ? 'Yes' : 'No'}</p>
                <p className="card-text">
                  <strong>Rating:</strong>{' '}
                  {dish.rating !== null && dish.rating !== undefined ? (
                    <span>⭐ {dish.rating}</span>
                  ) : (
                    <span>No rating</span>
                  )}
                </p>
                <Link to={`/dish/${id}/${dish.dish_id}`} className="btn btn-primary">Book</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>Contact</h2>
      <div className="contact-card">
        <div>
          <strong>Phone:</strong>
          <span>{restaurant.contact_number || 'N/A'}</span>
        </div>
        <div>
          <strong>Email:</strong>
          <span>{restaurant.email || 'N/A'}</span>
        </div>
        <div>
          <strong>Hours:</strong>
          <span>{restaurant.opening_hours || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
