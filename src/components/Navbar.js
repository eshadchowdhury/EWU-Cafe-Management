import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar () {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload(); // Ensures navbar updates immediately
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      // amra ?q use kori to pass the  query parameter  to url
      // q hocche query parameter er name
      // encodeURIComponent to handle special characters in search  
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src="https://images.seeklogo.com/logo-png/35/1/east-west-university-ewu-logo-png_seeklogo-350606.png"
              alt="EWU Cafe Logo"
              style={{ height: 36, marginRight: 8, borderRadius: 6 }}
            />
            EWU CAFE
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              {user && user.role === 'admin' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Dashboard</Link>
                </li>
              )}
              {user && user.email && (
                <li className="nav-item">
                  <Link className="nav-link" to="/myorder">My Order</Link>
                </li>
              )}
            </ul>
            {/* Searchbar only, no results or API */}
            <form className="d-flex me-3" role="search" onSubmit={handleSearch}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search dishes or restaurants"
                aria-label="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ minWidth: 180 }}
              />
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
            <div className="ms-auto">
              {user && user.email ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {user.picture_url ? (
                    <img
                      src={user.picture_url}
                      alt="profile"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        background: '#eee',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#eee', display: 'inline-block' }} />
                  )}
                  <span style={{ fontWeight: 500, color: '#333', fontSize: '1rem' }}>
                    {user.name || user.given_name || user.email || 'Profile'}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      border: 'none',
                      background: '#dc3545',
                      color: '#fff',
                      borderRadius: '4px',
                      padding: '4px 12px',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link className="nav-link" to="/login">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
