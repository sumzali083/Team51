import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  var cartContext = useContext(CartContext);
  var cart = cartContext.cart;

  // Calculate total items in the cart using a normal function
  var totalItems = cart.reduce(function(sum, item) {
    return sum + item.quantity;
  }, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">MyShop</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart {totalItems > 0 && <span className="badge bg-primary">{totalItems}</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
