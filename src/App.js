import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import Navbar from './components/Navbar';
import Restaurants from './pages/Restaurants';
import Employees from './pages/Employees';
import RestaurantDetails from './pages/RestaurantDetails';
import DishDetails from './pages/DishDetails';
import Login from './pages/Login';
import AdminDash from './admin/AdminDash';
import ProtectedRoute from './pages/ProtectedRoute';
import Myorder from './users/Myorder';
import GotOrder from './admin/GotOrder'; // <-- Add this import
import Footer from './components/Footer';
import SearchRestaurants from './pages/SearchRestaurants';

export default function App() {
  return (
    <GoogleOAuthProvider clientId="281712678096-da4cpe5852t5uuah2gruad8v2ainml2t.apps.googleusercontent.com">
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Restaurants />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route
                path="/restaurant/:id"
                element={
                  <ProtectedRoute>
                    <RestaurantDetails />
                  </ProtectedRoute>
                }
              />
              <Route path="/dish/:dishId" element={<DishDetails />} />
              <Route path="/dish/:cafeId/:itemId" element={<DishDetails />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDash />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myorder"
                element={
                  <ProtectedRoute>
                    <Myorder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gotorder"
                element={
                  <ProtectedRoute role="admin">
                    <GotOrder />
                  </ProtectedRoute>
                }
              />
              <Route path="/search" element={<SearchRestaurants />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}
