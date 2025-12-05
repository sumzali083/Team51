// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./Layout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { MensPage } from "./pages/MensPage";
import { WomensPage } from "./pages/WomensPage";
import { KidsPage } from "./pages/KidsPage";
import { ProductPage } from "./ProductPage";
import { SearchPage } from "./pages/SearchPage";
import Contact from "./pages/Contact";
import LoginPage from "./pages/LoginPage";
import FeedbackPage from "./pages/FeedbackPage";

import { CartProvider } from "./context/CartContext";
import Cart from "./pages/cart";          // ✅ match filename
import CheckoutPage from "./pages/CheckoutPage";

export default function App() {
  console.log("DEBUG: App.jsx is rendering");
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Home */}
            <Route index element={<HomePage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* Categories */}
            <Route path="/mens" element={<MensPage />} />
            <Route path="/womens" element={<WomensPage />} />
            <Route path="/kids" element={<KidsPage />} />

            {/* Product + search */}
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* Static pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<FeedbackPage />} />

            {/* Cart / checkout */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* 🔁 Redirect /products to home */}
            <Route path="/products" element={<Navigate to="/" replace />} />

            {/* 🔁 Catch-all: any unknown path -> home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
