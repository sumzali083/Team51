import React from "react";
import "./CheckoutPage.css";
import osaiLogo from "../assets/OSAI.png";
import bagIcon from "../assets/bag.jpg";// <-- import logo HERE

const CheckoutPage = () => {
  return (
    <div>
    
      <div className="osai-header">
        <a href="/">
          <img src={osaiLogo} alt="OSAI Logo" className="osai-logo" />
        </a>
        <a href="/"><img src={bagIcon} alt="Bag" className="bag-icon" /></a>
      </div>

      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-wrapper">
        <div className="checkout-container">

          {/* LEFT SIDE */}
          <div className="checkout-left">
            <h2 className="section-title">1. DELIVERY OPTIONS</h2>

            <div className="tab-row">
              <button className="tab active">SHIP</button>
              <button className="tab">PICK UP</button>
            </div>

            <div className="radio-row">
              <label>
                <input type="radio" name="delivery" defaultChecked />
                Home/Office
              </label>
              <label>
                <input type="radio" name="delivery" />
                APO/FPO
              </label>
            </div>

            <div className="form-grid">
              <input placeholder="First Name" />
              <input placeholder="Last Name" />
              <input
                className="full"
                placeholder="Start typing the first line of your address"
              />
              <a href="#" className="manual-link">Enter address manually</a>
              <input placeholder="Email" />
              <input placeholder="Phone Number" />
            </div>

            <button className="continue-btn">SAVE & CONTINUE</button>

            <h2 className="section-title">2. PAYMENT</h2>

            <div className="form-grid">
              <input className="full" placeholder="Cardholder Name" />
              <input className="full" placeholder="Card Number" />
              <input placeholder="Expiry (MM/YY)" />
              <input placeholder="CVV" type="password" />
            </div>

            <button className="continue-btn">PAY NOW</button>
          </div>

          {/* RIGHT SIDE */}
          <div className="checkout-right">
            <h3 className="bag-title">IN YOUR BAG</h3>

            <div className="price-row">
              <span>Subtotal</span>
              <span>£120.00</span>
            </div>

            <div className="price-row">
              <span>Estimated Shipping</span>
              <span>£8.00</span>
            </div>

            <div className="total-row">
              <span>TOTAL</span>
              <span className="total-amount">£128.00</span>
            </div>

            <div className="product-box">
              <p className="arrival-text">ARRIVES BY THU, JUN 24</p>

              <div className="product-row">
                <img
                  src="dummy"
                  alt="clothing"
                  className="product-img"
                />

                <div className="product-info">
                  <p className="product-name">dummy name</p>
                  <p className="product-meta">Style</p>
                  <p className="product-meta">Size</p>
                  <p className="product-meta">Color</p>
                  <p className="product-meta">Qty: 1 ###</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default CheckoutPage;
