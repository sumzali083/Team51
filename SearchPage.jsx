import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PRODUCTS } from "../data";

const PER_PAGE = 8;

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const filtered = PRODUCTS.filter((p) =>
    !q ? true : p.name.toLowerCase().includes(q.toLowerCase()) || (p.desc && p.desc.toLowerCase().includes(q.toLowerCase()))
  );

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * PER_PAGE;
  const slice = filtered.slice(start, start + PER_PAGE);

  const goPage = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  return (
    <>
      <h2>Search results</h2>

      <div className="controls">
        <span id="count" className="chip">
          {total} result{total !== 1 ? "s" : ""} for "{q}"
        </span>
      </div>

      <section id="grid" className="grid mt-3" role="list" aria-label={`Search results`}>
        {slice.map((p) => (
          <article key={p.id} className="card" role="listitem">
            <Link to={`/product/${encodeURIComponent(p.id)}`} aria-label={p.name}>
              <div className="thumb">
                <img src={p.images[0]} alt={p.name} />
              </div>
              <div className="body">
                <div className="title">{p.name}</div>
                <div className="meta">
                  <span className="price">£{p.price.toFixed(2)}</span>
                  {p.tag && <span className="badge">{p.tag}</span>}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <nav className="pagination" role="navigation" aria-label="Pagination">
        <button className="btn" onClick={() => goPage(safePage - 1)} disabled={safePage <= 1}>
          Prev
        </button>
        <span className="chip" id="pageStat">
          Page {safePage} of {pages}
        </span>
        <button className="btn" onClick={() => goPage(safePage + 1)} disabled={safePage >= pages}>
          Next
        </button>
      </nav>
    </>
  );
}
