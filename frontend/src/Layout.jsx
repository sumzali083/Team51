import React, { useContext, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import Chatbot from "./components/Chatbot";

export function Layout() {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = search.trim();
    if (!term) return;
    // Always navigate to the global search page with query param
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  // cart context — show total items in navbar
  const cartCtx = useContext(CartContext);
  const totalItems = cartCtx?.cart?.reduce((s, i) => s + (i.quantity || 0), 0) || 0;

  // Clear search when navigating away from search page
  React.useEffect(() => {
    if (!location.pathname.includes('/search')) {
      setSearch("");
    }
  }, [location.pathname]);

  return (
    <>
      <header id="main-header">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">
              <img 
                width="100" 
                src="/images/logo.png" 
                alt="OSAI Logo" 
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100x40/333/fff?text=OSAI";
                }}
              />
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    to="/"
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    id="nav-men" 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    to="/mens"
                  >
                    Mens
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    id="nav-women" 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    to="/womens"
                  >
                    Womens
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    id="nav-kids" 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    to="/kids"
                  >
                    Kids
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    to="/contact"
                  >
                    Contact
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    to="/about"
                  >
                    About Us
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    to="/feedback"
                  >
                    Send Us Feedback
                  </NavLink>
                </li>
              </ul>
              
              {/* NAV SEARCH */}
              <form 
                className="nav-search d-flex me-3" 
                onSubmit={handleSearchSubmit}
                role="search"
              >
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search products"
                />
                <button className="btn btn-outline-light ms-2" type="submit">
                  Search
                </button>
              </form>
              
              <div className="d-flex align-items-center gap-3">
                <NavLink 
                  to="/login" 
                  className="btn btn-outline-light"
                  aria-label="Login or profile"
                >
                  <i className="bi bi-person-circle me-1" /> Login / Profile
                </NavLink>
                
                <NavLink 
                  to="/cart" 
                  className="btn btn-outline-light position-relative"
                  aria-label="Shopping cart"
                >
                  <i className="bi bi-cart3" />
                  {totalItems > 0 && (
                    <span 
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: '0.65rem' }}
                    >
                      {totalItems}
                    </span>
                  )}
                </NavLink>
              </div>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="container my-5">
        <Outlet />
      </main>
      
      <footer className="bg-dark text-light mt-5 pt-4 pb-4 text-center">
        <div className="container">
          <h4>Contact Us</h4>
          <p>Bringing authentic and stylish clothing to your wardrobe.</p>
          <p>Find us at 134a Aston Road, Birmingham, United Kingdom</p>
          <p>
            Email:{" "}
            <a 
              className="text-warning text-decoration-none" 
              href="mailto:240365581@aston.ac.uk"
            >
              OSAI@aston.ac.uk
            </a>
          </p>
          <hr className="border-light mx-auto" style={{ width: '80%' }} />
          <p className="mb-0">
            &copy; {new Date().getFullYear()} OSAI Fashion. All Rights Reserved.
          </p>
        </div>
      </footer>
      
      <Chatbot />
    </>
  );
}