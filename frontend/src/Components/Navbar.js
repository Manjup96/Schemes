import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
// import "../styles/Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="logo">Logo</div>
      <nav className={`nav ${isMobileMenuOpen ? "mobile-menu" : ""}`}>
        <ul>
          {/* <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li> */}
          <li><Link to="/saving-plan"> Saving Plans</Link></li>
        </ul>
      </nav>
      <div className="hamburger" onClick={toggleMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </header>
  );
};

export default Navbar;
