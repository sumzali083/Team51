import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const cartContext = useContext(CartContext);
  const { cart, removeFromCart, changeQuantity } = cartContext;
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-4">
      <h2>Your Basket</h2>

      {cart.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      width="50"
                      className="me-2"
                    />
                    {item.name}
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: "80px" }}
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        changeQuantity(
                          item.id,
                          parseInt(e.target.value, 10) || 1
                        )
                      }
                    />
                  </td>
                  <td>£{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h4>Total: £{total.toFixed(2)}</h4>
      {cart.length > 0 && (
        <button
          className="btn btn-success mt-3"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}
