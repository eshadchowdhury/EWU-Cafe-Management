import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DishDetails.css';
import { Alert } from 'bootstrap';

export default function DishDetails() {
  const { dishId, cafeId, itemId } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review state
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [rating, setRating] = useState(5);

  // Booking state
  const [bookingPeople, setBookingPeople] = useState(1);
 

  // Quantity state for order
  const [quantity, setQuantity] = useState(1);

  // Capacity state
  const [capacity, setCapacity] = useState(null);
  // Cafe items (menu) state
  const [cafeItems, setCafeItems] = useState([]);
  const [cafeItemsLoading, setCafeItemsLoading] = useState(false);
  const [cafeItemsError, setCafeItemsError] = useState(null);

  // Get user info from localStorage (adjust as needed)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const user_email = user.email || '';
  const user_name = user.name || '';

  // Fetch dish/item details.
  useEffect(() => {
    // If route provides cafeId + itemId, fetch items for that cafe and pick the item
    if (cafeId && itemId) {
      const apiUrl = process.env.REACT_APP_ITEMS_URL || `https://oracleapex.com/ords/cse302/getitems/get/${cafeId}`;
      console.log('Fetching cafe items for dish details from:', apiUrl);
      fetch(apiUrl)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          const items = data.items || [];
          const it = items.find(x => String(x.item_id) === String(itemId));
          if (it) {
            // Map item to dish shape used elsewhere
            const mapped = {
              dish_id: it.item_id,
              name: it.item_name,
              image_url: it.img_url,
              price: it.price,
              category: it.category,
              availability: it.is_available == null ? 'Y' : (Number(it.is_available) === 1 ? 'Y' : 'N'),
              description: it.description || '',
              rating: it.rating || null,
              restaurant_id: cafeId
            };
            setDish(mapped);
          } else {
            setDish(null);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching cafe items for dish details:', err);
          setDish(null);
          setLoading(false);
        });
      return;
    }

    // Fallback: use the original specificdish endpoint when only dishId is provided
    if (!dishId) {
      setDish(null);
      setLoading(false);
      return;
    }

    
  }, [dishId, cafeId, itemId]);




  

  // Fetch cafe items (menu) by cafe_id using provided API
  useEffect(() => {
    const cafeId = dish && (dish.restaurant_id || dish.cafe_id);
    if (!cafeId) return;
    setCafeItemsLoading(true);
    setCafeItemsError(null);
    const apiUrl = `https://oracleapex.com/ords/cse302/getitems/get/${cafeId}`;
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const items = data.items || [];
        setCafeItems(items);
        setCafeItemsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cafe items:', err);
        setCafeItems([]);
        setCafeItemsError(err.message || 'Failed to load items');
        setCafeItemsLoading(false);
      });
  }, [dish]);

  // Fetch reviews for the dish/item
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://oracleapex.com/ords/cse302/review/getreview/${itemId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.status}`);
        }
        const data = await response.json();
        setReviews(data.items || []);
        console.log('Fetched reviews:', data.items || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setReviewLoading(false);
      }
    };

    if (itemId) {
      setReviewLoading(true);
      fetchReviews();
    }
  }, [itemId]);

  // Function to handle order submission
  const handleOrderSubmit = async () => {
    const totalCost = dish ? dish.price * quantity : 0;

    try {
      const response = await fetch('https://oracleapex.com/ords/cse302/order/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user_email,
          item_id: itemId,
          cafe_id: cafeId,
          total_cost: totalCost,
          item_name: dish ? dish.name : '',
          total_quantity: quantity,
        }),
      });

      if (response.ok) {
        console.log('Order placed successfully');
        alert('Order placed successfully!');
      } else {
        console.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error while placing order:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError('');

    try {
      const response = await fetch('https://oracleapex.com/ords/cse302/review/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user_email,
          name: user_name,
          item_id: itemId,
          cafe_id: cafeId,
          rating: parseFloat(rating),
          review_text: reviewText,
        }),
      });

      if (response.ok) {
        alert('Review submitted successfully');
        setReviewText('');
        setRating(5);
      } else {
        console.error('Failed to submit review');
        setReviewError('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error while submitting review:', error);
      setReviewError('An error occurred. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const totalCost = dish ? bookingPeople * dish.price : 0;

  if (loading) return <div>Loading...</div>;
  if (!dish) return <div>Dish not found</div>;

  return (
    <div className="dishdetails-container">
      {/* Reviews List Section - Left Side */}
      <div className="dishdetails-reviews">
        <div className="dishdetails-card">
          <h4>Reviews</h4>
          {reviewLoading ? (
            <div>Loading reviews...</div>
          ) : (
            <div>
              {reviews.length === 0 ? (
                <div>No reviews yet.</div>
              ) : (
                <ul className="dishdetails-review-list">
                  {reviews.map((review) => (
                    <li key={review.review_id} className="dishdetails-review-item">
                      <div>
                        <strong>{review.name || 'Anonymous'}</strong>
                        <br />
                        <span className="dishdetails-rating-star">★ {review.rating}</span>
                      </div>
                      <div>{review.review_text}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {new Date(review.review_date).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dish Card & Review Submission  */}
      <div style={{ flex: '2 1 480px', minWidth: 0 }}>
        {/* Dish Card Section */}
        <div className="dishdetails-card">
          <h2>{dish.name}</h2>
          {dish.image_url && (
            <img
              src={dish.image_url}
              alt={dish.name}
              className="dishdetails-image"
            />
          )}
          <p><strong>Price:</strong> ${dish.price}</p>
          <p><strong>Category:</strong> {dish.category}</p>
          <p><strong>Available:</strong> {dish.availability === 'Y' ? 'Yes' : 'No'}</p>
          <p><strong>Description:</strong> {dish.description}</p>
          <p>
            <strong>Rating:</strong>{' '}
            {dish.rating !== null && dish.rating !== undefined ? (
              <span>⭐ {dish.rating}</span>
            ) : (
              <span>No rating</span>
            )}
          </p>
          {/* Other items from this cafe */}
          <div style={{marginTop: 16}}>
            <h4>Other items from this cafe</h4>
            {cafeItemsLoading ? (
              <div>Loading items...</div>
            ) : cafeItemsError ? (
              <div style={{color: '#b00020'}}>Error loading items: {cafeItemsError}</div>
            ) : cafeItems.length === 0 ? (
              <div>No other items found.</div>
            ) : (
              <ul style={{listStyle: 'none', padding: 0}}>
                {cafeItems.map((it, idx) => {
                  const title = it.item_name || it.name || it.dish_name || `Item ${idx+1}`;
                  const price = it.price != null ? it.price : (it.item_price != null ? it.item_price : null);
                  const id = it.item_id || it.dish_id || it.cafe_item_id || null;
                  const img = it.img_url || it.image_url || null;
                  const available = it.is_available == null ? true : Boolean(Number(it.is_available));
                  return (
                    <li key={idx} style={{display: 'flex', alignItems: 'center', marginBottom: 12}}>
                      {img && (
                        <img src={img} alt={title} style={{width: 64, height: 48, objectFit: 'cover', borderRadius: 6, marginRight: 12}} onError={e => e.target.src='https://via.placeholder.com/64x48?text=No+Image'} />
                      )}
                      <div style={{flex: 1}}>
                        <div style={{fontWeight: 600}}>{title}</div>
                        {price !== null && <div style={{fontSize: 13, color: '#666'}}>৳ {price}</div>}
                        <div style={{fontSize: 12, color: available ? '#2b8a3e' : '#b00020'}}>{available ? 'Available' : 'Not available'}</div>
                      </div>
                      {id && (
                        <div>
                          <a href={`/dish/${dish.restaurant_id || cafeId}/${id}`} className="btn btn-sm btn-outline-primary">View</a>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Review Submission Section */}
        <div className="dishdetails-form">
          <form onSubmit={handleReviewSubmit}>
            <h4>Leave a Review</h4>
            <div className="mb-3">
              <label>Rating:</label>
              <input
                type="number"
                className="form-control dishdetails-booking-input"
                value={rating}
                min={1}
                max={5}
                step={0.5}
                onChange={e => setRating(e.target.value)}
                required
                disabled={reviewSubmitting}
              />
              <textarea
                className="form-control"
                placeholder="Write your review..."
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                required
                disabled={reviewSubmitting}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={reviewSubmitting || !reviewText.trim()}>
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            {reviewError && <div className="alert alert-danger mt-2">{reviewError}</div>}
          </form>
        </div>

        {/* Booking Section */}
        <div className="dishdetails-booking">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleOrderSubmit();
          }}>
            <h4>Place Your Order</h4>
            <div className="mb-3">
              <label>Quantity:</label>
              <input
                type="number"
                className="form-control dishdetails-booking-input"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <label>Total Cost:</label>
              <div className="dishdetails-total-cost">
                <strong>${dish ? dish.price * quantity : 0}</strong>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Confirm Order
            </button>
          </form>
        </div>
      
      </div>
    </div>
  );
}
