// frontend/src/pages/CheckoutPage.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { Fallback } from "../data";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState("");
  const [deliveryType, setDeliveryType] = useState("SHIP");
  const [deliveryOption, setDeliveryOption] = useState("Home/Office");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phone: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const resolveImage = (item) => {
    const raw =
      item.image ||
      item.image_url ||
      (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : "") ||
      Fallback;

    if (/^https?:\/\//i.test(raw)) return raw;
    return raw.startsWith("/") ? raw : `/${raw}`;
  };

  // Calculate subtotal safely
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const shipping = cart.length > 0 ? 8 : 0;
  const total = subtotal + shipping;

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleDeliveryType(type) {
    setDeliveryType(type);
  }

  function handleDeliveryOption(e) {
    setDeliveryOption(e.target.value);
  }

  async function handlePayment(e) {
    e.preventDefault();

    if (!user?.id) {
      setCheckoutMsg("Please log in to complete checkout.");
      return;
    }

    if (!cart.length) {
      setCheckoutMsg("Your basket is empty.");
      return;
    }

    setIsSubmitting(true);
    setCheckoutMsg("");
    try {
      const res = await api.post("/api/orders/checkout", { userId: user.id });
      await clearCart();
      setCheckoutMsg(res.data?.message || "Order placed successfully.");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setCheckoutMsg(
        err?.response?.data?.message || "Checkout failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-wrapper">
        <div className="checkout-container">
          {/* LEFT SIDE */}
          <form className="checkout-left" onSubmit={handlePayment}>
            <h2 className="section-title">1. DELIVERY OPTIONS</h2>
            <div className="tab-row">
              <button
                type="button"
                className={`tab${deliveryType === "SHIP" ? " active" : ""}`}
                onClick={() => handleDeliveryType("SHIP")}
              >
                SHIP
              </button>
              <button
                type="button"
                className={`tab${deliveryType === "PICK UP" ? " active" : ""}`}
                onClick={() => handleDeliveryType("PICK UP")}
              >
                PICK UP
              </button>
            </div>
            <div className="radio-row">
              <label>
                <input
                  type="radio"
                  name="delivery"
                  value="Home/Office"
                  checked={deliveryOption === "Home/Office"}
                  onChange={handleDeliveryOption}
                />
                Home/Office
              </label>
              <label>
                <input
                  type="radio"
                  name="delivery"
                  value="APO/FPO"
                  checked={deliveryOption === "APO/FPO"}
                  onChange={handleDeliveryOption}
                />
                APO/FPO
              </label>
            </div>
            <div className="form-grid">
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleFormChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleFormChange}
                required
              />
              <input
                name="address"
                className="full"
                placeholder="Start typing the first line of your address"
                value={form.address}
                onChange={handleFormChange}
                required
              />
              <a href="#" className="manual-link">
                Enter address manually
              </a>
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleFormChange}
                required
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleFormChange}
                required
              />
            </div>
            <button className="continue-btn" type="submit">
              SAVE & CONTINUE
            </button>
            <h2 className="section-title">2. PAYMENT</h2>
            <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
              Demo checkout: no real payment is processed.
            </p>
            <div className="form-grid">
              <input
                name="cardName"
                className="full"
                placeholder="Cardholder Name"
                value={form.cardName}
                onChange={handleFormChange}
              />
              <input
                name="cardNumber"
                className="full"
                placeholder="Card Number"
                value={form.cardNumber}
                onChange={handleFormChange}
              />
              <input
                name="expiry"
                placeholder="Expiry (MM/YY)"
                value={form.expiry}
                onChange={handleFormChange}
              />
              <input
                name="cvv"
                placeholder="CVV"
                type="password"
                value={form.cvv}
                onChange={handleFormChange}
              />
            </div>
            {checkoutMsg && (
              <div className="mt-2" style={{ color: checkoutMsg.includes("success") || checkoutMsg.includes("placed") ? "green" : "#b00020" }}>
                {checkoutMsg}
              </div>
            )}
            <button className="continue-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "PROCESSING..." : "PAY NOW"}
            </button>
          </form>

          {/* RIGHT SIDE */}
          <div className="checkout-right">
            <h3 className="bag-title">IN YOUR BAG</h3>
            <div className="price-row">
              <span>Subtotal</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Estimated Shipping</span>
              <span>£{shipping.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>TOTAL</span>
              <span className="total-amount">£{total.toFixed(2)}</span>
            </div>

            {cart.length === 0 ? (
              <div className="product-box">
                <p>Your cart is empty.</p>
              </div>
            ) : (
              cart.map((item) => {
                const img = resolveImage(item);
                const priceNum = Number(item.price || 0);
                const qtyNum = Number(item.quantity || 0);
                const itemTotal = priceNum * qtyNum;

                return (
                  <div className="product-box" key={item.id}>
                    <p className="arrival-text">ARRIVES BY THU, JUN 24</p>
                    <div className="product-row">
                      <img
                        src={img}
                        alt={item.name}
                        className="product-img"
                        onError={(e) => {
                          e.currentTarget.src = Fallback;
                        }}
                      />
                      <div className="product-info">
                        <p className="product-name">{item.name}</p>
                        {item.size && (
                          <p className="product-meta">
                            Size: {item.size}
                          </p>
                        )}
                        {item.color && (
                          <p className="product-meta">
                            Color: {item.color}
                          </p>
                        )}
                        <p className="product-meta">
                          Price: £{priceNum.toFixed(2)}
                        </p>
                        <p className="product-meta">Qty: {qtyNum}</p>
                        <p className="product-meta fw-bold">
                          Item Total: £{itemTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
