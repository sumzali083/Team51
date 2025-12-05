// frontend/src/pages/CheckoutPage.jsx
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const cartContext = useContext(CartContext);
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
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  // Handle missing context
  if (!cartContext) {
    return <div className="container mt-4">Loading checkout...</div>;
  }

  const { cart } = cartContext;

  // Calculate subtotal safely
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const shipping = cart.length > 0 ? 8 : 0;
  const total = subtotal + shipping;

  // Calculate estimated delivery date
  useEffect(() => {
    const today = new Date();
    let deliveryDays = 5; // Default shipping time
    if (deliveryType === "PICK UP") deliveryDays = 1;
    if (deliveryOption === "APO/FPO") deliveryDays = 14;
    
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);
    
    // Format as "THU, JUN 24"
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = deliveryDate.toLocaleDateString('en-US', options).toUpperCase();
    setEstimatedDelivery(formattedDate);
  }, [deliveryType, deliveryOption]);

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleDeliveryType(type) {
    setDeliveryType(type);
  }

  function handleDeliveryOption(e) {
    setDeliveryOption(e.target.value);
  }

  function handlePayment(e) {
    e.preventDefault();
    
    // Basic validation
    if (form.cardNumber.replace(/\s/g, '').length < 16) {
      alert("Please enter a valid 16-digit card number");
      return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      alert("Please enter expiry date in MM/YY format");
      return;
    }
    
    if (form.cvv.length < 3) {
      alert("Please enter a valid CVV");
      return;
    }
    
    alert("Payment processed! Thank you for your order.");
  }

  // Helper function to get image URL
  const getImageUrl = (item) => {
    if (item.image_url) return item.image_url;
    if (item.image) return item.image;
    if (item.images && item.images.length > 0) return item.images[0];
    return "/placeholder.jpg";
  };

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
                placeholder="First Name *"
                value={form.firstName}
                onChange={handleFormChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name *"
                value={form.lastName}
                onChange={handleFormChange}
                required
              />
              <input
                name="address"
                className="full"
                placeholder="Start typing the first line of your address *"
                value={form.address}
                onChange={handleFormChange}
                required
              />
              <button type="button" className="manual-link">
                Enter address manually
              </button>
              <input
                name="email"
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleFormChange}
                required
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={handleFormChange}
                required
              />
            </div>
            <h2 className="section-title">2. PAYMENT</h2>
            <div className="form-grid">
              <input
                name="cardName"
                className="full"
                placeholder="Cardholder Name *"
                value={form.cardName}
                onChange={handleFormChange}
                required
              />
              <input
                name="cardNumber"
                className="full"
                placeholder="Card Number (16 digits) *"
                value={form.cardNumber}
                onChange={handleFormChange}
                pattern="[0-9\s]{16,19}"
                required
              />
              <input
                name="expiry"
                placeholder="Expiry (MM/YY) *"
                value={form.expiry}
                onChange={handleFormChange}
                pattern="(0[1-9]|1[0-2])\/\d{2}"
                required
              />
              <input
                name="cvv"
                placeholder="CVV *"
                type="password"
                value={form.cvv}
                onChange={handleFormChange}
                pattern="\d{3,4}"
                required
              />
            </div>
            <button className="continue-btn" type="submit">
              PAY NOW - £{total.toFixed(2)}
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
              <span>{shipping === 0 ? "FREE" : `£${shipping.toFixed(2)}`}</span>
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
                const priceNum = Number(item.price || 0);
                const qtyNum = Number(item.quantity || 0);
                const itemTotal = priceNum * qtyNum;
                const img = getImageUrl(item);

                return (
                  <div className="product-box" key={item.id}>
                    <p className="arrival-text">
                      {estimatedDelivery ? `ARRIVES BY ${estimatedDelivery}` : "CALCULATING DELIVERY..."}
                    </p>
                    <div className="product-row">
                      <img
                        src={img}
                        alt={item.name}
                        className="product-img"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                          e.target.onerror = null;
                        }}
                      />
                      <div className="product-info">
                        <p className="product-name">{item.name}</p>
                        <p className="product-meta">
                          Price: £{priceNum.toFixed(2)}
                        </p>
                        <p className="product-meta">Qty: {qtyNum}</p>
                        {item.size && (
                          <p className="product-meta">Size: {item.size}</p>
                        )}
                        {item.color && (
                          <p className="product-meta">Color: {item.color}</p>
                        )}
                        <p className="product-meta fw-bold">
                          Item Total: £{itemTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            
            {/* Add some trust indicators */}
            <div className="trust-indicators">
              <p>✓ Secure checkout</p>
              <p>✓ 30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;