import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MilestoneMate</Link>
      </div>
    </nav>
  );
}

export default NavBar;
