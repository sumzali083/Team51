// frontend/src/pages/Cart.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const cartContext = useContext(CartContext);
  const navigate = useNavigate();

  // Handle case where context might be undefined
  if (!cartContext) {
    return <div className="container mt-4">Loading cart...</div>;
  }

  const { cart, removeFromCart, changeQuantity } = cartContext;

  // Ensure we always use numbers for price/quantity
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  // Helper function to handle image URL
  const getImageUrl = (item) => {
    if (item.image) return item.image;
    if (item.image_url) return item.image_url;
    if (item.images && item.images.length > 0) return item.images[0];
    return "/placeholder.jpg"; // Fallback image
  };

  // Helper to safely parse quantity
  const handleQuantityChange = (id, value) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue >= 1) {
      changeQuantity(id, parsedValue);
    } else {
      changeQuantity(id, 1); // Reset to minimum
    }
  };

  return (
    <div className="container mt-4">
      <h2>Your Basket</h2>

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <p>Your basket is empty.</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const img = getImageUrl(item);
                  const priceNum = Number(item.price || 0);
                  const qtyNum = Number(item.quantity || 0);
                  const lineTotal = priceNum * qtyNum;

                  return (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={img}
                          alt={item.name}
                          width="50"
                          height="50"
                          className="me-2 object-fit-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                            e.target.onerror = null;
                          }}
                        />
                        <div className="d-inline-block">
                          <div>{item.name}</div>
                          <div>
                            {item.size && (
                              <small className="text-muted d-block">
                                Size: {item.size}
                              </small>
                            )}
                            {item.color && (
                              <small className="text-muted d-block">
                                Color: {item.color}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>£{priceNum.toFixed(2)}</td>

                      <td>
                        <input
                          type="number"
                          className="form-control"
                          style={{ width: "80px" }}
                          value={qtyNum}
                          min="1"
                          max="99"
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                        />
                      </td>

                      <td>£{lineTotal.toFixed(2)}</td>

                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4 className="mb-0">Total: £{total.toFixed(2)}</h4>
            <div>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </button>
              <button
                className="btn btn-success"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}