// src/ProductPage.jsx
import React, { useContext } from "react";
import { CartContext } from "./context/CartContext";
import { products } from "./data/products";

const getImageSrc = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return url.startsWith("/") ? url : `/${url}`;
};

export function ProductPage() {
  const cartContext = useContext(CartContext);
  const addToCart = cartContext.addToCart;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Our Products</h2>
      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <img
                src={getImageSrc(product.image)}
                className="card-img-top"
                alt={product.name}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text fw-bold">
                  £{product.price.toFixed(2)}
                </p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => addToCart(product)}
                >
                  Add to Basket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// optional default
export default ProductPage;
