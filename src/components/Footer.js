import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-main">
      <div className="footer-content">
        <div className="footer-logo">
          <img
            src="https://images.seeklogo.com/logo-png/35/1/east-west-university-ewu-logo-png_seeklogo-350606.png"
            alt="Hotel_M Logo"
            style={{ height: 38, borderRadius: 8, background: '#fff', padding: 2 }}
          />
          <span>EWU Cafe</span>
        </div>
        <div className="footer-links">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="mailto:support@hotel_m.com">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} EWU Cafe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
