import React, { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import { WishlistContext } from "./context/WishlistContext";

export function Layout() {
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = search.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const cartCtx = useContext(CartContext);
  const totalItems = cartCtx?.cart?.reduce((s, i) => s + (i.quantity || 0), 0) || 0;

  const wishlistCtx = useContext(WishlistContext);
  const totalFav = wishlistCtx?.wishlist?.length || 0;

  return (
    <>
      {/* ── HEADER ── */}
      <header className="osai-header" id="main-header">
        <nav className="osai-navbar">
          <div className="container-fluid osai-nav-inner">

            {/* Logo */}
            <NavLink className="navbar-brand osai-brand" to="/">
              <img src="/images/logo.png" alt="OSAI" />
            </NavLink>

            {/* Centered nav links */}
            <ul className="osai-nav-links">
              {[
                { to: "/", label: "Home", end: true },
                { to: "/mens", label: "Mens" },
                { to: "/womens", label: "Womens" },
                { to: "/kids", label: "Kids" },
                { to: "/newarrivals", label: "New Arrivals" },
                { to: "/sale", label: "Sale" },
                { to: "/contact", label: "Contact" },
                { to: "/about", label: "About" },
              ].map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    className={({ isActive }) =>
                      `osai-link${isActive ? " active" : ""}`
                    }
                    to={to}
                    end={end}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right-side actions */}
            <div className="osai-nav-actions">
              {/* Search */}
              <form className="osai-search" onSubmit={handleSearchSubmit}>
                <input
                  type="search"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search products"
                />
                <button type="submit" aria-label="Submit search">
                  <i className="bi bi-search" />
                </button>
              </form>

              {/* Login */}
              <NavLink to="/login" className="osai-action-btn">
                <i className="bi bi-person" />
                <span className="d-none d-xl-inline">Login</span>
              </NavLink>

              {/* Wishlist */}
              <NavLink
                to="/wishlist"
                className="osai-action-btn"
                aria-label={`Wishlist (${totalFav} items)`}
              >
                <i className="bi bi-heart" />
                {totalFav > 0 && (
                  <span className="osai-badge">{totalFav}</span>
                )}
              </NavLink>

              {/* Cart */}
              <NavLink
                to="/cart"
                className="osai-action-btn"
                aria-label={`Cart (${totalItems} items)`}
              >
                <i className="bi bi-bag" />
                {totalItems > 0 && (
                  <span className="osai-badge">{totalItems}</span>
                )}
              </NavLink>
            </div>
          </div>
        </nav>
      </header>

      {/* ── MAIN ── */}
      <main aria-live="polite">
        <Outlet />
      </main>

      {/* ── FOOTER ── */}
      <footer className="osai-footer">
        <div className="osai-footer-inner">
          {/* Brand column */}
          <div className="osai-footer-brand">
            <img src="/images/logo.png" alt="OSAI" />
            <p>
              Bringing authentic and stylish clothing to your wardrobe.
              Pure fashion crafted from the finest materials.
            </p>
          </div>

          {/* Shop links */}
          <div className="osai-footer-col">
            <h5>Shop</h5>
            <ul>
              <li><NavLink to="/mens">Mens</NavLink></li>
              <li><NavLink to="/womens">Womens</NavLink></li>
              <li><NavLink to="/kids">Kids</NavLink></li>
              <li><NavLink to="/newarrivals">New Arrivals</NavLink></li>
              <li><NavLink to="/sale">Sale</NavLink></li>
            </ul>
          </div>

          {/* Info links */}
          <div className="osai-footer-col">
            <h5>Info</h5>
            <ul>
              <li><NavLink to="/about">About Us</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
              <li><NavLink to="/feedback">Feedback</NavLink></li>
              <li>
                <a href="mailto:OSAI@aston.ac.uk">OSAI@aston.ac.uk</a>
              </li>
              <li>134a Aston Road, Birmingham, UK</li>
            </ul>
          </div>
        </div>

        <div className="osai-footer-bottom">
          <span>&copy; {new Date().getFullYear()} OSAI Fashion. All rights reserved.</span>
          <span>Birmingham, United Kingdom</span>
        </div>
      </footer>
    </>
  );
}
