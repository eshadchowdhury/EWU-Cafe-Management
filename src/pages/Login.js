import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [role, setRole] = useState('student');
  const [createError, setCreateError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleGoogleLogin = async (credentialResponse) => {
    console.log('Google credential response (raw):', credentialResponse);
    let userObject;
    try {
      userObject = jwtDecode(credentialResponse.credential);
      console.log('Decoded user object:', userObject);
    } catch (err) {
      console.error('Failed to decode credential token:', err);
      setCreateError('Invalid credential token');
      return;
    }

    // fetch users (allow env override so developer can use a local proxy)
    let users = [];
    try {
      const GET_USERS_URL = process.env.REACT_APP_GET_USERS_URL || 'https://oracleapex.com/ords/cse302/post/get';
      console.log('GET users URL:', GET_USERS_URL);
      const res = await fetch(GET_USERS_URL);
      console.log('GET users response status:', res.status);
      if (!res.ok) throw new Error(`GET users failed: ${res.status}`);
      const usersData = await res.json();
      users = usersData.items || [];
      console.log('fetched users count:', users.length);
    } catch (err) {
      console.error('Error fetching users list:', err);
      setCreateError(err.message || 'Failed to fetch users');
      // stop further processing (can't check exists)
      return;
    }

    // 2. check if user exists (by email)
    const exists = users.some(u => u.email === userObject.email);
    console.log('User exists in DB:', exists);

    if (!exists) {
      // 3. if user does not exist, create user via new API
      try {
        // Use env override for dev proxy: REACT_APP_POST_URL
        const POST_URL = process.env.REACT_APP_POST_URL || 'https://oracleapex.com/ords/cse302/post/post';
        const payload = {
          name: userObject.name,
          email: userObject.email,
          img_url: userObject.picture,
          user_role: role
        };
        console.log('POST URL:', POST_URL);
        console.log('POST payload:', payload);

        const resp = await fetch(POST_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        // try to read response text for debugging
        let respText = null;
        try { respText = await resp.text(); } catch (e) { /* ignore */ }
        console.log('POST response status:', resp.status);
        console.log('POST response text:', respText);

        if (!resp.ok) {
          const errMsg = `Create user failed with status ${resp.status}`;
          console.error(errMsg);
          setCreateError(errMsg);
        } else {
          setCreateError(null);
          console.log('User created successfully');
        }
      } catch (err) {
        console.error('Error creating user (network/CORS?):', err);
        if (err && err.name === 'TypeError' && String(err.message).toLowerCase().includes('failed to fetch')) {
          console.error('Likely a CORS or network error. Browser blocked the request.');
        }
        setCreateError(err.message || 'Network error');
      }
    }

    // 4. localStorage e user er information save kore rakhteci
    localStorage.setItem('user', JSON.stringify({
      email: userObject.email,
      name: userObject.name,
      picture_url: userObject.picture,
      role: role
    }));
    navigate(from, { replace: true });
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">EWU CAFE</h2>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{ marginBottom: 16, padding: 6, borderRadius: 4, width: '100%' }}
        >
          <option value="student">Student</option>
          <option value="cafe_staff">Cafe Staff</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.log('Login Failed');
          }}
        />
        {createError && (
          <div style={{color: '#b00020', marginTop: 8}}>Error creating account: {createError}</div>
        )}
        <div className="login-hint">
          You need to login/register to continue.
        </div>
      </div>
    </div>
  );
}
