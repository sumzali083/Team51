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
    city: "",
    postalCode: "",
    email: "",
    phone: "",
  });
  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  // Handle missing context
  if (!cartContext) {
    return <div className="container mt-4">Loading checkout...</div>;
  }

  const { cart } = cartContext;

  // Calculate totals safely
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const shipping = cart.length > 0 ? 8.00 : 0;
  const total = subtotal + shipping;

  // Calculate estimated delivery date
  useEffect(() => {
    const calculateDeliveryDate = () => {
      const today = new Date();
      let deliveryDays = 5; // Default shipping time
      if (deliveryType === "PICK UP") deliveryDays = 1;
      if (deliveryOption === "APO/FPO") deliveryDays = 14;
      
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + deliveryDays);
      
      // Format date
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return deliveryDate.toLocaleDateString('en-US', options);
    };
    
    setEstimatedDelivery(calculateDeliveryDate());
  }, [deliveryType, deliveryOption]);

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePaymentChange(e) {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  }

  function handleDeliveryType(type) {
    setDeliveryType(type);
    // Reset delivery option if switching to PICK UP
    if (type === "PICK UP") {
      setDeliveryOption("Store Pickup");
    }
  }

  function handleDeliveryOption(e) {
    setDeliveryOption(e.target.value);
  }

  // Validate card number format
  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s+/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  // Validate expiry date format
  const validateExpiry = (expiry) => {
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
  };

  function handleSubmit(e) {
    e.preventDefault();
    
    // Form validation
    if (!validateCardNumber(payment.cardNumber)) {
      alert("Please enter a valid 16-digit card number");
      return;
    }
    
    if (!validateExpiry(payment.expiry)) {
      alert("Please enter expiry date in MM/YY format");
      return;
    }
    
    if (payment.cvv.length < 3) {
      alert("Please enter a valid CVV");
      return;
    }
    
    // Here you would typically make an API call
    alert("Payment processed! Thank you for your order.");
    
    // In a real app, you would:
    // 1. Clear the cart
    // 2. Redirect to confirmation page
    // 3. Send order to backend
  }

  // Helper function to get image URL
  const getImageUrl = (item) => {
    if (item.image_url) return item.image_url;
    if (item.image) return item.image;
    if (item.images && item.images.length > 0) return item.images[0];
    return "/placeholder.jpg";
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-wrapper">
        <form className="checkout-container" onSubmit={handleSubmit}>
          {/* LEFT SIDE */}
          <div className="checkout-left">
            <h2 className="section-title">
              <span className="step-number">1</span> DELIVERY OPTIONS
            </h2>
            
            <div className="tab-row">
              <button
                type="button"
                className={`tab${deliveryType === "SHIP" ? " active" : ""}`}
                onClick={() => handleDeliveryType("SHIP")}
                aria-pressed={deliveryType === "SHIP"}
              >
                SHIP
              </button>
              <button
                type="button"
                className={`tab${deliveryType === "PICK UP" ? " active" : ""}`}
                onClick={() => handleDeliveryType("PICK UP")}
                aria-pressed={deliveryType === "PICK UP"}
              >
                PICK UP
              </button>
            </div>
            
            {deliveryType === "SHIP" ? (
              <div className="radio-row">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="delivery"
                    value="Home/Office"
                    checked={deliveryOption === "Home/Office"}
                    onChange={handleDeliveryOption}
                  />
                  <span>Home/Office Delivery</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="delivery"
                    value="APO/FPO"
                    checked={deliveryOption === "APO/FPO"}
                    onChange={handleDeliveryOption}
                  />
                  <span>APO/FPO Military</span>
                </label>
              </div>
            ) : (
              <div className="radio-row">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="delivery"
                    value="Store Pickup"
                    checked={deliveryOption === "Store Pickup"}
                    onChange={handleDeliveryOption}
                  />
                  <span>Store Pickup</span>
                </label>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group full">
                <label htmlFor="address">Address *</label>
                <input
                  id="address"
                  name="address"
                  placeholder="Start typing the first line of your address"
                  value={form.address}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <button
                type="button"
                className="manual-link"
                onClick={() => setShowManualAddress(!showManualAddress)}
              >
                {showManualAddress ? "Hide manual entry" : "Enter address manually"}
              </button>

              {showManualAddress && (
                <>
                  <div className="form-group full">
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      name="city"
                      placeholder="City"
                      value={form.city}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code *</label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={form.postalCode}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group full">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group full">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <h2 className="section-title">
              <span className="step-number">2</span> PAYMENT
            </h2>
            
            <div className="form-grid">
              <div className="form-group full">
                <label htmlFor="cardName">Cardholder Name *</label>
                <input
                  id="cardName"
                  name="cardName"
                  placeholder="Cardholder Name"
                  value={payment.cardName}
                  onChange={handlePaymentChange}
                  required
                />
              </div>

              <div className="form-group full">
                <label htmlFor="cardNumber">Card Number *</label>
                <input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={payment.cardNumber}
                  onChange={handlePaymentChange}
                  pattern="[0-9\s]{16,19}"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="expiry">Expiry (MM/YY) *</label>
                <input
                  id="expiry"
                  name="expiry"
                  placeholder="MM/YY"
                  value={payment.expiry}
                  onChange={handlePaymentChange}
                  pattern="(0[1-9]|1[0-2])\/\d{2}"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV *</label>
                <input
                  id="cvv"
                  name="cvv"
                  placeholder="CVV"
                  type="password"
                  value={payment.cvv}
                  onChange={handlePaymentChange}
                  pattern="\d{3,4}"
                  required
                />
              </div>
            </div>

            <button className="continue-btn" type="submit">
              PAY NOW - £{total.toFixed(2)}
            </button>
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div className="checkout-right">
            <h3 className="bag-title">ORDER SUMMARY</h3>
            
            <div className="summary-section">
              <div className="price-row">
                <span>Subtotal ({cart.length} items)</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `£${shipping.toFixed(2)}`}</span>
              </div>
              <div className="total-row">
                <span>TOTAL</span>
                <span className="total-amount">£{total.toFixed(2)}</span>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <div className="cart-items-section">
                <h4 className="items-title">Items in your bag</h4>
                {cart.map((item) => {
                  const priceNum = Number(item.price || 0);
                  const qtyNum = Number(item.quantity || 0);
                  const itemTotal = priceNum * qtyNum;
                  const img = getImageUrl(item);

                  return (
                    <div className="product-box" key={item.id}>
                      <p className="arrival-text">
                        ESTIMATED ARRIVAL: {estimatedDelivery}
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
                          {item.size && (
                            <p className="product-meta">Size: {item.size}</p>
                          )}
                          {item.color && (
                            <p className="product-meta">Color: {item.color}</p>
                          )}
                          <p className="product-meta">Price: £{priceNum.toFixed(2)}</p>
                          <p className="product-meta">Quantity: {qtyNum}</p>
                          <p className="product-total">
                            Item Total: £{itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="secure-checkout">
              <p>✓ Secure checkout</p>
              <p>✓ 30-day return policy</p>
              <p>✓ Customer support available</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;