import { useContext, useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import { AuthContext } from "./context/AuthContext";
import { WishlistContext } from "./context/WishlistContext";
import Chatbot from "./components/Chatbot";

export function Layout() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

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
      <header className="osai-header" id="main-header">
        <nav className="osai-navbar">
          <div className="container-fluid osai-nav-inner">
            <NavLink className="navbar-brand osai-brand" to="/">
              <img src="/images/logo.png" alt="OSAI" />
            </NavLink>

            <button
              className="osai-hamburger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className={`osai-hamburger-icon${menuOpen ? " open" : ""}`} />
            </button>

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
                    className={({ isActive }) => `osai-link${isActive ? " active" : ""}`}
                    to={to}
                    end={end}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {menuOpen && (
              <ul className="osai-mobile-menu">
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
                      className={({ isActive }) => `osai-mobile-link${isActive ? " active" : ""}`}
                      to={to}
                      end={end}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}

            <div className="osai-nav-actions">
              <form className="osai-search" onSubmit={handleSearchSubmit}>
                <input
                  type="search"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search products"
                />
                <button type="submit" aria-label="Submit search">
                  <i className="bi bi-search" />
                </button>
              </form>

              {user ? (
                <div ref={profileRef} style={{ position: "relative" }}>
                  {/* Profile trigger button */}
                  <button
                    className="osai-action-btn"
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-label="Profile menu"
                    title="Profile"
                    style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <i className="bi bi-person-circle" style={{ fontSize: 18 }} />
                    <span style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.75)",
                      maxWidth: 80,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {user.name}
                    </span>
                    <i className="bi bi-chevron-down" style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", transition: "transform 0.2s", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </button>

                  {/* Dropdown panel */}
                  {profileOpen && (
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      minWidth: 200,
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      zIndex: 1000,
                      overflow: "hidden",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    }}>
                      {/* Header */}
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{user.email || (user.is_admin ? "Administrator" : "Member")}</div>
                      </div>

                      {/* Menu items */}
                      <div style={{ padding: "6px 0" }}>
                        {user.is_admin && (
                          <NavLink
                            to="/admin"
                            style={dropdownItemStyle}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            <i className="bi bi-speedometer2" style={dropdownIconStyle} />
                            Admin Dashboard
                          </NavLink>
                        )}
                        <NavLink
                          to="/orders"
                          style={dropdownItemStyle}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <i className="bi bi-receipt" style={dropdownIconStyle} />
                          My Orders
                        </NavLink>
                        <NavLink
                          to="/refunds"
                          style={dropdownItemStyle}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <i className="bi bi-arrow-counterclockwise" style={dropdownIconStyle} />
                          Refund Requests
                        </NavLink>
                        <NavLink
                          to="/account/change-password"
                          style={dropdownItemStyle}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <i className="bi bi-key" style={dropdownIconStyle} />
                          Change Password
                        </NavLink>

                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "6px 0" }} />

                        <button
                          onClick={handleLogout}
                          style={{ ...dropdownItemStyle, background: "transparent", border: "none", cursor: "pointer", width: "100%", textAlign: "left", color: "#f87171" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <i className="bi bi-box-arrow-right" style={{ ...dropdownIconStyle, color: "#f87171" }} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink to="/login" className="osai-action-btn">
                  <i className="bi bi-person" />
                  <span className="d-none d-xl-inline">Login</span>
                </NavLink>
              )}

              <NavLink
                to="/wishlist"
                className="osai-action-btn"
                aria-label={`Wishlist (${totalFav} items)`}
              >
                <i className="bi bi-heart" />
                {totalFav > 0 && <span className="osai-badge">{totalFav}</span>}
              </NavLink>

              <NavLink
                to="/cart"
                className="osai-action-btn"
                aria-label={`Cart (${totalItems} items)`}
              >
                <i className="bi bi-bag" />
                {totalItems > 0 && <span className="osai-badge">{totalItems}</span>}
              </NavLink>
            </div>
          </div>
        </nav>
      </header>

      <main aria-live="polite">
        <Outlet />
      </main>

      <footer className="osai-footer">
        <div className="osai-footer-inner">
          <div className="osai-footer-brand">
            <img src="/images/logo.png" alt="OSAI" />
            <p>
              Bringing authentic and stylish clothing to your wardrobe.
              Pure fashion crafted from the finest materials.
            </p>
          </div>

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

      <Chatbot />
    </>
  );
}

const dropdownItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "9px 16px",
  fontSize: 13,
  color: "#ccc",
  textDecoration: "none",
  background: "transparent",
  transition: "background 0.15s",
};

const dropdownIconStyle = {
  fontSize: 14,
  color: "#888",
  width: 16,
  textAlign: "center",
};
