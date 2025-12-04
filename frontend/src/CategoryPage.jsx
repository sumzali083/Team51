import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "./context/CartContext"; // ⬅ note the "./"
import api from "./api";                              // ⬅ and "./api"

export function CategoryPage({ cat, pageTitle }) {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        // We use pageTitle (Mens / Womens / Kids) to match the DB category name
        const res = await api.get("/api/products", {
          params: { category: pageTitle },
        });

        if (!cancelled) {
          setProducts(res.data || []);
        }
      } catch (err) {
        console.error("Error loading category products:", err);
        if (!cancelled) {
          setError("Failed to load products");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [pageTitle]);

  if (loading) {
    return <div className="container mt-5">Loading products…</div>;
  }

  if (error) {
    return (
      <div className="container mt-5 text-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{pageTitle}</h2>

      <div className="row g-4">
        {products.map((product) => {
          const img = product.image || product.image_url;
          const price = Number(product.price || 0);

          return (
            <div key={product.id} className="col-md-4">
              <div className="card h-100 shadow-sm">
                {img && (
                  <img
                    src={img}
                    className="card-img-top"
                    alt={product.name}
                  />
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text fw-bold">
                    £{price.toFixed(2)}
                  </p>
                  <button
                    className="btn btn-dark mt-auto"
                    onClick={() => addToCart(product)}
                  >
                    Add to Basket
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {!products.length && (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
}
