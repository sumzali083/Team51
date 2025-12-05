// frontend/src/pages/cart.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return <div className="container mt-4">Loading cart...</div>;
  }

  const { cart, removeFromCart, changeQuantity } = cartContext;

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const getImageUrl = (item) => {
    if (item.image) return item.image;
    if (item.image_url) return item.image_url;
    if (item.images && item.images.length > 0) return item.images[0];
    return "/placeholder.jpg";
  };

  const handleQuantityChange = (id, value) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue >= 1) {
      changeQuantity(id, parsedValue);
    } else {
      changeQuantity(id, 1);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Your Basket</h2>

      {cart.length === 0 ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "250px" }}
        >
          <h4>Your basket is empty.</h4>
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
            <button
              className="btn btn-success"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
