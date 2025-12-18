import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './GotOrder.css';

export default function GotOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const location = useLocation();
  const cafeId = location.state?.cafeId;

  useEffect(() => {
    if (cafeId) {
      fetchOrders();
    } else {
      console.error('Cafe ID is missing. Cannot fetch orders.');
    }
  }, [cafeId]);

  const fetchOrders = () => {
    fetch(`https://oracleapex.com/ords/cse302/order/getbycafeid/${cafeId}`)
      .then(res => res.json())
      .then(data => {
        console.log('API Response:', data);
        setOrders(data.items || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch orders:', error);
        setLoading(false);
      });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await fetch(`https://oracleapex.com/ords/cse302/order/updateorders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, order_id: orderId })
      });
      fetchOrders();
    } catch {
      alert('Failed to update order status.');
    }
    setUpdatingId(null);
  };

  return (
    <div className="gotorder-container">
      <h2 style={{ textAlign: 'center', marginBottom: 32, letterSpacing: 2 }}>All Orders Received</h2>
      {loading ? (
        <div>Loading orders...</div>
      ) : (
        <div className="gotorder-grid">
          {orders.length === 0 ? (
            <div className="gotorder-empty">No orders found.</div>
          ) : (
            orders.map((order, idx) => (
              <div key={idx} className={`gotorder-card gotorder-status-${order.status}`}>
                <div className="gotorder-card-header">
                  <span className="gotorder-dish">Order ID: {order.order_id}</span>
                  <span className={`gotorder-status-badge gotorder-status-${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="gotorder-card-body">
                  <div><strong>Email:</strong> {order.email}</div>
                  <div><strong>Item ID:</strong> {order.item_id}</div>
                  <div><strong>Item Name:</strong> {order.item_name || 'N/A'}</div>
                  <div><strong>Total Quantity:</strong> {order.total_quantity || 'N/A'}</div>
                  <div><strong>Total Cost:</strong> <span style={{ color: '#28a745', fontWeight: 600 }}>${order.total_cost}</span></div>
                  <div><strong>Order Created:</strong> {new Date(order.order_created_time).toLocaleString()}</div>
                </div>
                <div className="gotorder-card-footer">
                  <label style={{ marginRight: 8, fontWeight: 500 }}>Change Status:</label>
                  <select
                    value={order.status}
                    disabled={updatingId === order.order_id}
                    onChange={e => handleStatusChange(order.order_id, e.target.value)}
                    className="gotorder-status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
