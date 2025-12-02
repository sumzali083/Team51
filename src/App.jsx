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
import { Registration } from "./components/Registration";

import { CartProvider } from "./context/CartContext";
import Cart from "./pages/cart";
import CheckoutPage from "./pages/CheckoutPage.jsx";


export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/mens" element={<MensPage />} />
            <Route path="/womens" element={<WomensPage />} />
            <Route path="/kids" element={<KidsPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<Registration />} />
            <Route path="/feedback" element={React.createElement(require('./pages/FeedbackPage.jsx').default)} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
